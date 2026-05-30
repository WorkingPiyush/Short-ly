import React from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { useUser } from '../Hooks/useAuth';

// eslint-disable-next-line react/prop-types
function ProfileIcon({ showpopup, popup }) {
    const { data: user, isLoading } = useUser()
    if (isLoading) {
        return "loading...";
    }
    const userNameInital = user?.name?.charAt(0) ?? "";
    return (
        <button onClick={() => showpopup(!popup)} className='py-2 px-5 bg-gray-500/10 border flex items-center justify-center gap-2 border-gray-300/30 rounded-sm cursor-pointer active:outline active:outline-indigo-300'>
            <div className='h-8 w-8 bg-amber-400 dark:bg-green-800 text-black dark:text-white flex justify-center items-center rounded-full'>{userNameInital}</div>
            <p>{user?.name}</p>
            <IoIosArrowDown className='text-xs' />
        </button>
    )
}

export default ProfileIcon
