"use client";
import GuruLayout from "../components/GuruLayout";
import { useEffect, useState } from "react";

export default function GuruDashboard() {
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
    <GuruLayout>
      <div className="space-y-12 pb-20">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Teacher Workspace</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Guru <span className="text-blue-600">Dashboard</span></h1>
          <p className="text-slate-500 font-bold max-w-2xl text-lg">Selamat datang kembali, <span className="text-slate-900 dark:text-white uppercase font-black">{user?.nama || "Guru"}</span>. Mari kelola pembelajaran hari ini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-effect p-10 rounded-[3.5rem] premium-shadow group hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">Manajemen Ujian</h3>
            <p className="text-slate-500 font-bold text-sm mb-6">Buat, edit, dan awasi pelaksanaan ujian CBT secara real-time.</p>
            <button className="w-full py-4 glass-effect rounded-2xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all">Buka Modul</button>
          </div>

          <div className="glass-effect p-10 rounded-[3.5rem] premium-shadow group hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-3xl bg-purple-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-purple-500/20 group-hover:rotate-12 transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">Bank Soal</h3>
            <p className="text-slate-500 font-bold text-sm mb-6">Kelola koleksi soal-soal berkualitas untuk berbagai mata pelajaran.</p>
            <button className="w-full py-4 glass-effect rounded-2xl font-black text-[10px] uppercase tracking-widest text-purple-600 hover:bg-purple-600 hover:text-white transition-all">Buka Modul</button>
          </div>

          <div className="glass-effect p-10 rounded-[3.5rem] premium-shadow group hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20 group-hover:rotate-12 transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">Hasil Ujian</h3>
            <p className="text-slate-500 font-bold text-sm mb-6">Analisis statistik nilai siswa secara detail dan unduh laporan hasil.</p>
            <button className="w-full py-4 glass-effect rounded-2xl font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">Buka Modul</button>
          </div>
        </div>
      </div>
    </GuruLayout>
  );
}
