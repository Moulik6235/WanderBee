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

const ProfileIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.967 8.967 0 0 1-5.9-2.29C6.5 17.082 8 16 12 16s5.5 1.082 5.9 2.71A8.967 8.967 0 0 1 12 21Zm0-7a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
    </svg>
)

const HotelIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M4 18h16M6 10v8M10 6v12M14 6v12M18 10v8M9 3h6a1 1 0 0 1 1-1v2H8V4a1 1 0 0 1 1-1Z"/>
    </svg>
)

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'My Bookings', path: '/my-bookings' },
        { name: 'Experiences', path: '/experiences' },
        { name: 'Support', path: '/support' },
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

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (
        <header className="w-full top-0 sticky bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100 transition-all duration-300">
            <nav className="flex justify-between items-center px-6 md:px-16 lg:px-24 xl:px-32 py-4 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link to='/' className="active:scale-95 transition-transform flex items-center gap-2.5">
                        <img src={assets.logo} alt="WanderBee" className="h-7 w-auto object-contain" />
                        <span className="font-montserrat text-2xl font-bold tracking-tight text-primary">
                             WanderBee
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-6 items-center">
                        {navLinks.map((link, i) => {
                            const isActive = location.pathname === link.path;
                            const isBookingsLink = link.path === '/my-bookings';
                            return (
                                <Link 
                                    key={i} 
                                    to={isBookingsLink && !user ? '#' : link.path} 
                                    onClick={(e) => {
                                        if (isBookingsLink && !user) {
                                            e.preventDefault();
                                            openSignIn();
                                        }
                                    }}
                                    className={`font-inter text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 hover:text-secondary ${
                                        isActive ? "text-primary border-b-2 border-primary pb-1" : "text-gray-500 hover:text-secondary"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-4 text-gray-500">
                        {user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action label="My Profile" labelIcon={<ProfileIcon />} onClick={() => navigate('/profile')} />
                                    <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                                    <UserButton.Action 
                                        label={isOwner ? "Dashboard" : "List Your Hotel"} 
                                        labelIcon={<HotelIcon />} 
                                        onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)} 
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : null}
                    </div>

                    {user ? null : (
                        <button 
                            onClick={openSignIn} 
                            className="bg-primary text-white font-montserrat font-semibold px-6 py-2 rounded-lg hover:bg-secondary transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    {user && (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label="My Profile" labelIcon={<ProfileIcon />} onClick={() => navigate('/profile')} />
                                <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                                <UserButton.Action 
                                    label={isOwner ? "Dashboard" : "List Your Hotel"} 
                                    labelIcon={<HotelIcon />} 
                                    onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)} 
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    )}
                    <img 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        src={assets.menuIcon} 
                        alt="menu" 
                        className="h-5 cursor-pointer hover:scale-110 transition-transform" 
                    />
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
                    </button>

                    {navLinks.map((link, i) => {
                        const isBookingsLink = link.path === '/my-bookings';
                        return (
                            <Link 
                                key={i} 
                                to={isBookingsLink && !user ? '#' : link.path} 
                                onClick={(e) => {
                                    setIsMenuOpen(false);
                                    if (isBookingsLink && !user) {
                                        e.preventDefault();
                                        openSignIn();
                                    }
                                }} 
                                className="font-montserrat font-semibold text-lg text-primary hover:text-secondary transition-premium"
                            >
                                {link.name}
                            </Link>
                        );
                    })}



                    {user ? null : (
                        <button 
                            onClick={() => { setIsMenuOpen(false); openSignIn(); }} 
                            className="bg-primary text-white px-8 py-2.5 font-montserrat font-bold rounded-lg hover:bg-secondary transition-all active:scale-95 shadow-sm"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;