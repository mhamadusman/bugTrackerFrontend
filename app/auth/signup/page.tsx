"use client"
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthSrvice } from '@/public/src/apiConfig/authService';
import toast from 'react-hot-toast'; // Import Toaster
import { LoadingIndicator } from '@/public/src/components/loadingIndicator/loadingIndicator';

export default function Signup() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const userRole = searchParams.get('role')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // New Loading State

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        userType: userRole || ''
    })

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        if (userData.password !== userData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true);
        try {
            const response = await AuthSrvice.signup(userData);
            toast.success('Sign-up successful! Login to your account');
            router.push('/auth/login');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Something went wrong";
            toast.error(`Sign-up failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }

    const handleUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
            userType: userRole || ''
        });
    };

    const inputBase = "peer w-full rounded-md border border-gray-100 bg-gray-100 px-10 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-gray-50";
    const labelBase = "pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 bg-gray-100 peer-focus:bg-gray-50 px-1 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs";
    const iconLeft = "absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70 transition-opacity z-10";
    const eyeButton = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none";

    return (
        <div className="font-poppins min-h-screen flex flex-col lg:flex-row bg-gray-50">
            <div className="relative w-[460px] hidden lg:block">
                <Image src="/images/pic2.jpg" alt="Workspace" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <Image src="/icons/logo.png" alt="Workspace" width={192} height={42} className="absolute bottom-5 left-5 z-index-1" />
            </div>

            <div className="flex-1 flex items-start lg:items-center justify-center pt-20 mt-20 lg:mt-0 lg:pt-0">
                <div className="w-full max-w-[500px] lg:max-w-none px-6">
                    <div className="mb-6 lg:mb-8 lg:ml-40">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign Up</h1>
                        <p className="text-gray-400 text-sm mb-10 lg:mb-0">
                            Please fill your information below.
                        </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4 lg:w-1/2 lg:ml-40">
                        
                        {/* name */}
                        <div className="relative">
                            <Image src="/images/profile.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input type="text" name="name" required value={userData.name} onChange={handleUserData} placeholder=" " className={inputBase} />
                            <label className={labelBase}>Name</label>
                        </div>

                        {/* mobile */}
                        <div className="relative">
                            <Image src="/images/solid.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input type="tel" name="phoneNumber" required value={userData.phoneNumber} onChange={handleUserData} placeholder=" " className={inputBase} />
                            <label className={labelBase}>Mobile number</label>
                        </div>

                        {/* email */}
                        <div className="relative">
                            <Image src="/images/Shape.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input type="email" name="email" required value={userData.email} onChange={handleUserData} placeholder=" " className={inputBase} />
                            <label className={labelBase}>E-mail</label>
                        </div>

                        {/* password */}
                        <div className="relative">
                            <Image src="/icons/lock.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                required
                                value={userData.password} 
                                onChange={handleUserData} 
                                placeholder=" " 
                                className={inputBase} 
                            />
                            <label className={labelBase}>Password</label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButton}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* confirm password */}
                        <div className="relative">
                            <Image src="/icons/lock.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword" 
                                required
                                value={userData.confirmPassword} 
                                onChange={handleUserData} 
                                placeholder=" " 
                                className={inputBase} 
                            />
                            <label className={labelBase}>Confirm Password</label>
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={eyeButton}>
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mybtn flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <LoadingIndicator />
                            ) : (
                                <>
                                    <span>Sign Up</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>

                        <hr className="hidden lg:block border-t border-gray-200 my-4" />

                        <div className="flex items-center justify-center lg:justify-between gap-2 mt-10 lg:text-[14px] text-8px">
                            <p className="text-gray-500 whitespace-nowrap">Already have an Account?</p>
                            <div className="h-3 hidden w-[1px] bg-gray-300"></div>
                            <Link href="/auth/login" className="text-blue-700 font-medium whitespace-nowrap">
                                login to your account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}