"use client";

import { useState } from "react";

const EmailIcon = ({ className }) => (
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
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const LockIcon = ({ className }) => (
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
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat mengirim link reset.");
      }

      setMessage(
        "Jika email terdaftar, link reset password telah dikirim ke inbox Anda."
      );
      setEmail(""); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <LockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Lupa Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masukkan email Anda untuk menerima link reset password.
          </p>
        </div>

        {(message || error) && (
          <div
            className={`${message && !error
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              } border px-4 py-3 rounded-lg text-sm text-center`}
          >
            {message || error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EmailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 sm:text-sm"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </div>
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
                  Mengirim...
                </span>
              ) : (
                "Kirim Link Reset"
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Sudah ingat password?{" "}
          <a
            href="/auth/login"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Kembali ke Login
          </a>
        </p>
      </div>
    </div>
  );
}