// controllers/profileController.js
import User from "../models/User.js";

export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("[GET PROFILE]", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLoggedInUser = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("[UPDATE PROFILE]", err);
    res.status(500).json({ message: "Update failed" });
  }
};