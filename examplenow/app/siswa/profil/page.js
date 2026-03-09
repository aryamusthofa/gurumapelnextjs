'use client';

import { useEffect, useState } from 'react';
import NavbarSiswa from "../components/NavbarSiswa";

export default function ProfilAdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [messageProfil, setMessageProfil] = useState('');

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [messagePassword, setMessagePassword] = useState('');

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

  const handleEditProfil = async (e) => {
    e.preventDefault();
    setMessageProfil('');

    const res = await fetch('/api/profil/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nama, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessageProfil(data.message || 'Gagal update profil');
      return;
    }

    setUser({ ...user, nama, email });
    setMessageProfil('Profil berhasil diperbarui');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessagePassword('');

    const res = await fetch('/api/profil/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ passwordLama, passwordBaru }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessagePassword(data.message || 'Gagal mengubah password');
      return;
    }

    setPasswordLama('');
    setPasswordBaru('');
    setMessagePassword('Password berhasil diperbarui');
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
      <NavbarSiswa />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-8">

          <h1 className="text-2xl font-semibold">Profil Siswa</h1>

          <div className="space-y-3">
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
          </div>

          <form onSubmit={handleEditProfil} className="space-y-4">
            <h2 className="text-lg font-semibold">Edit Profil</h2>

            {messageProfil && (
              <p className="text-sm text-blue-600">{messageProfil}</p>
            )}

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Nama"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Email"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Simpan Perubahan
            </button>
          </form>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <h2 className="text-lg font-semibold">Ubah Password</h2>

            {messagePassword && (
              <p className="text-sm text-green-600">{messagePassword}</p>
            )}

            <input
              type="password"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Password Lama"
            />

            <input
              type="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Password Baru"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              Ubah Password
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
