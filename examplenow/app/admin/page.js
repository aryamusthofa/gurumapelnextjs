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
    { name: "Jurusan", key: "jurusan", href: "/admin/jurusan" },
    { name: "Kelas", key: "kelas", href: "/admin/kelas" },
    { name: "Tingkat", key: "tingkat", href: "/admin/tingkat" },
    { name: "Mata Pelajaran", key: "mapel", href: "/admin/mata-pelajaran" },
    { name: "Guru", key: "guru", href: "/admin/guru" },
    { name: "Siswa", key: "siswa", href: "/admin/siswa" },
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
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (

      <div className="p-8 space-y-10">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Admin</h2>
          <p className="mt-2 text-gray-600">Ringkasan data sistem CBT</p>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Statistik Data
              </h3>
              <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="p-6 bg-white shadow rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="text-lg font-semibold">{item.name}</div>
                  <div className="mt-2 text-gray-600">
                    Total:{" "}
                    <span className="font-bold text-black">
                      {stats?.[item.key] ?? 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
  );
}
