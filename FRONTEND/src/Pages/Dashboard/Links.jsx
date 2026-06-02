import React, { useState } from 'react'
import { useUser } from '../../Hooks/useUrl.jsx'
import { MdContentCopy } from "react-icons/md";
import { PiCursorClick } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";
import { FaShareAlt } from "react-icons/fa";
import { SiGoogleanalytics } from "react-icons/si";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Links() {
  const navigate = useNavigate();
  const { data: urlRecords, isLoading } = useUser()
  const [search, setSearch] = useState("");

  const formatedDate = (date) => {
    return date.toLocaleString("en-In", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };
  const formatedLink = (link) => {
    const url = new URL(link);
    return `${url.hostname}${url.pathname.split("/")[1] ? "/" + url.pathname.split("/")[1] : ""}`;
  };
  const linkCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link Copied !!")
  };
  const destination = (url) => {
    return url.split("/")[3];
  };
  if (isLoading) {
    return "Loading.."
  }

  return (
    <div className="min-h-screen max-w-6xl ml-auto text-black dark:text-white rounded-md dark:bg-black p-5">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Links</h1>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search links..." className="w-full max-w-md border rounded-lg px-3 py-2 mb-6" />

      <div className="space-y-4">
        {urlRecords.map((link) => (
          <div key={link.short_url} className="bg-zinc-800 p-5 rounded-lg shadow truncate shadow-white flex justify-between cursor-pointer hover:scale-101 transition-all" >
            {/* left */}
            <div>
              <Link target='_blank' to={link.original_url} className="text-white text-xl font-bold">{formatedLink(link.original_url)}</Link>
              <br />
              <div className='flex gap-2 '>
                <Link target='_blank' to={link.short_url} className="text-sm text-blue-600">{link.short_url}</Link>
                <MdContentCopy onClick={() => linkCopy(link.short_url)} className=' text-white hover:text-blue-600' />
              </div>
              <div className="text-gray-500 text-sm flex gap-5">
                <span className='text-white'>Creation Date:</span>
                {formatedDate(new Date(link.creation_date))}
              </div>
              <div className="text-gray-500 text-sm flex gap-5">
                <span className='text-white'>Expiry Date:</span>
                {formatedDate(new Date(link.expiry_date))}
              </div>
              <div className={`text-sm ${link.isActive ? "text-emerald-400" : "text-gray-500"}`}>Status: {link.isActive ? " Acitve" : " Not Active"}</div>
              <div className="text-white flex items-center gap-1 text-sm ">
                <PiCursorClick />
                {link.totalClicks} clicks
              </div>
            </div>

            {/* right */}
            <div className="text-xl text-white flex gap-3" >
              <div className='hover:bg-gray-200/70 rounded-sm h-10 w-10 flex justify-center items-center transition-all active:border active:border-emerald-500' onClick={() => navigate(`/dashboard/links/${destination(link.short_url)}`)}><RiPencilFill /></div>
              <div className='hover:bg-gray-200/70 rounded-sm h-10 w-10 flex justify-center items-center transition-all active:border active:border-emerald-500' ><FaShareAlt /></div>
              <div className='hover:bg-gray-200/70 rounded-sm h-10 w-10 flex justify-center items-center transition-all active:border active:border-emerald-500' ><SiGoogleanalytics /></div>
              <div className='hover:bg-gray-200/70 rounded-sm h-10 w-10 flex justify-center items-center transition-all active:border active:border-emerald-500' ><BsThreeDots /></div>
            </div>
          </div>
        ))
        }
      </div >

    </div >
  )
}

export default Links
