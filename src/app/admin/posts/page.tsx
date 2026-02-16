"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
    Card,
    Button,
    Input,
    Badge,
    Avatar,
    Table,
    Pagination,
    Select,
    type TableColumn,
} from "@/components/ui";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { formatDate, formatNumber } from "@/lib/utils";
import {
    FileText,
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Globe,
    GlobeLock,
    Eye,
    BookOpen,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { usePostList, useDeletePost, useUpdatePost } from "@/features/posts/hooks/usePosts";
import { useReviewMode } from "@/providers/ReviewModeProvider";
import { Post as PrismaPost } from "@prisma/client";
import { cn } from "@/lib/utils";

/**
 * Status filter options
 */
const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
];

// Extend PrismaPost to include relation fields and mock analytics
interface PostWithRelations extends PrismaPost {
    category?: { name: string } | null;
}

interface PostWithAnalytics extends PostWithRelations {
    views: number;
    reads: number;
    readRate: number;
    seoScore: number;
    isOutdated: boolean;
}

// Generate mock analytics data for a post
function withMockAnalytics(post: PostWithRelations, index: number): PostWithAnalytics {
    // Use deterministic math based on index and post ID length for consistent ssr/client rendering
    const baseSeed = index * 100 + (post.id ? post.id.length : 0);
    const views = 1200 + (baseSeed % 1000) + (15 - (index % 15)) * 120;
    const readRate = 40 + (baseSeed % 50);
    const reads = Math.floor(views * readRate / 100);
    const seoScore = 60 + (baseSeed % 40);
    const isOutdated = index % 4 === 0;
    return { ...post, views, reads, readRate, seoScore, isOutdated };
}

/**
 * Posts list page (Enhanced)
 * Shows all posts with analytics columns, publish/unpublish, and improved UX
 */
