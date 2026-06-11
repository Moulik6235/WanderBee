import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/quickStay-assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { SignIn } from '@clerk/clerk-react'

const MyBookings = () => {
    const navigate = useNavigate()
    const { user, currency, axios, getToken } = useAppContext()
    const [bookings, setBookings] = useState([])

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] py-16 px-6 bg-slate-50 jali-overlay text-center">
                <div className="max-w-md mb-8">
                    <h2 className="font-montserrat text-3xl font-extrabold text-primary mb-3">Access Your Bookings</h2>
                    <p className="font-inter text-sm text-gray-500 leading-relaxed">
                        Please sign in to view and manage your premium reservations with WanderBee.
                    </p>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                    <SignIn routing="hash" />
                </div>
            </div>
        )
    }

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const localBookings = JSON.parse(localStorage.getItem("wanderbee_bookings") || "[]")
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
                        status: b.status || (b.isPaid ? "confirmed" : "pending")
                    }))
                    setBookings([...localBookings, ...dbBookings, ...userBookingsDummyData])
                } else {
                    setBookings([...localBookings, ...userBookingsDummyData])
                }
            } catch (error) {
                console.error("Fetch User Bookings Error:", error.message)
                const localBookings = JSON.parse(localStorage.getItem("wanderbee_bookings") || "[]")
                setBookings([...localBookings, ...userBookingsDummyData])
            }
        }
        fetchUserBookings()
    }, [axios, getToken])

    // Map properties in bookings to Stitch premium names and images for high-fidelity representation
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
            if (booking.bookingType === "experience") {
                const exp = booking.experience || {};
                const images = exp.images && exp.images.length > 0 ? exp.images : (exp.image ? [exp.image] : ["https://images.unsplash.com/photo-1512100356956-c1d473461155?auto=format&fit=crop&q=80&w=600"]);
                return {
                    ...booking,
                    isExperience: true,
                    experience: {
                        ...exp,
                        title: exp.title || "Curated Experience",
                        category: exp.category || "Curated",
                        location: exp.location || "Rajasthan, India",
                        images,
                        timing: exp.timing,
                        duration: exp.duration
                    },
                    totalPrice: booking.totalPrice || 0,
                    status: booking.status || (booking.isPaid ? "confirmed" : "pending")
                };
            }

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
                        ...booking.room,
                        roomType: booking.room?.roomType || "Luxury Suite",
                        images: booking.room?.images && booking.room.images.length > 0 ? booking.room.images : [stitchProperties[idx % stitchProperties.length].image]
                    },
                    totalPrice: booking.totalPrice || fallbackPrice,
                    status: booking.status || (booking.isPaid ? "confirmed" : "pending")
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
                status: booking.status || (booking.isPaid ? "confirmed" : "pending")
            };
        });
    }, [bookings]);

    const handlePayNow = (booking) => {
        if (booking.bookingType === "experience") {
            const exp = booking.experience || {}
            const basePrice = exp.price || 0
            navigate('/payment', {
                state: {
                    experience: {
                        id: exp._id,
                        title: exp.title,
                        category: exp.category,
                        location: exp.location,
                        timing: exp.timing,
                        duration: exp.duration,
                        price: exp.price,
                        image: exp.images?.[0]
                    },
                    basePrice,
                    guests: booking.guests || 1,
                    bookingId: booking._id
                }
            })
            return
        }

        const checkIn = new Date(booking.checkInDate)
        const checkOut = new Date(booking.checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)))
        
        const basePrice = booking.room?.pricePerNight || 12500;
        let gstRate = 0;
        if (basePrice <= 1000) {
            gstRate = 0;
        } else if (basePrice <= 7500) {
            gstRate = 0.05;
        } else {
            gstRate = 0.18;
        }
        const gstAmount = basePrice * nights * gstRate;
        const fallbackTotalPrice = (basePrice * nights) + gstAmount;
        
        navigate('/payment', {
            state: {
                room: booking.room,
                bookingDate: {
                    checkIn: new Date(booking.checkInDate).toISOString().split('T')[0],
                    checkOut: new Date(booking.checkOutDate).toISOString().split('T')[0],
                    guests: booking.guests
                },
                basePrice: basePrice,
                totalPrice: booking.totalPrice || fallbackTotalPrice,
                totalNights: nights,
                bookingId: booking._id
            }
        })
    }

    const handleRequestUpgrade = () => {
        toast.success("Upgrade request submitted! Our guest assistant will contact you shortly.")
    }

    const handleCancelBooking = async (booking) => {
        let confirmMsg = "Are you sure you want to cancel this stay reservation?";
        if (booking.cancellationPolicy === "Cancellation Fee Applicable") {
            confirmMsg = `Warning: This reservation has a 'Cancellation Fee Applicable' policy. A 50% cancellation fee (${currency}${(booking.totalPrice * 0.5).toLocaleString()}) will be charged. Are you sure you want to cancel?`;
        }
        if (!window.confirm(confirmMsg)) {
            return;
        }

        if (booking._id.startsWith("local-")) {
            try {
                const saved = JSON.parse(localStorage.getItem("wanderbee_bookings") || "[]")
                const updated = saved.map(b => b._id === booking._id ? { ...b, status: "cancelled", isPaid: false } : b)
                localStorage.setItem("wanderbee_bookings", JSON.stringify(updated))
                toast.success("Stay reservation cancelled successfully.")
                // Refresh list
                window.location.reload()
            } catch (err) {
                toast.error("Failed to cancel booking.")
            }
            return
        }

        try {
            const token = await getToken()
            if (!token) {
                toast.error("Please sign in to cancel booking.")
                return
            }

            const { data } = await axios.put(`/api/bookings/${booking._id}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                toast.success("Stay reservation cancelled successfully. Confirmation email sent.")
                // Update local state reactively
                setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: "cancelled" } : b))
            } else {
                toast.error(data.message || "Failed to cancel booking.")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
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
                        <p className="text-gray-500 font-inter text-sm mt-1">Easily manage your past, current, and upcoming reservations.</p>
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
                                {/* Left Side: Hotel & Room Info / Experience Info */}
                                <div className="flex flex-col sm:flex-row gap-6 lg:w-7/12">
                                    {booking.isExperience ? (
                                        <>
                                            <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-sm border border-gray-100/60 relative flex-shrink-0">
                                                <img src={booking.experience.images[0]} alt={booking.experience.title} className="w-full h-full object-cover" />
                                            </div>
                                            
                                            <div className="space-y-2 text-left flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-montserrat text-lg font-extrabold text-primary leading-tight">
                                                        {booking.experience.title}
                                                    </h2>
                                                    <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                                        {booking.experience.category}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-inter">
                                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                                    <span>{booking.experience.location}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-inter">
                                                    <span className="material-symbols-outlined text-sm">group</span>
                                                    <span>Guests: {booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</span>
                                                </div>

                                                <p className="font-montserrat font-bold text-sm text-gray-800 pt-1">
                                                    Total Price: {currency}{booking.totalPrice.toLocaleString()}
                                                </p>

                                                <div className="flex items-center gap-2 pt-1">
                                                    <span className="text-[10px] font-bold uppercase text-gray-400">Policy:</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        Free Cancellation
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-sm border border-gray-100/60 relative flex-shrink-0">
                                                <img src={booking.room.images[0]} alt={booking.hotel.name} className="w-full h-full object-cover" />
                                            </div>
                                            
                                            <div className="space-y-2 text-left flex-1">
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

                                                <div className="flex items-center gap-2 pt-1">
                                                    <span className="text-[10px] font-bold uppercase text-gray-400">Policy:</span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${booking.cancellationPolicy === 'Cancellation Fee Applicable' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                                        {booking.cancellationPolicy || 'Free Cancellation'}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Center Side: Trip Dates / Experience Schedule */}
                                <div className="flex flex-row items-center gap-8 justify-start lg:w-3/12 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 text-sm text-left">
                                    {booking.isExperience ? (
                                        <>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Experience Date</span>
                                                <span className="font-montserrat font-bold text-primary mt-1 block">
                                                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(booking.checkInDate || booking.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-xs text-gray-400 font-inter">Duration: {booking.experience.duration || 'Flexible'}</span>
                                            </div>
                                            <div className="h-8 border-l border-gray-200"></div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Timing</span>
                                                <span className="font-montserrat font-bold text-primary mt-1 block">
                                                    {booking.experience.timing || 'Flexible'}
                                                </span>
                                                <span className="text-xs text-gray-400 font-inter">Curated Slot</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>

                                 {/* Right Side: Status & Booking Actions */}
                                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between lg:w-2/12 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 gap-4">
                                    <div className="flex items-center gap-2 lg:text-right">
                                        <div className={`h-2.5 w-2.5 rounded-full ${booking.status === "cancelled" ? "bg-red-500" : (booking.isPaid ? "bg-emerald-500" : "bg-amber-500")}`}></div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${booking.status === "cancelled" ? "text-red-600" : (booking.isPaid ? "text-emerald-600" : "text-amber-600")}`}>
                                            {booking.status === "cancelled" ? "Cancelled" : (booking.isPaid ? "Confirmed & Paid" : (booking.paymentMethod?.includes("Check-in") ? "Pay At Hotel" : "Pending Payment"))}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        {booking.status === "cancelled" ? (
                                            <span className="text-[10px] text-gray-400 font-inter italic text-center w-full block py-2 border border-dashed border-gray-200 rounded-xl">
                                                This booking has been cancelled
                                            </span>
                                        ) : !booking.isPaid ? (
                                            <>
                                                <button 
                                                    onClick={() => handlePayNow(booking)}
                                                    className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-montserrat font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-premium cursor-pointer w-full active:scale-95 text-center"
                                                >
                                                    Pay Now
                                                </button>
                                                {!booking._id.startsWith("dummy") && (
                                                    <button 
                                                        onClick={() => handleCancelBooking(booking)}
                                                        className="border border-red-200 text-red-600 hover:bg-red-50 font-montserrat font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-xl shadow-sm transition-premium cursor-pointer w-full text-center"
                                                    >
                                                        {booking.isExperience ? "Cancel Experience" : "Cancel Stay"}
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {booking.isExperience ? (
                                                    <button 
                                                        onClick={() => toast.success("Butler guide details will be sent to your email shortly.")}
                                                        className="border border-primary text-primary hover:bg-primary/5 font-montserrat font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-xl shadow-sm transition-premium cursor-pointer w-full text-center"
                                                    >
                                                        Butler Details
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={handleRequestUpgrade}
                                                        className="border border-primary text-primary hover:bg-primary/5 font-montserrat font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-xl shadow-sm transition-premium cursor-pointer w-full text-center"
                                                    >
                                                        Room Upgrade
                                                    </button>
                                                )}
                                                {!booking._id.startsWith("dummy") && (
                                                    <button 
                                                        onClick={() => handleCancelBooking(booking)}
                                                        className="border border-red-200 text-red-600 hover:bg-red-50 font-montserrat font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-xl shadow-sm transition-premium cursor-pointer w-full text-center mt-1"
                                                    >
                                                        {booking.isExperience ? "Cancel Experience" : "Cancel Stay"}
                                                    </button>
                                                )}
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
