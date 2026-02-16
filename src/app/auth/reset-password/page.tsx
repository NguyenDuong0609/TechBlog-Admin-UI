"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardFooter, Button, Input } from "@/components/ui";
import { Mail, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Reset password for:", email);
        setIsLoading(false);
        setIsSent(true);
    };

    return (
        <Card className="border border-slate-200/60 shadow-sm">
            <CardHeader
                title="Reset password"
                subtitle="We’ll send you a secure reset link"
                className="text-center pb-6"
            />
            <CardBody className="px-6 sm:px-8 pb-8">
                {isSent ? (
                    <div className="text-center space-y-5 py-6 animation-in fade-in duration-500">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
                            <Mail className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Security link sent</h3>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto font-medium">
                                A secure reset link has been routed to: <br />
                                <span className="text-slate-900 font-bold mt-1 block px-2 py-1 bg-slate-100 rounded inline-block">{email}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 italic">Please check your inbox within 60 minutes.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="developer@node.domain"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={Mail}
                            fullWidth
                            required
                        />
                        <Button type="submit" fullWidth isLoading={isLoading} className="h-11 text-sm font-bold shadow-sm bg-blue-600 hover:bg-blue-700">
                            Send reset link
                        </Button>
                    </form>
                )}
            </CardBody>
            <CardFooter className="text-center justify-center border-t border-slate-100/60 py-6 px-8">
                <Link
                    href="/auth/sign-in"
                    className="inline-flex items-center gap-2.5 text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to sign in
                </Link>
            </CardFooter>
        </Card>
    );
}
