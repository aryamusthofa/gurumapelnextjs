"use client";

import { useEffect, useState } from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setClosing(false);
            setDeleting(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (deleting) return;
        setClosing(true);
        setVisible(false);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 300);
    };

    const handleConfirm = async () => {
        setDeleting(true);
        await onConfirm();
        setDeleting(false);
        handleClose();
    };

    if (!isOpen && !closing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            <div className={`relative w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-8 text-center transition-all duration-300 ease-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white mb-2">Konfirmasi Hapus</h3>
                <p className="text-sm text-slate-500 font-bold mb-8">
                    Apakah kamu yakin ingin menghapus <span className="text-red-500 font-black">{itemName || "data ini"}</span>? Tindakan ini tidak bisa dibatalkan.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={deleting}
                        className="flex-1 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 to-red-500 shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-60"
                    >
                        {deleting ? "Menghapus..." : "YA, HAPUS"}
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={deleting}
                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
                    >
                        BATAL
                    </button>
                </div>
            </div>
        </div>
    );
}
