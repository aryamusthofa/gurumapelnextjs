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

  // Function to handle email input (convert to lowercase)
  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();
    setForm({ ...form, email: value });
  };

  // Function to handle NIS input (only numbers)
  const handleNisChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setForm({ ...form, nis: value });
  };

  // Function to handle Angkatan input (only numbers)
  const handleAngkatanChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setForm({ ...form, angkatan: value });
  };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manajemen Siswa</h1>

        <input
          type="text"
          placeholder="Cari nama atau NIS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-4 w-full max-w-md"
        />

        <div className="flex gap-3 mb-4 max-w-3xl">
          <select
            value={filterJurusan}
            onChange={(e) => {
              setFilterJurusan(e.target.value);
              setFilterKelas("");
            }}
            className="border p-2"
          >
            <option value="">Semua Jurusan</option>
            {jurusan.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama_jurusan}
              </option>
            ))}
          </select>

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="border p-2"
          >
            <option value="">Semua Kelas</option>
            {kelasByJurusan.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full border p-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleEmailChange}
            className="w-full border p-2"
          />

          <input
            type="text"
            placeholder="NIS"
            value={form.nis}
            onChange={handleNisChange}
            className="w-full border p-2"
          />

          <input
            type="text"
            placeholder="Angkatan (contoh: 2024)"
            value={form.angkatan}
            onChange={handleAngkatanChange}
            className="w-full border p-2"
          />

          <select
            value={form.kelas_id}
            onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}
            className="w-full border p-2"
          >
            <option value="">Pilih Kelas</option>
            {kelas.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_kelas}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2">
              {editId ? "Update Siswa" : "Tambah Siswa"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">No</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">NIS</th>
                <th className="border p-2">Angkatan</th>
                <th className="border p-2">Kelas</th>
                <th className="border p-2">Jurusan</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.map((s, index) => (
                <tr key={s.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{s.nama}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.nis_nip}</td>
                  <td className="border p-2">{s.angkatan || "-"}</td>
                  <td className="border p-2">{s.nama_kelas || "-"}</td>
                  <td className="border p-2">{s.nama_jurusan || "-"}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSiswa.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Data siswa kosong
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
  );
}