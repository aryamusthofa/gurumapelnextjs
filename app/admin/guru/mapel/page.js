"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useNotif } from "@/app/components/Notif";

export default function GuruMapelPage() {
  const searchParams = useSearchParams();
  const guruIdFromUrl = searchParams.get("guru_id");
  const notif = useNotif();

  const [guruList, setGuruList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [selectedGuru, setSelectedGuru] = useState("");
  const [selectedMapel, setSelectedMapel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guruIdFromUrl) setSelectedGuru(guruIdFromUrl);
  }, [guruIdFromUrl]);

  useEffect(() => {
    fetch("/api/admin/guru").then((res) => res.json()).then((data) => setGuruList(data.guru || []));
  }, []);

  useEffect(() => {
    fetch("/api/admin/mapel").then((res) => res.json()).then((data) => setMapelList(data.mapel || []));
  }, []);

  useEffect(() => {
    if (!selectedGuru) return;
    fetch(`/api/admin/guru/mapel?guru_id=${selectedGuru}`)
      .then((res) => res.json())
      .then((data) => {
        const ids = data.mapel.map((m) => m.id);
        setSelectedMapel(ids);
      });
  }, [selectedGuru]);

  const handleCheckbox = (mapelId) => {
    setSelectedMapel((prev) =>
      prev.includes(mapelId) ? prev.filter((id) => id !== mapelId) : [...prev, mapelId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedGuru) { notif.error("Pilih guru terlebih dahulu"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guru/mapel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guru_id: selectedGuru, mapel_ids: selectedMapel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan");
      notif.success(data.message || "Mapel guru berhasil disimpan!");
    } catch (err) {
      notif.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentGuru = guruList.find((g) => g.id == selectedGuru);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Subject Assignment</p>
        <h1 className="text-4xl font-black tracking-tighter">
          Atur <span className="text-blue-600">Mapel Guru</span>
          {currentGuru && <span className="text-slate-400 text-2xl font-bold ml-3">— {currentGuru.nama}</span>}
        </h1>
        <p className="text-slate-500 font-bold">Tentukan mata pelajaran yang diampu oleh guru.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* GURU SELECT */}
        <div className="lg:col-span-1">
          <div className="glass-effect p-8 rounded-[2.5rem] premium-shadow sticky top-32 space-y-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Pilih Guru
            </h2>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Guru</label>
              <select
                value={selectedGuru}
                onChange={(e) => setSelectedGuru(e.target.value)}
                disabled={!!guruIdFromUrl}
                className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none ${guruIdFromUrl ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <option value="">-- Pilih Guru --</option>
                {guruList.map((g) => (
                  <option key={g.id} value={g.id}>{g.nama} ({g.nis_nip})</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedGuru}
              className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </div>

        {/* MAPEL CHECKLIST */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-[3rem] premium-shadow overflow-hidden">
            {!selectedGuru ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <p className="text-slate-400 font-bold text-sm">Pilih guru terlebih dahulu untuk melihat daftar mapel</p>
              </div>
            ) : (
              <div className="p-8">
                <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                  Mapel yang Diampu
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full ml-auto">{selectedMapel.length} dipilih</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mapelList.map((m) => {
                    const checked = selectedMapel.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${checked ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 hover:border-blue-200'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
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
                        <div className="flex flex-col">
                          <span className="font-black text-sm uppercase italic">{m.nama_mapel}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.kode_mapel}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
