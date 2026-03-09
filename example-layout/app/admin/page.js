"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: "Jurusan", key: "jurusan", href: "/admin/jurusan", color: "from-blue-500 to-indigo-600" },
    { name: "Kelas", key: "kelas", href: "/admin/kelas", color: "from-cyan-500 to-blue-600" },
    { name: "Tingkat", key: "tingkat", href: "/admin/tingkat", color: "from-indigo-500 to-purple-600" },
    { name: "Mata Pelajaran", key: "mapel", href: "/admin/mata-pelajaran", color: "from-sky-500 to-indigo-500" },
    { name: "Guru", key: "guru", href: "/admin/guru", color: "from-blue-600 to-cyan-500" },
    { name: "Siswa", key: "siswa", href: "/admin/siswa", color: "from-indigo-600 to-blue-500" },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Gagal mengambil data dashboard");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const chartData = {
    labels: menuItems.map((item) => item.name),
    datasets: [
      {
        label: "Jumlah Data",
        data: menuItems.map((item) => stats?.[item.key] ?? 0),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        borderRadius: 12,
        hoverBackgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
      y: { beginAtZero: true, ticks: { precision: 0 }, grid: { borderDash: [5, 5] } },
    },
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
          System <span className="text-blue-600">Overview</span>
        </h1>
        <p className="text-slate-500 font-medium">Ringkasan statistik dan manajemen data utama sekolah.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Analytic Syncing...</p>
        </div>
      ) : (
        <>
          {/* CHART SECTION */}
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Statistik Distribusi Data</h2>
            </div>
            <div className="h-80 w-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* GRID LINKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative h-48 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none hover:border-blue-500/50 transition-all overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`}></div>

                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Management</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase italic">{item.name}</div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400">Total Entries</div>
                      <div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                        {stats?.[item.key] ?? 0}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
