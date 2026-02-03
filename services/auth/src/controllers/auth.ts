import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { sql } from "../utils/db.js";

import bcrypt from 'bcrypt';


const registerUser = AsyncHandler(async(req,res,next)=>{
    const {name,email,password,phone_number,role,bio} = req.body;
    if (!email || !password || !name || !phone_number || !role ) throw new ApiError(400,"All fields are required")
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if(existingUser) throw new ApiError(400,"User already exists");

    const hashedPass = await bcrypt.hash(password,10);
    let registeredUser ;
    if (role === 'jobseeker'){
        const file = req.file ;     // multer 
        const [user] = await sql`INSERT INTO users (name,email,password,phone_number,role,bio) VALUES
        ()`
    }else{
        const [user] = await sql`INSERT INTO users (name,email,password,phone_number,role) 
        VALUES (${name},${email},${hashedPass},${phone_number},${role},${bio}) RETURNING user_id,name,email,phone_number,role,created_at]`;
        registeredUser = user;
    }

    return res.send({"email ":email})
})  


export {registerUser};