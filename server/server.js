import express from "express"
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import experienceRouter from "./routes/experienceRoute.js";

connectDB()
connectCloudinary()

const app = express()
app.use(cors()) //Enable Cross-Origin Sharing

// Middleware
app.use(express.json())
app.use(clerkMiddleware())
// 👇 Add Clerk middleware globally if needed
app.use(ClerkExpressWithAuth());

// API to listen to Clerk Webhooks
app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send("API is Working"))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/experiences', experienceRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));