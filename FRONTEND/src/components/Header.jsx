import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Logo from './Logo';


function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setisScrolled] = useState(false)

    useEffect(() => {
        const handelScrollEvent = () => {
            setisScrolled(window.scrollY > 50);
        }

        window.addEventListener('scroll', handelScrollEvent)
        return () => { window.removeEventListener('scroll', handelScrollEvent) }
    }, [])

    const navLinks = [
        { label: 'Features', to: '/features' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'Support', to: '/support' },
    ];

    return (
        <header className='flex justify-center items-center px-4 fixed top-0 left-0 right-0 z-50 pt-4'>
            <div className={`bg-black ${isScrolled ? "md:w-5xl" : "md:w-6xl"} px-7 py-5 border border-white/65 rounded-2xl backdrop-blur-md transition-all duration-250 ease-in-out`}>
                <div className="flex items-center md:justify-between sm:justify-between gap-30">

                    {/* Logo */}
                    <Logo setIsOpen={setIsOpen} homeRoute="/" />

                    {/* Nav Links */}
                    <nav className="hidden md:flex gap-0.5">
                        {navLinks.map(({ label, to }) => (
                            <Link
                                key={label}
                                to={to}
                                className="relative text-sm font-medium text-white/60 px-3.5 py-1.5 rounded-lg
                           hover:text-white hover:scale-110 overflow-visible transition-colors duration-200
                             after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5
                           after:bg-emerald-300 after:scale-x-100 hover:after:scale-x-0
                             after:transition-transform after:duration-200 after:rounded-full"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-2.5">
                        <Link to="/login"
                            className="text-sm font-medium cursor-pointer text-white/70 bg-black border px-4 py-2 rounded-lg
                                    hover:text-white hover:bg-white/[0.07] transition-all duration-150">
                            Login
                        </Link>

                        <Link to="/signup" className="text-sm font-medium cursor-pointer text-zinc-900 bg-emerald-300 px-5 py-2
          rounded-lg hover:bg-emerald-200 hover:scale-[1.03] transition-all duration-150">
                            Sign up free
                        </Link>
                    </div>
                    {/* cross button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="md:hidden flex flex-col justify-center gap-1.25 w-7 h-7 cursor-pointer
                        border border-white/15 rounded-lg hover:border-white/35 transition-colors duration-350">
                        <span className={`block w-full h-px bg-white/80 rounded-full origin-center transition-all duration-250
                         ${isOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
                        <span className={`block w-full h-px bg-white/80 rounded-full transition-all duration-200
                         ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                        <span className={`block w-full h-px bg-white/80 rounded-full origin-center transition-all duration-250
                        ${isOpen ? 'translate-y-[-6.5px] -rotate-45' : ''}`} />
                    </button>
                </div>

                <div className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out
          ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-white/8 py-3 flex flex-col">
                        {navLinks.map(({ label, to }) => (
                            <Link
                                key={label}
                                to={to}
                                className="relative text-sm font-medium text-white/60 px-3.5 py-1.5 rounded-lg
                           hover:text-white hover:scale-103 overflow-visible transition-colors duration-200
                             after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5
                           after:bg-emerald-300 after:scale-x-0 hover:after:scale-x-100
                             after:transition-transform after:duration-200 after:rounded-full"
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="h-px bg-white my-2" />

                        <div className="flex gap-2.5 pt-1 pb-2">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 text-center text-sm font-medium text-white/70 py-2.5
                border border-white/15 rounded-lg hover:bg-white/[0.07] transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 text-center text-sm font-medium text-zinc-900
                bg-emerald-300 py-2.5 rounded-lg hover:bg-emerald-200 transition-all duration-150"
                            >
                                Sign up free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
}

export default Header
