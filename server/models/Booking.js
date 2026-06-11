import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, ref: "User", required: true },
    bookingType: {
        type: String,
        enum: ["room", "experience"],
        default: "room"
    },
    room: { type: String, ref: "Room", required: false },
    hotel: { type: String, ref: "Hotel", required: false },
    experience: { type: String, ref: "Experience", required: false },
    checkInDate: { type: Date, required: false },
    checkOutDate: { type: Date, required: false },
    guests: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "Pay At Hotel",
    },
    isPaid: { type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
    cancellationPolicy: {
        type: String,
        enum: ["Free Cancellation", "Cancellation Fee Applicable"],
        default: "Free Cancellation"
    },
    cancellationFee: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;