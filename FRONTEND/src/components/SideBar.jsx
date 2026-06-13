import React, { useState } from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { MdOutlineMenu } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { FcMultipleInputs } from "react-icons/fc"
import { IoIosLink } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { IoSettings } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';


function SideBar() {
    const navigate = useNavigate();
    const [showSideBar, setShowSideBar] = useState(false);
    const handelCreateBtn = () => {
        navigate('/dashboard', {
            state: {
                focustInput: true,
            }
        })
    }

    const sideOptions = [
        { icon: <IoHomeOutline />, head: "Dashboard", to: "/dashboard", },
        { icon: <IoIosLink />, head: "Links", to: "/dashboard/links" },
        // { icon: <RiPagesLine />, head: "Profile Pages", to: "/dashboard/profile" },
        { icon: <FcMultipleInputs />, head: "Bulk Urls", to: "/dashboard/bulk" },
        { icon: <SiGoogleanalytics />, head: "Analytics", to: "/dashboard/analytics" },
    ]

    return (
        <div>
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-dvh w-64 text-black bg-white/10 border-r border-gray-700/20 px-4 py-6 flex flex-col gap-6 transition-transform duration-300
            ${showSideBar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 `}>
                <div className='flex justify-center'>
                    <Logo />
                </div>
                {/* Create Button */}
                <button onClick={handelCreateBtn} className="flex items-center justify-center cursor-pointer gap-2 w-full py-3 rounded-lg bg-emerald-400 text-black font-semibold hover:bg-emerald-500 transition-colors">
                    <IoAddSharp size={18} />
                    <span>Create New</span>
                </button>

                <div className="h-px bg-gray-400/30" />

                <nav className="flex flex-col gap-2">
                    {sideOptions.map((option) => (
                        <NavLink
                            key={option.to}
                            end to={option.to}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-black dark:text-white transition-all duration-200 ${isActive ? "bg-emerald-400 font-semibold dark:text-black" : "hover:bg-gray-500/10"}`}>
                            <span className="text-lg">{option.icon}</span>
                            <span>{option.head}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto">
                    <div className="h-px bg-gray-400/30 mb-4" />
                    <button className=" flex items-center justify-center gap-2  w-full py-3 rounded-lg bg-black text-emerald-400 font-semibold hover:bg-gray-900 transition-colors">
                        <IoSettings size={18} />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {showSideBar && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setShowSideBar(false)}
                />
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setShowSideBar(!showSideBar)}
                className=" fixed top-4 right-4 z-50 p-2 rounded-lg bg-white text-black shadow-md lg:hidden">
                {showSideBar ? <RxCross1 size={20} /> : <MdOutlineMenu size={24} />}
            </button>
        </div>
    )
}

export default SideBar
