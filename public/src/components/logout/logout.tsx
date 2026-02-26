"use client"
import { useState } from 'react';
import { api } from '../../apiConfig/api';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoadingIndicator } from '../loadingIndicator/loadingIndicator';
import { toast } from 'react-hot-toast';

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/log-out');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('role');
      router.push('/auth/login');
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <button 
      disabled={loading}
      className={`flex items-center justify-center gap-2 font-poppins transition-all cursor-pointer text-sm w-full lg:w-auto
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
        lg:bg-blue-600 lg:text-white lg:px-4 lg:py-1.5 lg:rounded-sm lg:hover:bg-blue-700 
        bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100`}
      onClick={handleLogout}
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <span className="capitalize">log out</span>
          <LogOutIcon width={16} />
        </>
      )}
    </button>
  );
}