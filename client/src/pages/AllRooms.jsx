import React, { useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/quickStay-assets/assets'
import { useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-3 text-sm text-gray-600 hover:text-secondary transition-premium font-inter group'>
      <input 
        type="checkbox" 
        checked={selected} 
        onChange={(e) => onChange(e.target.checked, label)}
        className="rounded text-primary focus:ring-primary border-gray-300 w-4.5 h-4.5 cursor-pointer" 
      />
      <span className='select-none group-hover:text-secondary transition-premium'>{label}</span>
    </label>
  )
}

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-3 text-sm text-gray-600 hover:text-secondary transition-premium font-inter group'>
      <input 
        type="radio" 
        name='sortOption' 
        checked={selected} 
        onChange={(e) => onChange(label)} 
        className="text-primary focus:ring-primary border-gray-300 w-4.5 h-4.5 cursor-pointer"
      />
      <span className='select-none group-hover:text-secondary transition-premium'>{label}</span>
    </label>
  )
}

const AllRooms = () => {
  const navigate = useNavigate();
  const { currency } = useAppContext();
  const [openFilters, setOpenFilters] = useState(false);

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family Suite",
  ];
  
  const guestRatings = [
    "4.5+ Excellent",
    "4.0+ Very Good",
    "3.5+ Good"
  ];

  const amenitiesOptions = [
    "Free WiFi",
    "Room Service",
    "Pool Access",
    "Mountain View"
  ];

  const sortOptions = [
    "Recommended",
    "Price Low to High",
    "Price High to Low",
  ];

  const [selectedSort, setSelectedSort] = useState("Recommended");

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-screen">
      
      {/* Search Results Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200/50 pb-6">
        <div>
          <nav className="flex items-center text-xs text-gray-400 gap-1.5 font-inter mb-1">
            <span>India</span>
            <span>/</span>
            <span>New York</span>
            <span>/</span>
            <span className="text-primary font-semibold">Available Stays</span>
          </nav>
          <h1 className="font-montserrat text-3xl font-extrabold text-primary">Hotels in New York</h1>
          <p className="text-gray-500 font-inter text-sm mt-1">{roomsDummyData.length} properties found for your stay</p>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <div className="relative text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Sort by</span>
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-inter font-semibold text-primary outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {sortOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* Room Types */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-ambient-sm text-left">
            <h3 className="font-montserrat text-xs font-bold text-primary mb-4 uppercase tracking-wider">Property Type</h3>
            <div className="space-y-1">
              {roomTypes.map((type, index) => (
                <CheckBox key={index} label={type} />
              ))}
            </div>
          </section>

          {/* Guest Rating */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-ambient-sm text-left">
            <h3 className="font-montserrat text-xs font-bold text-primary mb-4 uppercase tracking-wider">Guest Rating</h3>
            <div className="space-y-1">
              {guestRatings.map((rating, index) => (
                <CheckBox key={index} label={rating} />
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-ambient-sm text-left">
            <h3 className="font-montserrat text-xs font-bold text-primary mb-4 uppercase tracking-wider">Amenities</h3>
            <div className="space-y-1">
              {amenitiesOptions.map((amenity, index) => (
                <CheckBox key={index} label={amenity} />
              ))}
            </div>
          </section>

        </aside>

        {/* Main Listings Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {roomsDummyData.map((room) => (
            <article 
              key={room._id} 
              className="bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient-md flex flex-col md:flex-row border border-gray-100 hover:border-secondary transition-premium"
            >
              {/* Left Image Area */}
              <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img 
                  onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                  src={room.images[0]} 
                  alt={room.hotel.name} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-premium" 
                />
                {/* Star Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                  <span className="font-montserrat font-bold text-xs text-primary">4.8</span>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="md:w-3/5 p-6 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h2 
                      onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                      className="font-montserrat text-xl font-bold text-primary cursor-pointer hover:text-secondary transition-premium leading-tight"
                    >
                      {room.hotel.name}
                    </h2>
                    <span className="material-symbols-outlined text-gray-300 cursor-pointer hover:text-red-500 hover:font-fill transition-colors text-xl">favorite</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-400 mb-4 text-xs font-inter">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{room.hotel.address}</span>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold font-inter tracking-wide"
                      >
                        {facilityIcons[item] && (
                          <img src={facilityIcons[item]} alt={item} className="w-3.5 h-3.5 opacity-80" />
                        )}
                        <span className="uppercase">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-4 font-inter leading-relaxed">
                    Experience unmatched hospitality and signature services in this meticulously managed suite, designed with premium comfort in mind.
                  </p>
                </div>

                {/* Pricing and Action Block */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Starts from</span>
                    <span className="font-montserrat text-lg font-bold text-primary">
                      {currency}{room.pricePerNight} 
                      <span className="font-inter text-xs text-gray-400 font-normal"> / night</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} 
                    className="bg-secondary hover:bg-secondary-dark text-white font-montserrat font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-premium shadow-md hover:shadow-lg cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AllRooms
