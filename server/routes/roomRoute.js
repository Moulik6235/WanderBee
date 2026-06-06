import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability, updateRoomPrice, updateRoomCancellation } from "../controllers/roomController.js";


const roomRouter = express.Router();

roomRouter.post('/',upload.array("images",4), protect,createRoom)
roomRouter.get('/',getRooms)
roomRouter.get('/owner',protect,getOwnerRooms)
roomRouter.post('/toggle-availabi', protect, toggleRoomAvailability)
roomRouter.post('/update-price', protect, updateRoomPrice)
roomRouter.post('/update-cancellation', protect, updateRoomCancellation)

export default roomRouter;