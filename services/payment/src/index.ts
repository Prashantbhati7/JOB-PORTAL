import express from 'express'
import dotenv from 'dotenv'
import Razorpay from 'razorpay';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

export const instance = new Razorpay({
    key_id:process.env.Razorpay_key,
    key_secret:process.env.Razorpay_Secret,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}));
app.use(express.urlencoded());
import paymentRouter from './routes/payment.js'
app.use('/api/payment',paymentRouter);
const PORT = process.env.PORT;
app.listen(PORT,()=> console.log("payment service is running on port ",PORT));