"use client";

import { useEffect, useState } from "react";
import { useNotif } from "@/app/components/Notif";
import JurusanModal from "./components/JurusanModal";
import DeleteModal from "@/app/components/DeleteModal";

export default function JurusanPage() {
  const [jurusan, setJurusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const notif = useNotif();

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchJurusan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jurusan");
      if (!res.ok) throw new Error("Gagal mengambil data jurusan");
      const data = await res.json();
      setJurusan(data.jurusan);
    } catch (err) {
      notif.error(err.message);
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

  // Open modal for adding
  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  // Open delete confirmation
  const handleDeleteClick = (item) => {
    setDeleteTarget(item);
    setDeleteModalOpen(true);
  };

  // Execute delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/jurusan/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        notif.success("Jurusan berhasil dihapus!");
        fetchJurusan();
      } else {
        const data = await res.json();
        notif.error(data.message || "Gagal menghapus jurusan");
      }
    } catch (err) {
      notif.error("Terjadi kesalahan saat menghapus");
    }
  };

  // Callback from JurusanModal on success
  const handleModalSuccess = (message) => {
    notif.success(message);
    fetchJurusan();
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Academic Modules</p>
          <h1 className="text-4xl font-black tracking-tighter">Manajemen <span className="text-blue-600">Jurusan</span></h1>
          <p className="text-slate-500 font-bold">Kelola opsi program keahlian yang tersedia di sistem.</p>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-2 min-w-[300px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1">Cari Jurusan</p>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ketik nama atau kode..."
                className="w-full glass-effect pl-14 pr-6 py-4 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none premium-shadow"
              />
            </div>
          </div>

          {/* TOMBOL TAMBAH */}
          <button
            onClick={handleAdd}
            className="h-[56px] px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-2 shrink-0"
          >
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
                <th>DETAIL JURUSAN</th>
                <th className="w-28 text-center">KODE</th>
                <th className="w-28 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Data...</td></tr>
              ) : filteredJurusan.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold">Data tidak ditemukan</td></tr>
              ) : (
                filteredJurusan.map((j, index) => (
                  <tr key={j.id} className="group">
                    <td className="text-center">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-[10px] font-black">
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="group-hover:text-blue-600 transition-colors uppercase italic">{j.nama_jurusan}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Program Keahlian</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-black text-[10px] tracking-widest">
                        {j.kode_jurusan}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(j)}
                          className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(j)}
                          className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Hapus"
                        >
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

      {/* MODALS */}
      <JurusanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        editData={editData}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.nama_jurusan}
      />
    </div>
  );
}
