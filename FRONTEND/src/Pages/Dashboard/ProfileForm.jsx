/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/prop-types */
import { useUpdateProfile, useUserInfo } from "@/Hooks/useAuth";
import { profileUpdateSchema } from "@/Validator/auth.validator";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// ── Small reusable field wrapper ──────────────────────────────────────────────
function Field({ label, hint, children }) {
    return (
        <div className="mb-4 last:mb-0">
            {label && (
                <label className="block text-[12px] font-medium text-white/42 mb-1.5">
                    {label}
                </label>
            )}
            {children}
            {hint && <p className="text-[11px] text-white/25 mt-1.5">{hint}</p>}
        </div>
    );
}

// ── Input ─────────────────────────────────────────────────────────────────────
function Input({ id, type = "text", value, onChange, placeholder, error, className = "" }) {
    return (
        <input
            id={id}
            type={type}
            disabled={type === "email"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-white/4 border rounded-[10px]
        px-3.5 py-2.75 text-[14px] text-white placeholder-white/20
        outline-none focus:border-emerald-300/40 focus:bg-emerald-300/2
        transition-all duration-200
        ${error ? "border-red-400/50" : "border-white/9"}
        ${className}`}
        />
    );
}

// ── Section card ──────────────────────────────────────────────────────────────
function Section({ icon, title, children }) {
    return (
        <div className="bg-white/3 border border-white/8 rounded-[18px] p-5">
            <p className="flex items-center gap-2 text-[11px] font-medium text-white/30
        tracking-[.08em] uppercase mb-4">
                {icon}
                {title}
            </p>
            {children}
        </div>
    );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const iconProps = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round",
    className: "w-[13px] h-[13px] opacity-50",
};

function UserIcon() { return <svg {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg> }
function PhoneIcon() { return <svg {...iconProps}><path d="M22 16.92v3a2 2 0 01-2.18 2A19.8 19.8 0 013.08 4.18 2 2 0 015.09 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg> }
function CheckIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 6L9 17l-5-5" /></svg> }

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfileForm() {
    const profileUpdateMutation = useUpdateProfile();
    const navigate = useNavigate();
    const { data: user } = useUserInfo()
    const fileRef = useRef();

    // Form state
    const [profileImg, setProfileImg] = useState(null)
    const [image, setImage] = useState(null)
    const [name, setName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [nameError, setNameError] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileImg(user?.profileImage);
            setName(user?.name || "");
            setEmail(user?.email || "");
            setJobTitle(user?.headline || "");
            setLocation(user?.location || "");
            setBio(user?.bio || "");
            setPhone(user?.phone || "");
            setAddress(user?.address || "");
        }
    }, [user])

    // Avatar
    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file)
        const reader = new FileReader();
        reader.onload = (ev) => setProfileImg(ev.target.result);
        reader.readAsDataURL(file);
    };

    // Submit
    const handleSubmit = () => {
        if (!name.trim()) {
            setNameError(true);
            setTimeout(() => setNameError(false), 1500);
            document.getElementById("field-name")?.focus();
            return;
        }

        const validFormData = profileUpdateSchema.safeParse({
            name,
            headline: jobTitle,
            location,
            bio,
            phone,
            email,
            address,
            image,
        });

        if (!validFormData.success) {
            const { message } = JSON.parse(validFormData.error.message)[0];
            console.error(message);
            return;
        }

        const formData = new FormData();

        if (name && name !== user.name) {
            formData.append("name", name);
        }
        if (jobTitle && jobTitle !== user.headline) {
            formData.append("headline", jobTitle);
        }
        if (location && location !== user.location) {
            formData.append("location", location);
        }
        if (bio && bio !== user.bio) {
            formData.append("bio", bio);
        }
        if (phone && phone !== user.phone) {
            formData.append("phone", phone);
        }
        if (address && address !== user.address) {
            formData.append("address", address);
        }
        if (image) {
            formData.append("image", image);
        }

        if (Array.from(formData).length <= 0) {
            toast.error("No data to save !!")
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 800);
            return;
        }
        try {
            profileUpdateMutation.mutate(formData, {
                onSuccess: async () => {
                    toast.success("Profile updated Success");
                    setTimeout(() => {
                        navigate("/dashboard", { replace: true });
                    }, 800);
                }
            })
        } catch (error) {
            toast.error("Profile update error")
            console.error(error.message);
        }
    };

    // Reset
    const handleReset = () => {
        setProfileImg(null); setImage(null);
        setName(""); setJobTitle(""); setLocation(""); setBio("");
        setPhone(""); setAddress("");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-3.5">

                {/* Header */}
                <div>
                    <h1 className="font-extrabold text-[22px] text-white tracking-tight mb-1"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        Your Profile
                    </h1>
                    <p className="text-[13px] text-white/38">
                        Fill in your details and hit save when you&apos;re done.
                    </p>
                </div>

                {/* ── Avatar upload ── */}
                <div className="bg-white/3 border border-white/8 rounded-[18px]
          p-5 flex items-center gap-4">
                    {/* Circle */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="w-17 h-17 rounded-full bg-white/6
              border-2 border-dashed border-white/15 hover:border-emerald-300/40
              flex items-center justify-center text-3xl overflow-hidden
              shrink-0 cursor-pointer transition-colors duration-200"
                    >
                        {profileImg
                            ? <img src={profileImg} alt="avatar" className="w-full h-full object-cover" />
                            : <span>👤</span>
                        }
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />

                    {/* Info */}
                    <div className="flex-1">
                        <p className="text-[14px] font-medium text-white/70 mb-1">Profile photo</p>
                        <p className="text-[12px] text-white/28 leading-relaxed mb-2.5">
                            JPG, PNG or GIF · Max 2MB<br />Click the circle to upload
                        </p>
                        <div className="flex gap-2">
                            <label className="text-[12px] font-medium text-zinc-900 bg-emerald-300
                px-3.5 py-1.5 rounded-[8px] cursor-pointer hover:bg-emerald-200
                transition-colors duration-150">
                                Upload photo
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                            </label>
                            {profileImg && (
                                <button
                                    onClick={() => setProfileImg(null)}
                                    className="text-[12px] font-medium text-white/40 bg-white/5
                    border border-white/10 px-3.5 py-1.5 rounded-[8px]
                    hover:text-white hover:bg-white/9 transition-all duration-200"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Basic Info ── */}
                <Section title="Basic Info" icon={<UserIcon />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <Field label="Display name *">
                            <Input
                                id="field-name"
                                value={name}
                                onChange={setName}
                                placeholder="Piyush Kumar"
                                error={nameError}
                            />
                            {nameError && (
                                <p className="text-[11px] text-red-400 mt-1">Name is required</p>
                            )}
                        </Field>
                        <Field label="Job title">
                            <Input value={jobTitle} onChange={setJobTitle} placeholder="Full Stack Developer" />
                        </Field>
                    </div>

                    <Field label="Location">
                        <Input value={location} onChange={setLocation} placeholder="Delhi, India" />
                    </Field>

                    <Field label="Bio">
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell people a little about yourself..."
                            className="w-full bg-white/4 border border-white/9 rounded-[10px]
                px-3.5 py-3 text-[14px] text-white placeholder-white/20 outline-none
                focus:border-emerald-300/40 focus:bg-emerald-300/2
                transition-all duration-200 resize-none h-20 leading-relaxed"
                        />
                    </Field>

                </Section>

                {/* ── Contact Info ── */}
                <Section title="Contact Info" icon={<PhoneIcon />}>
                    <Field label="Mobile">
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]
                text-white/25 pointer-events-none select-none">
                                +91
                            </span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="123456789"
                                className="w-full bg-white/4 border border-white/9 rounded-[10px]
                  pl-13 pr-3.5 py-2.75 text-[14px] text-white placeholder-white/20
                  outline-none focus:border-emerald-300/40 transition-all duration-200"
                            />
                        </div>
                    </Field>

                    <Field label="Email">
                        <Input type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                    </Field>

                    <Field label="Address">
                        <Input value={address} onChange={setAddress} placeholder="Rohini, Delhi - 110085" />
                    </Field>
                </Section>

                {/* ── Actions ── */}
                <div className="flex gap-2.5 pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[14px] font-medium text-white/50 bg-white/4
              border border-white/9 px-5 py-3.5 rounded-xl
              hover:text-white hover:bg-white/8 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button onClick={handleReset} className="text-[14px] font-medium text-white/50 bg-white/4 border border-white/9 px-5 py-3.5 rounded-xl hover:text-white hover:bg-white/8 transition-all duration-200">
                        Reset Data
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2
              text-[14px] font-medium text-zinc-900 bg-emerald-300
              py-3.5 rounded-xl hover:bg-emerald-200 hover:scale-[1.01]
              transition-all duration-150"
                    >
                        <CheckIcon />
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
}