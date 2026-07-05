import React, { useState } from 'react'
import toast from 'react-hot-toast';
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrength from '../../components/PasswordStrength';
import FadeUp from '../../animation/framer-motion';
import { useSignup } from '../../Hooks/useAuth.jsx';
import { signupSchema } from '../../Validator/auth.validator';
import axios from 'axios';
const googleIcon = "/icons8-google.svg";
const githubIcon = "/github-142-svgrepo-com.svg";

function Signup() {
    const navigate = useNavigate();
    const signinMutation = useSignup();
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { name, email, password };
        const validFormData = signupSchema.safeParse(formData);
        if (!validFormData.success) {
            const { message } = JSON.parse(validFormData.error.message)[0];
            toast.error("Invalid Email or Password");
            console.log(message);
            return;
        }
        setLoading(true);
        try {
            signinMutation.mutate(formData, {
                onSuccess: async () => {
                    toast.success('Signup Success');
                    navigate("/dashboard", { replace: true });
                },
                onError: async (error) => {
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            toast.error("Invalid Email or Password");
                            console.log(error.response.data.message)
                        }
                    }
                }
            })
        } catch (error) {
            toast.error("Invalid User id or Password");
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 via-white to-emerald-50 dark:from-[#050505] dark:via-[#0b0b0b] dark:to-[#07110d] px-6 py-20">
            <FadeUp>
                <div className='w-full max-w-xl flex flex-col items-center gap-3 py-5 md:py-10'>
                    <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white'>Create your account</h1>
                    <div><span className='tracking-wider dark:text-zinc-500 text-black'>Already have one?</span><Link className='p-2 text-emerald-300' to="/login">Log in here</Link></div>
                </div>
            </FadeUp>

            <FadeUp>
                <div className="w-full max-w-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-emerald-500/10 p-10 ">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name row */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Full name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Alex"
                                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-5 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15" />
                            </div>
                        </div>

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
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-5 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15" />
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
                                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-5 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15" />

                                {/* Eye button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2
                           h-12 w-12 rounded-xl border border-zinc-700
                           flex items-center justify-center text-zinc-800
                           dark:text-zinc-400 hover:text-black hover:dark:text-white cursor-pointer transition-all delay-150 ease-in"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>

                            </div>
                            <PasswordStrength password={password} />
                        </div>
                        <div className='p-8'>
                            <button disabled={loading} type='submit' className="w-full rounded-xl cursor-pointer bg-emerald-500 py-3.5 font-semibold text-white hover:bg-emerald-600 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ">Create free account</button>
                        </div>
                    </form>
                    <div>
                        <div className='flex items-center gap-2'>
                            <span className='h-px flex-1 bg-zinc-800'></span>
                            <span className='text-sm text-zinc-500 font-medium whitespace-nowrap'>or sign up with</span>
                            <span className='h-px flex-1 bg-zinc-800'></span>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4 items-center justify-center p-4'>
                        <button className='py-2 px-20 border border-zinc-400 flex gap-2 justify-center items-center text-black dark:text-white shadow rounded-xl cursor-pointer hover:scale-102 transition-all'><img className='h-8 w-8' src={googleIcon} alt="Google" /> Google</button>
                        <button className='py-2 px-20 border border-zinc-400 flex gap-2 justify-center items-center text-black dark:text-white shadow rounded-xl cursor-pointer hover:scale-102 transition-all'><img className='h-8 w-8 bg-white rounded-full' src={githubIcon} alt="github" />GitHub</button>
                    </div>
                    <div className='text-xs text-center md:flex md:justify-center md:items-center gap-1 p-2 dark:text-zinc-700 text-black'>
                        By creating an account you agree to our
                        <span className='dark:text-white text-gray-400 cursor-pointer p-0.1'>Terms of Service</span>
                        and
                        <span className='dark:text-white text-gray-400 cursor-pointer p-0.1'>Privacy Policy</span>
                        .
                    </div>
                </div>
            </FadeUp>

        </div>
    )
}

Signup.PropTypes = {
    password: PropTypes.string,
}
export default Signup

