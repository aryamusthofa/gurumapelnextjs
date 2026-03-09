"use client";

import { useEffect, useState } from "react";

export default function GuruProfileModal({ isOpen, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEdit, setIsEdit] = useState(false);
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");

    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Smooth animation states
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    // Trigger enter animation after mount
    useEffect(() => {
        if (isOpen) {
            setClosing(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    // Smooth close handler
    const handleClose = () => {
        setClosing(true);
        setVisible(false);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 300);
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfil = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/profil", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Gagal mengambil data profil");

                setUser(data.user);
                setNama(data.user.nama);
                setEmail(data.user.email);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfil();
    }, [isOpen]);

    const handleUpdateProfil = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/profil/edit", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nama, email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setUser({ ...user, nama, email });
            setIsEdit(false);
            setMessage({ text: "Profil berhasil diperbarui", type: "success" });

            window.dispatchEvent(new Event("profileUpdate"));
        } catch (err) {
            setMessage({ text: err.message, type: "error" });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });
        setPasswordLoading(true);

        try {
            const res = await fetch("/api/profil/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ passwordLama, passwordBaru }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setPasswordLama("");
            setPasswordBaru("");
            setPasswordMode(false);
            setMessage({ text: "Password berhasil diubah", type: "success" });
        } catch (err) {
            setMessage({ text: err.message, type: "error" });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!isOpen && !closing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* OVERLAY */}
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-[8px] transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            {/* MODAL CONTENT */}
            <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-300 ease-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>

                {/* GLOW EFFECT */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-all z-50 hover:rotate-90 active:scale-90"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-white font-black tracking-widest uppercase text-xs animate-pulse">Memuat Profil Guru...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-[2rem] text-center my-10">
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-red-200 font-black uppercase tracking-widest text-sm mb-2">Terjadi Kesalahan</p>
                        <p className="text-slate-300 font-medium mb-0">{error}</p>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-white/10 shrink-0">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">Profil <span className="text-blue-400">Pengajar</span></h1>
                                <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest mt-1">Identitas Digital Guru</p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                                <div className={`w-1 h-6 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
                            </div>
                        )}

                        {!isEdit && !passwordMode ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.07] transition-all">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Nama Lengkap</p>
                                        <p className="text-lg sm:text-xl font-black text-white truncate block max-w-[150px] sm:max-w-[250px] md:max-w-[350px]" title={user.nama}>{user.nama}</p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.07] transition-all">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Alamat Email</p>
                                        <p className="text-md sm:text-xl font-black text-white break-all">{user.email}</p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.07] transition-all">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Peran Sistem</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            <p className="text-lg font-black text-white capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        onClick={() => setIsEdit(true)}
                                        className="flex-1 bg-white/10 hover:bg-white text-white hover:text-blue-900 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl border border-white/10"
                                    >
                                        Edit Profil
                                    </button>
                                    <button
                                        onClick={() => setPasswordMode(true)}
                                        className="flex-1 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl border border-amber-500/20"
                                    >
                                        Ubah Sandi
                                    </button>
                                </div>
                            </div>
                        ) : isEdit ? (
                            <form onSubmit={handleUpdateProfil} className="space-y-6 animate-in slide-in-from-right-4">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    Perbarui Informasi
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-3xl font-black shadow-xl hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Simpan Perubahan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEdit(false)}
                                        className="w-full sm:w-auto px-8 bg-white/5 hover:bg-white/10 text-white py-5 rounded-3xl font-black border border-white/10 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Kembali
                                    </button>
                                </div>
                            </form>
                        ) : passwordMode ? (
                            <form onSubmit={handleUpdatePassword} className="space-y-6 animate-in slide-in-from-right-4">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                                    Ubah Kata Sandi
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password Lama</label>
                                        <input
                                            type="password"
                                            value={passwordLama}
                                            onChange={(e) => setPasswordLama(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordBaru}
                                            onChange={(e) => setPasswordBaru(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white py-5 rounded-3xl font-black border border-red-500/30 transition-all disabled:opacity-50 active:scale-95 shadow-xl text-sm uppercase tracking-widest"
                                    >
                                        {passwordLoading ? 'Memproses...' : 'Konfirmasi Sandi'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPasswordMode(false)}
                                        className="w-full sm:w-auto px-8 bg-white/5 hover:bg-white/10 text-white py-5 rounded-3xl font-black border border-white/10 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Kembali
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
