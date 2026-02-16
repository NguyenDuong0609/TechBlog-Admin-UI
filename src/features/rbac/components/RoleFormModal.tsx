"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Modal, Button, Badge } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, ShieldCheck, Lock, Clock } from "lucide-react";
import type { Role, RoleFormData } from "../types";
import { permissionManifest, ROLE_TEMPLATES, ALL_PERMISSION_IDS, PERMISSION_DEPENDENCIES } from "../constants";

interface RoleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoleFormData) => boolean | void;
    mode: "create" | "edit";
    existingRole?: Role | null;
    roles: Role[];
}

export function RoleFormModal({ isOpen, onClose, onSubmit, mode, existingRole, roles }: RoleFormModalProps) {
    const isSystem = existingRole?.isSystem ?? false;
    const isReadOnly = mode === "edit" && isSystem;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [template, setTemplate] = useState("viewer");
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});
    const [nameError, setNameError] = useState("");

    // Initialize form data when modal opens
    React.useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && existingRole) {
                setName(existingRole.name);
                setDescription(existingRole.description);
                setPermissions({ ...existingRole.permissions });
                setTemplate("");
            } else {
                setName("");
                setDescription("");
                setTemplate("viewer");
                // Set initial permissions from template
                const templateRole = roles.find(r => r.id === "viewer");
                setPermissions(templateRole ? { ...templateRole.permissions } : Object.fromEntries(ALL_PERMISSION_IDS.map(id => [id, false])));
            }
            setNameError("");
        }
    }, [isOpen, mode, existingRole, roles]);

    // Apply template
    const handleTemplateChange = (templateId: string) => {
        setTemplate(templateId);
        if (templateId === "blank") {
            setPermissions(Object.fromEntries(ALL_PERMISSION_IDS.map(id => [id, false])));
        } else {
            const source = roles.find(r => r.id === templateId);
            if (source) {
                setPermissions({ ...source.permissions });
            }
        }
    };

    const handleTogglePermission = (permId: string) => {
        if (isReadOnly) return;
        setPermissions(prev => {
            const next = { ...prev, [permId]: !prev[permId] };
            // Auto-enable dependencies
            if (!prev[permId]) {
                for (const dep of PERMISSION_DEPENDENCIES) {
                    if (dep.permission === permId && !next[dep.requires]) {
                        next[dep.requires] = true;
                    }
                }
            } else {
                for (const dep of PERMISSION_DEPENDENCIES) {
                    if (dep.requires === permId && next[dep.permission]) {
                        next[dep.permission] = false;
                    }
                }
            }
            return next;
        });
    };

    const validateName = (): boolean => {
        if (!name.trim()) {
            setNameError("Role name is required");
            return false;
        }
        const isDuplicate = roles.some(r =>
            r.name.toLowerCase() === name.trim().toLowerCase() &&
            r.id !== existingRole?.id
        );
        if (isDuplicate) {
            setNameError("A role with this name already exists");
            return false;
        }
        setNameError("");
        return true;
    };

    const handleSubmit = () => {
        if (!validateName()) return;
        onSubmit({ name: name.trim(), description: description.trim(), cloneFrom: template, permissions });
    };

    const enabledCount = Object.values(permissions).filter(Boolean).length;

    return (
        <Modal
            title={mode === "create" ? "Create New Role" : isReadOnly ? `View Role: ${existingRole?.name}` : `Edit Role: ${existingRole?.name}`}
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <div className="space-y-6">
                {/* System role notice */}
                {isReadOnly && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <Lock size={16} className="text-slate-400" />
                        <p className="text-xs text-slate-600 font-medium">System roles are read-only and cannot be modified.</p>
                    </div>
                )}

                {/* Last modified */}
                {mode === "edit" && existingRole?.lastModified && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <Clock size={12} />
                        Last modified by <span className="font-bold text-slate-500">{existingRole.lastModified.by}</span> on{" "}
                        {new Date(existingRole.lastModified.at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                    <Input
                        label="Role Name"
                        placeholder="e.g. Content Reviewer"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setNameError(""); }}
                        disabled={isReadOnly}
                    />
                    {nameError && <p className="text-xs text-red-500 font-medium">{nameError}</p>}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        className={cn(
                            "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-20 italic transition-all",
                            isReadOnly && "bg-slate-50 cursor-not-allowed opacity-60"
                        )}
                        placeholder="Describe what users in this role can do"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>

                {/* Template selector (create only) */}
                {mode === "create" && (
                    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-600 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-slate-400" />
                            Start from template
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {ROLE_TEMPLATES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => handleTemplateChange(t.value)}
                                    className={cn(
                                        "px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center",
                                        template === t.value
                                            ? "bg-white border-indigo-500 text-indigo-600 shadow-sm ring-1 ring-indigo-500/20"
                                            : "bg-white/50 border-slate-200 text-slate-500 hover:border-slate-400"
                                    )}
                                >
                                    {t.label.split(" (")[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Permission checklist */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-600">Permissions</h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                            {enabledCount} of {ALL_PERMISSION_IDS.length} enabled
                        </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {permissionManifest.map(group => (
                            <div key={group.groupName}>
                                <div className="px-4 py-2 bg-slate-50/80">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{group.groupName}</p>
                                </div>
                                {group.items.map(item => (
                                    <label
                                        key={item.id}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/50 transition-colors",
                                            isReadOnly && "cursor-not-allowed"
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={permissions[item.id] ?? false}
                                            onChange={() => handleTogglePermission(item.id)}
                                            disabled={isReadOnly}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                            {item.critical && (
                                                <Badge variant="warning" size="sm" className="text-[7px] ml-1.5 uppercase h-3.5 px-1">
                                                    Critical
                                                </Badge>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                {!isReadOnly && (
                    <Button variant="primary" onClick={handleSubmit} disabled={!name.trim()}>
                        {mode === "create" ? "Create Role" : "Save Changes"}
                    </Button>
                )}
            </div>
        </Modal>
    );
}
