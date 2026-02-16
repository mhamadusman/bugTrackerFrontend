"use client"
import { LogOutIcon } from 'lucide-react';
import { logout } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter()
  const handleLogout = async () => {
    await logout(); 
    localStorage.removeItem('user_profile');
    localStorage.removeItem('role');
    const user = localStorage.getItem('user_profile')
    console.log('user aftr logout  :: ' , user)
    router.push('/auth/login');
    router.refresh();
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