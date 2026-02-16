"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardFooter, Button, Input } from "@/components/ui";
import { User, Mail, Lock } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock registration delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Register with:", formData);
        setIsLoading(false);
        router.push("/admin/dashboard");
    };

    return (
        <Card className="border border-slate-200/60 shadow-sm">
            <CardHeader
                title="Create account"
                subtitle="Start publishing technical content on Author Node"
                className="text-center pb-6"
            />
            <CardBody className="px-6 sm:px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        leftIcon={User}
                        fullWidth
                        required
                    />
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
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            leftIcon={Lock}
                            fullWidth
                            required
                            helperText="(Minimum 8 characters)"
                        />
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                            required
                        />
                        <label htmlFor="agreeTerms" className="text-xs text-slate-500 leading-normal cursor-pointer">
                            I agree to the{" "}
                            <Link href="#" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                Terms & Usage Policy
                            </Link>
                        </label>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 h-11 text-sm font-bold shadow-sm bg-blue-600 hover:bg-blue-700">
                        Create account
                    </Button>
                </form>
            </CardBody>
            <CardFooter className="text-center justify-center border-t border-slate-100/60 py-6 px-8">
                <p className="text-xs font-medium text-slate-500">
                    Already have an account?{" "}
                    <Link href="/auth/sign-in" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
