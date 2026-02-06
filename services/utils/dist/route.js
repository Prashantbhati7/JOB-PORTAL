import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();
router.post('/upload', async (req, res) => {
    try {
        console.log("req at upload route in utils service");
        console.log("req.body ", req.body);
        const { buffer, public_id } = req.body; // public id so that we can remove the old resume or profile if user is updating to new
        if (public_id) { // to delete the old one if do exists 
            await cloudinary.uploader.destroy(public_id);
        }
        const cloud = await cloudinary.uploader.upload(buffer);
        console.log("cloud ", cloud);
        res.status(200).json({ url: cloud.secure_url, public_id: cloud.public_id });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});
export default router;
