"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardFooter, Button, Input } from "@/components/ui";
import { Mail, Lock, Facebook, Github } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Login with:", formData);
        setIsLoading(false);
        router.push("/admin/dashboard");
    };

    return (
        <Card className="border border-slate-200/60 shadow-sm">
            <CardHeader
                title="Sign in"
                subtitle="Access your Author Node workspace"
                className="text-center pb-6"
            />
            <CardBody className="px-6 sm:px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        placeholder="developer@node.domain"
                        value={formData.email}
                        onChange={handleChange}
                        leftIcon={Mail}
                        fullWidth
                        required
                    />
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-slate-700">Password</label>
                            <Link
                                href="/auth/reset-password"
                                className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            leftIcon={Lock}
                            fullWidth
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2.5">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                        />
                        <label htmlFor="remember" className="text-xs font-semibold text-slate-500 cursor-pointer">
                            Maintain persistent session
                        </label>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 h-11 text-sm font-bold shadow-sm bg-blue-600 hover:bg-blue-700">
                        Sign in
                    </Button>
                </form>
            </CardBody>
            <CardFooter className="text-center justify-center border-t border-slate-100/60 py-6 px-8">
                <p className="text-xs font-medium text-slate-500">
                    Don’t have an account?{" "}
                    <Link href="/auth/sign-up" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                        Create one
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
