import React, { useState } from 'react'
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import { Link } from 'react-router-dom';
import PasswordStrength from '../../components/PasswordStrength';
const googleIcon = "/icons8-google.svg";
const githubIcon = "/github-142-svgrepo-com.svg";

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-20">

            <div className='w-full max-w-xl flex flex-col gap-3 py-5 md:py-10'>
                <h1 className='font-bold text-3xl md:text-4xl'>Create your account</h1>
                <div><span className='text-zinc-500 tracking-wider'>Already have one?</span><Link className='p-2 text-emerald-300' to="/login">Log in here</Link></div>
            </div>

            <div className="w-full max-w-xl rounded-3xl border border-emerald-500/10 bg-[#0b1110] p-10 shadow-xl">
                <form className="space-y-6">
                    {/* Name row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First name */}
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                                First name
                            </label>

                            <input
                                type="text"
                                placeholder="Alex"
                                className="w-full rounded-xl border border-zinc-700 
                                        bg-zinc-900/80 px-5 py-4 text-white
                                        placeholder:text-zinc-400
                                        outline-none focus:border-emerald-500/40
                                        transition"/>
                        </div>
                        {/* Last name */}
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                                Last name
                            </label>

                            <input
                                type="text"
                                placeholder="Johnson"
                                className="w-full rounded-xl border border-zinc-700 
                                        bg-zinc-900/80 px-5 py-4 text-white
                                        placeholder:text-zinc-400
                                        outline-none focus:border-emerald-500/40
                                        transition"/>
                        </div>

                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2">
                            Email address
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-zinc-700 
                         bg-zinc-900/80 px-5 py-4 text-white
                         placeholder:text-zinc-400
                         outline-none focus:border-emerald-500/40
                         transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                onChange={handlePasswordChange}
                                type={`${showPassword ? "text" : "password"}`}
                                placeholder="Create a strong password"
                                className="w-full rounded-xl border border-zinc-700 
                           bg-zinc-900/80 px-5 py-4 pr-16 text-white
                           placeholder:text-zinc-400
                           outline-none focus:border-emerald-500/40
                           transition"
                            />

                            {/* Eye button */}
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2
                           h-12 w-12 rounded-xl border border-zinc-700
                           flex items-center justify-center
                           text-zinc-400 hover:text-white transition"
                            >
                                {showPassword ? <EyeOff onClick={() => setShowPassword(false)} size={20} /> : <Eye onClick={() => setShowPassword(true)} size={20} />}
                            </button>

                        </div>
                        <PasswordStrength password={password} />
                    </div>
                </form>
                <div className='p-8'>
                    <button className='py-2 w-full border cursor-pointer border-zinc-400 shadow rounded-xl hover:scale-95 transition-all'>Create free account</button>
                </div>
                <div>
                    <div className='flex items-center gap-2'>
                        <span className='h-px flex-1 bg-zinc-800'></span>
                        <span className='text-sm text-zinc-500 font-medium whitespace-nowrap'>or sign up with</span>
                        <span className='h-px flex-1 bg-zinc-800'></span>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-4 items-center justify-center p-4'>
                    <button className='py-2 px-20 border border-zinc-400 flex gap-2 justify-center items-center shadow rounded-xl cursor-pointer hover:scale-102 transition-all'><img className='h-8 w-8' src={googleIcon} alt="Google" /> Google</button>
                    <button className='py-2 px-20 border border-zinc-400 flex gap-2 justify-center items-center shadow rounded-xl cursor-pointer hover:scale-102 transition-all'><img className='h-8 w-8 bg-white rounded-full' src={githubIcon} alt="github" />GitHub</button>
                </div>
                <div className='text-sm text-center md:flex md:justify-center md:items-center gap-1 p-2 text-zinc-700'>
                    By creating an account you agree to our
                    <span className='text-white cursor-pointer p-0.1'>Terms of Service</span>
                    and
                    <span className='text-white cursor-pointer p-0.1'>Privacy Policy</span>
                    .
                </div>
            </div>
        </div>
    )
}

Signup.PropTypes = {
    password: PropTypes.string,
}
export default Signup

