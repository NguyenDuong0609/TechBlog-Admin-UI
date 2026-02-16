"use client";

import React, { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Toast as ToastType } from "@/features/rbac/types";

interface ToastItemProps {
    toast: ToastType;
    onRemove: (id: string) => void;
}

const iconMap = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colorMap = {
    success: {
        bg: "bg-emerald-50 border-emerald-200",
        icon: "text-emerald-600",
        bar: "bg-emerald-500",
        title: "text-emerald-900",
        message: "text-emerald-700",
    },
    error: {
        bg: "bg-red-50 border-red-200",
        icon: "text-red-600",
        bar: "bg-red-500",
        title: "text-red-900",
        message: "text-red-700",
    },
    warning: {
        bg: "bg-amber-50 border-amber-200",
        icon: "text-amber-600",
        bar: "bg-amber-500",
        title: "text-amber-900",
        message: "text-amber-700",
    },
    info: {
        bg: "bg-blue-50 border-blue-200",
        icon: "text-blue-600",
        bar: "bg-blue-500",
        title: "text-blue-900",
        message: "text-blue-700",
    },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const Icon = iconMap[toast.type];
    const colors = colorMap[toast.type];
    const duration = toast.duration || 4000;

    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), duration);
        return () => clearTimeout(timer);
    }, [toast.id, duration, onRemove]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
                "relative w-80 overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm",
                colors.bg
            )}
        >
            <div className="flex items-start gap-3 p-4">
                <div className={cn("flex-shrink-0 mt-0.5", colors.icon)}>
                    <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold leading-tight", colors.title)}>{toast.title}</p>
                    {toast.message && (
                        <p className={cn("text-xs mt-1 leading-relaxed", colors.message)}>{toast.message}</p>
                    )}
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                >
                    <X size={14} className="text-slate-400" />
                </button>
            </div>
            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={cn("h-0.5 origin-left", colors.bar)}
            />
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: ToastType[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </div>
    );
}
