"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { Card, CardBody, Button, Input, Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { User, Save, Camera, Key, Shield, Bell } from "lucide-react";

/**
 * Profile page
 * User profile settings and information
 */
export default function ProfilePage() {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Full-stack developer with a passion for clean code and modern technologies. I love building products that make a difference.",
        website: "https://johndoe.dev",
        twitter: "@johndoe",
        github: "johndoe",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving profile:", profile);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profile"
                description="Manage your personal information"
                icon={User}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Profile" },
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardBody className="flex flex-col items-center text-center py-8">
                        <div className="relative mb-4">
                            <Avatar name={profile.name} size="xl" />
                            <button
                                className={cn(
                                    "absolute bottom-0 right-0",
                                    "p-2 rounded-full",
                                    "bg-blue-600 text-white",
                                    "shadow-lg shadow-blue-500/25",
                                    "hover:bg-blue-700",
                                    "transition-colors duration-200"
                                )}
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">{profile.name}</h2>
                        <p className="text-slate-500">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Active
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                                Admin
                            </span>
                        </div>
                    </CardBody>
                </Card>

                {/* Profile Form */}
                <Card className="lg:col-span-2">
                    <CardBody>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Bio</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-lg",
                                        "bg-white border border-slate-200",
                                        "text-slate-900 placeholder:text-slate-400",
                                        "transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                                        "hover:border-slate-300"
                                    )}
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 pt-4 border-t border-slate-100">
                                Social Links
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input
                                    label="Website"
                                    name="website"
                                    value={profile.website}
                                    onChange={handleChange}
                                    placeholder="https://yoursite.com"
                                    fullWidth
                                />
                                <Input
                                    label="Twitter"
                                    name="twitter"
                                    value={profile.twitter}
                                    onChange={handleChange}
                                    placeholder="@username"
                                    fullWidth
                                />
                                <Input
                                    label="GitHub"
                                    name="github"
                                    value={profile.github}
                                    onChange={handleChange}
                                    placeholder="username"
                                    fullWidth
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" icon={Save}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>

            {/* Security & Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hoverable className="cursor-pointer">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-100">
                            <Key className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Change Password</h3>
                            <p className="text-sm text-slate-500">
                                Update your password regularly for security
                            </p>
                        </div>
                    </CardBody>
                </Card>

                <Card hoverable className="cursor-pointer">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-100">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-slate-500">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
