import express from 'express';
import dotenv from 'dotenv';
import userrouter from './routes/user.js';
dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/api/user',userrouter);


const PORT = process.env.PORT || 5003;

app.listen(PORT,()=> console.log("Utils service is running on port ",PORT));
