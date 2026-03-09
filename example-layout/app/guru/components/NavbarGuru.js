"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarGuru() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-3xl border-b border-white/10 px-8 py-5 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white">PORTAL <span className="text-blue-400 uppercase">GURU</span></h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/guru/profil"
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl font-bold text-sm transition-all active:scale-95"
        >
          Profil Saya
        </Link>

        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-200 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar
        </button>
      </div>
    </nav>
  );
}
