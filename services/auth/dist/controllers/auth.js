import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from 'bcrypt';
import getBuffer from "../utils/buffer.js";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { forgotPasswordTemplate } from "../template.js";
import { PublishToTopic } from "../producer.js";
import { redisClient } from "../index.js";
const registerUser = AsyncHandler(async (req, res, next) => {
    const { name, email, password, phone_number, role, bio } = req.body;
    if (!email || !password || !name || !phone_number || !role)
        throw new ApiError(400, "All fields are required");
    const existingUser = await sql `SELECT * FROM users WHERE email = ${email}`;
    // if (existingUser) console.log("user exists ",existingUser)
    if (existingUser.length > 0)
        throw new ApiError(400, "User already exists");
    const hashedPass = await bcrypt.hash(password, 10);
    let registeredUser;
    if (role === 'jobseeker') {
        const file = req.file; // multer 
        // console.log("file ",file);
        if (!file) {
            throw new ApiError(400, "Resume File is required");
        }
        if (!bio)
            throw new ApiError(400, "Bio is required");
        const fileBuffer = await getBuffer(file);
        //console.log("file buffer ",fileBuffer);
        if (!fileBuffer || !fileBuffer.content)
            throw new ApiError(500, "failed to Genrate Buffer");
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
            buffer: fileBuffer.content,
            public_id: undefined
        });
        const dbres = await sql `INSERT INTO users (name,email,password,phone_number,role,bio,resume,resume_public_id) 
        VALUES (${name},${email},${hashedPass},${phone_number},${role},${bio},${data.url},${data.public_id}) RETURNING user_id,name,email,phone_number,role,bio,resume,created_at`;
        // console.log("user is  ",dbres);
        registeredUser = dbres[0];
    }
    else {
        const [user] = await sql `INSERT INTO users (name,email,password,phone_number,role) 
        VALUES (${name},${email},${hashedPass},${phone_number},${role}) RETURNING user_id,name,email,phone_number,role,created_at`;
        registeredUser = user;
    }
    const token = await jwt.sign({
        user_id: registeredUser?.user_id,
        email: registeredUser?.email,
        role: registeredUser?.role
    }, process.env.JWT_SECRET, { expiresIn: '15d' });
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    return res.status(201).cookie('token', token, options).json({ "user": registeredUser, "message": "User Registered Successfully", "token": token });
});
const loginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new ApiError(400, "All fields are required");
    const user = await sql `SELECT u.user_id,u.name,u.email,u.password,u.phone_number,u.role,u.bio,u.resume,u.profile_pic,u.subscription, ARRAY_AGG(s.name) Filter (WHERE s.name IS NOT NULL) AS skills
     FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.email = ${email} GROUP BY u.user_id `;
    if (user.length === 0)
        throw new ApiError(400, "Invalid Credentials");
    const userobj = user[0];
    userobj.password = userobj.password.toString();
    const isMatch = await bcrypt.compare(password, userobj.password);
    if (!isMatch)
        throw new ApiError(401, "Invalid Credentials");
    userobj.skills = userobj.skills || [];
    delete userobj.password;
    const token = await jwt.sign({
        user_id: userobj.user_id,
        email: userobj.email,
        role: userobj.role
    }, process.env.JWT_SECRET, { expiresIn: '15d' });
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    return res.status(200).cookie('token', token, options).json({ "user": user, "message": "User Logged In Successfully", "token": token });
});
const forgotPassword = AsyncHandler(async (req, res, next) => {
    const { email } = req.body; // email is the single source of truth,as user must be the owner of that email to reset password as link is sent to that email only 
    if (!email)
        throw new ApiError(400, "Email is required");
    const users = await sql `SELECT user_id,email  FROM users WHERE email = ${email}`;
    if (users.length === 0)
        throw new ApiError(400, "User not found");
    const user = users[0];
    const resetToken = await jwt.sign({
        email: user.email,
        type: 'reset'
    }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await redisClient.set(`forgot:${email}`, resetToken, { EX: 900 }); // 900 sec - 15 min
    const message = {
        to: email,
        subject: "Reset Your Password  - EzHire",
        html: forgotPasswordTemplate(resetLink)
    };
    PublishToTopic("send-mail", message).catch((error) => {
        console.log("Filed to Send the Reset Link to Mail :", error);
    });
    return res.status(200).json({ "message": "Password reset link has been sent to your email" });
});
const resetPassword = AsyncHandler(async (req, res, next) => {
    const { token } = req.params;
    if (!token)
        throw new ApiError(400, "Token is required");
    const { password: newpassword } = req.body;
    if (!newpassword)
        throw new ApiError(400, "Password is required");
    let decodedToken;
    decodedToken = await jwt.verify(token.toString(), process.env.JWT_SECRET);
    if (!decodedToken)
        throw new ApiError(400, "Token is Expired");
    if (decodedToken.type !== 'reset')
        throw new ApiError(400, "Invalid Token");
    const email = decodedToken?.email;
    const StoredToken = await redisClient.get(`forgot:${email}`);
    if (!StoredToken || StoredToken !== token)
        throw new ApiError(400, "Token has expired "); // no stored token means time of changing password window expired 
    const users = await sql `SELECT user_id,email  FROM users WHERE email = ${email}`;
    if (users.length === 0)
        throw new ApiError(400, "User not found");
    const user = users[0];
    const hashedPass = await bcrypt.hash(newpassword, 10);
    await sql `UPDATE users SET password = ${hashedPass} WHERE email = ${email}`;
    await redisClient.del(`forgot:${email}`); // deleting token after reseting password one time so that link stolen can't affect much 
    return res.status(200).json({ "message": "Password has been reset successfully" });
});
export { registerUser, loginUser, forgotPassword, resetPassword };
