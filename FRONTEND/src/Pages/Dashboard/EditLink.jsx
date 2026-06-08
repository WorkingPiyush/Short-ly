/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Field from '../../components/Field';
import { IoIosLink } from "react-icons/io";
import { LuClock } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import Input from '../../components/Input';
import Section from '../../components/DestinationSection';
import ToggleRow from '../../components/ToggleRow';
import { UseDeleteUrl, useshortUrl, useUpdateUrl } from '../../Hooks/useUrl';

export default function EditLink() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlMutation = useUpdateUrl();
  const deleteMutation = UseDeleteUrl();

  const params = useParams();
  const { data: short, isLoading } = useshortUrl(params.shortcode);
  const [originalUrl, setOriginalUrl] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState("");
  const shortUrl = `${import.meta.env.VITE_BACKEND_URL}/${location?.pathname.split('/')[3]}`;
  const short_Tag = location?.pathname.split('/')[3];

  useEffect(() => {
    if (short) {
      setOriginalUrl(short?.original_url ?? "");
      setIsActive(short?.isActive ?? "");
      setLiveTime(short?.liveTime ?? "");
      setPasswordProtect(short?.ispaswordprotected ?? "");
    }
    if (short?.expiry_date) {
      setExpirationDate(
        new Date(short.expiry_date).toISOString().split("T")[0]
      );
    }
  }, [short])

  const handleSave = () => {
    const data = { originalUrl, isActive, expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null, liveTime: liveTime ? new Date(liveTime).toISOString() : null, passwordProtect, password, shortCode: short_Tag };
    try {
      urlMutation.mutate(data, {
        onSuccess: async () => {
          toast.success('Url Update Success !!');
          navigate("/dashboard/links", { replace: true });
        }
      })
    } catch (error) {
      toast.error("Server issue !!");
      console.error(error.message);
    }
  }
  const handleDelete = () => {
    try {
      deleteMutation.mutate(short_Tag, {
        onSuccess: () => {
          toast.success('Url Deleted Success !!');
          navigate("/dashboard/links", { replace: true });
        }
      })
    } catch (error) {
      toast.error("Server issue !!");
      console.error(error.message);
    }
  };

  if (isLoading) {
    return <h1>Loading....</h1>
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10">
      <div className="max-w-160 mx-auto">

        {/* Header */}
        <Link
          to="/dashboard/links"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/35 hover:text-white/70 transition-colors duration-200 mb-6">

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to My Links
        </Link>
        <div className='flex justify-center items-center '>
          <div className="inline-flex items-center gap-1.5 bg-emerald-300/8 border
          border-emerald-300/25 rounded-full px-9 py-1.5 text-sm text-emerald-300
          font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            Edit Link
          </div>
        </div>

        <h1 className="font-extrabold text-[26px] tracking-tight text-white mb-1.5"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Edit Short Link
        </h1>
        <p className="text-[14px] text-white/38 mb-6 leading-relaxed">
          Update your link settings — changes apply immediately.
        </p>

        {/* Current short URL pill */}
        <div className="flex items-center gap-3 bg-white/3 border border-white/[0.07]
          rounded-xl px-4 py-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.5)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">Short URL</p>
            <p className="text-[13px] font-medium text-emerald-300 truncate">{shortUrl}</p>
          </div>
        </div>

        {/* ── Section 1: Destination ── */}
        <Section
          title="Destination"
          icon={<IoIosLink size={15} />}>
          <Field
            label="Original URL"
            hint="The destination users are redirected to when they visit your short link.">
            <Input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://your-long-url.com" />
          </Field>
        </Section>

        {/* ── Section 2: Status ── */}
        <Section
          title="Link Status"
          icon={<LuClock size={15} />}>
          <Field
            label="Active status"
            hint="Inactive links return a 404 when visited.">
            <div className="flex gap-2">
              <button
                onClick={() => setIsActive(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                  border text-[13px] font-medium transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-emerald-300/10 border-emerald-300/25 text-emerald-300"
                    : "bg-transparent border-white/8 text-white/35 hover:text-white/60"
                  }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-white/20"}`} />
                Active
              </button>
              <button
                onClick={() => setIsActive(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                  border text-[13px] font-medium transition-all duration-200 cursor-pointer
                  ${!isActive
                    ? "bg-red-400/8 border-red-400/20 text-red-400"
                    : "bg-transparent border-white/8 text-white/35 hover:text-white/60"
                  }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${!isActive ? "bg-red-400" : "bg-white/20"}`} />
                Inactive
              </button>
            </div>
          </Field>
        </Section>

        {/* ── Section 3: Scheduling ── */}
        <Section
          title="Scheduling"
          icon={<MdOutlineDateRange size={15} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Expiration date"
              hint="Link auto-deactivates on this date.">
              <Input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)} />
            </Field>
            <Field
              label="Go live at (liveTime)"
              hint="Schedule when this link becomes active.">
              <Input
                type="datetime-local"
                value={liveTime}
                onChange={(e) => setLiveTime(e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* ── Section 4: Security ── */}
        <Section
          title="Security"
          icon={<MdOutlineSecurity size={15} />}>
          <ToggleRow
            name="Password protection"
            desc="Visitors must enter a password before being redirected."
            checked={passwordProtect}
            onChange={setPasswordProtect} />
          <div className={`overflow-hidden transition-all duration-300
              ${passwordProtect ? "max-h-28 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <Field label="Password">
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set a password for this link"
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <div className="bg-red-400/4 border border-red-400/15 rounded-[18px]
          px-6 py-5 mb-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-[14px] font-medium text-red-400/85 mb-1">Delete this link</h4>
            <p className="text-[12px] text-white/25 leading-relaxed max-w-xs">
              Permanently removes the short link and all associated analytics. This cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="text-[13px] font-medium px-4 py-2.5 rounded-[10px] border transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap bg-red-400/8 border-red-400/20 text-red-400 hover:bg-red-400/15">
            Delete link
          </button>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-2.5">
          <Link
            to="/dashboard/links"
            className="text-[14px] font-medium text-white/50 bg-white/4 border border-white/9
              px-5 py-3.5 rounded-xl hover:text-white hover:bg-white/8
              transition-all duration-200 text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="flex-1 text-[14px] font-medium text-zinc-900 bg-emerald-300
              py-3.5 rounded-xl hover:bg-emerald-200 hover:scale-[1.01]
              transition-all duration-150">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );

}