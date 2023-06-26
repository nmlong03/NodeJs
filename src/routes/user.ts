import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getUserProfile, updateUserProfile } from "../controllers/user";

const router: Router = express.Router();
router.post("/user/profile", authenticate, getUserProfile)
router.put('/user/update', authenticate, updateUserProfile)
export default router;
