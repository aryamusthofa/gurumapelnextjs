"use client";

import { useEffect, useState } from "react";

export default function MataPelajaranPage() {
  const [mapel, setMapel] = useState([]);
  const [filteredMapel, setFilteredMapel] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    nama_mapel: "",
    kode_mapel: "",
  });

  const fetchMapel = async () => {
    try {
      const res = await fetch("/api/admin/mapel", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal mengambil data mapel");

      const data = await res.json();
      setMapel(data.mapel);
      setFilteredMapel(data.mapel);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const result = mapel.filter(
      (m) =>
        m.nama_mapel.toLowerCase().includes(keyword) ||
        m.kode_mapel.toLowerCase().includes(keyword)
    );

    setFilteredMapel(result);
  }, [search, mapel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nama_mapel || !form.kode_mapel) {
      setError("Nama mapel dan kode mapel wajib diisi");
      return;
    }

    const url = form.id
      ? `/api/admin/mapel/${form.id}`
      : "/api/admin/mapel";

    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_mapel: form.nama_mapel,
          kode_mapel: form.kode_mapel,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      resetForm();
      fetchMapel();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus mata pelajaran ini?")) return;

    try {
      const res = await fetch(`/api/admin/mapel/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      fetchMapel();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nama_mapel: "",
      kode_mapel: "",
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Manajemen Mata Pelajaran
        </h1>

        <input
          type="text"
          placeholder="Cari nama atau kode mapel..."
          className="w-full border px-3 py-2 rounded mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Nama Mata Pelajaran
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={form.nama_mapel}
              onChange={(e) =>
                setForm({ ...form, nama_mapel: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Kode Mapel</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded uppercase"
              value={form.kode_mapel}
              onChange={(e) =>
                setForm({
                  ...form,
                  kode_mapel: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {form.id ? "Update" : "Simpan"}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Kode</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMapel.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              filteredMapel.map((m, i) => (
                <tr key={m.id}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2 text-center font-mono">
                    {m.kode_mapel}
                  </td>
                  <td className="border p-2">{m.nama_mapel}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() =>
                        setForm({
                          id: m.id,
                          nama_mapel: m.nama_mapel,
                          kode_mapel: m.kode_mapel,
                        })
                      }
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600"
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
  );
}
