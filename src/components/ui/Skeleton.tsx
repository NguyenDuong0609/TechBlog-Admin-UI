"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    variant?: "rounded" | "circle" | "rect";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={cn(
                "bg-slate-200 relative overflow-hidden",
                variant === "rounded" && "rounded-lg",
                variant === "circle" && "rounded-full",
                variant === "rect" && "rounded-md",
                className
            )}
        >
            {/* Shimmer effect */}
            <motion.div
                animate={{
                    x: ["-100%", "100%"],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
        </motion.div>
    );
}
