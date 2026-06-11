import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const AllRooms = () => {
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();

  // Search & Suggestion States
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDates, setSearchDates] = useState("15 Oct - 20 Oct");
  const [searchGuests, setSearchGuests] = useState("2 Adults, 1 Room");
  const [activeCity, setActiveCity] = useState(""); // empty string initially to show ALL hotels
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Filter States
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]); // Empty by default so all hotels show up
  const [propertyType, setPropertyType] = useState(""); // Empty by default so all hotels show up
  const [selectedSort, setSelectedSort] = useState("Popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [dbRooms, setDbRooms] = useState([]);

  const roomTypes = [
    "Premium Stays",
    "Boutique Hotels",
    "Luxury Resorts"
  ];
  
  const guestRatings = [
    "4.5+ Excellent",
    "4.0+ Very Good",
    "3.5+ Good"
  ];

  const amenitiesOptions = [
    "Free WiFi",
    "Free Breakfast",
    "Room Service",
    "Mountain View",
    "Pool Access"
  ];

  const sortOptions = [
    "Popularity",
    "Price: Low to High",
    "Price: High to Low",
    "Customer Rating"
  ];

  // List of available cities for suggestions
  const availableCities = ["Udaipur", "Jaipur", "Jodhpur"];

  // Filter suggestions based on typed input
  const filteredSuggestions = useMemo(() => {
    if (!searchLocation.trim()) return availableCities;
    return availableCities.filter(city => 
      city.toLowerCase().includes(searchLocation.toLowerCase())
    );
  }, [searchLocation]);

  // Handle outside click to close suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch registered rooms from MongoDB
  useEffect(() => {
    const fetchDbRooms = async () => {
      try {
        const { data } = await axios.get('/api/rooms');
        if (data.success) {
          const mapped = data.rooms.map(room => ({
            _id: room._id,
            name: room.hotel?.name || "Premium Stay",
            city: room.hotel?.city || "Udaipur",
            address: room.hotel?.address || "Mewar Region",
            rating: 4.8,
            reviewsCount: 24,
            type: room.roomType.includes("Luxury") || room.roomType.includes("Suite") ? "Luxury Resorts" : "Boutique Hotels",
            pricePerNight: room.pricePerNight,
            originalPrice: Math.round(room.pricePerNight * 1.25),
            image: room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            amenities: room.amenities,
            badge: room.amenities?.[0] || "Pool",
            badge2: room.amenities?.[1] || "Free WiFi",
            badge3: room.amenities?.[2] || "Breakfast",
            managed: true,
            leftRooms: 2,
            cancellationPolicy: room.cancellationPolicy || "Free Cancellation",
            freeCancel: room.cancellationPolicy !== "Cancellation Fee Applicable",
            cancelDate: "Flexible"
          }));
          setDbRooms(mapped);
        }
      } catch (err) {
        console.error("Error fetching db rooms:", err.message);
      }
    };
    fetchDbRooms();
  }, [axios]);

  // Multi-city premium properties to support real-time user searches!
  const enhancedRooms = useMemo(() => [
    // Udaipur Properties (Matching the design screenshot exactly!)
    {
      _id: "ud-1",
      name: "The Mewar Grand Hotel",
      city: "Udaipur",
      address: "Lake Pichola, Udaipur",
      rating: 4.9,
      reviewsCount: 342,
      type: "Premium Stays",
      pricePerNight: 18500,
      originalPrice: 24000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
      amenities: ["Swimming Pool", "Free WiFi", "Breakfast Included"],
      badge: "Pool",
      badge2: "Free WiFi",
      badge3: "Breakfast",
      managed: true,
      leftRooms: null,
      freeCancel: false
    },
    {
      _id: "ud-2",
      name: "Indigo Vista Boutique Hotel",
      city: "Udaipur",
      address: "City Centre, Udaipur",
      rating: 4.7,
      reviewsCount: 188,
      type: "Boutique Hotels",
      pricePerNight: 9200,
      originalPrice: null,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2",
      amenities: ["Free WiFi"],
      badge: "Fully AC",
      badge2: "Rooftop Cafe",
      badge3: null,
      managed: false,
      leftRooms: 2,
      freeCancel: false
    },
    {
      _id: "ud-3",
      name: "Grand Aravali Resort & Spa",
      city: "Udaipur",
      address: "Sajjangarh Road, Udaipur",
      rating: 4.8,
      reviewsCount: 290,
      type: "Luxury Resorts",
      pricePerNight: 14800,
      originalPrice: null,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng",
      amenities: ["Swimming Pool", "Free WiFi", "Spa & Wellness"],
      badge: "Luxury Spa",
      badge2: "Free Parking",
      badge3: "Gym",
      managed: false,
      leftRooms: null,
      freeCancel: true,
      cancelDate: "12 Oct"
    },
    // Jaipur Properties
    {
      _id: "jp-1",
      name: "The Raj Grand Hotel",
      city: "Jaipur",
      address: "Amer Road, Pink City, Jaipur",
      rating: 4.9,
      reviewsCount: 450,
      type: "Premium Stays",
      pricePerNight: 24500,
      originalPrice: 30000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYnxXIKa_qwaAI8LEyjwDTt8BZ3oSoHOOoElVLtX2xHbfIT_U927oeD1l3uQEe9e_hsDjAbf7SGwS5jH40strZMYHuhXW15FSsXc5Ysq_FbAUDh3tSnuRuCPCuIMOZ62GHyFbyQdK-OwkSyGR9kcdM2aFSnhwvgoifQdRY38kjBNC1DkDo8TseMFMqi0ZJBuoykxbqcRGQmBvU7eO9UDjrBnVfpM8e8c9qDQlWmBEYr2xGExeOH-hPrR8C0biA8Pk3bjARZLS_P1sh",
      amenities: ["Swimming Pool", "Free WiFi", "Breakfast Included"],
      badge: "Pool",
      badge2: "Free WiFi",
      badge3: "Breakfast",
      managed: true,
      leftRooms: null,
      freeCancel: true,
      cancelDate: "14 Oct"
    },
    {
      _id: "jp-2",
      name: "Jaipur Vista Hotel",
      city: "Jaipur",
      address: "M.I. Road, Jaipur",
      rating: 4.6,
      reviewsCount: 122,
      type: "Boutique Hotels",
      pricePerNight: 8500,
      originalPrice: null,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qhbu_vUUUm3xkc6ORX1nBBznbhkvsYq-XN_gmfsNuxP54YyFXCSg6FBRrLy-nR8ubt0YMvhZc9lwX-I1B0HYX1FAtEHg3KhU7HYYrHqnfryJ1vmUy4Fab2YnC2JstKgesh1YxSezdtGRq0yfaVzzg0Qrgt5urNbi7FrfqUaDGQTA39-hsMSJmwq2TEw9i9IxKRPFUb9xaeVjHJkuYhUkUQlNrWCXl0TcyvyAeRw9rXE-cOfFA10XzX4VuhLNyhXawY2qX75WdLjT",
      amenities: ["Free WiFi", "Breakfast Included"],
      badge: "Fully AC",
      badge2: "Rooftop Dining",
      badge3: null,
      managed: false,
      leftRooms: 3,
      freeCancel: false
    },
    // Jodhpur Properties
    {
      _id: "jd-1",
      name: "Umaid Bhawan Desert Retreat",
      city: "Jodhpur",
      address: "Circuit House Road, Jodhpur",
      rating: 4.9,
      reviewsCount: 512,
      type: "Luxury Resorts",
      pricePerNight: 29000,
      originalPrice: 35000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
      amenities: ["Swimming Pool", "Free WiFi", "Spa & Wellness", "Breakfast Included"],
      badge: "Spa & Salon",
      badge2: "Guest Assistant",
      badge3: "Desert View",
      managed: true,
      leftRooms: null,
      freeCancel: true,
      cancelDate: "18 Oct"
    }
  ], []);

  // Combine database rooms with seeded ones
  const allRoomsCombined = useMemo(() => {
    return [...dbRooms, ...enhancedRooms];
  }, [dbRooms, enhancedRooms]);

  // Filter and Search logic
  const filteredRooms = useMemo(() => {
    return allRoomsCombined.filter(room => {
      // City Search Filter (Case Insensitive Substring)
      if (activeCity) {
        const matchesCity = room.city.toLowerCase().includes(activeCity.toLowerCase()) || 
                            room.address.toLowerCase().includes(activeCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // Price Filter
      if (room.pricePerNight > priceRange) return false;

      // Rating Filter
      if (selectedRatings.length > 0) {
        const matchesRating = selectedRatings.some(ratingText => {
          if (ratingText.includes("4.5+")) return room.rating >= 4.5;
          if (ratingText.includes("4.0+")) return room.rating >= 4.0;
          if (ratingText.includes("3.5+")) return room.rating >= 3.5;
          return true;
        });
        if (!matchesRating) return false;
      }

      // Property Type (Radio select matching design)
      if (propertyType) {
        if (room.type !== propertyType) return false;
      }

      // Amenities Filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(a => room.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === "Price: Low to High") {
        return a.pricePerNight - b.pricePerNight;
      } else if (selectedSort === "Price: High to Low") {
        return b.pricePerNight - a.pricePerNight;
      } else if (selectedSort === "Customer Rating") {
        return b.rating - a.rating;
      }
      return 0; // Default Popularity
    });
  }, [allRoomsCombined, activeCity, priceRange, selectedRatings, propertyType, selectedAmenities, selectedSort]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setActiveCity(searchLocation.trim());
    setShowSuggestions(false);
    if (searchLocation.trim()) {
      toast.success(`Showing properties in ${searchLocation}`);
    } else {
      toast.success("Showing all properties across India");
    }
  };

  const handleSelectSuggestion = (city) => {
    setSearchLocation(city);
    setActiveCity(city);
    setShowSuggestions(false);
    toast.success(`Showing properties in ${city}`);
  };

  const handleRatingChange = (checked, label) => {
    if (checked) {
      setSelectedRatings(prev => [...prev, label]);
    } else {
      setSelectedRatings(prev => prev.filter(r => r !== label));
    }
  };

  const handleAmenityChange = (checked, label) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, label]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== label));
    }
  };

  return (
    <main className="jali-overlay min-h-screen pb-20 bg-background text-left font-inter">
      {/* 🧭 Top Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-6">
        <nav className="flex items-center text-xs text-gray-400 gap-1.5 font-inter">
          <span>Home</span>
          <span>/</span>
          <span>Hotels</span>
          {activeCity && (
            <>
              <span>/</span>
              <span className="text-primary font-semibold">{activeCity}</span>
            </>
          )}
        </nav>
      </div>

      {/* 🔍 Search Bar Card with Suggestions */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 mt-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg relative z-20">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Location input with Suggestion ref */}
            <div ref={suggestionRef} className="md:col-span-4 relative flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-slate-50/50">
              <span className="material-symbols-outlined text-secondary text-xl">location_on</span>
              <div className="flex-1 text-left">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Location</label>
                <input 
                  type="text" 
                  value={searchLocation}
                  onChange={(e) => {
                    setSearchLocation(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Where are you going? (e.g. Udaipur)" 
                  className="w-full bg-transparent text-sm font-semibold text-primary outline-none placeholder-gray-400"
                />
              </div>

              {/* Dynamic Suggestions List */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                  {filteredSuggestions.map((city, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSelectSuggestion(city)}
                      className="px-4 py-3 hover:bg-primary/5 text-sm font-semibold text-primary cursor-pointer transition-colors flex items-center gap-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Check-in / Out (grid col sum: 3) */}
            <div className="md:col-span-3 flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-slate-50/50">
              <span className="material-symbols-outlined text-secondary text-xl">calendar_today</span>
              <div className="flex-1 text-left">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Check-in / Out</label>
                <input 
                  type="text" 
                  value={searchDates}
                  onChange={(e) => setSearchDates(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary outline-none"
                />
              </div>
            </div>

            {/* Guests (grid col sum: 3) */}
            <div className="md:col-span-3 flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-slate-50/50">
              <span className="material-symbols-outlined text-secondary text-xl">group</span>
              <div className="flex-1 text-left">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Guests</label>
                <input 
                  type="text" 
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary outline-none"
                />
              </div>
            </div>

            {/* Search Button (grid col sum: 2) */}
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md transition-premium flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-sm font-bold">search</span>
                Search
              </button>
            </div>

          </form>
        </div>
      </section>

      {/* 🏨 Listing Count & Sort Header */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-montserrat text-base font-extrabold text-primary uppercase tracking-wider">
            Showing {filteredRooms.length} properties {activeCity ? `in ${activeCity}` : "across India"}
          </h2>
        </div>

        {/* Sort select & Mobile Filters Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button 
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-1.5 text-xs font-inter font-semibold text-primary hover:border-secondary transition-colors active:scale-95 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-secondary font-bold">filter_alt</span>
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-inter">Sort by:</span>
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-inter font-semibold text-primary outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-secondary transition-colors"
            >
              {sortOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 🧱 Grid Body Layout */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 grid grid-cols-12 gap-8 items-start relative z-10">
        
        {/* 🎛️ Left Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-6">
            
            {/* Header reset */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-montserrat text-xs font-bold text-primary uppercase tracking-wider">Filters</h3>
              <button 
                onClick={() => {
                  setPriceRange(50000);
                  setSelectedRatings([]);
                  setSelectedAmenities([]);
                  setPropertyType("Luxury Resorts");
                  setSearchLocation("");
                  setActiveCity("");
                }}
                className="text-secondary font-montserrat font-bold text-[10px] uppercase tracking-wider hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Price slider */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Price Range (per night)</h4>
              <input 
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-inter font-semibold mt-2">
                <span>₹1,000</span>
                <span>₹50,000+</span>
              </div>
            </div>

            {/* Guest Ratings */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Guest Rating</h4>
              <div className="space-y-2">
                {guestRatings.map((rating, idx) => (
                  <label key={idx} className="flex gap-2.5 items-center cursor-pointer text-xs text-gray-600 font-inter">
                    <input 
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={(e) => handleRatingChange(e.target.checked, rating)}
                      className="rounded text-primary focus:ring-primary border-gray-200 w-4 h-4 accent-secondary cursor-pointer"
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Amenities</h4>
              <div className="space-y-2">
                {amenitiesOptions.map((amenity, idx) => (
                  <label key={idx} className="flex gap-2.5 items-center cursor-pointer text-xs text-gray-600 font-inter">
                    <input 
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={(e) => handleAmenityChange(e.target.checked, amenity)}
                      className="rounded text-primary focus:ring-primary border-gray-200 w-4 h-4 accent-secondary cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Type Radio Group */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Property Type</h4>
              <div className="space-y-2">
                {roomTypes.map((type, idx) => (
                  <label key={idx} className="flex gap-2.5 items-center cursor-pointer text-xs text-gray-600 font-inter">
                    <input 
                      type="radio"
                      name="property-type"
                      checked={propertyType === type}
                      onChange={() => setPropertyType(type)}
                      className="text-primary focus:ring-primary border-gray-200 w-4 h-4 accent-secondary cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* 🎁 Member callout card */}
          <div className="bg-primary p-5 rounded-3xl text-left border border-white/5 relative overflow-hidden shadow-md">
            <span className="material-symbols-outlined text-amber-200 text-3xl mb-2">hotel_class</span>
            <h4 className="font-montserrat text-sm font-extrabold text-white">Unlock Member Prices</h4>
            <p className="font-inter text-xs text-slate-300 mt-1 mb-4 leading-relaxed">Save an extra 15% on your first stay booking.</p>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-secondary text-white font-montserrat font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl transition-premium shadow-sm hover:shadow-md cursor-pointer"
            >
              Join Now
            </button>
          </div>

        </aside>

        {/* 🗂️ Hotel Cards Listing Area */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm font-montserrat">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">home_work</span>
              <p className="text-gray-500 font-semibold text-lg">No properties found in "{activeCity}".</p>
              <p className="text-gray-400 text-xs mt-1">Try entering "Udaipur" or "Jaipur" in the search box!</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <article 
                key={room._id} 
                className="bg-white rounded-3xl overflow-hidden property-card-shadow border border-gray-100 hover:border-secondary transition-premium flex flex-col sm:flex-row text-left"
              >
                {/* Left Side Image with Rating */}
                <div className="w-full sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                  <img 
                    onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-premium" 
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white font-montserrat font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    {room.rating}
                  </div>
                </div>

                {/* Right Side Content & Pricing */}
                <div className="p-6 w-full sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                      className="font-montserrat text-lg font-extrabold text-primary cursor-pointer hover:text-secondary transition-colors leading-snug"
                    >
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-inter mt-1.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>{room.address}</span>
                    </div>

                    {/* Badge Lists */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {room.badge && (
                        <span className="bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1">
                          {room.badge}
                        </span>
                      )}
                      {room.badge2 && (
                        <span className="bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1">
                          {room.badge2}
                        </span>
                      )}
                      {room.badge3 && (
                        <span className="bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1">
                          {room.badge3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and details footer */}
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-6">
                    <div>
                      {room.managed && (
                        <span className="bg-amber-100/60 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 mb-1.5 w-max">
                          👑 WanderBee Managed
                        </span>
                      )}
                      {room.cancellationPolicy === 'Cancellation Fee Applicable' ? (
                        <span className="text-rose-600 text-[10px] font-bold flex items-center gap-1 mb-1.5">
                          ✗ Cancellation Fee Applicable
                        </span>
                      ) : (
                        (room.cancellationPolicy === 'Free Cancellation' || room.freeCancel) && (
                          <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1 mb-1.5">
                            ✓ Free cancellation before {room.cancelDate || "Flexible"}
                          </span>
                        )
                      )}
                    </div>

                    <div className="text-right">
                      {room.originalPrice && (
                        <span className="text-xs text-gray-400 line-through block font-inter">₹{room.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="font-montserrat text-lg font-extrabold text-primary">₹{room.pricePerNight.toLocaleString()}</span>
                      <span className="font-inter text-[9px] text-gray-400 block tracking-wider uppercase mt-0.5">per night + taxes</span>
                      <button 
                        onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                        className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-premium shadow-sm mt-3 w-full cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

      </div>

      {/* 📱 Mobile Filters Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 lg:hidden ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setIsFilterOpen(false)}
      >
        <div 
          className={`fixed bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] max-h-[85vh] overflow-y-auto p-6 transition-transform duration-300 z-50 shadow-2xl space-y-6 border-t border-gray-100/50 ${isFilterOpen ? "translate-y-0" : "translate-y-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl font-bold">filter_alt</span>
              <h3 className="font-montserrat text-sm font-bold text-primary uppercase tracking-wider">Filters</h3>
            </div>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => {
                  setPriceRange(50000);
                  setSelectedRatings([]);
                  setSelectedAmenities([]);
                  setPropertyType("Luxury Resorts");
                }}
                className="text-secondary font-montserrat font-bold text-[10px] uppercase tracking-wider hover:underline cursor-pointer"
              >
                Clear all
              </button>
              <button 
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="material-symbols-outlined text-gray-400 hover:text-primary text-xl font-bold bg-slate-50 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                close
              </button>
            </div>
          </div>

          {/* Drawer Body - Reuses same filter contents */}
          <div className="space-y-6 text-left">
            {/* Price slider */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Price Range (per night)</h4>
              <input 
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-inter font-semibold mt-2">
                <span>₹1,000</span>
                <span className="text-secondary font-bold">Up to ₹{priceRange.toLocaleString()}</span>
                <span>₹50,000+</span>
              </div>
            </div>

            {/* Guest Ratings */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Guest Rating</h4>
              <div className="space-y-2">
                {guestRatings.map((rating, idx) => (
                  <label key={idx} className="flex gap-2.5 items-center cursor-pointer text-xs text-gray-600 font-inter">
                    <input 
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={(e) => handleRatingChange(e.target.checked, rating)}
                      className="rounded text-primary focus:ring-primary border-gray-200 w-4 h-4 accent-secondary cursor-pointer"
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Amenities</h4>
              <div className="space-y-2">
                {amenitiesOptions.map((amenity, idx) => (
                  <label key={idx} className="flex gap-2.5 items-center cursor-pointer text-xs text-gray-600 font-inter">
                    <input 
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={(e) => handleAmenityChange(e.target.checked, amenity)}
                      className="rounded text-primary focus:ring-primary border-gray-200 w-4 h-4 accent-secondary cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Type Radio Group */}
            <div>
              <h4 className="font-montserrat text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Property Type</h4>
              <div className="space-y-2">
                {roomTypes.map((type, idx) => (
                  <label key={idx} className="flex gap-2.5 items-center cursor-pointer text-xs text-gray-600 font-inter">
                    <input 
                      type="radio"
                      name="mobile-property-type"
                      checked={propertyType === type}
                      onChange={() => setPropertyType(type)}
                      className="text-primary focus:ring-primary border-gray-200 w-4 h-4 accent-secondary cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-gray-100 flex gap-4">
            <button 
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-primary text-white py-3 rounded-xl font-montserrat font-bold text-xs tracking-wider uppercase active:scale-95 cursor-pointer shadow-sm hover:bg-secondary transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AllRooms
