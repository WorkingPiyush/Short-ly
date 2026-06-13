/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { useUrl } from '../../Hooks/useUrl.jsx'
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import LinkCard from '../../components/LinkCard.jsx';
import { useUrlFilter } from '../../Context/StatusFilterContext.jsx';
import { searchUrl } from '../../Api/Url.js';
import ShareModal from '../../components/ShareLink.jsx';



function Links() {
  const { data: url, isLoading } = useUrl()
  const [urlRecords, setUrlRecords] = useState()
  const { filter, setFilter } = useUrlFilter();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState()
  const isSearching = search.trim().length > 0;
  const urlResults = isSearching ? searchResults : urlRecords
  const totalClicks = urlRecords?.reduce((s, l) => s + l.totalClicks, 0);
  const activeCount = urlRecords?.filter((l) => l.isActive === "active").length;
  const expiredCount = urlRecords?.filter((l) => l.isActive === "expired").length;

  useEffect(() => {
    if (url) {
      setUrlRecords(url);
    }
  }, [url]);
  useEffect(() => {
    if (!search.trim()) return;

    const timer = setTimeout(async () => {
      const response = await searchUrl(search);
      setSearchResults(response);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, url])

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "expired", label: "Expired" },
    { key: "SingleUse", label: "Single Use" },
  ];

  if (isLoading) {
    return <h1>Loading...</h1>
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <h1 className="font-extrabold text-2xl md:text-[28px] tracking-tight text-white"
            style={{ fontFamily: "'Syne', sans-serif" }} >
            My Links
          </h1>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-[13px] font-medium text-zinc-900
              bg-emerald-300 px-4 py-2.5 rounded-xl hover:bg-emerald-200
              transition-all duration-150 hover:scale-[1.02]"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-3.5 h-3.5">
              <path d="M8 2v12M2 8h12" />
            </svg>
            Shorten new URL
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Total links", value: urlRecords?.length },
            { label: "Total clicks", value: totalClicks },
            { label: "Active links", value: activeCount },
            { label: "Expired", value: expiredCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/3 border border-white/[0.07] rounded-xl px-4 py-3.5"
            >
              <p className="text-[11px] text-white/35 mb-1.5 tracking-wide uppercase">{label}</p>
              <p
                className="font-extrabold text-[22px] text-white tracking-tight leading-none"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2.5 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-50 ">
            <span className='absolute top-2.5 left-3 text-white/20'>
              <IoIosSearch size={22} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links..."
              className="w-full bg-white/4 border border-white/10 rounded-xl
                pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25
                outline-none focus:border-emerald-300/40 transition-colors duration-200"/>
          </div>

          {/* Filter tabs */}
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-[13px] font-medium px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer
                ${filter === key
                  ? "text-emerald-300 border-emerald-300/25 bg-emerald-300/10"
                  : "text-white/50 border-white/10 bg-white/4 hover:text-white hover:border-white/20"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Links list */}
        {urlResults?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {urlResults.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>) :
          (
            <div className="text-center py-20 text-white/20">
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
