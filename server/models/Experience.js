import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    hotel: { type: String, ref: "Hotel" },
    owner: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    timing: { type: String, required: true },
    category: { type: String, default: "Adventure" },
    duration: { type: String, default: "2 hours" },
    images: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 12 }
}, { timestamps: true });

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
