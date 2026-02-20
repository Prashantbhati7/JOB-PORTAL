import { Router } from "express";
import { getUser, myProfile } from "../controller/user.controller.js";
import { isAuth } from "../middleware/auth.js";

const router = Router();

router.route('/profile').get(isAuth,myProfile);
router.route('/:userId').get(isAuth,getUser);

export default router;