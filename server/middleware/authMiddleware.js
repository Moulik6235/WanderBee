import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    const userId = req.auth?.userId; // No longer a function call
    console.log('userid....', userId);

    if (!userId) {
        return res.status(401).json({ success: false, message: "Not Authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
};