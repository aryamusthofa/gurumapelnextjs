"use client";

import { useEffect, useState } from "react";
import { useNotif } from "@/app/components/Notif";

export default function MapelGuruModal({ isOpen, onClose, onSuccess, guruData }) {
    const [mapelList, setMapelList] = useState([]);
    const [selectedMapel, setSelectedMapel] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    
    // Modal transition states
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    
    const notif = useNotif();

    useEffect(() => {
        if (isOpen && guruData) {
            setClosing(false);
            requestAnimationFrame(() => { 
                requestAnimationFrame(() => setVisible(true)); 
            });
            fetchData();
        } else {
            setVisible(false);
            setSelectedMapel([]); // reset
        }
    }, [isOpen, guruData]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            // Fetch all mapel
            const resMapel = await fetch("/api/admin/mapel");
            const dataMapel = await resMapel.json();
            setMapelList(dataMapel.mapel || []);

            // Fetch assigned mapel for guru
            const resAssigned = await fetch(`/api/admin/guru/mapel?guru_id=${guruData.id}`);
            const dataAssigned = await resAssigned.json();
            const ids = dataAssigned.mapel?.map((m) => m.id) || [];
            setSelectedMapel(ids);
        } catch (err) {
            notif.error("Gagal mengambil data mapel");
        } finally {
            setLoadingData(false);
        }
    };

    const handleClose = () => {
        setClosing(true); 
        setVisible(false);
        setTimeout(() => { 
            setClosing(false); 
            onClose(); 
        }, 300);
    };

    const handleCheckbox = (mapelId) => {
        setSelectedMapel((prev) =>
            prev.includes(mapelId) 
                ? prev.filter((id) => id !== mapelId) 
                : [...prev, mapelId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/guru/mapel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guru_id: guruData.id, mapel_ids: selectedMapel }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal menyimpan");
            
            handleClose();
            onSuccess(data.message || "Mapel guru berhasil disimpan!");
        } catch (err) { 
            notif.warning(err.message); 
        } finally { 
            setSubmitting(false); 
        }
    };

    if (!isOpen && !closing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`} 
                onClick={handleClose}
            ></div>
            
            {/* Lebar disesuaikan ke max-w-4xl agar grid fit */}
            <div className={`relative w-full max-w-4xl bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-8 flex flex-col max-h-[90vh] transition-all duration-300 ease-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                
                <button onClick={handleClose} className="absolute top-6 right-6 z-10 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm transition-all border border-slate-100 dark:border-white/5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Header */}
                <div className="mb-8 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                            Atur Mapel Guru <span className="text-slate-400 font-bold ml-2">— {guruData?.nama}</span>
                        </h2>
                    </div>
                    <p className="text-sm text-slate-400 font-bold ml-[52px]">Tentukan mata pelajaran yang diampu oleh {guruData?.nama || "guru"}.</p>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
                    {loadingData ? (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black tracking-tight flex items-center gap-3 text-slate-800 dark:text-white uppercase">
                                    <div className="w-1.5 h-4 bg-green-600 rounded-full"></div>
                                    Tandai Mapel yang Diampu
                                </h3>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50">
                                    {selectedMapel.length} dipilih
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {mapelList.length === 0 ? (
                                    <div className="col-span-full py-10 text-center text-slate-400 font-bold">
                                        Data mata pelajaran tidak tersedia.
                                    </div>
                                ) : (
                                    mapelList.map((m) => {
                                        const checked = selectedMapel.includes(m.id);
                                        return (
                                            <label
                                                key={m.id}
                                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                                                    checked 
                                                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 shadow-sm' 
                                                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                                                    checked 
                                                    ? 'bg-blue-600 border-blue-600 shadow-sm shadow-blue-500/30' 
                                                    : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                                                }`}>
                                                    {checked && (
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={checked}
                                                    onChange={() => handleCheckbox(m.id)}
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`font-black text-sm uppercase italic truncate ${checked ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {m.nama_mapel}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${checked ? 'text-blue-400/80' : 'text-slate-400'}`}>
                                                        {m.kode_mapel}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 shrink-0 mt-2 border-t border-slate-100 dark:border-white/5">
                    <button type="button" onClick={handleClose} disabled={submitting} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        Batal
                    </button>
                    <button onClick={handleSubmit} disabled={submitting || loadingData} className="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
                
            </div>
        </div>
    );
}
