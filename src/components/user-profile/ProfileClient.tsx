"use client";

import React, { useState } from "react";
import UserInfoCard from "./UserInfoCard";
import UserMetaCard from "./UserMetaCard";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useSidebar } from "../../context/SidebarContext";
import UserBusinessCard from "./UserBusinessCard";
import { mutate } from "swr";
import { mutateUpdate } from "../../hooks/useMutateUpdate";
import { useBusinessByWebsiteId } from "../../hooks/useBusinessByWebsiteId";

const ProfileClient: React.FC = () => {
    // Context
    const { user } = useSidebar();

    // State to manage new user creation form visibility
    const [isNewUser, setIsNewUser] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.name ? user.name.split(" ")[0] : "",
        lastName: user?.name ? user.name.split(" ")[1] : "",
        email: user?.email || "",
        businessName: "",
        address:  "",
        phone:  "",
        rating: 0,
        reviewCount: 0,
        oldWebsite: "",
        yelp: "",
        googleMyBusiness: "",
        facebook: "",
        x: "",
        instagram: "",
    });
    //SWR
    const {business} = useBusinessByWebsiteId(user?.website_id || null);
    // 1. Insert Website get last id
    // 2. Update User table 
    // 3. Insert Business Listing Table
    // 4. TODO: Create New User it only handles Update User
    const handleSave = async () => {
        // Handle save logic here
        const result = await mutateUpdate({
            path: "/website",
            method: "POST",
            payload: {
                name: formData.businessName,
            },
            additionalHeaders: {
                Prefer: "return=representation",
            },
        })
        if(result.error) {
            console.error("Error saving user data:", result.error);
            return
        }
        const websiteId: number = (result.response as { id: number }[])[0].id;
        mutateUpdate({
            path: `/user?id=eq.${user?.id}`,
            method: "PATCH",
            payload: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                website_id: websiteId,
                phone: formData.phone,
            },
        });
        mutateUpdate({
            path: `/business_listing`,
            method: user?.website_id ? "PATCH" : "POST",
            payload: {
                listing_url: formData.oldWebsite,
                business_name: formData.businessName,
                address: formData.address,
                rating: formData.rating,
                review_count: formData.reviewCount,
                website_id: websiteId,
                xUrl: formData.x,
                instagram: formData.instagram,
                facebook: formData.facebook,

            },
        });
        mutate(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user?id=eq.${user?.id}`);
        
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle input change logic here
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-5 flex flex-row items-center justify-between lg:mb-7">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Profile
                </h3>
                <Button variant="outline" onClick={() => setIsNewUser(!isNewUser)}>
                    Create User
                </Button>
            </div>
            {isNewUser ? (
                <div className="space-y-6">
                    <div className="w-fullrounded-3xl relative bg-white p-4 lg:p-11 dark:bg-gray-900">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Edit Personal Information
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                                Update your details to keep your profile up-to-date.
                            </p>
                        </div>
                        <form className="flex flex-col">
                            <div className="overflow-y-auto px-2 pb-3">
                                <div>
                                    <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                                        User Info
                                    </h5>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                type="text"
                                                value={formData.firstName}
                                                name="firstName"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                type="text"
                                                value={formData.lastName}
                                                name="lastName"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                name="email"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Phone</Label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                name="phone"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-7">
                                    <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                                        Business Information
                                    </h5>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Business Name</Label>
                                            <Input
                                                type="text"
                                                value={formData.businessName}
                                                name="businessName"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Previous/Curent Website</Label>
                                            <Input
                                                type="text"
                                                value={formData.oldWebsite}
                                                name="oldWebsite"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Yelp</Label>
                                            <Input
                                                type="text"
                                                value={formData.yelp}
                                                name="yelp"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Google My Business</Label>
                                            <Input
                                                type="text"
                                                value={formData.googleMyBusiness}
                                                name="googleMyBusiness"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Label>Address</Label>
                                            <Input
                                                type="text"
                                                value={formData.address}
                                                name="address"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Move social links */}
                                <div>
                                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                        Social Links
                                    </h5>

                                    <div className="w-full grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 xl:grid-cols-4">
                                        <div>
                                            <Label>Facebook</Label>
                                            <Input
                                                type="text"
                                                name="facebook"
                                                onChange={handleChange}
                                                value={formData.facebook}
                                            />
                                        </div>
                                        <div>
                                            <Label>X.com</Label>
                                            <Input type="text"
                                            name="x" onChange={handleChange} value={formData.x} />
                                        
                                        </div>
                                        <div>
                                            <Label>Instagram</Label>
                                            <Input
                                                type="text"
                                                name="instagram"
                                                onChange={handleChange}
                                                value={formData.instagram}
                                            />
                                        </div>
                                        <div>
                                            <Label>Rating</Label>
                                            <Input
                                                type="text"
                                                name="rating"
                                                onChange={handleChange}
                                                value={formData.rating}
                                            />
                                        </div>
                                        <div>
                                            <Label>Review Count</Label>
                                            <Input
                                                type="text"
                                                name="reviewCount"
                                                onChange={handleChange}
                                                value={formData.reviewCount}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsNewUser(false)}
                                >
                                    Close
                                </Button>
                                <Button size="sm" onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard user={user} />
                    {user?.website_id === null ? <Button variant="outline" onClick={() => setIsNewUser(true)}>
                        Complete Business Info
                    </Button> : <UserBusinessCard business={business} />}
                    
                </div>
            )}
        </div>
    );
};

export default ProfileClient;
