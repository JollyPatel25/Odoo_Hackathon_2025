// src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    console.log("🔔 Incoming register request:", req.body);
  
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      console.log("⚠️ Missing fields in request");
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("⚠️ Email already exists:", email);
        return res.status(400).json({ message: "Email already in use" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
      console.log("✅ New user saved:", newUser);
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      console.error("❌ Server error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });
  
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  export const validateToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ message: "Token valid", userId: decoded.userId });
    } catch (err) {
      return res.status(401).json({ message: "Token invalid" });
    }
  };