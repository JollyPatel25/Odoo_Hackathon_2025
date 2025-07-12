// routes/user.js
import express from "express";
import { getPublicProfiles } from "../controllers/userController.js";
import { getLoggedInUser, updateLoggedInUser } from "../controllers/profileController.js";
import User from "../models/User.js";
// import { authenticateUser } from "../middleware/auth.js";
const router = express.Router();

router.get("/profiles", getPublicProfiles);
// Get first user (for temporary preview/testing)
router.get("/first", async (req, res) => {
  try {
    const user = await User.findOne().select("-password -__v");
    if (!user) return res.status(404).json({ message: "No users found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching first user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/me", authenticateUser, getLoggedInUser);
// router.put("/me", authenticateUser, updateLoggedInUser);
export default router;