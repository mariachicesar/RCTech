"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useBusinessByWebsiteId } from "@/hooks/useBusinessByWebsiteId";
import React, { useEffect, useState } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import { GoogleBusinessProfileView } from "../../../../components/google-business/GoogleBusinessProfileView";
import { CreatePostModal } from "../../../../components/google-business/CreatePostModal";
import { createGoogleBusinessPost, formatPostForAPI } from "../../../../utils/googleApi";

interface OAuthStatus {
    type: 'success' | 'error';
    message: string;
}

interface GmbLocation {
    locationId: string;
    name: string;
    title: string;
    address: string;
    accountId: string;
}

import type { Post } from "@/types/googleBusiness";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export default function GoogleBusinessPage() {
    const { selectedClient } = useSidebar();
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [locations, setLocations] = useState<GmbLocation[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [linkingLocation, setLinkingLocation] = useState(false);
    const [apiBlocked, setApiBlocked] = useState(false);
    const [manualLocationId, setManualLocationId] = useState('');
    const [manualAccountId, setManualAccountId] = useState('');
    // null = checking, false = not connected, true = connected
    const [agencyConnected, setAgencyConnected] = useState<boolean | null>(null);
    const [agencyConnecting, setAgencyConnecting] = useState(false);
    // After OAuth callback, auto-open location picker once page loads
    const [pendingLocationPick, setPendingLocationPick] = useState(false);

    const { business, error, isLoading, mutate } = useBusinessByWebsiteId(
        selectedClient?.website_id
    );

    // Check agency token status on mount + handle OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const errorParam = urlParams.get('error');

        if (success === 'connected') {
            window.history.replaceState({}, document.title, window.location.pathname);
            setOauthStatus({ type: 'success', message: 'RC Tech Google account connected!' });
            setPendingLocationPick(true);
        } else if (errorParam) {
            setOauthStatus({ type: 'error', message: `OAuth error: ${errorParam}` });
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check if agency is already connected
        fetch(`${API_URL}/agency-google-token`)
            .then(r => r.json())
            .then(d => setAgencyConnected(d.connected === true))
            .catch(() => setAgencyConnected(false));
    }, []);

    // After OAuth + page settled: auto-open location picker if a client is selected
    useEffect(() => {
        if (pendingLocationPick && agencyConnected && !isLoading) {
            setPendingLocationPick(false);
            if (business?.id) {
                openLocationPicker();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingLocationPick, agencyConnected, isLoading, business?.id]);

    const connectAgencyGoogle = async () => {
        setAgencyConnecting(true);
        try {
            const res = await fetch('/api/auth/google/connect', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to initiate OAuth');
            const { authUrl } = await res.json();
            window.location.href = authUrl;
        } catch {
            setOauthStatus({ type: 'error', message: 'Failed to start Google sign-in. Please try again.' });
            setAgencyConnecting(false);
        }
    };

    const openLocationPicker = async () => {
        setLoadingLocations(true);
        setShowLocationPicker(true);
        setApiBlocked(false);
        setLocations([]);
        try {
            const res = await fetch(`${API_URL}/google/locations`);
            const data = await res.json();
            if (res.status === 429 || res.status === 403) {
                setApiBlocked(true);
                return;
            }
            if (res.status === 401 && data.code === 'NO_AGENCY_TOKEN') {
                setAgencyConnected(false);
                setShowLocationPicker(false);
                setOauthStatus({ type: 'error', message: 'RC Tech Google account is not connected. Please connect it first.' });
                return;
            }
            if (!res.ok) {
                setOauthStatus({ type: 'error', message: data.error || 'Failed to fetch locations' });
                setShowLocationPicker(false);
                return;
            }
            setLocations(data.locations ?? []);
        } catch {
            setOauthStatus({ type: 'error', message: 'Failed to fetch Google Business locations' });
            setShowLocationPicker(false);
        } finally {
            setLoadingLocations(false);
        }
    };

    const handleLinkLocation = async (location: GmbLocation) => {
        if (!business?.id) return;
        setLinkingLocation(true);
        try {
            const res = await fetch(`${API_URL}/business-listings/${business.id}/gmb`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gmb_Id: location.locationId }),
            });
            if (!res.ok) throw new Error('Failed to link location');
            setShowLocationPicker(false);
            setOauthStatus({ type: 'success', message: `Linked to "${location.title}" successfully!` });
            mutate?.();
        } catch {
            setOauthStatus({ type: 'error', message: 'Failed to link the selected location. Please try again.' });
        } finally {
            setLinkingLocation(false);
        }
    };

    const handleManualLink = async () => {
        if (!manualLocationId.trim() || !business?.id) return;
        setLinkingLocation(true);
        try {
            const res = await fetch(`${API_URL}/business-listings/${business.id}/gmb`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gmb_Id: manualLocationId.trim() }),
            });
            if (!res.ok) throw new Error('Failed to link location');
            // If account ID provided, update the agency token record
            if (manualAccountId.trim()) {
                await fetch(`${API_URL}/agency-google-token`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ googleAccountId: manualAccountId.trim() }),
                }).catch(() => {/* non-critical */});
            }
            setShowLocationPicker(false);
            setOauthStatus({ type: 'success', message: 'Location linked successfully!' });
            setManualLocationId('');
            setManualAccountId('');
            mutate?.();
        } catch {
            setOauthStatus({ type: 'error', message: 'Failed to link location. Please check the ID and try again.' });
        } finally {
            setLinkingLocation(false);
        }
    };

    const handleCreatePost = async (postData: Post[]) => {
        try {
            const validPosts = postData.filter(post => post.summary?.trim());
            if (validPosts.length === 0) {
                alert('Please add content to at least one post');
                return;
            }
            const results = await Promise.allSettled(
                validPosts.map(async (post) => {
                    if (!business?.gmb_Id) throw new Error("Google Business location ID is missing.");
                    return await createGoogleBusinessPost(business.gmb_Id, formatPostForAPI(post), business.id);
                })
            );
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            if (successful > 0) setOauthStatus({ type: 'success', message: `Successfully created ${successful} post(s)!` });
            if (failed > 0) setOauthStatus({ type: 'error', message: `Failed to create ${failed} post(s).` });
            setShowCreatePostModal(false);
        } catch {
            setOauthStatus({ type: 'error', message: 'Error creating posts. Please try again.' });
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Google Business Profile" />

            {/* ── Agency Connection Banner ─────────────────────────── */}
            {agencyConnected === false && (
                <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                            RC Tech Google account not connected
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                            Connect <strong>rctechconsulting1@gmail.com</strong> once — it will manage all client GMB locations.
                        </p>
                    </div>
                    <button
                        onClick={connectAgencyGoogle}
                        disabled={agencyConnecting}
                        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {agencyConnecting ? 'Redirecting…' : 'Connect Google Account'}
                    </button>
                </div>
            )}

            <div className="min-h-[60vh] rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                {/* No client selected */}
                {!selectedClient && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <h3 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                                No Client Selected
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select a client from the sidebar to manage their Google Business Profile.
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {selectedClient && isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                            <p className="text-sm text-gray-500">Loading business data…</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {selectedClient && !isLoading && error && (
                    <div className="text-center">
                        <h3 className="mb-2 font-semibold text-red-600 text-theme-xl sm:text-2xl">Error Loading Business Data</h3>
                        <p className="text-sm text-gray-500">{error.message}</p>
                    </div>
                )}

                {/* Client loaded — show profile or link CTA */}
                {selectedClient && !isLoading && !error && (
                    <>
                        {business?.gmb_Id ? (
                            <GoogleBusinessProfileView
                                business={business}
                                onCreatePost={() => setShowCreatePostModal(true)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 text-5xl">📍</div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                                    No GMB Location Linked
                                </h3>
                                <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                                    Link a Google Business Profile location to <strong>{selectedClient.name}</strong>.
                                </p>
                                {!business?.id ? (
                                    <p className="text-sm text-amber-600">
                                        No business listing found for this client. Create one first.
                                    </p>
                                ) : (
                                    <button
                                        onClick={openLocationPicker}
                                        disabled={agencyConnected === false}
                                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {agencyConnected === null ? 'Checking connection…' : 'Link GMB Location'}
                                    </button>
                                )}
                                {agencyConnected === false && (
                                    <p className="mt-2 text-xs text-gray-400">Connect the RC Tech Google account first (see banner above).</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Post Modal */}
            {showCreatePostModal && selectedClient && (
                <CreatePostModal
                    clientName={selectedClient.name}
                    onClose={() => setShowCreatePostModal(false)}
                    onCreatePost={handleCreatePost}
                />
            )}

            {/* Status Toast */}
            {oauthStatus && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 min-w-80 max-w-lg px-5 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 ${
                    oauthStatus.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    <span>{oauthStatus.message}</span>
                    <button onClick={() => setOauthStatus(null)} className="text-white opacity-70 hover:opacity-100 text-xl leading-none">×</button>
                </div>
            )}

            {/* Location Picker Modal */}
            {showLocationPicker && selectedClient && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Select GMB Location
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                            Choose the location to link to <strong>{selectedClient.name}</strong>.
                        </p>

                        {loadingLocations && (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-500">Fetching your locations…</span>
                            </div>
                        )}

                        {!loadingLocations && apiBlocked && (
                            <div>
                                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 mb-5">
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                                        Google API quota not approved yet
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        Request a quota increase at{' '}
                                        <a
                                            href="https://console.cloud.google.com/apis/api/mybusinessaccountmanagement.googleapis.com/quotas"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline font-medium"
                                        >
                                            Cloud Console → Quotas
                                        </a>. In the meantime, enter your location ID manually.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Location ID *</label>
                                        <input
                                            type="text"
                                            value={manualLocationId}
                                            onChange={(e) => setManualLocationId(e.target.value)}
                                            placeholder="e.g. 04658615360713100265"
                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Account ID (for posting)</label>
                                        <input
                                            type="text"
                                            value={manualAccountId}
                                            onChange={(e) => setManualAccountId(e.target.value)}
                                            placeholder="e.g. 18176978205248611440"
                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loadingLocations && !apiBlocked && locations.length === 0 && (
                            <p className="text-center text-gray-500 py-6">No locations found on this account.</p>
                        )}

                        {!loadingLocations && !apiBlocked && locations.length > 0 && (
                            <ul className="space-y-3 max-h-72 overflow-y-auto">
                                {locations.map((loc) => (
                                    <li key={loc.locationId}>
                                        <button
                                            disabled={linkingLocation}
                                            onClick={() => handleLinkLocation(loc)}
                                            className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                                        >
                                            <p className="font-medium text-gray-900 dark:text-white">{loc.title}</p>
                                            {loc.address && <p className="text-sm text-gray-500 mt-0.5">{loc.address}</p>}
                                            <p className="text-xs text-gray-400 mt-0.5">ID: {loc.locationId}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-5 flex justify-between items-center">
                            <button
                                onClick={() => { setShowLocationPicker(false); setApiBlocked(false); }}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            {apiBlocked && (
                                <button
                                    disabled={!manualLocationId.trim() || linkingLocation}
                                    onClick={handleManualLink}
                                    className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {linkingLocation ? 'Linking…' : 'Link Location'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
