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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Manajemen Jurusan</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block font-medium">Nama Jurusan</label>
          <input
            type="text"
            value={namaJurusan}
            onChange={(e) => setNamaJurusan(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Contoh: Rekayasa Perangkat Lunak"
          />
        </div>

        <div>
          <label className="block font-medium">Kode Jurusan</label>
          <input
            type="text"
            value={kode_jurusan}
            onChange={(e) => setkode_jurusan(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Contoh: RPL"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${editId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {editId ? "Update Jurusan" : "Tambah Jurusan"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setNamaJurusan("");
                setkode_jurusan("");
              }}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari jurusan (nama / kode)..."
          className="w-full md:w-1/3 border rounded p-2"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300 border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Jurusan</th>
              <th className="border p-2">Kode</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredJurusan.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              filteredJurusan.map((j, index) => (
                <tr key={j.id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{j.nama_jurusan}</td>
                  <td className="border p-2 text-center">
                    {j.kode_jurusan}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(j)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(j.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}