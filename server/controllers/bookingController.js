import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import Hotel from "../models/Hotel.js"
import Experience from "../models/Experience.js"
import { sendBookingConfirmationEmail, sendPaymentConfirmationEmail, sendCancellationEmail, sendExperienceBookingEmail } from "../configs/emailService.js"



// Function to Check Availabilty of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate, }
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check availability of room
// POST /api/bookings/check-availabity

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
    try {
        console.log("createBooking request body:", req.body);
        const { experience, room, checkInDate, checkOutDate, guests, paymentMethod, isPaid, cancellationPolicy, totalPrice: bodyTotalPrice } = req.body;
        const user = req.user._id;

        if (experience) {
            // Experience Booking Path
            const experienceData = await Experience.findById(experience);
            if (!experienceData) {
                return res.json({ success: false, message: "Experience Not Found" });
            }

            const basePrice = experienceData.price || 0;
            const guestsCount = +guests || 1;
            const gstAmount = basePrice * guestsCount * 0.05;
            let totalPrice = (basePrice * guestsCount) + gstAmount;

            if (isNaN(totalPrice) || !totalPrice) {
                totalPrice = bodyTotalPrice;
            }

            const booking = await Booking.create({
                user,
                bookingType: "experience",
                experience: experienceData._id,
                guests: guestsCount,
                checkInDate: checkInDate || new Date(),
                checkOutDate: checkInDate || new Date(),
                totalPrice,
                paymentMethod: paymentMethod || "Pay At Hotel",
                isPaid: isPaid || false,
                status: isPaid ? "confirmed" : "pending",
                cancellationPolicy: "Free Cancellation"
            });

            // Send confirmation email
            sendExperienceBookingEmail(req.user.email, req.user.username, booking, experienceData);

            return res.json({ success: true, message: "Experience Booking Created Successfully", booking });
        }

        // Before Booking Check Availabilty
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if (!isAvailable) {
            console.log("Availability check failed: room is not available");
            return res.json({ success: false, message: "Room is Not Available" })
        }
        // Get totalPrice from Room
        const roomData = await Room.findById(room).populate("hotel");
        if (!roomData) {
            console.error(`Room not found in DB: ${room}`);
            return res.json({ success: false, message: "Room Not Found" });
        }
        
        const basePrice = roomData.pricePerNight;
        const policy = roomData.cancellationPolicy || "Free Cancellation";

        //Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        let nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (isNaN(nights) || nights <= 0) {
            nights = 1;
        }

        const discountedPrice = basePrice || 0;

        let gstRate = 0;
        if (discountedPrice <= 1000) {
            gstRate = 0;
        } else if (discountedPrice <= 7500) {
            gstRate = 0.05;
        } else {
            gstRate = 0.18;
        }
        const gstAmount = discountedPrice * nights * gstRate;
        let totalPrice = (discountedPrice * nights) + gstAmount;

        // Robust fallback to bodyTotalPrice if calculation failed or resulted in NaN
        if (isNaN(totalPrice) || !totalPrice) {
            console.log("Calculated totalPrice is NaN or invalid. Falling back to bodyTotalPrice:", bodyTotalPrice);
            totalPrice = bodyTotalPrice;
        }

        console.log(`Booking values: user=${user}, room=${room}, hotel=${roomData.hotel?._id}, guests=${guests}, checkIn=${checkInDate}, checkOut=${checkOutDate}, totalPrice=${totalPrice}`);

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel?._id || roomData.hotel,
            guests: +guests || 1,
            checkInDate,
            checkOutDate,
            totalPrice,
            paymentMethod: paymentMethod || "Pay At Hotel",
            isPaid: isPaid || false,
            cancellationPolicy: policy
        })

        // Send confirmation email (async, non-blocking)
        sendBookingConfirmationEmail(req.user.email, req.user.username, booking, roomData.hotel, roomData);

        res.json({ success: true, message: "Booking Created Successfully" })
    } catch (error) {
        console.error("Error in createBooking:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to Create Booking" })
    }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel experience").sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found" });

        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
        // Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" })
    }
}

// API to pay for an existing booking
// PUT /api/bookings/:id/pay
export const payBooking = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        
        console.log(`PayBooking auth check: booking.user='${booking.user}', req.user._id='${req.user._id}'`);
        if (booking.user.toString() !== req.user._id.toString()) {
            console.error("PayBooking auth failed: mismatch user ID");
            return res.json({ success: false, message: "Not authorized to pay for this booking" });
        }

        booking.isPaid = true;
        booking.status = "confirmed"; // Use 'confirmed' to match models/Booking.js schema enum
        booking.paymentMethod = paymentMethod || "Credit/Debit Card";
        await booking.save();

        if (booking.bookingType === "experience") {
            const experienceData = await Experience.findById(booking.experience);
            sendExperienceBookingEmail(req.user.email, req.user.username, booking, experienceData);
        } else {
            // Populate room and hotel details for the email receipt
            try {
                await booking.populate("room hotel");
            } catch (populateError) {
                console.error("Mongoose populate failed in payBooking:", populateError);
            }

            let populatedRoom = booking.room;
            let populatedHotel = booking.hotel;
            
            // Manual fallback if populate returned IDs or strings instead of full objects
            if (!populatedRoom || typeof populatedRoom === 'string' || !populatedHotel || typeof populatedHotel === 'string') {
                const roomData = await Room.findById(booking.room || booking.room?._id).populate("hotel");
                if (roomData) {
                    populatedRoom = roomData;
                    populatedHotel = roomData.hotel || populatedHotel;
                }
            }

            console.log(`Sending payment confirmation email to ${req.user?.email || 'unknown'} for booking ${booking._id}`);
            // Send payment confirmation email (async, non-blocking)
            sendPaymentConfirmationEmail(req.user.email, req.user.username, booking, populatedHotel, populatedRoom);
        }

        res.json({ success: true, message: "Booking Paid Successfully", booking });
    } catch (error) {
        console.error("Pay Booking Error:", error);
        res.json({ success: false, message: error.message || "Failed to pay for booking" });
    }
}

// API to cancel an existing booking
// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
        }

        booking.status = "cancelled";
        if (booking.cancellationPolicy === "Cancellation Fee Applicable") {
            booking.cancellationFee = booking.totalPrice * 0.5;
            booking.refundAmount = booking.totalPrice * 0.5;
        } else {
            booking.cancellationFee = 0;
            booking.refundAmount = booking.totalPrice;
        }
        await booking.save();

        // Populate room and hotel details for the cancellation confirmation
        await booking.populate("room hotel");

        let populatedRoom = booking.room;
        let populatedHotel = booking.hotel;
        
        // Manual fallback if populate returned IDs or strings instead of full objects
        if (!populatedRoom || typeof populatedRoom === 'string' || !populatedHotel || typeof populatedHotel === 'string') {
            const roomData = await Room.findById(booking.room || booking.room?._id).populate("hotel");
            if (roomData) {
                populatedRoom = roomData;
                populatedHotel = roomData.hotel || populatedHotel;
            }
        }

        console.log(`Sending cancellation email to ${req.user?.email || 'unknown'} for booking ${booking._id}`);
        // Send cancellation email (async, non-blocking)
        sendCancellationEmail(req.user.email, req.user.username, booking, populatedHotel, populatedRoom);

        res.json({ success: true, message: "Booking Cancelled Successfully", booking });
    } catch (error) {
        console.error("Cancel Booking Error:", error);
        res.json({ success: false, message: "Failed to cancel booking" });
    }
}

