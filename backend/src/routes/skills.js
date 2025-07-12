import express from 'express';
import Skills from '../models/Skills.js';

const router = express.Router();

// GET /api/skills - returns skills grouped by category
router.get('/', async (req, res) => {
  try {
    const skills = await Skills.find();
    const grouped = {};

    for (const skill of skills) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push({ name: skill.name });
    }

    res.json(grouped);
  } catch (err) {
    console.error("Error fetching skills:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
