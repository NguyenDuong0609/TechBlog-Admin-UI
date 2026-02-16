"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp } from "@/motion/variants";

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInUp}
            className={className}
        >
            {children}
        </motion.div>
    );
}
