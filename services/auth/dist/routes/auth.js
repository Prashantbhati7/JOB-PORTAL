import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';
import uploadFile from '../middleware/multer.js';
const router = express.Router();
router.route('/').get((req, res) => {
    res.send("working well");
});
router.route('/register').post(uploadFile, registerUser);
router.route('/login').post(loginUser);
export default router;
