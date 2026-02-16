"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
    disabled?: boolean;
}

/**
 * Reusable toggle switch component
 * Used in Settings and System Settings modules
 */
export function Toggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
}: ToggleProps) {
    const id = useId();
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className={cn(
                    "font-medium",
                    disabled ? "text-slate-400" : "text-slate-700"
                )}>
                    {label}
                </p>
                {description && (
                    <p className={cn(
                        "text-sm",
                        disabled ? "text-slate-300" : "text-slate-500"
                    )}>
                        {description}
                    </p>
                )}
            </div>
            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative w-11 h-6 rounded-full",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    disabled && "opacity-50 cursor-not-allowed",
                    checked ? "bg-blue-600" : "bg-slate-300"
                )}
            >
                <span
                    className={cn(
                        "absolute top-1 left-1",
                        "w-4 h-4 rounded-full bg-white",
                        "shadow-sm",
                        "transition-transform duration-200",
                        checked && "translate-x-5"
                    )}
                />
            </button>
        </div>
    );
}
