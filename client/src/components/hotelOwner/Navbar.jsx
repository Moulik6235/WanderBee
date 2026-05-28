import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
    return (
        <header className='flex items-center justify-between px-6 md:px-10 border-b border-slate-100 py-4 bg-white shadow-sm sticky top-0 z-50 transition-premium'>
            <div className="flex items-center gap-3.5">
                <Link to='/' className="active:scale-95 transition-transform">
                    <span className="font-montserrat text-2xl font-extrabold tracking-tight text-primary">
                        BharatStay
                    </span>
                </Link>
                <span className="bg-amber-100/70 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    👑 Owner Suite
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                <Link 
                    to="/" 
                    className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider font-montserrat"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Guest Portal
                </Link>
                <div className="border-l border-slate-200 h-5"></div>
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    )
}

export default Navbar
