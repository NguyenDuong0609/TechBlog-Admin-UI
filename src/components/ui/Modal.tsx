"use client";

import React, { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scaleIn, transition } from "@/motion/variants";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: ModalSize;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    footer?: React.ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
};

/**
 * Modal dialog component with overlay
 * Supports keyboard navigation and portal rendering
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    footer,
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Handle escape key press
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape" && closeOnEscape) {
                onClose();
            }
        },
        [onClose, closeOnEscape]
    );

    // Add/remove event listeners and body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div
                    className={cn(
                        "fixed inset-0 z-50",
                        "flex items-center justify-center",
                        "p-4"
                    )}
                >
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute inset-0",
                            "bg-slate-900/50 backdrop-blur-sm"
                        )}
                        onClick={closeOnOverlayClick ? onClose : undefined}
                        aria-hidden="true"
                    />

                    {/* Modal content */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? "modal-title" : undefined}
                        variants={scaleIn}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={cn(
                            "relative w-full",
                            sizeStyles[size],
                            "bg-white rounded-xl",
                            "shadow-2xl shadow-slate-900/20",
                            "overflow-hidden" // Ensure content doesn't spill during radius animation
                        )}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                {title && (
                                    <h2
                                        id="modal-title"
                                        className="text-lg font-semibold text-slate-800"
                                    >
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className={cn(
                                            "p-1.5 -mr-1.5 rounded-lg",
                                            "text-slate-400 hover:text-slate-600",
                                            "hover:bg-slate-100",
                                            "transition-colors duration-200",
                                            "focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                                        )}
                                        aria-label="Close modal"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // Render in portal
    if (typeof document !== "undefined") {
        return createPortal(modalContent, document.body);
    }

    return null;
}
