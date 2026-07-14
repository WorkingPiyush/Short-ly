import React from 'react'
import Logo from './Logo'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 sm:gap-3 items-center text-center w-full py-6 md:py-6 border-y border-zinc-800 dark:bg-black text-black dark:text-white mt-4'>
            <div className='hidden md:flex justify-center items-center'> <Logo /></div>
            <div className='flex justify-between items-center gap-10'>
                <Link to="/features" className='cursor-pointer text-xs text-zinc-400 hover:text-black hover:dark:text-white hover:shadow-black hover:dark:shadow-white transition duration-150 ease-in-out'>Features</Link>
                <Link to="/pricing" className='cursor-pointer text-xs text-zinc-400 hover:text-black hover:dark:text-white hover:shadow-black hover:dark:shadow-white  transition duration-150 ease-in-out'>Pricing</Link>
                <Link to="/apiDocs" className='cursor-pointer text-xs text-zinc-400 hover:text-black hover:dark:text-white hover:shadow-black hover:dark:shadow-white  transition duration-150 ease-in-out'>API docs</Link>
                <Link to="/privacy" className='cursor-pointer text-xs text-zinc-400 hover:text-black hover:dark:text-white hover:shadow-black hover:dark:shadow-white  transition duration-150 ease-in-out'>Privacy</Link>
                <Link to="/termsnCondition" className='cursor-pointer text-xs text-zinc-400 hover:text-black hover:dark:text-white hover:shadow-black hover:dark:shadow-white  transition duration-150 ease-in-out'>Terms</Link>
            </div>
            <span className='text-zinc-400'>&copy; 2026 Short-ly. All rights reserved.</span>
        </div>
    )
}

export default Footer

