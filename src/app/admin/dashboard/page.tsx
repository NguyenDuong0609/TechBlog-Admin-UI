"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/common";
import { Card, CardHeader, CardBody, Badge, Avatar, Table, type TableColumn } from "@/components/ui";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { cn, formatNumber } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Users,
    Eye,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    AlertTriangle,
    Minus,
    ExternalLink,
    Clock,
    Plus,
} from "lucide-react";
import { usePostList } from "@/features/posts/hooks/usePosts";
import { useUserList } from "@/features/users/hooks/useUsers";
import { Post, User } from "@prisma/client";
import { ChartDataPoint } from "./components/TrafficChart";

// Dynamically import Chart to avoid SSR hydration mismatch
const TrafficChart = dynamic(() => import("./components/TrafficChart"), { ssr: false });

/**
 * Statistics card component - Minimal, technical style
 */
function StatCard({
    title,
    value,
    change,
    trend,
    suffix = "",
    isHighlight = false,
    tooltip,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    change?: number;
    trend?: "up" | "down";
    suffix?: string;
    isHighlight?: boolean;
    tooltip?: string;
    icon?: any;
}) {
    return (
        <Card className={cn(
            "transition-all duration-200 border-slate-200/60 shadow-none hover:border-slate-300 group relative",
            isHighlight && "bg-indigo-50/50 border-indigo-200/60 ring-1 ring-indigo-500/5 shadow-sm"
        )}>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400/80">
                        {title}
                    </p>
                    {Icon && (
                        <div className={cn(
                            "p-2 rounded-lg transition-colors duration-200",
                            isHighlight ? "bg-indigo-100/50 text-indigo-600" : "bg-slate-100 text-slate-400"
                        )}>
                            <Icon size={16} />
                        </div>
                    )}
                </div>
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <p className={cn(
                            "text-3xl font-black tracking-tight text-slate-900 tabular-nums leading-none",
                            isHighlight && "text-indigo-700"
                        )}>
                            {typeof value === 'number' ? formatNumber(value) : value}
                            {suffix && <span className="text-xl ml-0.5">{suffix}</span>}
                        </p>
                    </div>
                    {change !== undefined && (
                        <div className={cn(
                            "flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] font-bold leading-none",
                            trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        )}>
                            {trend === "up" ? <ArrowUpRight size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
            </div>

            {/* Simple CSS-based Tooltip */}
            {tooltip && (
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap -translate-y-full mt-[-4px]">
                        {tooltip}
                    </div>
                </div>
            )}
        </Card>
    );
}

// Interfaces to handle optional fields from API
interface DashboardPost extends Post {
    categoryName?: string;
    coverImage?: string;
    viewCount?: number;
}

interface DashboardUser extends User {
    // nothing extra needed yet
}

/**
 * Actionable Signal Card
 */
function ActionCard({
    title,
    count,
    actionLabel,
    href,
    variant = "warning",
}: {
    title: string;
    count: number;
    actionLabel: string;
    href: string;
    variant?: "warning" | "danger" | "info";
}) {
    const styles = {
        warning: "bg-amber-50/50 border-amber-200/60 text-amber-900 icon-amber",
        danger: "bg-red-50/50 border-red-200/60 text-red-900 icon-red",
        info: "bg-blue-50/50 border-blue-200/60 text-blue-900 icon-blue",
    };

    return (
        <div className={cn(
            "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-sm",
            styles[variant]
        )}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "p-2.5 rounded-lg",
                    variant === "warning" ? "bg-amber-100 text-amber-600" :
                        variant === "danger" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                )}>
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold">{title}</h4>
                    <p className="text-xs opacity-70 font-medium">{count} items require priority</p>
                </div>
            </div>
            <Link
                href={count > 0 ? href : "#"}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white rounded-lg border border-inherit shadow-sm hover:translate-x-0.5 transition-transform",
                    count === 0 && "opacity-50 cursor-not-allowed grayscale"
                )}
            >
                {count > 0 ? actionLabel : "No Issues"}
                <ExternalLink size={12} />
            </Link>
        </div>
    );
}

/**
 * Recent posts table columns
 */
