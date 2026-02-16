"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardHeader, CardBody, Badge } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import {
    BarChart3,
    Eye,
    BookOpen,
    Clock,
    TrendingUp,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Flame,
    FileText,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const TIME_RANGES = ["7D", "30D", "90D", "All"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

function generateChartData(range: TimeRange) {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : 180;
    const data = [];
    const now = new Date();
    // Use a fixed seed-like approach based on date to ensure server/client match if rendered at same time, 
    // but better yet, move this to specific Client Component logic or use useEffect if strict consistency needed.
    // Ideally, for a dashboard, we want stable mock data.

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        // Deterministic 'random'
        const daySeed = i * 13;
        const views = Math.floor(200 + Math.sin(daySeed) * 100 + (daySeed % 50));
        const reads = Math.floor(views * 0.45);

        data.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            views,
            reads,
        });
    }
    return data;
}

interface PostPerformance {
    id: string;
    title: string;
    views: number;
    reads: number;
    readRate: number;
    avgReadTime: string;
}

const mockPostPerformance: PostPerformance[] = [
    { id: "1", title: "Getting Started with Kubernetes Services", views: 2840, reads: 1988, readRate: 70, avgReadTime: "6m 12s" },
    { id: "2", title: "Docker Compose for Production Environments", views: 2150, reads: 1720, readRate: 80, avgReadTime: "8m 45s" },
    { id: "3", title: "Understanding React Server Components", views: 1920, reads: 1344, readRate: 70, avgReadTime: "5m 30s" },
    { id: "4", title: "TypeScript Advanced Patterns & Generics", views: 1680, reads: 1260, readRate: 75, avgReadTime: "7m 20s" },
    { id: "5", title: "CI/CD Pipeline with GitLab and ArgoCD", views: 1450, reads: 870, readRate: 60, avgReadTime: "4m 55s" },
    { id: "6", title: "Next.js 14 App Router Deep Dive", views: 1320, reads: 1056, readRate: 80, avgReadTime: "9m 10s" },
    { id: "7", title: "PostgreSQL Performance Tuning Guide", views: 1100, reads: 660, readRate: 60, avgReadTime: "5m 00s" },
    { id: "8", title: "Building REST APIs with Prisma ORM", views: 980, reads: 735, readRate: 75, avgReadTime: "6m 40s" },
    { id: "9", title: "Terraform Infrastructure as Code Basics", views: 890, reads: 534, readRate: 60, avgReadTime: "4m 15s" },
    { id: "10", title: "Microservices Communication Patterns", views: 750, reads: 525, readRate: 70, avgReadTime: "7m 50s" },
    { id: "11", title: "Redis Caching Strategies for Node.js", views: 620, reads: 434, readRate: 70, avgReadTime: "5m 25s" },
    { id: "12", title: "GraphQL vs REST: Practical Comparison", views: 540, reads: 270, readRate: 50, avgReadTime: "3m 40s" },
    { id: "13", title: "Linux Server Hardening Checklist", views: 480, reads: 384, readRate: 80, avgReadTime: "8m 00s" },
    { id: "14", title: "WebSocket Real-Time Communication", views: 350, reads: 175, readRate: 50, avgReadTime: "4m 10s" },
    { id: "15", title: "Nginx Reverse Proxy Configuration", views: 290, reads: 145, readRate: 50, avgReadTime: "3m 30s" },
];

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    suffix = "",
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    suffix?: string;
}) {
    const colorStyles: Record<string, { bg: string; shadow: string }> = {
        blue: { bg: "bg-gradient-to-br from-blue-500 to-blue-600", shadow: "shadow-blue-500/25" },
        green: { bg: "bg-gradient-to-br from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/25" },
        sky: { bg: "bg-gradient-to-br from-sky-500 to-sky-600", shadow: "shadow-sky-500/25" },
        amber: { bg: "bg-gradient-to-br from-amber-500 to-amber-600", shadow: "shadow-amber-500/25" },
    };
    const colors = colorStyles[color] || colorStyles.blue;

    return (
        <Card hoverable className="relative overflow-hidden">
            <CardBody className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">
                        {typeof value === "number" ? formatNumber(value) : value}
                        {suffix}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${colors.bg} shadow-lg ${colors.shadow}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </CardBody>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} />
        </Card>
    );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
            <p className="text-sm font-medium text-slate-700 mb-1">{label}</p>
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-500">{entry.name}:</span>
                    <span className="font-medium text-slate-800">{formatNumber(entry.value)}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Sortable Table ──────────────────────────────────────────────────────────

type SortKey = "views" | "reads" | "readRate" | "avgReadTime";
type SortDir = "asc" | "desc";

