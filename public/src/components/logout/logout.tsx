"use client"
import { useState } from 'react';
import { api } from '../../apiConfig/api';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoadingIndicator } from '../loadingIndicator/loadingIndicator';
import { toast } from 'react-hot-toast';
import { getAxiosErrorMessage } from '../../utils/error';

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/log-out');
      router.push('/auth/login');
    } catch (error: unknown) {
      const {genericMessage} = getAxiosErrorMessage(error)
      setLoading(false);
      toast.error(genericMessage);
    }
  };

  return (
    <button 
      disabled={loading}
      className={`flex items-center justify-center gap-2 font-poppins transition-all cursor-pointer text-sm w-full lg:w-full
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
        lg:bg-blue-600 lg:text-white lg:px-4 lg:py-1.5 lg:rounded-sm lg:hover:bg-blue-700 
        bg-gray-100  p-3 rounded-xl hover:bg-gray-200`}
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