"use client";

import { useEffect, useState } from "react";
import { useNotif } from "@/app/components/Notif";

export default function KelasModal({ isOpen, onClose, onSuccess, editData }) {
    const [form, setForm] = useState({ nama_kelas: "", jurusan_id: "", tingkat_id: "", wali_kelas_id: "" });
    const [jurusan, setJurusan] = useState([]);
    const [tingkat, setTingkat] = useState([]);
    const [guru, setGuru] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const notif = useNotif();
    const isEdit = !!editData;

    // Fetch dropdown options
    useEffect(() => {
        if (isOpen) {
            fetch("/api/admin/jurusan").then(r => r.json()).then(d => setJurusan(d.jurusan || [])).catch(() => { });
            fetch("/api/admin/tingkat").then(r => r.json()).then(d => setTingkat(d.tingkat || [])).catch(() => { });
            fetch("/api/admin/guru").then(r => r.json()).then(d => setGuru(d.guru || [])).catch(() => { });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && editData) {
            setForm({
                nama_kelas: editData.nama_kelas || "",
                jurusan_id: editData.jurusan_id || "",
                tingkat_id: editData.tingkat_id || "",
                wali_kelas_id: editData.wali_kelas_id || "",
            });
        } else if (isOpen) {
            setForm({ nama_kelas: "", jurusan_id: "", tingkat_id: "", wali_kelas_id: "" });
        }
    }, [isOpen, editData]);

    useEffect(() => {
        if (isOpen) { setClosing(false); requestAnimationFrame(() => { requestAnimationFrame(() => setVisible(true)); }); }
        else { setVisible(false); }
    }, [isOpen]);

    const handleClose = () => { setClosing(true); setVisible(false); setTimeout(() => { setClosing(false); onClose(); }, 300); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nama_kelas || !form.jurusan_id || !form.tingkat_id) {
            notif.warning("Nama kelas, jurusan, dan tingkat wajib diisi");
            return;
        }
        setSubmitting(true);
        try {
            const url = isEdit ? `/api/admin/kelas/${editData.id}` : "/api/admin/kelas";
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal memproses data");
            handleClose();
            onSuccess(isEdit ? "Data kelas berhasil diperbarui!" : "Kelas baru berhasil ditambahkan!");
        } catch (err) { notif.warning(err.message); } finally { setSubmitting(false); }
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
                        <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">{isEdit ? "Edit Kelas" : "Tambah Kelas"}</h2>
                    </div>
                    <p className="text-sm text-slate-400 font-bold ml-[52px]">{isEdit ? "Perbarui informasi kelas." : "Buat kelas baru di sistem."}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Kelas</label>
                        <input type="text" value={form.nama_kelas} onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. X RPL 1" autoFocus />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Jurusan</label>
                            <select value={form.jurusan_id} onChange={(e) => setForm({ ...form, jurusan_id: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="">Pilih Jurusan</option>
                                {jurusan.map((j) => <option key={j.id} value={j.id}>{j.nama_jurusan}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tingkat</label>
                            <select value={form.tingkat_id} onChange={(e) => setForm({ ...form, tingkat_id: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="">Pilih Tingkat</option>
                                {tingkat.map((t) => <option key={t.id} value={t.id}>{t.nama_tingkat}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Wali Kelas <span className="text-slate-300">(Opsional)</span></label>
                        <select value={form.wali_kelas_id} onChange={(e) => setForm({ ...form, wali_kelas_id: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                            <option value="">- Tidak ada wali kelas -</option>
                            {guru.map((g) => <option key={g.id} value={g.id}>{g.nama}</option>)}
                        </select>
                        <p className="text-[8px] text-slate-400 font-medium italic ml-4 mt-1">
                            * Guru yang sudah menjadi wali kelas di kelas lain tidak dapat dipilih kembali.
                        </p>
                    </div>


                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={handleClose} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-500 hover:text-red-500 transition-all shadow-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            Batal
                        </button>
                        <button type="submit" disabled={submitting} className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 ${isEdit ? 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-500/20' : 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/20'}`}>
                            {submitting ? "Memproses..." : isEdit ? "Simpan Data" : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
