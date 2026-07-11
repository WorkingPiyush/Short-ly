/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { Plus, X, } from "lucide-react";



export function TagMenu({ onClose, tags, onCreateTags, remove }) {
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
        };
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    const submitNewTags = () => {
        const trimmed = newName.trim().toLowerCase();
        if (!trimmed) return;
        onCreateTags(trimmed);
        setNewName("");
        setCreating(false);
    };

    return (
        <div ref={menuRef} role="menu" className="absolute right-0 top-9 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#010000] shadow-2xl shadow-black/50 z-50"
            style={{ fontFamily: "'DM Sans', sans-serif" }} >
            <div className="border-b border-white/5 px-3.5 py-2.5">
                <p className="text-[11px] text-center font-medium uppercase tracking-wider text-white/40">
                    Your Tags
                </p>
            </div>

            <div className="max-h-48 overflow-y-auto py-1 z-1000">
                {tags?.map((cat) => {
                    return (
                        <button
                            key={cat.id}
                            role="menuitemcheckbox"
                            className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/6 focus:outline-none focus-visible:bg-white/6"
                        >
                            <span className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="flex-1 truncate">{cat.name}</span>
                            <X onClick={() => remove(cat.id)} size={22} />
                        </button>
                    );
                })}
            </div>

            <div className="border-t border-white/5 p-1.5">
                {creating ? (
                    <div className="flex items-center gap-1.5 px-1.5 py-1">
                        <input
                            autoFocus
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitNewTags()}
                            placeholder="Category name"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#6ee7b7]/50"
                        />
                        <button onClick={submitNewTags} className="shrink-0 rounded-lg bg-[#6ee7b7] px-2.5 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
                        >Add
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setCreating(true)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-[#6ee7b7] transition-colors hover:bg-[#6ee7b7]/10"
                    >
                        <Plus size={15} />
                        New Tag
                    </button>
                )}
            </div>
        </div>
    );
}