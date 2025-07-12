import express from 'express';
import cors from 'cors';

const app = express();

// Setup for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/skills', skillRoutes);
// API routes
app.use("/api/user", userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API running...');
});

export default app;
