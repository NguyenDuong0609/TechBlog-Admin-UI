"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { Avatar, Dropdown, Input } from "@/components/ui";
import {
    Menu,
    Search,
    Bell,
    Settings,
    LogOut,
    User,
    ChevronDown,
    ShieldAlert,
    CheckCircle,
} from "lucide-react";

/**
 * Mock notifications data
 */
const mockNotifications = [
    { id: 1, title: "New comment on your post", time: "5 min ago", read: false },
    { id: 2, title: "User registered", time: "1 hour ago", read: false },
    { id: 3, title: "Post published", time: "2 hours ago", read: true },
];

/**
 * System Health / Alert indicator
 */
function SystemHealthIndicator() {
    // Mock: 1 issue as per user request
    const hasIssue = true;

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
            hasIssue
                ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse-slow"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
        )}>
            {hasIssue ? <ShieldAlert size={14} className="text-amber-600" /> : <CheckCircle size={14} className="text-emerald-600" />}
            <span className="text-[10px] font-black uppercase tracking-wider">
                {hasIssue ? "1 System Issue" : "System Healthy"}
            </span>
        </div>
    );
}

/**
 * Notification dropdown component
 */
function NotificationDropdown() {
    const unreadCount = mockNotifications.filter((n) => !n.read).length;

    return (
        <div className="relative">
            <button
                className={cn(
                    "relative p-2 rounded-xl border border-slate-200/50 shadow-sm transition-all duration-200",
                    "text-slate-500 hover:text-indigo-600 hover:bg-slate-50 hover:border-indigo-100"
                )}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 text-white text-[9px] font-black items-center justify-center border-2 border-white">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>
        </div>
    );
}

/**
 * User profile dropdown component
 */
function UserDropdown() {
    const userMenuItems = [
        { label: "My Profile", icon: User, href: "/admin/profile" },
        { label: "Settings", icon: Settings, href: "/admin/settings" },
        { divider: true, label: "" },
        { label: "Sign out", icon: LogOut, danger: true, onClick: () => console.log("Sign out") },
    ];

    return (
        <Dropdown
            trigger={
                <button
                    className={cn(
                        "flex items-center gap-3 p-1.5 pr-3 rounded-xl",
                        "hover:bg-slate-100",
                        "transition-colors duration-200"
                    )}
                >
                    <Avatar
                        name="John Doe"
                        size="sm"
                        status="online"
                    />
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-slate-700">John Doe</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <ChevronDown size={16} className="hidden md:block text-slate-400" />
                </button>
            }
            items={userMenuItems}
        />
    );
}

/**
 * Search input component for navbar
 */
function SearchInput() {
    const [query, setQuery] = useState("");

    return (
        <div className="hidden md:block relative max-w-xs">
            <Input
                type="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={Search}
                size="sm"
                className="bg-slate-50 border-transparent focus:bg-white"
            />
        </div>
    );
}

/**
 * Top navbar component
 * Contains search, notifications, and user profile
 */
export function Navbar() {
    const { toggleOpen } = useSidebar();

    return (
        <header
            className={cn(
                "sticky top-0 z-30",
                "bg-white/80 backdrop-blur-md",
                "border-b border-slate-200/60",
                "px-4 lg:px-6 py-3"
            )}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left - Menu button & Search */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={toggleOpen}
                        className={cn(
                            "lg:hidden p-2 rounded-lg",
                            "text-slate-500 hover:text-slate-700",
                            "hover:bg-slate-100",
                            "transition-colors duration-200"
                        )}
                    >
                        <Menu size={20} />
                    </button>

                    <SearchInput />
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2">
                    {/* Mobile search button */}
                    <button
                        className={cn(
                            "md:hidden p-2 rounded-lg",
                            "text-slate-500 hover:text-slate-700",
                            "hover:bg-slate-100",
                            "transition-colors duration-200"
                        )}
                    >
                        <Search size={20} />
                    </button>

                    <div className="hidden lg:block mr-2">
                        <SystemHealthIndicator />
                    </div>

                    <NotificationDropdown />

                    <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />

                    <UserDropdown />
                </div>
            </div>
        </header>
    );
}
