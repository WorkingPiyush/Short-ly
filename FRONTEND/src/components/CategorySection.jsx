/* eslint-disable react/prop-types */
import { Check, Plus, Tags } from 'lucide-react';
import React, { useState } from 'react'

function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#FFFCF7] dark:bg-zinc-900/60 p-6">
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
            <p className="mb-3 text-sm font-medium text-white/80">Assign category</p>
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
                            className={`flex items-center cursor-pointer gap-2 rounded-xl border px-3 py-2.5 font-medium hover:scale-101 transition-all 
                                ${isSelected
                                    ? "border-[#6ee7b7]/40 bg-linear-to-r from-[#6ee7b7]/15 to-transparent text-[#6ee7b7]"
                                    : "border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white/80"
                                }`}>
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className={`${isSelected ? "text-sm" : 'text-xs'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{cat.name}</span>
                            {isSelected && <Check size={14} className="shrink-0" />}
                        </button>
                    );
                })}

                {/* New category control */}
                {creating ? (
                    <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 px-2 py-1.5">
                        <input
                            type='text'
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
                            className="shrink-0 rounded-lg bg-[#6ee7b7] px-2.5 py-1 text-xs font-semibold text-black transition-opacity hover:opacity-90">
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
                Pick one category to group this link under.
                Selecting another replaces it.
            </p>
        </SectionCard>
    );
}

export default CategorySection;
