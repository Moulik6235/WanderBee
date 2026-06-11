import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/Hotel.js";
import Experience from "../models/Experience.js";

// API to create a new experience
export const createExperience = async (req, res) => {
    try {
        const { title, description, price, location, timing, category, duration } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        // upload images to cloudinary
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const response = await cloudinary.uploader.upload(file.path);
                return response.secure_url;
            });
            images = await Promise.all(uploadImages);
        }

        const newExperience = await Experience.create({
            hotel: hotel ? hotel._id : null,
            owner: req.auth.userId,
            title,
            description,
            price: +price,
            location,
            timing,
            category: category || "Adventure",
            duration: duration || "2 hours",
            images
        });

        res.json({ success: true, message: "Experience created successfully", experience: newExperience });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get all experiences
export const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().populate("hotel").sort({ createdAt: -1 });
        res.json({ success: true, experiences });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get all experiences for a specific owner
export const getOwnerExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find({ owner: req.auth.userId }).populate("hotel").sort({ createdAt: -1 });
        res.json({ success: true, experiences });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to delete an experience
export const deleteExperience = async (req, res) => {
    try {
        const { experienceId } = req.params;
        const experience = await Experience.findById(experienceId);
        if (!experience) {
            return res.json({ success: false, message: "Experience not found" });
        }
        if (experience.owner !== req.auth.userId) {
            return res.json({ success: false, message: "Unauthorized access to delete this experience" });
        }
        await Experience.findByIdAndDelete(experienceId);
        res.json({ success: true, message: "Experience deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
