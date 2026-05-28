import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useClerk } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

const Profile = () => {
    const { user } = useAppContext()
    const { openSignIn } = useClerk()
    const [activeTab, setActiveTab] = useState('personal')
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        phone: "+91 98765 43210",
        address: "Mewar Enclave, Udaipur, Rajasthan",
        prefStay: "Palace Hotel",
        prefDiet: "Ayurvedic Vegetarian",
        language: "Hindi & English"
    })

    const handleSave = (e) => {
        e.preventDefault()
        setIsEditing(false)
        toast.success("Your heritage stay preferences have been successfully updated!")
    }

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-20 text-center jali-pattern">
                <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200/80 shadow-2xl max-w-lg w-full flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary text-7xl mb-6 animate-pulse">lock</span>
                    <h2 className="font-montserrat text-2xl font-extrabold text-primary mb-3">Join the Heritage Circle</h2>
                    <p className="font-inter text-gray-500 text-sm mb-8 leading-relaxed">
                        Sign in to view your royal profile, track your exclusive heritage bookings, and access gold-tier privileges.
                    </p>
                    <button 
                        onClick={openSignIn}
                        className="bg-primary text-white font-montserrat font-semibold px-8 py-3.5 rounded-xl hover:bg-secondary transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                        Sign In / Register
                    </button>
                </div>
            </div>
        )
    }

    return (
        <main className="jali-overlay min-h-screen pb-20 bg-background text-left">
            {/* Top Header Background */}
            <div className="relative h-64 bg-primary overflow-hidden">
                <img 
                    className="w-full h-full object-cover opacity-35" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9rmuOj5iWmWeJucgaxzlcgax4VI7caas8PUTwdrI0-5ZTw7s58TUoJzSGhS_bqTU5LGsUDGAqhGXYK5HIiueDAI4G_5uuI81won73xQzS8U_z71uBXFdd5UlzakF-wOUSm0WYwu7e9iZ_ApUf3PXvxiQjn0K3_RXVgQ_uooPylgorRlpotNVxF9co-b9NqRtzZSzgrAS8S0T_cM2JN0CVAQR_npC4jZoU-UdcFvCN6dViHPfbD6S6YXeC8WekWxx6qyylqDz_1tdw" 
                    alt="Heritage Background" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </div>

            {/* Profile Content Container */}
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 -mt-32 relative z-10">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
                            src={user.imageUrl} 
                            alt={user.fullName} 
                        />
                        <div className="text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h1 className="font-montserrat text-2xl font-extrabold text-primary">{user.fullName}</h1>
                                <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <span className="material-symbols-outlined text-[12px] font-fill" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                                    Gold Elite
                                </span>
                            </div>
                            <p className="font-inter text-sm text-gray-500 mt-1">{user.primaryEmailAddress?.emailAddress}</p>
                            <p className="font-inter text-xs text-gray-400 mt-0.5">Member since {new Date(user.createdAt).getFullYear()}</p>
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="flex gap-6 sm:gap-10 border-t sm:border-t-0 sm:border-l border-gray-100 pt-6 sm:pt-0 sm:pl-10 w-full md:w-auto justify-around sm:justify-start">
                        <div className="text-center">
                            <span className="font-montserrat text-2xl font-extrabold text-primary block">3</span>
                            <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Total stays</span>
                        </div>
                        <div className="text-center">
                            <span className="font-montserrat text-2xl font-extrabold text-secondary block">1,850</span>
                            <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Stay Points</span>
                        </div>
                    </div>
                </div>

                {/* Subcontent Tabs */}
                <div className="grid grid-cols-12 gap-8 mt-10 items-start">
                    
                    {/* Sidebar Tabs Selectors */}
                    <nav className="col-span-12 md:col-span-3 space-y-2">
                        <button 
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all text-left ${
                                activeTab === 'personal' 
                                ? 'bg-primary text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-slate-50 border border-gray-100'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">person</span>
                            Stay Info & Prefs
                        </button>
                        <button 
                            onClick={() => setActiveTab('club')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all text-left ${
                                activeTab === 'club' 
                                ? 'bg-primary text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-slate-50 border border-gray-100'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">card_membership</span>
                            Heritage Benefits
                        </button>
                        <button 
                            onClick={() => setActiveTab('wishlist')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all text-left ${
                                activeTab === 'wishlist' 
                                ? 'bg-primary text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-slate-50 border border-gray-100'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">favorite</span>
                            Saved Retrats
                        </button>
                    </nav>

                    {/* Main Active Tab Content */}
                    <div className="col-span-12 md:col-span-9 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                        
                        {activeTab === 'personal' && (
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                    <h2 className="font-montserrat text-lg font-extrabold text-primary uppercase tracking-wider">Stay Preferences</h2>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-secondary font-montserrat font-bold text-xs uppercase tracking-wider hover:text-secondary-dark transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-sm">{isEditing ? "close" : "edit"}</span>
                                        {isEditing ? "Cancel" : "Edit Details"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
                                        <input 
                                            type="text" 
                                            disabled 
                                            value={user.fullName}
                                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter font-semibold text-gray-500 outline-none cursor-not-allowed" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
                                        <input 
                                            type="email" 
                                            disabled 
                                            value={user.primaryEmailAddress?.emailAddress}
                                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter font-semibold text-gray-500 outline-none cursor-not-allowed" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Contact Number</label>
                                        <input 
                                            type="text" 
                                            disabled={!isEditing}
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                                            className={`w-full bg-transparent border rounded-xl px-4 py-2.5 text-sm font-inter font-semibold text-primary outline-none transition-premium focus:ring-1 focus:ring-primary ${isEditing ? 'border-primary' : 'border-gray-200 bg-slate-50/40'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Home Location</label>
                                        <input 
                                            type="text" 
                                            disabled={!isEditing}
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                                            className={`w-full bg-transparent border rounded-xl px-4 py-2.5 text-sm font-inter font-semibold text-primary outline-none transition-premium focus:ring-1 focus:ring-primary ${isEditing ? 'border-primary' : 'border-gray-200 bg-slate-50/40'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Preferred Heritage Type</label>
                                        <select 
                                            disabled={!isEditing}
                                            value={formData.prefStay}
                                            onChange={(e) => setFormData(prev => ({...prev, prefStay: e.target.value}))}
                                            className={`w-full bg-transparent border rounded-xl px-4 py-2.5 text-sm font-inter font-semibold text-primary outline-none transition-premium focus:ring-1 focus:ring-primary cursor-pointer ${isEditing ? 'border-primary' : 'border-gray-200 bg-slate-50/40'}`}
                                        >
                                            <option value="Palace Hotel">Palace Hotel</option>
                                            <option value="Heritage Haveli">Heritage Haveli</option>
                                            <option value="Boutique Resort">Boutique Resort</option>
                                            <option value="Luxury Suite">Luxury Suite</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Dietary Preference</label>
                                        <select 
                                            disabled={!isEditing}
                                            value={formData.prefDiet}
                                            onChange={(e) => setFormData(prev => ({...prev, prefDiet: e.target.value}))}
                                            className={`w-full bg-transparent border rounded-xl px-4 py-2.5 text-sm font-inter font-semibold text-primary outline-none transition-premium focus:ring-1 focus:ring-primary cursor-pointer ${isEditing ? 'border-primary' : 'border-gray-200 bg-slate-50/40'}`}
                                        >
                                            <option value="Ayurvedic Vegetarian">Ayurvedic Vegetarian</option>
                                            <option value="Traditional Rajasthani">Traditional Rajasthani</option>
                                            <option value="Continental / Western">Continental / Western</option>
                                            <option value="No preference">No preference</option>
                                        </select>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end pt-4">
                                        <button 
                                            type="submit"
                                            className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-md transition-premium cursor-pointer active:scale-95"
                                        >
                                            Save Stay Preferences
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}

                        {activeTab === 'club' && (
                            <div className="space-y-6">
                                <h2 className="font-montserrat text-lg font-extrabold text-primary border-b border-gray-100 pb-4 mb-4 uppercase tracking-wider">Heritage Circle privileges</h2>
                                
                                {/* VIP Membership card */}
                                <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-700 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden shadow-xl border border-white/10">
                                    <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
                                        <svg height="250" viewBox="0 0 100 100" width="250">
                                            <circle cx="50" cy="50" fill="none" r="48" stroke="#ffffff" strokeWidth="0.5"></circle>
                                            <circle cx="50" cy="50" fill="none" r="40" stroke="#ffffff" strokeWidth="0.2"></circle>
                                        </svg>
                                    </div>
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Membership Club</span>
                                            <h3 className="font-montserrat text-2xl font-extrabold tracking-widest mt-1">HERITAGE CIRCLE</h3>
                                        </div>
                                        <span className="material-symbols-outlined text-4xl text-amber-200">hotel_class</span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                        <div>
                                            <span className="text-[10px] uppercase text-amber-200 block">Elite Tier</span>
                                            <span className="font-montserrat font-extrabold text-lg tracking-widest">GOLD MEMBER</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase text-amber-200 block">Privilege Code</span>
                                            <span className="font-mono text-sm tracking-widest">BS-GOLD-77891</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <div className="border border-gray-100 p-5 rounded-2xl flex gap-3 text-left">
                                        <span className="material-symbols-outlined text-secondary text-3xl font-fill" style={{fontVariationSettings: "'FILL' 1"}}>spa</span>
                                        <div>
                                            <h4 className="font-montserrat text-sm font-bold text-primary">Ayurvedic Welcome Spa</h4>
                                            <p className="font-inter text-xs text-gray-500 mt-1 leading-relaxed">Enjoy a complimentary 30-minute stress release oil massage upon checking in at any of our Palace Stays.</p>
                                        </div>
                                    </div>
                                    <div className="border border-gray-100 p-5 rounded-2xl flex gap-3 text-left">
                                        <span className="material-symbols-outlined text-secondary text-3xl font-fill" style={{fontVariationSettings: "'FILL' 1"}}>room_service</span>
                                        <div>
                                            <h4 className="font-montserrat text-sm font-bold text-primary">Royal Butler Assistance</h4>
                                            <p className="font-inter text-xs text-gray-500 mt-1 leading-relaxed">Dedicated expert butler to assist you with local historical curations and packing/unpacking.</p>
                                        </div>
                                    </div>
                                    <div className="border border-gray-100 p-5 rounded-2xl flex gap-3 text-left">
                                        <span className="material-symbols-outlined text-secondary text-3xl font-fill" style={{fontVariationSettings: "'FILL' 1"}}>schedule</span>
                                        <div>
                                            <h4 className="font-montserrat text-sm font-bold text-primary">Priority Stay Flex</h4>
                                            <p className="font-inter text-xs text-gray-500 mt-1 leading-relaxed">Early morning check-in and late checkout privileges up to 4:00 PM without any surcharge.</p>
                                        </div>
                                    </div>
                                    <div className="border border-gray-100 p-5 rounded-2xl flex gap-3 text-left">
                                        <span className="material-symbols-outlined text-secondary text-3xl font-fill" style={{fontVariationSettings: "'FILL' 1"}}>dinner_dining</span>
                                        <div>
                                            <h4 className="font-montserrat text-sm font-bold text-primary">Curated Mewar Dining</h4>
                                            <p className="font-inter text-xs text-gray-500 mt-1 leading-relaxed">Complimentary high-tier Mewari breakfast and sunset snacks served inside private palace courtyards.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="space-y-6">
                                <h2 className="font-montserrat text-lg font-extrabold text-primary border-b border-gray-100 pb-4 mb-4 uppercase tracking-wider">Your saved heritage retreats</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-premium text-left">
                                        <div className="h-44 overflow-hidden relative">
                                            <img className="w-full h-full object-cover group-hover:scale-105 transition-premium" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI" alt="retreat-1" />
                                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                <span className="font-montserrat font-bold text-xs text-primary">4.9</span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-montserrat text-base font-bold text-primary">The Maharana's Lake Retreat</h3>
                                            <p className="font-inter text-xs text-gray-400 mt-1 mb-4">Old City, Udaipur, Rajasthan</p>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                <span className="font-montserrat font-extrabold text-primary">₹12,500 <span className="font-inter text-[10px] text-gray-400 font-normal">/night</span></span>
                                                <button className="text-secondary font-montserrat font-bold text-xs uppercase tracking-widest">Book Now</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-premium text-left">
                                        <div className="h-44 overflow-hidden relative">
                                            <img className="w-full h-full object-cover group-hover:scale-105 transition-premium" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2" alt="retreat-2" />
                                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                <span className="font-montserrat font-bold text-xs text-primary">4.7</span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-montserrat text-base font-bold text-primary">Aravalli Boutique Haveli</h3>
                                            <p className="font-inter text-xs text-gray-400 mt-1 mb-4">Fateh Sagar Lake, Udaipur, Rajasthan</p>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                <span className="font-montserrat font-extrabold text-primary">₹8,900 <span className="font-inter text-[10px] text-gray-400 font-normal">/night</span></span>
                                                <button className="text-secondary font-montserrat font-bold text-xs uppercase tracking-widest">Book Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </main>
    )
}

export default Profile
