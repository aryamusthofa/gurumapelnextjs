'use client';

import { useState } from 'react';

import { LockClosedIcon, XMarkIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function GantiPasswordModal({ isOpen, onClose, onSave }) {
    const [passwordBaru, setPasswordBaru] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordBaru.trim()) return;

        setLoading(true);
        const success = await onSave(passwordBaru);
        if (success) {
            setPasswordBaru("");
        }
        setLoading(false);
    };

    const handleClose = () => {
        setPasswordBaru("");
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <LockClosedIcon className="h-6 w-6 text-white" />
                            <h2 className="text-xl font-bold text-white">Ubah Password</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="password-baru" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        id="password-baru"
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordBaru}
                                        onChange={(e) => setPasswordBaru(e.target.value)}
                                        placeholder="Masukkan password baru"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             shadow-sm transition-all duration-200"
                                        required
                                    />
                                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Pastikan password baru Anda kuat dan mudah diingat.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                type="submit"
                                disabled={loading || !passwordBaru.trim()}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <LockClosedIcon className="h-5 w-5" />
                                        Update Password
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold 
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                         transition-all duration-200"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}