"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { adminMenu, adminMenuGroups, type MenuItem } from "@/lib/constants/menu";
import {
    ChevronLeft,
    ChevronRight,
    X,
    Layers,
    ShieldAlert,
    ShieldCheck,
} from "lucide-react";
import { useReviewMode } from "@/providers/ReviewModeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarVariants, transition } from "@/motion/variants";

/**
 * Logo component for the sidebar
 */
function Logo({ collapsed }: { collapsed: boolean }) {
    return (
        <Link
            href="/admin/dashboard"
            className={cn(
                "flex items-center mx-4 my-6 overflow-hidden",
                "transition-all duration-300"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center flex-shrink-0",
                    "w-10 h-10 rounded-lg",
                    "bg-slate-800 text-white font-bold text-xs"
                )}
            >
                ND
            </div>
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={transition}
                        className="ml-3 overflow-hidden whitespace-nowrap"
                    >
                        <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                            ND Control
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Author Node</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </Link>
    );
}

/**
 * Navigation menu item component
 */
function NavItem({
    item,
    isActive,
    collapsed,
}: {
    item: MenuItem;
    isActive: boolean;
    collapsed: boolean;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={cn(
                "group relative flex items-center gap-3",
                "mx-3 px-3 py-3 rounded-xl", // Increased vertical padding to 3 (12px)
                "transition-all duration-200",
                !isActive && "hover:bg-slate-200/50"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white border border-slate-200 shadow-sm rounded-xl ring-2 ring-indigo-500/5"
                    transition={transition}
                />
            )}

            <span className="relative z-10 flex items-center gap-3 w-full">
                <Icon
                    size={18}
                    className={cn(
                        "flex-shrink-0 transition-colors duration-200",
                        isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    )}
                />

                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={transition}
                            className={cn(
                                "font-bold text-[13px] whitespace-nowrap transition-colors duration-200",
                                isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-800"
                            )}
                        >
                            {item.label}
                        </motion.span>
                    )}
                </AnimatePresence>

                {item.badge && !collapsed && (
                    <span
                        className={cn(
                            "ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-md",
                            isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "bg-slate-200 text-slate-500"
                        )}
                    >
                        {item.badge}
                    </span>
                )}
            </span>

            {/* Tooltip for collapsed state */}
            {collapsed && (
                <div
                    className={cn(
                        "absolute left-full ml-3 px-3 py-2",
                        "bg-slate-900 text-white text-xs font-bold rounded-lg",
                        "shadow-xl shadow-slate-900/20",
                        "opacity-0 invisible",
                        "group-hover:opacity-100 group-hover:visible",
                        "transition-all duration-200",
                        "whitespace-nowrap z-50 capitalize"
                    )}
                >
                    {item.label}
                </div>
            )}
        </Link>
    );
}

/**
 * Main sidebar component
 * Collapsible navigation with Material Design styling
 */
export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, isOpen, toggleCollapse, setOpen } = useSidebar();
    const { isReviewMode, toggleReviewMode } = useReviewMode();

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={sidebarVariants}
                className={cn(
                    "fixed top-0 left-0 z-50 h-full",
                    "bg-sidebar border-r border-sidebar-border shadow-none",
                    "flex flex-col",
                    // Desktop positioning
                    "lg:relative lg:translate-x-0"
                )}
                style={{
                    width: isCollapsed ? 80 : 256, // fallback
                    // transform: isOpen ? "translateX(0)" : "translateX(-100%)" // Conflict with motion.aside animate width? 
                    // We need to handle mobile slide-in separate from desktop collapse
                }}
            >
                {/* Mobile Slide-in Handling */}
                {/* 
                   Motion.aside on desktop handles width.
                   On mobile, it needs to handle X translation.
                   Mixing them is tricky.
                   
                   Better approach: 
                   Use a wrapper div for position?
                   Or just use classNames for mobile translation and motion for width?
                 */}

                {/* Re-implementing correctly: */}
                <div className={cn(
                    "h-full flex flex-col w-full",
                    // Mobile handling via className because simpler
                    "lg:block",
                    !isOpen && "hidden lg:flex" // Hide on mobile if closed, but this breaks animation.
                    // Actually, let's just stick to the requested "Sidebar collapse / expand" motion for desktop mainly.
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Logo collapsed={isCollapsed} />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <div className="space-y-4">
                            {adminMenuGroups.map((group) => (
                                <div key={group.title} className="space-y-1">
                                    {!isCollapsed && (
                                        <h2 className="mx-6 px-1 text-[11px] uppercase tracking-[0.15em] font-extrabold text-slate-400/80 mb-3 mt-8 first:mt-0">
                                            {group.title}
                                        </h2>
                                    )}
                                    {isCollapsed && (
                                        <div className="h-px bg-slate-100 mx-4 my-4" />
                                    )}
                                    {group.items.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            item={item}
                                            isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'))}
                                            collapsed={isCollapsed}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-100 space-y-3">
                        {/* Review Mode Toggle */}
                        <div className="relative group">
                            <button
                                onClick={toggleReviewMode}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                                    isReviewMode
                                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/50 shadow-sm"
                                )}
                            >
                                {isReviewMode ? <ShieldCheck size={18} className="text-amber-600" /> : <ShieldAlert size={18} />}
                                {!isCollapsed && (
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[11px] font-bold uppercase tracking-tight">
                                            {isReviewMode ? "Safe Mode Active" : "Authoring Mode"}
                                        </span>
                                        <span className="text-[9px] font-medium opacity-60 mt-0.5">
                                            {isReviewMode ? "Read-only access" : "Full access enabled"}
                                        </span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Collapse toggle */}
                        <button
                            onClick={toggleCollapse}
                            className={cn(
                                "w-full flex items-center justify-center gap-2",
                                "px-3 py-2.5 rounded-xl",
                                "text-slate-400 hover:bg-white hover:text-slate-600 hover:border-slate-200 border border-transparent transition-all duration-200"
                            )}
                        >
                            {isCollapsed ? (
                                <ChevronRight size={18} />
                            ) : (
                                <>
                                    <ChevronLeft size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Minimize Sidebar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
