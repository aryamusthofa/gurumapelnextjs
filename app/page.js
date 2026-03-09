"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [showPassword, setShowPassword] = useState(false);

  // Verification State
  const [step, setStep] = useState("register"); // 'register' atau 'verify'
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requireVerification) {
          setMessage("Silakan periksa email Anda untuk kode verifikasi.");
          setStep("verify");
          setResendCooldown(60); // Mulai cooldown 60 detik
        } else {
          setMessage("Registrasi berhasil!");
          // Reset form (meski jika requireVerification false ini jarang terjadi di flow baru)
          setNama("");
          setEmail("");
          setPassword("");
        }
      } else {
        setMessage(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Email berhasil diverifikasi! Mengalihkan ke halaman login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setMessage(data.message || "Kode OTP tidak valid");
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Kode OTP baru telah dikirim ke email Anda.");
        setResendCooldown(60); // Reset timer 1 menit
      } else {
        setMessage(data.message || "Gagal mengirim ulang kode");
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server");
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
                {step === "register" ? (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                )}
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                {step === "register" ? (
                  <>Register <span className="text-blue-400">Akun</span></>
                ) : (
                  <>Verifikasi <span className="text-blue-400">Email</span></>
                )}
              </h1>
              <p className="text-slate-300 font-bold text-sm tracking-wide text-center">
                {step === "register" ? "Computer Based Test System" : `Masukkan kode OTP yang dikirim ke email ${email}`}
              </p>
            </div>

            {message && (
              <div className={`mb-8 p-4 border rounded-2xl flex items-center gap-4 animate-shake ${message.toLowerCase().includes('berhasil') || message.includes('mengalihkan') || message.includes('dikirim') ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                <div className={`w-1.5 h-8 rounded-full ${message.toLowerCase().includes('berhasil') || message.includes('mengalihkan') || message.includes('dikirim') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className={`${message.toLowerCase().includes('berhasil') || message.includes('mengalihkan') || message.includes('dikirim') ? 'text-green-200' : 'text-red-200'} text-[11px] font-black uppercase tracking-widest`}>{message}</p>
              </div>
            )}

            {step === "register" ? (
              /* FROM REGISTRASI */
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-5 rounded-3xl font-bold text-white placeholder:text-slate-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                  </div>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Password</label>
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Account Type</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-5 rounded-3xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none appearance-none"
                      >
                        <option value="siswa" className="bg-slate-900">Siswa</option>
                        <option value="guru" className="bg-slate-900">Guru</option>
                        <option value="admin" className="bg-slate-900">Admin</option>
                      </select>
                    </div>
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
                      <span>Mendaftarkan...</span>
                    </div>
                  ) : (
                    "Buat Akun Sekarang"
                  )}
                </button>
              </form>
            ) : (
              /* FORM OTP VERIFICATION */
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 text-center block">Masukkan 6 Digit OTP</label>
                  <div className="relative group">
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="000000"
                      className="w-full bg-white/5 border border-white/10 px-6 py-6 rounded-3xl font-black text-4xl text-center tracking-[0.5em] text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none uppercase"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} // Hanya angka
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-3xl font-black text-base shadow-2xl shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memverifikasi...</span>
                    </div>
                  ) : (
                    "Verifikasi Email"
                  )}
                </button>

                <div className="pt-4 border-t border-white/5 flex flex-col items-center">
                  <p className="text-slate-400 text-xs font-bold mb-2">Belum menerima kode?</p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0 || loading}
                    className={`font-black tracking-widest uppercase text-xs transition-colors ${resendCooldown > 0 ? "text-slate-500 cursor-not-allowed" : "text-blue-400 hover:text-blue-300"
                      }`}
                  >
                    {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : "Kirim Ulang OTP"}
                  </button>
                </div>
              </form>
            )}

            {step === "register" && (
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                <p className="text-slate-400 text-xs font-bold">
                  Sudah punya akun?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-400 hover:text-blue-300 font-black tracking-widest uppercase ml-2 transition-colors"
                  >
                    Login di sini
                  </Link>
                </p>
              </div>
            )}
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
