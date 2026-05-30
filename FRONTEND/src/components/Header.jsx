import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../Context/ThemeContext';
import { useLogout, useUser } from '../Hooks/useAuth';
import ProfilePopUp from './ProfilePopUp';
import ProfileIcon from './ProfileIcon';


function Header() {
    const { data: user, isLoading } = useUser()
    const logoutMutation = useLogout();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setisScrolled] = useState(false)
    const [showProfilePopUp, setShowProfilePopUp] = useState(false)
    const { theme, toggleTheme } = useTheme();
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
    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: async () => {
                navigate("/", { replace: true });
                setShowProfilePopUp(false);
            }
        })
    }
    if (isLoading) {
        return <p>Loading..</p>
    }
    return (
        <header className='flex justify-center items-center px-4 fixed top-0 left-0 right-0 z-50 pt-4 '>
            <div className={`bg-white text-black dark:bg-zinc-900 dark:text-white ${isScrolled ? "md:w-5xl" : "md:w-6xl"} px-7 py-5 border border-black/65 dark:border-white/65  rounded-2xl backdrop-blur-md transition-all duration-250 ease-in-out`}>
                <div className="flex items-center md:justify-between sm:justify-between gap-12">

                    {/* Logo */}
                    <Logo setIsOpen={setIsOpen} />

                    {/* Nav Links */}
                    <nav className="hidden md:flex gap-0.5">
                        {navLinks.map(({ label, to }) => (
                            <Link
                                key={label}
                                to={to}
                                className=" bg-white/60 text-black dark:bg-zinc-900 dark:text-white relative text-sm font-medium px-3.5 py-1.5 rounded-lg
                           hover:text-emerald-300 hover:scale-110 overflow-visible transition-colors duration-200
                             after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5
                           after:bg-emerald-300 after:scale-x-100 hover:after:scale-x-0
                             after:transition-transform after:duration-200 after:rounded-full"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                    {/* Actions */}

                    <div className="hidden md:flex items-center gap-2.5 relative">
                        <div onClick={toggleTheme} className='text-black dark:text-white p-1 rounded-xl cursor-pointer transition duration-300 ease-in-out active:scale-95'>
                            {theme === "light" ? <Moon /> : <Sun />}
                        </div>

                        {!user && <Link to="/login"
                            className="text-sm font-medium cursor-pointer bg-white/60 text-black dark:bg-zinc-900 dark:text-white border px-4 py-2 rounded-lg
                                     transition-all duration-150">
                            Login
                        </Link>}
                        {!user && <Link to="/signup" className="text-sm font-medium cursor-pointer text-zinc-900 bg-emerald-300 px-5 py-2
          rounded-lg hover:bg-emerald-200 hover:scale-[1.03] transition-all duration-150">
                            Sign up free
                        </Link>}
                        {user &&
                            <ProfileIcon showpopup={setShowProfilePopUp} popup={showProfilePopUp} />
                        }
                        {showProfilePopUp && <ProfilePopUp userInfo={user} logout={handleLogout} />}
                    </div>

                    {/* cross button */}
                    <div onClick={toggleTheme} className='text-black dark:text-white md:hidden relative left-10 p-1 rounded-xl cursor-pointer transition duration-300 ease-in-out active:scale-95'>
                        {theme === "light" ? <Moon /> : <Sun />}
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="md:hidden flex flex-col justify-center gap-1.25 w-7 h-7 cursor-pointer bg-white/80 text-black dark:bg-zinc-900 dark:text-white
                        border border-white/15 rounded-lg hover:border-white/35 transition-colors duration-350">

                        <span className={`block w-full text-white bg-zinc-900 dark:text-black dark:bg-white h-px  rounded-full origin-center transition-all duration-250
                         ${isOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />

                        <span className={`block w-full text-white bg-zinc-900 dark:text-black dark:bg-white h-px rounded-full transition-all duration-200
                         ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />

                        <span className={`block w-full text-white bg-zinc-900 dark:text-black dark:bg-white h-px rounded-full origin-center transition-all duration-250
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
                                className="relative text-sm font-medium text-black dark:text-white/60 px-3.5 py-1.5 rounded-lg
                           hover:text-black hover:dark:text-white hover:scale-103 overflow-visible transition-colors duration-200
                             after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5
                           after:bg-emerald-300 after:scale-x-0 hover:after:scale-x-100
                             after:transition-transform after:duration-200 after:rounded-full"
                            >
                                {label}
                            </Link>
                        ))}
                        {/*bg-white/70 text-black dark:bg-zinc-900 dark:text-white */}
                        <div className="h-px bg-white my-2" />
                        <div className="flex gap-2.5 pt-1 pb-2">
                            {!user && <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-medium cursor-pointer bg-white/60 text-black dark:bg-zinc-900 dark:text-white border px-4 py-2 rounded-lg
                                     transition-all duration-150">
                                Login
                            </Link>}
                            {!user && <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 text-center text-sm font-medium text-zinc-900
                bg-emerald-300 py-2.5 rounded-lg hover:bg-emerald-200 transition-all duration-150"
                            >
                                Sign up free
                            </Link>}
                            {user && user?.profileImage &&
                                <div className='h-10 w-10 bg-red-600 rounded-full'>
                                    <img src={user?.profileImage} alt="user-image" srcSet="user-image" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </header >
    );
}

export default Header
