"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Modal, Button, Badge } from "@/components/ui";
import { ArrowRight, Plus, Minus, Users } from "lucide-react";
import type { PermissionChange } from "../types";
import { MOCK_USERS } from "../constants";

interface PermissionPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    changes: PermissionChange[];
    roleName: string;
    roleId: string;
}

export function PermissionPreviewModal({
    isOpen, onClose, onConfirm, changes, roleName, roleId
}: PermissionPreviewModalProps) {
    const affectedUsers = MOCK_USERS.filter(u => u.roleId === roleId).length;
    const added = changes.filter(c => c.to);
    const removed = changes.filter(c => !c.to);

    return (
        <Modal title="Review Permission Changes" isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-5">
                {/* Summary */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-center flex-1">
                        <p className="text-lg font-black text-slate-800">{changes.length}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Changes</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-center flex-1">
                        <p className="text-lg font-black text-indigo-600">{affectedUsers}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                            <Users size={10} /> Affected
                        </p>
                    </div>
                </div>

                {/* Change list */}
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {added.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-emerald-50/50">
                                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                                    Permissions Added ({added.length})
                                </p>
                            </div>
                            {added.map(c => (
                                <div key={c.id} className="px-4 py-2.5 flex items-center gap-2">
                                    <Plus size={12} className="text-emerald-500" />
                                    <span className="text-xs font-medium text-slate-700">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {removed.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-red-50/50">
                                <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider">
                                    Permissions Removed ({removed.length})
                                </p>
                            </div>
                            {removed.map(c => (
                                <div key={c.id} className="px-4 py-2.5 flex items-center gap-2">
                                    <Minus size={12} className="text-red-500" />
                                    <span className="text-xs font-medium text-slate-700">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Impact notice */}
                {affectedUsers > 0 && removed.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                        <span className="font-bold">{affectedUsers}</span> {affectedUsers === 1 ? "user" : "users"} will lose access to{" "}
                        <span className="font-bold">{removed.length}</span> {removed.length === 1 ? "permission" : "permissions"}.
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onConfirm}>Confirm & Save</Button>
            </div>
        </Modal>
    );
}
