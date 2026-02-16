import React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * Page header component with title, description, and optional actions
 */
export function PageHeader({
    title,
    description,
    icon: Icon,
    actions,
    breadcrumbs,
}: PageHeaderProps) {
    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-2">
                    <ol className="flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {index > 0 && <span className="text-slate-400">/</span>}
                                {crumb.href ? (
                                    <a
                                        href={crumb.href}
                                        className="text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-slate-700 font-medium">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div
                            className={cn(
                                "p-2.5 rounded-xl",
                                "bg-white border border-slate-200/60 shadow-sm"
                            )}
                        >
                            <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 leading-none">{title}</h1>
                        {description && (
                            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                        )}
                    </div>
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </div>
    );
}
