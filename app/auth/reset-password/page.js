"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setMsg("Token tidak valid atau sudah kedaluwarsa.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMsg("Password tidak cocok");
        }

        setLoading(true);
        setMsg("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } else {
                setMsg(data.message || "Gagal mereset password");
            }
        } catch (error) {
            setMsg("Terjadi kesalahan server");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Token Tidak Valid</h2>
                <p className="text-slate-400 mb-6 text-sm">{msg}</p>
                <Link href="/auth/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs hover:bg-white/10 transition-colors">
                    Kembali ke Login
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white mb-2">Atur Ulang Password</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gunakan password yang kuat</p>
            </div>

            {success ? (
                <div className="text-center py-6 bg-green-500/10 border border-green-500/20 rounded-3xl">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-green-200 text-sm font-bold mb-2">Password Berhasil Diperbarui!</p>
                    <p className="text-green-500/60 text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Mengarahkan dalam 3 detik...
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {msg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                            <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{msg}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Password Baru</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 pl-6 pr-12 py-4 rounded-2xl font-bold text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.04m4.066-4.116A9.95 9.95 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.105-2.105l-2.436-2.436m0 0L10.435 10.435m0 0L3 3m10.875 10.875a3 3 0 00-4.25-4.25m4.25 4.25l-4.25-4.25" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Konfirmasi Password</label>
                        <div className="relative group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 pl-6 pr-12 py-4 rounded-2xl font-bold text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.04m4.066-4.116A9.95 9.95 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.105-2.105l-2.436-2.436m0 0L10.435 10.435m0 0L3 3m10.875 10.875a3 3 0 00-4.25-4.25m4.25 4.25l-4.25-4.25" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all disabled:opacity-50 active:scale-95 mt-4"
                    >
                        {loading ? "Menyimpan..." : "Update Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            {/* BACKGROUND IMAGE WITH BLUR */}
            <div
                className="fixed inset-0 z-[-1]"
                style={{
                    backgroundImage: "url('/bg-sekolah.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[8px]"></div>
            </div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <Suspense fallback={<p className="text-center text-white">Memuat...</p>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
