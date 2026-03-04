import express from 'express';
import dotenv from 'dotenv';
import routes from './route.js';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import startSendMailConsumer from './consumer.js';
dotenv.config();
startSendMailConsumer();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
const app = express();
app.use(cors({ credentials: true }));
const PORT = process.env.PORT || 5001;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/utils', routes);
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ message: err.message });
});
app.listen(PORT, () => { console.log("Utils service is running on port ", PORT); });
