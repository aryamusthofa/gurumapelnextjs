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
  PointElement,
  LineElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: "Jurusan", key: "jurusan", href: "/admin/jurusan", color: "from-blue-500 to-indigo-600", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { name: "Kelas", key: "kelas", href: "/admin/kelas", color: "from-cyan-500 to-blue-600", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
    { name: "Tingkat", key: "tingkat", href: "/admin/tingkat", color: "from-indigo-500 to-purple-600", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { name: "Mata Pelajaran", key: "mapel", href: "/admin/mata-pelajaran", color: "from-sky-500 to-indigo-500", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Guru", key: "guru", href: "/admin/guru", color: "from-blue-600 to-cyan-500", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Siswa", key: "siswa", href: "/admin/siswa", color: "from-indigo-600 to-blue-500", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
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
      } catch {
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
        backgroundColor: "rgba(59, 130, 246, 0.4)",
        borderColor: "#3b82f6",
        borderWidth: 3,
        borderRadius: 15,
        hoverBackgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { weight: 'bold' }, color: '#94a3b8' } },
      y: { beginAtZero: true, ticks: { precision: 0, color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Analytics Dashboard</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">System <span className="text-blue-600">Overview</span></h1>
        <p className="text-slate-500 font-bold max-w-2xl">Monitor distribusi data dan manajemen aset akademik secara real-time dengan antarmuka premium.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Synchronizing Data Modules...</p>
        </div>
      ) : (
        <>
          <div className="glass-effect p-8 md:p-12 rounded-[3.5rem] premium-shadow relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl transition-colors duration-1000 group-hover:bg-blue-600/10"></div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-black tracking-tight">Data Distribution <span className="text-slate-400 font-medium ml-2 text-base">Statistics</span></h2>
            </div>
            <div className="h-96 w-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative h-56 glass-effect p-8 md:p-10 rounded-[3.5rem] premium-shadow hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl`}></div>

                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 shadow-inner group-hover:rotate-12">
                      <svg className="w-7 h-7 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                      </svg>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage</div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter mb-1 transition-colors duration-500 group-hover:text-blue-600 uppercase italic">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-black tracking-tighter">{stats?.[item.key] ?? 0}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-2">Entries</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
