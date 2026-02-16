"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { History, Filter, Shield, UserPlus, Copy, Edit2, Trash2 } from "lucide-react";
import type { ActivityLog } from "../types";

const actionIcons: Record<string, React.ElementType> = {
    "Permission Updated": Shield,
    "Role Created": Edit2,
    "Users Assigned": UserPlus,
    "Role Duplicated": Copy,
    "Role Deleted": Trash2,
};

interface AuditLogTabProps {
    logs: ActivityLog[];
}

export function AuditLogTab({ logs }: AuditLogTabProps) {
    if (logs.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <Filter size={32} className="mx-auto text-slate-200 mb-3 opacity-50" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    No recent activity
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Permission changes will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {logs.map((log, idx) => {
                const ActionIcon = actionIcons[log.action] || History;
                return (
                    <div
                        key={log.id}
                        className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-slate-200 transition-colors"
                    >
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                                <ActionIcon size={14} />
                            </div>
                            {idx < logs.length - 1 && (
                                <div className="w-px flex-1 bg-slate-100 mt-2" />
                            )}
                        </div>

                        <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-slate-700">{log.action}</p>
                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                    {formatRelativeTime(log.timestamp)}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                by <span className="font-bold text-slate-600">{log.performedBy}</span>
                                {log.details && (
                                    <span className="italic text-slate-400 ml-1">— {log.details}</span>
                                )}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
