import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner, isOwnerLoaded, navigate } = useAppContext()

  useEffect(() => {
    if (isOwnerLoaded && !isOwner) {
      navigate('/')
    }
  }, [isOwner, isOwnerLoaded])

  if (!isOwnerLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-gray-500 tracking-wider uppercase font-montserrat animate-pulse">Loading Owner Suite...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <div className='flex flex-1 pb-20 md:pb-0'>
        <Sidebar/>
        <div className='flex-1 px-3 py-6 md:px-10 md:py-10'>
            <Outlet/>
        </div>
      </div>
     
    </div>
  )
} 

export default Layout
