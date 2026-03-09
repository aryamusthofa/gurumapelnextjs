"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarSiswa() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard Siswa</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/siswa/profil"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
        >
          Profil
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
