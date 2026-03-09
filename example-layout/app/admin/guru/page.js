"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminGuruPage() {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nis_nip: "",
  });

  const fetchGuru = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guru");
      const data = await res.json();
      setGuru(data.guru || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const handleNamaChange = (e) => setForm({ ...form, nama: e.target.value });
  const handleEmailChange = (e) => setForm({ ...form, email: e.target.value.toLowerCase() });
  const handleNIPChange = (e) => setForm({ ...form, nis_nip: e.target.value.replace(/[^0-9]/g, "") });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/admin/guru/${editId}` : "/api/admin/guru";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ nama: "", email: "", nis_nip: "" });
        setEditId(null);
        fetchGuru();
      } else {
        const err = await res.json();
        alert(err.message || "Email sudah terdaftar atau terjadi kesalahan");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data guru ini?")) return;
    try {
      const res = await fetch(`/api/admin/guru/${id}`, { method: "DELETE" });
      if (res.ok) fetchGuru();
    } catch (err) {
      alert("Gagal menghapus data");
    }
  };

  const handleEdit = (g) => {
    setEditId(g.id);
    setForm({
      nama: g.nama,
      email: g.email,
      nis_nip: g.nis_nip,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGuru = guru.filter(
    (g) =>
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.nis_nip.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
            Manajemen <span className="text-blue-600">Guru</span>
          </h1>
          <p className="text-slate-500 font-medium">Pengelolaan data induk tenaga pendidik sekolah.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <input
            type="text"
            placeholder="Cari guru..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-all shadow-sm focus:shadow-blue-500/10 placeholder:text-slate-400"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-bold">{editId ? "Update Data Guru" : "Registrasi Guru Baru"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap Guru</p>
              <input
                type="text"
                placeholder="Input nama lengkap"
                required
                value={form.nama}
                onChange={handleNamaChange}
                className="w-full bg-white border border-slate-200 p-5 rounded-3xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Alamat Email</p>
              <input
                type="email"
                placeholder="rahel@sekolah.com"
                required
                value={form.email}
                onChange={handleEmailChange}
                className="w-full bg-white border border-slate-200 p-5 rounded-3xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nomor Induk Pegawai (NIP)</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Hanya angka"
                  required
                  value={form.nis_nip}
                  onChange={handleNIPChange}
                  className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-inner min-w-0"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
                >
                  {editId ? 'Update Data' : 'Simpan Data'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>

            <div className="pt-8">
              {editId && (
                <button
                  type="button"
                  onClick={() => { setEditId(null); setForm({ nama: "", email: "", nis_nip: "" }); }}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  Batalkan Pengeditan
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/10 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-6">No.</th>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">NIP / Kode</th>
                <th className="px-8 py-6">Mata Pelajaran</th>
                <th className="px-8 py-6 text-right">Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mr-3 inline-block align-middle"></div>
                    <span className="text-sm font-bold opacity-40">Menyelaraskan Data...</span>
                  </td>
                </tr>
              ) : filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic font-medium">Data tidak ditemukan dalam arsip.</td>
                </tr>
              ) : (
                filteredGuru.map((g, index) => (
                  <tr key={g.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-8 py-6 text-sm font-black text-slate-300 dark:text-slate-700">{index + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{g.nama}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-tight truncate max-w-[200px]">{g.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                        {g.nis_nip}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5">
                        {g.daftar_mapel ? g.daftar_mapel.split(', ').map((m, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">
                            {m}
                          </span>
                        )) : (
                          <span className="text-[10px] italic text-slate-400">Tanpa Tugas</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <Link
                          href={`/admin/guru/mapel?search=${g.nama}`}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 shadow-sm active:scale-90"
                          title="Atur Mapel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </Link>
                        <button
                          onClick={() => handleEdit(g)}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500 shadow-sm active:scale-90"
                          title="Edit Biodata"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-500 shadow-sm active:scale-90"
                          title="Hapus Guru"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
