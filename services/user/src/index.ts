import express from 'express';
import dotenv from 'dotenv';
import userrouter from './routes/user.js';
import cookieParser from 'cookie-parser';

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));



app.use('/api/user',userrouter);
app.use((err:any,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    return res.status(err.statusCode || 500).json({message:err.message})
} )

const PORT = process.env.PORT || 5003;

app.listen(PORT,()=> console.log("User service is running on port ",PORT));
