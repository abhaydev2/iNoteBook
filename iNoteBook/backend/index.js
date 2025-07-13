// index.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import helmet from 'helmet';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend
app.use(cors({
  origin:[ 'http://localhost:5173', 'http://localhost:5174'], // adjust if your frontend runs on a different port
  credentials: true
}));

app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
