"use client"
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef } from 'react';
import { profile } from '@/public/src/components/types/types';
import { useEffect } from 'react';
import { UserService } from '@/public/src/apiConfig/userService';
import {  useRouter } from 'next/navigation';
import toast from 'react-hot-toast'
import variables from '../../../public/src/customVariables/custom_variables.json'
export default function Profile() {
    const baseUrl = variables.baseUrl
    const [user, setUser] = useState<profile>({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        image: '',
    });
    const router = useRouter()
    const getImageValue = () => {
        if (!user.image) {
            return '/images/Profile.png';
        }

        if (user.image instanceof File) {
            return URL.createObjectURL(user.image);
        }

        if (typeof user.image === "string") {
            return user.image.startsWith('blob:') || user.image.startsWith('http')
                ? user.image : `${baseUrl}${user.image}`;
        }

        return '/images/Profile.png';
    };
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    const getProfileData = async () => {
        try {
            const userData = await UserService.getProfile();

            setUser({
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                image: userData.image,
                password: userData.password || ''
            });

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load profile");
        }
    };

    useEffect(() => {
        const fetch = () => {
            getProfileData();
        }
        fetch()
    }, []);

    const handleUpdate = async () => {
        const data = new FormData()
        try {
            data.append("name", user.name);
            data.append("email", user.email),
                data.append('phoneNumber', user.phoneNumber)
            if (user.password) {
                data.append('password', user.password)
            }
            if (user.image) {
                data.append('image', user.image)
            }
            await UserService.updateProfile(data)
            toast.success('profile updated...')
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }

    }
    const inputBase = "peer w-full rounded-md border border-gray-100 bg-gray-100 px-10 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-gray-50";
    const labelBase = "pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 bg-gray-100 peer-focus:bg-gray-50 px-1 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs";
    const iconLeft = "absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70 transition-opacity z-10";
    const eyeButton = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none";

    const handleUserData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };


    const imageValue = getImageValue()
    return (
        <div className="bg-gray-50 w-full flex justify-center min-h-screen">
            <div className="w-[92%] max-w-[1200px] lg:px-8 px-0">
                <hr className="text-gray-200 mt-20" />

                <h3 className="font-poppins text-2xl text-gray-800 font-bold lg:mt-5">Profile Settings</h3>

                <div className="flex flex-col justify-center items-center py-6">
                    <div className="w-24 h-24 mb-4">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && setUser({ ...user, image: e.target.files[0] })}
                        />
                        <img
                            alt='profile'
                            src={imageValue}
                            width={15}
                            height={15}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full rounded-full object-cover cursor-pointer"
                        />
                    </div>
                    <p className="text-sm font-inter font-medium text-gray-500">{user.name}</p>
                    <p className="text-sm font-inter font-medium text-blue-900">{user.email}</p>
                </div>


                <div className="flex flex-col justify-center items-center space-y-3  pb-10">


                    <div className="relative w-full max-w-md">
                        <Image src="/images/profile.png" alt="icon" width={18} height={18} className={iconLeft} />
                        <input type="text" required id="name" name="name" value={user.name} onChange={handleUserData} placeholder=" " className={inputBase} />
                        <label htmlFor="name" className={labelBase}>Name</label>

                    </div>


                    <div className="relative w-full max-w-md">

                        <Image src="/images/solid.png" alt="icon" width={18} height={18} className={iconLeft} />
                        <input type="tel" id="mobile" name="phoneNumber" value={user.phoneNumber} onChange={handleUserData} placeholder=" " className={inputBase} />
                        <label htmlFor="mobile" className={labelBase}>Mobile number</label>
                    </div>


                    <div className="relative w-full max-w-md">
                        <Image src="/images/Shape.png" alt="icon" width={18} height={18} className={iconLeft} />
                        <input type="email" id="email" name="email" value={user.email} onChange={handleUserData} placeholder=" " className={inputBase} />
                        <label htmlFor="email" className={labelBase}>E-mail</label>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Image src="/icons/lock.png" alt="icon" width={18} height={18} className={iconLeft} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="Change password" name="password" value={user.password} onChange={handleUserData} placeholder="Change password" className={inputBase}
                        />
                        <label htmlFor="Change password" className={labelBase}>Change Password</label>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButton}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>



                    <div className="flex justify-between w-sm lg:w-md  pt-4 gap-2 lg:gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 py-3 px-6 border border-blue-500 text-blue-600 font-bold rounded-md bg-white hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            type="button"
                            className="flex-1 py-3 px-6 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Confirm
                        </button>


                    </div>
                </div>
            </div>
        </div>
    );
}