const recentPostsColumns: TableColumn<DashboardPost>[] = [
    {
        key: "title",
        header: "Title",
        render: (_, post) => (
            <Link href={`/admin/posts/${post.id}`} className="min-w-0 py-1 group block max-w-[200px] lg:max-w-[300px]">
                <p className="font-semibold text-slate-800 transition-colors group-hover:text-indigo-600 truncate">
                    {post.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    {post.categoryName && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            {post.categoryName}
                        </span>
                    )}
                </div>
            </Link>
        ),
    },
    {
        key: "published",
        header: "Status",
        render: (_, post) => (
            <Badge variant={post.published ? "success" : "warning"} dot size="sm">
                {post.published ? "published" : "draft"}
            </Badge>
        ),
    },
    {
        key: "viewCount",
        header: "Views",
        align: "right" as const,
        render: (value) => (
            <span className="tabular-nums font-medium text-slate-600">
                {formatNumber((value as number) || 0)}
            </span>
        ),
    },
    {
        key: "readCount",
        header: "Reads",
        align: "right" as const,
        render: (_, post) => (
            <span className="tabular-nums font-medium text-slate-600">
                {formatNumber(Math.round((post.viewCount || 0) * 0.6))}
            </span>
        ),
    },
    {
        key: "readRate",
        header: "Rate",
        align: "right" as const,
        render: (_, post) => {
            const mockRate = 60 + ((post.title.length * 7) % 30);
            return (
                <span className="tabular-nums font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {mockRate.toFixed(1)}%
                </span>
            );
        },
    },
    {
        key: "createdAt",
        header: "Modified",
        align: "right" as const,
        render: (value) => (
            <span className="text-slate-400 tabular-nums text-xs whitespace-nowrap">
                {value ? "2h ago" : "—"}
            </span>
        ),
    },
];

/**
 * Recent users table columns
 */
const recentUsersColumns: TableColumn<DashboardUser>[] = [
    {
        key: "name",
        header: "User",
        render: (_, user) => (
            <div className="flex items-center gap-3">
                <Avatar name={user.name || "User"} size="sm" />
                <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate max-w-[120px]">{user.name || "Unnamed"}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[120px]">{user.email}</p>
                </div>
            </div>
        ),
    },
    {
        key: "role",
        header: "Role",
        align: "right" as const,
        render: (value) => (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {String(value)}
            </span>
        ),
    },
];

/**
 * Dashboard page
 * Shows statistics, recent posts, and user activity
 */
