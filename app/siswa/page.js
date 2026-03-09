"use client";
import SiswaLayout from "../components/SiswaLayout";
import { useEffect, useState } from "react";

export default function SiswaDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profil");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <SiswaLayout>
      <div className="space-y-12 pb-20">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">My <span className="text-blue-600">Dashboard</span></h1>
          <p className="text-slate-500 font-bold max-w-2xl text-lg">Halo, <span className="text-slate-900 dark:text-white uppercase font-black">{user?.nama || "Siswa"}</span>. Siap untuk mengerjakan ujian hari ini?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass-effect p-10 rounded-[4rem] premium-shadow group relative overflow-hidden ring-1 ring-blue-500/20">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              </div>
            </div>

            <div className="relative">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4 block">Active Session</span>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Ujian Sedang <br /><span className="text-blue-600">Berlangsung</span></h2>
              <p className="text-slate-500 font-bold mb-10 max-w-[280px]">Lihat daftar jadwal ujian yang tersedia dan mulai kerjakan sekarang.</p>
              <button className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Masuk Ruang Ujian</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="glass-effect p-8 rounded-[3rem] premium-shadow group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all capitalize">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-black uppercase italic tracking-tighter mb-1">Riwayat Nilai</h4>
              <p className="text-[10px] font-bold text-slate-400">Lihat pencapaian skor ujian Anda.</p>
            </div>

            <div className="glass-effect p-8 rounded-[3rem] premium-shadow group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all capitalize">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-black uppercase italic tracking-tighter mb-1">Jadwal Esok</h4>
              <p className="text-[10px] font-bold text-slate-400">Persiapkan diri untuk ujian besok.</p>
            </div>

            <div className="glass-effect p-8 rounded-[3rem] premium-shadow lg:col-span-2 group hover:border-blue-500/30 transition-all flex items-center justify-between">
              <div>
                <h4 className="font-black uppercase italic tracking-tighter mb-1">Bantuan & Panduan</h4>
                <p className="text-[10px] font-bold text-slate-400">Butuh bantuan teknis? Hubungi admin.</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-blue-600/20 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiswaLayout>
  );
}
