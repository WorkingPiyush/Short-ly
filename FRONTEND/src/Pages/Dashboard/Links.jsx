/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState } from 'react'
import { useUrl } from '../../Hooks/useUrl.jsx'
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import LinkCard from '../../components/LinkCard.jsx';
import { useUrlFilter } from '../../Context/StatusFilterContext.jsx';
import { searchUrl } from '../../Api/Url.js';
import LinkCardLoader from '@/components/LinkCardLoader.jsx';



function Links() {
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useUrl()
  const loadMoreRef = useRef(null);
  const urlRecords = data?.pages.flatMap(page => page.urls) ?? [];
  const { filter, setFilter } = useUrlFilter();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState()
  const isSearching = search.trim().length > 0;
  const urlResults = isSearching ? searchResults : urlRecords
  const totalClicks = urlRecords?.reduce((s, l) => s + l.totalClicks, 0);
  const activeCount = urlRecords?.filter((l) => l.isActive === "active").length;
  const expiredCount = urlRecords?.filter((l) => l.isActive === "expired").length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // console.log("Intersecting:", entry.isIntersecting);
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          // console.log("Fetching next page...");
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    )
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      observer.disconnect();
    }

  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(async () => {
      const response = await searchUrl(search);
      setSearchResults(response);
    }, 500);
    return () => clearTimeout(timer);
  }, [search])

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "expired", label: "Expired" },
    { key: "SingleUse", label: "Single Use" },
  ];

  return (

    <div className="min-h-screen dark:bg-[#0a0a0a] dark:text-white bg-white text-black px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between md:mb-7 mb-2 flex-wrap gap-3">
          <h1 className="font-extrabold md:text-2xl text-xl md:text-[28px] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }} >
            My Links
          </h1>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-[13px] font-medium text-zinc-900
              bg-emerald-300 md:px-4 md:py-2.5 px-2 py-2 rounded-xl hover:bg-emerald-200
              transition-all duration-150 hover:scale-[1.02]"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-3.5 h-3.5">
              <path d="M8 2v12M2 8h12" />
            </svg>
            Shorten new URL
          </Link>
        </div>
        <div className='h-0.5 w-full bg-gray-400 opacity-20 rounded-xl mt-3 mb-3'></div>
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:mb-7 mb-5 dark:text-white dark:bg-black bg-white">
          {[
            { label: "Total links", value: urlRecords?.length },
            { label: "Total clicks", value: totalClicks },
            { label: "Active links", value: activeCount },
            { label: "Expired", value: expiredCount },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-[#E7DFD3]  bg-linear-to-br  from-[#FFFDF9]  to-[#F8F4EC] dark:from-zinc-900 md:px-5 md:py-4 px-2.5 py-2 shadow-sm  hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 dark:to-zinc-950 dark:border-zinc-800">
              <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-500 mb-2">{label}</p>
              <p className="font-extrabold text-[24px] tracking-tight text-zinc-900 dark:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2.5 mb-6 flex-wrap dark:bg-[#0a0a0a] dark:text-white bg-white/20 text-black">
          {/* Search */}
          <div className="relative md:flex-1 md:min-w-50 w-full">
            <span className='absolute top-2.5 left-3 text-white/20'>
              <IoIosSearch size={22} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links..."
              className="w-full dark:bg-white/4 border dark:border-white/10 border-black/30 rounded-xl
                pl-10 pr-4 py-2.5 text-sm dark:text-white text-black dark:placeholder-white/25 placeholder-zinc-600
                outline-none dark:focus:border-emerald-300/40 focus:border-gray-700/60 transition-colors duration-200"/>
          </div>

          {/* Filter tabs */}
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-[13px] font-medium px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer
                ${filter === key
                  ? "dark:text-emerald-300 text-black dark:border-emerald-300/25 border-gray-700 dark:bg-emerald-300/10 bg-gray-900/10"
                  : "dark:text-white/50 text-gray-500 dark:border-white/10 border-black/10 dark:bg-white/4 dark:hover:text-white hover:text-black dark:hover:border-white/20 hover:border-black"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Links list */}
        {isLoading ? (
          <div className='space-y-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <LinkCardLoader key={i} />
            ))}
          </div>
        ) :
          urlResults?.length ? (
            <div className="flex flex-col gap-3">
              {urlResults.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
              <div ref={loadMoreRef} style={{ height: 20 }}></div>
              {!hasNextPage && (
                <div className="text-center dark:text-white/20 text-black">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12 mx-auto mb-4 opacity-40"
                  >
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                  <p className="text-sm">No more links</p>
                </div>
              )}
            </div>) :
            (
              <div className="text-center py-20 dark:text-white/20 text-black">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 mx-auto mb-4 opacity-40"
                >
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
                <p className="text-sm">{isSearching ? "No urls found" : "No links found"}</p>
              </div>
            )
        }
      </div>
    </div>
  );
}

export default Links
