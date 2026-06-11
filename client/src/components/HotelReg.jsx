import React, { useState } from 'react'
import { assets } from '../assets/quickStay-assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const HotelReg = () => {

    const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext()

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    // List of Indian States and Union Territories (UTs)
    const indianStatesAndUTs = [
        // States
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        // Union Territories
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", 
        "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/hotels`, 
                { name, contact, address, city, state }, 
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            )

            if (data.success) {
                toast.success(data.message)
                setIsOwner(true)
                setShowHotelReg(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div onClick={() => setShowHotelReg(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4'>

            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className='flex bg-white rounded-xl shadow-ambient-md max-w-4xl w-full overflow-hidden border border-gray-100 font-inter'>
                <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-l-xl hidden md:block object-cover max-h-[580px]' />

                <div className='relative flex flex-col items-start md:w-1/2 p-6 md:p-10 w-full'>
                    <img src={assets.closeIcon} alt="close-icon" className='absolute top-6 right-6 h-4 w-4 cursor-pointer hover:scale-110 transition-premium opacity-70' onClick={() => setShowHotelReg(false)} />
                    
                    <h2 className='text-xl md:text-2xl font-extrabold font-montserrat text-primary mt-2'>Register Your Hotel</h2>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Join WanderBee's premium booking network to list your rooms and unlock exclusive bookings.</p>

                    {/* Hotel Name */}
                    <div className='w-full mt-4'>
                        <label htmlFor="name" className='font-montserrat font-bold text-[10px] uppercase tracking-wider text-gray-400'>Hotel Name</label>
                        <input id='name' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='e.g. Grand Plaza Hotel' className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg w-full px-3 py-2.5 mt-1 outline-none font-inter text-sm bg-slate-50/50 transition-premium' required />
                    </div>

                    {/* Contact */}
                    <div className='w-full mt-3'>
                        <label htmlFor="contact" className='font-montserrat font-bold text-[10px] uppercase tracking-wider text-gray-400'>Phone Number</label>
                        <input id='contact' type="text" onChange={(e) => setContact(e.target.value)} value={contact} placeholder='+1 (555) 019-2834' className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg w-full px-3 py-2.5 mt-1 outline-none font-inter text-sm bg-slate-50/50 transition-premium' required />
                    </div>

                    {/* Address */}
                    <div className='w-full mt-3'>
                        <label htmlFor="address" className='font-montserrat font-bold text-[10px] uppercase tracking-wider text-gray-400'>Address</label>
                        <input id='address' type="text" onChange={(e) => setAddress(e.target.value)} value={address} placeholder='e.g. 101 Plaza Boulevard' className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg w-full px-3 py-2.5 mt-1 outline-none font-inter text-sm bg-slate-50/50 transition-premium' required />
                    </div>

                    {/* City & State Side-by-side */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-3'>
                        <div>
                            <label htmlFor="city" className='font-montserrat font-bold text-[10px] uppercase tracking-wider text-gray-400'>City</label>
                            <input id='city' onChange={(e) => setCity(e.target.value)} value={city} type="text" placeholder='e.g. Udaipur' className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg w-full px-3 py-2.5 mt-1 outline-none font-inter text-sm bg-slate-50/50 transition-premium' required />
                        </div>
                        <div>
                            <label htmlFor="state" className='font-montserrat font-bold text-[10px] uppercase tracking-wider text-gray-400'>State / UT</label>
                            <select id="state" onChange={(e) => setState(e.target.value)} value={state} className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg w-full px-3 py-2.5 mt-1 outline-none font-inter text-sm bg-slate-50/50 transition-premium text-gray-800 cursor-pointer' required>
                                <option value="">Select State / UT</option>
                                {indianStatesAndUTs.map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" className='bg-secondary hover:bg-secondary-dark text-white font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg shadow-sm transition-premium cursor-pointer mt-6 w-full sm:w-auto'>
                        Register Hotel
                    </button>
                </div>
            </form>

        </div>
    )
}

export default HotelReg
