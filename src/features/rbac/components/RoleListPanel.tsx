"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import {
    ShieldCheck, Search, Copy, Edit2, Trash2, Lock, Plus
} from "lucide-react";
import type { Role } from "../types";

interface RoleListPanelProps {
    roles: Role[];
    filteredRoles: Role[];
    selectedRoleId: string;
    searchQuery: string;
    isDirty: boolean;
    isReviewMode: boolean;
    onSearch: (query: string) => void;
    onSelect: (roleId: string) => void;
    onDuplicate: (roleId: string) => void;
    onEdit: (roleId: string) => void;
    onDelete: (roleId: string) => void;
    onCreate: () => void;
}

export function RoleListPanel({
    roles,
    filteredRoles,
    selectedRoleId,
    searchQuery,
    isDirty,
    isReviewMode,
    onSearch,
    onSelect,
    onDuplicate,
    onEdit,
    onDelete,
    onCreate,
}: RoleListPanelProps) {
    return (
        <div className="space-y-4 lg:col-span-1">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Security Groups
                </h3>
                <Badge size="sm" variant="default" className="bg-slate-100 text-slate-500 border-none tabular-nums">
                    {filteredRoles.length}
                </Badge>
            </div>

            {/* Search */}
            <div className="relative group/search">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Role list */}
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                {filteredRoles.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <ShieldCheck size={32} className="mx-auto text-slate-300 mb-3 opacity-50" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No roles found</p>
                        <p className="text-[10px] text-slate-400 italic mt-1 mb-4">
                            {searchQuery ? "Try a different keyword" : "Create your first custom role"}
                        </p>
                        {!searchQuery && !isReviewMode && (
                            <button
                                onClick={onCreate}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                            >
                                <Plus size={12} />
                                Create Role
                            </button>
                        )}
                    </div>
                ) : (
                    filteredRoles.map(role => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            isSelected={selectedRoleId === role.id}
                            isReviewMode={isReviewMode}
                            onSelect={() => onSelect(role.id)}
                            onDuplicate={() => onDuplicate(role.id)}
                            onEdit={() => onEdit(role.id)}
                            onDelete={() => onDelete(role.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual role card
// ─────────────────────────────────────────────────────────────────────────────
interface RoleCardProps {
    role: Role;
    isSelected: boolean;
    isReviewMode: boolean;
    onSelect: () => void;
    onDuplicate: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function RoleCard({ role, isSelected, isReviewMode, onSelect, onDuplicate, onEdit, onDelete }: RoleCardProps) {
    return (
        <div
            onClick={onSelect}
            className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                isSelected
                    ? "bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-500/10 scale-[1.02]"
                    : "bg-white/50 border-slate-100 hover:border-slate-300 hover:bg-white"
            )}
        >
            {/* Active indicator */}
            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Badge variant={role.color as any} size="sm" className="font-bold flex-shrink-0">
                        {role.name}
                    </Badge>
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                        {role.userCount} {role.userCount === 1 ? "User" : "Users"}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                        className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Duplicate Role"
                    >
                        <Copy size={12} />
                    </button>

                    {!role.isSystem && !isReviewMode && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Edit Role"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete Role"
                            >
                                <Trash2 size={12} />
                            </button>
                        </>
                    )}

                    {role.isSystem && (
                        <div className="relative p-1 text-slate-300 cursor-not-allowed group/lock">
                            <Lock size={12} />
                            <div className="absolute hidden group-hover/lock:block bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-[9px] text-white rounded-lg shadow-xl whitespace-nowrap z-50">
                                System roles cannot be modified or deleted
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                {role.description}
            </p>

            {/* Last modified */}
            {role.lastModified && (
                <p className="text-[9px] text-slate-400 mt-2 font-medium">
                    Modified by {role.lastModified.by} • {new Date(role.lastModified.at).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}
