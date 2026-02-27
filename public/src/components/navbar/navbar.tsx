"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "../types/types";
import { Menu } from "lucide-react";
import Logout from "../logout/logout";
import { UserService } from '../../apiConfig/userService';

export default function Navbar() {

  const [menu, setMenu] = useState<boolean>(false)
  const [user, setUser] = useState({
    name: '',
    role: '',
    image: ''
  });

  const getProfile = async () => {
    try {
      const data: profile = await UserService.getProfile();
      const info = {
        name: data.name,
        role: data.role,
        image: data.image
      };
      console.log('user profile in nav bar :: ', data)

      setUser(info);
      localStorage.setItem('user_profile', JSON.stringify(info));
      localStorage.setItem('role', data.role);

    } catch (error: any) {
      localStorage.removeItem('user_profile');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      getProfile();
    }
  }, []);
  const imgurl = user.image ? `${user.image}` : '/images/Profile.png';
  console.log('user image url in nav  :: ', imgurl)
  const pathname = usePathname();
  return (

    <>
      <nav className="fixed top-0 left-0 z-50 w-full flex justify-center font-poppins bg-gray-50">
        <div className={`w-[92%] px-3 lg:px-8 pt-2 lg:h-[70px] h-[60px] flex items-center justify-between`}>
          <div className="flex items-center lg:gap-10">
            <Link href="/dashboard">
              <Image src="/icons/logo2.png" alt="Logo" width={130} height={30} priority className="object-contain" />
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className={`hidden lg:flex items-center gap-2 lg:text-[12px] transition-all ${pathname === "/dashboard" ? "text-gray-900 font-medium" : "text-gray-300"}`}
              >
                <Image
                  src="/icons/Category.png"
                  alt="icon" width={18} height={18}
                  className={pathname === "/dashboard" ? "opacity-100" : "opacity-40"}
                />
                <span className="">Projects</span>
              </Link>

              <Link
                href="/dashboard/bugs?page=1"
                className={`hidden lg:flex items-center gap-2 text-[12px] transition-all ${pathname === "/dashboard/bugs" ? "text-gray-900 font-medium" : "text-gray-300"}`}
              >
                <Image
                  src="/icons/Bag.png"
                  alt="icon" width={18} height={18}
                  className={pathname === "/dashboard/bugs" ? "opacity-100 text-blue" : "opacity-40"}
                />
                <span>Bugs</span>
              </Link>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-between lg:gap-3 gap-2">
              <Link href="/dashboard/profile">
                <div className="flex items-center gap-2 lg:bg-gray-100 px-3 py-1.5 rounded-lg">
                  <img src={imgurl} alt="user" className="rounded-full w-7 h-7" />
                  <span className="text-sm font-medium text-gray-700 hidden lg:flex capitalize">{user.role}</span>
                </div>
              </Link>
              <div className="hidden lg:flex">
                <Logout />
              </div>
            </div>

            <div className="mt-2">
              <Menu className="text-gray-500 lg:hidden" onClick={() => setMenu(true)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`w-64 max-h-screen fixed top-0 right-0 z-50 
    backdrop-blur-3xl h-full bg-gray-50 rounded-tl-md rounded-bl-md 
    transition-transform duration-300 lg:hidden 
    ${menu ? "translate-x-0" : "translate-x-full"}`}>

        <div className="flex justify-between items-center bg-gray-100 px-2 rounded-tl-lg" >
          <div>
            <img src="/icons/logo2.png" alt="" className="w-25 h-15 object-contain" />
          </div>
          <div className="">
            <button onClick={() => setMenu(false)} className="text-gray-700 p-1 rounded-md font-inter font-light">close</button>
          </div>
        </div>

        <div className="flex flex-col space-y-1 mt-6">
          <Link
            href="/dashboard"
            onClick={() => setMenu(false)}
            className={`flex hover:bg-gray-100 bg-gray-50 p-3 rounded-lg items-center gap-2 transition-all ${pathname === "/dashboard" ? "text-gray-900 font-medium" : "text-gray-300"}`}
          >
            <Image
              src="/icons/Category.png"
              alt="icon" width={18} height={18}
              className={pathname === "/dashboard" ? "opacity-100" : "opacity-40"}
            />
            <span className="">Projects</span>
          </Link>

          <Link
            href="/dashboard/bugs"
            onClick={() => setMenu(false)}
            className={`flex hover:bg-gray-100 bg-gray-50 p-3 rounded-lg items-center gap-2 text-[15px] transition-all ${pathname === "/dashboard/bugs" ? "text-gray-900 font-medium" : "text-gray-300"}`}
          >
            <Image
              src="/icons/Bag.png"
              alt="icon" width={18} height={18}
              className={pathname === "/dashboard/bugs" ? "opacity-100" : "opacity-40"}
            />
            <span>Bugs</span>
          </Link>
          <div className="flex items-center w-full px-2 pt-4">
            <Logout />

          </div>
        </div>
      </div>
    </>



  );
}