export default function DashboardPage() {
    // Fetch data
    const { data: postsData, isLoading: isPostsLoading } = usePostList();
    const { data: usersData, isLoading: isUsersLoading } = useUserList();

    const posts = (postsData as DashboardPost[]) || [];
    const users = (usersData as DashboardUser[]) || [];

    // Calculate stats
    const totalPosts = posts.length;
    const totalViews = posts.reduce((acc, post) => acc + (post.viewCount || 0), 0);
    const totalReads = Math.round(totalViews * 0.65);
    const readRate = 65.4;
    const avgReadTime = "4m 20s";

    // Chart mock data generation based on time range
    const [timeRange, setTimeRange] = useState("30d");

    const chartData = useMemo(() => {
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const data: ChartDataPoint[] = [];
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Format date label (e.g., "Feb 10")
            const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Generate deterministic "random" data based on date
            // Using sine waves mixed with some randomness for realistic looking traffic
            const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
            const baseTraffic = 300 + Math.sin(dayOfYear * 0.1) * 100;
            const randomVar = (dayOfYear * 12345 % 100) - 50; // Deterministic pseudo-random

            data.push({
                name: dateLabel,
                views: Math.max(50, Math.round(baseTraffic + randomVar)),
                reads: Math.max(20, Math.round((baseTraffic + randomVar) * 0.6)),
            });
        }
        return data;
    }, [timeRange]);

    // Stats config
    const statsData = [
        {
            title: "Total Posts",
            value: totalPosts,
            change: 12,
            trend: "up" as const,
            icon: FileText,
        },
        {
            title: "Total Views",
            value: totalViews || 8540,
            change: 8,
            trend: "up" as const,
            isHighlight: true,
            tooltip: "Page loaded",
            icon: Eye,
        },
        {
            title: "Total Reads",
            value: totalReads || 5520,
            change: 5,
            trend: "up" as const,
            tooltip: "Scrolled ≥ 60% content",
            icon: TrendingUp,
        },
        {
            title: "Read Rate",
            value: readRate,
            suffix: "%",
            trend: "up" as const,
            isHighlight: true,
            tooltip: "Actual engagement ratio",
            icon: Users,
        },
        {
            title: "Avg Read Time",
            value: avgReadTime,
            icon: Loader2,
        },
    ];



    if (isPostsLoading || isUsersLoading) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="space-y-6">
            {/* Header + Time Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader
                    title="Dashboard"
                    description="Welcome back! Here's what's happening with your blog."
                    icon={LayoutDashboard}
                />
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm mb-6">
                    {["7d", "30d", "90d"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-4 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                                timeRange === range
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Create Post Button */}
            <div className="mb-6 flex items-center justify-between">
                <div /> {/* Spacer */}
                <Link
                    href="/admin/posts/create"
                    className={cn(
                        "inline-flex items-center justify-center gap-2",
                        "px-4 py-2 text-sm font-bold text-white rounded-lg",
                        "bg-gradient-to-r from-indigo-600 to-indigo-700",
                        "shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30",
                        "transition-all duration-200"
                    )}
                >
                    <Plus size={16} />
                    Create New Post
                </Link>
            </div>

            {/* Metrics Row - 5 cards equal width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statsData.map((stat) => (
                    <StatCard
                        key={stat.title}
                        {...stat}
                    />
                ))}
            </div>

            {/* Main Content Grid: 12-Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: 8/12 (approx 66%) - More data heavy */}
                <div className="xl:col-span-8 flex flex-col gap-6 w-full min-w-0">

                    {/* Traffic Chart */}
                    <Card className="overflow-hidden shadow-none border-slate-200/60 w-full">
                        <CardHeader
                            title="Exposure vs Reading"
                            subtitle={`Impact analysis (${timeRange})`}
                        />
                        <CardBody>
                            <TrafficChart data={chartData} />
                        </CardBody>
                    </Card>

                    {/* Tables Row: Recent Posts & Recent Users Side-by-Side if space allows */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Posts Table */}
                        <Card noPadding className="w-full">
                            <div className="p-6 pb-0">
                                <CardHeader
                                    title="Recent Posts"
                                    subtitle="Latest updates"
                                    action={
                                        <a
                                            href="/admin/posts"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View All
                                            <ArrowUpRight size={14} />
                                        </a>
                                    }
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <Table
                                    columns={recentPostsColumns}
                                    data={posts.slice(0, 5)}
                                    keyExtractor={(post) => post.id}
                                    compact
                                    emptyMessage="No posts found"
                                />
                            </div>
                        </Card>

                        {/* Recent Users Table */}
                        <Card noPadding className="w-full">
                            <div className="p-6 pb-0">
                                <CardHeader
                                    title="Recent Users"
                                    subtitle="New members"
                                    action={
                                        <a
                                            href="/admin/users"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View All
                                            <ArrowUpRight size={14} />
                                        </a>
                                    }
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <Table
                                    columns={recentUsersColumns}
                                    data={users.slice(0, 5)}
                                    keyExtractor={(user) => user.id}
                                    compact
                                    emptyMessage="No users found"
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* RIGHT COLUMN: 4/12 (approx 33%) - Insights & Signals */}
                <div className="xl:col-span-4 flex flex-col gap-6 w-full min-w-0">

                    {/* Actionable Signal Cards - Stacked for visibility */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pl-1">Priority Signals</h3>
                        <ActionCard
                            title="Outdated Content"
                            count={3}
                            actionLabel="Review"
                            href="/admin/posts?status=outdated"
                            variant="warning"
                        />
                        <ActionCard
                            title="Missing SEO Meta"
                            count={7}
                            actionLabel="Optimize"
                            href="/admin/seo"
                            variant="danger"
                        />
                        <ActionCard
                            title="Low Engagement"
                            count={2}
                            actionLabel="Refine"
                            href="/admin/analytics"
                            variant="info"
                        />
                    </div>

                    {/* Top Performing Content */}
                    <Card className="shadow-none border-slate-200/60 overflow-hidden">
                        <CardHeader
                            title="Top Performing"
                            subtitle="High impact content"
                        />
                        <CardBody className="pt-2">
                            <div className="space-y-4">
                                {posts.slice(0, 4).map((post, i) => (
                                    <div key={post.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                                0{i + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                    {post.title}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                                                    {formatNumber(post.viewCount || 0)} views
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                +{(10 + ((post.title.length * 3) % 20))}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Content Schedule */}
                    <Card className="shadow-none border-slate-200/60 bg-slate-50/30">
                        <CardHeader
                            title="Pipeline"
                            subtitle="Next 7 days"
                            icon={Clock}
                        />
                        <CardBody className="space-y-4 pt-1">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 flex-shrink-0">
                                    <span className="text-[10px] font-black leading-none italic uppercase">Feb</span>
                                    <span className="text-sm font-black leading-none">12</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 leading-tight">Implementing React 19 Actions</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Scheduled • 10:00 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-100 italic">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                                    <span className="text-[10px] font-black leading-none uppercase">Feb</span>
                                    <span className="text-sm font-black leading-none">15</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-400 leading-tight">Kubernetes 1.30 Release Notes</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Drafting Stage</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
}
