'use client';

import { useState, useEffect } from 'react';

import { UserIcon, EnvelopeIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function EditProfilModal({ isOpen, onClose, onSave, currentNama, currentEmail }) {
    const [nama, setNama] = useState(currentNama);
    const [email, setEmail] = useState(currentEmail);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNama(currentNama);
            setEmail(currentEmail);
        }
    }, [isOpen, currentNama, currentEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(nama, email);
        setLoading(false);
    };

    const handleClose = () => {
        setNama(currentNama);
        setEmail(currentEmail);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            {/* REVISI: Wrapper untuk animasi scale dan fade */}
            <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PencilIcon className="h-6 w-6 text-white" />
                            <h2 className="text-xl font-bold text-white">Edit Profil</h2>
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
                                <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <input
                                        id="nama"
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             shadow-sm transition-all duration-200"
                                        required
                                    />
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             shadow-sm transition-all duration-200"
                                        required
                                    />
                                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <PencilIcon className="h-5 w-5" />
                                        Simpan Perubahan
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