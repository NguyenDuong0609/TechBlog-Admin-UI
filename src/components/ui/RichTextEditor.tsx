"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { cn } from "@/lib/utils";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    className?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            "p-1.5 rounded-md transition-colors duration-200",
            isActive
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
        )}
    >
        <Icon size={16} />
    </button>
);

const EditorToolbar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center flex-wrap gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                icon={Bold}
                title="Bold"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                icon={Italic}
                title="Italic"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                icon={Strikethrough}
                title="Strikethrough"
            />
            <div className="w-px h-5 bg-slate-300 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                icon={Heading1}
                title="Heading 1"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                icon={Heading2}
                title="Heading 2"
            />
            <div className="w-px h-5 bg-slate-300 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                icon={List}
                title="Bullet List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                icon={ListOrdered}
                title="Ordered List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                icon={Quote}
                title="Blockquote"
            />
            <div className="w-px h-5 bg-slate-300 mx-1" />
            <ToolbarButton
                onClick={() => {
                    const previousUrl = editor.getAttributes('link').href
                    const url = window.prompt('URL', previousUrl)
                    if (url === null) return
                    if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run()
                        return
                    }
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }}
                isActive={editor.isActive("link")}
                icon={LinkIcon}
                title="Link"
            />
            <ToolbarButton
                onClick={() => {
                    const url = window.prompt('Image URL')
                    if (url) {
                        editor.chain().focus().setImage({ src: url }).run()
                    }
                }}
                isActive={editor.isActive("image")}
                icon={ImageIcon}
                title="Image"
            />
            <div className="w-px h-5 bg-slate-300 mx-1 ml-auto" />
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                icon={Undo}
                title="Undo"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                icon={Redo}
                title="Redo"
            />
        </div>
    );
};

export function RichTextEditor({ content, onChange, className }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline hover:text-indigo-800',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-3",
                    className
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync content if it changes externally (controlled component)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!isMounted || !editor) {
        return <div className="min-h-[300px] border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 animate-pulse">Loading editor...</div>;
    }

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all duration-200 shadow-sm hover:border-slate-300">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
