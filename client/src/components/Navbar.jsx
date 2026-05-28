import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/quickStay-assets/assets"
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
)

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];



    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { openSignIn } = useClerk()
    const location = useLocation()

    const { user, navigate, isOwner, setShowHotelReg } = useAppContext()

    useEffect(() => {

        if (location.pathname !== '/') {
            setIsScrolled(true);
            return;
        } else {
            setIsScrolled(false)
        }
        setIsScrolled(prev => location.pathname !== '/' ? true : prev);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (

        <nav className="sticky top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 transition-all duration-300 z-50 bg-white/95 text-neutral-text backdrop-blur-lg py-4 border-b border-gray-100 shadow-sm">

            {/* Logo */}
            <Link to='/'>
                <span className={`font-montserrat text-2xl font-black tracking-tight transition-premium ${isScrolled ? "text-primary" : "text-white"}`}>
                    QuickStay
                </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} className="group font-montserrat text-sm font-semibold tracking-wide flex flex-col gap-1 transition-premium text-primary hover:text-secondary">
                        {link.name}
                        <div className="bg-secondary h-0.5 w-0 group-hover:w-full transition-all duration-300" />
                    </Link>
                ))}

                {user &&
                    <button className="px-4 py-1.5 text-xs font-bold font-montserrat rounded-lg border border-primary text-primary hover:bg-primary/5 transition-premium cursor-pointer" onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}>
                        {isOwner ? 'Dashboard' : 'List Your Hotel'}
                    </button>
                }
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-6">
                <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-premium text-2xl font-bold">search</span>

                {user ?
                    (<UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>)
                    :
                    (<button onClick={openSignIn} className="bg-secondary hover:bg-secondary-dark text-white font-montserrat font-bold px-6 py-2 rounded-lg transition-premium cursor-pointer shadow-sm">
                        Login
                    </button>)}

            </div>

            {/* Mobile Menu Button */}

            <div className="flex items-center gap-3 md:hidden">
                {user && <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                    </UserButton.MenuItems>
                </UserButton>}
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="menu" className="h-5 cursor-pointer" />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)} className="font-montserrat font-semibold text-lg text-primary hover:text-secondary transition-premium">
                        {link.name}
                    </a>
                ))}

                {user && <button className="border border-primary text-primary px-5 py-2 text-sm font-bold font-montserrat rounded-lg cursor-pointer transition-premium" onClick={() => { setIsMenuOpen(false); isOwner ? navigate('/owner') : setShowHotelReg(true); }}>
                    {isOwner ? 'Dashboard' : 'List Your Hotel'}
                </button>}

                {!user && <button onClick={() => { setIsMenuOpen(false); openSignIn(); }} className="bg-secondary hover:bg-secondary-dark text-white px-8 py-2.5 font-montserrat font-bold rounded-lg transition-premium shadow-sm">
                    Login
                </button>}
            </div>
        </nav>

    );
}

export default Navbar