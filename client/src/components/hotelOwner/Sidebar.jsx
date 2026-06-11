import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const sidebarLinks = [
      { name: "Dashboard", path: "/owner", icon: "dashboard" },
      { name: "Add Room", path: "/owner/add-room", icon: "add_box" },
      { name: "List Room", path: "/owner/list-room", icon: "hotel" },
      { name: "Add Experience", path: "/owner/add-experience", icon: "celebration" },
    ];

  return (
    <aside className='fixed bottom-0 left-0 right-0 h-16 md:relative md:h-screen md:w-64 border-t md:border-t-0 md:border-r border-slate-100 bg-white flex md:flex-col items-center justify-around md:justify-start text-base md:pt-6 font-inter shadow-[0_-2px_10px_rgba(0,0,0,0.03)] md:shadow-sm shrink-0 z-50 w-full md:w-64 transition-all duration-300'>
      <div className="flex md:flex-col items-center justify-around md:justify-start w-full md:space-y-1.5 px-3 md:px-0">
        {sidebarLinks.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index} 
            end 
            className={({ isActive }) => `
              flex items-center gap-2 md:gap-3.5 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300 group cursor-pointer w-auto md:w-full justify-center md:justify-start
              ${isActive 
                ? "bg-primary text-white font-bold shadow-md shadow-primary/20 scale-[1.02]" 
                : "hover:bg-slate-50 text-gray-500 hover:text-primary"
              }
            `}
          >
            <span className={`material-symbols-outlined text-xl transition-all duration-300 group-hover:scale-110`}>
              {item.icon}
            </span>
            <p className='md:block hidden text-xs font-semibold tracking-wide font-montserrat uppercase'>{item.name}</p>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
