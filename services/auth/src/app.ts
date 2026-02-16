import express from 'express';
import authRoutes from './routes/auth.js'
import ApiError from './utils/ApiError.js';
import { connectKafka } from './producer.js';

const app = express();
app.use(express.json());

app.use(express.urlencoded({extended:true}))

connectKafka();

app.use('/api/auth',authRoutes);


app.use((err:ApiError,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    return res.status(err.statusCode || 500).json({"Error : ":err.message})
})
export default app;