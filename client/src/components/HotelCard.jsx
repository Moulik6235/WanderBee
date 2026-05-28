import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const HotelCard = ({ room, index }) => {
    const { currency } = useAppContext()

    // Multiplier for pricing if mock values are too small
    const displayPrice = room.pricePerNight < 1000 ? room.pricePerNight * 30 : room.pricePerNight;

    return (
        <Link 
            to={'/rooms/' + room._id} 
            onClick={() => scrollTo(0, 0)} 
            key={room._id} 
            className='group relative w-full rounded-2xl overflow-hidden bg-white text-gray-500/90 property-card-shadow hover:shadow-lg border-b-4 border-transparent hover:border-secondary transition-premium block text-left active:scale-[0.99]'
        >
            <img src={room.images[0]} alt={room.hotel.name} className="w-full h-48 object-cover rounded-t-lg transition-transform duration-700 group-hover:scale-105" />

            {index % 2 === 0 && (
                <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-primary font-bold rounded-full shadow-sm z-10'>
                    Best Seller
                </p>
            )}

            <div className='p-4 pt-5' >
                <div className='flex items-center justify-between'>
                    <p className='font-montserrat text-lg font-bold text-primary truncate max-w-[70%]' >{room.hotel.name}</p>
                    <div className='flex items-center gap-1 text-secondary font-bold text-sm'>
                        <span className="material-symbols-outlined text-secondary-container text-base font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        <span>4.8</span>
                    </div>
                </div>

                <div className='flex items-center gap-1.5 text-xs text-gray-500 mt-2'>
                    <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                    <span className="truncate">{room.hotel.address}</span>
                </div>

                <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-100'>
                    <p className='font-montserrat font-bold text-gray-800 text-base'>
                        {currency}{displayPrice.toLocaleString()} <span className='text-xs font-normal text-gray-500'>/night</span>
                    </p>
                    <button className='px-4 py-2 text-xs font-bold text-on-secondary-container bg-secondary-container hover:bg-secondary hover:text-white rounded-lg shadow-sm transition-premium cursor-pointer active:scale-95'>
                        Book Now
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard
