"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EyeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === "admin") router.push("/admin");
        else if (data.role === "guru") router.push("/guru");
        else if (data.role === "siswa") router.push("/siswa");
      } else {
        setMsg(data.message || "Login gagal");
      }
    } catch (error) {
      setMsg("Gagal terhubung ke server");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Selamat Datang
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masuk untuk mengakses akun Anda
          </p>
        </div>

        {msg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm text-center">
            {msg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 sm:text-sm"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-black dark:bg-white px-4 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-black/10 dark:shadow-white/5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Belum punya akun?{" "}
          <a
            href="/"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}