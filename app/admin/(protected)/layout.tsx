import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav userEmail={session?.user?.email} />
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
