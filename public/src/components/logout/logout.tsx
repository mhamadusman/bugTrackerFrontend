"use client"
import { api } from '../../apiConfig/api';
import { LogOutIcon } from 'lucide-react';
import { redirect } from 'next/navigation';


export default function Logout() {
  const handleLogout = async () => {
    await api.post('/auth/log-out')
    localStorage.removeItem('user_profile');
    localStorage.removeItem('role');
    redirect('/auth/login')
  };

  return (
    <button 
      className="flex items-center gap-2 font-poppins lg:bg-blue-600 bg-gray-50 text-gray-500 lg:text-white p-2 lg:px-3 lg:py-1.5 transition-all rounded-sm hover:bg-blue-700 cursor-pointer text-sm" 
      onClick={handleLogout}
    >
      log out <LogOutIcon width={15}/>
    </button>
  );
}