// routes/user.js
import express from "express";
import { getPublicProfiles } from "../controllers/userController.js";
import { getLoggedInUser, updateLoggedInUser } from "../controllers/profileController.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import authMiddleware from "../middleware/auth.js"; 

const router = express.Router();

router.get("/profiles", getPublicProfiles);

router.get("/me", authMiddleware, getLoggedInUser);
router.put("/me", authMiddleware, updateLoggedInUser);
router.get('/requests',async (req, res) => {
  const userId = req.user.id;
  const { type } = req.query; // 'pending' or 'sent'

  try {
    let requests = [];

    if (type === 'sent') {
      requests = await Request.find({ sender: userId, status: 'pending' }).populate('receiver');
    } else {
      // default to pending received
      requests = await Request.find({ receiver: userId, status: 'pending' }).populate('sender');
    }

    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;