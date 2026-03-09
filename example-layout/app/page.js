"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registrasi berhasil! Silakan login.");
        setNama("");
        setEmail("");
        setPassword("");
        setRole("siswa");
      } else {
        setMessage(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* BACKGROUND IMAGE WITH BLUR */}
      <div
        className="fixed inset-0 z-[-1] transition-transform duration-[10s] hover:scale-110"
        style={{
          backgroundImage: "url('/bg-sekolah.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px]"></div>
      </div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
          {/* DECORATIVE ELEMENTS */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors"></div>
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-colors"></div>

          <div className="relative z-10">
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 -rotate-3 hover:rotate-0 transition-transform duration-500 ring-4 ring-white/10">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Buat <span className="text-indigo-400">Akun</span></h1>
              <p className="text-slate-300 font-bold text-sm tracking-wide">Daftar sebagai Siswa, Guru, atau Admin</p>
            </div>

            {message && (
              <div className={`mb-8 p-4 border rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 ${message.includes('berhasil') ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                <div className={`w-1.5 h-8 rounded-full ${message.includes('berhasil') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className={`${message.includes('berhasil') ? 'text-green-200' : 'text-red-200'} text-xs font-black uppercase tracking-widest`}>{message}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Nama Lengkap</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan nama sesuai ijazah"
                    className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4.5 rounded-[2rem] font-bold text-white placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Alamat Email</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4.5 rounded-[2rem] font-bold text-white placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Password</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4.5 rounded-[2rem] font-bold text-white placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Pilih Peran</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 pl-14 pr-10 py-4.5 rounded-[2rem] font-bold text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="siswa" className="bg-slate-900">Siswa</option>
                      <option value="guru" className="bg-slate-900">Guru</option>
                      <option value="admin" className="bg-slate-900">Admin Utama</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-3xl font-black text-base shadow-2xl shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 mt-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? "Menyiapkan Akun..." : "Daftarkan Sekarang"}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-slate-400 text-xs font-bold">
                Sudah Punya Akun?{" "}
                <Link
                  href="/auth/login"
                  className="text-indigo-400 hover:text-indigo-300 font-black tracking-widest uppercase ml-2 transition-colors"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] opacity-50">
          Secure Application Infrastructure • v2.4
        </p>
      </div>
    </div>
  );
}
