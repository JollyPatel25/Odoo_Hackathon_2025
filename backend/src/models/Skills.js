// models/Skills.js
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["frameworks", "languages", "tools", "design", "databases", "others"]
  },
  skills: {
    type: [String],
    required: true
  }
});

const Skills = mongoose.model("Skills", skillSchema, "Skills");

export default Skills;
