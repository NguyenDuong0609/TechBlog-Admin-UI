"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    helperText?: string;
    error?: string;
    size?: InputSize;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    onRightIconClick?: () => void;
    fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, { input: string; icon: number }> = {
    sm: { input: "px-3 py-1.5 text-xs", icon: 14 },
    md: { input: "px-4 py-2.5 text-sm", icon: 16 },
    lg: { input: "px-4 py-3 text-base", icon: 18 },
};

/**
 * Input component with Material Design styling
 * Supports labels, helper text, error states, and icons
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            size = "md",
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            onRightIconClick,
            fullWidth = false,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const hasError = Boolean(error);

        return (
            <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {LeftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <LeftIcon size={sizeStyles[size].icon} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        suppressHydrationWarning
                        className={cn(
                            // Base styles
                            "w-full rounded-lg",
                            "bg-white",
                            "border border-slate-200",
                            "text-slate-900",
                            "placeholder:text-slate-400",
                            "transition-all duration-200",
                            // Focus styles
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                            // Hover
                            "hover:border-slate-300",
                            // Error state
                            hasError && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                            // Disabled
                            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
                            // Size
                            sizeStyles[size].input,
                            // Icon padding
                            LeftIcon && "pl-10",
                            RightIcon && "pr-10",
                            className
                        )}
                        {...props}
                    />
                    {RightIcon && (
                        <button
                            type="button"
                            onClick={onRightIconClick}
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2",
                                "text-slate-400 hover:text-slate-600",
                                "transition-colors duration-200",
                                !onRightIconClick && "pointer-events-none"
                            )}
                            tabIndex={onRightIconClick ? 0 : -1}
                        >
                            <RightIcon size={sizeStyles[size].icon} />
                        </button>
                    )}
                </div>
                <AnimatePresence mode="wait">
                    {(helperText || error) && (
                        <motion.p
                            key={hasError ? "error" : "helper"}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                                "text-xs px-1",
                                hasError ? "text-red-500 font-medium" : "text-slate-500"
                            )}
                        >
                            {error || helperText}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = "Input";
