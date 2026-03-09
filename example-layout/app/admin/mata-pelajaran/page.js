"use client";

import { useEffect, useState } from "react";

export default function MataPelajaranPage() {
  const [mapel, setMapel] = useState([]);
  const [filteredMapel, setFilteredMapel] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    nama_mapel: "",
    kode_mapel: "",
  });

  const fetchMapel = async () => {
    try {
      const res = await fetch("/api/admin/mapel", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal mengambil data mapel");

      const data = await res.json();
      setMapel(data.mapel);
      setFilteredMapel(data.mapel);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const result = mapel.filter(
      (m) =>
        m.nama_mapel.toLowerCase().includes(keyword) ||
        m.kode_mapel.toLowerCase().includes(keyword)
    );

    setFilteredMapel(result);
  }, [search, mapel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nama_mapel || !form.kode_mapel) {
      setError("Nama mapel dan kode mapel wajib diisi");
      return;
    }

    const url = form.id
      ? `/api/admin/mapel/${form.id}`
      : "/api/admin/mapel";

    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_mapel: form.nama_mapel,
          kode_mapel: form.kode_mapel,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      resetForm();
      fetchMapel();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus mata pelajaran ini?")) return;

    try {
      const res = await fetch(`/api/admin/mapel/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      fetchMapel();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nama_mapel: "",
      kode_mapel: "",
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Mata Pelajaran</h1>
          <p className="text-sm font-bold text-slate-500">Kelola kurikulum dan daftar mata pelajaran yang diajarkan.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Cari mapel atau kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-6 py-3.5 bg-white/90 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INFO CARD */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Kurikulum Sekolah</h3>
              <p className="text-indigo-100 text-sm font-bold leading-relaxed">Pastikan setiap mata pelajaran memiliki kode unik untuk mempermudah identifikasi dalam jadwal & laporan.</p>
            </div>
            <div className="pt-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Total Aktif</div>
              <div className="text-3xl font-black tracking-tighter">{mapel.length} Mata Pelajaran</div>
            </div>
          </div>
        </div>

        {/* FORM MAPEL */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            {form.id ? "Update Mata Pelajaran" : "Tambah Mapel Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Mata Pelajaran</label>
              <input
                type="text"
                placeholder="Contoh: Matematika Wajib"
                value={form.nama_mapel}
                onChange={(e) => setForm({ ...form, nama_mapel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kode Mapel (Alias)</label>
              <input
                type="text"
                placeholder="Contoh: MTK-W"
                value={form.kode_mapel}
                onChange={(e) => setForm({ ...form, kode_mapel: e.target.value.toUpperCase() })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none shadow-inner uppercase"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-3xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              {form.id ? "Update Data" : "Simpan Mata Pelajaran"}
            </button>
            {form.id && (
              <button type="button" onClick={resetForm} className="px-8 bg-slate-100 text-slate-600 p-5 rounded-3xl font-black text-sm hover:bg-slate-200 transition-all">Batal</button>
            )}
          </div>
          {error && <p className="mt-4 text-red-500 text-xs font-black bg-red-50 p-4 rounded-xl border border-red-100 italic">⚠️ {error}</p>}
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-1000">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-slate-800">Daftar Mata Pelajaran Aktif</h3>
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Total: {filteredMapel.length} Data</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Kode</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nama Mata Pelajaran</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMapel.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <p className="text-lg font-black tracking-tight">Tidak ada mata pelajaran ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMapel.map((m, i) => (
                  <tr key={m.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-400 text-xs text-center">{i + 1}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black tracking-widest font-mono uppercase">{m.kode_mapel}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 tracking-tight">{m.nama_mapel}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Reference ID: {m.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setForm({ id: m.id, nama_mapel: m.nama_mapel, kode_mapel: m.kode_mapel })} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
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
