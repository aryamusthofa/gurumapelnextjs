"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuruPage() {
  const [guru, setGuru] = useState([]);
  const [filteredGuru, setFilteredGuru] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    nis_nip: "",
  });

  const fetchGuru = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/guru");
    const data = await res.json();
    const guruData = data.guru || [];
    setGuru(guruData);
    setFilteredGuru(guruData);
    setLoading(false);
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = guru.filter(
      (g) =>
        g.nama.toLowerCase().includes(term) ||
        g.email.toLowerCase().includes(term) ||
        g.nis_nip.toLowerCase().includes(term)
    );

    setFilteredGuru(filtered);
  };

  const resetForm = () => {
    setForm({
      nama: "",
      email: "",
      nis_nip: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `/api/admin/guru/${editId}`
      : `/api/admin/guru`;

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message);
      return;
    }

    resetForm();
    fetchGuru();
  };

  const handleEdit = (g) => {
    setEditId(g.id);
    setForm({
      nama: g.nama ?? "",
      email: g.email ?? "",
      nis_nip: g.nis_nip ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus guru ini?")) return;

    const res = await fetch(`/api/admin/guru/${id}`, {
      method: "DELETE",
    });

    if (res.ok) fetchGuru();
    else alert("Gagal menghapus guru");
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value.toLowerCase();
    setForm({ ...form, email: emailValue });
  };

  const handleNipChange = (e) => {
    const nipValue = e.target.value.replace(/[^0-9]/g, '');
    setForm({ ...form, nis_nip: nipValue });
  };

  const handleNipKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
      return false;
    }
    return true;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Guru</h1>

      <input
        type="text"
        placeholder="Cari berdasarkan nama, email, atau NIP"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full md:w-1/2 mb-4 p-2 border rounded"
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-3 max-w-md bg-white border p-4 rounded"
      >
        <input
          type="text"
          placeholder="Nama Guru"
          required
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleEmailChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="NIP"
          required
          value={form.nis_nip}
          onChange={handleNipChange}
          onKeyPress={handleNipKeyPress}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            {editId ? "Update Guru" : "Tambah Guru"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border bg-white rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-center w-10">No</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">NIP</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuru.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  {searchTerm ? "Tidak ada guru yang cocok dengan pencarian" : "Data guru kosong"}
                </td>
              </tr>
            ) : (
              filteredGuru.map((g, index) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{g.nama}</td>
                  <td className="border p-2">{g.email}</td>
                  <td className="border p-2">{g.nis_nip}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/guru/mapel?guru_id=${g.id}`)
                      }
                      className="text-green-600 hover:underline"
                    >
                      Atur Mapel
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