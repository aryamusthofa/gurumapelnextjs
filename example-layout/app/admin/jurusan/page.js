"use client";

import { useEffect, useState } from "react";

export default function JurusanPage() {
  const [jurusan, setJurusan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [namaJurusan, setNamaJurusan] = useState("");
  const [kode_jurusan, setkode_jurusan] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchJurusan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jurusan");
      if (!res.ok) throw new Error("Gagal mengambil data jurusan");
      const data = await res.json();
      setJurusan(data.jurusan);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJurusan();
  }, []);

  const filteredJurusan = jurusan.filter((j) => {
    const keyword = search.toLowerCase();
    return (
      j.nama_jurusan.toLowerCase().includes(keyword) ||
      (j.kode_jurusan || "").toLowerCase().includes(keyword)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!namaJurusan || !kode_jurusan) {
      setError("Nama jurusan dan kode jurusan wajib diisi");
      return;
    }

    try {
      let res, data;

      if (editId) {
        res = await fetch(`/api/admin/jurusan/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_jurusan: namaJurusan,
            kode_jurusan,
          }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal update jurusan");
        setSuccess("Jurusan berhasil diperbarui");
        setEditId(null);
      } else {
        res = await fetch("/api/admin/jurusan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_jurusan: namaJurusan,
            kode_jurusan,
          }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal tambah jurusan");
        setSuccess("Jurusan berhasil ditambahkan");
      }

      setNamaJurusan("");
      setkode_jurusan("");
      fetchJurusan();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (j) => {
    setNamaJurusan(j.nama_jurusan);
    setkode_jurusan(j.kode_jurusan || "");
    setEditId(j.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah yakin ingin menghapus jurusan ini?")) return;

    try {
      const res = await fetch(`/api/admin/jurusan/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus jurusan");
      setSuccess("Jurusan berhasil dihapus");
      fetchJurusan();
    } catch (err) {
      setError(err.message);
    }
  };

  return (

    <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Manajemen Jurusan</h1>
          <p className="text-sm font-bold text-slate-500">Kelola daftar program keahlian dan kompetensi siswa.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Cari jurusan atau kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-6 py-3.5 bg-white/90 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INFO CARD */}
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Program Studi</h3>
              <p className="text-blue-100 text-sm font-bold leading-relaxed">Kelompokkan siswa berdasarkan kompetensi keahlian yang relevan dengan kurikulum.</p>
            </div>
            <div className="pt-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Total Aktif</div>
              <div className="text-3xl font-black tracking-tighter">{jurusan.length} Jurusan</div>
            </div>
          </div>
        </div>

        {/* FORM JURUSAN */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            {editId ? "Update Jurusan" : "Tambah Jurusan Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap Jurusan</label>
              <input
                type="text"
                placeholder="Contoh: Rekayasa Perangkat Lunak"
                value={namaJurusan}
                onChange={(e) => setNamaJurusan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kode Singkat (Alias)</label>
              <input
                type="text"
                placeholder="Contoh: RPL"
                value={kode_jurusan}
                onChange={(e) => setkode_jurusan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-3xl font-black text-sm shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              {editId ? "Update Data" : "Simpan Jurusan"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setNamaJurusan(""); setkode_jurusan(""); }} className="px-8 bg-slate-100 text-slate-600 p-5 rounded-3xl font-black text-sm hover:bg-slate-200 transition-all">Batal</button>
            )}
          </div>
          {error && <p className="mt-4 text-red-500 text-xs font-black bg-red-50 p-4 rounded-xl border border-red-100 italic">⚠️ {error}</p>}
          {success && <p className="mt-4 text-green-600 text-xs font-black bg-green-50 p-4 rounded-xl border border-green-100 italic">✅ {success}</p>}
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-1000">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-slate-800">Daftar Jurusan Aktif</h3>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Total: {filteredJurusan.length} Data</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nama Jurusan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Kode</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-black text-slate-400 animate-pulse">Menghubungkan Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredJurusan.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-2.586 2.586a2 2 0 01-2.828 0L12 14l-2.586 2.586a2 2 0 01-2.828 0L4 13" /></svg>
                      <p className="text-lg font-black tracking-tight">Tidak ada jurusan ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJurusan.map((j, idx) => (
                  <tr key={j.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-400 text-xs text-center">{idx + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 tracking-tight">{j.nama_jurusan}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {j.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black tracking-widest">{j.kode_jurusan || "-"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(j)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(j.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
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
