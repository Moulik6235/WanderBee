import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {
    const { axios, getToken, currency } = useAppContext()
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingRoomId, setEditingRoomId] = useState(null)
    const [editingPrice, setEditingPrice] = useState("")
    const [editingCancellation, setEditingCancellation] = useState("")
    const [savingRoomId, setSavingRoomId] = useState(null)

    const fetchOwnerRooms = async () => {
        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await axios.get('/api/rooms/owner', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setRooms(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleAvailability = async (roomId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/rooms/toggle-availabi', 
                { roomId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                toast.success(data.message)
                setRooms(prev => prev.map(room => 
                    room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
                ))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const startEditing = (room) => {
        setEditingRoomId(room._id)
        setEditingPrice(room.pricePerNight)
        setEditingCancellation(room.cancellationPolicy || "Free Cancellation")
    }

    const cancelEditing = () => {
        setEditingRoomId(null)
        setEditingPrice("")
        setEditingCancellation("")
    }

    const savePrice = async (roomId) => {
        const parsedPrice = Number(editingPrice)
        if (!editingPrice || isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error("Please enter a valid price greater than 0")
            return
        }
        try {
            setSavingRoomId(roomId)
            const token = await getToken()
            const { data } = await axios.post('/api/rooms/update-price', 
                { 
                    roomId, 
                    pricePerNight: parsedPrice, 
                    cancellationPolicy: editingCancellation 
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                toast.success(data.message)
                setRooms(prev => prev.map(room => 
                    room._id === roomId ? { 
                        ...room, 
                        pricePerNight: parsedPrice, 
                        cancellationPolicy: editingCancellation 
                    } : room
                ))
                setEditingRoomId(null)
                setEditingPrice("")
                setEditingCancellation("")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSavingRoomId(null)
        }
    }

    useEffect(() => {
        fetchOwnerRooms()
    }, [])

    return (
        <div className="font-inter max-w-5xl text-left">
            <Title 
                align='left' 
                title='Room Listings' 
                subTitle='View and manage all registered suites on the platform. Toggle availability instantly.' 
            />
            
            <div className="flex justify-between items-center mt-10 mb-6">
                <p className='font-montserrat font-extrabold text-xs uppercase tracking-widest text-primary flex items-center gap-2'>
                    <span className="material-symbols-outlined text-lg">view_list</span>
                    All Active Suites ({rooms.length})
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold font-montserrat uppercase tracking-wider text-gray-400 mt-4">Loading your suites...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm px-6 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">hotel</span>
                    <h3 className="font-montserrat text-sm font-bold text-primary uppercase tracking-wider">No Suites Listed</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">You haven't listed any rooms yet. Head over to the 'Add Room' page to register your first suite.</p>
                </div>
            ) : (
                <div className='w-full border border-slate-100 text-left rounded-3xl shadow-sm overflow-hidden bg-white'>
                    <div className="overflow-x-auto">
                        <table className='w-full border-collapse'>
                            <thead className='bg-slate-50/70 border-b border-slate-100'>
                                <tr>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary'>Suite Type</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary max-sm:hidden'>Amenities</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary'>Price / Night</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary'>Cancellation</th>
                                    <th className='py-4 px-6 font-montserrat font-extrabold text-xs uppercase tracking-wider text-primary text-center'>Status</th>
                                </tr>
                            </thead>

                            <tbody className='text-sm text-gray-700 divide-y divide-slate-50'>
                                {rooms.map((item, index) => (
                                    <tr key={item._id || index} className="hover:bg-slate-50/40 transition-premium">
                                        {/* Suite Type */}
                                        <td className='py-4 px-6'>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                                                    {item.images && item.images[0] ? (
                                                        <img src={item.images[0]} alt={item.roomType} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-primary text-xl">bed</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className='font-bold text-slate-800 block'>{item.roomType}</span>
                                                    <span className='text-[10px] text-emerald-600 font-semibold uppercase tracking-wider'>WanderBee Class</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Amenities */}
                                        <td className='py-4 px-6 max-sm:hidden'>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.amenities.map((amenity, idx) => (
                                                    <span key={idx} className="bg-primary/5 text-primary text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className='py-4 px-6 font-bold text-slate-900'>
                                            {editingRoomId === item._id ? (
                                                <div className="flex items-center gap-1.5 max-w-[170px]" onClick={(e) => e.stopPropagation()}>
                                                    <div className="relative flex items-center">
                                                        <span className="absolute left-2.5 text-xs text-gray-400 font-semibold">₹</span>
                                                        <input 
                                                            type="number"
                                                            value={editingPrice}
                                                            onChange={(e) => setEditingPrice(e.target.value)}
                                                            className="w-24 pl-6 pr-1.5 py-1.5 border border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs font-semibold outline-none bg-slate-50"
                                                            min="1"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => savePrice(item._id)}
                                                        disabled={savingRoomId === item._id}
                                                        className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center"
                                                        title="Save Suite Details"
                                                    >
                                                        {savingRoomId === item._id ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                        )}
                                                    </button>
                                                    <button 
                                                        onClick={cancelEditing}
                                                        disabled={savingRoomId === item._id}
                                                        className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center"
                                                        title="Cancel"
                                                    >
                                                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group/price cursor-pointer w-max" onClick={() => startEditing(item)}>
                                                    <span>₹{item.pricePerNight.toLocaleString()}</span>
                                                    <span className="material-symbols-outlined text-xs text-gray-400 opacity-0 group-hover/price:opacity-100 transition-opacity hover:text-primary" title="Edit Price">edit</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Cancellation Policy */}
                                        <td className='py-4 px-6'>
                                            {editingRoomId === item._id ? (
                                                <select
                                                    value={editingCancellation}
                                                    onChange={(e) => setEditingCancellation(e.target.value)}
                                                    className="border border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs font-semibold p-1.5 bg-slate-50 outline-none w-full max-w-[170px] cursor-pointer"
                                                >
                                                    <option value="Free Cancellation">Free Cancellation</option>
                                                    <option value="Cancellation Fee Applicable">Cancellation Fee Applicable</option>
                                                </select>
                                            ) : (
                                                <div 
                                                    className="flex items-center gap-2 group/cancel cursor-pointer w-max" 
                                                    onClick={() => startEditing(item)}
                                                >
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                        item.cancellationPolicy === 'Cancellation Fee Applicable'
                                                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    }`}>
                                                        {item.cancellationPolicy || "Free Cancellation"}
                                                    </span>
                                                    <span className="material-symbols-outlined text-xs text-gray-400 opacity-0 group-hover/cancel:opacity-100 transition-opacity hover:text-primary" title="Edit Policy">edit</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Availability Switch Toggle */}
                                        <td className='py-4 px-6 text-center'>
                                            <div className="inline-flex items-center justify-center">
                                                <label className='relative inline-flex items-center cursor-pointer justify-center'>
                                                    <input 
                                                        type="checkbox" 
                                                        className='sr-only peer' 
                                                        checked={item.isAvailable} 
                                                        onChange={() => toggleAvailability(item._id)}
                                                    />
                                                    <div className='w-11 h-6 bg-slate-200 peer-checked:bg-primary rounded-full transition-colors duration-300'></div>
                                                    <span className='absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out peer-checked:translate-x-5 shadow-sm'></span>
                                                </label>
                                                <span className="text-[10px] font-bold text-slate-400 ml-2.5 uppercase tracking-wider">
                                                    {item.isAvailable ? "Active" : "Paused"}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListRoom
