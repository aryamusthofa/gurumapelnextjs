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
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white font-black tracking-widest uppercase text-xs">Memuat Profil Guru...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-[2rem] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-red-200 font-black uppercase tracking-widest text-sm mb-4">Terjadi Kesalahan</p>
          <p className="text-slate-400 font-medium mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-red-500 text-white py-3 rounded-xl font-bold">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND IMAGE - FIXED */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          backgroundImage: "url('/bg-sekolah.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[8px]"></div>
      </div>

      <NavbarGuru />

      <div className="pt-28 pb-12 px-6">
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-6 mb-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-white/10">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter">Profil <span className="text-blue-400">Pengajar</span></h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Identitas Digital Guru</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

            {!isEdit ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.07] transition-all">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Nama Lengkap</p>
                    <p className="text-xl font-black text-white">{user.nama}</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.07] transition-all">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Alamat Email</p>
                    <p className="text-xl font-black text-white">{user.email}</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.07] transition-all">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Peran Sistem</p>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      <p className="text-lg font-black text-white capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEdit(true)}
                  className="w-full bg-white/10 hover:bg-white text-white hover:text-blue-900 py-5 rounded-3xl font-black text-base transition-all active:scale-95 shadow-xl border border-white/10"
                >
                  Perbarui Informasi Profil
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfil} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-3xl font-black shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEdit(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-3xl font-black border border-white/10 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            <div className="my-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5"></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Keamanan Akun</p>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password Lama</label>
                  <input
                    type="password"
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password Baru</label>
                  <input
                    type="password"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white py-5 rounded-3xl font-black border border-red-500/30 transition-all disabled:opacity-50 active:scale-95 shadow-xl"
              >
                {passwordLoading ? 'Memproses Enkripsi...' : 'Ganti Kata Sandi Akun'}
              </button>
            </form>
          </div>

          <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            Digital Signature Verification • v2.4
          </p>
        </div>
      </div>
    </div>
  );
}
