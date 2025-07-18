// src/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, validateToken } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validate", validateToken);
export default router;
