"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import AdminProfileModal from "./AdminProfileModal";
import LogoutModal from "./LogoutModal";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [userFoto, setUserFoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const fetchProfile = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/profil", {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setUsername(data.user?.nama || "Admin");
        setUserFoto(data.user?.foto || "");
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      router.push("/auth/login");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProfile();

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    const handleProfileUpdate = () => fetchProfile(true);
    window.addEventListener("profileUpdate", handleProfileUpdate);

    return () => window.removeEventListener("profileUpdate", handleProfileUpdate);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Data Siswa', href: '/admin/siswa', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Data Guru', href: '/admin/guru', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Jurusan', href: '/admin/jurusan', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { name: 'Kelas', href: '/admin/kelas', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Tingkat', href: '/admin/tingkat', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Mata Pelajaran', href: '/admin/mata-pelajaran', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-500/10 rounded-3xl rotate-12"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-3xl animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* GLOBAL BACKGROUND */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/bg-sekolah.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/60 backdrop-blur-2xl transition-colors duration-700"></div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-[60] h-full w-72 glass-effect premium-shadow transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-8 pb-4 shrink-0">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">CBT <span className="text-blue-600 font-black tracking-[0.1em]">ADMIN</span></span>
            </div>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto no-scrollbar">
            <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">Dashboard & Management</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40'}`}>
                    <svg className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 shrink-0 mt-auto border-t border-slate-100 dark:border-white/5">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 group shadow-sm bg-white/50 dark:bg-white/5"
            >
              <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="flex-1 text-left">Keluar Akun</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm"
        />
      )}

      {/* MAIN CONTAINER */}
      <div className={`flex-1 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'}`}>
        <header className="sticky top-0 z-40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl px-8 h-24 border-b border-white/20 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 flex items-center justify-center glass-effect rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <svg className={`w-6 h-6 transition-transform duration-500 ${isSidebarOpen ? 'rotate-180 text-blue-600' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isSidebarOpen ? "M11 19l-7-7 7-7" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Authenticated</span>
              <h2 className="text-lg sm:text-xl font-black tracking-tighter uppercase italic" title={username}>
                {username?.length > 7 ? username.substring(0, 7) + "..." : username}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden w-12 h-12 glass-effect rounded-2xl items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg group"
            >
              {theme === 'dark' ? (
                <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c.44-.06.9-.1 1.36-.1z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM12 18V21M12 3V6" /></svg>
              )}
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>

            <div
              className="flex items-center gap-3 p-2 pr-4 bg-white/50 dark:bg-white/5 border border-white/20 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm group"
              onClick={() => setIsProfileModalOpen(true)}
            >
              {userFoto ? (
                <img src={userFoto} alt={username} className="w-10 h-10 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black group-hover:rotate-6 transition-transform shadow-lg">
                  {username?.charAt(0) || 'A'}
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-[10px] font-black text-slate-400 leading-none">Logged in as</p>
                <p className="text-xs font-black uppercase italic" title={username}>
                  {username?.length > 5 ? username.substring(0, 5) + "..." : username}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 relative z-10 w-full overflow-x-hidden">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {children}
          </div>
        </main>

        <footer className="p-8 text-center border-t border-slate-100 dark:border-white/5 opacity-80">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-slate-600 dark:text-slate-400">© 2024 CBT System Ultimate v2.5.0</p>
        </footer>
      </div >

      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div >
  );
}
