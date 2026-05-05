import React from 'react'
import { FaLink } from "react-icons/fa6";

function Urlbox() {
    return (
        <div className='h-100 w-200 mx-auto rounded bg-white text-black'>
            <div className='flex justify-center'>
                <span className='flex items-center bg-gray-300/40 p-2 rounded text-black font-bold m-2 gap-1'><FaLink className='scale-110' /> Short Link</span>
            </div>
            <h1>Shorten a long link</h1>
        </div>
    )
}

export default Urlbox
