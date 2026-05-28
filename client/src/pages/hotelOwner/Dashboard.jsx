import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/quickStay-assets/assets'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
    const { currency } = useAppContext()
    const [dashboardData, setDashboarData] = useState(dashboardDummyData)

    return (
        <div className="font-inter">
            <Title align='left' title='Dashboard' subTitle='Monitor your room listing, track bookings and analyze revenue all in one place.' />

            <div className='flex flex-wrap gap-6 my-8'>

                {/* Total Bookings */}
                <div className='bg-primary/5 border border-primary/10 rounded-lg flex p-5 pr-8 items-center shadow-ambient-sm hover:shadow-ambient-md transition-premium w-full sm:w-72'>
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <img src={assets.totalBookingIcon} alt="booking-icon" className='h-8 w-8 object-contain' />
                    </div>

                    <div className='flex flex-col ml-4 font-medium'>
                        <p className='text-xs font-bold uppercase tracking-wider text-gray-500 font-montserrat'>Total Bookings</p>
                        <p className='text-primary text-2xl font-extrabold font-montserrat mt-1'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className='bg-primary/5 border border-primary/10 rounded-lg flex p-5 pr-8 items-center shadow-ambient-sm hover:shadow-ambient-md transition-premium w-full sm:w-72'>
                    <div className="bg-secondary/10 p-3 rounded-lg">
                        <img src={assets.totalRevenueIcon} alt="revenue-icon" className='h-8 w-8 object-contain' />
                    </div>

                    <div className='flex flex-col ml-4 font-medium'>
                        <p className='text-xs font-bold uppercase tracking-wider text-gray-500 font-montserrat'>Total Revenue</p>
                        <p className='text-primary text-2xl font-extrabold font-montserrat mt-1'>{currency} {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <h2 className='font-montserrat font-bold text-sm text-primary uppercase tracking-wider mb-5 mt-10'>Recent Bookings</h2>

            <div className='w-full max-w-4xl border border-gray-200/60 text-left rounded-lg shadow-ambient-sm overflow-hidden bg-white'>
                <table className='w-full border-collapse'>
                    <thead className='bg-neutral-bg border-b border-gray-100'>
                        <tr>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary'>User Name</th>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary max-sm:hidden'>Room Type</th>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary text-center'>Total Amount</th>
                            <th className='py-3.5 px-5 font-montserrat font-bold text-xs uppercase tracking-wider text-primary text-center'>Payment Status</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm text-gray-700 divide-y divide-gray-100'>
                        {dashboardData.bookings.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 transition-premium">
                                <td className='py-3.5 px-5 font-semibold text-gray-800'>{item.user.username}</td>
                                <td className='py-3.5 px-5 max-sm:hidden text-gray-500'>{item.room.roomType}</td>
                                <td className='py-3.5 px-5 text-center font-bold text-gray-900'>{currency}{item.totalPrice}</td>

                                <td className='py-3.5 px-5 text-center'>
                                    <span className={`inline-block py-1 px-3 text-[10px] font-bold uppercase tracking-wider rounded-full ${item.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {item.isPaid ? 'Completed' : 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard

