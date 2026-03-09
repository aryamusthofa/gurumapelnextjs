"use client";
import NavbarSiswa from "./components/NavbarSiswa";

export default function SiswaDashboard() {
  return (
    <div>
      <NavbarSiswa />

      <div className="p-8">
        <h2 className="text-2xl font-bold">Dashboard Siswa</h2>
        <p className="mt-4">Selamat datang Siswa!</p>
      </div>
    </div>
  );
}
