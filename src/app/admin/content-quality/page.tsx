"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardHeader, CardBody, Badge } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import {
    Award,
    FileText,
    Clock,
    Code2,
    Link2,
    Star,
    Info,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { usePostList } from "@/features/posts/hooks/usePosts";
import { Post } from "@prisma/client";

// ─── Helper: Simulate content quality metrics ────────────────────────────────

function getContentMetrics(post: Post) {
    const wordCount = post.content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));
    // Approximate code blocks by counting ``` pairs
    const codeBlocks = (post.content.match(/```/g) || []).length / 2;
    // Count markdown links [text](url)
    const internalLinks = (post.content.match(/\[.*?\]\(.*?\)/g) || []).length;
    // Simulated content score based on metrics
    const score = Math.min(
        100,
        Math.round(
            (wordCount >= 500 ? 25 : (wordCount / 500) * 25) +
            (codeBlocks >= 2 ? 25 : codeBlocks * 12.5) +
            (internalLinks >= 2 ? 20 : internalLinks * 10) +
            (readingTime >= 3 ? 15 : (readingTime / 3) * 15) +
            (post.published ? 15 : 5)
        )
    );

    return {
        wordCount,
        readingTime,
        codeBlocks: Math.floor(codeBlocks),
        internalLinks,
        score,
    };
}

// ─── Tooltip Component ───────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
    const [show, setShow] = useState(false);

    return (
        <span
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <Info size={14} className="text-slate-400 cursor-help" />
            {show && (
                <span className={cn(
                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                    "px-3 py-2 text-xs text-white bg-slate-800 rounded-lg",
                    "shadow-lg whitespace-nowrap z-50",
                    "animate-in fade-in-0 zoom-in-95 duration-150"
                )}>
                    {text}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800" />
                </span>
            )}
        </span>
    );
}

// ─── Metric Item ─────────────────────────────────────────────────────────────

function MetricItem({
    icon: Icon,
    label,
    value,
    tooltip,
    color = "text-slate-600",
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    tooltip: string;
    color?: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <Icon size={16} className={color} />
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-700">{value}</span>
            <InfoTooltip text={tooltip} />
        </div>
    );
}

// ─── Score Bar ───────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
    const color =
        score >= 80
            ? "bg-emerald-500"
            : score >= 50
                ? "bg-amber-500"
                : "bg-red-400";

    const textColor =
        score >= 80
            ? "text-emerald-700"
            : score >= 50
                ? "text-amber-700"
                : "text-red-600";

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", color)}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span className={cn("text-sm font-bold min-w-[36px] text-right", textColor)}>
                {score}
            </span>
        </div>
    );
}

// ─── Summary Stat ────────────────────────────────────────────────────────────

function SummaryStat({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}) {
    const colorStyles: Record<string, { bg: string; shadow: string }> = {
        blue: { bg: "bg-gradient-to-br from-blue-500 to-blue-600", shadow: "shadow-blue-500/25" },
        amber: { bg: "bg-gradient-to-br from-amber-500 to-amber-600", shadow: "shadow-amber-500/25" },
        green: { bg: "bg-gradient-to-br from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/25" },
    };
    const colors = colorStyles[color] || colorStyles.blue;

    return (
        <Card hoverable className="relative overflow-hidden">
            <CardBody className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-800">
                        {typeof value === "number" ? formatNumber(value) : value}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${colors.bg} shadow-lg ${colors.shadow}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </CardBody>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} />
        </Card>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ContentQualityPage() {
    const { data: postsData, isLoading } = usePostList();
    const posts = (postsData as Post[]) || [];
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Compute metrics for all posts
    const postsWithMetrics = posts.map((post) => ({
        ...post,
        metrics: getContentMetrics(post),
    }));

    // Summary stats
    const avgScore =
        postsWithMetrics.length > 0
            ? Math.round(
                postsWithMetrics.reduce((s, p) => s + p.metrics.score, 0) / postsWithMetrics.length
            )
            : 0;
    const totalWords = postsWithMetrics.reduce((s, p) => s + p.metrics.wordCount, 0);
    const avgReadTime =
        postsWithMetrics.length > 0
            ? Math.round(
                postsWithMetrics.reduce((s, p) => s + p.metrics.readingTime, 0) / postsWithMetrics.length
            )
            : 0;

    if (isLoading) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading content metrics...</p>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="space-y-6">
            <PageHeader
                title="Content Quality"
                description="Evaluate the quality and readability of your technical articles"
                icon={Award}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Content Quality" },
                ]}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <SummaryStat title="Average Score" value={avgScore} icon={Star} color="blue" />
                <SummaryStat title="Total Words" value={totalWords} icon={FileText} color="green" />
                <SummaryStat title="Avg Reading Time" value={`${avgReadTime} min`} icon={Clock} color="amber" />
            </div>

            {/* Post Quality Cards */}
            {postsWithMetrics.length === 0 ? (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <FileText className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">No posts yet</p>
                        <p className="text-sm text-slate-500">
                            Create your first post to see content quality metrics here.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {postsWithMetrics.map((post) => {
                        const isExpanded = expandedId === post.id;
                        const m = post.metrics;

                        return (
                            <Card key={post.id} className="transition-all duration-200">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <FileText size={18} className="text-slate-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-800 truncate">
                                                {post.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Badge
                                                    variant={post.published ? "success" : "warning"}
                                                    size="sm"
                                                    dot
                                                >
                                                    {post.published ? "Published" : "Draft"}
                                                </Badge>
                                                <span className="text-xs text-slate-400">
                                                    {m.wordCount} words · {m.readingTime} min read
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="hidden sm:block w-32">
                                            <ScoreBar score={m.score} />
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp size={18} className="text-slate-400" />
                                        ) : (
                                            <ChevronDown size={18} className="text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                            <MetricItem
                                                icon={FileText}
                                                label="Words"
                                                value={formatNumber(m.wordCount)}
                                                tooltip="Total number of words in the article. Aim for 500+ for thorough coverage."
                                                color="text-blue-500"
                                            />
                                            <MetricItem
                                                icon={Clock}
                                                label="Read Time"
                                                value={`${m.readingTime} min`}
                                                tooltip="Estimated reading time based on 200 words per minute average."
                                                color="text-amber-500"
                                            />
                                            <MetricItem
                                                icon={Code2}
                                                label="Code Blocks"
                                                value={m.codeBlocks}
                                                tooltip="Number of code blocks. Technical articles benefit from 2+ code examples."
                                                color="text-emerald-500"
                                            />
                                            <MetricItem
                                                icon={Link2}
                                                label="Links"
                                                value={m.internalLinks}
                                                tooltip="Number of internal/external links. Links improve SEO and reader navigation."
                                                color="text-purple-500"
                                            />
                                            <MetricItem
                                                icon={Star}
                                                label="Score"
                                                value={`${m.score}/100`}
                                                tooltip="Content quality score based on word count, code blocks, links, and reading time."
                                                color="text-sky-500"
                                            />
                                        </div>
                                        {/* Expanded Score Bar on mobile */}
                                        <div className="sm:hidden mt-4">
                                            <p className="text-xs text-slate-500 mb-1">Content Score</p>
                                            <ScoreBar score={m.score} />
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </PageWrapper>
    );
}
