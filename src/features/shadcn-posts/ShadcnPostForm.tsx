"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import { Switch } from "@/components/shadcn/switch";
import { useCreatePost, useUpdatePost } from "@/features/posts/hooks/usePosts";
import { useCategoryList } from "@/features/categories/hooks/useCategories";
import { useTagList } from "@/features/tags/hooks/useTags";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const postSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters.",
    }),
    content: z.string().min(10, {
        message: "Content must be at least 10 characters.",
    }),
    categoryId: z.string().min(1, {
        message: "Please select a category.",
    }),
    published: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
});

interface ShadcnPostFormProps {
    post?: any;
    onSuccess: () => void;
}

export function ShadcnPostForm({ post, onSuccess }: ShadcnPostFormProps) {
    const createPost = useCreatePost();
    const updatePost = useUpdatePost();
    const { data: categories } = useCategoryList();
    const { data: tags } = useTagList();

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema) as any,
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            categoryId: post?.categoryId || "",
            published: post?.published || false,
            tags: post?.tags?.map((t: any) => typeof t === 'string' ? t : t.id) || [],
        },
    });

    // Auto-generate slug from title
    const title = form.watch("title");
    useEffect(() => {
        if (!post && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            form.setValue("slug", slug, { shouldValidate: true });
        }
    }, [title, post, form]);

    async function onSubmit(values: z.infer<typeof postSchema>) {
        try {
            if (post) {
                await updatePost.mutateAsync({ id: post.id, data: values });
            } else {
                await createPost.mutateAsync(values);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save post", error);
        }
    }

    const toggleTag = (tagId: string) => {
        const currentTags = form.getValues("tags");
        if (currentTags.includes(tagId)) {
            form.setValue("tags", currentTags.filter(id => id !== tagId), { shouldValidate: true });
        } else {
            form.setValue("tags", [...currentTags, tagId], { shouldValidate: true });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Post title..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="url-friendly-slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map((category: any) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Published</FormLabel>
                                    <FormDescription>
                                        Make this post visible to everyone.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {tags?.map((tag: any) => {
                                    const isSelected = field.value.includes(tag.id);
                                    return (
                                        <Button
                                            key={tag.id}
                                            type="button"
                                            variant={isSelected ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full h-8"
                                            onClick={() => toggleTag(tag.id)}
                                        >
                                            {tag.name}
                                            {isSelected && <X className="ml-1 h-3 w-3" />}
                                        </Button>
                                    );
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your content here..."
                                    className="min-h-[200px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Supports Markdown formatting.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="submit" disabled={form.formState.isSubmitting || createPost.isPending || updatePost.isPending}>
                        {(createPost.isPending || updatePost.isPending) ? "Saving..." : (post ? "Update Post" : "Create Post")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
