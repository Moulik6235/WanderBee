import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Experiences = () => {
    const navigate = useNavigate()
    const { axios } = useAppContext()
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [dbExperiences, setDbExperiences] = useState([])
    const [loading, setLoading] = useState(true)

    const categories = [
        'All',
        'Adventure',
        'Culinary',
        'Art & History',
        'Wellness'
    ]

    // Fetch dynamic experiences from backend
    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get('/api/experiences')
                if (data.success) {
                    setDbExperiences(data.experiences)
                }
            } catch (err) {
                console.error("Error fetching experiences:", err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchExperiences()
    }, [axios])

    const handleBookNow = (exp) => {
        const rawPrice = typeof exp.price === 'string'
            ? Number(exp.price.replace(/,/g, ''))
            : Number(exp.price) || 0;

        navigate('/payment', {
            state: {
                experience: exp,
                basePrice: rawPrice,
                guests: 1,
                cancellationPolicy: 'Free Cancellation'
            }
        });
    };

    const staticExperiences = useMemo(() => [
        {
            id: 1,
            title: "Pink City Sunrise Balloon Safari",
            category: "Adventure",
            duration: "3 hours",
            price: "8,500",
            rating: "4.9",
            reviews: 140,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYnxXIKa_qwaAI8LEyjwDTt8BZ3oSoHOOoElVLtX2xHbfIT_U927oeD1l3uQEe9e_hsDjAbf7SGwS5jH40strZMYHuhXW15FSsXc5Ysq_FbAUDh3tSnuRuCPCuIMOZ62GHyFbyQdK-OwkSyGR9kcdM2aFSnhwvgoifQdRY38kjBNC1DkDo8TseMFMqi0ZJBuoykxbqcRGQmBvU7eO9UDjrBnVfpM8e8c9qDQlWmBEYr2xGExeOH-hPrR8C0biA8Pk3bjARZLS_P1sh",
            about: "Float gently over grand forts and ancient temples at sunrise. Witness the mesmerizing hues of Jaipur's landscape from a unique sky-high perspective.",
            location: "Jaipur, Rajasthan",
            timing: "06:00 AM - 09:00 AM"
        },
        {
            id: 2,
            title: "Traditional Rajasthani Culinary Class",
            category: "Culinary",
            duration: "4 hours",
            price: "3,200",
            rating: "4.8",
            reviews: 95,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD87j4lxnW2IPH7lWc97Os3jIkweuUIUlbfHlXh5NJk8OeAheeh6k9mNaIfDSbLnn0FsrzU6ktptD0Yby9x4vShOy2eOA32PM46moW5XH1HqkyBcGqOD_b8zAK20f6PrmaPyFqBMQh-lpa26kiXV4VuffW2i6CC-cf6N0GRsqzanuieAwGBT85kgr03AdcTteGAVkh_aNdpGCwvnFz1CuS5CQtprPTxWaZyd0uhws7uNk0rh2j5H-4MTXSWXeKvdYyUz505Uu08hjoQ",
            about: "Learn the secrets of authentic Mewari masalas and traditional dishes like Dal Baati Churma under the guidance of master chefs.",
            location: "Udaipur, Rajasthan",
            timing: "11:00 AM - 03:00 PM"
        },
        {
            id: 3,
            title: "Night Photography at Amber Fort",
            category: "Art & History",
            duration: "2.5 hours",
            price: "5,000",
            rating: "4.7",
            reviews: 112,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qhbu_vUUUm3xkc6ORX1nBBznbhkvsYq-XN_gmfsNuxP54YyFXCSg6FBRrLy-nR8ubt0YMvhZc9lwX-I1B0HYX1FAtEHg3KhU7HYYrHqnfryJ1vmUy4Fab2YnC2JstKgesh1YxSezdtGRq0yfaVzzg0Qrgt5urNbi7FrfqUaDGQTA39-hsMSJmwq2TEw9i9IxKRPFUb9xaeVjHJkuYhUkUQlNrWCXl0TcyvyAeRw9rXE-cOfFA10XzX4VuhLNyhXawY2qX75WdLjT",
            about: "Explore the dramatic amber-lit corridors of Amer Fort at night. A bespoke session with professional photographers specializing in historic aesthetics.",
            location: "Jaipur, Rajasthan",
            timing: "07:00 PM - 09:30 PM"
        },
        {
            id: 4,
            title: "Ayurvedic Detox & Yoga Stroll",
            category: "Wellness",
            duration: "2 hours",
            price: "2,500",
            rating: "4.9",
            reviews: 74,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
            about: "Begin your morning with peaceful meditation overlooking the holy lakes of Udaipur, followed by custom-pressed juices and a wellness guide session.",
            location: "Udaipur, Rajasthan",
            timing: "07:00 AM - 09:00 AM"
        }
    ], [])

    const experiences = useMemo(() => {
        const mappedDb = dbExperiences.map(exp => ({
            id: exp._id,
            title: exp.title,
            category: exp.category,
            duration: exp.duration,
            price: exp.price.toLocaleString(),
            rating: exp.rating ? exp.rating.toString() : "4.8",
            reviews: exp.reviews || 12,
            image: exp.images && exp.images[0] ? exp.images[0] : "https://images.unsplash.com/photo-1512100356956-c1d473461155?auto=format&fit=crop&q=80&w=600",
            about: exp.description,
            location: exp.location,
            timing: exp.timing
        }))
        return [...mappedDb, ...staticExperiences]
    }, [dbExperiences, staticExperiences])

    const filteredExperiences = useMemo(() => {
        if (selectedCategory === 'All') return experiences
        return experiences.filter(exp => exp.category === selectedCategory)
    }, [selectedCategory, experiences])

    return (
        <main className="jali-overlay min-h-screen pb-20 bg-background text-left">
            {/* Header Block */}
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-10">
                <nav className="flex items-center text-xs text-gray-400 gap-1.5 font-inter mb-2">
                    <span>India</span>
                    <span>/</span>
                    <span className="text-primary font-semibold">Curated Experiences</span>
                </nav>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-gray-200/50 pb-6">
                    <div>
                        <h1 className="font-montserrat text-3xl font-extrabold text-primary">Local Experiences</h1>
                        <p className="text-gray-500 font-inter text-sm mt-1">Immerse yourself in the local culture and activities of India.</p>
                    </div>
                </div>

                {/* Categories Selector */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 border ${
                                selectedCategory === cat
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading indicator */}
                {loading && dbExperiences.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    /* Experiences List */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        {filteredExperiences.map((exp) => (
                            <article 
                                key={exp.id}
                                className="bg-white rounded-3xl overflow-hidden property-card-shadow border border-gray-100 hover:border-secondary transition-premium flex flex-col sm:flex-row"
                            >
                                {/* Left Image Side */}
                                <div className="w-full sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-premium" />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] font-bold text-primary shadow-sm uppercase tracking-wide">
                                        {exp.category}
                                    </div>
                                </div>

                                {/* Right Info Side */}
                                <div className="p-6 w-full sm:w-3/5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-gray-400 text-xs font-inter mb-1">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                <span>{exp.location}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-montserrat text-lg font-bold text-primary leading-snug">{exp.title}</h3>
                                        
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                <span className="font-montserrat font-bold text-xs text-primary">{exp.rating}</span>
                                                <span className="font-inter text-xs text-gray-400">({exp.reviews} reviews) • {exp.duration}</span>
                                            </div>
                                            {exp.timing && (
                                                <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                                    Timing: {exp.timing}
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-inter text-xs text-gray-500 mt-4 leading-relaxed line-clamp-3">
                                            {exp.about}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-6">
                                        <div className="text-left">
                                            <span className="font-inter text-[9px] uppercase tracking-wider text-gray-400 block">Experience Price</span>
                                            <span className="font-montserrat text-base font-extrabold text-primary">₹{exp.price} <span className="font-inter text-xs text-gray-400 font-normal">/ person</span></span>
                                        </div>
                                        <button 
                                            onClick={() => handleBookNow(exp)}
                                            className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-premium shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Experiences
