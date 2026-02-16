import AdminLayout from "@/app/admin/layout";
import DashboardPage from "@/app/admin/dashboard/page";

export default function HomePage() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}