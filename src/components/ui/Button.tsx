"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

/**
 * Button variant styles following Material Design principles
 */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-gradient-to-r from-blue-600 to-blue-700
    text-white
    shadow-md shadow-blue-500/20
    hover:shadow-lg hover:shadow-blue-500/30
    hover:from-blue-700 hover:to-blue-800
    active:from-blue-800 active:to-blue-900
    focus:ring-2 focus:ring-blue-500/50
  `,
    secondary: `
    bg-gradient-to-r from-slate-600 to-slate-700
    text-white
    shadow-md shadow-slate-500/20
    hover:shadow-lg hover:shadow-slate-500/30
    hover:from-slate-700 hover:to-slate-800
    active:from-slate-800 active:to-slate-900
    focus:ring-2 focus:ring-slate-500/50
  `,
    outline: `
    bg-transparent
    text-slate-700
    border-2 border-slate-300
    hover:bg-slate-50
    hover:border-slate-400
    active:bg-slate-100
    focus:ring-2 focus:ring-slate-500/30
  `,
    ghost: `
    bg-transparent
    text-slate-600
    hover:bg-slate-100
    active:bg-slate-200
    focus:ring-2 focus:ring-slate-500/30
  `,
    danger: `
    bg-gradient-to-r from-red-500 to-red-600
    text-white
    shadow-md shadow-red-500/20
    hover:shadow-lg hover:shadow-red-500/30
    hover:from-red-600 hover:to-red-700
    active:from-red-700 active:to-red-800
    focus:ring-2 focus:ring-red-500/50
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
};

const iconSizes: Record<ButtonSize, number> = {
    sm: 14,
    md: 16,
    lg: 18,
};

/**
 * Button component with Material Design styling
 * Supports multiple variants, sizes, and loading states
 */
export function Button({
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    isLoading = false,
    fullWidth = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <motion.button
            whileHover={isDisabled ? undefined : { scale: 1.02, y: -1 }}
            whileTap={isDisabled ? undefined : { scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
                // Base styles
                "inline-flex items-center justify-center",
                "font-medium rounded-lg",
                "transition-colors duration-200 ease-out",
                "focus:outline-none",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                // Variant & size
                variantStyles[variant],
                sizeStyles[size],
                // Full width
                fullWidth && "w-full",
                className
            )}
            disabled={isDisabled}
            {...(props as any)}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {Icon && iconPosition === "left" && !isLoading && (
                <Icon size={iconSizes[size]} />
            )}
            {children}
            {Icon && iconPosition === "right" && !isLoading && (
                <Icon size={iconSizes[size]} />
            )}
        </motion.button>
    );
}

