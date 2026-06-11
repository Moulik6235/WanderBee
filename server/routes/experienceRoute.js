import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    createExperience,
    getExperiences,
    getOwnerExperiences,
    deleteExperience
} from "../controllers/experienceController.js";

const experienceRouter = express.Router();

experienceRouter.post('/', upload.array("images", 4), protect, createExperience);
experienceRouter.get('/', getExperiences);
experienceRouter.get('/owner', protect, getOwnerExperiences);
experienceRouter.delete('/:experienceId', protect, deleteExperience);

export default experienceRouter;
