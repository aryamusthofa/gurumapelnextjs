import AdminLayout from "@/app/components/AdminLayout";

export const metadata = {
  title: "Admin CBT",
  description: "Halaman admin CBT",
};

export default function AdminPageLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}