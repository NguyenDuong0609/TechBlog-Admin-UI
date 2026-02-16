"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common";
import { Card, CardBody, Button, Input, Select } from "@/components/ui";
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
    () => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor),
    { ssr: false }
);
import { cn } from "@/lib/utils";
import {
    FilePlus,
    Save,
    Eye,
    ArrowLeft,
    X,
    Loader2,
    CheckCircle2,
    Globe,
    Lock,
    Calendar,
    Search,
    Edit2,
} from "lucide-react";
import { useCreatePost } from "@/features/posts/hooks/usePosts";
import { useCategoryList } from "@/features/categories/hooks/useCategories";
import { useTagList } from "@/features/tags/hooks/useTags";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Status options for post
 */
const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
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
                            {/* Color support removed from schema, but if present in future: */}
                            {/* <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tag.color || '#cbd5e1' }}
                            /> */}
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

/**
 * Create post page
 * Form for creating a new blog post
 */
export default function CreatePostPage() {
    const router = useRouter();
    const createPostMutation = useCreatePost();

    // Fetch options
    const { data: categoriesData } = useCategoryList();
    const { data: tagsData } = useTagList();

    const categories = categoriesData || [];
    const tags = tagsData || [];

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        status: "draft",
        tags: [] as string[],
        metaDescription: "",
        focusKeyword: "",
        visibility: "public",
        publishDate: "",
    });

    const [isPreview, setIsPreview] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === "title") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
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
        console.log("Creating post:", formData);

        try {
            await createPostMutation.mutateAsync({
                ...formData,
                // Map status to boolean
                // status: formData.status === "published", // API expects data object
                // In API route: published: status === "published"
                // So pass formData directly, but API might ignore tags if logic not implemented.
            });
            router.push("/admin/posts");
        } catch (error) {
            console.error("Failed to create post", error);
            // Show error message
        }
    };

    return (
        <div className="space-y-6">
            <div className="sticky top-0 z-30 flex items-center justify-between py-4 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 -mx-4 px-4 lg:-mx-6 lg:px-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => router.back()}>
                        Back
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-slate-900 leading-tight">Create New Post</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Drafting Mode</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] text-slate-400 font-medium">{wordCount} words</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isAutoSaving ? (
                            <span className="flex items-center gap-1.5"><Loader2 size={10} className="animate-spin" /> saving...</span>
                        ) : (
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-emerald-500" /> Auto-saved</span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={isPreview ? Edit2 : Eye}
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        {isPreview ? "Edit Mode" : "Preview"}
                    </Button>
                    <Button
                        form="post-form"
                        type="submit"
                        size="sm"
                        variant="primary"
                        icon={createPostMutation.isPending ? Loader2 : Save}
                        disabled={createPostMutation.isPending}
                    >
                        {createPostMutation.isPending ? "Saving..." : (formData.status === "published" ? "Publish Post" : "Save Draft")}
                    </Button>
                </div>
            </div>

            <PageHeader
                title="Create Post"
                description="Write a new technical blog post with markdown support"
                icon={FilePlus}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "Posts", href: "/admin/posts" },
                    { label: "Create" },
                ]}
            />

            <form id="post-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                            {/* Editor Toolbar */}
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Editor Content</div>
                            </div>

                            <CardBody className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        label="Slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="post-url-slug"
                                        helperText="URL-friendly version"
                                        fullWidth
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Content</label>
                                    {isPreview ? (
                                        <div className="w-full min-h-[500px] p-6 bg-slate-50 rounded-lg border border-slate-200 prose prose-slate max-w-none">
                                            <h1 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-4 mb-6">{formData.title || "Untiled Post"}</h1>
                                            {/* Render HTML for preview since we are using Rich Text now */}
                                            <div dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-slate-400 italic'>No content to preview.</p>" }} />
                                        </div>
                                    ) : (
                                        <RichTextEditor
                                            content={formData.content}
                                            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                        />
                                    )}
                                </div>

                                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                                    <label className="text-sm font-bold text-slate-700">Excerpt</label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        placeholder="Brief summary for social media and search results..."
                                        rows={3}
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-lg bg-slate-50/50 border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                                        )}
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Recommended: 150-160 characters</p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* SEO Section */}
                        <Card className="border-slate-200/60 shadow-none">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                                <Search size={14} className="text-slate-400" />
                                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">SEO Technical Audit</h3>
                            </div>
                            <CardBody className="space-y-4">
                                <Input
                                    label="Focus Keyword"
                                    name="focusKeyword"
                                    value={formData.focusKeyword}
                                    onChange={handleChange}
                                    placeholder="e.g., React Hooks Tutorial"
                                    fullWidth
                                />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Meta Description</label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        placeholder="Enter meta description for search engines..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed mb-1">AUDIT SUGGESTIONS</p>
                                    <ul className="text-[10px] text-amber-700/80 space-y-1">
                                        <li>• Missing meta description in first paragraph</li>
                                        <li>• Keyword density is low (0.2%)</li>
                                        <li>• External links are missing</li>
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish settings */}
                        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Publish Settings</h3>
                            </div>
                            <CardBody className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-700 flex items-center gap-2"><Lock size={12} /> Visibility</label>
                                        <select
                                            value={formData.visibility}
                                            onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                                            className="text-xs font-bold text-indigo-600 bg-transparent border-none focus:ring-0"
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-700 flex items-center gap-2"><Calendar size={12} /> Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.publishDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                                            className="text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 mx-[-1rem] my-2" />

                                <Select
                                    label="Display Status"
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, status: value }))
                                    }
                                    fullWidth
                                />

                                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50 space-y-2">
                                    <p className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Pre-publish Checklist</p>
                                    <ul className="space-y-1.5">
                                        <li className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                            {formData.title ? <CheckCircle2 size={12} className="text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />}
                                            Post title defined
                                        </li>
                                        <li className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                            {formData.content.length > 300 ? <CheckCircle2 size={12} className="text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />}
                                            Minimum length (300 words)
                                        </li>
                                        <li className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                            {formData.tags.length > 0 ? <CheckCircle2 size={12} className="text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />}
                                            Tags selected
                                        </li>
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Classification: Category & Tags */}
                        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Classification</h3>
                            </div>
                            <CardBody className="space-y-5">
                                <Select
                                    label="Primary Category"
                                    options={categoryOptions}
                                    value={formData.categoryId}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, categoryId: value }))
                                    }
                                    placeholder="Select category"
                                    fullWidth
                                />

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700">Tags</label>
                                    <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50/50 rounded-lg border border-slate-200 shadow-inner">
                                        {formData.tags.map(tagId => {
                                            const tag = tags.find(t => t.id === tagId);
                                            return (
                                                <span key={tagId} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-600 shadow-sm animate-in fade-in zoom-in duration-200">
                                                    {tag?.name || tagId}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTagToggle(tagId)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                        {formData.tags.length === 0 && (
                                            <span className="text-[10px] text-slate-400 italic py-1">No tags selected</span>
                                        )}
                                    </div>

                                    <div className="relative group/search">
                                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search tags or type to add..."
                                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val) {
                                                        const existingTag = tags.find(t => t.name.toLowerCase() === val.toLowerCase());
                                                        const tagToAdd = existingTag ? existingTag.id : val;
                                                        if (!formData.tags.includes(tagToAdd)) {
                                                            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagToAdd] }));
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Suggestions */}
                                    <div className="flex flex-wrap gap-1 px-1">
                                        {tags.slice(0, 5).map(tag => (
                                            !formData.tags.includes(tag.id) && (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => handleTagToggle(tag.id)}
                                                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-0.5 rounded transition-all"
                                                >
                                                    + {tag.name}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
