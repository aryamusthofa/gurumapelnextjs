"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setMsg(data.message || "Gagal mengirim link reset");
            }
        } catch (error) {
            setMsg("Terjadi kesalahan server");
        } finally {
            setLoading(false);
        }
    };

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
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                    {/* DECORATIVE ELEMENTS */}
                    <div className="absolute -top-24 -right-24 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
                    <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white mb-2">Lupa Password</h1>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Masukkan email untuk memulihkan akun</p>
                        </div>

                        {success ? (
                            <div className="text-center py-6 bg-green-500/10 border border-green-500/20 rounded-3xl">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-green-200 text-sm font-bold mb-6 px-4">
                                    Link reset password telah dikirim! Silakan cek email Anda.
                                </p>
                                <Link
                                    href="/auth/login"
                                    className="inline-block bg-white text-black px-6 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
                                >
                                    Kembali ke Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {msg && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                        <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{msg}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="nama@email.com"
                                        className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                                </button>

                                <div className="text-center pt-4">
                                    <Link href="/auth/login" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                                        Ingat password? Login di sini
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
