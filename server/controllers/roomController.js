import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// API to Create a new room for a Hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities, cancellationPolicy } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId })

        if (!hotel) return res.json({ success: false, message: "No Hotel Found" });

        // upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })
        // Wait for all uploads to complete
        const images = await Promise.all(uploadImages)

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
            cancellationPolicy: cancellationPolicy || "Free Cancellation"
        })
        res.json({ success: true, message: "Room created successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API to get All Rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get All Rooms for a Specific Hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId })
        if (!hotelData) {
            return res.json({ success: true, rooms: [] });
        }
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//API to Toggle Availability of a Room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room availabilty Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to Update Price of a Room
export const updateRoomPrice = async (req, res) => {
    try {
        const { roomId, pricePerNight, cancellationPolicy } = req.body;
        
        // Find the room
        const roomData = await Room.findById(roomId);
        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }
        
        // Find the hotel of the owner
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel || roomData.hotel.toString() !== hotel._id.toString()) {
            return res.json({ success: false, message: "Unauthorized access to this room" });
        }
        
        if (pricePerNight !== undefined) {
            roomData.pricePerNight = +pricePerNight;
        }
        if (cancellationPolicy !== undefined) {
            roomData.cancellationPolicy = cancellationPolicy;
        }
        
        await roomData.save();
        res.json({ 
            success: true, 
            message: "Room details updated successfully", 
            pricePerNight: roomData.pricePerNight,
            cancellationPolicy: roomData.cancellationPolicy 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to Update Cancellation Policy of a Room
export const updateRoomCancellation = async (req, res) => {
    try {
        const { roomId, cancellationPolicy } = req.body;
        
        // Find the room
        const roomData = await Room.findById(roomId);
        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }
        
        // Find the hotel of the owner
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel || roomData.hotel.toString() !== hotel._id.toString()) {
            return res.json({ success: false, message: "Unauthorized access to this room" });
        }
        
        roomData.cancellationPolicy = cancellationPolicy || "Free Cancellation";
        await roomData.save();
        res.json({ success: true, message: "Room cancellation policy updated successfully", cancellationPolicy: roomData.cancellationPolicy });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}