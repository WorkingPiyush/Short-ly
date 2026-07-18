/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import { Folder, FolderOpen, ArrowLeft, Link2, ExternalLink, Search, Inbox } from "lucide-react";
import { useCategorizedUrl } from "@/Hooks/useUrl";
import { LiaLinkSolid } from "react-icons/lia";
import CategoryLoader from "@/components/CategoryLoader";


function CategoryFolder({ category, count, onOpen }) {
    return (
        <button
            type="button"
            onClick={() => onOpen(category)}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 text-left transition-all cursor-pointer hover:border-[#6ee7b7]/30 hover:bg-white/2 hover:scale-102"
        >
            <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${category.color}1A` }}
            >
                <Folder size={20} style={{ color: category.color }} />
            </div>

            <div className="w-full">
                <p className="truncate text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {category.categoryName}
                </p>
                <p className="mt-1 text-xs text-white/40">
                    {count} link{count === 1 ? "" : "s"}
                </p>
            </div>
        </button>
    );
}


function CategoryLinkRow({ link }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3.5 transition-colors hover:border-white/20">
            <div className="min-w-0 flex-1">
                <a
                    href={link.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 truncate text-sm font-medium text-white/70 hover:text-white"
                >
                    <span className="truncate">{link.original_url}</span>
                    <ExternalLink size={12} className="shrink-0 text-white/30" />
                </a>
                <p className="mt-0.5 truncate text-sm font-semibold text-[#6ee7b7]">
                    {link.short_url}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${link.isActive === "active"
                        ? "bg-[#6ee7b7]/10 text-[#6ee7b7]"
                        : "bg-white/5 text-white/40"
                        }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${link.isActive === "active" ? "bg-[#6ee7b7]" : "bg-white/30"}`}
                    />
                    {link.isActive}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/50">
                    {link.totalClicks} click{link.totalClicks === 1 ? "" : "s"}
                </span>
            </div>
        </div>
    );
}

export default function Category() {
    const { data: category, isLoading } = useCategorizedUrl();
    const [activeCategory, setActiveCategory] = useState(null);
    const [query, setQuery] = useState("");


    const countFor = (categoryId) => category.filter((l) => l.categoryId === categoryId).map((u) => u?.urlCount)[0];


    // Only show categories that actually have at least one link mapped to them
    const filteredCategories = useMemo(
        () =>
            category?.filter((c) =>
                c.categoryName.toLowerCase().includes(query.toLowerCase())
            ),
        [category, query]
    );

    const categoryLinks = useMemo(() =>
        category?.filter((l) => l.categoryId === activeCategory?.categoryId).map((u) => u.url)[0],
        [activeCategory, category]
    )
    return (
        <div
            className="min-h-screen bg-[#0a0a0a] px-6 py-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="mx-auto max-w-4xl">
                {!activeCategory ? (
                    <>
                        {/* Header */}
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1
                                    className="text-2xl font-bold text-white"
                                    style={{ fontFamily: "'Syne', sans-serif" }}>
                                    Categories
                                </h1>
                                <p className="mt-1 text-sm text-white/40">
                                    Browse your links grouped by category.
                                </p>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search
                                    size={15}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                                />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search categories"
                                    className="w-full rounded-xl border border-white/10 bg-black py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#6ee7b7]/50"
                                />
                            </div>
                        </div>
                        {/* Folder grid */}
                        {isLoading ?
                            <CategoryLoader />
                            :
                            filteredCategories?.length ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {filteredCategories?.map((cat) => (
                                        <CategoryFolder
                                            key={cat?.categoryId}
                                            category={cat}
                                            count={countFor(cat?.categoryId)}
                                            onOpen={setActiveCategory}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
                                    <Inbox size={28} className="mb-3 text-white/20" />
                                    <p className="text-sm font-medium text-white/50">
                                        No categories found
                                    </p>
                                    <p className="mt-1 text-xs text-white/30">
                                        Assign a category to a link to see it here.
                                    </p>
                                </div>
                            )}
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => setActiveCategory(null)}
                            className="mb-6 flex items-center cursor-pointer gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
                        >
                            <ArrowLeft size={15} />
                            Back to categories
                        </button>

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${activeCategory.color}1A` }}>
                                <FolderOpen size={20} style={{ color: activeCategory.color }} />
                            </div>
                            <div>
                                <h1
                                    className="text-xl font-bold text-white"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    {activeCategory.categoryName}
                                </h1>

                                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/40">
                                    <Link2 size={11} />
                                    {categoryLinks?.length} link
                                    {categoryLinks?.length === 1 ? "" : "s"} in this category
                                </p>
                            </div>
                        </div>
                        {/* Links list */}
                        <div className="flex flex-col gap-2.5">
                            {categoryLinks.length > 0 ?
                                categoryLinks?.map((link) => (
                                    <CategoryLinkRow key={link.id} link={link} />
                                )) :
                                (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
                                        <LiaLinkSolid size={28} className="mb-3 text-white/20" />
                                        <p className="text-sm font-medium text-white/50">
                                            No Links found
                                        </p>
                                        <p className="mt-1 text-xs text-white/30">
                                            Assign a category to a link to see it here.
                                        </p>
                                    </div>
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}