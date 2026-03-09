"use client";
import NavbarGuru from "./components/NavbarGuru";

export default function GuruDashboard() {
  return (
    <div>
      <NavbarGuru />

      <div className="p-8">
        <h2 className="text-2xl font-bold">Dashboard Guru</h2>
        <p className="mt-4">Selamat datang Guru!</p>
      </div>
    </div>
  );
}
