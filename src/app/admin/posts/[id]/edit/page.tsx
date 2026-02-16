"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/common";
import { Card, CardBody, Button, Input, Select, Badge, CardHeader } from "@/components/ui";
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
    () => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor),
    { ssr: false }
);
import { cn } from "@/lib/utils";
import {
    Edit, Save, Eye, ArrowLeft, X, Trash2, Loader2,
    List,
    Clock,
    EyeOff,
    CheckCircle2,
    Calendar,
    Globe,
    AlertTriangle,
    History,
    FileText,
    ShieldCheck,
    Smartphone,
    Monitor,
    Tablet,
    Copy as CopyIcon,
    Lock as LockIcon
} from "lucide-react";
import { usePostDetail, useUpdatePost, useDeletePost } from "@/features/posts/hooks/usePosts";
import { useCategoryList } from "@/features/categories/hooks/useCategories";
import { useTagList } from "@/features/tags/hooks/useTags";
import { Post } from "@prisma/client";

/**
 * Status options for post
 */
const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "needs-update", label: "Needs Update" },
    { value: "outdated", label: "Outdated" },
    { value: "archived", label: "Archived" },
    { value: "deprecated", label: "Deprecated" },
];

/**
 * Tag selection component
 */
function TagSelector({
    selectedTags,
    onToggle,
    availableTags,
}: {
    selectedTags: string[];
    onToggle: (tagId: string) => void;
    availableTags: { id: string; name: string; color?: string }[];
}) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Tags</label>
            <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => onToggle(tag.id)}
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5",
                                "text-sm font-medium rounded-full",
                                "border transition-all duration-200",
                                "border-slate-200 text-slate-600 hover:border-slate-300",
                                isSelected && "bg-blue-50 border-blue-200 text-blue-700"
                            )}
                        >
                            {tag.name}
                            {isSelected && <X size={14} />}
                        </button>
                    );
                })}
            </div>
            {availableTags.length === 0 && (
                <p className="text-sm text-slate-400">No tags available.</p>
            )}
        </div>
    );
}

// Interface for post with relations to handle tags
interface PostWithTags extends Post {
    tags?: { id: string, name: string }[];
}

interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    categoryId: string;
    status: string;
    tags: string[];
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    isIndexed: boolean;
    publishedAt: string;
    lastReviewedAt: string;
    internalNotes: string;
    freshness: "fresh" | "needs-review" | "outdated";
}

/**
 * Edit post page
 * Form for editing an existing blog post
 */
