import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/quickStay-assets/assets'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'

const RoomDetails = () => {
    const { id } = useParams()
    const { currency } = useAppContext()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    useEffect(() => {
        const foundRoom = roomsDummyData.find(r => r._id === id)
        if (foundRoom) {
            setRoom(foundRoom)
            setMainImage(foundRoom.images[0])
        }
    }, [id])

    // Mock data for similar rooms to show under "Choose Your Room"
    const otherRooms = roomsDummyData.filter(r => r._id !== id).slice(0, 2);

    // Mock curated local experiences
    const experiences = [
        {
            title: "Pink City Sunrise Balloon Safari",
            type: "Guided tour • 3 hours",
            price: "8,500",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYnxXIKa_qwaAI8LEyjwDTt8BZ3oSoHOOoElVLtX2xHbfIT_U927oeD1l3uQEe9e_hsDjAbf7SGwS5jH40strZMYHuhXW15FSsXc5Ysq_FbAUDh3tSnuRuCPCuIMOZ62GHyFbyQdK-OwkSyGR9kcdM2aFSnhwvgoifQdRY38kjBNC1DkDo8TseMFMqi0ZJBuoykxbqcRGQmBvU7eO9UDjrBnVfpM8e8c9qDQlWmBEYr2xGExeOH-hPrR8C0biA8Pk3bjARZLS_P1sh",
            featured: true
        },
        {
            title: "Traditional Rajasthani Culinary Class",
            type: "Workshop • 4 hours",
            price: "3,200",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD87j4lxnW2IPH7lWc97Os3jIkweuUIUlbfHlXh5NJk8OeAheeh6k9mNaIfDSbLnn0FsrzU6ktptD0Yby9x4vShOy2eOA32PM46moW5XH1HqkyBcGqOD_b8zAK20f6PrmaPyFqBMQh-lpa26kiXV4VuffW2i6CC-cf6N0GRsqzanuieAwGBT85kgr03AdcTteGAVkh_aNdpGCwvnFz1CuS5CQtprPTxWaZyd0uhws7uNk0rh2j5H-4MTXSWXeKvdYyUz505Uu08hjoQ",
            featured: false
        },
        {
            title: "Night Photography at Amber Fort",
            type: "Night tour • 2.5 hours",
            price: "5,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qhbu_vUUUm3xkc6ORX1nBBznbhkvsYq-XN_gmfsNuxP54YyFXCSg6FBRrLy-nR8ubt0YMvhZc9lwX-I1B0HYX1FAtEHg3KhU7HYYrHqnfryJ1vmUy4Fab2YnC2JstKgesh1YxSezdtGRq0yfaVzzg0Qrgt5urNbi7FrfqUaDGQTA39-hsMSJmwq2TEw9i9IxKRPFUb9xaeVjHJkuYhUkUQlNrWCXl0TcyvyAeRw9rXE-cOfFA10XzX4VuhLNyhXawY2qX75WdLjT",
            featured: false
        }
    ];

    if (!room) return <div className="py-20 text-center font-montserrat">Loading...</div>;

    const basePrice = room.pricePerNight;
    const serviceFee = 1250;
    const taxes = 4500;
    const totalPrice = (basePrice * 3) + serviceFee + taxes;

    return (
        <main className="jali-pattern min-h-screen bg-slate-50/40 pb-20">
            
            {/* Header info bar */}
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 text-left">
                    <div>
                        <h1 className="font-montserrat text-3xl font-extrabold text-primary">{room.hotel.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                                <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                                <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                                <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                                <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                            </div>
                            <span className="font-inter text-xs text-gray-500 font-bold ml-1">
                                4.9 (1,240 Reviews) • {room.hotel.city}, India
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-slate-50 transition-premium shadow-sm text-xs font-bold font-montserrat text-primary cursor-pointer">
                            <span className="material-symbols-outlined text-sm">share</span>
                            Share
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-slate-50 transition-premium shadow-sm text-xs font-bold font-montserrat text-primary cursor-pointer">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            Save
                        </button>
                    </div>
                </div>

                {/* Bento Gallery layout */}
                <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[450px] rounded-3xl overflow-hidden shadow-ambient-md bg-white border border-gray-100 p-2">
                    {/* Large primary image */}
                    <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[0]} 
                            alt={room.hotel.name} 
                        />
                    </div>
                    {/* Small stacked image 1 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[1] || room.images[0]} 
                            alt={room.hotel.name} 
                        />
                    </div>
                    {/* Small stacked image 2 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[2] || room.images[0]} 
                            alt={room.hotel.name} 
                        />
                    </div>
                    {/* Medium bottom image */}
                    <div className="col-span-2 row-span-1 relative group overflow-hidden rounded-2xl">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[3] || room.images[0]} 
                            alt={room.hotel.name} 
                        />
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl font-montserrat font-bold text-xs text-primary shadow-sm flex items-center gap-1.5 cursor-pointer">
                            <span className="material-symbols-outlined text-sm">grid_view</span>
                            View all {room.images.length} photos
                        </div>
                    </div>
                </div>

            </div>

            {/* Content section */}
            <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-12 flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left block: Spec description */}
                <div className="w-full lg:w-5/12 space-y-8 text-left">
                    <div>
                        <h2 className="font-montserrat text-2xl font-extrabold text-primary mb-4">About this Heritage Gem</h2>
                        <p className="font-inter text-gray-500 leading-relaxed text-sm">
                            Experience royal hospitality in this floating marble marvel. Every corridor and suite has been meticulously restored to offer a sublime blend of historical grandeur and top-tier luxury combined with modern state-of-the-art facilities. Indulge in the true philosophy of <span className="text-secondary font-bold italic">"Atithi Devo Bhava"</span> as our dedicated staff caters to your every desire.
                        </p>
                    </div>

                    <div className="border-t border-gray-200/60 pt-8">
                        <h3 className="font-montserrat text-lg font-bold text-primary mb-4">Premium Amenities</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {room.amenities.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-full text-base font-bold">
                                        {item === "Free WiFi" ? "wifi" : item === "Room Service" ? "room_service" : item === "Pool Access" ? "pool" : "mountain_flag"}
                                    </span>
                                    <span className="font-inter text-sm font-semibold text-gray-600 uppercase tracking-wide text-[11px]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle block: Choose Your Room */}
                <div className="w-full lg:w-4/12 space-y-6 text-left">
                    <h2 className="font-montserrat text-2xl font-extrabold text-primary">Choose Your Room</h2>
                    <div className="space-y-6">
                        {otherRooms.map((r) => (
                            <div 
                                key={r._id} 
                                className="group bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient-md border border-gray-100 hover:border-secondary transition-premium cursor-pointer"
                            >
                                <div className="h-40 overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={r.images[0]} alt={r.hotel.name} />
                                </div>
                                <div className="p-5 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-montserrat text-base font-bold text-primary">{r.hotel.name}</h3>
                                        <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Rare Find</span>
                                    </div>
                                    <p className="font-inter text-xs text-gray-400">450 sq ft • City View • Balcony</p>
                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <span className="font-montserrat text-base font-bold text-primary">{currency}{r.pricePerNight}</span>
                                            <span className="font-inter text-[10px] text-gray-400">/night</span>
                                        </div>
                                        <button className="text-secondary font-bold text-xs uppercase tracking-widest font-montserrat">Details</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right block: Sticky reservation widget */}
                <div className="w-full lg:w-3/12">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-ambient-md sticky top-24 space-y-6 text-left">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                            <span className="font-montserrat text-2xl font-extrabold text-primary">{currency}{basePrice}</span>
                            <span className="font-inter text-xs text-gray-400 mb-1">per night</span>
                        </div>

                        {/* Date selection simulator */}
                        <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-3 border-r border-gray-200 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
                                <span className="text-[9px] font-bold uppercase text-gray-400 block">Check-in</span>
                                <span className="font-inter text-xs font-semibold text-gray-700">Oct 12, 2024</span>
                            </div>
                            <div className="p-3 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
                                <span className="text-[9px] font-bold uppercase text-gray-400 block">Check-out</span>
                                <span className="font-inter text-xs font-semibold text-gray-700">Oct 15, 2024</span>
                            </div>
                            <div className="col-span-2 p-3 border-t border-gray-200 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center">
                                <div>
                                    <span className="text-[9px] font-bold uppercase text-gray-400 block">Guests</span>
                                    <span className="font-inter text-xs font-semibold text-gray-700">2 Adults, 0 Children</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-400">keyboard_arrow_down</span>
                            </div>
                        </div>

                        {/* Fee breakups */}
                        <div className="space-y-3 font-inter text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>{currency}{basePrice} x 3 nights</span>
                                <span>{currency}{basePrice * 3}</span>
                            </div>
                            <div className="flex justify-between underline decoration-dotted decoration-gray-300">
                                <span>QuickStay Service Fee</span>
                                <span>{currency}{serviceFee}</span>
                            </div>
                            <div className="flex justify-between underline decoration-dotted decoration-gray-300">
                                <span>Taxes</span>
                                <span>{currency}{taxes}</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-montserrat font-bold text-lg text-primary">
                                <span>Total</span>
                                <span>{currency}{totalPrice}</span>
                            </div>
                        </div>

                        <button className="w-full bg-secondary hover:bg-secondary-dark text-white py-4 rounded-xl font-montserrat font-bold hover:shadow-lg transition-premium cursor-pointer text-sm tracking-wider uppercase">
                            Book Now
                        </button>
                        <p className="text-center text-[10px] text-gray-400 font-inter">You won't be charged yet</p>
                    </div>
                </div>

            </section>

            {/* Bottom experiences block */}
            <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-16 bg-slate-50 border-t border-gray-200/50 rounded-3xl mt-12">
                <div className="flex justify-between items-end mb-8 text-left">
                    <div>
                        <h2 className="font-montserrat text-2xl font-extrabold text-primary mb-1">Curated Local Experiences</h2>
                        <p className="font-inter text-sm text-gray-400">Handpicked adventures near your stay</p>
                    </div>
                    <button className="text-primary font-bold text-xs uppercase tracking-widest font-montserrat hover:underline flex items-center gap-1 cursor-pointer">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {experiences.map((exp, index) => (
                        <div key={index} className="group cursor-pointer text-left flex flex-col">
                            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative shadow-sm border border-gray-100">
                                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={exp.image} alt={exp.title} />
                                {exp.featured && (
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-bold text-primary shadow-sm uppercase tracking-wide">
                                        Featured
                                    </div>
                                )}
                            </div>
                            <h3 className="font-montserrat text-base font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{exp.title}</h3>
                            <p className="font-inter text-xs text-gray-400 mt-1 mb-2">{exp.type}</p>
                            <p className="font-montserrat text-sm font-bold text-primary">
                                ₹{exp.price} <span className="font-inter text-xs text-gray-400 font-normal">/ person</span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    )
}

export default RoomDetails
