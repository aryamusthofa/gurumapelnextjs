'use client';

import { useEffect, useState } from 'react';
import NavbarGuru from "../components/NavbarGuru";

export default function ProfilAdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEdit, setIsEdit] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch('/api/profil', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Gagal mengambil data profil');
        }

        setUser(data.user);
        setNama(data.user.nama);
        setEmail(data.user.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  const handleUpdateProfil = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/profil/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nama, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUser({ ...user, nama, email });
      setIsEdit(false);
      alert('Profil berhasil diperbarui');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordLoading(true);

    try {
      const res = await fetch('/api/profil/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          passwordLama,
          passwordBaru,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setPasswordLama('');
      setPasswordBaru('');
      alert('Password berhasil diubah');
    } catch (err) {
      setError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memuat profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <NavbarGuru />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6">Profil Guru</h1>

          {!isEdit ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Nama</span>
                <span className="font-medium">{user.nama}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Role</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>

              <button
                onClick={() => setIsEdit(true)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Edit Profil
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfil} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Nama</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          <hr className="my-6" />

          <h2 className="text-lg font-semibold mb-3">Ubah Password</h2>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">
                Password Lama
              </label>
              <input
                type="password"
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">
                Password Baru
              </label>
              <input
                type="password"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded disabled:opacity-50"
            >
              {passwordLoading ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
