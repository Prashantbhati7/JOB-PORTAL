import { Router } from "express";
import { createCompany, createJob, deleteCompany, updateJob } from "../controllers/job.js";
import uploadFile from "../middleware/multer.js";
import { isAuth } from "../middleware/auth.js";

const router = Router();

router.route('/company').post(isAuth,uploadFile,createCompany)
router.route('/company/:company_id').delete(isAuth,deleteCompany)
router.route('/job').post(isAuth,createJob)
router.route('/job/:job_id').put(isAuth,updateJob);
export default router;