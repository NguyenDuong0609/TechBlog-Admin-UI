import React from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    status?: "online" | "offline" | "busy" | "away";
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string }> = {
    xs: { container: "w-6 h-6", text: "text-xs", status: "w-2 h-2" },
    sm: { container: "w-8 h-8", text: "text-xs", status: "w-2.5 h-2.5" },
    md: { container: "w-10 h-10", text: "text-sm", status: "w-3 h-3" },
    lg: { container: "w-12 h-12", text: "text-base", status: "w-3.5 h-3.5" },
    xl: { container: "w-16 h-16", text: "text-lg", status: "w-4 h-4" },
};

const statusStyles: Record<NonNullable<AvatarProps["status"]>, string> = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    busy: "bg-red-500",
    away: "bg-amber-500",
};

/**
 * Generates initials from a name string
 */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a consistent background color based on name
 */
function getColorFromName(name: string): string {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-cyan-500",
        "bg-orange-500",
        "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/**
 * Avatar component with image support and fallback initials
 * Includes optional status indicator
 */
export function Avatar({
    src,
    alt,
    name = "User",
    size = "md",
    status,
    className,
    ...props
}: AvatarProps) {
    const styles = sizeStyles[size];
    const initials = getInitials(name);
    const bgColor = getColorFromName(name);

    return (
        <div className={cn("relative inline-flex", className)} {...props}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className={cn(
                        styles.container,
                        "rounded-full object-cover",
                        "ring-2 ring-white",
                        "transition-transform duration-200",
                        "hover:scale-105"
                    )}
                />
            ) : (
                <div
                    className={cn(
                        styles.container,
                        styles.text,
                        "rounded-full",
                        "flex items-center justify-center",
                        "font-medium text-white",
                        "ring-2 ring-white",
                        "transition-transform duration-200",
                        "hover:scale-105",
                        bgColor
                    )}
                >
                    {initials}
                </div>
            )}
            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0",
                        styles.status,
                        "rounded-full",
                        "ring-2 ring-white",
                        statusStyles[status]
                    )}
                />
            )}
        </div>
    );
}
