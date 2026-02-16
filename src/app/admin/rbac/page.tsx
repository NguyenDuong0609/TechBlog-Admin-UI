"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common";
import { Button, Badge } from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import {
    ShieldCheck, Plus, Lock, Upload, Download,
    CheckCircle2, AlertCircle, ChevronRight,
    History, Users
} from "lucide-react";
import { useReviewMode } from "@/providers/ReviewModeProvider";
import { useRBAC } from "@/features/rbac/hooks/useRBAC";
import {
    RoleListPanel,
    PermissionMatrix,
    UsersTab,
    AuditLogTab,
    RoleFormModal,
    DeleteRoleModal,
    CriticalPermissionModal,
    PermissionPreviewModal,
    FloatingSaveBar,
    BulkAssignModal,
} from "@/features/rbac/components";

export default function RBACPage() {
    const { isReviewMode } = useReviewMode();
    const rbac = useRBAC();

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Settings</span>
                <ChevronRight size={10} />
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Access Control</span>
                <ChevronRight size={10} />
                <span className="text-indigo-600 font-bold">{rbac.activeRole.name}</span>
            </nav>

            {/* Page Header */}
            <PageHeader
                title="Access Control"
                description="Manage roles and granular permissions"
                icon={ShieldCheck}
                actions={
                    <div className="flex items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".json"
                            onChange={rbac.handleImportRoles}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Upload}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Import
                        </Button>
                        <Button variant="ghost" size="sm" onClick={rbac.handleExportRoles} icon={Download}>
                            Export
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => rbac.setIsCreateModalOpen(true)}
                            disabled={isReviewMode}
                        >
                            <Plus size={16} className="mr-2" />
                            New Role
                        </Button>
                    </div>
                }
            />

            {/* Review Mode Banner */}
            {isReviewMode && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <Lock size={18} className="text-amber-600" />
                    <div>
                        <p className="text-sm font-bold text-amber-900 leading-none">Review mode is active</p>
                        <p className="text-xs text-amber-700 mt-1">Permission changes are disabled for platform safety.</p>
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Panel: Roles */}
                <RoleListPanel
                    roles={rbac.roles}
                    filteredRoles={rbac.filteredRoles}
                    selectedRoleId={rbac.selectedRoleId}
                    searchQuery={rbac.searchQuery}
                    isDirty={rbac.isDirty}
                    isReviewMode={isReviewMode}
                    onSearch={rbac.setSearchQuery}
                    onSelect={rbac.handleSelectRole}
                    onDuplicate={(id) => rbac.handleDuplicateRole(id)}
                    onEdit={(id) => rbac.openEditModal(id)}
                    onDelete={(id) => rbac.openDeleteModal(id)}
                    onCreate={() => rbac.setIsCreateModalOpen(true)}
                />

                {/* Right Panel: Permission Matrix / Users / Logs */}
                <div className="lg:col-span-3 space-y-6 relative">
                    {/* Sticky Header */}
                    <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 -mx-4 px-4 py-3 lg:-mx-6 lg:px-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl border border-indigo-200 shadow-sm text-indigo-600">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-800 tracking-tight">
                                    Permissions for <span className="text-indigo-600">{rbac.activeRole.name}</span>
                                </h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant={rbac.activeRole.isSystem ? "default" : "info"} size="sm" className="text-[9px] uppercase tracking-wider h-4">
                                        {rbac.activeRole.isSystem ? "System Role" : "Custom Role"}
                                    </Badge>
                                    {rbac.isDirty && (
                                        <span className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold animate-pulse">
                                            <AlertCircle size={10} /> Unsaved Changes
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Tabs */}
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
                                {[
                                    { id: "permissions" as const, label: "Matrix", icon: ShieldCheck },
                                    { id: "users" as const, label: "Users", icon: Users },
                                    { id: "logs" as const, label: "Audit", icon: History },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => rbac.setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                                            rbac.activeTab === tab.id
                                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        <tab.icon size={12} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Save / Discard buttons (visible in header) */}
                            {rbac.activeTab === "permissions" && rbac.isDirty && !rbac.activeRole.isSystem && (
                                <>
                                    <Button variant="ghost" size="sm" onClick={rbac.handleCancelChanges} disabled={isReviewMode}>
                                        Discard
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={rbac.handleSaveWithPreview} disabled={isReviewMode || rbac.isSaving}>
                                        <CheckCircle2 size={14} className="mr-1.5" />
                                        Save Changes
                                    </Button>
                                </>
                            )}

                            {/* Read-only indicator */}
                            {rbac.activeRole.isSystem && rbac.activeTab === "permissions" && (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 relative group/syslock cursor-help">
                                    <Lock size={12} /> SYSTEM LOCKED
                                    <div className="absolute hidden group-hover/syslock:block top-full right-0 mt-2 p-3 bg-slate-900 text-[10px] text-white rounded-lg shadow-xl whitespace-nowrap z-50 font-normal">
                                        System roles cannot be modified or deleted.
                                        <br />
                                        Duplicate this role to create an editable copy.
                                        <div className="absolute bottom-full right-4 border-4 border-transparent border-b-slate-900" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6 pb-20">
                        {rbac.activeTab === "permissions" && (
                            <PermissionMatrix
                                activePermissions={rbac.activePermissions}
                                isSystemRole={rbac.activeRole.isSystem}
                                isReviewMode={isReviewMode}
                                onTogglePermission={rbac.handleTogglePermission}
                                onToggleGroup={rbac.handleToggleGroup}
                            />
                        )}

                        {rbac.activeTab === "users" && (
                            <UsersTab
                                users={rbac.usersForRole(rbac.activeRole.id)}
                                roleName={rbac.activeRole.name}
                                isReviewMode={isReviewMode}
                                onBulkAssign={() => rbac.setIsBulkAssignOpen(true)}
                            />
                        )}

                        {rbac.activeTab === "logs" && (
                            <AuditLogTab logs={rbac.logsForRole(rbac.activeRole.id)} />
                        )}
                    </div>
                </div>

                {/* Security Tip */}
                <div className="lg:col-span-1 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-3 h-fit mt-auto lg:sticky lg:bottom-6">
                    <AlertCircle className="text-indigo-600 flex-shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-indigo-900 leading-none">Security Tip</p>
                        <p className="text-[11px] text-indigo-700 leading-relaxed italic">
                            Prefer custom roles for specific team needs. Never modify System Roles if external integrations rely on static permission mappings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Save Bar */}
            <FloatingSaveBar
                isDirty={rbac.isDirty}
                isSaving={rbac.isSaving}
                isReviewMode={isReviewMode}
                isSystemRole={rbac.activeRole.isSystem}
                onSave={rbac.handleSaveWithPreview}
                onDiscard={rbac.handleCancelChanges}
            />

            {/* Create Role Modal */}
            <RoleFormModal
                isOpen={rbac.isCreateModalOpen}
                onClose={() => rbac.setIsCreateModalOpen(false)}
                onSubmit={rbac.handleCreateRole}
                mode="create"
                roles={rbac.roles}
            />

            {/* Edit Role Modal */}
            <RoleFormModal
                isOpen={rbac.isEditModalOpen}
                onClose={() => rbac.setIsEditModalOpen(false)}
                onSubmit={rbac.handleUpdateRole}
                mode="edit"
                existingRole={rbac.editingRole}
                roles={rbac.roles}
            />

            {/* Delete Role Modal */}
            <DeleteRoleModal
                isOpen={rbac.isDeleteModalOpen}
                onClose={() => rbac.setIsDeleteModalOpen(false)}
                onDelete={rbac.handleDeleteRole}
                role={rbac.deletingRole}
                roles={rbac.roles}
                affectedUsers={rbac.affectedUsersCount}
                isDeleting={rbac.isDeleting}
            />

            {/* Critical Permission Modal */}
            <CriticalPermissionModal
                isOpen={rbac.isCriticalModalOpen}
                permissionId={rbac.pendingCriticalPermission}
                onConfirm={rbac.confirmCriticalPermission}
                onCancel={rbac.cancelCriticalPermission}
            />

            {/* Permission Preview Modal */}
            <PermissionPreviewModal
                isOpen={rbac.isPreviewModalOpen}
                onClose={() => rbac.setIsPreviewModalOpen(false)}
                onConfirm={rbac.confirmSaveFromPreview}
                changes={rbac.permissionChanges}
                roleName={rbac.activeRole.name}
                roleId={rbac.activeRole.id}
            />

            {/* Bulk Assign Modal */}
            <BulkAssignModal
                isOpen={rbac.isBulkAssignOpen}
                onClose={() => rbac.setIsBulkAssignOpen(false)}
                roleId={rbac.activeRole.id}
                roleName={rbac.activeRole.name}
                onAssign={(userIds) => {
                    rbac.addToast("success", "Users assigned", `${userIds.length} users assigned to ${rbac.activeRole.name}.`);
                }}
            />

            {/* Toast Notifications */}
            <ToastContainer toasts={rbac.toasts} onRemove={rbac.removeToast} />
        </div>
    );
}
