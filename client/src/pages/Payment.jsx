import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import Title from '../components/Title'

const Payment = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { axios, currency, getToken } = useAppContext()

    // If navigated directly without state, redirect to home
    const bookingData = location.state || {}
    const { room, bookingDate, basePrice, serviceFee, taxes, totalPrice, totalNights } = bookingData

    useEffect(() => {
        if (!room || !bookingDate) {
            toast.error("Invalid reservation path. Please select a room first.")
            navigate('/')
        }
    }, [room, bookingDate, navigate])

    // State for Payment Methods: 'upi' | 'netbanking' | 'card' | 'checkin'
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [loading, setLoading] = useState(false)

    // Form inputs
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    })
    const [upiId, setUpiId] = useState('')
    const [upiSubMethod, setUpiSubMethod] = useState('id') // 'id' | 'qr'
    const [timer, setTimer] = useState(120)
    const [selectedBank, setSelectedBank] = useState('SBI')

    useEffect(() => {
        let interval;
        if (paymentMethod === 'upi' && upiSubMethod === 'qr' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [paymentMethod, upiSubMethod, timer])

    useEffect(() => {
        if (upiSubMethod === 'qr') {
            setTimer(120)
        }
    }, [upiSubMethod])

    const formatTimer = () => {
        const mins = Math.floor(timer / 60)
        const secs = timer % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length > 0) {
            return parts.join(' ')
        } else {
            return v
        }
    }

    const formatExpiry = (value) => {
        const clean = value.replace(/[^0-9]/g, '')
        if (clean.length >= 2) {
            return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`
        }
        return clean
    }

    const handleCardChange = (e) => {
        const { name, value } = e.target
        if (name === 'number') {
            setCardDetails(prev => ({ ...prev, number: formatCardNumber(value).substring(0, 19) }))
        } else if (name === 'expiry') {
            setCardDetails(prev => ({ ...prev, expiry: formatExpiry(value).substring(0, 5) }))
        } else if (name === 'cvv') {
            setCardDetails(prev => ({ ...prev, cvv: value.replace(/[^0-9]/g, '').substring(0, 3) }))
        } else {
            setCardDetails(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleConfirmBooking = async (e) => {
        e.preventDefault()

        // Validation based on selected method
        if (paymentMethod === 'card') {
            if (cardDetails.number.length < 19 || !cardDetails.name || cardDetails.expiry.length < 5 || cardDetails.cvv.length < 3) {
                toast.error("Please fill all Card details correctly.")
                return
            }
        } else if (paymentMethod === 'upi') {
            if (upiSubMethod === 'id' && (!upiId || !upiId.includes('@'))) {
                toast.error("Please enter a valid UPI ID (e.g., name@okaxis)")
                return
            }
        }

        setLoading(true)

        try {
            const token = await getToken()
            if (!token) {
                toast.error("Please sign in to confirm booking.")
                setLoading(false)
                return
            }

            const methodLabel = 
                paymentMethod === 'card' ? 'Credit/Debit Card' :
                paymentMethod === 'upi' ? (upiSubMethod === 'qr' ? 'UPI (QR Code Scan)' : `UPI (${upiId})`) :
                paymentMethod === 'netbanking' ? `NetBanking (${selectedBank})` :
                'Pay During Check-in';

            const isPaid = paymentMethod !== 'checkin';

            // Simulate a premium verification process for online payments
            if (paymentMethod !== 'checkin') {
                await new Promise(resolve => setTimeout(resolve, 2000))
            }

            // A. UPDATE existing booking (if bookingId was passed from bookings page)
            if (bookingData.bookingId) {
                if (bookingData.bookingId.startsWith("local-")) {
                    const saved = JSON.parse(localStorage.getItem("bharatstay_bookings") || "[]")
                    const updated = saved.map(b => {
                        if (b._id === bookingData.bookingId) {
                            return {
                                ...b,
                                isPaid: true,
                                status: "Confirmed",
                                paymentMethod: methodLabel
                            }
                        }
                        return b
                    })
                    localStorage.setItem("bharatstay_bookings", JSON.stringify(updated))
                    toast.success("Payment Received! Reservation Confirmed.")
                    navigate('/my-bookings')
                    return
                }

                // Database payment PUT API call
                const { data } = await axios.put(`/api/bookings/${bookingData.bookingId}/pay`, {
                    paymentMethod: methodLabel
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (data.success) {
                    toast.success("Payment Received! Reservation Confirmed.")
                    navigate('/my-bookings')
                } else {
                    toast.error(data.message || "Failed to process payment")
                }
                return
            }

            // B. CREATE new booking
            // 1. Save in LocalStorage if mock custom room
            if (room._id.startsWith("ud-") || room._id.startsWith("jp-") || room._id.startsWith("jd-")) {
                const localBooking = {
                    _id: `local-${Date.now()}`,
                    hotel: {
                        name: room.hotel.name,
                        address: room.hotel.address
                    },
                    room: {
                        roomType: room.roomType || room.type || "Luxury Suite",
                        images: room.images || [room.image]
                    },
                    guests: bookingDate.guests,
                    checkInDate: bookingDate.checkIn,
                    checkOutDate: bookingDate.checkOut,
                    totalPrice: totalPrice,
                    status: isPaid ? "Confirmed" : "Pending Payment",
                    paymentMethod: methodLabel,
                    isPaid: isPaid
                }
                const saved = JSON.parse(localStorage.getItem("bharatstay_bookings") || "[]")
                saved.unshift(localBooking)
                localStorage.setItem("bharatstay_bookings", JSON.stringify(saved))
                
                toast.success(`Royal stay booked successfully! Atithi Devo Bhava!`)
                navigate('/my-bookings')
                return
            }

            // 2. Otherwise, write to actual Database backend
            const { data } = await axios.post('/api/bookings/book', {
                room: room._id,
                checkInDate: bookingDate.checkIn,
                checkOutDate: bookingDate.checkOut,
                guests: bookingDate.guests,
                paymentMethod: methodLabel,
                isPaid: isPaid,
                totalPrice: totalPrice
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                toast.success(`Booking Confirmed! Atithi Devo Bhava!`)
                navigate('/my-bookings')
            } else {
                toast.error(data.message || "Failed to make reservation")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!room) return null

    return (
        <main className="jali-overlay min-h-screen pb-20 bg-background text-left font-inter">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-8">
                
                <Title 
                    align="left"
                    title="Confirm & Pay"
                    subTitle="Complete your reservation at this handpicked heritage sanctuary."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    
                    {/* Left Column: Payment Details */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-8">
                        
                        {/* Tab Selector */}
                        <div>
                            <h3 className="font-montserrat font-bold text-xs uppercase tracking-wider text-primary mb-4">Choose Payment Method</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                
                                {/* Card Tab */}
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`py-3 px-4 rounded-xl border font-montserrat font-bold text-xs tracking-wider uppercase transition-premium flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                                        paymentMethod === 'card' 
                                            ? 'border-secondary bg-secondary/5 text-secondary' 
                                            : 'border-gray-200 hover:border-primary text-gray-500 hover:text-primary'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">credit_card</span>
                                    Card
                                </button>

                                {/* UPI Tab */}
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`py-3 px-4 rounded-xl border font-montserrat font-bold text-xs tracking-wider uppercase transition-premium flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                                        paymentMethod === 'upi' 
                                            ? 'border-secondary bg-secondary/5 text-secondary' 
                                            : 'border-gray-200 hover:border-primary text-gray-500 hover:text-primary'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">qr_code_2</span>
                                    UPI
                                </button>

                                {/* NetBanking Tab */}
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('netbanking')}
                                    className={`py-3 px-4 rounded-xl border font-montserrat font-bold text-xs tracking-wider uppercase transition-premium flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                                        paymentMethod === 'netbanking' 
                                            ? 'border-secondary bg-secondary/5 text-secondary' 
                                            : 'border-gray-200 hover:border-primary text-gray-500 hover:text-primary'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">account_balance</span>
                                    Net Banking
                                </button>

                                {/* Pay during check in Tab */}
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('checkin')}
                                    className={`py-3 px-4 rounded-xl border font-montserrat font-bold text-xs tracking-wider uppercase transition-premium flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                                        paymentMethod === 'checkin' 
                                            ? 'border-secondary bg-secondary/5 text-secondary' 
                                            : 'border-gray-200 hover:border-primary text-gray-500 hover:text-primary'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">payments</span>
                                    Check-In
                                </button>

                            </div>
                        </div>

                        {/* Interactive Form Panel */}
                        <form onSubmit={handleConfirmBooking} className="space-y-6">
                            
                            {/* Option 1: Card Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    
                                    {/* Visual Royal Card Display */}
                                    <div className="bg-gradient-to-br from-primary to-slate-900 border border-white/10 rounded-2xl p-5 text-white shadow-md relative overflow-hidden font-montserrat flex flex-col justify-between h-44 w-full sm:w-80 mx-auto transition-transform duration-500 hover:rotate-1">
                                        <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/5 rounded-full blur-2xl"></div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-extrabold tracking-widest text-amber-300 uppercase">BharatStay Elite Club</span>
                                            <span className="material-symbols-outlined text-amber-400 text-2xl">hotel_class</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-lg tracking-widest font-semibold font-mono text-amber-100/90">
                                                {cardDetails.number || '•••• •••• •••• ••••'}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="text-left">
                                                    <span className="text-[7px] text-slate-400 uppercase tracking-wider block">Cardholder</span>
                                                    <span className="text-xs font-bold uppercase truncate max-w-[150px] inline-block">{cardDetails.name || 'Your Name'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[7px] text-slate-400 uppercase tracking-wider block">Expires</span>
                                                    <span className="text-xs font-bold font-mono">{cardDetails.expiry || 'MM/YY'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Card Number</label>
                                            <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:border-primary transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-sm mr-2">credit_card</span>
                                                <input 
                                                    type="text"
                                                    name="number"
                                                    value={cardDetails.number}
                                                    onChange={handleCardChange}
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    className="w-full bg-transparent outline-none text-sm font-semibold text-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Cardholder Name</label>
                                            <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:border-primary transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-sm mr-2">person</span>
                                                <input 
                                                    type="text"
                                                    name="name"
                                                    value={cardDetails.name}
                                                    onChange={handleCardChange}
                                                    placeholder="As printed on card"
                                                    className="w-full bg-transparent outline-none text-sm font-semibold text-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Expiry Date</label>
                                            <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:border-primary transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-sm mr-2">calendar_today</span>
                                                <input 
                                                    type="text"
                                                    name="expiry"
                                                    value={cardDetails.expiry}
                                                    onChange={handleCardChange}
                                                    placeholder="MM/YY"
                                                    className="w-full bg-transparent outline-none text-sm font-semibold text-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">CVV</label>
                                            <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:border-primary transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-sm mr-2">lock</span>
                                                <input 
                                                    type="password"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardChange}
                                                    placeholder="•••"
                                                    className="w-full bg-transparent outline-none text-sm font-semibold text-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Option 2: UPI Form */}
                            {paymentMethod === 'upi' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl max-w-xs mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setUpiSubMethod('id')}
                                            className={`flex-1 py-1.5 px-3 rounded-lg font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${upiSubMethod === 'id' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                                        >
                                            Enter UPI ID
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUpiSubMethod('qr')}
                                            className={`flex-1 py-1.5 px-3 rounded-lg font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${upiSubMethod === 'qr' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                                        >
                                            Scan QR Code
                                        </button>
                                    </div>

                                    {upiSubMethod === 'id' ? (
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Enter UPI ID</label>
                                            <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:border-primary transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-sm mr-2">alternate_email</span>
                                                <input 
                                                    type="text"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                    placeholder="e.g. yourname@upi"
                                                    className="w-full bg-transparent outline-none text-sm font-semibold text-primary"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 font-inter">A request will be sent to your UPI App to approve payment.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center bg-slate-50 border border-gray-150 rounded-2xl p-6 text-center space-y-4">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">BharatStay UPI QR Gateway</div>
                                            
                                            {/* Stylized high-fidelity QR Code mock using vector graphics */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 relative">
                                                <svg width="140" height="140" viewBox="0 0 100 100" className="text-primary mx-auto">
                                                    <path d="M 0 0 L 25 0 M 0 0 L 0 25 M 75 0 L 100 0 M 100 0 L 100 25 M 0 100 L 25 100 M 0 100 L 0 75 M 100 100 L 75 100 M 100 100 L 100 75" stroke="#d4af37" strokeWidth="4" fill="none" />
                                                    <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                                                    <rect x="14" y="14" width="12" height="12" fill="white" />
                                                    <rect x="17" y="17" width="6" height="6" fill="currentColor" />

                                                    <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                                                    <rect x="74" y="14" width="12" height="12" fill="white" />
                                                    <rect x="77" y="17" width="6" height="6" fill="currentColor" />

                                                    <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                                                    <rect x="14" y="74" width="12" height="12" fill="white" />
                                                    <rect x="17" y="77" width="6" height="6" fill="currentColor" />

                                                    <rect x="42" y="42" width="16" height="16" rx="4" fill="#1e293b" />
                                                    <circle cx="50" cy="50" r="4" fill="#d4af37" />

                                                    <path d="M 40 15 H 60 V 20 H 40 Z M 15 40 H 20 V 60 H 15 Z M 45 25 H 55 V 35 H 45 Z M 80 40 H 85 V 60 H 80 Z M 40 75 H 60 V 80 H 40 Z M 75 80 H 80 V 85 H 75 Z M 85 75 H 90 V 80 H 85 Z M 65 65 H 70 V 70 H 65 Z" fill="currentColor" />
                                                    <path d="M 30 30 H 35 V 35 H 30 Z M 65 30 H 70 V 35 H 65 Z M 30 65 H 35 V 70 H 30 Z M 55 55 H 60 V 65 H 55 Z M 65 50 H 75 V 55 H 65 Z M 25 45 H 35 V 50 H 25 Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <div className="text-sm font-montserrat font-bold text-primary">Scan with BHIM, GPay, PhonePe, or Paytm</div>
                                                <div className="text-xs text-gray-500 font-inter">Complete your secure payment of {currency}{totalPrice?.toLocaleString()}</div>
                                            </div>

                                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto">
                                                <span className="material-symbols-outlined text-sm animate-pulse">hourglass_top</span>
                                                QR expires in: {formatTimer()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Option 3: NetBanking Selection */}
                            {paymentMethod === 'netbanking' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Select Bank</label>
                                        <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2 bg-slate-50/50 focus-within:border-primary transition-colors">
                                            <span className="material-symbols-outlined text-gray-400 text-sm mr-2 ml-1.5">account_balance</span>
                                            <select 
                                                value={selectedBank}
                                                onChange={(e) => setSelectedBank(e.target.value)}
                                                className="w-full bg-transparent outline-none text-sm font-semibold text-primary cursor-pointer"
                                            >
                                                <option value="SBI">State Bank of India (SBI)</option>
                                                <option value="HDFC">HDFC Bank</option>
                                                <option value="ICICI">ICICI Bank</option>
                                                <option value="Axis">Axis Bank</option>
                                                <option value="PNB">Punjab National Bank</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Option 4: Pay At Hotel Check-In */}
                            {paymentMethod === 'checkin' && (
                                <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 space-y-2 text-slate-800">
                                    <h4 className="font-montserrat font-bold text-xs uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base">payments</span>
                                        No Pre-payment Required
                                    </h4>
                                    <p className="text-xs text-amber-900/80 leading-relaxed font-inter">
                                        You are choosing to pay directly at the front desk when you arrive at the property. No charges will be placed on your cards online today. BharatStay secures your rooms for this heritage retreat.
                                    </p>
                                </div>
                            )}

                            {/* Terms Checkbox */}
                            <div className="flex gap-2.5 items-start mt-6 text-xs text-gray-500 font-inter leading-relaxed">
                                <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5">verified_user</span>
                                <p>
                                    By completing this reservation, you agree to BharatStay's <span className="text-secondary hover:underline cursor-pointer">Cancellation Policy</span>, and authorize this transaction.
                                </p>
                            </div>

                            {/* Confirm Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-montserrat font-bold tracking-wider uppercase text-xs hover:shadow-lg transition-premium cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing Royal Handshake...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-sm font-bold">lock_open</span>
                                        {paymentMethod === 'checkin' ? 'Secure Stay & Pay Later' : `Pay & Confirm Stay (${currency}${totalPrice?.toLocaleString()})`}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Receipt Summary */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Mini Room Card */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 text-left">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                                <img src={room.images?.[0] || room.image} alt={room.hotel?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-montserrat font-extrabold text-sm text-primary leading-tight line-clamp-1">{room.hotel?.name}</h4>
                                <div className="flex items-center gap-0.5 text-gray-400 text-[10px]">
                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                    <span className="truncate">{room.hotel?.address}</span>
                                </div>
                                <span className="inline-block bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                    {room.roomType || room.type || "Luxury Suite"}
                                </span>
                            </div>
                        </div>

                        {/* Summary Details */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 text-left">
                            <h3 className="font-montserrat font-bold text-xs uppercase tracking-wider text-primary border-b border-gray-100 pb-3">Reservation Details</h3>
                            
                            <div className="grid grid-cols-2 gap-4 text-xs font-inter text-gray-600">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-0.5">Check-in</span>
                                    <span className="font-bold text-slate-800">{bookingDate.checkIn}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-0.5">Check-out</span>
                                    <span className="font-bold text-slate-800">{bookingDate.checkOut}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-0.5">Nights</span>
                                    <span className="font-bold text-slate-800">{totalNights} Nights</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-0.5">Guests</span>
                                    <span className="font-bold text-slate-800">{bookingDate.guests} Guests</span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Charge breakdown */}
                            <div className="space-y-3 font-inter text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Room Rate ({totalNights} nights)</span>
                                    <span>{currency}{((basePrice || 12500) * totalNights).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>BharatStay Service Fee</span>
                                    <span>{currency}{(serviceFee || 1250).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes (GST & Heritage Levy)</span>
                                    <span>{currency}{(taxes || 4500).toLocaleString()}</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between font-montserrat font-bold text-base text-primary">
                                    <span>Total Price</span>
                                    <span>{currency}{totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Secure reservation note */}
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 text-emerald-800 text-xs font-inter flex gap-3 text-left">
                            <span className="material-symbols-outlined text-emerald-600 text-xl font-bold">verified_user</span>
                            <div>
                                <span className="font-montserrat font-bold block text-[10px] uppercase tracking-wider mb-0.5">PCI-DSS Compliant</span>
                                <p className="text-emerald-900/70 font-inter">Your data is completely protected. Payments are fully encrypted using state-of-the-art 256-bit security keys.</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    )
}

export default Payment
