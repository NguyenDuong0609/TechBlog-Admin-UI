import { cn } from "@/lib/utils";
import { Sidebar, Navbar, Footer } from "@/components/layout";
import { SidebarProvider } from "@/hooks/useSidebar";

interface AdminLayoutProps {
    children: React.ReactNode;
}

/**
 * Admin layout component
 * Wraps pages with sidebar, navbar, and footer
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar />
                    <main className={cn("flex-1 p-4 lg:p-6", "overflow-x-hidden")}>
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </SidebarProvider>
    );
}
