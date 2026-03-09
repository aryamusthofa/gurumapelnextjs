"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profil", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUsername(data.user.nama);
      } catch (error) {
        console.error(error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/auth/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Jurusan", href: "/admin/jurusan" },
    { name: "Tingkat", href: "/admin/tingkat" },
    { name: "Kelas", href: "/admin/kelas" },
    { name: "Mapel", href: "/admin/mata-pelajaran" },
    { name: "Guru", href: "/admin/guru" },
    { name: "Siswa", href: "/admin/siswa" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="px-6 py-4 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
          <span>Admin CBT</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded transition ${pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-700 text-gray-300"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between bg-white shadow px-6 h-16 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="text-lg font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
              {username}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/profil"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded text-sm transition font-medium"
            >
              Profil
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded text-sm transition font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}