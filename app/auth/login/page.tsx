"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form'; // Added
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthSrvice } from '@/public/src/apiConfig/authService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LoadingIndicator } from '@/public/src/components/loadingIndicator/loadingIndicator';
export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const inputBase = "peer w-full rounded-md border px-10 py-3 text-sm text-gray-900 outline-none transition-colors focus:bg-gray-50";
    const labelBase = "pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 px-1 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs";
    const iconLeft = "absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70 transition-opacity z-10";
    const eyeButton = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none";
    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await AuthSrvice.login(data);
            router.push('/dashboard');
        } catch (error: any) {
            const err = error?.response?.data?.message || "Invalid credentials";
            toast.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="font-poppins min-h-screen flex flex-col lg:flex-row bg-gray-50">
            <div className="relative w-[460px] hidden lg:block">
                <Image
                    src="/images/pic2.jpg"
                    alt="Workspace"
                    fill
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <Image src="/icons/logo.png" alt="Logo" width={192} height={42} className="absolute bottom-5 left-5 z-index-1" />
            </div>
            <div className="flex-1 flex items-start lg:items-center justify-center pt-20 lg:pt-0">
                <div className="w-full max-w-[500px] lg:max-w-none px-6">
                    <div className="mb-8 lg:ml-40">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
                        <p className="text-gray-400 text-sm">
                            Please enter your login details
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:w-1/2 lg:ml-40">
                        {/*email */}
                        <div className="relative">
                            <Image src="/images/Shape.png" alt="email icon" width={18} height={18} className={iconLeft} />
                            <input
                                {...register("email", { 
                                    required: "Email cannot be empty",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format"
                                    }
                                })}
                                type="email"
                                placeholder=" "
                                className={`${inputBase} ${errors.email ? 'border-red-500 focus:border-red-500 bg-gray-50' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                            />
                            <label className={`${labelBase} ${errors.email ? "top-0 text-xs bg-gray-50 text-red-500" : "bg-gray-100 peer-focus:bg-gray-50"}`}>
                                {errors.email ? errors.email.message : "Email"}
                            </label>
                        </div>
                        {/* Password Field */}
                        <div className="relative">
                            <Image src="/icons/lock.png" alt="lock icon" width={18} height={18} className={iconLeft} />
                            <input
                                {...register("password", { required: "Password cannot be empty" })}
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                className={`${inputBase} ${errors.password ? 'border-red-500 focus:border-red-500 bg-gray-50' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                            />
                            <label className={`${labelBase} ${errors.password ? "top-0 text-xs bg-gray-50 text-red-500" : "bg-gray-100 peer-focus:bg-gray-50"}`}>
                                {errors.password ? errors.password.message : "Password"}
                            </label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButton}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                                    <span>Login</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                        <hr className="border-t mt-10 border-gray-200 my-4" />
                        <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-500">Don't have an account?</p>
                            <Link href="/" className="text-blue-700 font-medium">
                                create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}