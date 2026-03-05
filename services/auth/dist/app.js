import express from 'express';
import authRoutes from './routes/auth.js';
import { connectKafka } from './producer.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
connectKafka();
app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ message: err.message });
});
export default app;
