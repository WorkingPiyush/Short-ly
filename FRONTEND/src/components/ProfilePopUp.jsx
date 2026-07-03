/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'


// eslint-disable-next-line react/prop-types
function ProfilePopUp({ userInfo, logout, showpopup }) {
    const popLinks = [
        { lable: "Support", to: "/support" },
        { lable: "My Urls", to: "/myUrls" },
        { lable: "Dashboard", to: "/dashboard" },
        { lable: "Terms and Conditions", to: "/terms" },
    ]

    return (
        <div className='z-100 h-fit w-80 text-black flex flex-col gap-3 bg-white dark:bg-black dark:text-white absolute top-12 right-0 rounded-sm shadow dark:shadow-white shadow-black '>
            <div className='flex w-full px-3 py-3 items-center gap-4'>
                <div className='h-15 w-15 bg-amber-400 dark:bg-amber-950 text-xl text-black dark:text-white flex justify-center items-center rounded-full'>
                    {userInfo?.name?.charAt(0)}
                </div>
                <div className='text-black h-15 dark:text-white'>
                    <p className='text-xl  font-bold'>{userInfo.name}</p>
                    <p className='text-sm'>{userInfo.email}</p>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='w-full bg-gray-400/60 h-0.5'></div>
                {popLinks.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => showpopup(false)} className='hover:bg-gray-400/40 py-2 px-2'>{link.lable}</Link>
                ))}
            </div>
            <div className='w-full mt-2 bg-gray-400/60 h-0.5'></div>
            <button onClick={logout} className='cursor-pointer hover:text-red-600 hover:scale-105 transition-all'>Sign out</button>
        </div>
    )
}

export default ProfilePopUp
