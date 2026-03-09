"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* BACKGROUND IMAGE WITH BLUR */}
      <div
        className="fixed inset-0 z-[-1] transition-transform duration-[10s] hover:scale-110"
        style={{
          backgroundImage: "url('/bg-sekolah.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px]"></div>
      </div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
          {/* DECORATIVE ELEMENTS */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors"></div>
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-colors"></div>

          <div className="relative z-10">
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500 ring-4 ring-white/10">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0014 2.118v.03a10.001 10.001 0 00-7.38 5.434M12 11V3m0 8c2.11 0 5.47-.56 5.47-5.47M12 11c-2.11 0-5.47-.56-5.47-5.47" /></svg>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Portal <span className="text-blue-400">Login</span></h1>
              <p className="text-slate-300 font-bold text-sm tracking-wide">Computer Based Test System</p>
            </div>

            {msg && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-4 animate-shake">
                <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                <p className="text-red-200 text-xs font-black uppercase tracking-widest">{msg}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                  </div>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-5 rounded-3xl font-bold text-white placeholder:text-slate-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-blue-300 transition-colors"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 pl-14 pr-14 py-5 rounded-3xl font-bold text-white placeholder:text-slate-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.04m4.066-4.116A9.95 9.95 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.105-2.105l-2.436-2.436m0 0L10.435 10.435m0 0L3 3m10.875 10.875a3 3 0 00-4.25-4.25m4.25 4.25l-4.25-4.25" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-3xl font-black text-base shadow-2xl shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Proses Otentikasi...</span>
                  </div>
                ) : (
                  "Masuk ke Sistem"
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-slate-400 text-xs font-bold">
                Belum punya akun?{" "}
                <Link
                  href="/"
                  className="text-blue-400 hover:text-blue-300 font-black tracking-widest uppercase ml-2 transition-colors"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
