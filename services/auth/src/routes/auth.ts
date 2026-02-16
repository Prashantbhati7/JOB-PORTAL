import express from 'express';
import { registerUser,loginUser, forgotPassword, resetPassword } from '../controllers/auth.js';
import uploadFile from '../middleware/multer.js';
const router = express.Router();

router.route('/').get((req,res)=>{
    res.send("working well");
})
router.route('/register').post(uploadFile,registerUser);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset/:token').post(resetPassword);

export default router;