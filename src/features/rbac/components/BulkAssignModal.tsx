"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Modal, Button } from "@/components/ui";
import { Search, UserPlus, Check } from "lucide-react";
import { MOCK_USERS } from "../constants";
import type { User } from "../types";

interface BulkAssignModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleId: string;
    roleName: string;
    onAssign: (userIds: string[]) => void;
}

export function BulkAssignModal({ isOpen, onClose, roleId, roleName, onAssign }: BulkAssignModalProps) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Users NOT already in this role
    const availableUsers = useMemo(() =>
        MOCK_USERS.filter(u => u.roleId !== roleId), [roleId]);

    const filteredUsers = useMemo(() =>
        availableUsers.filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        ), [availableUsers, search]);

    React.useEffect(() => {
        if (isOpen) {
            setSearch("");
            setSelectedIds(new Set());
        }
    }, [isOpen]);

    const toggleUser = (userId: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(userId)) next.delete(userId);
            else next.add(userId);
            return next;
        });
    };

    const handleAssign = () => {
        onAssign(Array.from(selectedIds));
        onClose();
    };

    return (
        <Modal title={`Assign Users to ${roleName}`} isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                {/* User list */}
                <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                            No available users found
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <label
                                key={user.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                    selectedIds.has(user.id)
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "border-slate-300"
                                )}>
                                    {selectedIds.has(user.id) && <Check size={12} className="text-white" />}
                                </div>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-[9px] flex-shrink-0">
                                        {user.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-700 truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </label>
                        ))
                    )}
                </div>

                {selectedIds.size > 0 && (
                    <p className="text-xs text-indigo-600 font-medium">
                        {selectedIds.size} {selectedIds.size === 1 ? "user" : "users"} selected
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleAssign} disabled={selectedIds.size === 0}>
                    <UserPlus size={14} className="mr-1.5" />
                    Assign {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
                </Button>
            </div>
        </Modal>
    );
}
