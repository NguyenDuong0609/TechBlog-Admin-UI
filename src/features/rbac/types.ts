export interface Role {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
    color: "primary" | "success" | "warning" | "danger" | "default" | "info";
    status: "active" | "disabled";
    permissions: Record<string, boolean>;
    userCount: number;
    lastModified?: {
        by: string;
        at: string;
    };
}

export interface PermissionItem {
    id: string;
    label: string;
    description: string;
    critical?: boolean;
}

export interface PermissionGroup {
    groupName: string;
    icon: string; // lucide icon name
    items: PermissionItem[];
}

export interface ActivityLog {
    id: string;
    action: string;
    roleId: string;
    performedBy: string;
    timestamp: string;
    details?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    avatar?: string;
    assignedDate?: string;
}

export interface RoleFormData {
    name: string;
    description: string;
    cloneFrom: string;
    permissions: Record<string, boolean>;
}

export interface PermissionDependency {
    permission: string;
    requires: string;
    message: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

export interface PermissionChange {
    id: string;
    label: string;
    from: boolean;
    to: boolean;
}
