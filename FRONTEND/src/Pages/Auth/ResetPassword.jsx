import { useState } from "react";
import { Lock, Eye, EyeOff, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updatePassword } from "@/Api/Auth";
import { passwordSchema } from "@/Validator/auth.validator";

export default function ResetPassword() {
    const navigate = useNavigate()
    const params = useParams()
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        const token = params.token;
        if (password !== confirmPassword) {
            toast.error("Both Passwords are diffrent !!")
            return
        }
        const passwordSafe = passwordSchema.safeParse(password);
        if (!passwordSafe.success) {
            const { message } = JSON.parse(passwordSafe.error.message)[0];
            toast.error(message)
            return;
        };
        try {
            setLoading(true);
            const data = await updatePassword({ token, password: passwordSafe.data });
            if (data.success) {
                toast.success(data.message);
                navigate('/')
            }
        } catch (error) {
            toast.error("Server Problem")
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-xl rounded-3xl border border-[#2b2b2b] bg-[#141414] p-6 sm:p-10 shadow-xl">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="h-15 w-15 rounded-full border border-[#313131] bg-[#1c1c1c] flex items-center justify-center">
                        <RefreshCcw className="text-[#56F2C4]" size={40} />
                    </div>
                </div>
                {/* Heading */}
                <div className="text-center mt-3">
                    <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="font-extrabold text-3xl text-white tracking-tight mb-1">
                        Reset Password
                    </h1>
                    <p className="text-gray-400 mt-3 text-sm sm:text-sm">
                        Enter your new password below to update your account password.
                    </p>
                </div>
                {/* Form */}
                <form onSubmit={handlePasswordChange} aria-disabled={loading} className="mt-10 space-y-5">
                    {/* Password */}
                    <div>
                        <label className="block text-white mb-3 font-medium">
                            New Password
                        </label>
                        <div className="flex items-center border border-[#2dd4bf] rounded-xl bg-[#111111] px-4 h-12">
                            <Lock className="text-[#56F2C4]" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="flex-1 bg-transparent outline-none px-4 text-white placeholder:text-gray-500"
                            />

                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="text-gray-400" size={28} />
                                ) : (
                                    <Eye className="text-gray-400" size={28} />
                                )}
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                            Password must be at least 8 characters long.
                        </p>
                    </div>
                    {/* Confirm Password */}
                    <div>
                        <label className="block text-white mb-3 font-medium">
                            Confirm Password
                        </label>

                        <div className="flex items-center border border-[#2dd4bf] rounded-xl bg-[#111111] px-4 h-14">

                            <Lock className="text-[#56F2C4]" size={20} />

                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="flex-1 bg-transparent outline-none px-4 text-white placeholder:text-gray-500"
                            />

                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? (
                                    <EyeOff className="text-gray-400" size={28} />
                                ) : (
                                    <Eye className="text-gray-400" size={28} />
                                )}
                            </button>
                        </div>
                    </div>
                    {/* Button */}
                    <button disabled={loading} className="w-full h-14 rounded-xl cursor-pointer font-semibold text-lg bg-linear-to-r from-emerald-500/10 to-emerald-400/5 text-white border border-emerald-400/20 active:scale-101 hover:opacity-90 transition">
                        Reset Password
                    </button>
                </form>

            </div>
        </div>
    );
}