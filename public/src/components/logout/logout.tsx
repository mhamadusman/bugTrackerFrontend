"use client"
import { LogOutIcon } from 'lucide-react';
import { logout } from '@/app/actions';

export default function Logout() {
  return (
    <>
      <button className={`flex items-center gap-2
      font-poppins lg:bg-blue-600  bg-gray-50 text-gray-500 lg:text-white p-2  lg:px-3 lg:py-1.5  transition-all transition-colors rounded-sm hover:bg-blue-700 cursor-pointer text-sm`} 
      
      onClick={async ()=>{await logout()}}>
            log out <LogOutIcon  width={15}/>
          
      </button>
    </>
  );
}