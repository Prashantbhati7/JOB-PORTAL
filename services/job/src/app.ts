import express from 'express'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

import jobrouter from './routes/job.js';

app.use('/api',jobrouter);

app.use((err:any,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    return res.status(err.statusCode || 500).json({"Error : ":err.message})
} )
export default app;

