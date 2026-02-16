import type { Role, User, ActivityLog, PermissionGroup, PermissionDependency } from "./types";

// Permission structure metadata with section icons
export const permissionManifest: PermissionGroup[] = [
    {
        groupName: "Content Management",
        icon: "FileText",
        items: [
            { id: "posts.read", label: "View Posts", description: "Access the posts list and dashboard views" },
            { id: "posts.write", label: "Manage Posts", description: "Create, edit and duplicate articles" },
            { id: "posts.delete", label: "Delete Posts", description: "Permanently remove content" },
            { id: "categories.manage", label: "Taxonomy", description: "Manage categories and tags" },
        ]
    },
    {
        groupName: "Marketing & SEO",
        icon: "TrendingUp",
        items: [
            { id: "seo.audit", label: "SEO Audit", description: "Run and view technical SEO reports" },
            { id: "seo.write", label: "Edit Meta", description: "Modify meta titles, descriptions and URLs" },
            { id: "analytics.view", label: "View Analytics", description: "View traffic and reading behavior data" },
        ]
    },
    {
        groupName: "System Control",
        icon: "Settings",
        items: [
            { id: "rbac.manage", label: "Access Control", description: "Invite users and manage roles", critical: true },
            { id: "settings.manage", label: "Site Settings", description: "Update global configuration and API keys", critical: true },
        ]
    }
];

// Permission dependencies
export const PERMISSION_DEPENDENCIES: PermissionDependency[] = [
    { permission: "posts.delete", requires: "posts.write", message: "Delete Posts requires Manage Posts enabled" },
    { permission: "posts.write", requires: "posts.read", message: "Manage Posts requires View Posts enabled" },
    { permission: "seo.write", requires: "seo.audit", message: "Edit Meta requires SEO Audit enabled" },
];

// All permission IDs for quick iteration
export const ALL_PERMISSION_IDS = permissionManifest.flatMap(g => g.items).map(i => i.id);

// Create full-access permissions object
const fullPermissions = Object.fromEntries(ALL_PERMISSION_IDS.map(id => [id, true]));

// Create a permissions object from a list of enabled permissions
function buildPermissions(enabled: string[]): Record<string, boolean> {
    return Object.fromEntries(ALL_PERMISSION_IDS.map(id => [id, enabled.includes(id)]));
}

export const INITIAL_ROLES: Role[] = [
    {
        id: "admin",
        name: "Admin",
        description: "Full system access & user management",
        isSystem: true,
        color: "primary",
        status: "active",
        userCount: 3,
        permissions: { ...fullPermissions }
    },
    {
        id: "editor",
        name: "Editor",
        description: "Content & SEO focus, no system configuration",
        isSystem: true,
        color: "success",
        status: "active",
        userCount: 8,
        permissions: buildPermissions(["posts.read", "posts.write", "categories.manage", "seo.audit", "seo.write", "analytics.view"])
    },
    {
        id: "viewer",
        name: "Viewer",
        description: "Read-only access for analytics and review",
        isSystem: true,
        color: "default",
        status: "active",
        userCount: 12,
        permissions: buildPermissions(["posts.read", "seo.audit", "analytics.view"])
    },
];

export const MOCK_USERS: User[] = [
    { id: "u1", name: "John Doe", email: "john@techblog.com", roleId: "admin", assignedDate: "2025-11-01T08:00:00Z" },
    { id: "u2", name: "Sarah Smith", email: "sarah@techblog.com", roleId: "editor", assignedDate: "2025-12-15T10:00:00Z" },
    { id: "u3", name: "Mike Ross", email: "mike@techblog.com", roleId: "editor", assignedDate: "2026-01-05T09:30:00Z" },
    { id: "u4", name: "Emma Wilson", email: "emma@techblog.com", roleId: "viewer", assignedDate: "2026-01-20T14:00:00Z" },
    { id: "u5", name: "Alex Chen", email: "alex@techblog.com", roleId: "admin", assignedDate: "2025-10-20T11:00:00Z" },
    { id: "u6", name: "Lisa Park", email: "lisa@techblog.com", roleId: "editor", assignedDate: "2026-02-01T16:00:00Z" },
    { id: "u7", name: "David Kim", email: "david@techblog.com", roleId: "viewer", assignedDate: "2026-01-28T08:30:00Z" },
    { id: "u8", name: "Anna Lee", email: "anna@techblog.com", roleId: "admin", assignedDate: "2025-09-10T07:45:00Z" },
];

export const INITIAL_LOGS: ActivityLog[] = [
    { id: "l1", action: "Permission Updated", roleId: "editor", performedBy: "John Doe", timestamp: "2026-02-10T09:00:00Z", details: "Enabled SEO technical audit access" },
    { id: "l2", action: "Role Created", roleId: "reviewer", performedBy: "John Doe", timestamp: "2026-02-09T14:30:00Z", details: "New role 'Reviewer' created from Viewer template" },
    { id: "l3", action: "Permission Updated", roleId: "admin", performedBy: "Anna Lee", timestamp: "2026-02-08T11:15:00Z", details: "Verified system role permissions" },
    { id: "l4", action: "Users Assigned", roleId: "editor", performedBy: "John Doe", timestamp: "2026-02-07T16:45:00Z", details: "Assigned 2 users to Editor role" },
    { id: "l5", action: "Role Duplicated", roleId: "viewer", performedBy: "Alex Chen", timestamp: "2026-02-06T10:20:00Z", details: "Duplicated Viewer role as 'Content Reviewer'" },
];

// Role templates for "Start from template" dropdown
export const ROLE_TEMPLATES = [
    { value: "blank", label: "Blank (No permissions)" },
    { value: "admin", label: "Administrator (Full access)" },
    { value: "editor", label: "Editor (Content & SEO)" },
    { value: "viewer", label: "Viewer (Read-only)" },
];

// Critical permissions that require confirmation to disable
export const CRITICAL_PERMISSIONS = ["rbac.manage", "settings.manage"];
