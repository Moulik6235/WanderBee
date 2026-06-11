import React from 'react'
import { exclusiveOffers } from '../assets/quickStay-assets/assets'
import { useNavigate } from 'react-router-dom'

const ExclusiveOffer = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
            <div className="flex flex-col items-center text-center mb-8 gap-2">
                <h2 className="font-montserrat text-3xl font-bold text-primary mb-2">Offers for You</h2>
                <p className="font-inter text-gray-500 mb-2">Handpicked festive deals just for you.</p>
                <a 
                    className="text-primary font-montserrat font-bold text-sm hover:text-secondary flex items-center gap-1 group transition-premium mb-4" 
                    href="#offers"
                    onClick={(e) => { e.preventDefault(); navigate('/rooms'); }}
                >
                    View All Offers 
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-premium">arrow_forward</span>
                </a>
            </div>

            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {exclusiveOffers.map((item, index) => (
                    <div 
                        key={item._id} 
                        className={`min-w-[45%] flex-1 bg-slate-50/50 rounded-2xl overflow-hidden property-card-shadow hover:shadow-lg transition-premium border-b-4 ${
                            index === 0 ? 'border-secondary-container' : 'border-primary'
                        } flex flex-col sm:flex-row border border-gray-100/60`}
                    >
                        {/* Image side */}
                        <div className="w-full sm:w-1/3 h-48">
                            <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
                        </div>
                        
                        {/* Text side */}
                        <div className="p-6 flex-1 flex flex-col justify-center items-start text-left">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 ${
                                index === 0 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary/10 text-primary'
                            }`}>
                                {item.label}
                            </span>
                            <h3 className="font-montserrat text-xl font-bold text-primary mb-1">{item.title}</h3>
                            <p className="font-inter text-sm text-gray-500 mb-4">{item.description}</p>
                            
                            <button 
                                onClick={() => navigate('/rooms')}
                                className={`font-bold font-montserrat text-xs flex items-center gap-1 hover:gap-2 transition-all cursor-pointer ${
                                    index === 0 ? 'text-secondary hover:text-secondary-dark' : 'text-primary hover:text-primary-dark'
                                }`}
                            >
                                {index === 0 ? 'Book Now' : 'Claim Offer'} 
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ExclusiveOffer
