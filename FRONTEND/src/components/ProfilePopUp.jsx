/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function ProfilePopUp({ userInfo, logout, showpopup, onClose }) {
    const navigate = useNavigate();
    const popupRef = useRef(null);
    const popLinks = [
        { lable: "Dashboard", to: "/dashboard" },
        { lable: "Support", to: "/support" },
        { lable: "Urls", to: "/dashboard/links" },
        { lable: "Terms and Conditions", to: "/termsnCondition" },
        { lable: "Profle", to: "/profile" },
    ]

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
        };
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose, location.pathname]);

    return (
        <div ref={popupRef} className='z-100 md:h-fit md:w-80  text-black flex flex-col md:gap-3 gap-1.5 bg-white dark:bg-black dark:text-white absolute top-12 right-0 rounded-sm shadow dark:shadow-white shadow-black '>
            <div className='flex w-full md:px-3 px-1 md:py-3 py-2 items-center gap-2'>
                <div className='md:h-15 md:w-15 h-10 w-10 bg-amber-400 dark:bg-amber-950 flex justify-center items-center rounded-full'>
                    {userInfo?.profileImage ?
                        <img className='rounded' src={userInfo.profileImage} /> : userInfo?.name?.charAt(0)
                    }
                </div>
                <div className='text-black dark:text-white'>
                    <p onClick={() => navigate('/profile')} className='md:text-xl text-sm md:font-bold font-semibold cursor-pointer active:scale-103'>{userInfo.name}</p>
                    <p className='md:text-sm text-xs'>{userInfo.email}</p>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='w-full bg-gray-400/60 h-0.5'></div>
                {popLinks.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => showpopup(false)} className='hover:bg-gray-400/40 md:py-2 py-1 md:px-2 px-1 text-sm md:text-xl'>{link.lable}</Link>
                ))}
            </div>
            <div className='w-full md:mt-2 bg-gray-400/60 h-0.5'></div>
            <button onClick={logout} className='cursor-pointer md:h-10 h-6 flex items-center justify-center hover:text-red-600 hover:scale-105 transition-all'>Logout</button>
        </div>
    )
}

export default ProfilePopUp
