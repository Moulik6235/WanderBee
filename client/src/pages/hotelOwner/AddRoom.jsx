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
        <form onSubmit={onSubmitHandler} className="font-inter max-w-3xl pb-20">
            <Title align='left' title='Add Room' subTitle='Fill in the room details, pricing, and amenities to register a new suite on QuickStay.' />

            {/* Upload Area For Image */}
            <div className="mt-8 border-b border-gray-100 pb-8">
                <p className='font-montserrat font-bold text-xs uppercase tracking-wider text-primary mb-3'>Room Gallery Images</p>
                <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                    {Object.keys(images).map((key) => (
                        <label htmlFor={`roomImage${key}`} key={key} className="group relative cursor-pointer">
                            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-secondary flex items-center justify-center overflow-hidden transition-premium bg-slate-50/50">
                                {images[key] ? (
                                    <img className='w-full h-full object-cover group-hover:scale-105 transition-premium' src={URL.createObjectURL(images[key])} alt="" />
                                ) : (
                                    <img className='w-8 h-8 opacity-40 group-hover:opacity-75 transition-premium' src={assets.uploadArea} alt="" />
                                )}
                            </div>
                            <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                                onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                        </label>
                    ))}
                </div>
            </div>

            {/* Room Details Form Area */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pb-8 border-b border-gray-100'>
                <div className='flex flex-col'>
                    <label className='font-montserrat font-bold text-xs uppercase tracking-wider text-primary mb-2'>Room Type</label>
                    <select value={inputs.roomType} onChange={e => setInputs({ ...inputs, roomType: e.target.value })} className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium'>
                        <option value="">Select Suite Class</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Luxury Room">Luxury Room</option>
                        <option value="Family Suite">Family Suite</option>
                    </select>
                </div>

                <div className='flex flex-col'>
                    <label className='font-montserrat font-bold text-xs uppercase tracking-wider text-primary mb-2'>
                        Price <span className='font-inter text-[10px] font-normal text-gray-400 capitalize'>/ Night (USD)</span>
                    </label>
                    <input type="number" placeholder='0' className='border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium' value={inputs.pricePerNight} onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })} />
                </div>
            </div>

            {/* Room Amenities Checkboxes */}
            <div className="mt-8">
                <p className='font-montserrat font-bold text-xs uppercase tracking-wider text-primary mb-4'>Suite Amenities & Services</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.keys(inputs.amenities).map((amenity, index) => (
                        <label key={index} className='flex items-center gap-3 p-3.5 border border-gray-200/60 rounded-lg hover:bg-slate-50/50 cursor-pointer transition-premium'>
                            <input 
                                type="checkbox" 
                                id={`amenities${index + 1}`} 
                                checked={inputs.amenities[amenity]} 
                                onChange={() => setInputs({
                                    ...inputs, amenities: {
                                        ...inputs.amenities, [amenity]: !inputs.amenities[amenity]
                                    }
                                })} 
                                className="rounded text-primary focus:ring-primary border-gray-300 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-gray-700 select-none">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" disabled={loading} className='bg-secondary hover:bg-secondary-dark disabled:bg-gray-300 text-white font-montserrat font-bold text-xs uppercase tracking-widest py-3.5 px-10 rounded-lg shadow-sm mt-8 transition-premium cursor-pointer'>
                {loading ? 'Adding Suite...' : 'Add Room'}
            </button>
        </form>
    )
}

export default AddRoom