import express from 'express';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings, payBooking, cancelBooking } from '../controllers/bookingController.js';
import {protect} from "../middleware/authMiddleware.js"

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI)
bookingRouter.post('/book',protect, createBooking)
bookingRouter.get('/user',protect, getUserBookings)
bookingRouter.get('/hotel',protect, getHotelBookings)
bookingRouter.put('/:id/pay', protect, payBooking)
bookingRouter.put('/:id/cancel', protect, cancelBooking)

export default bookingRouter