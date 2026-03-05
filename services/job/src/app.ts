import express from 'express'
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

import jobrouter from './routes/job.js';

app.use('/api',jobrouter);

app.use((err:any,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    return res.status(err.statusCode || 500).json({message:err.message})
} )
export default app;