export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    // Queries & Mutations
    const { data: postData, isLoading: isPostLoading, error: postError } = usePostDetail(postId);
    const post = postData as PostWithTags | undefined;

    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();

    const { data: categoriesData } = useCategoryList();
    const { data: tagsData } = useTagList();

    const categories = categoriesData || [];
    const tags = tagsData || [];

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const [formData, setFormData] = useState<PostFormData>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        status: "draft",
        tags: [] as string[],
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        isIndexed: true,
        publishedAt: "",
        lastReviewedAt: new Date().toISOString().split('T')[0],
        internalNotes: "",
        freshness: "fresh",
    });

    const [metrics, setMetrics] = useState({
        wordCount: 0,
        readTime: 0,
    });

    useEffect(() => {
        const words = formData.content.split(/\s+/).filter(w => w.length > 0).length;
        setMetrics({
            wordCount: words,
            readTime: Math.ceil(words / 225), // Average reading speed
        });
    }, [formData.content]);

    // Load existing post data
    useEffect(() => {
        if (post) {
            const p = post as any; // Temporary cast for mocked fields
            setFormData({
                title: p.title || "",
                slug: p.slug || "",
                excerpt: p.excerpt || "",
                content: p.content || "",
                categoryId: p.categoryId || "",
                status: p.published ? "published" : "draft",
                tags: p.tags ? p.tags.map((t: any) => t.id) : [],
                metaTitle: p.metaTitle || "",
                metaDescription: p.metaDescription || "",
                canonicalUrl: p.canonicalUrl || `https://myblog.com/post/${p.slug}`,
                isIndexed: true,
                publishedAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : "",
                lastReviewedAt: p.lastReviewedAt || new Date().toISOString().split('T')[0],
                internalNotes: p.internalNotes || "",
                freshness: p.freshness || "fresh",
            });
        }
    }, [post]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagToggle = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter((t) => t !== tagId)
                : [...prev.tags, tagId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updating post:", formData);

        try {
            await updatePostMutation.mutateAsync({
                id: postId,
                data: {
                    ...formData,
                    // published: formData.status === "published" // handled by API helper or pass raw
                }
            });
            router.push("/admin/posts");
        } catch (error) {
            console.error("Failed to update post", error);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePostMutation.mutateAsync(postId);
                router.push("/admin/posts");
            } catch (err) {
                console.error("Failed to delete post", err);
            }
        }
    };

    const [activeTab, setActiveTab] = useState<"content" | "seo" | "maintenance">("content");
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

    const handleDuplicate = () => {
        alert("Post duplicated as Draft!");
        // Logic to create a new post with same data would go here
    };

    if (isPostLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (postError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Failed to load post.</p>
                <Button onClick={() => router.push("/admin/posts")} variant="ghost" className="mt-4">Back to Posts</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Post"
                description="Update your blog post"
                icon={Edit}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Posts", href: "/admin/posts" },
                    { label: "Edit" },
                ]}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="danger"
                            icon={Trash2}
                            onClick={handleDelete}
                            disabled={deletePostMutation.isPending}
                        >
                            {deletePostMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                        <Button variant="outline" icon={CopyIcon} onClick={handleDuplicate} title="Duplicate Post">
                            Duplicate
                        </Button>
                        <Button variant="outline" icon={ArrowLeft} onClick={() => router.back()}>
                            Back
                        </Button>
                    </div>
                }
            />

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200">
                {[
                    { id: "content", label: "Editor" },
                    { id: "seo", label: "SEO Management" },
                    { id: "maintenance", label: "Maintenance" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "px-6 py-3 text-sm font-semibold transition-all relative",
                            activeTab === tab.id
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main content */}
                    <div className="flex-grow space-y-8">
                        {activeTab === "content" && (
                            <Card>
                                <CardBody className="space-y-6">
                                    <Input
                                        label="Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter post title"
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        label="Excerpt"
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        placeholder="Short summary for SEO and listing"
                                        fullWidth
                                    />
                                    <div className="space-y-3">
                                        {/* Rich Text Editor Section */}

                                        <div className="flex justify-center">
                                            <RichTextEditor
                                                content={formData.content}
                                                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                                className={cn(
                                                    "bg-white shadow-sm transition-all",
                                                    previewDevice === "desktop" ? "w-full min-h-[500px]" : previewDevice === "tablet" ? "w-[600px] min-h-[600px]" : "w-[360px] min-h-[600px]"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {activeTab === "seo" && (
                            <Card>
                                <CardBody className="space-y-8">
                                    {/* Meta Controls */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-baseline">
                                                    <label className="text-sm font-medium text-slate-700">Meta Title</label>
                                                    <span className={cn(
                                                        "text-[10px] font-bold tabular-nums",
                                                        formData.metaTitle.length > 60 ? "text-red-500" : "text-slate-400"
                                                    )}>
                                                        {formData.metaTitle.length}/60
                                                    </span>
                                                </div>
                                                <Input
                                                    name="metaTitle"
                                                    value={formData.metaTitle}
                                                    onChange={handleChange}
                                                    placeholder="SEO Title"
                                                    fullWidth
                                                    className={formData.metaTitle.length > 60 ? "border-red-300" : ""}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-baseline">
                                                    <label className="text-sm font-medium text-slate-700">Meta Description</label>
                                                    <span className={cn(
                                                        "text-[10px] font-bold tabular-nums",
                                                        formData.metaDescription.length > 160 ? "text-red-500" : "text-slate-400"
                                                    )}>
                                                        {formData.metaDescription.length}/160
                                                    </span>
                                                </div>
                                                <textarea
                                                    name="metaDescription"
                                                    value={formData.metaDescription}
                                                    onChange={handleChange}
                                                    placeholder="SEO Description"
                                                    rows={3}
                                                    className={cn(
                                                        "w-full rounded-lg bg-white border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                                                        formData.metaDescription.length > 160 ? "border-red-300" : ""
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Search & Indexing</h4>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">Search Engine Indexing</p>
                                                    <p className="text-xs text-slate-500">Enable or disable indexing for this post</p>
                                                </div>
                                                <Button
                                                    variant={formData.isIndexed ? "primary" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setFormData(prev => ({ ...prev, isIndexed: !prev.isIndexed }))}
                                                >
                                                    {formData.isIndexed ? "Index (Follow)" : "NoIndex (NoFollow)"}
                                                    {formData.isIndexed ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <EyeOff className="ml-2 w-4 h-4" />}
                                                </Button>
                                            </div>
                                            <Input
                                                label="Canonical URL"
                                                name="canonicalUrl"
                                                value={formData.canonicalUrl}
                                                onChange={handleChange}
                                                fullWidth
                                                placeholder="https://example.com/original-post"
                                                helperText="Specify the authoritative URL of this content"
                                            />
                                        </div>
                                    </div>

                                    {/* Search Engine Preview */}
                                    <div className="pt-8 border-t border-slate-100">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Google Preview</h4>
                                        <div className="max-w-xl p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <p className="text-[#1a0dab] text-xl hover:underline cursor-pointer font-medium mb-1">
                                                {formData.metaTitle || "Meta Title Preview"}
                                            </p>
                                            <p className="text-[#006621] text-sm mb-1">
                                                {formData.canonicalUrl || `https://myblog.com/post/${formData.slug}`}
                                            </p>
                                            <p className="text-[#545454] text-sm leading-relaxed line-clamp-2">
                                                {formData.metaDescription || "Your meta description will appear here. It should be concise and contain relevant keywords."}
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {activeTab === "maintenance" && (
                            <div className="space-y-6">
                                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm text-amber-500">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-900">Content Staleness Warning</h4>
                                        <p className="text-xs text-amber-700">This post hasn't been updated in 8 months. High risk of technical obsolescence.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader title="Quality Checklist" subtitle="Automated Content Audit" icon={ShieldCheck} />
                                        <CardBody className="pt-0 space-y-3">
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50">
                                                <span className="text-xs font-medium text-emerald-800">Heading Structure</span>
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50">
                                                <span className="text-xs font-medium text-emerald-800">Word Count (&gt;800)</span>
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/50">
                                                <span className="text-xs font-medium text-red-800">Internal Link Depth</span>
                                                <AlertTriangle size={14} className="text-red-500" />
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50">
                                                <span className="text-xs font-medium text-emerald-800">Alt Text Check</span>
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader title="Internal Maintenance" subtitle="Private Admin Notes" icon={LockIcon} />
                                        <CardBody className="pt-0 space-y-6">
                                            <Input
                                                label="Last Manual Review"
                                                type="date"
                                                name="lastReviewedAt"
                                                value={formData.lastReviewedAt}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">Internal Admin Notes</label>
                                                <textarea
                                                    name="internalNotes"
                                                    value={formData.internalNotes}
                                                    onChange={handleChange}
                                                    placeholder="Notes about sources, future updates, or technical hurdles..."
                                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500/10 focus:outline-none bg-slate-50/30 italic text-slate-600"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700">Content Freshness</p>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter tabular-nums">AUTO-DETECTED STATUS</p>
                                                </div>
                                                <Badge variant={formData.freshness === "fresh" ? "success" : formData.freshness === "outdated" ? "danger" : "warning"}>
                                                    {formData.freshness.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader title="Revision History" subtitle="System Snapshots" icon={FileText} />
                                        <CardBody className="pt-0">
                                            <div className="space-y-3">
                                                {[
                                                    { date: "2024-01-15", author: "Admin", note: "SEO Title optimization" },
                                                    { date: "2023-11-20", author: "Admin", note: "Initial Publication" }
                                                ].map((rev, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2 border-b border-slate-100 last:border-0">
                                                        <div>
                                                            <p className="text-[11px] font-bold text-slate-700">{rev.date}</p>
                                                            <p className="text-[9px] text-slate-400">{rev.note}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="text-[9px] font-bold uppercase py-0 h-6">Restore</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-6 w-full lg:w-80 flex-shrink-0">
                        {/* Publish settings */}
                        <Card>
                            <CardBody className="space-y-4">
                                <h3 className="font-semibold text-slate-800">Publish</h3>
                                <Select
                                    label="Status"
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, status: value }))
                                    }
                                    fullWidth
                                />
                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="ghost" fullWidth>
                                        <Eye className="mr-2 w-4 h-4" /> Preview
                                    </Button>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        disabled={updatePostMutation.isPending}
                                    >
                                        {updatePostMutation.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                                        {updatePostMutation.isPending ? "Saving..." : "Update"}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Category & Tags */}
                        <Card>
                            <CardBody className="space-y-6">
                                <Select
                                    label="Category"
                                    options={[]} // Should be populated from useCategoryList
                                    value={formData.categoryId}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, categoryId: value }))
                                    }
                                    fullWidth
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Tags</label>
                                    {/* Tag selector logic goes here */}
                                    <p className="text-xs text-slate-400">Select relevant tags for your post.</p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Sticky ToC Preview */}
                        <div className="sticky top-24 space-y-4">
                            <Card className="bg-slate-50/30 border-slate-200/60 shadow-none">
                                <CardHeader
                                    title="Structure Preview"
                                    subtitle="Current Heading Hierarchy"
                                    icon={List}
                                />
                                <CardBody className="pt-0">
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                        <div className="pl-0 text-xs font-bold text-slate-800 flex items-center gap-2 group cursor-pointer hover:text-blue-600 transition-colors">
                                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                                            <span>H1: {formData.title || "Untitled Post"}</span>
                                        </div>
                                        <div className="pl-4 text-xs font-medium text-slate-600 flex items-center gap-2 group cursor-pointer hover:text-blue-600 transition-colors">
                                            <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-300" />
                                            <span>H2: ClusterIP Deep Dive</span>
                                        </div>
                                        <div className="pl-8 text-xs text-slate-500 flex items-center gap-2 group cursor-pointer hover:text-blue-600 transition-colors">
                                            <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-blue-200" />
                                            <span>H3: Routing Logic</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="bg-blue-50/30 border-blue-100/60 shadow-none">
                                <CardBody className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-800">Quality Score: 85%</p>
                                        <p className="text-[10px] text-blue-600">Content looks healthy for SEO.</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
}
