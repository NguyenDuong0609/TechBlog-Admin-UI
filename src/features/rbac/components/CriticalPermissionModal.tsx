"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Modal, Button } from "@/components/ui";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { permissionManifest } from "../constants";

interface CriticalPermissionModalProps {
    isOpen: boolean;
    permissionId: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function CriticalPermissionModal({ isOpen, permissionId, onConfirm, onCancel }: CriticalPermissionModalProps) {
    const permission = permissionManifest
        .flatMap(g => g.items)
        .find(i => i.id === permissionId);

    if (!permission) return null;

    return (
        <Modal title="Disable Critical Permission" isOpen={isOpen} onClose={onCancel} size="sm">
            <div className="space-y-5">
                <div className="flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                        <ShieldAlert size={28} className="text-amber-500" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-slate-800">
                        Disable &ldquo;{permission.label}&rdquo;?
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        This is a high-privilege permission. Disabling it may restrict the ability to manage critical system functions.
                    </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 leading-relaxed">
                            Users with this role may lose access to {permission.label.toLowerCase()} functions. Ensure another role retains these privileges.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onCancel}>Keep Enabled</Button>
                <Button variant="danger" onClick={onConfirm}>Disable Permission</Button>
            </div>
        </Modal>
    );
}
