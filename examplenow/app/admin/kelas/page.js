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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manajemen Kelas</h1>

      {/* MODIFIKASI: Tampilkan pesan error jika ada */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <span 
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError("")}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      {/* MODIFIKASI: Update placeholder untuk mencerminkan kemampuan pencarian */}
      <input
        type="text"
        placeholder="Cari nama kelas atau jurusan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border rounded px-3 py-2 focus:ring"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 space-y-4 max-w-xl"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Kelas
          </label>
          <input
            required
            className="w-full border rounded px-3 py-2 focus:ring"
            value={form.nama_kelas}
            onChange={(e) =>
              setForm({ ...form, nama_kelas: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Jurusan
          </label>
          <select
            required
            className="w-full border rounded px-3 py-2 bg-white focus:ring"
            value={form.jurusan_id}
            onChange={(e) =>
              setForm({ ...form, jurusan_id: e.target.value })
            }
          >
            <option value="">Pilih Jurusan</option>
            {jurusan.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama_jurusan}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tingkat
          </label>
          <select
            required
            className="w-full border rounded px-3 py-2 bg-white focus:ring"
            value={form.tingkat_id}
            onChange={(e) =>
              setForm({ ...form, tingkat_id: e.target.value })
            }
          >
            <option value="">Pilih Tingkat</option>
            {tingkat.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama_tingkat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Wali Kelas (Opsional)
          </label>
          <select
            className="w-full border rounded px-3 py-2 bg-white focus:ring"
            value={form.wali_kelas_id}
            onChange={(e) =>
              setForm({ ...form, wali_kelas_id: e.target.value })
            }
          >
            <option value="">- Tidak ada -</option>
            {guru.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editId ? "Update" : "Tambah"} Kelas
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setError(""); // Reset error state
                setForm({
                  nama_kelas: "",
                  jurusan_id: "",
                  tingkat_id: "",
                  wali_kelas_id: "",
                });
              }}
              className="px-4 py-2 border rounded"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama Kelas</th>
              <th className="px-4 py-2">Jurusan</th>
              <th className="px-4 py-2">Tingkat</th>
              <th className="px-4 py-2">Wali Kelas</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKelas.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  Data kelas tidak ditemukan
                </td>
              </tr>
            ) : (
              filteredKelas.map((item, i) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">
                    {item.nama_kelas}
                  </td>
                  <td className="px-4 py-2">
                    {item.nama_jurusan}
                  </td>
                  <td className="px-4 py-2">
                    {item.nama_tingkat}
                  </td>
                  <td className="px-4 py-2">
                    {item.wali_kelas || "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}