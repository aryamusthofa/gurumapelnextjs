"use client";

import { useEffect, useState } from "react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setClosing(false);
            setLoggingOut(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (loggingOut) return;
        setClosing(true);
        setVisible(false);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 300);
    };

    const handleConfirm = async () => {
        setLoggingOut(true);
        await onConfirm();
    };

    if (!isOpen && !closing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            <div className={`relative w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-8 text-center transition-all duration-300 ease-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white mb-2">Keluar Akun</h3>
                <p className="text-sm text-slate-500 font-bold mb-8">
                    Apakah kamu yakin ingin <span className="text-orange-500 font-black">keluar</span> dari sistem? Sesi akan diakhiri.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={loggingOut}
                        className="flex-1 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-red-500 shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-60"
                    >
                        {loggingOut ? "Logging out..." : "YA, KELUAR"}
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={loggingOut}
                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
                    >
                        BATAL
                    </button>
                </div>
            </div>
        </div>
    );
}
