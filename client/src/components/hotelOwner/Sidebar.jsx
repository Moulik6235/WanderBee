import React from 'react'
import { assets } from '../../assets/quickStay-assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

    const sidebarLinks = [
      {name: "Dashboard", path:"/owner", icon:assets.dashboardIcon},
      {name: "Add Room", path:"/owner/add-room", icon:assets.addIcon},
      {name: "List Room", path:"/owner/list-room", icon:assets.listIcon},
    ]

  return (
    <div className='md:w-64 w-16 border-r border-gray-200 h-full text-base pt-4 flex flex-col transition-all duration-300 font-inter'>
      {sidebarLinks.map((item,index)=>(
        <NavLink to={item.path} key={index} end className={({isActive})=> `flex items-center py-3.5 px-4 md:px-8 gap-3 border-r-4 transition-premium ${isActive ? "bg-primary/5 border-primary text-primary font-bold" : "hover:bg-slate-50 border-transparent text-gray-500 hover:text-gray-900"}`}>
          <img src={item.icon} alt={item.name} className='w-5 h-5 opacity-70'/>
          <p className='md:block hidden text-sm'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar

