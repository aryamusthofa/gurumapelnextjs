"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [userFoto, setUserFoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        setUserFoto(data.user.foto || "");
      } catch (error) {
        console.error(error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/auth/login");
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Siswa', href: '/admin/siswa', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Guru', href: '/admin/guru', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Penugasan Guru', href: '/admin/guru/mapel', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Kelas', href: '/admin/kelas', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Tingkat', href: '/admin/tingkat', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Jurusan', href: '/admin/jurusan', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { name: 'Mata Pelajaran', href: '/admin/mata-pelajaran', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Profil Saya', href: '/admin/profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const handleLogoutWithConfirm = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      handleLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-blue-500/10 rounded-3xl rotate-12"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-3xl animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* BACKGROUND IMAGE - STICKY TO VIEWPORT */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none transition-all duration-[3s]"
        style={{
          backgroundImage: "url('/bg-sekolah.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px]"></div>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/80 backdrop-blur-3xl border-r border-slate-200/50 shadow-2xl transition-all duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto custom-scrollbar`}>
        <div className="flex flex-col h-full">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => router.push('/admin')}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-800">CBT <span className="text-blue-600">ADMIN</span></span>
            </div>

            <nav className="space-y-1.5">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Navigasi Utama</p>
              {menuItems.map((item) => {
                // MODIFIKASI: Logika isActive yang lebih cerdas untuk menghindari double highlighting
                const isActive = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');

                // Khusus guru vs assignment (kalau assignment aktif, guru jangan ikut biru)
                const isFinalActive = item.name === 'Guru' && pathname.includes('/mapel') ? false : isActive;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${isFinalActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/30 ring-1 ring-blue-400/50' : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md'}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isFinalActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                      <svg className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${isFinalActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                      </svg>
                    </div>
                    <span className="flex-1 text-sm">{item.name}</span>
                    {isFinalActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    )}
                  </Link>
                );
              })}

              {/* EXIT / LOGOUT ITEM */}
              <button
                onClick={handleLogoutWithConfirm}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all duration-300 group mt-4 border border-transparent hover:border-red-100"
              >
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="flex-1 text-sm text-left">Keluar Sistem</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Build Version</p>
              <p className="text-white font-black text-xl tracking-tighter">v2.4.0 <span className="text-xs font-bold text-slate-500 ml-2">PRO</span></p>
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* MAIN LAYOUT */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'}`}>
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-[51] w-full h-24 bg-white/60 backdrop-blur-3xl border-b border-slate-200/50 flex items-center justify-between px-8 transition-all duration-500 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 flex items-center justify-center bg-white/95 border border-slate-200 rounded-2xl shadow-xl hover:shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all z-[60]"
              title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            >
              <svg className={`w-6 h-6 transition-transform duration-500 ${isSidebarOpen ? 'rotate-180 text-blue-600' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">Control Center</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">{username || 'Administrator'}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Preview Circle */}
            <div className="flex items-center gap-3 bg-white/80 border border-slate-200 p-1.5 pl-4 rounded-2xl shadow-xl hover:shadow-blue-500/10 transition-all group cursor-pointer" onClick={() => router.push('/admin/profil')}>
              <div className="text-right flex flex-col justify-center">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                <p className="text-xs font-black text-slate-900 leading-none truncate max-w-[120px]">{username}</p>
              </div>
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                {userFoto ? (
                  <img src={userFoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  username?.charAt(0) || 'A'
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-12rem)]">
            {children}
          </div>

          {/* PROFESSIONAL FOOTER */}
          <footer className="mt-20 py-10 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 px-8 bg-white/5 backdrop-blur-md rounded-t-[3rem]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div>
                <p className="text-base font-black text-slate-900 tracking-tight">CBT System <span className="text-blue-600">v2.4.0</span></p>
                <p className="text-xs font-bold text-slate-600">© 2024 Arutalla Digital. All rights reserved.</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="h-10 w-px bg-slate-300 hidden md:block"></div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Status Lokal</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                  <span className="text-sm font-black text-slate-800">Sistem Terhubung</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-300 hidden md:block"></div>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-xs font-black text-slate-700 hover:text-blue-600 transition-all uppercase tracking-widest">Bantuan</Link>
                <Link href="#" className="text-xs font-black text-slate-700 hover:text-blue-600 transition-all uppercase tracking-widest">Kebijakan</Link>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        
        .glass-card {
          @apply bg-white/70 backdrop-blur-xl border border-slate-200/50;
        }

        input, button, a { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}
