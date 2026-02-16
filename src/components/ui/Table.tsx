"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transition } from "@/motion/transitions";
import { Skeleton } from "./Skeleton";

/**
 * Column definition for the table
 */
export interface TableColumn<T> {
    key: string;
    header: string;
    width?: string;
    align?: "left" | "center" | "right";
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (row: T, index: number) => string | number;
    onRowClick?: (row: T) => void;
    loading?: boolean;
    emptyMessage?: string;
    hoverable?: boolean;
    striped?: boolean;
    compact?: boolean;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

/**
 * Data Table component with responsive design
 */
export function Table<T>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    loading = false,
    emptyMessage = "No data available",
    hoverable = true,
    striped = false,
    compact = false,
}: TableProps<T>) {
    const alignStyles = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-full">
                {/* Header */}
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                style={{ width: column.width }}
                                className={cn(
                                    "font-semibold text-xs uppercase tracking-wider text-slate-500",
                                    compact ? "px-4 py-2" : "px-6 py-3",
                                    alignStyles[column.align || "left"]
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-slate-100 relative">
                    <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                            // Loading skeleton
                            <motion.tr
                                key="loading-skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={transition}
                            >
                                <td colSpan={columns.length} className="p-0">
                                    <div className="w-full">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <div key={index} className="flex border-b border-slate-100 last:border-0">
                                                {columns.map((column, colIndex) => (
                                                    <div
                                                        key={`skeleton-${index}-${colIndex}`}
                                                        className={cn(
                                                            "flex-1",
                                                            compact ? "px-4 py-2" : "px-6 py-4"
                                                        )}
                                                        style={{ width: column.width }}
                                                    >
                                                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </motion.tr>
                        ) : data.length === 0 ? (
                            // Empty state
                            <motion.tr
                                key="empty-state"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={transition}
                            >
                                <td
                                    colSpan={columns.length}
                                    className={cn(
                                        "text-center text-slate-500",
                                        compact ? "px-4 py-8" : "px-6 py-12"
                                    )}
                                >
                                    {emptyMessage}
                                </td>
                            </motion.tr>
                        ) : (
                            // Data rows
                            <React.Fragment>
                                {data.map((row, rowIndex) => (
                                    <motion.tr
                                        key={keyExtractor(row, rowIndex)}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        transition={{
                                            duration: 0.2,
                                            delay: rowIndex * 0.03, // Stagger effect
                                            ease: "easeOut"
                                        }}
                                        onClick={() => onRowClick?.(row)}
                                        className={cn(
                                            "transition-colors duration-100 group",
                                            hoverable && "hover:bg-slate-50 cursor-pointer",
                                            striped && rowIndex % 2 === 1 && "bg-slate-50/30"
                                        )}
                                    >
                                        {columns.map((column) => {
                                            const value = (row as any)[column.key];
                                            return (
                                                <td
                                                    key={column.key}
                                                    className={cn(
                                                        "text-sm text-slate-700",
                                                        compact ? "px-4 py-2" : "px-6 py-4",
                                                        alignStyles[column.align || "left"]
                                                    )}
                                                >
                                                    {column.render
                                                        ? column.render(value, row, rowIndex)
                                                        : String(value ?? "")}
                                                </td>
                                            );
                                        })}
                                    </motion.tr>
                                ))}
                            </React.Fragment>
                        )}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}

/**
 * Pagination component for tables
 */
export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
}: PaginationProps) {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const delta = 2;
        const pages: (number | "...")[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    const buttonBaseStyles = cn(
        "inline-flex items-center justify-center",
        "min-w-[36px] h-9 px-3",
        "text-sm font-medium rounded-lg",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    );

    return (
        <div className="flex items-center justify-between gap-4 px-2">
            {/* Items info */}
            {totalItems !== undefined && itemsPerPage && (
                <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                        {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-slate-700">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">{totalItems}</span> results
                </p>
            )}

            {/* Page buttons */}
            <div className="flex items-center gap-1">
                {/* First page */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(1)}
                    disabled={!canGoPrevious}
                    className={cn(
                        buttonBaseStyles,
                        !canGoPrevious
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    <ChevronsLeft size={16} />
                </motion.button>

                {/* Previous page */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className={cn(
                        buttonBaseStyles,
                        !canGoPrevious
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    <ChevronLeft size={16} />
                </motion.button>

                {/* Visible pages */}
                {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span className="px-2 text-slate-400">...</span>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    buttonBaseStyles,
                                    currentPage === page
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                {page}
                            </motion.button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next page */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className={cn(
                        buttonBaseStyles,
                        !canGoNext
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    <ChevronRight size={16} />
                </motion.button>

                {/* Last page */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(totalPages)}
                    disabled={!canGoNext}
                    className={cn(
                        buttonBaseStyles,
                        !canGoNext
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                >
                    <ChevronsRight size={16} />
                </motion.button>
            </div>
        </div>
    );
}
