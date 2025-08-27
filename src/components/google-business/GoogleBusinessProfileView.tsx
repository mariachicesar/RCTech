/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

export function GoogleBusinessProfileView({ business, onCreatePost }: { business: any; onCreatePost: () => void; }) {
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
