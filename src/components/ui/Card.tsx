import React from "react";
import { cn } from "@/lib/utils";

/**
 * Card component props
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
    hoverable?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    icon?: React.ElementType;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    divider?: boolean;
}

/**
 * Card container with Material Design shadow and styling
 */
export function Card({
    children,
    noPadding = false,
    hoverable = false,
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "bg-card rounded-2xl",
                "border border-slate-200/60",
                "shadow-sm shadow-slate-200/40",
                "transition-all duration-300",
                hoverable && "hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-0.5",
                !noPadding && "p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * Card header section with optional title, subtitle, and action
 */
export function CardHeader({
    title,
    subtitle,
    action,
    icon: Icon,
    children,
    className,
    ...props
}: CardHeaderProps) {
    return (
        <div
            className={cn(
                "flex items-start justify-between gap-4",
                "mb-4",
                className
            )}
            {...props}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <Icon size={18} />
                        </div>
                    )}
                    <div>
                        {title && (
                            <h3 className="text-sm font-bold text-slate-800 leading-tight tracking-tight uppercase">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>
                        )}
                    </div>
                </div>
                {children}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

/**
 * Card body content area
 */
export function CardBody({ children, className, ...props }: CardBodyProps) {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
}

/**
 * Card footer section with optional divider
 */
export function CardFooter({
    children,
    divider = false,
    className,
    ...props
}: CardFooterProps) {
    return (
        <div
            className={cn(
                "mt-4 pt-4",
                divider && "border-t border-slate-100",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
