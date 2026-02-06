import express from 'express';
import dotenv from 'dotenv';
import routes from './route.js';
import cors from 'cors'; 
import {v2 as cloudinary} from 'cloudinary';
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})


const app = express();
app.use(cors());

const PORT  = process.env.PORT || 5001;

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));


app.use('/api/utils',routes);





app.listen(PORT,()=> {console.log("Utils service is running on port ",PORT)});