import React from 'react'

const NewsLetter = () => {
    return (
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
            <div className="bg-primary rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 text-left">
                
                {/* Abstract Mandala Backdrop */}
                <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
                    <svg height="400" viewBox="0 0 100 100" width="400">
                        <circle cx="50" cy="50" fill="none" r="48" stroke="#fe9832" strokeWidth="0.5"></circle>
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#fe9832" strokeWidth="0.2"></circle>
                        <path d="M50 2 L50 98 M2 50 L98 50 M15 15 L85 85 M15 85 L85 15" stroke="#fe9832" strokeWidth="0.2"></path>
                    </svg>
                </div>

                <div className="relative z-10 lg:w-1/2 w-full">
                    <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Join the Circle of Heritage
                    </h2>
                    <p className="font-inter text-base text-blue-100 mb-8 max-w-md">
                        Subscribe to get secret deals and early access to BharatStay's newest heritage openings across India.
                    </p>
                    
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <input 
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/60 focus:ring-2 focus:ring-secondary-container focus:outline-none transition-premium font-inter text-sm" 
                            placeholder="Your email address" 
                            type="email"
                            required
                        />
                        <button className="bg-secondary-container text-on-secondary-container px-6 py-3.5 rounded-xl font-montserrat font-bold hover:bg-secondary hover:text-white transition-premium cursor-pointer text-sm whitespace-nowrap active:scale-95">
                            Join Now
                        </button>
                    </form>
                </div>

                <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-secondary-container text-4xl mb-2 font-fill" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                        <h4 className="text-white font-montserrat font-bold text-sm">100% Secure</h4>
                        <p className="text-blue-100/70 font-inter text-xs mt-1">Safe & encrypted payments</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-secondary-container text-4xl mb-2 font-fill" style={{fontVariationSettings: "'FILL' 1"}}>hotel_class</span>
                        <h4 className="text-white font-montserrat font-bold text-sm">Curated Luxury</h4>
                        <p className="text-blue-100/70 font-inter text-xs mt-1">Top-tier property audits</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-secondary-container text-4xl mb-2 font-fill" style={{fontVariationSettings: "'FILL' 1"}}>support_agent</span>
                        <h4 className="text-white font-montserrat font-bold text-sm">24/7 Support</h4>
                        <p className="text-blue-100/70 font-inter text-xs mt-1">Indian local experts</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-secondary-container text-4xl mb-2 font-fill" style={{fontVariationSettings: "'FILL' 1"}}>loyalty</span>
                        <h4 className="text-white font-montserrat font-bold text-sm">Stay Rewards</h4>
                        <p className="text-blue-100/70 font-inter text-xs mt-1">Earn on every booking</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default NewsLetter
