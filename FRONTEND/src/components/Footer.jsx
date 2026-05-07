import React from 'react'
import Logo from './Logo'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className='flex justify-evenly w-full py-5 border-y border-zinc-800 bg-black mt-4'>
            <Logo />
            <div className='flex justify-between items-center gap-10'>
                <Link to="/features" className='cursor-pointer text-zinc-400 hover:text-white hover:shadow-white transition duration-150 ease-in-out'>Features</Link>
                <Link to="/pricing" className='cursor-pointer text-zinc-400 hover:text-white hover:shadow-white transition duration-150 ease-in-out'>Pricing</Link>
                <Link to="/apidocs" className='cursor-pointer text-zinc-400 hover:text-white hover:shadow-white transition duration-150 ease-in-out'>API docs</Link>
                <Link to="/privacy" className='cursor-pointer text-zinc-400 hover:text-white hover:shadow-white transition duration-150 ease-in-out'>Privacy</Link>
                <Link to="/terms" className='cursor-pointer text-zinc-400 hover:text-white hover:shadow-white transition duration-150 ease-in-out'>Terms</Link>
            </div>
            <span className='text-zinc-400'>&copy; 2026 Short-ly. All rights reserved.</span>
        </div>
    )
}

export default Footer
