"use client";

import React, { useState } from "react";
import UserAddressCard from "./UserAddressCard";
import UserInfoCard from "./UserInfoCard";
import UserMetaCard from "./UserMetaCard";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { supabase } from "../../superbase-client";

const ProfileClient: React.FC = () => {
    const [isNewUser, setIsNewUser] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        businessName: "",
        oldWebsite: "",
        yelp: "",
        googleMyBusiness: "",
        otherSites: "",
    });
    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle save logic here
        console.log("Saving changes...")
        const { data, error } = await supabase.rpc('add_user_website', {
            website: formData.oldWebsite,
            businessName: formData.businessName,
            name: formData.firstName + " " + formData.lastName,
            email: formData.email,
            role: "client"
        })
        if (error) console.error(error)
        else console.log(data)
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
                                            <Label>Website</Label>
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
                                            <Label>Other Sites</Label>
                                            <Input
                                                type="text"
                                                value={formData.otherSites}
                                                name="otherSites"
                                                onChange={handleChange}
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
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            )}
        </div>
    );
};

export default ProfileClient;
