"use client";

import { useEffect, useState, useMemo } from "react";
import { useNotif } from "@/app/components/Notif";
import MapelModal from "./components/MapelModal";
import DeleteModal from "@/app/components/DeleteModal";

export default function MataPelajaranPage() {
  const [mapel, setMapel] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const notif = useNotif();

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMapel = async () => {
    try {
      const res = await fetch("/api/admin/mapel", { credentials: "include" });
      if (!res.ok) throw new Error("Gagal mengambil data mapel");
      const data = await res.json();
      setMapel(data.mapel);
    } catch (err) {
      notif.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMapel(); }, []);

  const filteredMapel = useMemo(() => {
    const keyword = search.toLowerCase();
    return mapel.filter(
      (m) => m.nama_mapel.toLowerCase().includes(keyword) || m.kode_mapel.toLowerCase().includes(keyword)
    );
  }, [search, mapel]);

  const handleAdd = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (m) => { setEditData(m); setModalOpen(true); };
  const handleDeleteClick = (m) => { setDeleteTarget(m); setDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/mapel/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      notif.success("Mata pelajaran berhasil dihapus!");
      fetchMapel();
    } catch (err) { notif.error(err.message); }
  };

  const handleModalSuccess = (message) => { notif.success(message); fetchMapel(); };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Curriculum Assets</p>
          <h1 className="text-4xl font-black tracking-tighter">Mata <span className="text-blue-600">Pelajaran</span></h1>
          <p className="text-slate-500 font-bold">Kelola katalog mata pelajaran yang diajarkan di institusi.</p>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-2 min-w-[300px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1">Cari Mapel</p>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nama atau kode mapel..." className="w-full glass-effect pl-14 pr-6 py-4 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none premium-shadow" />
            </div>
          </div>

          <button onClick={handleAdd} className="h-[56px] px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-2 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            TAMBAH
          </button>
        </div>
      </div>

      <div className="glass-effect rounded-[3rem] premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th className="w-16 text-center">NO</th>
                <th className="w-28 text-center">KODE</th>
                <th>NAMA MATA PELAJARAN</th>
                <th className="w-28 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Subjects...</td></tr>
              ) : filteredMapel.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold">Data kosong</td></tr>
              ) : (
                filteredMapel.map((m, i) => (
                  <tr key={m.id} className="group">
                    <td className="text-center"><span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-[10px] font-black">{i + 1}</span></td>
                    <td className="text-center font-black text-[10px] text-blue-600 bg-blue-50/50 dark:bg-blue-900/10">{m.kode_mapel}</td>
                    <td className="font-bold uppercase group-hover:text-blue-600 transition-colors italic">{m.nama_mapel}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(m)} className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteClick(m)} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Hapus">
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

      <MapelModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} editData={editData} />
      <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemName={deleteTarget?.nama_mapel} />
    </div>
  );
}
