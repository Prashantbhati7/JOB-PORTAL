import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from 'bcrypt';
import getBuffer from "../utils/buffer.js";
import axios from "axios";
const registerUser = AsyncHandler(async (req, res, next) => {
    const { name, email, password, phone_number, role, bio } = req.body;
    if (!email || !password || !name || !phone_number || !role)
        throw new ApiError(400, "All fields are required");
    const existingUser = await sql `SELECT * FROM users WHERE email = ${email}`;
    if (existingUser)
        console.log("user exists ", existingUser);
    if (existingUser.length > 0)
        throw new ApiError(400, "User already exists");
    const hashedPass = await bcrypt.hash(password, 10);
    let registeredUser;
    if (role === 'jobseeker') {
        const file = req.file; // multer 
        console.log("file ", file);
        if (!file) {
            throw new ApiError(400, "Resume File is required");
        }
        const fileBuffer = await getBuffer(file);
        //console.log("file buffer ",fileBuffer);
        if (!fileBuffer || !fileBuffer.content)
            throw new ApiError(500, "failed to Genrate Buffer");
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
            buffer: fileBuffer.content,
            public_id: undefined
        });
        console.log("data from cloudinary is  ", data);
        const dbres = await sql `INSERT INTO users (name,email,password,phone_number,role,bio,resume,resume_public_id) 
        VALUES (${name},${email},${hashedPass},${phone_number},${role},${bio},${data.url},${data.public_id}) RETURNING user_id,name,email,phone_number,role,bio,resume,created_at`;
        console.log("user is  ", dbres);
        registeredUser = dbres[0];
    }
    else {
        const [user] = await sql `INSERT INTO users (name,email,password,phone_number,role) 
        VALUES (${name},${email},${hashedPass},${phone_number},${role},${bio}) RETURNING user_id,name,email,phone_number,role,created_at`;
        registeredUser = user;
    }
    return res.json({ "user": registeredUser, "message": "User Registered Successfully" });
});
export { registerUser };
