import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddExperience = () => {
    const { axios, getToken, currency } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [listLoading, setListLoading] = useState(true)
    const [experiences, setExperiences] = useState([])

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    })

    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        timing: '',
        category: 'Adventure',
        duration: '2 hours',
    })

    const categories = [
        'Adventure',
        'Culinary',
        'Art & History',
        'Wellness'
    ]

    const fetchOwnerExperiences = async () => {
        try {
            setListLoading(true)
            const token = await getToken()
            const { data } = await axios.get('/api/experiences/owner', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setExperiences(data.experiences)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setListLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        if (!inputs.title || !inputs.description || !inputs.price || !inputs.location || !inputs.timing) {
            toast.error("Please fill in all the required details")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', inputs.title)
            formData.append('description', inputs.description)
            formData.append('price', inputs.price)
            formData.append('location', inputs.location)
            formData.append('timing', inputs.timing)
            formData.append('category', inputs.category)
            formData.append('duration', inputs.duration)

            // Add images to FormData
            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post('/api/experiences', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                toast.success(data.message)
                setInputs({
                    title: '',
                    description: '',
                    price: '',
                    location: '',
                    timing: '',
                    category: 'Adventure',
                    duration: '2 hours',
                })
                setImages({ 1: null, 2: null, 3: null, 4: null })
                fetchOwnerExperiences() // refresh list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteExperience = async (id) => {
        if (!window.confirm("Are you sure you want to delete this experience?")) return;

        try {
            const token = await getToken()
            const { data } = await axios.delete(`/api/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                setExperiences(prev => prev.filter(exp => exp._id !== id))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchOwnerExperiences()
    }, [])

    return (
        <div className="font-inter max-w-4xl pb-20 text-left">
            <Title 
                align='left' 
                title='Manage & Add Experiences' 
                subTitle='Offer bespoke activities, culinary masterclasses, or local tours to your guests.' 
            />

            {/* Form Area */}
            <form onSubmit={onSubmitHandler} className="mt-10 space-y-6">
                
                {/* Images Upload */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <p className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-1 flex items-center gap-1.5'>
                        <span className="material-symbols-outlined text-lg text-secondary">add_a_photo</span>
                        Experience Gallery Images
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">Upload up to 4 photos representing this experience. At least 1 image is recommended.</p>
                    
                    <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                        {Object.keys(images).map((key) => (
                            <label htmlFor={`expImage${key}`} key={key} className="group relative cursor-pointer">
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
                                    id={`expImage${key}`} 
                                    hidden
                                    onChange={e => setImages({ ...images, [key]: e.target.files[0] })} 
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Form fields */}
                <div className='bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className='flex flex-col'>
                            <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                                <span className="material-symbols-outlined text-base">local_activity</span>
                                Experience Title
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Desert Balloon Safari" 
                                className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold' 
                                value={inputs.title} 
                                onChange={e => setInputs({ ...inputs, title: e.target.value })} 
                                required
                            />
                        </div>

                        {/* Location */}
                        <div className='flex flex-col'>
                            <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                                <span className="material-symbols-outlined text-base">location_on</span>
                                Location
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Udaipur, Rajasthan" 
                                className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold' 
                                value={inputs.location} 
                                onChange={e => setInputs({ ...inputs, location: e.target.value })} 
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Price */}
                        <div className='flex flex-col'>
                            <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                                <span className="material-symbols-outlined text-base">payments</span>
                                Price (₹) <span className='font-inter text-[10px] font-normal text-gray-400 capitalize'>/ person</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 3500" 
                                className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold' 
                                value={inputs.price} 
                                onChange={e => setInputs({ ...inputs, price: e.target.value })} 
                                required
                            />
                        </div>

                        {/* Timing */}
                        <div className='flex flex-col'>
                            <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                                <span className="material-symbols-outlined text-base">schedule</span>
                                Timing / Slot
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. 06:00 AM - 09:00 AM" 
                                className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold' 
                                value={inputs.timing} 
                                onChange={e => setInputs({ ...inputs, timing: e.target.value })} 
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div className='flex flex-col'>
                            <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                                <span className="material-symbols-outlined text-base">hourglass_empty</span>
                                Duration
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. 3 hours" 
                                className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold' 
                                value={inputs.duration} 
                                onChange={e => setInputs({ ...inputs, duration: e.target.value })} 
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category */}
                        <div className='flex flex-col'>
                            <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                                <span className="material-symbols-outlined text-base">category</span>
                                Category
                            </label>
                            <select 
                                value={inputs.category} 
                                onChange={e => setInputs({ ...inputs, category: e.target.value })} 
                                className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium cursor-pointer font-semibold'
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='flex flex-col'>
                        <label className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5'>
                            <span className="material-symbols-outlined text-base">description</span>
                            Description
                        </label>
                        <textarea 
                            rows="4"
                            placeholder="Provide a captivating description of this experience, what guests will do, see, and learn..." 
                            className='border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 w-full bg-slate-50/50 outline-none text-sm text-gray-800 transition-premium font-semibold resize-none' 
                            value={inputs.description} 
                            onChange={e => setInputs({ ...inputs, description: e.target.value })} 
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className='bg-secondary hover:bg-secondary-dark disabled:bg-slate-200 text-white font-montserrat font-extrabold text-xs uppercase tracking-widest py-4 px-10 rounded-xl shadow-md transition-premium cursor-pointer active:scale-95'
                >
                    {loading ? 'Adding Experience...' : 'List Experience'}
                </button>
            </form>

            {/* List of Owner Experiences at the bottom */}
            <div className="mt-16">
                <p className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary flex items-center gap-2 mb-6'>
                    <span className="material-symbols-outlined text-lg">celebration</span>
                    Your Listed Experiences ({experiences.length})
                </p>

                {listLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : experiences.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm px-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">local_activity</span>
                        <h3 className="font-montserrat text-xs font-bold text-primary uppercase tracking-wider">No Experiences Listed</h3>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">Offer local culture, treks, or wellness classes to your guests by filling the form above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {experiences.map((exp) => (
                            <div key={exp._id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden p-4 shadow-sm flex gap-4 hover:shadow-md transition-premium">
                                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                    {exp.images && exp.images[0] ? (
                                        <img src={exp.images[0]} alt={exp.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined">image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <span className="bg-primary/5 text-primary text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                                {exp.category}
                                            </span>
                                            <button 
                                                onClick={() => handleDeleteExperience(exp._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1 flex items-center justify-center cursor-pointer"
                                                title="Delete Experience"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                        <h4 className="font-montserrat font-bold text-sm text-primary mt-1.5 truncate">{exp.title}</h4>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{exp.location}</p>
                                        <p className="text-[10px] text-gray-500 font-medium mt-1">🕒 {exp.timing} ({exp.duration})</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                                        <span className="font-montserrat font-extrabold text-xs text-primary">₹{exp.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddExperience
