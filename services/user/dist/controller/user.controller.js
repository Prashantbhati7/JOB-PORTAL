import AsyncHandler from "../utils/AsyncHandler.js";
import { sql } from "../utils/db.js";
import ApiError from "../utils/ApiError.js";
const myProfile = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    return res.status(200).json({
        success: true,
        user
    });
});
const getUser = AsyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await sql `SELECT u.user_id,u.name,u.email,u.phone_number,u.role,u.bio,u.resume,u.resume_public_id,u.profile_pic,u.profile_pic_public_id,u.subscription, ARRAY_AGG(s.name) Filter (WHERE s.name IS NOT NULL) AS skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.user_id = ${userId} GROUP BY u.user_id `;
    if (user.length === 0)
        throw new ApiError(404, "User not found");
    user[0].skills = user[0].skills || [];
    return res.status(200).json({
        success: true,
        user: user[0]
    });
});
export { myProfile, getUser };
