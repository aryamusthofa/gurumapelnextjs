"use client";

import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )
    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    resolve(reader.result);
                }
            }
        }, 'image/jpeg')
    })
}

export default function AdminProfileModal({ isOpen, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [previewFoto, setPreviewFoto] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });

    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordBaru, setPasswordBaru] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Smooth animation states
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    // Cropping states
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [rawImage, setRawImage] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
                    credentials: "include",
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                setUser(data.user);
                setNama(data.user.nama);
                setEmail(data.user.email);
                setFoto(data.user.foto || "");
                setPreviewFoto(data.user.foto || "");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfil();
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ text: "Ukuran file maksimal 5MB", type: "error" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setRawImage(reader.result);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveCrop = async () => {
        try {
            const croppedImageBase64 = await getCroppedImg(rawImage, croppedAreaPixels);
            setPreviewFoto(croppedImageBase64);
            setFoto(croppedImageBase64);
            setCropModalOpen(false);
        } catch (e) {
            setMessage({ text: "Gagal memproses gambar.", type: "error" });
            console.error(e);
        }
    };

    const handleEditProfil = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/profil/edit", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama, email, foto }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setUser({ ...user, nama, email, foto });
            setEditMode(false);
            setMessage({ text: "Profil & Foto berhasil diperbarui.", type: "success" });

            window.dispatchEvent(new Event("profileUpdate"));
        } catch (err) {
            setMessage({ text: err.message, type: "error" });
        }
    };

    const handleGantiPassword = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        if (passwordBaru !== confirmPassword) {
            setMessage({ text: "Konfirmasi password tidak cocok!", type: "error" });
            return;
        }

        if (passwordBaru.length < 6) {
            setMessage({ text: "Password minimal 6 karakter.", type: "error" });
            return;
        }

        try {
            const res = await fetch("/api/profil/password", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passwordBaru }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setPasswordMode(false);
            setPasswordBaru("");
            setConfirmPassword("");
            setMessage({ text: "Kata sandi Anda telah berhasil diperbarui.", type: "success" });
        } catch (err) {
            setMessage({ text: err.message, type: "error" });
        }
    };

    if (!isOpen && !closing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* OVERLAY */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            {/* CROP OVERLAY MODAL */}
            {cropModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center">
                        <h3 className="text-xl font-black mb-4 dark:text-white">Sesuaikan Foto (1:1)</h3>
                        <div className="relative w-full h-64 sm:h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden mb-6">
                            <Cropper
                                image={rawImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={handleCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="flex gap-4 w-full">
                            <button onClick={handleSaveCrop} className="flex-1 bg-blue-600 text-white p-3 rounded-2xl font-black text-sm shadow-lg hover:bg-blue-700 active:scale-95 transition-all">Pilih Foto</button>
                            <button onClick={() => setCropModalOpen(false)} className="px-6 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-2xl font-black text-sm hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all">Batal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CONTENT */}
            <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-6 md:p-10 transition-all duration-300 ease-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>

                {/* CLOSE BUTTON */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm transition-all z-50 border border-slate-100 dark:border-white/5"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-slate-400 animate-pulse">Memuat Profil...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto py-20 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-red-600 mb-2">Akses Terputus</h2>
                        <p className="text-slate-500 font-medium mb-6">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-4">
                        {/* LEFT COLUMN: IDENTITY CARD */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 text-center relative overflow-hidden group border border-slate-200 dark:border-white/5 shadow-xl">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <svg className="w-24 h-24 transform rotate-12 text-blue-900 dark:text-blue-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                                </div>

                                {user.foto ? (
                                    <div className="w-28 h-28 mx-auto mb-6 relative group/photo">
                                        <img
                                            src={user.foto}
                                            alt={user.nama}
                                            className="w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-700 ring-1 ring-slate-200 dark:ring-white/10 transform group-hover/photo:scale-105 transition-transform"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-4xl font-black text-white shadow-2xl shadow-blue-500/40 transform group-hover:rotate-6 transition-transform">
                                        {user.nama?.charAt(0)}
                                    </div>
                                )}

                                <h2 className="text-2xl font-black tracking-tight mb-1 text-slate-800 dark:text-white truncate block w-full px-4" title={user.nama}>{user.nama}</h2>
                                <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em]">{user.role}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-white/5 shadow-lg">
                                <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors cursor-pointer group" onClick={() => { setEditMode(true); setPasswordMode(false); }}>
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Ganti Informasi</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors cursor-pointer group" onClick={() => { setPasswordMode(true); setEditMode(false); }}>
                                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Update Password</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: FORMS & DETAIL */}
                        <div className="xl:col-span-2">
                            <div className="bg-white/95 dark:bg-slate-800/95 rounded-[2.5rem] p-8 md:p-10 min-h-[400px] relative shadow-2xl border border-slate-200 dark:border-white/5">
                                {message.text && (
                                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
                                        {message.type === 'success' ? (
                                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        )}
                                        <span className="text-sm font-bold tracking-tight">{message.text}</span>
                                    </div>
                                )}

                                {!editMode && !passwordMode && (
                                    <div className="space-y-10 animate-in fade-in duration-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-black tracking-tight underline decoration-blue-600 decoration-4 underline-offset-8 text-slate-800 dark:text-white">Informasi Dasar</h3>
                                            <button onClick={() => setEditMode(true)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</p>
                                                <p className="text-lg font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 truncate block w-full" title={user.nama}>{user.nama}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Email</p>
                                                <p className="text-md font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 break-all leading-tight flex items-center">{user.email}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ID Sistem</p>
                                                <p className="text-lg font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">ADMIN_{user.id || '00'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Level Akses</p>
                                                <br />
                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                                    Full System {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editMode && (
                                    <form onSubmit={handleEditProfil} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            {/* Photo Upload Area */}
                                            <div className="w-full md:w-auto flex flex-col items-center gap-4">
                                                <div className="w-32 md:w-48 aspect-square rounded-[2.5rem] overflow-hidden border-4 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center relative group hover:border-blue-400 transition-colors shadow-inner">
                                                    {previewFoto ? (
                                                        <img src={previewFoto} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <div className="text-center">
                                                            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors pointer-events-none flex items-center justify-center">
                                                        <span className="text-[10px] font-black text-white/0 group-hover:text-white transition-all uppercase tracking-widest shadow-black drop-shadow-md">Ganti Foto</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 w-full space-y-5">
                                                <h3 className="text-xl font-black tracking-tight mb-2 dark:text-white">Ubah Identitas</h3>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                                                    <input
                                                        type="text"
                                                        value={nama}
                                                        onChange={(e) => setNama(e.target.value)}
                                                        placeholder="Nama Lengkap"
                                                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 p-4 rounded-3xl font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Aktif</label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="email@sekolah.sch.id"
                                                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 p-4 rounded-3xl font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-white/5 mt-8">
                                            <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all outline-none">Simpan</button>
                                            <button type="button" onClick={() => { setEditMode(false); setPreviewFoto(user.foto); }} className="px-6 sm:px-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-4 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all outline-none">Batal</button>
                                        </div>
                                    </form>
                                )}

                                {passwordMode && (
                                    <form onSubmit={handleGantiPassword} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                        <h3 className="text-xl font-black tracking-tight mb-2 dark:text-white">Proteksi Akun</h3>
                                        <p className="text-xs text-slate-400 font-bold mb-6">Pastikan gunakan kombinasi yang sulit ditebak demi keamanan admin.</p>

                                        <div className="space-y-5">
                                            <div className="space-y-2 relative">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kata Sandi Baru</label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={passwordBaru}
                                                    onChange={(e) => setPasswordBaru(e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 p-4 rounded-3xl font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none pr-14"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 bottom-4 p-1 text-slate-400 hover:text-blue-500 transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ulangi Kata Sandi</label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 p-4 rounded-3xl font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-white/5 mt-8">
                                            <button type="submit" className="flex-1 bg-amber-600 text-white p-4 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/20 hover:bg-amber-700 active:scale-95 transition-all outline-none">Update</button>
                                            <button type="button" onClick={() => setPasswordMode(false)} className="px-6 md:px-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-4 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all outline-none">Batal</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
