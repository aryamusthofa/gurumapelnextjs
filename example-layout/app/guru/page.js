"use client";
import NavbarGuru from "./components/NavbarGuru";

export default function GuruDashboard() {
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
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[6px]"></div>
      </div>

      <NavbarGuru />

      <div className="pt-24 p-6 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Dashboard <span className="text-blue-400">Guru</span></h1>
            <p className="text-slate-300 font-bold mt-2">Selamat datang kembali di sistem Computer Based Test.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Status Kepegawaian</p>
            <p className="text-white font-black">Aktif / Pengajar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-4">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
              Informasi Terkini
            </h2>
            <div className="space-y-6 text-slate-200 font-medium leading-relaxed">
              <p>Halaman dashboard guru sedang dalam tahap sinkronisasi data kurikulum terbaru. Anda dapat mengelola profil dan melihat penugasan melalui menu yang tersedia.</p>
              <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-3xl flex items-center gap-4 group-hover:bg-blue-500/20 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-white">Panduan Penggunaan</p>
                  <p className="text-xs text-blue-300">Klik untuk melihat tutorial sistem CBT</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
            <div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-black mb-2">Jadwal Ujian</h3>
              <p className="text-blue-100 text-sm font-bold opacity-80 leading-relaxed">Pantau ketersediaan bank soal dan jadwal pelaksanaan ujian harian.</p>
            </div>
            <button className="mt-8 bg-white text-blue-900 px-6 py-4 rounded-3xl font-black text-sm shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
              Lihat Agenda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
