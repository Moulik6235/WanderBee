import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/quickStay-assets/assets'
import { useAppContext } from '../context/AppContext'

const MyBookings = () => {
    const { currency } = useAppContext()
    const [bookings, setBookings] = useState(userBookingsDummyData)

    return (
        <div className='py-28 md:pb-35 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 bg-white min-h-screen'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place.' align='left' />

            <div className='max-w-6xl mt-10 w-full text-gray-800 font-inter'>

                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-200 font-montserrat font-bold text-xs uppercase tracking-wider text-primary py-3'>
                    <div>Hotel Details</div>
                    <div>Trip Details</div>
                    <div>Payment Status</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-100 py-6 items-center'>

                        {/* Hotel Details */}
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <img src={booking.room.images[0]} alt="hotel-img" className='w-full sm:w-44 h-28 rounded-lg shadow-sm object-cover border border-gray-100' />
                            <div className='flex flex-col gap-1.5'>
                                <p className='font-montserrat text-lg font-bold text-primary'>{booking.hotel.name}
                                    <span className='font-inter text-xs font-semibold text-gray-500'> ({booking.room.roomType})</span>
                                </p>
                                <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                                    <img src={assets.locationIcon} alt="location-icon" className="w-3.5 h-3.5 opacity-70" />
                                    <span>{booking.hotel.address}</span>
                                </div>
                                <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                                    <img src={assets.guestsIcon} alt="guests-icon" className="w-3.5 h-3.5 opacity-70" />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className='font-montserrat font-bold text-sm text-gray-800 mt-1'>Total: {currency}{booking.totalPrice}</p>
                            </div>
                        </div>


                        {/* Date & Timings */}
                        <div className='flex flex-row md:items-center md:gap-12 mt-4 md:mt-0 gap-8 text-sm'>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check-In</p>
                                <p className='text-gray-700 font-semibold mt-1'>
                                    {new Date(booking.checkInDate).toDateString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check-Out</p>
                                <p className='text-gray-700 font-semibold mt-1'>
                                    {new Date(booking.checkOutDate).toDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Payment Status*/}
                        <div className='flex flex-col items-start justify-center mt-4 md:mt-0'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-2.5 w-2.5 rounded-full ${booking.isPaid ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                                <p className={`text-xs font-bold uppercase tracking-wider ${booking.isPaid ? "text-emerald-600" : "text-rose-600"}`}>
                                    {booking.isPaid ? "Paid" : "Pending Payment"}
                                </p>
                            </div>

                            {!booking.isPaid && (
                                <button className='bg-secondary hover:bg-secondary-dark text-white font-montserrat font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded shadow-sm mt-3 transition-premium cursor-pointer'>
                                    Pay Now
                                </button>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings

