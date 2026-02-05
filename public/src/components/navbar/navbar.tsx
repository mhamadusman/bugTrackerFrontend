"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "../../apiConfig/api";
import { profile } from "../types/types";
import { baseUrl } from "../../apiConfig/api";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";
import Logout from "../logout/logout";
export default function Navbar() {

  const [menu, setMenu] = useState<boolean>(false)
  type img = string | null
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: '',
    image: '' as img
  })

  const getProfile = async () => {
    try {

      const response = await api.get('/users/me')
      const user = response.data.user
      setUser({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        phoneNumber: user.phoneNumber,
        image: user?.image
      })

    } catch (error: any) {
      toast.error(`error in getting profile ${error.response.message}`)
    }
  }

  useEffect(() => {
    const fetch = () => {
      getProfile()

    }
    fetch()
  }, [])
 const imgurl = user.image ? `${baseUrl}${user.image}` : '/images/Profile.png';

console.log('image url in nav bar ::', imgurl);
  const pathname = usePathname();

  return (

    <>
      <nav className="fixed top-0 left-0 z-50 w-full flex justify-center  font-poppins bg-gray-50  ">
        <div className={`w-[92%]  px-3 lg:px-8  pt-2 lg:h-[70px] h-[60px] flex items-center justify-between`}>
          <div className="flex items-center  lg:gap-10">
            <Link href="/dashboard">
              <Image src="/icons/logo2.png" alt="Logo" width={130} height={30} priority className="object-contain" />
            </Link>
            <div className="flex items-center gap-8">

              <Link
                href="/dashboard"
                className={`flex hidden lg:flex items-center gap-2  lg:text-[12px] transition-all ${pathname === "/dashboard" ? "text-gray-900 font-medium" : "text-gray-300"
                  }`}
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
                className={`flex  hidden lg:flex items-center gap-2 text-[12px] transition-all ${pathname === "/dashboard/bugs" ? "text-gray-900 font-medium" : "text-gray-300"
                  }`}
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
          <div className="flex justify-between ">
            <div className="flex items-center justify-between lg:gap-3 gap-2">
              <Image src="/icons/Notification.png" alt="bell" width={20} height={20} className="opacity-60" />
              <Link href="/auth/me">
                <div className="flex items-center gap-2 lg:bg-gray-100  px-3 py-1.5 rounded-lg">
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

      <div className={`w-64 max-h-screen fixed top-0 right-0 z-50 
        backdrop-blur-3xl h-full bg-gray-50 rounded-tl-md rounded-bl-md 
        transition-transform duration-300 lg:hidden 
        ${menu ? "translate-x-0" : "translate-x-full"}`}>

        <div className="flex justify-between items-center bg-gray-100 px-2 rounded-tl-lg" >
          <div>
            <img src="/icons/logo2.png" alt="" className="w-25 h-15 object-contain" />
          </div>
          <div className="">
            <button onClick={() => setMenu(false)} className=" text-gray-700 p-1 rounded-md  font-inter font-light  ">close</button>
          </div>
        </div>
        <div className="flex-col items-center space-y-1 mt-6">

          <Link
            href="/dashboard"
            className={`flex hover:bg-gray-100 bg-gray-50 p-3 rounded-lg  items-center gap-2 transition-all ${pathname === "/dashboard" ? "text-gray-900 font-medium" : "text-gray-300"
              }`}
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
            className={`flex hover:bg-gray-100 bg-gray-50 p-3 rounded-lg    items-center gap-2 text-[15px] transition-all ${pathname === "/dashboard/bugs" ? "text-gray-900 font-medium" : "text-gray-300"
              }`}
          >
            <Image
              src="/icons/Bag.png"
              alt="icon" width={18} height={18}
              className={pathname === "/dashboard/bugs" ? "opacity-100" : "opacity-40"}
            />
            <span>Bugs</span>
          </Link>
          <div className="flex items-center  w-full px-2 ">
            <span>

            </span>
            <Logout />
          </div>
        </div>
      </div>

    </>



  );
}