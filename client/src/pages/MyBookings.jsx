import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/quickStay-assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const MyBookings = () => {
    const navigate = useNavigate()
    const { currency, axios, getToken } = useAppContext()
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const localBookings = JSON.parse(localStorage.getItem("bharatstay_bookings") || "[]")
                const token = await getToken()
                if (!token) {
                    setBookings([...localBookings, ...userBookingsDummyData])
                    return
                }

                const { data } = await axios.get('/api/bookings/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (data.success) {
                    const dbBookings = data.bookings.map(b => ({
                        ...b,
                        isPaid: b.isPaid || false,
                        status: b.isPaid ? "Confirmed" : "Pending Payment"
                    }))
                    setBookings([...localBookings, ...dbBookings, ...userBookingsDummyData])
                } else {
                    setBookings([...localBookings, ...userBookingsDummyData])
                }
            } catch (error) {
                console.error("Fetch User Bookings Error:", error.message)
                const localBookings = JSON.parse(localStorage.getItem("bharatstay_bookings") || "[]")
                setBookings([...localBookings, ...userBookingsDummyData])
            }
        }
        fetchUserBookings()
    }, [axios, getToken])

    // Map properties in bookings to Stitch premium names and images for high-fidelity representation
    const enhancedBookings = useMemo(() => {
        const stitchProperties = [
            {
                name: "The Maharana's Lake Retreat",
                address: "Old City, Udaipur, Rajasthan",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI"
            },
            {
                name: "Aravalli Boutique Haveli",
                address: "Fateh Sagar Lake, Udaipur, Rajasthan",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2"
            }
        ];

        return bookings.map((booking, idx) => {
            // Check if it is a pre-seeded generic dummy booking or a real custom/DB booking
            const isDummyBooking = booking.hotel?.name === "Urbanza Suites" || booking.hotel?._id === "67f76393197ac559e4089b72";
            if (!isDummyBooking) {
                const checkIn = new Date(booking.checkInDate);
                const checkOut = new Date(booking.checkOutDate);
                const timeDiff = checkOut.getTime() - checkIn.getTime();
                const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
                const fallbackPrice = (booking.room?.pricePerNight || 299) * nights;
                return {
                    ...booking,
                    hotel: {
                        name: booking.hotel?.name || "Premium Stay",
                        address: booking.hotel?.address || "Rajasthan, India"
                    },
                    room: {
                        roomType: booking.room?.roomType || "Luxury Suite",
                        images: booking.room?.images && booking.room.images.length > 0 ? booking.room.images : [stitchProperties[idx % stitchProperties.length].image]
                    },
                    totalPrice: booking.totalPrice || fallbackPrice,
                    status: booking.status || "Confirmed"
                };
            }

            const prop = stitchProperties[idx % stitchProperties.length];
            const rawPrice = booking.totalPrice || 299;
            return {
                ...booking,
                hotel: {
                    ...booking.hotel,
                    name: prop.name,
                    address: prop.address
                },
                room: {
                    ...booking.room,
                    images: [prop.image]
                },
                totalPrice: rawPrice < 1000 ? rawPrice * 30 : rawPrice,
                status: booking.isPaid ? "Confirmed" : "Pending Payment"
            };
        });
    }, [bookings]);

    const handlePayNow = (booking) => {
        const checkIn = new Date(booking.checkInDate)
        const checkOut = new Date(booking.checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)))
        
        navigate('/payment', {
            state: {
                room: booking.room,
                bookingDate: {
                    checkIn: new Date(booking.checkInDate).toISOString().split('T')[0],
                    checkOut: new Date(booking.checkOutDate).toISOString().split('T')[0],
                    guests: booking.guests
                },
                basePrice: booking.room?.pricePerNight || 12500,
                serviceFee: 1250,
                taxes: 4500,
                totalPrice: booking.totalPrice || ((booking.room?.pricePerNight || 12500) * nights) + 1250 + 4500,
                totalNights: nights,
                bookingId: booking._id
            }
        })
    }

    const handleRequestUpgrade = () => {
        toast.success("Upgrade request submitted! Our royal butler will contact you shortly.")
    }

    const handleBookButler = () => {
        toast.success("Heritage Butler pre-booked successfully for your stay.")
    }

    return (
        <main className="jali-overlay min-h-screen pb-20 bg-background text-left">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-10">
                
                {/* Breadcrumb Header */}
                <nav className="flex items-center text-xs text-gray-400 gap-1.5 font-inter mb-2">
                    <span>India</span>
                    <span>/</span>
                    <span>Member Area</span>
                    <span>/</span>
                    <span className="text-primary font-semibold">My Bookings</span>
                </nav>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-gray-200/50 pb-6">
                    <div className="text-left">
                        <h1 className="font-montserrat text-3xl font-extrabold text-primary">My Bookings</h1>
                        <p className="text-gray-500 font-inter text-sm mt-1">Easily manage your past, current, and upcoming heritage reservations.</p>
                    </div>
                </div>

                {/* Bookings Grid */}
                <div className="space-y-6">
                    {enhancedBookings.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-sm font-montserrat">
                            <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">book_online</span>
                            <p className="text-gray-500 font-semibold text-lg">No active bookings found.</p>
                        </div>
                    ) : (
                        enhancedBookings.map((booking) => (
                            <article 
                                key={booking._id} 
                                className="bg-white rounded-3xl overflow-hidden property-card-shadow border border-gray-100 hover:border-secondary transition-premium p-6 flex flex-col lg:flex-row justify-between gap-6"
                            >
                                {/* Left Side: Hotel & Room Info */}
                                <div className="flex flex-col sm:flex-row gap-6 lg:w-7/12">
                                    <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-sm border border-gray-100/60 relative">
                                        <img src={booking.room.images[0]} alt={booking.hotel.name} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    <div className="space-y-2 text-left">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-montserrat text-lg font-extrabold text-primary leading-tight">
                                                {booking.hotel.name}
                                            </h2>
                                            <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                                {booking.room.roomType}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-inter">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span>{booking.hotel.address}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-inter">
                                            <span className="material-symbols-outlined text-sm">group</span>
                                            <span>Guests: {booking.guests} Adults</span>
                                        </div>

                                        <p className="font-montserrat font-bold text-sm text-gray-800 pt-1">
                                            Total Price: {currency}{booking.totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Side: Trip Dates */}
                                <div className="flex flex-row items-center gap-8 justify-start lg:w-3/12 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 text-sm text-left">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Check-in</span>
                                        <span className="font-montserrat font-bold text-primary mt-1 block">
                                            {new Date(booking.checkInDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="text-xs text-gray-400 font-inter">From 12:00 PM</span>
                                    </div>
                                    <div className="h-8 border-l border-gray-200"></div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Check-out</span>
                                        <span className="font-montserrat font-bold text-primary mt-1 block">
                                            {new Date(booking.checkOutDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="text-xs text-gray-400 font-inter">Before 11:00 AM</span>
                                    </div>
                                </div>

                                {/* Right Side: Status & Elite Actions */}
                                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between lg:w-2/12 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 gap-4">
                                    <div className="flex items-center gap-2 lg:text-right">
                                        <div className={`h-2.5 w-2.5 rounded-full ${booking.isPaid ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${booking.isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                                            {booking.isPaid ? "Confirmed & Paid" : (booking.paymentMethod?.includes("Check-in") ? "Pay At Hotel" : "Pending Payment")}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        {!booking.isPaid ? (
                                            <button 
                                                onClick={() => handlePayNow(booking)}
                                                className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-montserrat font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-premium cursor-pointer w-full active:scale-95 text-center"
                                            >
                                                Pay Now
                                            </button>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={handleRequestUpgrade}
                                                    className="border border-primary text-primary hover:bg-primary/5 font-montserrat font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-xl shadow-sm transition-premium cursor-pointer w-full text-center"
                                                >
                                                    Elite Upgrade
                                                </button>
                                                <button 
                                                    onClick={handleBookButler}
                                                    className="bg-primary text-white hover:bg-secondary font-montserrat font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-xl shadow-sm transition-premium cursor-pointer w-full text-center"
                                                >
                                                    Book Butler
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </article>
                        ))
                    )}
                </div>

            </div>
        </main>
    )
}

export default MyBookings
