/* eslint-disable react/prop-types */
import React from 'react'
import { Link} from 'react-router-dom'


// eslint-disable-next-line react/prop-types
function ProfilePopUp({ userInfo, logout }) {
    return (
        <div className='z-100 p-4 h-72 w-80 text-black flex flex-col gap-3 bg-white absolute top-12 right-0'>
            <div className='flex w-full items-center gap-4'>
                <div className='h-15 w-15 bg-amber-400 dark:bg-amber-950 text-xl text-black dark:text-white flex justify-center items-center rounded-full'>
                    {userInfo?.name?.charAt(0)}
                </div>
                <div className='text-black h-15'>
                    <p className='text-xl  font-bold'>{userInfo.name}</p>
                    <p className='text-sm'>{userInfo.email}</p>
                </div>
            </div>
            <div className='w-full mt-2 bg-gray-400/60 h-0.5'></div>
            <div className='flex flex-col gap-4 '>
                <Link to="/support">Support</Link>
                <Link to="myUrls">My Urls</Link>
                <Link to="terms">Terms and Conditions</Link>
            </div>
            <div className='w-full mt-2 bg-gray-400/60 h-0.5'></div>
            <button onClick={logout} className='cursor-pointer'>Sign out</button>
        </div>
    )
}

export default ProfilePopUp
