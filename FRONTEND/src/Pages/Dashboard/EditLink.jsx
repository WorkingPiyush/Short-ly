/* eslint-disable react/prop-types */
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
import { Check, Plus, Tags } from 'lucide-react';

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
      <div className="mb-5 flex items-center gap-2 text-white/50">
        <Icon size={15} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------- Category section: create + single-select ---------- */
function CategorySection({ categories, selectedId, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const submitNewCategory = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setNewName("");
    setCreating(false);
  };

  return (
    <SectionCard icon={Tags} title="Category">
      <p className="mb-3 text-sm font-medium text-white/80 bg-black">Assign category</p>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(isSelected ? null : cat.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${isSelected
                ? "border-[#6ee7b7]/40 bg-linear-to-r from-[#6ee7b7]/15 to-transparent text-[#6ee7b7]"
                : "border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white/80"
                }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
              {isSelected && <Check size={14} className="shrink-0" />}
            </button>
          );
        })}

        {/* New category control */}
        {creating ? (
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNewCategory()}
              placeholder="Category name"
              className="w-32 bg-transparent px-1 text-sm text-white placeholder-white/30 outline-none"
            />
            <button
              type="button"
              onClick={submitNewCategory}
              className="shrink-0 rounded-lg bg-[#6ee7b7] px-2.5 py-1 text-xs font-semibold text-black transition-opacity hover:opacity-90"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setNewName("");
              }}
              className="shrink-0 px-1.5 text-xs text-white/40 hover:text-white/70"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:border-[#6ee7b7]/40 hover:text-[#6ee7b7]"
          >
            <Plus size={14} />
            New category
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-white/35">
        Pick one category to group this link under. Selecting another replaces it.
      </p>
    </SectionCard>
  );
}

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
  const formatTimeClock = (time) => {
    const date = new Date(time);
    const offSet = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offSet * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const DEFAULT_CATEGORIES = [
    { id: "cricket", name: "Cricket", color: "#6ee7b7" },
    { id: "work", name: "Work", color: "#93c5fd" },
    { id: "personal", name: "Personal", color: "#fca5a5" },
    { id: "campaigns", name: "Campaigns", color: "#fcd34d" },
  ];


  // 
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState("cricket");

  const createCategory = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const palette = ["#6ee7b7", "#93c5fd", "#fca5a5", "#fcd34d", "#c4b5fd"];
    const color = palette[categories.length % palette.length];
    const newCat = { id, name, color };
    setCategories((prev) => [...prev, newCat]);
    setSelectedCategoryId(id);
  };
  // 

  useEffect(() => {
    if (short) {
      setOriginalUrl(short?.original_url ?? "");
      setIsActive(short?.isActive ?? "");
      setLiveTime(formatTimeClock(short?.liveTime) ?? "");
      setPasswordProtect(short?.ispaswordprotected ?? "");
    }
    if (short?.expiry_date) {
      setExpirationDate(
        new Date(short.expiry_date).toISOString().split("T")[0]
      );
    }
  }, [short])

  const handleSave = () => {
    const data = {
      originalUrl: originalUrl !== short?.original_url ? originalUrl : null,
      isActive: isActive !== short?.isActive ? isActive : null,
      expirationDate: new Date(expirationDate).toISOString() !== short?.expiry_date ? new Date(expirationDate).toISOString() : null,
      liveTime: liveTime ? new Date(liveTime).toISOString() : null,
      password, shortCode: short_Tag
    };
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
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 bg-linear-to-br from-zinc-50 via-white to-emerald-50 dark:from-[#090909] dark:via-[#0b0b0b] dark:to-[#07110d] text-zinc-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-2">

        {/* Header */}
        <Link
          to="/dashboard/links"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-white transition duration-200 mb-6">

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to My Links
        </Link>
        <div className='flex justify-center items-center '>
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-full px-4 py-1 text-sm font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            Edit Link
          </div>
        </div>

        <h1 className="font-extrabold text-[26px] tracking-tight text-zinc-900 dark:text-white mb-1.5"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Edit Short Link
        </h1>
        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          Update your link settings — changes apply immediately.
        </p>

        {/* Current short URL pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl  px-4 py-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.5)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-0.5">Short URL</p>
            <p className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400 truncate">{shortUrl}</p>
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

        <CategorySection
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onCreate={createCategory}
        />

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
                  border text-sm font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md
                  ${isActive
                    ? "bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/5 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "bg-[#FFF9F2] dark:bg-zinc-900/40 border-[#E8DDD0] dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:bg-[#F8F0E6] dark:hover:bg-zinc-800 hover:border-[#D9C9B6] dark:hover:border-zinc-600"
                  }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-white/20"}`} />
                Active
              </button>
              <button
                onClick={() => setIsActive(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                  border text-sm font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm
                  ${!isActive
                    ? "bg-linear-to-r from-red-50 to-red-100 dark:from-red-500/10 dark:to-red-500/5 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 shadow-sm"
                    : "bg-[#FFF9F2] dark:bg-zinc-900/40 border-[#E8DDD0] dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:bg-[#F8F0E6] dark:hover:bg-zinc-800 hover:border-[#D9C9B6] dark:hover:border-zinc-600"
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
        <div className="bg-red-500/20 dark:bg-red-500/5 border border-red-200 dark:border-red-500/2 rounded-[18px] px-6 py-5 mb-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-[14px] font-medium dark:text-red-400/85 text-red-600 mb-1">Delete this link</h4>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">
              Permanently removes the short link and all associated analytics. This cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="text-[13px] font-medium px-4 py-2.5 rounded-[10px] border transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap bg-red-400/8 dark:border-red-400/20 border-red-400/50 dark:text-red-400 text-red-600 hover:bg-red-400/15">
            Delete link
          </button>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-2.5">
          <Link
            to="/dashboard/links"
            className=" px-5 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300 text-[14px] font-medium
              transition-all duration-200 text-center">
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl cursor-pointer bg-emerald-500 text-white font-semibold py-3.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 text-[14px] active:scale-99 transition-all duration-150">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );

}