import React, { useState } from 'react'
import Title from '../../components/Title'
import { dashboardDummyData } from '../../assets/quickStay-assets/assets'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
    const { currency } = useAppContext()
    const [dashboardData, setDashboarData] = useState(dashboardDummyData)

    return (
        <div className="font-inter max-w-5xl">
            <Title 
                align='left' 
                title='Dashboard' 
                subTitle='Monitor your room listing, track bookings and analyze revenue all in one place.' 
            />

            {/* Metrics Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>

                {/* Total Bookings Card */}
                <div className='bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group relative overflow-hidden'>
                    <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
                    <div className='flex flex-col text-left'>
                        <span className='text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-montserrat'>Total Bookings</span>
                        <span className='text-primary text-3xl font-extrabold font-montserrat mt-2'>{dashboardData.totalBookings}</span>
                        <span className='text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1'>
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            +12% vs last month
                        </span>
                    </div>
                    <div className="bg-primary/5 text-primary p-4 rounded-2xl group-hover:scale-105 transition-premium">
                        <span className="material-symbols-outlined text-3xl font-bold">book_online</span>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className='bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group relative overflow-hidden'>
                    <div className="absolute top-0 left-0 h-1 w-full bg-secondary"></div>
                    <div className='flex flex-col text-left'>
                        <span className='text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-montserrat'>Total Revenue</span>
                        <span className='text-primary text-3xl font-extrabold font-montserrat mt-2'>
                            {currency}{dashboardData.totalRevenue.toLocaleString()}
                        </span>
                        <span className='text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1'>
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            +18.4% growth
                        </span>
                    </div>
                    <div className="bg-secondary/5 text-secondary p-4 rounded-2xl group-hover:scale-105 transition-premium">
                        <span className="material-symbols-outlined text-3xl font-bold">payments</span>
                    </div>
                </div>

                {/* Performance Premium Badge */}
                <div className='bg-gradient-to-br from-primary to-slate-900 border border-white/5 rounded-3xl p-6 shadow-md flex flex-col justify-between text-left sm:col-span-2 lg:col-span-1'>
                    <div>
                        <span className="bg-amber-400/20 text-amber-300 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md w-max block">
                            Gold Tier Host
                        </span>
                        <h4 className="font-montserrat text-sm font-extrabold text-white mt-3 leading-snug">Elite Heritage Performance</h4>
                    </div>
                    <p className="font-inter text-xs text-slate-300 mt-1 leading-relaxed">You are in the top 5% of Mewar Heritage hosts this season!</p>
                </div>

            </div>

            {/* Recent Bookings Section */}
            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className='font-montserrat font-extrabold text-sm text-primary uppercase tracking-widest flex items-center gap-2'>
                        <span className="material-symbols-outlined text-lg">history</span>
                        Recent Reservations
                    </h2>
                </div>

                <div className='w-full border border-slate-100 text-left rounded-3xl shadow-sm overflow-hidden bg-white'>
                    <div className="overflow-x-auto">
                        <table className='w-full border-collapse'>
                            <thead className='bg-slate-50/70 border-b border-slate-100'>
                                <tr>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary'>Guest Name</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary max-sm:hidden'>Suite Type</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary text-center'>Total Price</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary text-center'>Payment Status</th>
                                </tr>
                            </thead>

                            <tbody className='text-sm text-gray-700 divide-y divide-slate-50'>
                                {dashboardData.bookings.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/40 transition-premium">
                                        <td className='py-4 px-6 flex items-center gap-3'>
                                            <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                {item.user.username.substring(0, 2)}
                                            </div>
                                            <div>
                                                <span className='font-bold text-slate-800 block'>{item.user.username}</span>
                                                <span className='text-[10px] text-gray-400 font-inter'>{item.user.email}</span>
                                            </div>
                                        </td>
                                        <td className='py-4 px-6 max-sm:hidden text-slate-500 font-medium'>{item.room.roomType}</td>
                                        <td className='py-4 px-6 text-center font-bold text-slate-900'>{currency}{item.totalPrice.toLocaleString()}</td>

                                        <td className='py-4 px-6 text-center'>
                                            <span className={`inline-block py-1.5 px-3.5 text-[9px] font-extrabold uppercase tracking-widest rounded-xl ${
                                                item.isPaid 
                                                    ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/50' 
                                                    : 'bg-amber-100/70 text-amber-800 border border-amber-200/50'
                                            }`}>
                                                {item.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
