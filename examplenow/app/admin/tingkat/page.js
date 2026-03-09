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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Manajemen Tingkat</h1>

        <input
          type="text"
          placeholder="Cari tingkat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border px-3 py-2 rounded"
        />

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border p-4 rounded">
          <div>
            <label className="block mb-1 font-medium">Nama Tingkat</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={form.nama_tingkat}
              onChange={(e) =>
                setForm({ ...form, nama_tingkat: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Angka Tingkat</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={form.angka_tingkat}
              onChange={(e) =>
                setForm({ ...form, angka_tingkat: e.target.value })
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Nama Tingkat</th>
                <th className="border p-2">Angka</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTingkat.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Data kosong
                  </td>
                </tr>
              ) : (
                filteredTingkat.map((t, i) => (
                  <tr key={t.id} className="border-t">
                    <td className="border p-2 text-center">{i + 1}</td>
                    <td className="border p-2">{t.nama_tingkat}</td>
                    <td className="border p-2 text-center">{t.angka_tingkat}</td>
                    <td className="border p-2 text-center space-x-2">
                      <button
                        onClick={() =>
                          setForm({
                            id: t.id,
                            nama_tingkat: t.nama_tingkat,
                            angka_tingkat: t.angka_tingkat,
                          })
                        }
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
      </div>
  );
}
