import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { sql } from "../utils/db.js";
const registerUser = AsyncHandler(async (req, res, next) => {
    const { name, email, password, phone_number, role, bio } = req.body;
    if (!email || !password || !name || !phone_number || !role)
        throw new ApiError(400, "All fields are required");
    const existingUser = await sql `SELECT * FROM users WHERE email = ${email}`;
    if (existingUser)
        throw new ApiError(400, "User already exists");
    const hashedPass = await bcrypt.hash(password, 10);
    return res.send({ "email ": email });
});
export { registerUser };
