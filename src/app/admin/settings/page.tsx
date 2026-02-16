"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { Card, CardBody, Button, Input, Select, Toggle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Settings, Save, Globe, Palette, Bell, Database, Shield } from "lucide-react";

/**
 * Settings section component
 */
function SettingsSection({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardBody>
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-slate-100">
                        <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-500">{description}</p>
                    </div>
                </div>
                {children}
            </CardBody>
        </Card>
    );
}

/**
 * Settings page
 * Application and user preferences
 */
export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "My Tech Blog",
        siteDescription: "A blog about technology, programming, and design",
        language: "en",
        timezone: "UTC",
        theme: "light",
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        autoSave: true,
        twoFactorAuth: false,
        sessionTimeout: "30",
    });

    const handleChange = (key: string, value: string | boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        console.log("Saving settings:", settings);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Configure your application preferences"
                icon={Settings}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Settings" },
                ]}
                actions={
                    <Button icon={Save} onClick={handleSave}>
                        Save Changes
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <SettingsSection
                    icon={Globe}
                    title="General"
                    description="Basic site configuration"
                >
                    <div className="space-y-4">
                        <Input
                            label="Site Name"
                            value={settings.siteName}
                            onChange={(e) => handleChange("siteName", e.target.value)}
                            fullWidth
                        />
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Site Description
                            </label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => handleChange("siteDescription", e.target.value)}
                                rows={3}
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-lg",
                                    "bg-white border border-slate-200",
                                    "text-slate-900 placeholder:text-slate-400",
                                    "transition-all duration-200",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Language"
                                options={[
                                    { value: "en", label: "English" },
                                    { value: "vi", label: "Vietnamese" },
                                    { value: "ja", label: "Japanese" },
                                ]}
                                value={settings.language}
                                onChange={(value) => handleChange("language", value)}
                                fullWidth
                            />
                            <Select
                                label="Timezone"
                                options={[
                                    { value: "UTC", label: "UTC" },
                                    { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho Chi Minh" },
                                    { value: "America/New_York", label: "America/New York" },
                                ]}
                                value={settings.timezone}
                                onChange={(value) => handleChange("timezone", value)}
                                fullWidth
                            />
                        </div>
                    </div>
                </SettingsSection>

                {/* Appearance Settings */}
                <SettingsSection
                    icon={Palette}
                    title="Appearance"
                    description="Customize the look and feel"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-3 block">
                                Theme
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: "light", label: "Light", color: "bg-white" },
                                    { value: "dark", label: "Dark", color: "bg-slate-800" },
                                    { value: "system", label: "System", color: "bg-gradient-to-r from-white to-slate-800" },
                                ].map((theme) => (
                                    <button
                                        key={theme.value}
                                        type="button"
                                        onClick={() => handleChange("theme", theme.value)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all duration-200",
                                            settings.theme === theme.value
                                                ? "border-blue-500 ring-2 ring-blue-500/20"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-full h-8 rounded-lg mb-2",
                                                theme.color,
                                                "border border-slate-200"
                                            )}
                                        />
                                        <p className="text-sm font-medium text-slate-700">
                                            {theme.label}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* Notification Settings */}
                <SettingsSection
                    icon={Bell}
                    title="Notifications"
                    description="Manage how you receive updates"
                >
                    <div className="divide-y divide-slate-100">
                        <Toggle
                            checked={settings.emailNotifications}
                            onChange={(checked) => handleChange("emailNotifications", checked)}
                            label="Email Notifications"
                            description="Receive updates via email"
                        />
                        <Toggle
                            checked={settings.pushNotifications}
                            onChange={(checked) => handleChange("pushNotifications", checked)}
                            label="Push Notifications"
                            description="Receive browser push notifications"
                        />
                        <Toggle
                            checked={settings.weeklyDigest}
                            onChange={(checked) => handleChange("weeklyDigest", checked)}
                            label="Weekly Digest"
                            description="Get a summary of activity each week"
                        />
                    </div>
                </SettingsSection>

                {/* Security Settings */}
                <SettingsSection
                    icon={Shield}
                    title="Security"
                    description="Protect your account"
                >
                    <div className="divide-y divide-slate-100">
                        <Toggle
                            checked={settings.twoFactorAuth}
                            onChange={(checked) => handleChange("twoFactorAuth", checked)}
                            label="Two-Factor Authentication"
                            description="Require 2FA for login"
                        />
                        <Toggle
                            checked={settings.autoSave}
                            onChange={(checked) => handleChange("autoSave", checked)}
                            label="Auto-save Drafts"
                            description="Automatically save posts while editing"
                        />
                        <div className="py-3">
                            <Select
                                label="Session Timeout"
                                options={[
                                    { value: "15", label: "15 minutes" },
                                    { value: "30", label: "30 minutes" },
                                    { value: "60", label: "1 hour" },
                                    { value: "120", label: "2 hours" },
                                ]}
                                value={settings.sessionTimeout}
                                onChange={(value) => handleChange("sessionTimeout", value)}
                                fullWidth
                            />
                        </div>
                    </div>
                </SettingsSection>
            </div>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                            <p className="text-sm text-slate-500">
                                Irreversible and destructive actions
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline">Export Data</Button>
                            <Button variant="danger">Delete Account</Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
