import React from 'react'
import { useNavigate } from 'react-router-dom'

const TrendingDestinations = () => {
    const navigate = useNavigate();

    const destinations = [
        {
            id: 1,
            name: "Jaipur, Rajasthan",
            description: "The Pink City’s Royal Heritage",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
            rating: "4.9",
            price: "7,499"
        },
        {
            id: 2,
            name: "Alleppey, Kerala",
            description: "Serene Backwater Cruises",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2",
            rating: "4.8",
            price: "12,999"
        },
        {
            id: 3,
            name: "North Goa",
            description: "Sun-kissed Shores & Sunsets",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng",
            rating: "4.7",
            price: "5,999"
        }
    ];

    return (
        <section className="py-20 bg-slate-50/40 border-t border-b border-gray-200/50">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="font-montserrat text-3xl font-bold text-primary mb-2">Trending Destinations</h2>
                    <p className="font-inter text-gray-500">The soul of Bharat, curated for your next journey.</p>
                </div>

                {/* Destination Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {destinations.map((dest) => (
                        <div 
                            key={dest.id}
                            onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient-md transition-premium cursor-pointer border border-gray-100/60 flex flex-col"
                        >
                            {/* Card Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    src={dest.image} 
                                    alt={dest.name} 
                                />
                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                    <span className="material-symbols-outlined text-secondary text-sm font-fill">star</span>
                                    <span className="font-montserrat font-bold text-xs text-primary">{dest.rating}</span>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-6 border-b-2 border-transparent group-hover:border-secondary transition-colors flex-1 flex flex-col justify-between text-left">
                                <div>
                                    <h3 className="font-montserrat text-lg font-bold text-primary mb-1">{dest.name}</h3>
                                    <p className="font-inter text-sm text-gray-400 mb-4">{dest.description}</p>
                                </div>
                                
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-gray-400">Starting from</span>
                                        <span className="font-montserrat text-lg font-bold text-primary">
                                            ₹{dest.price}
                                            <span className="font-inter text-xs text-gray-400 font-normal">/night</span>
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action Button */}
                <div className="text-center mt-12">
                    <button 
                        onClick={() => { navigate('/rooms'); scrollTo(0, 0); }} 
                        className="px-6 py-3 text-xs font-bold font-montserrat tracking-wider uppercase border border-primary text-primary hover:bg-primary hover:text-white rounded-lg shadow-sm transition-premium cursor-pointer bg-white"
                    >
                        View All Destinations
                    </button>
                </div>

            </div>
        </section>
    )
}

export default TrendingDestinations