export default function PostsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [quickFilter, setQuickFilter] = useState<"all" | "seo-issues" | "outdated" | "high-perf">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const { isReviewMode } = useReviewMode();
    const itemsPerPage = 10;

    // Posts Query
    const { data: postsData, isLoading, error } = usePostList();
    const rawPosts = (postsData as PostWithRelations[]) || [];
    const posts: PostWithAnalytics[] = rawPosts.map((p, i) => withMockAnalytics(p, i));

    // Mutations
    const deletePostMutation = useDeletePost();
    const updatePostMutation = useUpdatePost();

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingPost, setDeletingPost] = useState<PostWithAnalytics | null>(null);

    const handleOpenDelete = (post: PostWithAnalytics) => {
        setDeletingPost(post);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (deletingPost) {
            try {
                await deletePostMutation.mutateAsync(deletingPost.id);
                setIsDeleteOpen(false);
                setDeletingPost(null);
            } catch (err) {
                console.error("Failed to delete post", err);
            }
        }
    };

    const handleTogglePublish = async (post: PostWithAnalytics) => {
        try {
            await updatePostMutation.mutateAsync({
                id: post.id,
                data: { published: !post.published },
            });
        } catch (err) {
            console.error("Failed to toggle publish", err);
        }
    };

    // Filter posts
    const filteredPosts = posts.filter((post) => {
        const status = post.published ? "published" : "draft";
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || status === statusFilter;

        let matchesQuick = true;
        if (quickFilter === "seo-issues") matchesQuick = post.seoScore < 85;
        if (quickFilter === "outdated") matchesQuick = post.isOutdated;
        if (quickFilter === "high-perf") matchesQuick = post.views > 1500;

        return matchesSearch && matchesStatus && matchesQuick;
    });

    // Paginate
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: TableColumn<PostWithAnalytics>[] = [
        {
            key: "title",
            header: "Post",
            render: (_, post) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate max-w-[280px]">
                            {post.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[280px]">
                            {post.slug}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "seoScore",
            header: "SEO",
            align: "center",
            render: (val) => {
                const score = val as number;
                return (
                    <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                            "text-[10px] font-bold tabular-nums",
                            score >= 90 ? "text-emerald-600" : score >= 80 ? "text-blue-600" : "text-amber-600"
                        )}>
                            {score}
                        </span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-blue-500" : "bg-amber-500"
                                )}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            key: "published",
            header: "Status",
            render: (value, post) => {
                const isPublished = value as boolean;
                return (
                    <div className="flex flex-col gap-1.5">
                        <Badge
                            variant={isPublished ? "success" : "warning"}
                            dot
                            size="sm"
                        >
                            {isPublished ? "Published" : "Draft"}
                        </Badge>
                        {post.isOutdated && (
                            <Badge variant="warning" size="sm" className="bg-amber-50 text-[9px] border-amber-100 font-bold uppercase truncate">
                                <Clock size={10} className="mr-1" /> Stale
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            key: "views",
            header: "Views",
            align: "right",
            render: (_, post) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Eye size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                        {formatNumber(post.views)}
                    </span>
                </div>
            ),
        },
        {
            key: "reads",
            header: "Reads",
            align: "right",
            render: (_, post) => (
                <div className="flex items-center justify-end gap-1.5">
                    <BookOpen size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                        {formatNumber(post.reads)}
                    </span>
                </div>
            ),
        },
        {
            key: "readRate",
            header: "Read Rate",
            align: "right",
            render: (_, post) => (
                <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    post.readRate >= 70
                        ? "bg-emerald-50 text-emerald-700"
                        : post.readRate >= 50
                            ? "bg-sky-50 text-sky-700"
                            : "bg-slate-100 text-slate-600"
                )}>
                    {post.readRate}%
                </span>
            ),
        },
        {
            key: "updatedAt",
            header: "Updated",
            align: "right",
            render: (value) => (
                <span className="text-sm text-slate-500">{formatDate(value as string)}</span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "140px",
            render: (_, post) => (
                <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm" icon={Edit} title="Edit" />
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={post.published ? GlobeLock : Globe}
                        className={cn(
                            post.published
                                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        )}
                        onClick={() => handleTogglePublish(post)}
                        disabled={updatePostMutation.isPending || isReviewMode}
                        title={post.published ? "Unpublish" : "Publish"}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDelete(post)}
                        disabled={deletePostMutation.isPending || isReviewMode}
                        title="Delete"
                    />
                </div>
            ),
        },
    ];

    // ─── Loading State ───────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading posts...</p>
                </div>
            </div>
        );
    }

    // ─── Error State ─────────────────────────────────────────────────────────────

    if (error) {
        return (
            <div className="flex bg-white h-96 items-center justify-center rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <FileText size={24} />
                    </div>
                    <p className="text-slate-800 font-medium">Failed to load posts</p>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="space-y-6">
            <PageHeader
                title="Posts"
                description="Manage your blog posts and articles"
                icon={FileText}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Posts" },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <Link href="/admin/analytics">
                            <Button variant="outline" icon={BarChart3} size="sm">
                                Analytics
                            </Button>
                        </Link>
                        <Link href="/admin/posts/create">
                            <Button icon={Plus}>New Post</Button>
                        </Link>
                    </div>
                }
            />

            {/* Filters */}
            <Card className="bg-slate-50/50 border-slate-200/60 shadow-none">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search title or content..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                leftIcon={Search}
                                fullWidth
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(val) => {
                                    setStatusFilter(val);
                                    setCurrentPage(1);
                                }}
                                className="w-40"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60 mt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mr-2">
                            Quick Filters:
                        </span>
                        <button
                            onClick={() => setQuickFilter("all")}
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                quickFilter === "all" ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:bg-white hover:text-slate-800"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setQuickFilter("seo-issues")}
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                                quickFilter === "seo-issues" ? "bg-amber-500 text-white shadow-sm" : "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50"
                            )}
                        >
                            <AlertTriangle size={10} /> SEO Issues
                        </button>
                        <button
                            onClick={() => setQuickFilter("outdated")}
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                                quickFilter === "outdated" ? "bg-indigo-500 text-white shadow-sm" : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
                            )}
                        >
                            <Clock size={10} /> Outdated
                        </button>
                        <button
                            onClick={() => setQuickFilter("high-perf")}
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                                quickFilter === "high-perf" ? "bg-emerald-500 text-white shadow-sm" : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                            )}
                        >
                            <CheckCircle2 size={10} /> High Performance
                        </button>
                    </div>
                </div>
            </Card>

            {/* Posts Table or Empty State */}
            {posts.length === 0 ? (
                /* No posts at all */
                <Card>
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-lg text-slate-700 font-medium mb-1">No posts yet</p>
                        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
                            Start writing your first technical article. Posts will appear here once created.
                        </p>
                        <Link href="/admin/posts/create">
                            <Button icon={Plus}>Create Your First Post</Button>
                        </Link>
                    </div>
                </Card>
            ) : filteredPosts.length === 0 ? (
                /* No matching results */
                <Card>
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Search className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">No posts match your filters</p>
                        <p className="text-sm text-slate-500">
                            Try adjusting your search query or status filter.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card noPadding>
                    <Table
                        columns={columns}
                        data={paginatedPosts}
                        keyExtractor={(post) => post.id}
                        emptyMessage="No posts found"
                    />
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-slate-100">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredPosts.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </div>
                    )}
                </Card>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={deletingPost?.title}
            />
        </PageWrapper>
    );
}
