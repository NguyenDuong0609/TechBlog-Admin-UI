"use client";

import React from "react";
import { PageHeader } from "@/components/common";
import { Card, CardBody, Badge, Table, type TableColumn, Input, Button } from "@/components/ui";
import { Search, Globe, AlertTriangle, CheckCircle2, AlertCircle, Link2, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SEOPost {
    id: string;
    title: string;
    slug: string;
    metaTitleStatus: "good" | "missing" | "long";
    metaDescStatus: "good" | "missing" | "long";
    score: number;
    internalLinks: number;
    potential: "high" | "low";
}

const seoData: SEOPost[] = [
    { id: "1", title: "K8s Services Deep Dive", slug: "/post/k8s-services", metaTitleStatus: "good", metaDescStatus: "good", score: 95, internalLinks: 12, potential: "low" },
    { id: "2", title: "Introduction to Rust", slug: "/post/intro-rust", metaTitleStatus: "long", metaDescStatus: "missing", score: 45, internalLinks: 0, potential: "high" },
    { id: "3", title: "Docker Networking", slug: "/post/docker-net", metaTitleStatus: "good", metaDescStatus: "long", score: 72, internalLinks: 5, potential: "high" },
    { id: "4", title: "Serverless with AWS", slug: "/post/aws-serverless", metaTitleStatus: "missing", metaDescStatus: "missing", score: 20, internalLinks: 0, potential: "low" },
];

const columns: TableColumn<SEOPost>[] = [
    {
        key: "title",
        header: "Post Title",
        render: (val, row) => (
            <div className="space-y-1">
                <p className="font-semibold text-slate-800">{val as string}</p>
                <p className="text-[10px] text-slate-400 font-mono">{row.slug}</p>
            </div>
        ),
    },
    {
        key: "metaTitleStatus",
        header: "Meta Title",
        render: (val) => {
            if (val === "good") return <Badge variant="success" dot>Optimal</Badge>;
            if (val === "long") return <Badge variant="warning" dot>Too Long</Badge>;
            return <Badge variant="danger" dot>Missing</Badge>;
        },
    },
    {
        key: "metaDescStatus",
        header: "Meta Description",
        render: (val) => {
            if (val === "good") return <Badge variant="success" dot>Optimal</Badge>;
            if (val === "long") return <Badge variant="warning" dot>Too Long</Badge>;
            return <Badge variant="danger" dot>Missing</Badge>;
        },
    },
    {
        key: "internalLinks",
        header: "Internal Links",
        align: "center",
        render: (val) => {
            const count = val as number;
            return (
                <div className="flex flex-col items-center">
                    <span className={cn(
                        "text-xs font-bold",
                        count === 0 ? "text-red-500" : "text-slate-600"
                    )}>
                        {count}
                    </span>
                    {count === 0 && (
                        <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">Orphaned</span>
                    )}
                </div>
            );
        },
    },
    {
        key: "potential",
        header: "Potential",
        align: "right",
        render: (val) => (
            val === "high" ? (
                <Badge variant="success" size="sm" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                    <TrendingUp size={10} className="mr-1" /> High CTR
                </Badge>
            ) : (
                <span className="text-[10px] text-slate-400 font-medium">Stable</span>
            )
        ),
    },
];

// Removing duplicate import

export default function SEOManagementPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="SEO Management"
                description="Monitor on-page SEO health across all blog posts"
                icon={Globe}
                breadcrumbs={[
                    { label: "Admin", href: "/admin/dashboard" },
                    { label: "SEO" },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Input placeholder="Search posts..." leftIcon={Search} className="w-64" />
                        <Button variant="primary">Audit All</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-50/30 border-emerald-100">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-900">Optimal Posts</p>
                            <p className="text-2xl font-bold text-emerald-700">24</p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-amber-50/30 border-amber-100">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-900">Needs SEO Update</p>
                            <p className="text-2xl font-bold text-amber-700">12</p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-red-50/30 border-red-100">
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-900">Critical SEO Issues</p>
                            <p className="text-2xl font-bold text-red-700">5</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardBody className="p-0">
                            <Table
                                columns={columns}
                                data={seoData}
                                keyExtractor={(row) => row.id}
                            />
                        </CardBody>
                    </Card>

                    <Card className="bg-slate-50 border-dashed border-slate-300 shadow-none">
                        <CardBody className="py-12 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                                <Search className="text-slate-400" size={20} />
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">Advanced Audit: Orphaned Posts Detection</h4>
                            <p className="text-sm text-slate-500 max-w-md mx-6">
                                We found <strong>2 orphaned posts</strong> that have no internal links pointing to them. This makes it harder for search engines to discover and rank them.
                            </p>
                        </CardBody>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardBody className="space-y-6">
                            <div className="flex items-center gap-2 text-slate-800">
                                <Link2 size={18} className="text-indigo-600" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Internal Link Suggestions</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group">
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">Rust Memory Safety</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Suggest linking from: <strong>Intro to Rust</strong></p>
                                </div>
                                <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group">
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">K8s Ingress Controllers</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Suggest linking from: <strong>K8s Services</strong></p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-blue-600 text-white border-none shadow-indigo-200/50 shadow-lg group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={80} />
                        </div>
                        <CardBody className="space-y-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-md">
                                    <Info size={14} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-100">Search Inisght</h3>
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                                "Docker Networking" has <strong>high impressions</strong> but low CTR.
                                <span className="block mt-2 font-bold text-blue-100">Action: Refine Meta Title to improve clicks.</span>
                            </p>
                            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 border-none w-full">
                                Details
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
