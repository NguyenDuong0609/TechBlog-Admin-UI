"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingSaveBarProps {
    isDirty: boolean;
    isSaving: boolean;
    isReviewMode: boolean;
    isSystemRole: boolean;
    onSave: () => void;
    onDiscard: () => void;
}

export function FloatingSaveBar({
    isDirty, isSaving, isReviewMode, isSystemRole, onSave, onDiscard
}: FloatingSaveBarProps) {
    const isVisible = isDirty && !isReviewMode && !isSystemRole;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed bottom-8 right-8 z-40 flex items-center gap-3 p-2 bg-indigo-900 text-white rounded-2xl shadow-2xl border border-white/20"
                >
                    <div className="px-4 py-2">
                        <p className="text-xs font-bold whitespace-nowrap">Unsaved Changes</p>
                        <p className="text-[10px] text-indigo-200 opacity-80">
                            Press Ctrl+S or click Save
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-white text-indigo-900 border-none hover:bg-white/90"
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 size={14} className="mr-1.5 animate-spin" />
                        ) : (
                            <CheckCircle2 size={14} className="mr-1.5" />
                        )}
                        {isSaving ? "Saving..." : "Save Now"}
                    </Button>
                    <button
                        onClick={onDiscard}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        title="Discard Changes"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
