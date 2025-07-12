import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/user.js';
import skillRoutes from './routes/skills.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes

app.use("/api/user", userRoutes);
app.use("/api/skills", skillRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API running...');
});

export default app;
