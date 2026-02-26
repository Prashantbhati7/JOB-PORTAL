import app from './app.js'

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5004;

app.listen(PORT,()=> console.log("User service is running on port ",PORT));
