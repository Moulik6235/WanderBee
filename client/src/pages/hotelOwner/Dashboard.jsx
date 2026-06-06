import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
    const { currency, axios, getToken } = useAppContext()
    const [dashboardData, setDashboardData] = useState({ totalBookings: 0, totalRevenue: 0, bookings: [] })
    const [loading, setLoading] = useState(true)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const token = await getToken()
            if (!token) return

            const { data } = await axios.get('/api/bookings/hotel', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Dashboard Fetch Error:", error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [axios, getToken])

    return (
        <div className="font-inter max-w-5xl">
            <Title 
                align='left' 
                title='Dashboard' 
                subTitle='Monitor your room listing, track bookings and analyze revenue all in one place.' 
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm my-8">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold font-montserrat uppercase tracking-wider text-gray-400 mt-4">Loading dashboard statistics...</p>
                </div>
            ) : (
                <>
                    {/* Metrics Row */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>

                        {/* Total Bookings Card */}
                        <div className='bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group relative overflow-hidden text-left'>
                            <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
                            <div className='flex flex-col'>
                                <span className='text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-montserrat'>Total Bookings</span>
                                <span className='text-primary text-3xl font-extrabold font-montserrat mt-2'>{dashboardData.totalBookings}</span>
                                <span className='text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1'>
                                    <span className="material-symbols-outlined text-xs">trending_up</span>
                                    Live updates
                                </span>
                            </div>
                            <div className="bg-primary/5 text-primary p-4 rounded-2xl group-hover:scale-105 transition-premium">
                                <span className="material-symbols-outlined text-3xl font-bold">book_online</span>
                            </div>
                        </div>

                        {/* Total Revenue Card */}
                        <div className='bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group relative overflow-hidden text-left'>
                            <div className="absolute top-0 left-0 h-1 w-full bg-secondary"></div>
                            <div className='flex flex-col'>
                                <span className='text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-montserrat'>Total Revenue</span>
                                <span className='text-primary text-3xl font-extrabold font-montserrat mt-2'>
                                    {currency}{(dashboardData.totalRevenue || 0).toLocaleString()}
                                </span>
                                <span className='text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1'>
                                    <span className="material-symbols-outlined text-xs">trending_up</span>
                                    Total earnings
                                </span>
                            </div>
                            <div className="bg-secondary/5 text-secondary p-4 rounded-2xl group-hover:scale-105 transition-premium">
                                <span className="material-symbols-outlined text-3xl font-bold">payments</span>
                            </div>
                        </div>

                        {/* Performance Premium Badge */}
                        <div className='bg-gradient-to-br from-primary to-slate-900 border border-white/5 rounded-3xl p-6 shadow-md flex flex-col justify-between text-left sm:col-span-2 lg:col-span-1'>
                            <div>
                                <span className="bg-amber-400/20 text-amber-300 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md w-max block font-montserrat">
                                    Gold Tier Host
                                </span>
                                <h4 className="font-montserrat text-sm font-extrabold text-white mt-3 leading-snug">Royal Heritage Performance</h4>
                            </div>
                            <p className="font-inter text-xs text-slate-300 mt-1 leading-relaxed">You are managing a premium heritage hotel listed on WanderBee.</p>
                        </div>

                    </div>

                    {/* Recent Bookings Section */}
                    <div className="mt-12 text-left">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className='font-montserrat font-extrabold text-sm text-primary uppercase tracking-widest flex items-center gap-2'>
                                <span className="material-symbols-outlined text-lg">history</span>
                                Recent Reservations
                            </h2>
                        </div>

                        {dashboardData.bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm px-6 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">book_online</span>
                                <h3 className="font-montserrat text-sm font-bold text-primary uppercase tracking-wider">No Bookings Yet</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">Your hotel hasn't received any bookings yet. Active room listings will appear here once reserved.</p>
                            </div>
                        ) : (
                            <div className='w-full border border-slate-100 rounded-3xl shadow-sm overflow-hidden bg-white'>
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
                                                <tr key={item._id || index} className="hover:bg-slate-50/40 transition-premium">
                                                    <td className='py-4 px-6 flex items-center gap-3'>
                                                        <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                            {(item.user?.username || "Guest").substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <span className='font-bold text-slate-800 block'>{item.user?.username || "WanderBee Guest"}</span>
                                                            <span className='text-[10px] text-gray-400 font-inter'>{item.user?.email || "guest@gmail.com"}</span>
                                                        </div>
                                                    </td>
                                                    <td className='py-4 px-6 max-sm:hidden text-slate-500 font-medium'>{item.room?.roomType || "Luxury Suite"}</td>
                                                    <td className='py-4 px-6 text-center font-bold text-slate-900'>{currency}{(item.totalPrice || 0).toLocaleString()}</td>

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
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard
