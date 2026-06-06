import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/quickStay-assets/assets'
import StarRating from './StarRating'

const Testimonials = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-neutral-bg pt-20 pb-30 border-t border-gray-200/50'>
      <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose WanderBee for their exclusive and luxurious accommodations." />
      
      <div className="flex flex-wrap items-stretch justify-center gap-8 mt-16 w-full max-w-6xl">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-8 rounded-lg property-card-shadow hover:shadow-lg transition-premium border border-gray-100/50 flex-1 min-w-[280px] max-w-xs flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-3">
                <img className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" src={testimonial.image} alt={testimonial.name} />
                <div>
                  <p className="font-montserrat text-base font-bold text-primary">{testimonial.name}</p>
                  <p className="text-xs text-gray-500 font-inter">{testimonial.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mt-4">
                <StarRating rating={testimonial.rating} />
              </div>
              
              <p className="text-sm text-gray-600 font-inter italic leading-relaxed mt-4">
                "{testimonial.review}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
