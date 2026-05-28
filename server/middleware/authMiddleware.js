import User from "../models/User.js";
import { clerkClient } from '@clerk/express';

// Middleware to check if user is authenticated and self-heal missing database records
export const protect = async (req, res, next) => {
    const userId = req.auth?.userId;
    console.log('Authenticating Clerk User ID:', userId);

    if (!userId) {
        return res.status(401).json({ success: false, message: "Not Authenticated" });
    }

    try {
        let user = await User.findById(userId);
        
        if (!user) {
            console.log(`User ${userId} not found in database. Initiating self-healing...`);
            try {
                // Fetch full user details from Clerk Backend API
                const clerkUser = await clerkClient.users.getUser(userId);
                const email = clerkUser.emailAddresses[0]?.emailAddress || "user@bharatstay.com";
                const username = ((clerkUser.firstName || "") + " " + (clerkUser.lastName || "")).trim() || "BharatStay Guest";
                const image = clerkUser.imageUrl || "https://img.clerk.com/placeholder";
                
                user = await User.create({
                    _id: userId,
                    username,
                    email,
                    image,
                    role: "user",
                    recentSearchedCities: []
                });
                console.log("Successfully self-healed and created user in MongoDB:", username);
            } catch (err) {
                console.error("Clerk API fetch failed, falling back to stub user creation:", err.message);
                user = await User.create({
                    _id: userId,
                    username: "BharatStay Guest",
                    email: "guest@bharatstay.com",
                    image: "https://img.clerk.com/placeholder",
                    role: "user",
                    recentSearchedCities: []
                });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error in protect middleware:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};