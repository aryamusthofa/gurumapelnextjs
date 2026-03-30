"use client";

import { useEffect, useState, useMemo } from "react";
import { useNotif } from "@/app/components/Notif";
import GuruModal from "./components/GuruModal";
import MapelGuruModal from "./components/MapelGuruModal";
import DeleteModal from "@/app/components/DeleteModal";

export default function AdminGuruPage() {
  const [guru, setGuru] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const notif = useNotif();

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mapelModalOpen, setMapelModalOpen] = useState(false);
  const [mapelTarget, setMapelTarget] = useState(null);

  const fetchGuru = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guru");
      const data = await res.json();
      setGuru(data.guru || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuru(); }, []);

  const filteredGuru = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return guru;
    return guru.filter(
      (g) => g.nama.toLowerCase().includes(term) || g.email.toLowerCase().includes(term) || g.nis_nip.toLowerCase().includes(term)
    );
  }, [guru, search]);

  const handleAdd = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (g) => { setEditData(g); setModalOpen(true); };
  const handleDeleteClick = (g) => { setDeleteTarget(g); setDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/guru/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) { notif.success("Data guru berhasil dihapus!"); fetchGuru(); }
      else { notif.error("Gagal menghapus guru"); }
    } catch { notif.error("Terjadi kesalahan saat menghapus"); }
  };

  const handleModalSuccess = (message) => { notif.success(message); fetchGuru(); };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Personnel Registry</p>
          <h1 className="text-4xl font-black tracking-tighter">Manajemen <span className="text-blue-600">Guru</span></h1>
          <p className="text-slate-500 font-bold">Kelola data tenaga pendidik dan penugasan mata pelajaran.</p>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-2 min-w-[300px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1">Pencarian Cepat</p>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nama, Email, atau NIP..."
                className="w-full glass-effect pl-14 pr-6 py-4 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none premium-shadow"
              />
            </div>
          </div>

          <button onClick={handleAdd} className="h-[56px] px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-2 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            TAMBAH
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-effect rounded-[3rem] premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th className="w-16 text-center">NO</th>
                <th>PROFIL GURU</th>
                <th className="w-28 text-center">IDENTITAS</th>
                <th className="w-32 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Personnel Data...</td></tr>
              ) : filteredGuru.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold">Data tidak ditemukan</td></tr>
              ) : (
                filteredGuru.map((g, index) => (
                  <tr key={g.id} className="group">
                    <td className="text-center">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-[10px] font-black">{index + 1}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">{g.nama?.charAt(0)}</div>
                        <div className="flex flex-col">
                          <span className="group-hover:text-blue-600 transition-colors uppercase italic">{g.nama}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{g.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-black text-[10px] tracking-widest">{g.nis_nip}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(g)} className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => { setMapelTarget(g); setMapelModalOpen(true); }} className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Atur Mapel">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        </button>
                        <button onClick={() => handleDeleteClick(g)} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Hapus">
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

      <GuruModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} editData={editData} />
      <MapelGuruModal isOpen={mapelModalOpen} onClose={() => setMapelModalOpen(false)} onSuccess={handleModalSuccess} guruData={mapelTarget} />
      <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemName={deleteTarget?.nama} />
    </div>
  );
}
