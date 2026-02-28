import { Router } from "express";
import { createCompany, createJob, deleteCompany, getAllActiveJobs, getAllComapny, getCompanyDetails, getSingleJob, updateJob } from "../controllers/job.js";
import uploadFile from "../middleware/multer.js";
import { isAuth } from "../middleware/auth.js";

const router = Router();

router.route('/company').post(isAuth,uploadFile,createCompany)
router.route('/company/:company_id').delete(isAuth,deleteCompany)
router.route('/company/:id').get(isAuth,getCompanyDetails);
router.route('/company').get(isAuth,getAllComapny);
router.route('/job').post(isAuth,createJob)
router.route('/job').get(getAllActiveJobs);
router.route('/job/:job_id').put(isAuth,updateJob);
router.route('/job/:job_id').get(getSingleJob);
export default router;