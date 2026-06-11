import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TrendingDestinations = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0)
    const [cardsToShow, setCardsToShow] = useState(3)

    const destinations = [
        {
            id: 1,
            name: "Jaipur, Rajasthan",
            description: "The Pink City’s Historic Charm",
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
        },
        
        {
            id: 5,
            name: "Manali, Himachal Pradesh",
            description: "Snow-Capped Peaks & Scenic Valleys",
            image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600",
            rating: "4.6",
            price: "4,499"
        },
        {
            id: 6,
            name: "Munnar, Kerala",
            description: "Mist-Covered Tea Estates & Hills",
            image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600",
            rating: "4.8",
            price: "5,499"
        }
    ];

    // Dynamic adjustment of cards shown per viewport
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCardsToShow(1)
            } else if (window.innerWidth < 1024) {
                setCardsToShow(2)
            } else {
                setCardsToShow(3)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + cardsToShow >= destinations.length ? 0 : prevIndex + 1
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? destinations.length - cardsToShow : prevIndex - 1
        )
    }

    // Auto-advance slide every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 6000)
        return () => clearInterval(timer)
    }, [cardsToShow])

    return (
        <section className="py-20 bg-slate-50/40 border-t border-b border-gray-200/50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 relative">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="font-montserrat text-3xl font-bold text-primary mb-2">Trending Destinations</h2>
                    <p className="font-inter text-gray-500">The soul of Bharat, curated for your next journey.</p>
                </div>

                {/* Carousel Container */}
                <div className="relative w-full px-2 sm:px-8">
                    
                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevSlide}
                        className="absolute -left-2 sm:left-[-16px] top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-primary p-2.5 rounded-full shadow-md border border-gray-200/60 flex items-center justify-center transition-all cursor-pointer hover:border-primary active:scale-95 z-20"
                        aria-label="Previous destination"
                    >
                        <span className="material-symbols-outlined text-sm font-bold">arrow_back_ios_new</span>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute -right-2 sm:right-[-16px] top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-primary p-2.5 rounded-full shadow-md border border-gray-200/60 flex items-center justify-center transition-all cursor-pointer hover:border-primary active:scale-95 z-20"
                        aria-label="Next destination"
                    >
                        <span className="material-symbols-outlined text-sm font-bold">arrow_forward_ios</span>
                    </button>

                    {/* Destination Cards Sliding Container */}
                    <div className="overflow-hidden w-full pt-2 pb-4">
                        <div 
                            className="flex transition-transform duration-500 ease-out gap-8 w-full"
                            style={{ transform: `translateX(calc(-${currentIndex} * (100% + 32px) / ${cardsToShow}))` }}
                        >
                            {destinations.map((dest) => (
                                <div 
                                    key={dest.id}
                                    onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                                    className="group bg-white rounded-2xl overflow-hidden property-card-shadow hover:shadow-lg transition-premium cursor-pointer border border-gray-100/60 flex flex-col shrink-0 active:scale-[0.99]"
                                    style={{ width: `calc(${100 / cardsToShow}% - ${(32 * (cardsToShow - 1)) / cardsToShow}px)` }}
                                >
                                    {/* Card Image Container */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            src={dest.image} 
                                            alt={dest.name} 
                                        />
                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                            <span className="material-symbols-outlined text-secondary text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                            <span className="font-montserrat font-bold text-xs text-primary">{dest.rating}</span>
                                        </div>
                                    </div>

                                    {/* Card Details */}
                                    <div className="p-6 border-b-4 border-transparent group-hover:border-secondary transition-colors flex-1 flex flex-col justify-between text-left">
                                        <div>
                                            <h3 className="font-montserrat text-base font-bold text-primary mb-1">{dest.name}</h3>
                                            <p className="font-inter text-xs text-gray-400 mb-4">{dest.description}</p>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                                            <div className="flex flex-col">
                                                <span className="font-inter text-[9px] font-bold uppercase tracking-wider text-gray-400">Starting from</span>
                                                <span className="font-montserrat text-base font-bold text-primary">
                                                    ₹{dest.price}
                                                    <span className="font-inter text-xs text-gray-400 font-normal">/night</span>
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Carousel Indicator Dots */}
                <div className="flex gap-2 mt-6 justify-center">
                    {Array.from({ length: destinations.length - cardsToShow + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentIndex === i ? 'bg-primary w-5' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Call to Action Button */}
                <div className="text-center mt-10">
                    <button 
                        onClick={() => { navigate('/rooms'); scrollTo(0, 0); }} 
                        className="px-6 py-3 text-xs font-bold font-montserrat tracking-wider uppercase border border-primary text-primary hover:bg-primary hover:text-white rounded-lg shadow-sm transition-premium cursor-pointer bg-white active:scale-95"
                    >
                        View All Stays
                    </button>
                </div>

            </div>
        </section>
    )
}

export default TrendingDestinations
