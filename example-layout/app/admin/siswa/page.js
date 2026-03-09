"use client";

import { useEffect, useState } from "react";

export default function AdminSiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [jurusan, setJurusan] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [filterJurusan, setFilterJurusan] = useState("");
  const [filterKelas, setFilterKelas] = useState("");

  const [form, setForm] = useState({
    nama: "",
    email: "",
    nis: "",
    angkatan: "",
    kelas_id: "",
  });

  const fetchSiswa = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/siswa");
      const data = await res.json();
      setSiswa(data.siswa || []);
    } catch (error) {
      console.error("Error fetching siswa:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetch("/api/admin/kelas");
      const data = await res.json();
      setKelas(data.kelas || []);
    } catch (error) {
      console.error("Error fetching kelas:", error);
    }
  };

  const fetchJurusan = async () => {
    try {
      const res = await fetch("/api/admin/jurusan");
      const data = await res.json();
      setJurusan(data.jurusan || []);
    } catch (error) {
      console.error("Error fetching jurusan:", error);
    }
  };

  useEffect(() => {
    fetchSiswa();
    fetchKelas();
    fetchJurusan();
  }, []);

  const resetForm = () => {
    setForm({
      nama: "",
      email: "",
      nis: "",
      angkatan: "",
      kelas_id: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `/api/admin/siswa/${editId}`
      : `/api/admin/siswa`;

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          nis_nip: form.nis,
          angkatan: form.angkatan,
          kelas_id: form.kelas_id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      resetForm();
      fetchSiswa();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({
      nama: s.nama,
      email: s.email,
      nis: s.nis_nip || "",
      angkatan: s.angkatan || "",
      kelas_id: s.kelas_id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus siswa ini?")) return;

    try {
      const res = await fetch(`/api/admin/siswa/${id}`, {
        method: "DELETE",
      });

      if (res.ok) fetchSiswa();
      else alert("Gagal menghapus siswa");
    } catch (error) {
      console.error("Error deleting siswa:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  const kelasByJurusan = filterJurusan
    ? kelas.filter((k) => k.jurusan_id == filterJurusan)
    : kelas;

  const filteredSiswa = siswa.filter((s) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      s.nama.toLowerCase().includes(keyword) ||
      (s.nis_nip && s.nis_nip.toLowerCase().includes(keyword));

    const matchJurusan = filterJurusan
      ? s.jurusan_id == filterJurusan
      : true;

    const matchKelas = filterKelas
      ? s.kelas_id == filterKelas
      : true;

    return matchSearch && matchJurusan && matchKelas;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Manajemen Siswa</h1>
          <p className="text-sm font-bold text-slate-500">Kelola data peserta ujian dan pendaftaran siswa baru.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Cari nama atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-6 py-4 bg-white/90 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* TOP SECTION: FORM & FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM TAMBAH/UPDATE SISWA */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            {editId ? "Update Data Siswa" : "Registrasi Siswa Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Siswa</label>
                <input
                  type="email"
                  placeholder="Email Aktif"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">NIS</label>
                  <input
                    type="text"
                    placeholder="NIS"
                    value={form.nis}
                    onChange={(e) => setForm({ ...form, nis: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Angkatan</label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={form.angkatan}
                    onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kelas</label>
                <select
                  value={form.kelas_id}
                  onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none shadow-inner"
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-3xl font-black text-sm shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              {editId ? "Update Data" : "Simpan Data"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="px-8 bg-slate-100 text-slate-600 p-5 rounded-3xl font-black text-sm hover:bg-slate-200 transition-all">Batal</button>
            )}
          </div>
        </form>

        {/* FILTER DATA */}
        <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            Filter Data
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jurusan</label>
              <select
                value={filterJurusan}
                onChange={(e) => {
                  setFilterJurusan(e.target.value);
                  setFilterKelas("");
                }}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none"
              >
                <option value="">Semua Jurusan</option>
                {jurusan.map((j) => (
                  <option key={j.id} value={j.id}>{j.nama_jurusan}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kelas</label>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none"
              >
                <option value="">Semua Kelas</option>
                {kelasByJurusan.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TABLE */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-1000">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-slate-800">Daftar Induk Siswa</h3>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Total: {filteredSiswa.length} Data</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nama Lengkap</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">NIS</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Angkatan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Kelas / Jurusan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-black text-slate-400 animate-pulse">Menghubungkan Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-2.586 2.586a2 2 0 01-2.828 0L12 14l-2.586 2.586a2 2 0 01-2.828 0L4 13" /></svg>
                      <p className="text-lg font-black tracking-tight">Tidak ada data siswa ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-400 text-xs text-center">{idx + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 tracking-tight">{s.nama}</span>
                        <span className="text-[10px] font-bold text-slate-400">{s.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600 text-sm text-center">{s.nis_nip}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black">{s.angkatan || "-"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{s.nama_kelas || "-"}</span>
                        <span className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">{s.nama_jurusan || "-"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(s)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
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