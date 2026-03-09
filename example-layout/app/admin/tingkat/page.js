"use client";

import { useEffect, useState } from "react";

export default function TingkatPage() {
  const [tingkat, setTingkat] = useState([]);
  const [filteredTingkat, setFilteredTingkat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");


  const [form, setForm] = useState({
    id: null,
    nama_tingkat: "",
    angka_tingkat: "",
  });

  const fetchTingkat = async () => {
    try {
      const res = await fetch("/api/admin/tingkat", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal mengambil data");

      const data = await res.json();
      setTingkat(data.tingkat || []);
      setFilteredTingkat(data.tingkat || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTingkat();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const result = tingkat.filter(
      (t) =>
        t.nama_tingkat.toLowerCase().includes(q) ||
        String(t.angka_tingkat).includes(q)
    );
    setFilteredTingkat(result);
  }, [search, tingkat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nama_tingkat || !form.angka_tingkat) {
      setError("Nama tingkat dan angka tingkat wajib diisi");
      return;
    }

    if (isNaN(form.angka_tingkat)) {
      setError("Angka tingkat harus berupa angka");
      return;
    }

    const url = form.id
      ? `/api/admin/tingkat/${form.id}`
      : "/api/admin/tingkat";

    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_tingkat: form.nama_tingkat,
          angka_tingkat: Number(form.angka_tingkat),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menyimpan data");
      }

      resetForm();
      fetchTingkat();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus tingkat ini?")) return;

    try {
      const res = await fetch(`/api/admin/tingkat/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      fetchTingkat();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nama_tingkat: "",
      angka_tingkat: "",
    });
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Manajemen Tingkat</h1>
          <p className="text-sm font-bold text-slate-500">Pengaturan jenjang kelas (X, XI, XII atau lainnya).</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Cari tingkat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-6 py-3.5 bg-white/90 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INFO CARD */}
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between order-2 lg:order-1">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h3 className="text-xl font-black tracking-tight mb-2">Statistik Jenjang</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">Kelola tingkatan pendidikan untuk klasifikasi rombongan belajar yang tepat.</p>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/5">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Terdaftar</p>
                <p className="text-4xl font-black text-white tracking-tighter">{tingkat.length} <span className="text-xs text-slate-500 font-bold uppercase">Tingkat</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM TINGKAT */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group order-1 lg:order-2">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            {form.id ? "Update Tingkat" : "Tambah Tingkat Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Tingkat (Huruf)</label>
              <input
                type="text"
                placeholder="Contoh: Sepuluh"
                value={form.nama_tingkat}
                onChange={(e) => setForm({ ...form, nama_tingkat: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Angka Tingkat (Numeric)</label>
              <input
                type="number"
                placeholder="Contoh: 10"
                value={form.angka_tingkat}
                onChange={(e) => setForm({ ...form, angka_tingkat: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-3xl font-black text-sm shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              {form.id ? "Simpan Perubahan" : "Simpan Tingkat"}
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
          <h3 className="text-xl font-black tracking-tight text-slate-800">Daftar Jenjang Pendidikan</h3>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Total: {filteredTingkat.length} Data</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nama Tingkat</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Angka</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTingkat.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      <p className="text-lg font-black tracking-tight">Data tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTingkat.map((t, i) => (
                  <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-400 text-xs text-center">{i + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 tracking-tight lowercase first-letter:uppercase">{t.nama_tingkat}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Level ID: {t.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black tracking-widest">{t.angka_tingkat}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setForm({ id: t.id, nama_tingkat: t.nama_tingkat, angka_tingkat: t.angka_tingkat })} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
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
