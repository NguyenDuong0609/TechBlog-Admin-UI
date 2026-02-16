import React from "react";
import { cn } from "@/lib/utils";

/**
 * Footer component for the admin layout
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={cn(
                "mt-auto py-4 px-6",
                "border-t border-slate-200/60",
                "bg-white/50"
            )}
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                    © {currentYear}{" "}
                    <span className="font-medium text-slate-700">Admin Dashboard</span>.
                    All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Documentation
                    </a>
                    <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Support
                    </a>
                    <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
}
