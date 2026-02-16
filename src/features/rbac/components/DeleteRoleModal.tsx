"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal, Button, Badge } from "@/components/ui";
import { AlertCircle, Users, Loader2 } from "lucide-react";
import type { Role, User } from "../types";

interface DeleteRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (replacementRoleId?: string) => void;
    role: Role | null;
    roles: Role[];
    affectedUsers: number;
    isDeleting: boolean;
}

export function DeleteRoleModal({
    isOpen, onClose, onDelete, role, roles, affectedUsers, isDeleting
}: DeleteRoleModalProps) {
    const [replacementRoleId, setReplacementRoleId] = useState<string>("");

    React.useEffect(() => {
        if (isOpen) setReplacementRoleId("");
    }, [isOpen]);

    if (!role) return null;

    const availableRoles = roles.filter(r => r.id !== role.id);
    const canDelete = affectedUsers === 0 || replacementRoleId !== "";

    // Check if this is the last admin role
    const isLastAdmin = roles.filter(r => r.permissions["rbac.manage"]).length <= 1 &&
        role.permissions["rbac.manage"];

    return (
        <Modal title="Delete Role" isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-6">
                {/* Warning banner */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-800">This action is permanent</p>
                        <p className="text-xs text-red-600 mt-1 leading-relaxed">
                            The role <span className="font-bold">&ldquo;{role.name}&rdquo;</span> will be permanently deleted.
                            This cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Last admin role warning */}
                {isLastAdmin && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                        <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Cannot delete last admin role</p>
                            <p className="text-xs text-amber-600 mt-1">
                                At least one role with Access Control permission must exist.
                            </p>
                        </div>
                    </div>
                )}

                {/* Affected users */}
                {affectedUsers > 0 && !isLastAdmin && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Users size={16} className="text-slate-400" />
                            <span className="font-bold">{affectedUsers}</span>
                            <span>{affectedUsers === 1 ? "user has" : "users have"} this role</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Reassign users to:
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                value={replacementRoleId}
                                onChange={(e) => setReplacementRoleId(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="">Select a replacement role...</option>
                                {availableRoles.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} ({r.userCount} existing users)
                                    </option>
                                ))}
                            </select>
                            {!replacementRoleId && (
                                <p className="text-[10px] text-amber-600 font-medium">
                                    A replacement role is required when users are assigned
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose} disabled={isDeleting}>Cancel</Button>
                <Button
                    variant="danger"
                    onClick={() => onDelete(replacementRoleId || undefined)}
                    disabled={!canDelete || isLastAdmin || isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 size={14} className="mr-1.5 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        "Delete Permanently"
                    )}
                </Button>
            </div>
        </Modal>
    );
}
