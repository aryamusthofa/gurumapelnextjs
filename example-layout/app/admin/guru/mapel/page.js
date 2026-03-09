"use client";

import { useEffect, useState } from "react";

export default function GuruMapelPage() {
    const [guru, setGuru] = useState([]);
    const [mapel, setMapel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [savingId, setSavingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [guruRes, mapelRes] = await Promise.all([
                fetch("/api/admin/guru"),
                fetch("/api/admin/mapel")
            ]);
            const guruData = await guruRes.json();
            const mapelData = await mapelRes.json();
            setGuru(guruData.guru || []);
            setMapel(mapelData.mapel || []);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleMapel = async (targetGuru, mId) => {
        setSavingId(targetGuru.id + "-" + mId);

        // Optimistic Update
        const currentIds = targetGuru.mapel_ids || [];
        const nextIds = currentIds.includes(mId)
            ? currentIds.filter(id => id !== mId)
            : [...currentIds, mId];

        try {
            const res = await fetch(`/api/admin/guru/${targetGuru.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: targetGuru.nama,
                    email: targetGuru.email,
                    nis_nip: targetGuru.nis_nip,
                    mapel_ids: nextIds
                })
            });

            if (res.ok) {
                setGuru(prev => prev.map(g =>
                    g.id === targetGuru.id ? { ...g, mapel_ids: nextIds } : g
                ));
            } else {
                const err = await res.json();
                alert(err.message || "Gagal memperbarui");
            }
        } catch (err) {
            alert("Terjadi kesalahan koneksi");
        } finally {
            setSavingId(null);
        }
    };

    const filteredGuru = guru.filter(g =>
        g.nama.toLowerCase().includes(search.toLowerCase()) ||
        g.nis_nip.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
                        Penugasan <span className="text-blue-600">Mapel</span>
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed">Kelola distribusi mata pelajaran ke setiap guru secara instan melalui sistem seleksi inline.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Cari guru atau NIP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-all shadow-sm focus:shadow-blue-500/10 placeholder:text-slate-400"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Tenaga Pengajar", value: guru.length, desc: "Guru Terdaftar", color: "blue" },
                    { label: "Mata Pelajaran", value: mapel.length, desc: "Kurikulum Aktif", color: "indigo" },
                    { label: "Sistem Assign", value: "Aktif", desc: "Sistem Terautomasi", color: "green" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-blue-500 transition-all cursor-default">
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                                <span className="text-xs font-bold text-slate-400">{stat.desc}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/10 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-8 py-6">Identity</th>
                                <th className="px-8 py-6">NIP / Code</th>
                                <th className="px-8 py-6">Direct Mapel Selection (Pilih Langsung)</th>
                                <th className="px-8 py-6 text-center">AutoSync</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mr-3 inline-block align-middle"></div>
                                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Sinking Archives...</span>
                                    </td>
                                </tr>
                            ) : filteredGuru.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic font-medium">No results found in staff database.</td>
                                </tr>
                            ) : (
                                filteredGuru.map((g) => (
                                    <tr key={g.id} className="group hover:bg-white transition-colors dark:hover:bg-slate-800/40">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{g.nama}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{g.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-500">
                                                {g.nis_nip}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                                {mapel.map((m) => {
                                                    const isSelected = (g.mapel_ids || []).includes(m.id);
                                                    const isUpdating = savingId === (g.id + "-" + m.id);
                                                    return (
                                                        <label key={m.id} className={`flex items-center gap-3 cursor-pointer group/item transition-all ${isSelected ? 'opacity-100 scale-100' : 'opacity-30 hover:opacity-100 hover:scale-105'}`}>
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => handleToggleMapel(g, m.id)}
                                                                    className="w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-600 appearance-none bg-white dark:bg-slate-900 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                                                                    disabled={isUpdating}
                                                                />
                                                                {isSelected && !isUpdating && (
                                                                    <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                                                )}
                                                                {isUpdating && (
                                                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin absolute pointer-events-none"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col -space-y-0.5">
                                                                <span className={`text-sm font-black ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 focus-within:text-blue-500'}`}>{m.nama_mapel}</span>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{m.kode_mapel}</span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            {savingId && savingId.startsWith(g.id + "-") ? (
                                                <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-green-500 mx-auto shadow-[0_0_10px_#22c55e]"></div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
