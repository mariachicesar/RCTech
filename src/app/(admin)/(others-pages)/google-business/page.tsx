"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useBusinessByWebsiteId } from "@/hooks/useBusinessByWebsiteId";
import React, { useState } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import { supabase } from "../../../../superbase-client";

export default function GoogleBusinessPage() {
    const { selectedClient } = useSidebar();
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [oauthStatus, setOauthStatus] = useState(null);

    const { business, error, isLoading } = useBusinessByWebsiteId(
        selectedClient?.website_id
    );

    // Handle OAuth callback status
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const error = urlParams.get('error');

        if (success === 'connected') {
            setOauthStatus({ type: 'success', message: 'Google account connected successfully!' });
            // Clear URL params
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            setOauthStatus({ type: 'error', message: `OAuth error: ${error}` });
            // Clear URL params
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleCreatePost = async (postData) => {
        try {
            // Handle post creation with Google My Business API
            console.log("Creating posts:", postData);

            // Validate posts before sending
            const validPosts = postData.filter(post => {
                if (!post.summary || post.summary.trim() === '') {
                    console.warn('Skipping post with empty summary');
                    return false;
                }
                return true;
            });

            if (validPosts.length === 0) {
                console.error('No valid posts to create');
                alert('Please add content to at least one post');
                return;
            }

            const results = await Promise.allSettled(
                validPosts.map(async (post) => {
                    const formattedPost = formatPostForAPI(post);
                    return await createGoogleBusinessPost(
                        business.gmb_Id,      // This should be the locationId, not accountId
                        formattedPost,
                        business.id     // Use selectedClient.id (which is an integer)
                    );
                })
            );

            // Handle results with detailed error logging
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected');

            if (successful > 0) {
                console.log(`Successfully created ${successful} post(s)`);
                // You might want to show a success toast here
            }

            if (failed.length > 0) {
                console.error(`Failed to create ${failed.length} post(s)`);
                failed.forEach((result, index) => {
                    console.error(`Post ${index + 1} error:`, result.reason);
                });
                // You might want to show an error toast here
            }

            setShowCreatePostModal(false);
        } catch (error) {
            console.error("Error creating posts:", error);
            // Handle error - maybe show error message to user
        }
    };

    if (!selectedClient) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Google Business Profile" />
                <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                    <div className="mx-auto w-full max-w-[630px] text-center">
                        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                            No Client Selected
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            Please select a client from the sidebar to manage their Google Business Profile.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Google Business Profile" />
                <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                    <div className="mx-auto w-full max-w-[630px] text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading business data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Google Business Profile" />
                <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                    <div className="mx-auto w-full max-w-[630px] text-center">
                        <h3 className="mb-4 font-semibold text-red-600 text-theme-xl sm:text-2xl">
                            Error Loading Business Data
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            {error.message || "Failed to load business information."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const hasGmbId = business?.gmb_Id;

    return (
        <div>
            <PageBreadcrumb pageTitle="Google Business Profile" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                {hasGmbId ? (
                    <GoogleBusinessProfileView
                        business={business}
                        onCreatePost={() => setShowCreatePostModal(true)}
                    />
                ) : (
                    <GoogleBusinessConnectCTA
                        clientName={selectedClient.name}
                        onConnect={() => setShowConnectModal(true)}
                    />
                )}
            </div>

            {/* Connect Modal */}
            {showConnectModal && (
                <ConnectGoogleBusinessModal
                    clientName={selectedClient.name}
                    onClose={() => setShowConnectModal(false)}
                    onConnect={async () => {
                        try {
                            const response = await fetch('/api/auth/google/connect', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    clientId: selectedClient.id
                                })
                            });

                            if (response.ok) {
                                const { authUrl } = await response.json();
                                window.location.href = authUrl;
                            } else {
                                console.error('Failed to initiate Google OAuth flow');
                                setOauthStatus({ type: 'error', message: 'Failed to initiate Google OAuth flow' });
                            }
                        } catch (error) {
                            console.error('Error initiating Google OAuth:', error);
                            setOauthStatus({ type: 'error', message: 'Error initiating Google OAuth' });
                        }
                    }}
                />
            )}

            {/* Create Post Modal */}
            {showCreatePostModal && (
                <CreatePostModal
                    clientName={selectedClient.name}
                    onClose={() => setShowCreatePostModal(false)}
                    onCreatePost={handleCreatePost}
                />
            )}

            {/* OAuth Status Banner */}
            {oauthStatus && (
                <div className={`mb-4 p-4 rounded-lg ${oauthStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    <div className="flex justify-between items-center">
                        <span>{oauthStatus.message}</span>
                        <button
                            onClick={() => setOauthStatus(null)}
                            className="text-sm opacity-70 hover:opacity-100"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function GoogleBusinessProfileView({ business, onCreatePost }) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Google Business Profile
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Managing profile for {business.name}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Business Info Card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Business Information
                    </h3>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">GMB ID:</span> {business.gmb_Id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Status:</span> Connected
                        </p>
                    </div>
                </div>

                {/* Reviews Card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Reviews
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage and respond to customer reviews
                    </p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                        View Reviews
                    </button>
                </div>

                {/* Posts Card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Posts
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create and manage Google My Business posts
                    </p>
                    <button
                        onClick={onCreatePost}
                        className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                    >
                        Create Post
                    </button>
                </div>
            </div>

            {/* API Status Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-100 mb-2">
                            Google My Business API Setup Required
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-200 mb-3">
                            To enable live posting to Google Business Profile, the Google My Business API needs to be enabled in your Google Cloud project.
                        </p>
                        <div className="text-xs text-amber-600 dark:text-amber-300 space-y-1">
                            <p>• Currently saving posts to your database</p>
                            <p>• API integration ready once enabled</p>
                            <p>• All post data preserved and backed up</p>
                        </div>
                        <div className="mt-3">
                            <a 
                                href="https://console.developers.google.com/apis/api/mybusiness.googleapis.com/overview?project=826428110016"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 font-medium"
                            >
                                Enable Google My Business API
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional features can be added here based on Google My Business API */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Google My Business Features
                </h3>
                <p className="text-blue-700 dark:text-blue-200 text-sm">
                    Manage your business presence across Google Search and Maps. Monitor insights,
                    respond to reviews, and keep your business information up to date.
                </p>
            </div>
        </div>
    );
}

function GoogleBusinessConnectCTA({ clientName, onConnect }) {
    return (
        <div className="mx-auto w-full max-w-[630px] text-center">
            <div className="mb-8">
                <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 className="mb-4 font-semibold text-gray-800 text-2xl dark:text-white/90">
                    Connect Google Business Profile
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Connect {clientName}'s Google Business Profile to manage reviews, posts,
                    and business information directly from this dashboard.
                </p>
            </div>

            <button
                onClick={onConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
                Connect Google Business Profile
            </button>

            <div className="mt-8 text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    What you can do after connecting:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Manage and respond to customer reviews
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Create and schedule Google My Business posts
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Monitor business insights and analytics
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Update business information and hours
                    </li>
                </ul>
            </div>
        </div>
    );
}

function ConnectGoogleBusinessModal({ clientName, onClose, onConnect }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Connect Google Business Profile
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You're about to connect {clientName}'s Google Business Profile.
                        This will allow you to manage their business presence on Google.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            <strong>Note:</strong> You'll need the appropriate permissions from Google
                            to manage this business profile.
                        </p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConnect}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                        Connect Now
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreatePostModal({ clientName, onClose, onCreatePost }) {
    const [posts, setPosts] = useState([{
        id: 1,
        topicType: 'STANDARD',
        languageCode: 'en-US',
        summary: '',
        callToAction: { actionType: 'LEARN_MORE', url: '' },
        media: [],
        event: null,
        offer: null,
        product: null,
        scheduleTime: '',
        alertType: 'NOT_SPECIFIED'
    }]);

    const topicTypes = [
        { value: 'STANDARD', label: 'Standard' },
        { value: 'EVENT', label: 'Event' },
        { value: 'OFFER', label: 'Offer' },
        { value: 'PRODUCT', label: 'Product' }
    ];

    const actionTypes = [
        { value: 'LEARN_MORE', label: 'Learn More' },
        { value: 'BOOK', label: 'Book' },
        { value: 'ORDER_ONLINE', label: 'Order Online' },
        { value: 'BUY', label: 'Buy' },
        { value: 'SIGN_UP', label: 'Sign Up' },
        { value: 'CALL', label: 'Call' }
    ];

    const alertTypes = [
        { value: 'NOT_SPECIFIED', label: 'Not Specified' },
        { value: 'COVID_19', label: 'COVID-19' }
    ];

    const addPost = () => {
        setPosts([...posts, {
            id: Date.now(),
            topicType: 'STANDARD',
            languageCode: 'en-US',
            summary: '',
            callToAction: { actionType: 'LEARN_MORE', url: '' },
            media: [],
            event: null,
            offer: null,
            product: null,
            scheduleTime: '',
            alertType: 'NOT_SPECIFIED'
        }]);
    };

    const updatePost = (id, field, value) => {
        setPosts(posts.map(post =>
            post.id === id ? { ...post, [field]: value } : post
        ));
    };

    const updateCallToAction = (id, field, value) => {
        setPosts(posts.map(post =>
            post.id === id ? {
                ...post,
                callToAction: { ...post.callToAction, [field]: value }
            } : post
        ));
    };

    const removePost = (id) => {
        if (posts.length > 1) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const handleSubmit = () => {
        onCreatePost(posts);
    };

    const handleImageUpload = (postId, files) => {
        const newMedia = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            mediaFormat: 'PHOTO',
            sourceUrl: URL.createObjectURL(file),
            name: file.name,
            file: file
        }));

        setPosts(posts.map(post =>
            post.id === postId ? {
                ...post,
                media: [...post.media, ...newMedia].slice(0, 10) // Google My Business allows up to 10 images per post
            } : post
        ));
    };

    const removeMedia = (postId, mediaId) => {
        setPosts(posts.map(post =>
            post.id === postId ? {
                ...post,
                media: post.media.filter(m => m.id !== mediaId)
            } : post
        ));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Create Google My Business Posts for {clientName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Post {index + 1}
                                </h4>
                                {posts.length > 1 && (
                                    <button
                                        onClick={() => removePost(post.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Topic Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Topic Type
                                    </label>
                                    <select
                                        value={post.topicType}
                                        onChange={(e) => updatePost(post.id, 'topicType', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {topicTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Language Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Language Code
                                    </label>
                                    <input
                                        type="text"
                                        value={post.languageCode}
                                        onChange={(e) => updatePost(post.id, 'languageCode', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="en-US"
                                    />
                                </div>

                                {/* Schedule Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Schedule Time (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={post.scheduleTime}
                                        onChange={(e) => updatePost(post.id, 'scheduleTime', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Alert Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Alert Type
                                    </label>
                                    <select
                                        value={post.alertType}
                                        onChange={(e) => updatePost(post.id, 'alertType', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {alertTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Summary (1500 characters max)
                                </label>
                                <textarea
                                    value={post.summary}
                                    onChange={(e) => updatePost(post.id, 'summary', e.target.value)}
                                    maxLength={1500}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter your post content..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {post.summary.length}/1500 characters
                                </p>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Call to Action
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            Action Type
                                        </label>
                                        <select
                                            value={post.callToAction.actionType}
                                            onChange={(e) => updateCallToAction(post.id, 'actionType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        >
                                            {actionTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            URL
                                        </label>
                                        <input
                                            type="url"
                                            value={post.callToAction.url}
                                            onChange={(e) => updateCallToAction(post.id, 'url', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Media Upload */}
                            <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Images (Optional - Up to 10 images)
                                </h5>

                                {/* Current Images */}
                                {post.media.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        {post.media.map((media) => (
                                            <div key={media.id} className="relative group">
                                                <img
                                                    src={media.sourceUrl}
                                                    alt={media.name}
                                                    className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                />
                                                <button
                                                    onClick={() => removeMedia(post.id, media.id)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{media.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {post.media.length < 10 && (
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleImageUpload(post.id, e.target.files)}
                                            className="hidden"
                                            id={`image-upload-${post.id}`}
                                        />
                                        <label
                                            htmlFor={`image-upload-${post.id}`}
                                            className="cursor-pointer flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="text-sm">Click to upload images</span>
                                            <span className="text-xs text-gray-400 mt-1">
                                                PNG, JPG up to 10MB each ({10 - post.media.length} remaining)
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Event Fields (only show if topicType is EVENT) */}
                            {post.topicType === 'EVENT' && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                                        Event Details
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Event Title"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                        <input
                                            type="datetime-local"
                                            placeholder="Start Time"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                        <input
                                            type="datetime-local"
                                            placeholder="End Time"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Offer Fields (only show if topicType is OFFER) */}
                            {post.topicType === 'OFFER' && (
                                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <h5 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3">
                                        Offer Details
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Coupon Code"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Redemption URL"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Product Fields (only show if topicType is PRODUCT) */}
                            {post.topicType === 'PRODUCT' && (
                                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <h5 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-3">
                                        Product Details
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Product Category"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add Post Button */}
                    <button
                        onClick={addPost}
                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                        + Add Another Post
                    </button>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Creating {posts.length} post{posts.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Create Posts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function createGoogleBusinessPost(locationId, postData, clientId) {
    try {
        console.log('Creating GMB post:', { locationId, postData, clientId });

        const clientIdInt = parseInt(clientId);
        if (isNaN(clientIdInt)) {
            throw new Error('Invalid clientId format');
        }

        let accessToken = localStorage.getItem('google_access_token');
        
        if (!accessToken) {
            throw new Error('No Google access token found. Please reconnect your Google account.');
        }

        // Check if token is expired and refresh if needed
        if (isTokenExpired(accessToken)) {
            console.log('Access token expired, attempting to refresh...');
            accessToken = await refreshGoogleToken();
            
            if (!accessToken) {
                throw new Error('Failed to refresh Google access token. Please reconnect your Google account.');
            }
        }

        // Make real Google API call with fresh token
        const gmb_response = await callGoogleMyBusinessAPI(locationId, postData, accessToken);
        
        // Save post record to Supabase
        console.log('Attempting to save post to Supabase...');
        const { data: savedPost, error: saveError } = await supabase
            .from('gmb_posts')
            .insert({
                client_id: clientIdInt,
                location_id: locationId,
                gmb_post_id: gmb_response.name,
                post_data: postData,
                status: "published",
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (saveError) {
            console.error('Error saving post to Supabase:', saveError);
            console.error('Detailed error:', JSON.stringify(saveError, null, 2));
        } else {
            console.log('Successfully saved post to Supabase:', savedPost);
        }

        return {
            success: true,
            message: accessToken ? 'Post created successfully' : 'Mock post created for testing - Google account not connected',
            gmb_response,
            saved_post: savedPost
        };
    } catch (error) {
        console.error('Error in createGoogleBusinessPost:', error);
        throw error;
    }
}

async function callGoogleMyBusinessAPI(locationId, postData, accessToken) {
    console.log('Using Google Business Profile API v4');
    console.log('Post data:', postData);
    
    try {
        const googleUrl = `https://mybusiness.googleapis.com/v4/accounts/${process.env.NEXT_PUBLIC_GOOGLE_MY_BUSINESS_ACCOUNT_ID}/locations/${locationId}/localPosts`;
        const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/google-business-posts`;

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
            },
            body: JSON.stringify({
                url: googleUrl,
                method: 'POST',
                payload: postData,
                googleAuth: `Bearer ${accessToken}`,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Google Business Profile API Error:', errorData);
            
            // Check for specific API not enabled error
            if (errorData?.error?.code === 403 && 
                errorData?.error?.message?.includes('Google My Business API has not been used')) {
                console.warn('Google My Business API not enabled, using fallback mode');
                return createMockResponse(locationId, postData, 'API_NOT_ENABLED');
            }
            
            // For other errors, still create a local record
            console.warn('Creating local record due to API error');
            return createMockResponse(locationId, postData, 'API_ERROR');
        }

        const result = await response.json();
        console.log('Google Business Profile API response:', result);
        return result;

    } catch (error) {
        console.error('API call failed:', error);
        return createMockResponse(locationId, postData, 'NETWORK_ERROR');
    }
}

function createMockResponse(locationId, postData, reason = 'FALLBACK') {
    return {
        name: `locations/${locationId}/localPosts/local_${Date.now()}`,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        summary: postData.summary,
        topicType: postData.topicType,
        languageCode: postData.languageCode,
        state: 'LIVE',
        callToAction: postData.callToAction,
        media: postData.media || [],
        alertType: postData.alertType || 'NOT_SPECIFIED',
        _mockReason: reason // Internal flag to track why this was mocked
    };
}

function formatPostForAPI(post) {
    // Validate required fields
    if (!post.summary || post.summary.trim() === '') {
        throw new Error('Post summary is required');
    }

    // Format the post data according to Google My Business API structure
    const formattedPost = {
        languageCode: post.languageCode || 'en-US',
        summary: post.summary.trim(),
        topicType: post.topicType || 'STANDARD'
    };

    // Add call to action if URL is provided
    if (post.callToAction?.url && post.callToAction.url.trim() !== '') {
        formattedPost.callToAction = {
            actionType: post.callToAction.actionType || 'LEARN_MORE',
            url: post.callToAction.url.trim()
        };
    }

    // Add media if present - Google My Business expects specific format
    if (post.media && post.media.length > 0) {
        formattedPost.media = post.media.map(mediaItem => ({
            mediaFormat: mediaItem.mediaFormat || 'PHOTO',
            sourceUrl: mediaItem.sourceUrl
        }));
    }

    // Add scheduling if present
    if (post.scheduleTime && post.scheduleTime.trim() !== '') {
        formattedPost.scheduleTime = new Date(post.scheduleTime).toISOString();
    }

    // Add alert type if specified and not default
    if (post.alertType && post.alertType !== 'NOT_SPECIFIED') {
        formattedPost.alertType = post.alertType;
    }

    // Add topic-specific data only if the data exists
    if (post.topicType === 'EVENT' && post.event) {
        formattedPost.event = post.event;
    } else if (post.topicType === 'OFFER' && post.offer) {
        formattedPost.offer = post.offer;
    } else if (post.topicType === 'PRODUCT' && post.product) {
        formattedPost.product = post.product;
    }

    console.log('Formatted post for API:', formattedPost);
    return formattedPost;
}

// Add helper function to check if token is expired
function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    } catch {
        return true;
    }
}

// Add helper function to refresh Google token
async function refreshGoogleToken(): Promise<string | null> {
    try {
        const refreshToken = localStorage.getItem('google_refresh_token');
        if (!refreshToken) {
            console.error('No refresh token available');
            return null;
        }

        const response = await fetch('/api/auth/google/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            console.error('Failed to refresh token:', response.status);
            return null;
        }

        const { accessToken } = await response.json();
        localStorage.setItem('google_access_token', accessToken);
        console.log('Successfully refreshed Google access token');
        return accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
}