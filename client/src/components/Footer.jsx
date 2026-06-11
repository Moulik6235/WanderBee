import React from 'react'
import { assets } from '../assets/quickStay-assets/assets'

const Footer = () => {
    return (
        <div className='bg-neutral-bg text-gray-500/80 pt-16 px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200/50'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6 max-w-7xl mx-auto'>
                <div className='max-w-80 text-left'>
                    <div className="flex items-center gap-2.5 mb-6">
                        <img src={assets.logo} alt="WanderBee" className="h-7 w-auto object-contain" />
                        <span className="font-montserrat text-2xl font-black tracking-tight text-primary">WanderBee</span>
                    </div>
                    <p className='text-sm leading-relaxed font-inter'>
                        Discover the subcontinent's most extraordinary places to stay, from boutique retreats and premium hotels to luxury wellness resorts.
                    </p>
                    <div className='flex items-center gap-4 mt-6'>
                        {/* Instagram */}
                        <img src={assets.instagramIcon} alt="instagram-icon" className='w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition-premium'/>
                        {/* Facebook */}
                        <img src={assets.facebookIcon} alt="facebook-icon" className='w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition-premium'/>
                        {/* Twitter */}
                        <img src={assets.twitterIcon} alt="twitter-icon" className='w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition-premium'/>
                        {/* LinkedIn */}
                        <img src={assets.linkendinIcon} alt="linkendin-icon" className='w-5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition-premium'/>
                    </div>
                </div>

                <div className="text-left">
                    <p className='font-montserrat text-xs font-extrabold uppercase tracking-widest text-primary'>Company</p>
                    <ul className='mt-4 flex flex-col gap-3 text-sm font-inter'>
                        <li><a href="#" className="hover:text-secondary transition-premium">About Us</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Careers</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Press & Media</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Our Blog</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Partnerships</a></li>
                    </ul>
                </div>

                <div className="text-left">
                    <p className='font-montserrat text-xs font-extrabold uppercase tracking-widest text-primary'>Support</p>
                    <ul className='mt-4 flex flex-col gap-3 text-sm font-inter'>
                        <li><a href="#" className="hover:text-secondary transition-premium">Help Center</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Safety Information</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Cancellation Options</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Contact Us</a></li>
                        <li><a href="#" className="hover:text-secondary transition-premium">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80 text-left'>
                    <p className='font-montserrat text-xs font-extrabold uppercase tracking-widest text-primary'>Stay Updated</p>
                    <p className='mt-4 text-sm leading-relaxed font-inter'>
                        Subscribe to our newsletter for curated escapes, new openings, and exclusive member privileges.
                    </p>
                    <div className='flex items-center mt-5'>
                        <input type="text" className='bg-white rounded-l-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 outline-none text-sm font-inter flex-1' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-secondary-container hover:bg-secondary h-10 w-10 aspect-square rounded-r-lg transition-premium shadow-sm cursor-pointer active:scale-95'>
                            {/* Arrow icon */}
                            <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert brightness-0' />
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-200/60 mt-12 max-w-7xl mx-auto' />
            <div className='flex flex-col md:flex-row gap-4 items-center justify-between py-8 text-xs font-inter max-w-7xl mx-auto'>
                <p>© {new Date().getFullYear()} WanderBee. Atithi Devo Bhava. All rights reserved.</p>
                <ul className='flex items-center gap-6'>
                    <li><a href="#" className="hover:text-secondary transition-premium">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-secondary transition-premium">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-secondary transition-premium">Sitemap</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
