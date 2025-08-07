"use client";
import { useState, useRef, useEffect } from "react";
import ComponentCard from "../../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import Button from "../../../../components/ui/button/Button";
import { useSidebar } from "../../../../context/SidebarContext";
import { ImageUploadLocation } from "../../../../types/page";
import MultipleFileInputExample, { MultipleFileInputRef } from "../../../../components/form/form-elements/MultipleFileInputExample";
import { useGetAssets } from "../../../../hooks/useImage";
import Image from "next/image";


export default function AssetsPage() {
    const { user } = useSidebar();
    const [isNewAsset, setIsNewAsset] = useState(false);
    const [imageUploadLocation, setImageUploadLocation] = useState<ImageUploadLocation>({ table: "", id: 0, idFieldName: "" });
    const fileInputRef = useRef<MultipleFileInputRef>(null);

    //SWR
    const { assets, isLoading, error } = useGetAssets(user?.website_id || null);

    const resetTrigger = 0; // This can be used to reset the file input if needed

    const handleSave = () => {
        // Set the upload location first
        setImageUploadLocation({ table: "/asset", id: user?.website_id || 0, idFieldName: "website_id" });
    };

    useEffect(() => {
        if (imageUploadLocation.id > 0) {
            fileInputRef.current?.handleSaveImages();
        }
    }, [imageUploadLocation]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You might want to add a toast notification here
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };



    return (
        <>
            <PageBreadcrumb pageTitle="Main Forms" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="Upload">
                        <div className="space-y-6">
                            <Button variant="outline" onClick={() => setIsNewAsset(!isNewAsset)}> {isNewAsset ? "Cancel" : "Upload New Asset"}</Button>
                        </div>
                        {isNewAsset && (
                            <div>
                                <MultipleFileInputExample
                                    ref={fileInputRef}
                                    imageUploadLocation={imageUploadLocation}
                                    resetTrigger={resetTrigger}
                                    idFieldName={imageUploadLocation.idFieldName}
                                />
                                <Button onClick={handleSave} className="mt-4">Save</Button>
                            </div>
                        )}
                    </ComponentCard>
                </div>
                <div className="space-y-6">
                    <ComponentCard title="All Assets">
                        <div className="space-y-6">
                            {isLoading && <p>Loading assets...</p>}
                            {error && <p>Error loading assets: {error.message}</p>}
                            {assets && assets.length === 0 && <p>No assets found.</p>}
                            {assets && assets.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {assets.map((asset) => (
                                        <div key={asset.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="aspect-square relative bg-gray-50 h-24 w-24">
                                                <Image 
                                                    src={asset.image?.url || ""} 
                                                    alt={asset.image?.alt_text || "Asset Image"} 
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-2">
                                                <div className="mb-1">
                                                    <p className="text-xs text-gray-600 mb-1">URL:</p>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-xs text-gray-800 truncate flex-1 bg-gray-50 px-1 py-1 rounded" >
                                                            {asset.image?.url}
                                                        </p>
                                                        <button
                                                            onClick={() => copyToClipboard(asset.image?.url || "")}
                                                            className="px-1 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>
                                                {asset.image?.alt_text && (
                                                    <p className="text-xs text-gray-600 truncate">
                                                        <span className="font-medium">Alt:</span> {asset.image.alt_text}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </>
    )
}