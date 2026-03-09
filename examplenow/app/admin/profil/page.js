'use client';

import { useEffect, useState } from 'react';
import EditProfilModal from './components/EditProfilModal';
import GantiPasswordModal from './components/GantiPasswordModal';
import Notif from '@/app/components/Notif';

import { toast } from 'react-toastify';

import { UserIcon, EnvelopeIcon, BriefcaseIcon, PencilIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function ProfilAdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const res = await fetch('/api/profil', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfil = async (nama, email) => {
    try {
      const res = await fetch('/api/profil/edit', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser({ ...user, nama, email });
      setIsEditOpen(false);
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGantiPassword = async (passwordBaru) => {
    try {
      const res = await fetch('/api/profil/password', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordBaru }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setIsPasswordOpen(false);
      toast.success('Password berhasil diperbarui!');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat profil...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>
    </div>
  );

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Panggil komponen Notif di sini */}
      <Notif />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-blue-600 text-2xl sm:text-3xl font-bold shadow-lg mb-4">
                {getInitials(user.nama)}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.nama}</h1>
              <p className="text-blue-100 mt-1">{user.email}</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Akun</h2>

                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Nama Lengkap</p>
                    <p className="text-sm text-gray-500">{user.nama}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Role</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <PencilIcon className="w-5 h-5" />
                  Edit Profil
                </button>
                <button
                  onClick={() => setIsPasswordOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfilModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditProfil}
        currentNama={user.nama}
        currentEmail={user.email}
      />

      <GantiPasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSave={handleGantiPassword}
      />
    </>
  );
}