import express from 'express';
import authRoutes from './routes/auth.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ "Error : ": err.message });
});
export default app;
