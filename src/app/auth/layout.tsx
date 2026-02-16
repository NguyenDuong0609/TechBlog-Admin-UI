"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Abstract Background Curve */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <svg
                    className="absolute bottom-0 left-0 w-full h-[120%] opacity-[0.08] translate-y-[10%]"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,1000 C300,950 700,50 1000,0 L1000,1000 L0,1000 Z"
                        fill="url(#auth-gradient)"
                    />
                    <defs>
                        <linearGradient id="auth-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#2563EB" />
                            <stop offset="100%" stopColor="#0891B2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Header/Logo - Subdued branding */}
            <div className="mb-8 text-center relative z-10">
                <Link
                    href="/"
                    className="group"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm group-hover:border-blue-200 transition-all duration-300">
                            <LayoutDashboard size={24} className="text-slate-900 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="mt-1 text-center">
                            <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
                                Author Node
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Main Content Card - Max-width: 420px */}
            <div className="w-full max-w-[420px] relative z-10">
                {children}
            </div>

            <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 relative z-10">
                Protected Workspace Environment
            </div>
        </div>
    );
}
