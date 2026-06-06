import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/quickStay-assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {
    const { axios, getToken } = useAppContext()

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    })

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: 0,
        cancellationPolicy: 'Free Cancellation',
        amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
        }
    })

    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Check If All Inputs are Filled correctly
        if (!inputs.roomType || !inputs.pricePerNight || !Object.values(images).some(image => image)) {
            toast.error("Please fill in all the details and upload at least one image")
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData()
            formData.append('roomType', inputs.roomType)
            formData.append('pricePerNight', inputs.pricePerNight)
            formData.append('cancellationPolicy', inputs.cancellationPolicy)
            // Converting Amenities to Array & Keeping only enabled Amenities
            const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
            formData.append('amenities', JSON.stringify(amenities))

            // Adding Images to FormData
            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const { data } = await axios.post('/api/rooms/', formData, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if (data.success) {
                toast.success(data.message)
                setInputs({
                    roomType: '',
                    pricePerNight: 0,
                    cancellationPolicy: 'Free Cancellation',
                    amenities: {
                        'Free WiFi': false,
                        'Free Breakfast': false,
                        'Room Service': false,
                        'Mountain View': false,
                        'Pool Access': false,
                    }
                })
                setImages({1: null, 2: null, 3: null, 4:null})
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="font-inter max-w-4xl pb-20 text-left">
            <Title 
                align='left' 
                title='Add New Suite' 
                subTitle='Fill in the suite details, pricing, and premium amenities to list your room on WanderBee.' 
            />

            {/* Upload Area For Image */}
            <div className="mt-10 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <p className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-1 flex items-center gap-1.5'>
                    <span className="material-symbols-outlined text-lg text-secondary">add_a_photo</span>
                    Suite Gallery Images
                </p>
                <p className="text-[11px] text-gray-400 mb-4">Upload up to 4 high-definition photos of your heritage room. At least 1 image is required.</p>
                
                <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                    {Object.keys(images).map((key) => (
                        <label htmlFor={`roomImage${key}`} key={key} className="group relative cursor-pointer">
                            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 hover:border-secondary flex items-center justify-center overflow-hidden transition-all duration-300 bg-slate-50/50 hover:bg-white hover:scale-[1.03]">
                                {images[key] ? (
                                    <img className='w-full h-full object-cover group-hover:scale-105 transition-premium' src={URL.createObjectURL(images[key])} alt="" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-75 transition-premium">
                                        <span className="material-symbols-outlined text-2xl mb-1">cloud_upload</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Upload {key}</span>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                accept='image/*' 
                                id={`roomImage${key}`} 
                                hidden
                                onChange={e => setImages({ ...images, [key]: e.target.files[0] })} 
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Room Details Form Area */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm'>
                
                {/* Room Type select */}
                <div className='flex flex-col'>
                    <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2.5 flex items-center gap-1.5'>
                        <span className="material-symbols-outlined text-base">bedroom_parent</span>
                        Room Type
                    </label>
                    <select 
                        value={inputs.roomType} 
                        onChange={e => setInputs({ ...inputs, roomType: e.target.value })} 
                        className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium cursor-pointer font-semibold'
                        required
                    >
                        <option value="">Select Suite Class</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Luxury Room">Luxury Room</option>
                        <option value="Family Suite">Family Suite</option>
                    </select>
                </div>

                {/* Price input */}
                <div className='flex flex-col'>
                    <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2.5 flex items-center gap-1.5'>
                        <span className="material-symbols-outlined text-base">payments</span>
                        Price <span className='font-inter text-[10px] font-normal text-gray-400 capitalize'>/ Night (₹)</span>
                    </label>
                    <input 
                        type="number" 
                        placeholder="e.g. 15000" 
                        className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold' 
                        value={inputs.pricePerNight} 
                        onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })} 
                        required
                    />
                </div>

                {/* Cancellation Policy select */}
                <div className='flex flex-col'>
                    <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2.5 flex items-center gap-1.5'>
                        <span className="material-symbols-outlined text-base">cancel</span>
                        Cancellation
                    </label>
                    <select 
                        value={inputs.cancellationPolicy} 
                        onChange={e => setInputs({ ...inputs, cancellationPolicy: e.target.value })} 
                        className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium cursor-pointer font-semibold'
                        required
                    >
                        <option value="Free Cancellation">Free Cancellation</option>
                        <option value="Cancellation Fee Applicable">Cancellation Fee Applicable</option>
                    </select>
                </div>
            </div>

            {/* Room Amenities Checkboxes */}
            <div className="mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <p className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-5 flex items-center gap-1.5'>
                    <span className="material-symbols-outlined text-lg text-secondary">room_service</span>
                    Suite Amenities & Services
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(inputs.amenities).map((amenity, index) => (
                        <label 
                            key={index} 
                            className={`flex items-center gap-3.5 p-4 border border-slate-100 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]
                                ${inputs.amenities[amenity] 
                                    ? "bg-primary/5 border-primary/20 text-primary" 
                                    : "hover:bg-slate-50/50 text-gray-600"
                                }
                            `}
                        >
                            <input 
                                type="checkbox" 
                                id={`amenities${index + 1}`} 
                                checked={inputs.amenities[amenity]} 
                                onChange={() => setInputs({
                                    ...inputs, amenities: {
                                        ...inputs.amenities, [amenity]: !inputs.amenities[amenity]
                                    }
                                })} 
                                className="rounded text-primary focus:ring-primary border-gray-300 w-4 h-4 cursor-pointer accent-secondary"
                            />
                            <span className="text-xs font-bold uppercase tracking-wider select-none font-montserrat">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className='bg-secondary hover:bg-secondary-dark disabled:bg-slate-200 text-white font-montserrat font-extrabold text-xs uppercase tracking-widest py-4 px-10 rounded-xl shadow-md mt-8 transition-premium cursor-pointer active:scale-95'
            >
                {loading ? 'Adding Suite...' : 'Add Suite to Listings'}
            </button>
        </form>
    )
}

export default AddRoom