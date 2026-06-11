import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
    return (
        <header className='flex items-center justify-between px-4 md:px-10 border-b border-slate-100 py-4 bg-white shadow-sm sticky top-0 z-50 transition-premium'>
            <div className="flex items-center gap-2 md:gap-3.5">
                <Link to='/' className="active:scale-95 transition-transform flex items-center">
                    <span className="font-montserrat text-xl md:text-2xl font-extrabold tracking-tight text-primary">
                        WanderBee
                    </span>
                </Link>
                <span className="bg-amber-100/70 border border-amber-200 text-amber-800 text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg whitespace-nowrap">
                    👑 Owner Suite
                </span>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
                <Link 
                    to="/" 
                    className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider font-montserrat"
                    title="Guest Portal"
                >
                    <span className="material-symbols-outlined text-base font-bold">arrow_back</span>
                    <span className="hidden sm:inline">Guest Portal</span>
                </Link>
                <div className="border-l border-slate-200 h-5"></div>
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    )
}

export default Navbar
