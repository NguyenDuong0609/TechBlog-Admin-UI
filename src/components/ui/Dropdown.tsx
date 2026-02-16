"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface DropdownItem {
    label: string;
    icon?: LucideIcon;
    onClick?: () => void;
    href?: string;
    danger?: boolean;
    divider?: boolean;
    disabled?: boolean;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    align?: "left" | "right";
    className?: string;
}

/**
 * Dropdown menu component
 * Opens on click with smooth animations
 */
export function Dropdown({
    trigger,
    items,
    align = "right",
    className,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemClick = (item: DropdownItem) => {
        if (item.disabled) return;
        item.onClick?.();
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={cn("relative inline-flex", className)}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={cn(
                        "absolute z-50 mt-2 top-full",
                        align === "left" ? "left-0" : "right-0",
                        "min-w-[180px]",
                        "bg-white rounded-lg",
                        "border border-slate-200",
                        "shadow-lg shadow-slate-200/50",
                        "py-1",
                        "animate-in fade-in-0 zoom-in-95 duration-100"
                    )}
                >
                    {items.map((item, index) => {
                        if (item.divider) {
                            return (
                                <div
                                    key={index}
                                    className="my-1 border-t border-slate-100"
                                />
                            );
                        }

                        const ItemComponent = item.href ? "a" : "button";
                        const Icon = item.icon;

                        return (
                            <ItemComponent
                                key={index}
                                href={item.href}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                                className={cn(
                                    "w-full flex items-center gap-3",
                                    "px-4 py-2",
                                    "text-left text-sm",
                                    "transition-colors duration-100",
                                    item.disabled
                                        ? "text-slate-300 cursor-not-allowed"
                                        : item.danger
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        size={16}
                                        className={cn(
                                            item.danger ? "text-red-500" : "text-slate-400"
                                        )}
                                    />
                                )}
                                {item.label}
                            </ItemComponent>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
