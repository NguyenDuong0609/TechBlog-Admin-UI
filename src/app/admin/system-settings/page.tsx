"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardBody, Button, Input, Select, Toggle } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
    SlidersHorizontal,
    BarChart3,
    Database,
    Save,
    Trash2,
    Download,
    AlertTriangle,
} from "lucide-react";

// ─── Settings Section ────────────────────────────────────────────────────────

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

// ─── Slider Field ────────────────────────────────────────────────────────────

function SliderField({
    label,
    description,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = "",
    disabled = false,
}: {
    label: string;
    description: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    disabled?: boolean;
}) {
    return (
        <div className={cn("py-3", disabled && "opacity-50")}>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className={cn(
                        "font-medium",
                        disabled ? "text-slate-400" : "text-slate-700"
                    )}>
                        {label}
                    </p>
                    <p className={cn(
                        "text-sm",
                        disabled ? "text-slate-300" : "text-slate-500"
                    )}>
                        {description}
                    </p>
                </div>
                <span className={cn(
                    "text-sm font-bold min-w-[56px] text-right",
                    disabled ? "text-slate-400" : "text-blue-600"
                )}>
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(Number(e.target.value))}
                className={cn(
                    "w-full h-2 rounded-full appearance-none cursor-pointer",
                    "bg-slate-200",
                    "[&::-webkit-slider-thumb]:appearance-none",
                    "[&::-webkit-slider-thumb]:w-5",
                    "[&::-webkit-slider-thumb]:h-5",
                    "[&::-webkit-slider-thumb]:rounded-full",
                    "[&::-webkit-slider-thumb]:bg-blue-600",
                    "[&::-webkit-slider-thumb]:shadow-md",
                    "[&::-webkit-slider-thumb]:shadow-blue-600/30",
                    "[&::-webkit-slider-thumb]:cursor-pointer",
                    "[&::-webkit-slider-thumb]:transition-shadow",
                    "[&::-webkit-slider-thumb]:duration-200",
                    "[&::-webkit-slider-thumb]:hover:shadow-lg",
                    "[&::-webkit-slider-thumb]:hover:shadow-blue-600/40",
                    disabled && "cursor-not-allowed"
                )}
            />
            <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-400">{min}{unit}</span>
                <span className="text-xs text-slate-400">{max}{unit}</span>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState({
        analyticsEnabled: true,
        readThreshold: 50,
        viewDebounceTime: 5000,
        retentionDays: "90",
    });

    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (key: string, value: string | number | boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        console.log("Saving system settings:", settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const isDisabled = !settings.analyticsEnabled;

    return (
        <PageWrapper className="space-y-6">
            <PageHeader
                title="System Settings"
                description="Configure analytics tracking and data management"
                icon={SlidersHorizontal}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "System Settings" },
                ]}
                actions={
                    <Button
                        icon={Save}
                        onClick={handleSave}
                        className={cn(
                            saved && "bg-emerald-600 hover:bg-emerald-700"
                        )}
                    >
                        {saved ? "Saved!" : "Save Changes"}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Analytics Configuration */}
                <SettingsSection
                    icon={BarChart3}
                    title="Analytics Configuration"
                    description="Configure how views and reads are tracked"
                >
                    <div className="divide-y divide-slate-100">
                        <Toggle
                            checked={settings.analyticsEnabled}
                            onChange={(checked) => handleChange("analyticsEnabled", checked)}
                            label="Enable Analytics"
                            description="Track views and reads for all published posts"
                        />

                        <SliderField
                            label="Read Threshold"
                            description="Percentage of article that must be scrolled to count as a read"
                            value={settings.readThreshold}
                            onChange={(value) => handleChange("readThreshold", value)}
                            min={10}
                            max={100}
                            step={5}
                            unit="%"
                            disabled={isDisabled}
                        />

                        <div className={cn("py-3", isDisabled && "opacity-50")}>
                            <Input
                                label="View Debounce Time"
                                value={String(settings.viewDebounceTime)}
                                onChange={(e) =>
                                    handleChange("viewDebounceTime", Number(e.target.value) || 0)
                                }
                                disabled={isDisabled}
                                fullWidth
                            />
                            <p className={cn(
                                "text-xs mt-1",
                                isDisabled ? "text-slate-300" : "text-slate-400"
                            )}>
                                Minimum time (ms) between counting repeat views from the same user. Default: 5000ms.
                            </p>
                        </div>

                        <div className={cn("py-3", isDisabled && "opacity-50")}>
                            <Select
                                label="Analytics Retention"
                                options={[
                                    { value: "30", label: "30 days" },
                                    { value: "60", label: "60 days" },
                                    { value: "90", label: "90 days" },
                                    { value: "180", label: "180 days" },
                                    { value: "365", label: "1 year" },
                                ]}
                                value={settings.retentionDays}
                                onChange={(value) => handleChange("retentionDays", value)}
                                disabled={isDisabled}
                                fullWidth
                            />
                            <p className={cn(
                                "text-xs mt-1",
                                isDisabled ? "text-slate-300" : "text-slate-400"
                            )}>
                                How long to keep individual analytics events. Aggregated data is kept indefinitely.
                            </p>
                        </div>
                    </div>
                </SettingsSection>

                {/* Data Management */}
                <SettingsSection
                    icon={Database}
                    title="Data Management"
                    description="Export or clear analytics data"
                >
                    <div className="space-y-4">
                        {/* Export */}
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-700">Export Analytics</p>
                                <p className="text-sm text-slate-500">
                                    Download all analytics data as a CSV file
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={Download}
                                onClick={() => console.log("Export analytics")}
                            >
                                Export
                            </Button>
                        </div>

                        {/* Clear Data */}
                        <div className="border-t border-slate-100 pt-4">
                            {!showClearConfirm ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-700">Clear Analytics Data</p>
                                        <p className="text-sm text-slate-500">
                                            Permanently delete all analytics events
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                        icon={Trash2}
                                        onClick={() => setShowClearConfirm(true)}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-red-100">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-red-800">
                                                Are you sure?
                                            </p>
                                            <p className="text-sm text-red-600 mt-1">
                                                This will permanently delete all analytics data. This action cannot be undone.
                                            </p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        console.log("Clearing analytics data...");
                                                        setShowClearConfirm(false);
                                                    }}
                                                >
                                                    Yes, Clear All
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowClearConfirm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Note */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
                            <div className="flex items-start gap-2">
                                <BarChart3 size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">
                                        About Analytics Data
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Individual events are subject to retention policies. Aggregated
                                        metrics (daily/monthly totals) are kept indefinitely regardless
                                        of retention settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingsSection>
            </div>
        </PageWrapper>
    );
}
