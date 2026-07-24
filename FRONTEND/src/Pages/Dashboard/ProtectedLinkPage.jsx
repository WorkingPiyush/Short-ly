import React, { useState } from "react";
import { Lock, Eye, EyeClosed, Link as LinkIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { getProtectedUrl } from "@/Api/Url";
import toast from "react-hot-toast";

function ProtectedLinkPage() {
    const params = useParams();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const url = `${import.meta.env.VITE_BACKEND_URL}/${params.shortCode}`;
    const handleProtectedUrl = async () => {
        try {
            setLoading(true);
            const res = await getProtectedUrl(params.shortCode, { password: password });
            window.location.href = res.originalUrl;
        } catch (error) {
            toast.error('Invalid Password');
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-2 text-white relative overflow-hidden">
            <div className="absolute w-125 h-125 bg-emerald-500/10 blur-[140px] rounded-full" />

            {/* Lock Icon */}
            <div className="relative mb-8">
                <div className="w-20 h-20 md:w-26 md:h-26 rounded-full border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                    <Lock size={50} className="text-emerald-400" strokeWidth={1.5} />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3.5 text-center">
                Protected Link
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 mb-8 md:mb-10  text-center text-sm md:text-xl max-w-xl leading-relaxed">
                This link is password protected. Enter the password below to continue.
            </p>

            {/* Redirect Box */}
            <div className="w-xs md:w-full max-w-xl mb-8 md:mb-10 cursor-pointer">
                <div className="h-16 rounded-full border border-white/10 bg-white/3 backdrop-blur-md px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        <span className="truncate">
                            Redirecting to: {" "} {url}
                        </span>
                    </div>
                    <LinkIcon size={20} className="text-gray-500" />
                </div>
            </div>

            {/* Password Card */}
            <div className="w-xs md:w-full max-w-xl overflow-auto rounded-[32px] border border-white/10 bg-white/2 backdrop-blur-lg p-6">
                <label className="block text-gray-400  mb-4"> Enter password</label>
                <div className="flex relative items-center justify-between border border-white/15 rounded-xl bg-white/4">
                    <input type={showPassword ? "text" : "password"} placeholder={showPassword ? "Password" : "********"} value={password} onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-2 outline-none placeholder:text-gray-500"
                    />

                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-0 w-14 h-10 border-l border-white/10 flex items-center justify-center hover:bg-white/5 transition cursor-pointer">
                        {showPassword ? <EyeClosed size={28} /> : <Eye size={28} />}
                    </button>
                </div>

                <button onClick={handleProtectedUrl} disabled={loading} className="mt-10 w-full h-15 rounded-xl border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-3 text-xl font-medium text-gray-300 cursor-pointer active:scale-102">
                    <Lock size={20} /> Unlock Link
                </button>
            </div>
            {/* Footer */}
            <div className="mt-10 text-gray-500 text-sm">
                Protected by Short-ly ·{" "}
                <button className="hover:text-gray-300">
                    Report abuse
                </button>
            </div>
        </div>
    );
}
export default ProtectedLinkPage;