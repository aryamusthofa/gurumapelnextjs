"use client";

import { useEffect, useState, useMemo } from "react";
import { useNotif } from "@/app/components/Notif";
import SiswaModal from "./components/SiswaModal";
import DeleteModal from "@/app/components/DeleteModal";

export default function AdminSiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const notif = useNotif();

  const [filterJurusan, setFilterJurusan] = useState("");
  const [filterKelas, setFilterKelas] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchSiswa = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/siswa");
      const data = await res.json();
      setSiswa(data.siswa || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetch("/api/admin/kelas");
      const data = await res.json();
      setKelas(data.kelas || []);
    } catch { /* silent */ }
  };

  const fetchJurusan = async () => {
    try {
      const res = await fetch("/api/admin/jurusan");
      const data = await res.json();
      setJurusan(data.jurusan || []);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchSiswa(); fetchKelas(); fetchJurusan(); }, []);

  const handleAdd = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (s) => { setEditData(s); setModalOpen(true); };
  const handleDeleteClick = (s) => { setDeleteTarget(s); setDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/siswa/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) { notif.success("Data siswa berhasil dihapus!"); fetchSiswa(); }
      else { notif.error("Gagal menghapus siswa"); }
    } catch { notif.error("Terjadi kesalahan saat menghapus"); }
  };

  const handleModalSuccess = (message) => { notif.success(message); fetchSiswa(); };

  const kelasByJurusan = useMemo(() =>
    filterJurusan ? kelas.filter((k) => k.jurusan_id == filterJurusan) : kelas,
    [kelas, filterJurusan]
  );

  const filteredSiswa = useMemo(() => {
    const keyword = search.toLowerCase();
    return siswa.filter((s) => {
      const matchSearch = s.nama.toLowerCase().includes(keyword) || (s.nis_nip && s.nis_nip.toLowerCase().includes(keyword));
      const matchJurusan = filterJurusan ? s.jurusan_id == filterJurusan : true;
      const matchKelas = filterKelas ? s.kelas_id == filterKelas : true;
      return matchSearch && matchJurusan && matchKelas;
    });
  }, [siswa, search, filterJurusan, filterKelas]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Student Database</p>
          <h1 className="text-4xl font-black tracking-tighter">Manajemen <span className="text-blue-600">Siswa</span></h1>
          <p className="text-slate-500 font-bold">Kelola data peserta didik, filter berdasarkan kelas dan jurusan.</p>
        </div>

        <div className="flex flex-col gap-2 min-w-[320px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1">Filter & Pencarian</p>
          <div className="flex items-end gap-3">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau NIS..." className="w-full glass-effect pl-14 pr-6 py-4 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none premium-shadow" />
            </div>
            <button onClick={handleAdd} className="h-[56px] px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-2 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              TAMBAH
            </button>
          </div>
          <div className="flex gap-2">
            <select value={filterJurusan} onChange={(e) => { setFilterJurusan(e.target.value); setFilterKelas(""); }} className="flex-1 glass-effect px-4 py-2.5 rounded-2xl font-bold text-xs outline-none border border-transparent focus:border-blue-500 transition-all">
              <option value="">Semua Jurusan</option>
              {jurusan.map((j) => (<option key={j.id} value={j.id}>{j.nama_jurusan}</option>))}
            </select>
            <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="flex-1 glass-effect px-4 py-2.5 rounded-2xl font-bold text-xs outline-none border border-transparent focus:border-blue-500 transition-all">
              <option value="">Semua Kelas</option>
              {kelasByJurusan.map((k) => (<option key={k.id} value={k.id}>{k.nama_kelas}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-effect rounded-[3rem] premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th className="w-16 text-center">NO</th>
                <th>PESERTA DIDIK</th>
                <th className="w-28 text-center">NIS</th>
                <th className="w-32 text-center">KELAS / JURUSAN</th>
                <th className="w-24 text-center">ANGKATAN</th>
                <th className="w-24 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Students...</td></tr>
              ) : filteredSiswa.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold">Data siswa tidak ditemukan</td></tr>
              ) : (
                filteredSiswa.map((s, index) => (
                  <tr key={s.id} className="group">
                    <td className="text-center"><span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-[9px] font-black">{index + 1}</span></td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-[10px] shadow-sm">{s.nama?.charAt(0)}</div>
                        <div className="flex flex-col">
                          <span className="group-hover:text-blue-600 transition-colors uppercase italic text-sm">{s.nama}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center font-black text-[10px] text-slate-600 dark:text-slate-400">{s.nis_nip}</td>
                    <td>
                      <div className="flex flex-col items-center">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-black text-[9px] tracking-wider mb-1 uppercase">{s.nama_kelas || "-"}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[100px]">{s.nama_jurusan || "-"}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-[9px] font-black text-slate-500">{s.angkatan || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(s)} className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteClick(s)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Hapus">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      <SiswaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} editData={editData} />
      <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemName={deleteTarget?.nama} />
    </div>
  );
}
