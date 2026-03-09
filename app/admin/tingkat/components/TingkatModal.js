"use client";

import { useEffect, useState } from "react";

export default function TingkatModal({ isOpen, onClose, onSuccess, editData }) {
    const [form, setForm] = useState({ nama_tingkat: "", angka_tingkat: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    const isEdit = !!editData;

    useEffect(() => {
        if (isOpen && editData) {
            setForm({ nama_tingkat: editData.nama_tingkat || "", angka_tingkat: editData.angka_tingkat || "" });
        } else if (isOpen) {
            setForm({ nama_tingkat: "", angka_tingkat: "" });
        }
        setError("");
    }, [isOpen, editData]);

    useEffect(() => {
        if (isOpen) { setClosing(false); requestAnimationFrame(() => { requestAnimationFrame(() => setVisible(true)); }); }
        else { setVisible(false); }
    }, [isOpen]);

    const handleClose = () => { setClosing(true); setVisible(false); setTimeout(() => { setClosing(false); onClose(); }, 300); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError("");
        if (!form.nama_tingkat || !form.angka_tingkat) { setError("Nama tingkat dan angka tingkat wajib diisi"); return; }
        setSubmitting(true);
        try {
            const url = isEdit ? `/api/admin/tingkat/${editData.id}` : "/api/admin/tingkat";
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama_tingkat: form.nama_tingkat, angka_tingkat: Number(form.angka_tingkat) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal memproses data");
            handleClose();
            onSuccess(isEdit ? "Data tingkat berhasil diperbarui!" : "Tingkat baru berhasil ditambahkan!");
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    };

    if (!isOpen && !closing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}></div>
            <div className={`relative w-full max-w-lg bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-8 transition-all duration-300 ease-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                <button onClick={handleClose} className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm transition-all border border-slate-100 dark:border-white/5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isEdit ? 'bg-green-100 dark:bg-green-500/10 text-green-600' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600'}`}>
                            {isEdit ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            )}
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">{isEdit ? "Edit Tingkat" : "Tambah Tingkat"}</h2>
                    </div>
                    <p className="text-sm text-slate-400 font-bold ml-[52px]">{isEdit ? "Perbarui data jenjang pendidikan." : "Daftarkan jenjang pendidikan baru."}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Jenjang</label>
                        <input type="text" value={form.nama_tingkat} onChange={(e) => setForm({ ...form, nama_tingkat: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. Sepuluh" autoFocus />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Angka Numerik</label>
                        <input type="number" value={form.angka_tingkat} onChange={(e) => setForm({ ...form, angka_tingkat: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. 10" />
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-sm font-bold flex items-center gap-3">
                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={submitting} className={`flex-1 py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-60 ${isEdit ? 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-500/20' : 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/20'}`}>
                            {submitting ? "Memproses..." : isEdit ? "UPDATE" : "SIMPAN"}
                        </button>
                        <button type="button" onClick={handleClose} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-slate-500 hover:text-red-500 transition-all">BATAL</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
