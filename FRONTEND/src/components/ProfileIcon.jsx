/* eslint-disable react/prop-types */
import React from 'react'
import { IoIosArrowDown } from "react-icons/io";

// eslint-disable-next-line react/prop-types
function ProfileIcon({ showpopup, popup, userInfo }) {
    return (
        <button onClick={() => showpopup(!popup)}
            className=' md:py-2 md:px-5 bg-gray-500/10 border flex items-center justify-center gap-2 border-gray-300/30 rounded-sm cursor-pointer active:outline active:outline-indigo-300' >
            <div className='md:h-8 md:w-8 h-10 w-10 bg-amber-400 dark:bg-green-800 text-black dark:text-white flex justify-center items-center rounded-full'>
                {userInfo?.profileImage ?
                    <img src={userInfo.profileImage} /> : userInfo?.name?.charAt(0)
                }</div>
            <IoIosArrowDown className='hidden md:block text-xs' />
        </button >
    )
}

export default ProfileIcon
