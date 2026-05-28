import React, { useState } from 'react'
import { roomsDummyData } from '../../assets/quickStay-assets/assets'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'

const ListRoom = () => {
    const { currency } = useAppContext()
    const [rooms, setRooms] = useState(roomsDummyData)

    return (
        <div className="font-inter">
            <Title align='left' title='Room Listings' subTitle='View and manage all registered suites on the platform. Toggle availability instantly.' />
            
            <p className='font-montserrat font-bold text-xs uppercase tracking-wider text-gray-400 mt-8 mb-4'>All Active Suites</p>

            <div className='w-full max-w-4xl border border-gray-200/60 text-left rounded-lg shadow-ambient-sm overflow-hidden bg-white'>
                <table className='w-full border-collapse'>
                    <thead className='bg-neutral-bg border-b border-gray-100'>
                        <tr>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary'>Suite Type</th>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary max-sm:hidden'>Amenities</th>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary'>Price / Night</th>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary text-center'>Status</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm text-gray-700 divide-y divide-gray-100'>
                        {
                            rooms.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-premium">
                                    <td className='py-3.5 px-5 font-bold text-gray-800'>{item.roomType}</td>
                                    <td className='py-3.5 px-5 max-sm:hidden text-gray-500 font-medium'>{item.amenities.join(', ')}</td>
                                    <td className='py-3.5 px-5 font-bold text-gray-900'>{currency}{item.pricePerNight}</td>


                                    <td className='py-3.5 px-5 text-center'>
                                        <label className='relative inline-flex items-center cursor-pointer justify-center'>
                                            <input type="checkbox" className='sr-only peer' checked={item.isAvailable} readOnly/>
                                            <div className='w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors duration-200'></div>
                                            <span className='absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm'></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListRoom

