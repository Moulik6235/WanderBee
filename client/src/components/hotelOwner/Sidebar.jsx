import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const sidebarLinks = [
      { name: "Dashboard", path: "/owner", icon: "dashboard" },
      { name: "Add Room", path: "/owner/add-room", icon: "add_box" },
      { name: "List Room", path: "/owner/list-room", icon: "hotel" },
    ];

  return (
    <aside className='w-20 md:w-64 border-r border-slate-100 bg-white h-screen text-base pt-6 flex flex-col transition-all duration-300 font-inter shadow-sm shrink-0'>
      <div className="space-y-1.5 px-3">
        {sidebarLinks.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index} 
            end 
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer
              ${isActive 
                ? "bg-primary text-white font-bold shadow-md shadow-primary/20 scale-[1.02]" 
                : "hover:bg-slate-50 text-gray-500 hover:text-primary"
              }
            `}
          >
            <span className={`material-symbols-outlined text-xl transition-all duration-300 group-hover:scale-110`}>
              {item.icon}
            </span>
            <p className='md:block hidden text-sm font-semibold tracking-wide font-montserrat uppercase text-xs'>{item.name}</p>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
