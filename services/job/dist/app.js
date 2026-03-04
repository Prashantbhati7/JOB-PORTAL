import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import jobrouter from './routes/job.js';
app.use('/api', jobrouter);
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ message: err.message });
});
export default app;
