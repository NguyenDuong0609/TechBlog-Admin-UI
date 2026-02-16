"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    id?: string;
}

/**
 * Select component with dropdown menu
 * Custom implementation with keyboard navigation
 */
export function Select({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    label,
    error,
    disabled = false,
    fullWidth = false,
    className,
    id,
}: SelectProps) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

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

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
            case "Enter":
            case " ":
                event.preventDefault();
                if (isOpen && highlightedIndex >= 0) {
                    const option = options[highlightedIndex];
                    if (!option.disabled) {
                        onChange?.(option.value);
                        setIsOpen(false);
                    }
                } else {
                    setIsOpen(true);
                }
                break;
            case "ArrowDown":
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex((prev) =>
                        prev < options.length - 1 ? prev + 1 : prev
                    );
                }
                break;
            case "ArrowUp":
                event.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative", fullWidth && "w-full", className)}
        >
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                    {label}
                </label>
            )}
            <button
                id={selectId}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={cn(
                    "w-full flex items-center justify-between gap-2",
                    "px-4 py-2.5",
                    "bg-white rounded-lg",
                    "border border-slate-200",
                    "text-left text-sm",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                    "hover:border-slate-300",
                    disabled && "bg-slate-50 cursor-not-allowed opacity-60",
                    error && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                )}
            >
                <span className={cn(!selectedOption && "text-slate-400")}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-slate-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className={cn(
                        "absolute z-50 w-full mt-1",
                        "bg-white rounded-lg",
                        "border border-slate-200",
                        "shadow-lg shadow-slate-200/50",
                        "max-h-60 overflow-auto",
                        "animate-in fade-in-0 zoom-in-95 duration-100"
                    )}
                >
                    {options.map((option, index) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                if (!option.disabled) {
                                    onChange?.(option.value);
                                    setIsOpen(false);
                                }
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            disabled={option.disabled}
                            className={cn(
                                "w-full flex items-center justify-between gap-2",
                                "px-4 py-2.5",
                                "text-left text-sm",
                                "transition-colors duration-100",
                                "first:rounded-t-lg last:rounded-b-lg",
                                option.disabled
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-slate-700 hover:bg-slate-50",
                                highlightedIndex === index && !option.disabled && "bg-slate-50",
                                option.value === value && "bg-blue-50 text-blue-700"
                            )}
                        >
                            {option.label}
                            {option.value === value && (
                                <Check size={16} className="text-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
