"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthSrvice } from '@/public/src/apiConfig/authService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LoadingIndicator } from '@/public/src/components/loadingIndicator/loadingIndicator';

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: ''
    });

    const inputBase = "peer w-full rounded-md border border-gray-100 bg-gray-100 px-10 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-gray-50";
    const labelBase = "pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 bg-gray-100 peer-focus:bg-gray-50 px-1 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs";
    const iconLeft = "absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70 transition-opacity z-10";
    const eyeButton = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            await AuthSrvice.login(userCredentials);
            router.push('/dashboard');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Invalid credentials";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    const handleUserCredentials = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserCredentials(prev => ({
            ...prev,
            [name]: value
        }));
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
                <Image src="/icons/logo.png" alt="Workspace" width={192} height={42} className="absolute bottom-5 left-5 z-index-1" />
            </div>

            <div className="flex-1 flex items-start lg:items-center justify-center pt-20 lg:pt-0">
                <div className="w-full max-w-[500px] lg:max-w-none px-6">
                    <div className="mb-8 lg:ml-40">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
                        <p className="text-gray-400 text-sm">
                            Please enter your login details
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 lg:w-1/2 lg:ml-40">
                        <div className="relative">
                            <Image src="/images/Shape.png" alt="email icon" width={18} height={18} className={iconLeft} />
                            <input
                                required
                                value={userCredentials.email}
                                name="email"
                                onChange={handleUserCredentials}
                                type="email"
                                id="email"
                                placeholder=" "
                                className={inputBase}
                            />
                            <label htmlFor="email" className={labelBase}>username or email</label>
                        </div>

                        <div className="relative">
                            <Image src="/icons/lock.png" alt="lock icon" width={18} height={18} className={iconLeft} />
                            <input
                                required
                                value={userCredentials.password}
                                name="password"
                                onChange={handleUserCredentials}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder=" "
                                className={inputBase}
                            />
                            <label htmlFor="password" className={labelBase}>Password</label>
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