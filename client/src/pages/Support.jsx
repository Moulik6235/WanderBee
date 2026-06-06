import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { useClerk } from "@clerk/clerk-react";
import { userBookingsDummyData } from "../assets/quickStay-assets/assets";
import { toast } from "react-hot-toast";

const Support = () => {
  const { user, currency, axios, getToken } = useAppContext();
  const { openSignIn } = useClerk();
  
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  
  const chatEndRef = useRef(null);

  // Fetch bookings exactly like MyBookings.jsx but dynamically make dummy bookings future/upcoming
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const localBookings = JSON.parse(localStorage.getItem("wanderbee_bookings") || "[]");
        const token = await getToken();
        
        // Push dummy dates to future relative to today's date (so they count as upcoming)
        const today = new Date();
        const adjustedDummyBookings = userBookingsDummyData.map((booking, idx) => {
          const futureCheckIn = new Date(today);
          futureCheckIn.setDate(today.getDate() + 5 + idx * 7); // 5, 12, 19 days from today
          const futureCheckOut = new Date(futureCheckIn);
          futureCheckOut.setDate(futureCheckIn.getDate() + 2);
          
          return {
            ...booking,
            checkInDate: futureCheckIn.toISOString(),
            checkOutDate: futureCheckOut.toISOString(),
          };
        });

        if (!token) {
          setBookings([...localBookings, ...adjustedDummyBookings]);
          return;
        }

        const { data } = await axios.get("/api/bookings/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          const dbBookings = data.bookings.map((b) => ({
            ...b,
            isPaid: b.isPaid || false,
            status: b.isPaid ? "Confirmed" : "Pending Payment",
          }));
          setBookings([...localBookings, ...dbBookings, ...adjustedDummyBookings]);
        } else {
          setBookings([...localBookings, ...adjustedDummyBookings]);
        }
      } catch (error) {
        console.error("Fetch Bookings Error in Support:", error.message);
        const localBookings = JSON.parse(localStorage.getItem("wanderbee_bookings") || "[]");
        
        const today = new Date();
        const adjustedDummyBookings = userBookingsDummyData.map((booking, idx) => {
          const futureCheckIn = new Date(today);
          futureCheckIn.setDate(today.getDate() + 5 + idx * 7);
          const futureCheckOut = new Date(futureCheckIn);
          futureCheckOut.setDate(futureCheckIn.getDate() + 2);
          
          return {
            ...booking,
            checkInDate: futureCheckIn.toISOString(),
            checkOutDate: futureCheckOut.toISOString(),
          };
        });
        setBookings([...localBookings, ...adjustedDummyBookings]);
      }
    };
    fetchUserBookings();
  }, [axios, getToken]);

  // Enhanced bookings memo matching MyBookings.jsx properties
  const enhancedBookings = useMemo(() => {
    const stitchProperties = [
      {
        name: "The Maharana's Lake Retreat",
        address: "Old City, Udaipur, Rajasthan",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
      },
      {
        name: "Aravalli Boutique Haveli",
        address: "Fateh Sagar Lake, Udaipur, Rajasthan",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2",
      },
    ];

    return bookings.map((booking, idx) => {
      const isDummyBooking = booking.hotel?.name === "Urbanza Suites" || booking.hotel?._id === "67f76393197ac559e4089b72";
      if (!isDummyBooking) {
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        const fallbackPrice = (booking.room?.pricePerNight || 299) * nights;
        return {
          ...booking,
          hotel: {
            name: booking.hotel?.name || "Premium Stay",
            address: booking.hotel?.address || "Rajasthan, India",
          },
          room: {
            roomType: booking.room?.roomType || "Luxury Suite",
            images: booking.room?.images && booking.room.images.length > 0 ? booking.room.images : [stitchProperties[idx % stitchProperties.length].image],
          },
          totalPrice: booking.totalPrice || fallbackPrice,
          status: booking.status || "Confirmed",
        };
      }

      const prop = stitchProperties[idx % stitchProperties.length];
      const rawPrice = booking.totalPrice || 299;
      return {
        ...booking,
        hotel: {
          ...booking.hotel,
          name: prop.name,
          address: prop.address,
        },
        room: {
          ...booking.room,
          images: [prop.image],
        },
        totalPrice: rawPrice < 1000 ? rawPrice * 30 : rawPrice,
        status: booking.isPaid ? "Confirmed" : "Pending Payment",
      };
    });
  }, [bookings]);

  // Filter for upcoming bookings only (check-in date >= today and status is not cancelled)
  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return enhancedBookings.filter((b) => new Date(b.checkInDate) >= today && b.status !== "cancelled");
  }, [enhancedBookings]);

  // Initial welcome message from the bot
  useEffect(() => {
    const welcomeText = user
      ? `Namaste, ${user.fullName}! I am your Royal Heritage AI Butler. I have loaded your Gold profile details and your bookings. How may I assist you with your heritage stay today?`
      : "Namaste! Welcome to WanderBee Royal Support. I see you are visiting as a guest. How can I assist you today? (You can sign in to view and ask questions about your bookings!)";
    
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [user]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateBotResponse = (userInput) => {
    const text = userInput.toLowerCase();
    
    if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("namaste")) {
      const namePart = user ? `, ${user.firstName || user.fullName}` : "";
      return {
        text: `Namaste${namePart}! Welcome to WanderBee Support. How can I assist you with your heritage stays or special requests today?`
      };
    }
    
    if (text.includes("booking") || text.includes("reservation") || text.includes("stay") || text.includes("my room")) {
      if (!user) {
        return {
          text: "To view or manage your bookings, please sign in using the button in the profile panel. I can guide you through our general heritage booking policies in the meantime."
        };
      }
      if (upcomingBookings.length === 0) {
        return {
          text: `I checked your account, ${user.firstName || user.fullName}, but couldn't find any upcoming heritage bookings. Would you like assistance finding and booking a palace stay?`
        };
      }
      
      let responseText = `I found ${upcomingBookings.length} upcoming booking(s) associated with your profile, ${user.firstName || user.fullName}:\n\n`;
      upcomingBookings.forEach((b, idx) => {
        responseText += `🔑 **Booking #${idx + 1}: ${b.hotel?.name}**\n`;
        responseText += `   • **Room**: ${b.room?.roomType}\n`;
        responseText += `   • **Dates**: ${new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to ${new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n`;
        responseText += `   • **Status**: ${b.status || (b.isPaid ? 'Confirmed' : 'Pending Payment')}\n\n`;
      });
      responseText += "Select an upcoming booking card in the sidebar to perform quick actions, or click any booking listed above.";
      return { text: responseText };
    }
    
    if (text.includes("upgrade") || text.includes("better room") || text.includes("room upgrade")) {
      if (!user) {
        return {
          text: "Heritage room upgrades are part of our Gold privileges. Please sign in to see if your current booking qualifies."
        };
      }
      if (upcomingBookings.length === 0) {
        return {
          text: "I couldn't find any upcoming bookings to request an upgrade for."
        };
      }
      const b = upcomingBookings[0];
      return {
        text: `As a Gold tier member, you are eligible for complimentary room upgrades based on availability. I have logged your upgrade request for your stay at **${b.hotel.name}** checking in on ${new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. The palace front desk has been notified.`,
        bookingContext: b,
        actions: [
          { label: "🤵 Book Butler", type: "butler" },
          { label: "📄 Rules & Policy", type: "details" }
        ]
      };
    }

    if (text.includes("butler") || text.includes("royal butler") || text.includes("service")) {
      if (!user) {
        return {
          text: "Our personalized Heritage Butler service is available at all of our listed palaces. Please sign in to link this service to your stay."
        };
      }
      if (upcomingBookings.length === 0) {
        return {
          text: "You don't have any upcoming bookings. Book a premium palace room first to reserve your butler!"
        };
      }
      const b = upcomingBookings[0];
      return {
        text: `Certainly! Pre-booking for your Heritage Butler is now confirmed for your stay at **${b.hotel.name}**. Your butler will contact you 24 hours prior to check-in to coordinate your Mewar heritage dining, sightseeing schedule, and any dietary preferences.`,
        bookingContext: b,
        actions: [
          { label: "⭐ Request Upgrade", type: "upgrade" },
          { label: "📄 Rules & Policy", type: "details" }
        ]
      };
    }

    if (text.includes("cancel") || text.includes("refund") || text.includes("cancellation")) {
      return {
        text: "Under WanderBee's Royal policy, free cancellations are accepted up to 48 hours prior to your scheduled check-in. Cancellations within 48 hours will incur a one-night room charge plus taxes. Select an upcoming booking in the sidebar to request a cancel action directly."
      };
    }

    if (text.includes("udaipur") || text.includes("attraction") || text.includes("visit") || text.includes("sightseeing")) {
      return {
        text: "Udaipur features stunning historical marvels! I highly recommend visiting:\n\n1. **The City Palace** - Udaipur's royal centerpiece overlooking Lake Pichola.\n2. **Sajjangarh Monsoon Palace** - Breathtaking panoramic sunset views from the hilltop.\n3. **Jag Mandir** - A floating garden palace on the lake.\n\nOur local team can arrange custom guides, heritage walks, and vintage car rentals. Let me know if you want us to set it up!"
      };
    }

    // Check if user clicked or typed a specific hotel name
    for (const b of upcomingBookings) {
      if (text.includes(b.hotel?.name.toLowerCase()) || text.includes(b.hotel?.name.split(" ")[0].toLowerCase())) {
        const checkInStr = new Date(b.checkInDate).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
        return {
          text: `I have loaded your upcoming reservation details for **${b.hotel?.name}**:\n\n• **Room**: ${b.room?.roomType}\n• **Check-in**: ${checkInStr}\n• **Status**: ${b.status}\n\nWhat options would you like to explore for this stay?`,
          bookingContext: b,
          actions: [
            { label: "⭐ Request Upgrade", type: "upgrade" },
            { label: "🤵 Book Butler", type: "butler" },
            { label: "❌ Cancel Stay", type: "cancel" },
            { label: "📄 Rules & Policy", type: "details" }
          ]
        };
      }
    }

    if (text.includes("thank") || text.includes("thanks") || text.includes("great") || text.includes("cool")) {
      return {
        text: "It is my absolute honor to serve you. Please let me know if there are any other details or arrangements I can assist you with!"
      };
    }

    return {
      text: "I am here to assist with your upcoming heritage bookings, hotel details, upgrades, and royal butler services. Please specify what you would like to know, or select an upcoming booking in the sidebar!"
    };
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(currentInput);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: typeof response === "string" ? response : response.text,
        actions: response.actions || null,
        bookingContext: response.bookingContext || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Timeout to make it feel natural
    setTimeout(() => {
      // Create user message
      const userMsg = {
        id: Date.now().toString(),
        sender: "user",
        text: question,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const response = generateBotResponse(question);
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: typeof response === "string" ? response : response.text,
          actions: response.actions || null,
          bookingContext: response.bookingContext || null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 1000);
    }, 100);
  };

  const handleBookingOption = async (booking, option) => {
    let messageText = "";
    let replyText = "";
    let actions = null;
    const checkInDateStr = new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (option === "upgrade") {
      messageText = `I want to request a room upgrade for my booking at ${booking.hotel.name} checking in on ${checkInDateStr}.`;
      replyText = `Understood. I have initiated an upgrade inquiry for your room (${booking.room.roomType}) at **${booking.hotel.name}**. Since you are a **Gold** tier member, you qualify for complimentary upgrades to high-tier suites upon availability at check-in. The palace concierge has been alerted!`;
      actions = [
        { label: "🤵 Book Butler", type: "butler" },
        { label: "📄 Rules & Policy", type: "details" }
      ];
    } else if (option === "butler") {
      messageText = `I want to pre-book a Heritage Butler for my booking at ${booking.hotel.name}.`;
      replyText = `Excellent! Pre-booking for your Heritage Butler is now confirmed for your stay at **${booking.hotel.name}**. Your butler will contact you 24 hours prior to check-in to coordinate your Mewar heritage dining, sightseeing schedule, and any dietary preferences.`;
      actions = [
        { label: "⭐ Request Upgrade", type: "upgrade" },
        { label: "📄 Rules & Policy", type: "details" }
      ];
    } else if (option === "cancel") {
      messageText = `I want to cancel my reservation at ${booking.hotel.name} starting ${checkInDateStr}.`;
      
      const today = new Date();
      const checkIn = new Date(booking.checkInDate);
      const diffTime = checkIn - today;
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); // hours
      
      if (diffHours >= 48) {
        replyText = `We are sorry to hear that you need to cancel your stay at **${booking.hotel.name}**. Since check-in is on ${checkInDateStr} (more than 48 hours away), you are eligible for a **full refund** under our royal flexible terms.\n\nWould you like me to proceed with the cancellation and refund?`;
        if (!booking._id.startsWith("dummy")) {
          actions = [
            { label: "❌ Yes, Cancel Booking", type: "confirm_cancellation" }
          ];
        }
      } else {
        replyText = `We see that your check-in at **${booking.hotel.name}** is on ${checkInDateStr} (less than 48 hours away). Cancellations made within 48 hours incur a fee of the first night's stay. Would you like me to cancel this booking now anyway?`;
        if (!booking._id.startsWith("dummy")) {
          actions = [
            { label: "❌ Confirm Cancellation (Fee Applies)", type: "confirm_cancellation" }
          ];
        }
      }
    } else if (option === "confirm_cancellation") {
      messageText = `Confirm cancellation of my stay at ${booking.hotel.name}.`;
      
      // Add user message to UI
      const userMsg = {
        id: Date.now().toString(),
        sender: "user",
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      if (booking._id.startsWith("local-")) {
        const saved = JSON.parse(localStorage.getItem("wanderbee_bookings") || "[]");
        const updated = saved.map(b => b._id === booking._id ? { ...b, status: "cancelled", isPaid: false } : b);
        localStorage.setItem("wanderbee_bookings", JSON.stringify(updated));
        
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: `I have cancelled your local booking at **${booking.hotel.name}**. Your schedule has been updated.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }]);
          setIsTyping(false);
          toast.success("Stay cancelled successfully!");
          // Reload page to reflect updated bookings sidebar
          setTimeout(() => window.location.reload(), 1500);
        }, 1000);
      } else {
        try {
          const token = await getToken();
          if (!token) {
            toast.error("Please sign in to cancel.");
            setIsTyping(false);
            return;
          }
          const { data } = await axios.put(`/api/bookings/${booking._id}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setIsTyping(false);
          if (data.success) {
            setMessages((prev) => [...prev, {
              id: (Date.now() + 1).toString(),
              sender: "bot",
              text: `Pranam. I have successfully processed the cancellation for your stay at **${booking.hotel.name}**. A confirmation email with refund details has been sent to your registered email address.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
            toast.success("Stay cancelled successfully!");
            // Update parent bookings state
            setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: "cancelled" } : b));
          } else {
            setMessages((prev) => [...prev, {
              id: (Date.now() + 1).toString(),
              sender: "bot",
              text: `I encountered an issue cancelling your stay: ${data.message || 'Please contact our front desk.'}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
          }
        } catch (error) {
          setIsTyping(false);
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: `Failed to cancel booking: ${error.message}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }]);
        }
      }
      return; // Handled asynchronously, return immediately
    } else if (option === "details") {
      messageText = `Please show me the details and check-in rules for ${booking.hotel.name}.`;
      replyText = `Here are the details for booking **#${booking._id?.slice(-6).toUpperCase() || 'BS789'}** at **${booking.hotel.name}**:\n\n• **Room**: ${booking.room.roomType}\n• **Check-in**: ${checkInDateStr} (after 12:00 PM)\n• **Check-out**: ${new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (before 11:00 AM)\n• **Total Price**: ${currency}${booking.totalPrice.toLocaleString()}\n• **Status**: ${booking.status}\n\n*Check-in Rule*: Please carry a valid government ID (Aadhaar, Passport) for all guests upon arrival.`;
      actions = [
        { label: "⭐ Request Upgrade", type: "upgrade" },
        { label: "🤵 Book Butler", type: "butler" },
        { label: "❌ Cancel Stay", type: "cancel" }
      ];
    }

    if (!messageText) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: replyText,
        actions: actions,
        bookingContext: booking,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      toast.success("Query updated!");
    }, 1000);
  };

  return (
    <main className="jali-overlay min-h-screen pb-16 bg-background text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs text-gray-400 gap-1.5 font-inter mb-4">
          <span>India</span>
          <span>/</span>
          <span>Member Area</span>
          <span>/</span>
          <span className="text-primary font-semibold">Support & Assistance</span>
        </nav>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-gray-200/50 pb-6">
          <div className="text-left">
            <h1 className="font-montserrat text-3xl font-extrabold text-primary">Royal Support Desk</h1>
            <p className="text-gray-500 font-inter text-sm mt-1">
              Chat with our Heritage Butler Bot, connected to your profile preferences and reservation details.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Profile and Booking Links */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Profile Panel */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-premium text-left">
              <h2 className="font-montserrat text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person_pin</span>
                Guest Profile Context
              </h2>

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img 
                      className="w-14 h-14 rounded-full object-cover border border-gray-200" 
                      src={user.imageUrl} 
                      alt={user.fullName} 
                    />
                    <div>
                      <h3 className="font-montserrat text-base font-extrabold text-primary leading-tight">
                        {user.fullName}
                      </h3>
                      <p className="text-xs text-gray-500 font-inter truncate max-w-[200px]">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                      <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 border border-amber-200/50">
                        <span className="material-symbols-outlined text-[10px] font-fill" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                        Gold
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between text-center">
                    <div>
                      <span className="text-sm font-bold text-primary block">{upcomingBookings.length}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-montserrat">Upcoming stays</span>
                    </div>
                    <div className="border-l border-gray-100 h-6 my-auto"></div>
                    <div>
                      <span className="text-sm font-bold text-secondary block">1,850</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-montserrat">Stay Points</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">lock</span>
                  <p className="text-xs text-gray-500 font-inter mb-4">
                    Sign in to connect the AI Butler with your booking history and priority status.
                  </p>
                  <button 
                    onClick={openSignIn}
                    className="w-full bg-primary text-white font-montserrat text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-secondary transition-premium shadow-sm active:scale-95 cursor-pointer"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>

            {/* Bookings Link Panel */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-premium text-left">
              <h2 className="font-montserrat text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">book_online</span>
                Upcoming Bookings
              </h2>
              <p className="text-[10px] text-gray-400 font-inter mb-4">Click any upcoming stay card below to show live booking-specific help options.</p>

              {user ? (
                <div className="space-y-3">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-2xl">
                      <span className="material-symbols-outlined text-3xl text-gray-300">calendar_today</span>
                      <p className="text-[11px] text-gray-400 mt-1 font-inter">No upcoming stays found.</p>
                    </div>
                  ) : (
                    upcomingBookings.map((b) => {
                      const isExpanded = activeBooking?._id === b._id;
                      return (
                        <div 
                          key={b._id} 
                          className={`border rounded-2xl p-3 transition-premium text-left ${
                            isExpanded ? "border-secondary bg-slate-50/50" : "border-gray-100 hover:border-slate-300"
                          }`}
                        >
                          <div 
                            onClick={() => setActiveBooking(isExpanded ? null : b)}
                            className="flex gap-3 items-center cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                              <img src={b.room.images[0]} alt={b.hotel.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-montserrat text-xs font-bold text-primary truncate">
                                {b.hotel.name}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-inter mt-0.5">
                                {new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <span className={`material-symbols-outlined transition-transform duration-300 text-gray-400 ${isExpanded ? "rotate-180 text-secondary" : ""}`}>
                              expand_more
                            </span>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-col gap-2 animate-fadeIn">
                              <button 
                                onClick={() => handleBookingOption(b, "upgrade")}
                                className="w-full flex items-center gap-2 bg-primary/5 hover:bg-primary hover:text-white text-primary text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-xl transition-premium text-left cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">stars</span>
                                ⭐ Request Upgrade
                              </button>
                              <button 
                                onClick={() => handleBookingOption(b, "butler")}
                                className="w-full flex items-center gap-2 bg-primary/5 hover:bg-primary hover:text-white text-primary text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-xl transition-premium text-left cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">room_service</span>
                                🤵 Pre-book Butler
                              </button>
                              <button 
                                onClick={() => handleBookingOption(b, "details")}
                                className="w-full flex items-center gap-2 bg-slate-50 hover:bg-slate-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-xl transition-premium text-left cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">info</span>
                                📄 Rules & Receipt
                              </button>
                              <button 
                                onClick={() => handleBookingOption(b, "cancel")}
                                className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-xl transition-premium text-left cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                ❌ Cancel Stay
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-300">
                  <span className="material-symbols-outlined text-5xl">calendar_today</span>
                  <p className="text-[11px] text-gray-400 mt-2 font-inter">Sign in to view your heritage reservations.</p>
                </div>
              )}
            </div>

            {/* Quick Policies & Contact Info */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-premium text-left space-y-4">
              <h2 className="font-montserrat text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                Quick Reference
              </h2>
              <div className="space-y-3 text-xs text-gray-500 font-inter">
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg shrink-0">schedule</span>
                  <p>Check-in: 12:00 PM | Checkout: 11:00 AM (Gold Tier: 4:00 PM check-out eligibility)</p>
                </div>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg shrink-0">shield_with_heart</span>
                  <p>Royal Cleanliness Protocol is active across all Rajasthan Heritage Haveli assets.</p>
                </div>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg shrink-0">call</span>
                  <p>Concierge Hotline: +91 294 242 7700 (Udaipur Central Desk)</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Chatbot Interface */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-[650px] relative">
              
              {/* Chat Header */}
              <div className="bg-primary p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative">
                    <span className="material-symbols-outlined text-xl text-amber-200">support_agent</span>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-primary rounded-full"></span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-montserrat text-sm font-bold tracking-wide">Heritage AI Butler</h3>
                    <p className="text-[10px] text-amber-200 font-inter">Mewar Royal Butler Service</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold font-montserrat">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Support Connected
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
                      </div>
                    )}
                    <div className="flex flex-col max-w-[80%]">
                      <div 
                        className={`rounded-2xl px-4 py-3 text-sm font-inter text-left shadow-sm ${
                          msg.sender === "user" 
                            ? "bg-secondary text-white rounded-tr-none" 
                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none whitespace-pre-line"
                        }`}
                      >
                        {msg.text}
                        
                        {/* Interactive Message Action Options */}
                        {msg.sender === "bot" && msg.actions && msg.bookingContext && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                            {msg.actions.map((act, i) => (
                              <button 
                                key={i}
                                onClick={() => handleBookingOption(msg.bookingContext, act.type)}
                                className="bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-premium cursor-pointer"
                              >
                                {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className={`text-[9px] text-gray-400 mt-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 border-t border-gray-100 bg-white overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
                <button 
                  onClick={() => handleQuickQuestion("Show my booking details")}
                  className="inline-block bg-slate-50 hover:bg-primary/5 hover:text-primary text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200/60 transition-premium cursor-pointer"
                >
                  🛎️ Stay Bookings
                </button>
                <button 
                  onClick={() => handleQuickQuestion("What are the butler services?")}
                  className="inline-block bg-slate-50 hover:bg-primary/5 hover:text-primary text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200/60 transition-premium cursor-pointer"
                >
                  🤵 Heritage Butler Info
                </button>
                <button 
                  onClick={() => handleQuickQuestion("Am I eligible for room upgrade?")}
                  className="inline-block bg-slate-50 hover:bg-primary/5 hover:text-primary text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200/60 transition-premium cursor-pointer"
                >
                  ✨ Room Upgrade
                </button>
                <button 
                  onClick={() => handleQuickQuestion("What is the cancellation policy?")}
                  className="inline-block bg-slate-50 hover:bg-primary/5 hover:text-primary text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200/60 transition-premium cursor-pointer"
                >
                  📄 Cancellation Rules
                </button>
                <button 
                  onClick={() => handleQuickQuestion("Recommend places to visit in Udaipur")}
                  className="inline-block bg-slate-50 hover:bg-primary/5 hover:text-primary text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200/60 transition-premium cursor-pointer"
                >
                  🗺️ Udaipur Sightseeing
                </button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-3">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your bookings, room upgrade status, heritage butler services..."
                  className="flex-1 bg-slate-50 hover:bg-slate-100/50 border border-gray-200/60 rounded-xl px-4 py-3 text-xs outline-none transition-premium focus:ring-1 focus:ring-primary focus:bg-white text-gray-800"
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-secondary transition-premium flex items-center justify-center shadow-sm disabled:opacity-40 disabled:hover:bg-primary disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Support;
