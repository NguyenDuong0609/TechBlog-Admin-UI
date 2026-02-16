"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Role, Toast, RoleFormData, PermissionChange } from "../types";
import {
    INITIAL_ROLES, MOCK_USERS, INITIAL_LOGS,
    permissionManifest, PERMISSION_DEPENDENCIES,
    ALL_PERMISSION_IDS, CRITICAL_PERMISSIONS
} from "../constants";

let toastCounter = 0;

export function useRBAC() {
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("admin");
    const [activePermissions, setActivePermissions] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<"permissions" | "users" | "logs">("permissions");
    const [searchQuery, setSearchQuery] = useState("");
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);
    const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
    const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
    const [pendingCriticalPermission, setPendingCriticalPermission] = useState<string | null>(null);

    // Derived state
    const activeRole = useMemo(() => roles.find(r => r.id === selectedRoleId) || roles[0], [roles, selectedRoleId]);
    const editingRole = useMemo(() => editingRoleId ? roles.find(r => r.id === editingRoleId) ?? null : null, [roles, editingRoleId]);
    const deletingRole = useMemo(() => deletingRoleId ? roles.find(r => r.id === deletingRoleId) ?? null : null, [roles, deletingRoleId]);

    const filteredRoles = useMemo(() =>
        roles.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase())
        ), [roles, searchQuery]);

    const isDirty = useMemo(() =>
        JSON.stringify(activePermissions) !== JSON.stringify(activeRole.permissions),
        [activePermissions, activeRole.permissions]);

    const usersForRole = useCallback((roleId: string) =>
        MOCK_USERS.filter(u => u.roleId === roleId), []);

    const logsForRole = useCallback((roleId: string) =>
        INITIAL_LOGS.filter(l => l.roleId === roleId), []);

    const affectedUsersCount = useMemo(() =>
        deletingRoleId ? MOCK_USERS.filter(u => u.roleId === deletingRoleId).length : 0,
        [deletingRoleId]);

    // Permission change preview
    const permissionChanges = useMemo<PermissionChange[]>(() => {
        const changes: PermissionChange[] = [];
        const allItems = permissionManifest.flatMap(g => g.items);
        for (const item of allItems) {
            const from = activeRole.permissions[item.id] ?? false;
            const to = activePermissions[item.id] ?? false;
            if (from !== to) {
                changes.push({ id: item.id, label: item.label, from, to });
            }
        }
        return changes;
    }, [activeRole.permissions, activePermissions]);

    // Sync permissions when active role changes
    useEffect(() => {
        setActivePermissions({ ...activeRole.permissions });
    }, [selectedRoleId, activeRole.permissions]);

    // Toast helpers
    const addToast = useCallback((type: Toast["type"], title: string, message?: string) => {
        const id = `toast-${++toastCounter}`;
        setToasts(prev => [...prev, { id, type, title, message, duration: 4000 }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Permission toggle with dependency & critical checks
    const handleTogglePermission = useCallback((permissionId: string) => {
        const currentValue = activePermissions[permissionId];

        // Disabling a critical permission -> show warning
        if (currentValue && CRITICAL_PERMISSIONS.includes(permissionId)) {
            setPendingCriticalPermission(permissionId);
            setIsCriticalModalOpen(true);
            return;
        }

        setActivePermissions(prev => {
            const next = { ...prev, [permissionId]: !currentValue };

            if (!currentValue) {
                // Enabling: also enable dependencies
                for (const dep of PERMISSION_DEPENDENCIES) {
                    if (dep.permission === permissionId && !next[dep.requires]) {
                        next[dep.requires] = true;
                    }
                }
            } else {
                // Disabling: also disable dependents
                for (const dep of PERMISSION_DEPENDENCIES) {
                    if (dep.requires === permissionId && next[dep.permission]) {
                        next[dep.permission] = false;
                    }
                }
            }

            return next;
        });
    }, [activePermissions]);

    const confirmCriticalPermission = useCallback(() => {
        if (!pendingCriticalPermission) return;
        setActivePermissions(prev => {
            const next = { ...prev, [pendingCriticalPermission]: false };
            // Also disable dependents
            for (const dep of PERMISSION_DEPENDENCIES) {
                if (dep.requires === pendingCriticalPermission && next[dep.permission]) {
                    next[dep.permission] = false;
                }
            }
            return next;
        });
        setPendingCriticalPermission(null);
        setIsCriticalModalOpen(false);
    }, [pendingCriticalPermission]);

    const cancelCriticalPermission = useCallback(() => {
        setPendingCriticalPermission(null);
        setIsCriticalModalOpen(false);
    }, []);

    // Select all / deselect all per group
    const handleToggleGroup = useCallback((groupItems: { id: string }[]) => {
        setActivePermissions(prev => {
            const someDisabled = groupItems.some(i => !prev[i.id]);
            const next = { ...prev };
            groupItems.forEach(i => { next[i.id] = someDisabled; });

            // If enabling, also enable dependencies
            if (someDisabled) {
                for (const item of groupItems) {
                    for (const dep of PERMISSION_DEPENDENCIES) {
                        if (dep.permission === item.id && !next[dep.requires]) {
                            next[dep.requires] = true;
                        }
                    }
                }
            }

            return next;
        });
    }, []);

    // Save changes
    const handleSaveChanges = useCallback(() => {
        // Validate: at least one permission must be enabled
        const hasAny = Object.values(activePermissions).some(v => v);
        if (!hasAny) {
            addToast("error", "Cannot save", "A role must have at least one permission enabled.");
            return;
        }

        setIsSaving(true);
        // Simulate async save
        setTimeout(() => {
            setRoles(prev => prev.map(r =>
                r.id === selectedRoleId
                    ? { ...r, permissions: { ...activePermissions }, lastModified: { by: "John Doe", at: new Date().toISOString() } }
                    : r
            ));
            setIsSaving(false);
            addToast("success", "Changes saved", `Permissions for ${activeRole.name} updated successfully.`);
        }, 600);
    }, [activePermissions, selectedRoleId, activeRole.name, addToast]);

    // Save with preview
    const handleSaveWithPreview = useCallback(() => {
        if (permissionChanges.length > 0) {
            setIsPreviewModalOpen(true);
        } else {
            handleSaveChanges();
        }
    }, [permissionChanges, handleSaveChanges]);

    const confirmSaveFromPreview = useCallback(() => {
        setIsPreviewModalOpen(false);
        handleSaveChanges();
    }, [handleSaveChanges]);

    const handleCancelChanges = useCallback(() => {
        setActivePermissions({ ...activeRole.permissions });
    }, [activeRole.permissions]);

    // Duplicate role
    const handleDuplicateRole = useCallback((roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        const newRole: Role = {
            ...role,
            id: `${role.id}-copy-${Date.now()}`,
            name: `${role.name} (Copy)`,
            isSystem: false,
            userCount: 0,
            lastModified: { by: "John Doe", at: new Date().toISOString() }
        };
        setRoles(prev => [...prev, newRole]);
        setSelectedRoleId(newRole.id);
        addToast("success", "Role duplicated", `"${newRole.name}" created from "${role.name}".`);
    }, [roles, addToast]);

    // Create role
    const handleCreateRole = useCallback((data: RoleFormData) => {
        // Validate unique name
        if (roles.some(r => r.name.toLowerCase() === data.name.toLowerCase())) {
            addToast("error", "Name already exists", "Choose a different role name.");
            return false;
        }

        const newRole: Role = {
            id: data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
            name: data.name,
            description: data.description,
            isSystem: false,
            color: "info",
            status: "active",
            userCount: 0,
            permissions: { ...data.permissions },
            lastModified: { by: "John Doe", at: new Date().toISOString() }
        };

        setRoles(prev => [...prev, newRole]);
        setSelectedRoleId(newRole.id);
        setIsCreateModalOpen(false);
        addToast("success", "Role created", `"${newRole.name}" has been created.`);
        return true;
    }, [roles, addToast]);

    // Update role meta
    const handleUpdateRole = useCallback((data: RoleFormData) => {
        if (!editingRoleId) return false;
        // Validate unique name
        if (roles.some(r => r.id !== editingRoleId && r.name.toLowerCase() === data.name.toLowerCase())) {
            addToast("error", "Name already exists", "Choose a different role name.");
            return false;
        }

        setRoles(prev => prev.map(r =>
            r.id === editingRoleId
                ? {
                    ...r,
                    name: data.name,
                    description: data.description,
                    permissions: { ...data.permissions },
                    lastModified: { by: "John Doe", at: new Date().toISOString() }
                }
                : r
        ));
        setIsEditModalOpen(false);
        setEditingRoleId(null);
        addToast("success", "Role updated", `"${data.name}" has been updated.`);
        return true;
    }, [editingRoleId, roles, addToast]);

    // Delete role
    const handleDeleteRole = useCallback((replacementRoleId?: string) => {
        if (!deletingRoleId) return;

        // Safety: cannot delete last admin role
        const adminRoles = roles.filter(r => r.permissions["rbac.manage"]);
        if (adminRoles.length <= 1 && adminRoles[0]?.id === deletingRoleId) {
            addToast("error", "Cannot delete", "This is the last role with admin privileges.");
            return;
        }

        setIsDeleting(true);
        setTimeout(() => {
            const roleName = roles.find(r => r.id === deletingRoleId)?.name;
            setRoles(prev => prev.filter(r => r.id !== deletingRoleId));
            if (selectedRoleId === deletingRoleId) setSelectedRoleId("admin");
            setIsDeleteModalOpen(false);
            setDeletingRoleId(null);
            setIsDeleting(false);
            addToast("success", "Role deleted", `"${roleName}" has been permanently removed.${replacementRoleId ? " Users reassigned." : ""}`);
        }, 600);
    }, [deletingRoleId, roles, selectedRoleId, addToast]);

    // Open edit modal
    const openEditModal = useCallback((roleId: string) => {
        setEditingRoleId(roleId);
        setIsEditModalOpen(true);
    }, []);

    // Open delete modal
    const openDeleteModal = useCallback((roleId: string) => {
        setDeletingRoleId(roleId);
        setIsDeleteModalOpen(true);
    }, []);

    // Switch role with unsaved changes check
    const handleSelectRole = useCallback((roleId: string) => {
        if (isDirty && !window.confirm("You have unsaved changes. Switch anyway?")) return;
        setSelectedRoleId(roleId);
    }, [isDirty]);

    // Export roles as JSON
    const handleExportRoles = useCallback(() => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roles, null, 2));
        const anchor = document.createElement("a");
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", "rbac_roles_config.json");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        addToast("success", "Exported", "Roles configuration downloaded as JSON.");
    }, [roles, addToast]);

    // Import roles from JSON
    const handleImportRoles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (Array.isArray(imported)) {
                    setRoles(imported);
                    addToast("success", "Imported", `${imported.length} roles loaded from file.`);
                } else {
                    addToast("error", "Invalid format", "Expected an array of roles.");
                }
            } catch {
                addToast("error", "Import failed", "Invalid JSON file.");
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = "";
    }, [addToast]);

    // Keyboard shortcut: Ctrl+S
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (isDirty && !activeRole.isSystem) {
                    handleSaveWithPreview();
                }
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isDirty, activeRole.isSystem, handleSaveWithPreview]);

    return {
        // State
        roles, filteredRoles, selectedRoleId, activeRole, activePermissions,
        activeTab, setActiveTab, searchQuery, setSearchQuery,
        isDirty, isSaving, isDeleting, toasts, permissionChanges,

        // Modal states
        isCreateModalOpen, setIsCreateModalOpen,
        isEditModalOpen, setIsEditModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        isPreviewModalOpen, setIsPreviewModalOpen,
        isCriticalModalOpen,
        isBulkAssignOpen, setIsBulkAssignOpen,
        editingRole, deletingRole, affectedUsersCount,
        pendingCriticalPermission,

        // Handlers
        handleSelectRole, handleTogglePermission, handleToggleGroup,
        handleSaveChanges, handleSaveWithPreview, confirmSaveFromPreview,
        handleCancelChanges,
        handleDuplicateRole, handleCreateRole, handleUpdateRole, handleDeleteRole,
        openEditModal, openDeleteModal,
        confirmCriticalPermission, cancelCriticalPermission,
        handleExportRoles, handleImportRoles,
        addToast, removeToast,
        usersForRole, logsForRole,
    };
}
