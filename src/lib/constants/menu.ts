import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Tags,
    Users,
    User,
    Settings,
    BarChart3,
    Award,
    SlidersHorizontal,
    Globe,
    ShieldCheck,
    MessageSquare,
    FileEdit,
    type LucideIcon,
} from "lucide-react";

/**
 * Menu item structure for sidebar navigation
 */
export interface MenuItem {
    label: string;
    icon: LucideIcon;
    href: string;
    badge?: string | number;
    children?: MenuItem[];
}

/**
 * Admin sidebar menu configuration
 * Grouped for better navigation
 */
export const adminMenuGroups = [
    {
        title: "Main",
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                href: "/admin/dashboard",
            },
            {
                label: "Drafts",
                icon: FileEdit,
                href: "/admin/posts?status=draft",
                badge: 4,
            },
        ]
    },
    {
        title: "Publishing",
        items: [
            {
                label: "Posts",
                icon: FileText,
                href: "/admin/posts",
            },
            {
                label: "Categories",
                icon: FolderOpen,
                href: "/admin/categories",
            },
            {
                label: "Tags",
                icon: Tags,
                href: "/admin/tags",
            },
            {
                label: "Comments",
                icon: MessageSquare,
                href: "/admin/comments",
                badge: 12,
            },
        ]
    },
    {
        title: "Insights",
        items: [
            {
                label: "Analytics",
                icon: BarChart3,
                href: "/admin/analytics",
            },
            {
                label: "Content Quality",
                icon: Award,
                href: "/admin/content-quality",
            },
            {
                label: "SEO Audit",
                icon: Globe,
                href: "/admin/seo",
            },
        ]
    },
    {
        title: "Platform",
        items: [
            {
                label: "Users",
                icon: Users,
                href: "/admin/users",
            },
            {
                label: "Profile",
                icon: User,
                href: "/admin/profile",
            },
            {
                label: "Settings",
                icon: Settings,
                href: "/admin/settings",
            },
            {
                label: "System",
                icon: SlidersHorizontal,
                href: "/admin/system-settings",
            },
            {
                label: "Access Control",
                icon: ShieldCheck,
                href: "/admin/rbac",
            },
        ]
    }
];

// Compatibility constant (optional)
export const adminMenu = adminMenuGroups.flatMap(g => g.items);

export type { LucideIcon };
