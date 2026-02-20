import { sql } from "../utils/db.js";
import jwt from 'jsonwebtoken';
import ApiError from "../utils/ApiError.js";
export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token)
            throw new Error("Token not Found");
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken || !decodedToken.user_id)
            throw new Error("Invalid Token");
        const user = await sql `SELECT u.user_id,u.name,u.email,u.phone_number,u.role,u.bio,u.resume,u.resume_public_id,u.profile_pic,u.profile_pic_public_id,u.subscription, ARRAY_AGG(s.name) Filter (WHERE s.name IS NOT NULL) AS skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.email = ${decodedToken.email} GROUP BY u.user_id `;
        if (user.length === 0)
            throw new ApiError(404, "User not Authenticated ");
        req.user = user[0];
        next();
    }
    catch (error) {
        next(error);
    }
};
