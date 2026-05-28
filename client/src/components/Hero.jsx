import React from 'react'
import { assets, cities } from "../assets/quickStay-assets/assets"
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/rooms');
  };

  return (
    <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
      {/* Opulent Indian Palace at dusk background */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9CgXiXoXg1jVN2XTSEl0E0xR2k_S4M0MFcU83Jzd3hkMyh_Ep8lrfKnAlJIvVpUaHKJepwil7hxWLwHYy_FvThIlcnOoZjdujR3YY3YExiAALxf-XgSl14cm9F94v2NQxsXgGOSZYX8E4QUhvIfN4BFt6MUvjUnPyiDyR2FLqVYQ5R8p16CEl2f0y7CqkIPIvY50ZmZNJC64_aaE52oJU2SkmvsMWpH0ICpvfPJ_Z4_8Q5AWeQuGMvHl9b-pR38fyQKHfge2m5P1t" 
          alt="Royal Indian Palace Dusk Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 md:px-16 lg:px-24 xl:px-32 text-center">
        <p className='bg-secondary/20 border border-secondary/30 px-5 py-1.5 rounded-full text-secondary font-montserrat font-bold text-xs tracking-widest uppercase mb-6 inline-block shadow-sm animate-pulse'>
          The Ultimate Royal Experience
        </p>
        
        <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 text-shadow-sm tracking-tight leading-tight">
          Experience Royalty. Embrace Bharat.
        </h1>

        {/* Search Bar Container */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-gray-100/30 backdrop-blur-md">
          {/* Destination */}
          <div className="flex-1 flex items-center px-4 py-3 gap-3 border-r border-gray-200/80 hover:bg-slate-50/80 transition-colors rounded-l-xl group">
            <span className="material-symbols-outlined text-primary font-semibold">location_on</span>
            <div className="text-left w-full">
              <label htmlFor="destinationInput" className="block font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Destination</label>
              <input 
                list='destinations' 
                id="destinationInput" 
                type="text" 
                className="w-full bg-transparent border-none p-0 focus:ring-0 font-inter font-bold text-primary placeholder:text-gray-400 outline-none text-sm mt-0.5" 
                placeholder="Where are you going?" 
                required 
              />
              <datalist id='destinations'>
                {cities.map((city, index) => (
                  <option value={city} key={index} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Check In */}
          <div className="flex-1 flex items-center px-4 py-3 gap-3 border-r border-gray-200/80 hover:bg-slate-50/80 transition-colors group">
            <span className="material-symbols-outlined text-primary font-semibold">calendar_month</span>
            <div className="text-left w-full">
              <label htmlFor="checkIn" className="block font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Check-In</label>
              <input 
                id="checkIn" 
                type="date" 
                className="w-full bg-transparent border-none p-0 focus:ring-0 font-inter font-bold text-primary outline-none text-sm mt-0.5 cursor-pointer" 
                required
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="flex-1 flex items-center px-4 py-3 gap-3 border-r border-gray-200/80 hover:bg-slate-50/80 transition-colors group">
            <span className="material-symbols-outlined text-primary font-semibold">calendar_month</span>
            <div className="text-left w-full">
              <label htmlFor="checkOut" className="block font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Check-Out</label>
              <input 
                id="checkOut" 
                type="date" 
                className="w-full bg-transparent border-none p-0 focus:ring-0 font-inter font-bold text-primary outline-none text-sm mt-0.5 cursor-pointer" 
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 flex items-center px-4 py-3 gap-3 hover:bg-slate-50/80 transition-colors group">
            <span className="material-symbols-outlined text-primary font-semibold">group</span>
            <div className="text-left w-full">
              <label htmlFor="guests" className="block font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Guests</label>
              <input 
                min={1} 
                max={4} 
                id="guests" 
                type="number" 
                className="w-full bg-transparent border-none p-0 focus:ring-0 font-inter font-bold text-primary placeholder:text-gray-400 outline-none text-sm mt-0.5" 
                placeholder="Add guests" 
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <button type="submit" className="bg-secondary text-white hover:bg-secondary-dark px-8 py-4 rounded-xl font-montserrat font-bold text-sm transition-premium flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
            <span className="material-symbols-outlined">search</span>
            Search
          </button>
        </form>
      </div>
    </section>
  )
}

export default Hero
