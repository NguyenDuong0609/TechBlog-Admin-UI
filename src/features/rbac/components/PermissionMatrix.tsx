"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardBody, Badge } from "@/components/ui";
import {
    CheckCircle2, Lock, FileText, TrendingUp, Settings, Link2, AlertTriangle
} from "lucide-react";
import { permissionManifest, PERMISSION_DEPENDENCIES } from "../constants";

const groupIcons: Record<string, React.ElementType> = {
    FileText,
    TrendingUp,
    Settings,
};

interface PermissionMatrixProps {
    activePermissions: Record<string, boolean>;
    isSystemRole: boolean;
    isReviewMode: boolean;
    onTogglePermission: (permissionId: string) => void;
    onToggleGroup: (groupItems: { id: string }[]) => void;
}

export function PermissionMatrix({
    activePermissions,
    isSystemRole,
    isReviewMode,
    onTogglePermission,
    onToggleGroup,
}: PermissionMatrixProps) {
    const isReadOnly = isReviewMode || isSystemRole;

    return (
        <div className="space-y-6">
            {permissionManifest.map(group => {
                const GroupIcon = groupIcons[group.icon] || FileText;
                const allEnabled = group.items.every(i => activePermissions[i.id]);
                const someEnabled = group.items.some(i => activePermissions[i.id]);

                return (
                    <Card key={group.groupName} className="border-slate-200/60 shadow-sm overflow-hidden group/card relative">
                        {/* Section header */}
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between group-hover/card:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <GroupIcon size={14} className="text-slate-500" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        {group.groupName}
                                    </h4>
                                    <p className="text-[9px] text-slate-400 mt-0.5">
                                        {group.items.filter(i => activePermissions[i.id]).length} of {group.items.length} enabled
                                    </p>
                                </div>
                            </div>

                            {!isReadOnly && (
                                <button
                                    onClick={() => onToggleGroup(group.items)}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
                                >
                                    {allEnabled ? "Deselect All" : "Select All"}
                                </button>
                            )}
                        </div>

                        <CardBody className="p-0">
                            <div className="divide-y divide-slate-50">
                                {group.items.map(item => {
                                    const isEnabled = activePermissions[item.id] ?? false;
                                    // Find dependencies
                                    const deps = PERMISSION_DEPENDENCIES.filter(d => d.permission === item.id);
                                    const hasMissingDeps = deps.some(d => !activePermissions[d.requires]);

                                    return (
                                        <div key={item.id} className="px-6 py-4 flex items-start justify-between hover:bg-slate-50/30 transition-colors">
                                            <div className="space-y-1.5 pr-6 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-bold text-slate-700">{item.label}</p>
                                                    {isSystemRole && isEnabled && (
                                                        <CheckCircle2 size={12} className="text-indigo-400" />
                                                    )}
                                                    {item.critical && (
                                                        <Badge variant="warning" size="sm" className="text-[8px] uppercase tracking-wider h-4 px-1.5">
                                                            Critical
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 italic leading-relaxed max-w-md">
                                                    {item.description}
                                                </p>

                                                {/* Dependency indicators */}
                                                {deps.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {deps.map(dep => (
                                                            <span
                                                                key={dep.requires}
                                                                className={cn(
                                                                    "inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full border",
                                                                    activePermissions[dep.requires]
                                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                                        : "bg-amber-50 text-amber-600 border-amber-200"
                                                                )}
                                                            >
                                                                {activePermissions[dep.requires] ? (
                                                                    <CheckCircle2 size={8} />
                                                                ) : (
                                                                    <Link2 size={8} />
                                                                )}
                                                                {dep.message}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Toggle switch */}
                                            <button
                                                onClick={() => onTogglePermission(item.id)}
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                                                    isEnabled ? "bg-indigo-600 shadow-inner shadow-indigo-700/50" : "bg-slate-200 shadow-inner shadow-slate-300",
                                                    isReadOnly && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <span className={cn(
                                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                                    isEnabled ? "translate-x-5" : "translate-x-0"
                                                )} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
