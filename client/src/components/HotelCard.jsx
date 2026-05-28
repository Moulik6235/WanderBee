import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from "../assets/quickStay-assets/assets"
import { useAppContext } from '../context/AppContext'

const HotelCard = ({ room, index }) => {
    const { currency } = useAppContext()

    return (
        <Link 
            to={'/rooms/' + room._id} 
            onClick={() => scrollTo(0, 0)} 
            key={room._id} 
            className='group relative w-full rounded-lg overflow-hidden bg-white text-gray-500/90 shadow-ambient-sm hover:shadow-ambient-md border-b-2 border-transparent hover:border-secondary transition-premium'
        >
            <img src={room.images[0]} alt={room.hotel.name} className="w-full h-48 object-cover rounded-t-lg" />

            {index % 2 === 0 && (
                <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-primary font-bold rounded-full shadow-sm z-10'>
                    Best Seller
                </p>
            )}

            <div className='p-4 pt-5' >
                <div className='flex items-center justify-between'>
                    <p className='font-montserrat text-lg font-bold text-primary truncate max-w-[70%]' >{room.hotel.name}</p>
                    <div className='flex items-center gap-1 text-tertiary font-bold text-sm'>
                        <img src={assets.starIconFilled} alt="star-icon" className="w-4 h-4" />
                        <span>4.5</span>
                    </div>
                </div>

                <div className='flex items-center gap-1.5 text-xs text-gray-500 mt-2'>
                    <img src={assets.locationIcon} alt="location-icon" className="w-3.5 h-3.5 opacity-70" />
                    <span className="truncate">{room.hotel.address}</span>
                </div>

                <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-100'>
                    <p className='font-montserrat font-bold text-gray-800 text-base'>
                        {currency}{room.pricePerNight} <span className='text-xs font-normal text-gray-500'>/night</span>
                    </p>
                    <button className='px-4 py-2 text-xs font-bold text-white bg-secondary hover:bg-secondary-dark rounded-lg shadow-sm transition-premium cursor-pointer'>
                        Book Now
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard


