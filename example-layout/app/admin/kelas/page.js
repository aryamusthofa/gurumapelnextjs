"use client";

import { useEffect, useState } from "react";

export default function KelasPage() {
  const [kelas, setKelas] = useState([]);
  const [filteredKelas, setFilteredKelas] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [tingkat, setTingkat] = useState([]);
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(""); // State untuk menyimpan pesan error

  const [form, setForm] = useState({
    nama_kelas: "",
    jurusan_id: "",
    tingkat_id: "",
    wali_kelas_id: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchKelas = async () => {
    const res = await fetch("/api/admin/kelas");
    const data = await res.json();
    setKelas(data.kelas || []);
    setFilteredKelas(data.kelas || []);
  };

  const fetchJurusan = async () => {
    const res = await fetch("/api/admin/jurusan");
    const data = await res.json();
    setJurusan(data.jurusan || []);
  };

  const fetchTingkat = async () => {
    const res = await fetch("/api/admin/tingkat");
    const data = await res.json();
    setTingkat(data.tingkat || []);
  };

  const fetchGuru = async () => {
    const res = await fetch("/api/admin/guru");
    const data = await res.json();
    setGuru(data.guru || []);
  };

  useEffect(() => {
    Promise.all([
      fetchKelas(),
      fetchJurusan(),
      fetchTingkat(),
      fetchGuru(),
    ]).finally(() => setLoading(false));
  }, []);

  // MODIFIKASI: Update useEffect untuk mencari di nama_kelas dan nama_jurusan
  useEffect(() => {
    if (!search) {
      setFilteredKelas(kelas);
      return;
    }

    const searchTerm = search.toLowerCase();
    const result = kelas.filter((k) =>
      k.nama_kelas.toLowerCase().includes(searchTerm) ||
      k.nama_jurusan.toLowerCase().includes(searchTerm)
    );
    setFilteredKelas(result);
  }, [search, kelas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    const url = editId
      ? `/api/admin/kelas/${editId}`
      : "/api/admin/kelas";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      // MODIFIKASI: Ambil pesan error dari API
      const errorData = await res.json();
      setError(errorData.message || "Gagal menyimpan data");
      return;
    }

    setForm({
      nama_kelas: "",
      jurusan_id: "",
      tingkat_id: "",
      wali_kelas_id: "",
    });
    setEditId(null);
    fetchKelas();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setError(""); // Reset error state
    setForm({
      nama_kelas: item.nama_kelas,
      jurusan_id: item.jurusan_id,
      tingkat_id: item.tingkat_id,
      wali_kelas_id: item.wali_kelas_id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kelas ini?")) return;
    setError(""); // Reset error state

    const res = await fetch(`/api/admin/kelas/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      // MODIFIKASI: Ambil pesan error dari API
      const errorData = await res.json();
      setError(errorData.message || "Gagal menghapus data");
      return;
    }

    fetchKelas();
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Manajemen Kelas</h1>
          <p className="text-sm font-bold text-slate-500">Organisir rombongan belajar dan wali kelas masing-masing.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Cari kelas atau jurusan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-6 py-3.5 bg-white/90 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM KELAS */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            {editId ? "Update Data Kelas" : "Tambah Kelas Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Kelas</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: X RPL 1"
                  value={form.nama_kelas}
                  onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Bidang Jurusan</label>
                <select
                  required
                  value={form.jurusan_id}
                  onChange={(e) => setForm({ ...form, jurusan_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusan.map((j) => (
                    <option key={j.id} value={j.id}>{j.nama_jurusan}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tingkat Pendidikan</label>
                <select
                  required
                  value={form.tingkat_id}
                  onChange={(e) => setForm({ ...form, tingkat_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                >
                  <option value="">Pilih Tingkat</option>
                  {tingkat.map((t) => (
                    <option key={t.id} value={t.id}>{t.nama_tingkat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Wali Kelas (Opsional)</label>
                <select
                  value={form.wali_kelas_id}
                  onChange={(e) => setForm({ ...form, wali_kelas_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                >
                  <option value="">- Tidak ada wali kelas -</option>
                  {guru.map((g) => (
                    <option key={g.id} value={g.id}>{g.nama}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-3xl font-black text-sm shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              {editId ? "Update Data" : "Simpan Kelas"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setError(""); setForm({ nama_kelas: "", jurusan_id: "", tingkat_id: "", wali_kelas_id: "" }); }} className="px-8 bg-slate-100 text-slate-600 p-5 rounded-3xl font-black text-sm hover:bg-slate-200 transition-all">Batal</button>
            )}
          </div>
          {error && (
            <div className="mt-6 flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 animate-bounce">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <p className="text-xs font-black italic">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600 font-bold">×</button>
            </div>
          )}
        </form>

        {/* INFO CARD */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-black tracking-tight mb-2 uppercase italic">Statistik <span className="text-blue-500 not-italic">Kelas</span></h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">Setiap kelas harus terhubung dengan program studi dan tingkat yang aktif untuk sinkronisasi data siswa.</p>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/5">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Terdaftar</p>
                <p className="text-4xl font-black text-white tracking-tighter">{kelas.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Kapasitas</p>
                <p className="text-xs font-black text-green-500">OPTIMAL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-1000">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black tracking-tight text-slate-800">Daftar Rombongan Belajar</h3>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">AKTIF • {filteredKelas.length} KELAS</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Nama Kelas</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Jurusan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Tingkat</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Wali Kelas</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKelas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      <p className="text-xl font-black tracking-tight">Data kelas tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredKelas.map((item, i) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-400 text-xs text-center">{i + 1}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-slate-900 tracking-tight text-base">{item.nama_kelas}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{item.nama_jurusan}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Kompetensi Keahlian</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{item.nama_tingkat}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                          {item.wali_kelas?.charAt(0) || "-"}
                        </div>
                        <span className="font-bold text-slate-600">{item.wali_kelas || "- tidak ada -"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
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