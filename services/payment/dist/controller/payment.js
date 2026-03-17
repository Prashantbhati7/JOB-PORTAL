import { instance } from "../index.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { sql } from "../utils/db.js";
import crypto from 'crypto';
export const checkOut = AsyncHandler(async (req, res) => {
    console.log("user is ", req.user);
    if (!req.user)
        throw new ApiError(401, "Not Authenticated ");
    const user_id = req.user.user_id;
    console.log("user id is ", user_id);
    const [user] = await sql `SELECT * FROM users WHERE user_id = ${user_id}`;
    console.log("user from db is ", user);
    const subTime = user?.subscription ? new Date(user.subscription).getTime() : 0;
    console.log("subscribe time ", subTime);
    const now = Date.now();
    const isSubcribed = subTime > now;
    console.log("is subscribed ? ", isSubcribed);
    if (isSubcribed) {
        throw new ApiError(400, "You have Already Subscribed ");
    }
    const options = {
        amount: Number(19 * 100),
        currency: "INR",
        notes: {
            user_id: user_id.toString(),
        }
    };
    const order = await instance.orders.create(options);
    console.log("order is", order);
    return res.status(201).json({ "message": "order created successfully", "order": order });
});
export const paymentVerification = AsyncHandler(async (req, res) => {
    const user = req.user;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.Razorpay_Secret).update(body).digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const expiryDate = new Date(now.getTime() + thirtyDays);
        const [updatedUser] = await sql `UPDATE users SET subscription = ${expiryDate} WHERE user_id=${user?.user_id} RETURNING *`;
        res.json({ message: "Subscription Purchased Successfully", user: updatedUser });
    }
    else
        res.status(400).json({ message: "payment failed" });
});