function SortHeader({
    label,
    sortKey,
    currentSort,
    currentDir,
    onSort,
}: {
    label: string;
    sortKey: SortKey;
    currentSort: SortKey;
    currentDir: SortDir;
    onSort: (key: SortKey) => void;
}) {
    const isActive = currentSort === sortKey;
    return (
        <button
            onClick={() => onSort(sortKey)}
            className={cn(
                "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider",
                "transition-colors duration-150",
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            )}
        >
            {label}
            {isActive ? (
                currentDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
            ) : (
                <ArrowUpDown size={14} className="opacity-40" />
            )}
        </button>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>("30D");
    const [sortKey, setSortKey] = useState<SortKey>("views");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const chartData = useMemo(() => generateChartData(timeRange), [timeRange]);

    // Compute totals from mock data
    const totalViews = mockPostPerformance.reduce((s, p) => s + p.views, 0);
    const totalReads = mockPostPerformance.reduce((s, p) => s + p.reads, 0);
    const readRate = totalViews > 0 ? Math.round((totalReads / totalViews) * 100) : 0;
    const avgReadTime = "5m 48s";

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const sortedPosts = useMemo(() => {
        return [...mockPostPerformance].sort((a, b) => {
            let aVal: number, bVal: number;
            if (sortKey === "avgReadTime") {
                aVal = parseInt(a.avgReadTime);
                bVal = parseInt(b.avgReadTime);
            } else {
                aVal = a[sortKey];
                bVal = b[sortKey];
            }
            return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [sortKey, sortDir]);

    return (
        <PageWrapper className="space-y-6">
            <PageHeader
                title="View & Read Analytics"
                description="Track how readers engage with your technical content"
                icon={BarChart3}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Analytics" },
                ]}
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard title="Total Views" value={totalViews} icon={Eye} color="blue" />
                <StatCard title="Total Reads" value={totalReads} icon={BookOpen} color="green" />
                <StatCard title="Read Rate" value={readRate} icon={TrendingUp} color="sky" suffix="%" />
                <StatCard title="Avg Read Time" value={avgReadTime} icon={Clock} color="amber" />
            </div>

            {/* Chart */}
            <Card>
                <CardHeader
                    title="Views & Reads Over Time"
                    subtitle="Daily engagement metrics"
                    action={
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            {TIME_RANGES.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                        timeRange === range
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    }
                />
                <CardBody>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    axisLine={{ stroke: "#e2e8f0" }}
                                    tickLine={false}
                                    interval={chartData.length > 30 ? Math.floor(chartData.length / 10) : undefined}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 13, color: "#64748b" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    name="Views"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="reads"
                                    name="Reads"
                                    stroke="#06b6d4"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>

            {/* Post Performance Table */}
            <Card noPadding>
                <div className="p-6 pb-0">
                    <CardHeader
                        title="Post Performance"
                        subtitle={`${sortedPosts.length} posts sorted by ${sortKey}`}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="text-right px-6 py-3">
                                    <SortHeader label="Views" sortKey="views" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                                </th>
                                <th className="text-right px-6 py-3">
                                    <SortHeader label="Reads" sortKey="reads" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                                </th>
                                <th className="text-right px-6 py-3">
                                    <SortHeader label="Read Rate" sortKey="readRate" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                                </th>
                                <th className="text-right px-6 py-3">
                                    <SortHeader label="Avg Time" sortKey="avgReadTime" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {sortedPosts.map((post, index) => (
                                <tr
                                    key={post.id}
                                    className="hover:bg-slate-50/50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm font-medium text-slate-400">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-800 truncate max-w-[320px]">
                                                    {post.title}
                                                </p>
                                            </div>
                                            {post.readRate >= 75 && (
                                                <Badge variant="warning" size="sm">
                                                    <Flame size={12} className="mr-0.5" />
                                                    Top
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-medium text-slate-700">
                                            {formatNumber(post.views)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-medium text-slate-700">
                                            {formatNumber(post.reads)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                            post.readRate >= 75
                                                ? "bg-emerald-50 text-emerald-700"
                                                : post.readRate >= 60
                                                    ? "bg-sky-50 text-sky-700"
                                                    : "bg-slate-100 text-slate-600"
                                        )}>
                                            {post.readRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm text-slate-500">{post.avgReadTime}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {sortedPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <FileText className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">No analytics data yet</p>
                        <p className="text-sm text-slate-500">
                            Analytics will appear here once your posts receive views and reads.
                        </p>
                    </div>
                )}
            </Card>
        </PageWrapper>
    );
}
