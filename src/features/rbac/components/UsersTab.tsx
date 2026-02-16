"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, Badge, Table } from "@/components/ui";
import { Users, ExternalLink, Plus, UserPlus } from "lucide-react";
import type { User } from "../types";

interface UsersTabProps {
    users: User[];
    roleName: string;
    isReviewMode: boolean;
    onBulkAssign: () => void;
}

export function UsersTab({ users, roleName, isReviewMode, onBulkAssign }: UsersTabProps) {
    if (users.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <Users size={36} className="mx-auto text-slate-200 mb-3" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    No users assigned
                </p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                    No users currently have the {roleName} role
                </p>
                {!isReviewMode && (
                    <Button variant="outline" size="sm" onClick={onBulkAssign}>
                        <UserPlus size={14} className="mr-1.5" />
                        Assign Users
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {!isReviewMode && (
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={onBulkAssign}>
                        <UserPlus size={14} className="mr-1.5" />
                        Assign Users
                    </Button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                <Table
                    columns={[
                        {
                            key: "name", header: "User", render: (val: unknown, row: any) => {
                                const name = val as string;
                                return (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-[10px] flex-shrink-0">
                                            {name.split(" ").map((n: string) => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{name}</p>
                                            <p className="text-[10px] text-slate-400">{row.email}</p>
                                        </div>
                                    </div>
                                );
                            }
                        },
                        {
                            key: "assignedDate", header: "Assigned", render: (val: unknown) => {
                                const dateStr = val as string;
                                return (
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        {dateStr ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                    </span>
                                );
                            }
                        },
                        {
                            key: "roleId", header: "Status", render: () => (
                                <Badge size="sm" variant="success">Active</Badge>
                            )
                        },
                        {
                            key: "actions", header: "", render: () => (
                                <Button variant="ghost" size="sm" icon={ExternalLink}>Profile</Button>
                            )
                        }
                    ]}
                    data={users}
                    keyExtractor={(user) => user.id}
                />
            </div>
        </div>
    );
}
