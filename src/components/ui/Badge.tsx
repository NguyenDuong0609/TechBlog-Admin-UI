import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700",
};

const dotVariantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-500",
    primary: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-cyan-500",
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
};

/**
 * Badge component for status indicators and labels
 * Supports multiple variants and optional dot indicator
 */
export function Badge({
    children,
    variant = "default",
    size = "md",
    dot = false,
    className,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5",
                "font-medium rounded-full",
                "transition-colors duration-200",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {dot && (
                <span
                    className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        dotVariantStyles[variant]
                    )}
                />
            )}
            {children}
        </span>
    );
}
