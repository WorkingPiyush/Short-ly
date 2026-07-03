import React, { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FadeUp from '../../animation/framer-motion';
import { useLogin } from '../../Hooks/useAuth.jsx';
import { loginSchema } from '../../Validator/auth.validator';
import axios from 'axios';
const googleIcon = "/icons8-google.svg";
const githubIcon = "/github-142-svgrepo-com.svg";

function Login() {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { email, password };
        const validFormData = loginSchema.safeParse(formData);
        if (!validFormData.success) {
            const { message } = JSON.parse(validFormData.error.message)[0];
            toast.error(message);
            return;
        }
        setLoading(true);
        try {
            loginMutation.mutate(formData, {
                onSuccess: async () => {
                    toast.success('Login Success');
                    navigate("/dashboard", { replace: true });
                },
                onError: async (error) => {
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            console.log(error.response.data.message)
                            toast.error("Invalid User id or Password");
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen dark:bg-black bg-white flex flex-col items-center justify-center pt-20">
            <FadeUp>
                <div className='w-full flex flex-col items-center gap-3 py-5 md:py-10'>
                    <h1 className='font-bold text-2xl md:text-4xl dark:text-white text-black'>Welcome back buddy !.😄</h1>
                    <div><span className='text-zinc-500 tracking-wider'>Don&apos;t have an account?</span><Link className='p-2 text-emerald-300' to="/signup">Sign up free</Link></div>
                </div>
            </FadeUp>

            <FadeUp>
                <div className="w-full max-w-xl rounded-3xl border border-emerald-500/10 dark:bg-[#0b1110] bg-gray-100  p-10 shadow-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div>
                            <label className="block dark:text-zinc-400 text-black text-sm mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                autoComplete='username'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-zinc-700 
                        dark:bg-zinc-900/80 px-5 py-4 dark:text-white text-black
                         placeholder:text-zinc-400
                         outline-none focus:border-emerald-500/40
                         transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block dark:text-zinc-400 text-black text-sm mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete='current-password'
                                    type={`${showPassword ? "text" : "password"}`}
                                    placeholder="Create a strong password"
                                    className="w-full rounded-xl border border-zinc-700
                                dark:bg-zinc-900/80 px-5 py-4 pr-16 dark:text-white text-black
                                placeholder:text-zinc-400
                                outline-none focus:border-emerald-500/40
                                transition"
                                />

                                {/* Eye button */}
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2
                           h-12 w-12 rounded-xl border border-zinc-700
                           flex items-center justify-center text-zinc-800
                           dark:text-zinc-400 hover:text-black hover:dark:text-white cursor-pointer transition-all delay-150 ease-in"
                                >
                                    {showPassword ? <EyeOff onClick={() => setShowPassword(false)} size={20} /> : <Eye onClick={() => setShowPassword(true)} size={20} />}
                                </button>

                            </div>
                        </div>
                        <div className='p-4'>
                            <button type='submit' disabled={loading} className='py-2 w-full border cursor-pointer dark:text-white dark:border-zinc-400 text-zinc-800 shadow rounded-xl hover:scale-95 transition-all'>Login to Short-ly</button>
                        </div>
                    </form>
                    <div>
                        <div className='flex items-center gap-2'>
                            <span className='h-px flex-1 bg-zinc-800'></span>
                            <span className='text-sm text-zinc-500 font-medium whitespace-nowrap'>or continue with</span>
                            <span className='h-px flex-1 bg-zinc-800'></span>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4 items-center justify-center p-4'>
                        <button className='py-2 px-20 border border-zinc-400 flex gap-2 justify-center items-center text-black dark:text-white shadow rounded-xl cursor-pointer hover:scale-102 transition-all'><img className='h-8 w-8' src={googleIcon} alt="Google" /> Google</button>
                        <button className='py-2 px-20 border border-zinc-400 flex gap-2 justify-center items-center text-black dark:text-white shadow rounded-xl cursor-pointer hover:scale-102 transition-all'><img className='h-8 w-8 bg-white rounded-full' src={githubIcon} alt="github" />GitHub</button>
                    </div>
                </div>
            </FadeUp>

        </div>
    )
}

export default Login

