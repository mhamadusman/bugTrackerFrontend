"use client"
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserService } from '@/public/src/apiConfig/userService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LoadingIndicator } from '@/public/src/components/loadingIndicator/loadingIndicator';
import { profileForm } from '@/public/src/components/types/types';

export default function Profile() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<any>(null);
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, setValue, setError, watch, formState: { errors, isSubmitting } } = useForm<profileForm>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
        }
    });

    const currentName = watch("name");
    const currentEmail = watch("email");

    const getProfileData = async () => {
        try {
            setLoading(true)
            const userData = await UserService.getProfile();
            setValue("name", userData.name);
            setValue("email", userData.email);
            setValue("phoneNumber", userData.phoneNumber);
            setProfileImage(userData.image);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    const getImageValue = () => {
        if (!profileImage) return '/images/Profile.png';
        if (profileImage instanceof File) return URL.createObjectURL(profileImage);
        if (typeof profileImage === "string") {
            return profileImage.startsWith('blob:') || profileImage.startsWith('http')
                ? profileImage : `${profileImage}`;
        }
        return '/images/Profile.png';
    };

    const onFormSubmit = async (data: profileForm) => {
        const formData = new FormData();
        try {
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);

            if (data.password && data.password.trim() !== "") {
                formData.append("password", data.password);
            }

            if (profileImage instanceof File) {
                formData.append("image", profileImage);
            }

            const response = await UserService.updateProfile(formData);
            const existingProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

            const updatedProfile = {
                ...existingProfile,
                name: data.name,
                image:  profileImage,
              
            };

            localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
            toast.success(response.data.message);
            setValue("password", "");
        } catch (error: any) {
            const backendErrors = error?.response?.data?.errors;
            const genericMessage = error?.response?.data?.message || "Something went wrong";

            if (Array.isArray(backendErrors)) {
                backendErrors.forEach((err: { field: string; message: string }) => {
                    setError(err.field as keyof profileForm, {
                        type: "server",
                        message: err.message
                    });
                });
            } else {
                toast.error(genericMessage);
            }
        }
    };

    const inputBase = "peer w-full rounded-md border border-gray-100 bg-gray-100 px-10 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-gray-50";
    const labelBase = "pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 bg-gray-100 peer-focus:bg-gray-50 px-1 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs";
    const iconLeft = "absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70 transition-opacity z-10";
    const eyeButton = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none";

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center ">
                <LoadingIndicator />
            </div>
        )
    }

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
                            onChange={(e) => e.target.files && setProfileImage(e.target.files[0])}
                        />
                        <Image
                            alt='profile'
                            src={getImageValue()}
                            width={96}
                            height={96}
                            onClick={() => fileInputRef.current?.click()}
                            unoptimized={true}
                            className="w-full h-full rounded-full object-cover cursor-pointer border-2 border-gray-200 shadow-sm"
                        />
                    </div>
                    <p className="text-sm font-inter font-medium text-gray-500">{currentName}</p>
                    <p className="text-sm font-inter font-medium text-blue-900">{currentEmail}</p>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col justify-center items-center space-y-3 pb-10">

                    <div className="relative w-full max-w-md flex flex-col">
                        <div className="relative">
                            <Image src="/images/profile.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                placeholder=" "
                                className={`${inputBase} ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            <label className={`${labelBase} ${errors.name ? "text-red-500 peer-focus:text-red-500" : ""}`}>
                                {errors.name ? errors.name.message : "Name"}
                            </label>
                        </div>
                    </div>

                    <div className="relative w-full max-w-md flex flex-col">
                        <div className="relative">
                            <Image src="/images/solid.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type="tel"
                                {...register("phoneNumber", {
                                    required: "Phone number required",
                                    pattern: {
                                        value: /^\+?\d+$/,
                                        message: "Provide valid number"
                                    },


                                })}
                                placeholder=" "
                                className={`${inputBase} ${errors.phoneNumber ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            <label className={`${labelBase} ${errors.phoneNumber ? "text-red-500 peer-focus:text-red-500" : ""}`}>
                                {errors.phoneNumber ? errors.phoneNumber.message : "Mobile number"}
                            </label>
                        </div>
                    </div>

                    <div className="relative w-full max-w-md flex flex-col">
                        <div className="relative">
                            <Image src="/images/Shape.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                placeholder=" "
                                className={`${inputBase} ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            <label className={`${labelBase} ${errors.email ? "text-red-500 peer-focus:text-red-500" : ""}`}>
                                {errors.email ? errors.email.message : "E-mail"}
                            </label>
                        </div>
                    </div>

                    <div className="relative w-full max-w-md flex flex-col">
                        <div className="relative">
                            <Image src="/icons/lock.png" alt="icon" width={18} height={18} className={iconLeft} />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder=" "
                                className={`${inputBase} ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            <label className={`${labelBase} ${errors.password ? "text-red-500 peer-focus:text-red-500" : ""}`}>
                                {errors.password ? errors.password.message : "Change Password"}
                            </label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButton}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between w-sm lg:w-md pt-4 gap-2 lg:gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 py-3 px-6 border border-blue-500 text-blue-600 font-bold rounded-md bg-white hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="flex-1 py-3 px-6 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <LoadingIndicator /> : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}