"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import GuruProfileModal from "./GuruProfileModal";
import LogoutModal from "./LogoutModal";

export default function GuruLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/profil");
            if (!res.ok) {
                router.push("/auth/login");
                return;
            }
            const data = await res.json();
            if (data.user.role !== "guru") {
                router.push("/auth/login");
                return;
            }
            setUser(data.user);
        } catch (error) {
            router.push("/auth/login");
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchUser();

        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }

        window.addEventListener("profileUpdate", fetchUser);
        return () => window.removeEventListener("profileUpdate", fetchUser);
    }, [router]);

    if (!mounted) return null;

    const menuItems = [
        { name: "Dashboard", href: "/guru", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
            {/* GLOBAL BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 dark:opacity-30"
                    style={{ backgroundImage: "url('/bg-sekolah.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/60 backdrop-blur-2xl"></div>
            </div>

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-[60] h-full w-72 glass-effect premium-shadow transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="p-8 pb-4 shrink-0">
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setSidebarOpen(false)}>
                            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                                <span className="text-white font-black text-xl italic uppercase tracking-tighter">G</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter uppercase italic">Guru <span className="text-blue-600">Portal</span></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">CBT Center</span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto no-scrollbar">
                        <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">Navigasi Guru</p>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30" : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400"}`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40"}`}>
                                        <svg className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-600 group-hover:text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            <span className="flex-1 text-left">Keluar Akun</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm"
                />
            )}

            {/* MAIN CONTAINER */}
            <div className={`flex-1 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? "lg:pl-72" : "pl-0"}`}>
                <header className="sticky top-0 z-40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl px-8 h-24 border-b border-white/20 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="w-12 h-12 flex items-center justify-center glass-effect rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg text-slate-500 hover:text-blue-500"
                        >
                            <svg className={`w-6 h-6 transition-transform duration-500 ${isSidebarOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Authenticated</span>
                            <h2 className="text-lg sm:text-xl font-black tracking-tighter uppercase italic" title={user?.nama}>
                                {user?.nama?.length > 7 ? user.nama.substring(0, 7) + "..." : (user?.nama || "Guru")}
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

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>

                        <div
                            className="flex items-center gap-3 p-2 pr-4 bg-white/50 dark:bg-white/5 border border-white/20 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm group"
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            {user?.foto ? (
                                <img src={user.foto} alt={user?.nama} className="w-10 h-10 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black group-hover:rotate-6 transition-transform shadow-lg">
                                    {user?.nama?.charAt(0) || 'G'}
                                </div>
                            )}
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] font-black text-blue-600 leading-none uppercase tracking-widest mb-1">Teacher</p>
                                <p className="text-xs font-black uppercase italic" title={user?.nama}>
                                    {user?.nama?.length > 5 ? user.nama.substring(0, 5) + "..." : user?.nama}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 relative z-10 w-full overflow-x-hidden">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {children}
                    </div>
                </main>
            </div>

            <GuruProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
}
