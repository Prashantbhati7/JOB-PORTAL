import express from 'express';
import { registerUser } from '../controllers/auth.js';
import uploadFile from '../middleware/multer.js';
const router = express.Router();
router.route('/').get((req, res) => {
    res.send("working well");
});
router.route('/register').post(uploadFile, registerUser);
export default router;
