import React, { useState, useEffect } from 'react'
import Title from './Title'
import { testimonials } from '../assets/quickStay-assets/assets'
import StarRating from './StarRating'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(3)

  // Adjust number of cards based on screen width
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
      prevIndex + cardsToShow >= testimonials.length ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - cardsToShow : prevIndex - 1
    )
  }

  // Automatic slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [cardsToShow])

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-neutral-bg pt-20 pb-30 border-t border-gray-200/50 relative overflow-hidden'>
      <div className="w-full max-w-6xl relative">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="font-montserrat text-3xl font-bold text-primary mb-2">What Our Guests Say</h2>
          <p className="font-inter text-sm text-gray-500 max-w-2xl mx-auto">Discover why discerning travelers from India and around the globe consistently choose WanderBee for their premium accommodations.</p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full px-2 sm:px-8">
          
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute -left-2 sm:left-[-16px] top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-primary p-2.5 rounded-full shadow-md border border-gray-200/60 flex items-center justify-center transition-all cursor-pointer hover:border-primary active:scale-95 z-20"
            aria-label="Previous testimonial"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_back_ios_new</span>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute -right-2 sm:right-[-16px] top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-primary p-2.5 rounded-full shadow-md border border-gray-200/60 flex items-center justify-center transition-all cursor-pointer hover:border-primary active:scale-95 z-20"
            aria-label="Next testimonial"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward_ios</span>
          </button>

          {/* Outer frame to hide overflow */}
          <div className="overflow-hidden w-full pt-4 pb-4">
            {/* Sliding Cards Track */}
            <div 
              className="flex transition-transform duration-500 ease-out gap-6 w-full"
              style={{ transform: `translateX(calc(-${currentIndex} * (100% + 24px) / ${cardsToShow}))` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white p-8 rounded-2xl property-card-shadow border border-gray-100 hover:border-primary/20 flex flex-col justify-between text-left shrink-0 transition-all duration-300 hover:shadow-md"
                  style={{ width: `calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)` }}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" src={testimonial.image} alt={testimonial.name} />
                      <div>
                        <p className="font-montserrat text-sm font-bold text-primary">{testimonial.name}</p>
                        <p className="text-[11px] text-gray-500 font-inter">{testimonial.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 mt-4">
                      <StarRating rating={testimonial.rating} />
                    </div>
                    
                    <p className="text-xs text-gray-600 font-inter italic leading-relaxed mt-4">
                      "{testimonial.review}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Dots indicator */}
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: testimonials.length - cardsToShow + 1 }).map((_, i) => (
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

      </div>
    </div>
  )
}

export default Testimonials
