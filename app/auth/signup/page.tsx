"use client"
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthSrvice } from '@/public/src/apiConfig/authService';
import toast from 'react-hot-toast';
import { LoadingIndicator } from '@/public/src/components/loadingIndicator/loadingIndicator';
import { useForm } from 'react-hook-form';

type FormData = {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
};

export default function Signup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userRole = searchParams.get('role');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: FormData) => {

        setLoading(true);
        try {
            await AuthSrvice.signup({ ...data, userType: userRole || '' });
            toast.success('Sign-up successful! Login to your account');
            router.push('/auth/login');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Something went wrong";
            toast.error(`Sign-up failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "peer w-full rounded-md border px-10 py-3 text-sm text-gray-900 outline-none transition-colors  focus:bg-gray-50";
    const labelBase = "pointer-events-none absolute z-50 w-auto left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 peer-focus:bg-gray-50 px-1 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs";
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:w-1/2 lg:ml-40">

                        {/* name */}
                        <div className="relative">
                            <Image src="/images/profile.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type="text"
                                placeholder=" "
                                className={`${inputBase} ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                                {...register("name", { required: "Name is required" })}
                            />
                            <label className={`${labelBase} ${errors.name ? "top-0 text-xs bg-gray-50 px-1 text-red-500" : ""}`}>
                                {errors.name ? errors.name.message : "Enter Name"}
                            </label>
                        </div>

                        {/* mobile */}
                        <div className="relative">
                            <Image src="/images/solid.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type="tel"
                                placeholder=" "
                                className={`${inputBase} ${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                                {...register("phoneNumber", {
                                    required: "Mobile number is required",
                                    pattern: { value: /^\d{11}$/, message: "Must be exactly 11 digits" }
                                })}
                            />
                            <label className={`${labelBase} ${errors.phoneNumber ? "top-0 text-xs bg-gray-50 px-1 text-red-500" : ""}`}>
                                {errors.phoneNumber ? errors.phoneNumber.message : "Phone Number"}
                            </label>
                        </div>

                        {/* email */}
                        <div className="relative">
                            <Image src="/images/Shape.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type="text"
                                placeholder=" "
                                className={`${inputBase} ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
                                })}
                            />
                            <label className={`${labelBase} ${errors.email ? "top-0 text-xs bg-gray-50 px-1 text-red-500" : ""}`}>
                                {errors.email ? errors.email.message : "Email"}
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Image src="/icons/lock.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                className={`${inputBase} ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password cannot be less than 8 characters"
                                    }
                                })}
                            />
                            <label className={`${labelBase} ${errors.password ? "top-0 text-xs bg-gray-50 px-1 text-red-500" : ""}`}>
                                {errors.password ? errors.password.message : "Password"}
                            </label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButton}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Image src="/icons/lock.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder=" "
                                className={`${inputBase} ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 bg-gray-100'}`}
                                {...register("confirmPassword", {
                                    required: 'Confirm your password',
                                    validate: value => value === watch("password") || "Passwords must match"
                                })}
                            />
                            <label className={`${labelBase} ${errors.confirmPassword ? "top-0 text-xs bg-gray-50 px-1 text-red-500" : ""}`}>
                                {errors.confirmPassword ? errors.confirmPassword.message : "Confirm your password"}
                            </label>
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={eyeButton}>
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mybtn flex items-center justify-center gap-2"
                        >
                            {loading ? <LoadingIndicator /> : (
                                <>
                                    <span>Sign Up</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>

                        <hr className="hidden lg:block border-t border-gray-200 my-4" />

                        <div className="flex items-center justify-center lg:justify-between gap-2 mt-10 lg:text-[14px] text-8px">
                            <p className="text-gray-500 whitespace-nowrap">Already have an Account?</p>
                            <Link href="/auth/login" className="text-blue-700 font-medium whitespace-nowrap">
                                login to your account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
