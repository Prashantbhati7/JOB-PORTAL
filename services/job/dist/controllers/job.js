import axios from "axios";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
const createCompany = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user)
        throw new ApiError(401, "Not Authenticated");
    if (user.role === 'jobseeker')
        throw new ApiError(403, "Not Authorized");
    const { name, description, website } = req.body;
    if (!name || name.trim() === '' || !description || description.trim() === '' || !website || website.trim() === '')
        throw new ApiError(400, "All fields are required");
    const existingCompany = await sql `SELECT * FROM companies WHERE name = ${name}`;
    if (existingCompany.length > 0)
        throw new ApiError(409, "Company already exists");
    const file = req.file;
    if (!file)
        throw new ApiError(400, "Logo File is Required");
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content)
        throw new ApiError(500, "Failed to genreate Buffer");
    const { data: { url, public_id } } = await axios.post('http://localhost:5001/api/utils/upload', { buffer: fileBuffer.content, public_id: null }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const company = await sql `INSERT INTO companies(name,description,website,logo,logo_public_id,recruiter_id) VALUES(${name},${description},${website},${url},${public_id},${user.user_id}) RETURNING *`;
    if (company.length === 0)
        throw new ApiError(500, "Failed to create Company");
    return res.status(200).json({ "message": "Company Created Successfully", "company": company[0] });
});
const deleteCompany = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user)
        throw new ApiError(401, "Not Authenticated");
    const { company_id } = req.params;
    if (!company_id)
        throw new ApiError(400, "Company Id is required");
    const company = await sql `SELECT * FROM companies WHERE company_id = ${company_id}`;
    if (company.length === 0)
        throw new ApiError(404, "Invalid Company Id");
    if (company[0].recruiter_id !== user.user_id)
        throw new ApiError(403, "Not Authorized to delete this company");
    await sql `DELETE FROM companies WHERE company_id = ${company_id}`;
    return res.status(200).json({ "message": "Company Deleted Successfully" });
});
const createJob = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user)
        throw new ApiError(401, "Not Authenticated");
    if (user.role === 'jobseeker')
        throw new ApiError(403, "Not Authorized to create job");
    const { title, description, salary, location, job_type, openings, role, work_location, company_id } = req.body;
    if (!title || !description || !salary || !location || !job_type || !openings || !role || !work_location || !company_id)
        throw new ApiError(400, "All fields are required");
    const [comapnay] = await sql `SELECT company_id FROM companies WHERE company_id = ${company_id} AND recruiter_id = ${user.user_id}`;
    if (!comapnay)
        throw new ApiError(404, "Company Not Found");
    const [job] = await sql `INSERT INTO jobs(title,description,salary,location,job_type,openings,role,work_location,company_id,posted_by_recruiter_id) VALUES(${title},${description},${salary},${location},${job_type},${openings},${role},${work_location},${company_id},${user.user_id}) RETURNING *`;
    return res.status(200).json({ "message": "Job Created Successfully", "job": job });
});
const updateJob = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user)
        throw new ApiError(401, "Not Authenticated");
    const { job_id } = req.params;
    const { title, description, salary, location, role, job_type, openings, work_location, company_id, is_active } = req.body;
    const [existingjob] = await sql `SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${job_id}`;
    if (!existingjob)
        throw new ApiError(404, "Job Not Found");
    if (existingjob.posted_by_recruiter_id !== user.user_id)
        throw new ApiError(403, "Not Authorized to update this job");
    const [updatedJob] = await sql `UPDATE jobs SET title = ${title},description = ${description},salary = ${salary},location = ${location},role = ${role},job_type = ${job_type},openings = ${openings},work_location = ${work_location},company_id = ${company_id},is_active = ${is_active} WHERE job_id = ${job_id} RETURNING * ;`;
    return res.status(200).json({ "message": "Job Updated Successfully", "job": updatedJob });
});
const getAllComapny = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user)
        throw new ApiError(401, "Not Authenticated");
    const companies = await sql `SELECT * FROM companies WHERE recruiter_id = ${user.user_id}`;
    return res.status(200).json({ "message": "Companies Fetched Successfully", "companies": companies });
});
const getCompanyDetails = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        throw new ApiError(400, "Company Id is required");
    const [comapnay] = await sql `SELECT c.*,COALESCE (
    (
        SELECT json_agg(j.*) FROM jobs j WHERE j.company_id = c.company_id
    ),
    '[]'::json
    ) AS jobs FROM companies c WHERE c.company_id = ${id} GROUP BY c.company_id;`;
    if (!comapnay)
        throw new ApiError(404, "Company Not Found");
    return res.status(200).json({ "message": "Company Fetched Successfully", "company": comapnay });
});
const getAllActiveJobs = AsyncHandler(async (req, res, next) => {
    const { title, location } = req.query;
    let query = `SELECT j.job_id,j.title,j.description,j.salary,j.location,j.job_type,j.role,j.work_location,c.name AS company_name,c.logo AS company_logo,c.company_id AS company_id,j.created_at FROM jobs j JOIN companies c ON j.company_id = c.company_id WHERE j.is_active = true`;
    const values = [];
    let paramIndex = 1;
    if (title) {
        values.push(`%${title}%`);
        query += ` AND j.title ILIKE $${paramIndex++}`;
    }
    if (location) {
        values.push(`%${location}%`);
        query += ` AND j.location ILIKE $${paramIndex++}`;
    }
    query += ` ORDER BY j.created_at DESC`;
    const jobs = await sql.query(query, values);
    return res.status(200).json({ "message": "Jobs Fetched Successfully", "jobs": jobs });
});
const getSingleJob = AsyncHandler(async (req, res, next) => {
    const { job_id } = req.params;
    if (!job_id)
        throw new ApiError(400, "Job Id is required");
    const [job] = await sql `SELECT * FROM jobs WHERE job_id = ${job_id}`;
    if (!job)
        throw new ApiError(404, "Job Not Found");
    return res.status(200).json({ "message": "Job Fetched Successfully", "job": job });
});
export { createCompany, deleteCompany, createJob, updateJob, getAllComapny, getCompanyDetails, getAllActiveJobs, getSingleJob };
