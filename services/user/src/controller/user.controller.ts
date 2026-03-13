import AsyncHandler from "../utils/AsyncHandler.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { sql } from "../utils/db.js";
import ApiError from "../utils/ApiError.js";
import getBuffer from "../utils/buffer.js";
import axios from "axios";


const myProfile = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user = req.user;
    if (!user) throw new ApiError(401,"Authentication Error ")
    return res.status(200).json({
        success:true,
        user
    })
})
const getUser = AsyncHandler(async(req,res,next)=>{
    const {userId} = req.params;
    const user = await sql`SELECT u.user_id,u.name,u.email,u.phone_number,u.role,u.bio,u.resume,u.resume_public_id,u.profile_pic,u.profile_pic_public_id,u.subscription, ARRAY_AGG(s.name) Filter (WHERE s.name IS NOT NULL) AS skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.user_id = ${userId} GROUP BY u.user_id `;
    if (user.length === 0) throw new ApiError(404,"User not found");
    user[0].skills = user[0].skills || [];

    return res.status(200).json({
        success:true,
        user:user[0]
    })
})

const updateUserProfile = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user = req.user;
    if (!user) throw new ApiError(401,"Authentication Error ");
    const {name , phone_number,bio} = req.body;
    const newName = name || user.name;
    const newPhoneNumber = phone_number || user.phone_number;
    const newBio = bio || user.bio;
    const [updatedUser] = await sql`UPDATE users SET name = ${newName}, phone_number = ${newPhoneNumber}, bio = ${newBio} WHERE user_id = ${user.user_id} RETURNING 
    user_id,name,email,phone_number,bio`;
    return res.status(200).json({
        success:true,
        user:updatedUser
    })
})

const updateProfilePic = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user = req.user;
    if (!user) throw new ApiError(401,"Authentication Error ");
    const file = req.file;
    if (!file) throw new ApiError(400,"No image is found ");
    const oldPublicId = user.profile_pic_public_id;
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content)  throw new ApiError(400,"File is required");
    const {data:uploadResult} = await axios.post(`http://localhost:5001/api/utils/upload`,{
        buffer:fileBuffer.content,
        public_id:oldPublicId
    },{
        headers:{
            'Content-Type':'application/json'
        }
    }
    )
    const [updatedUser] = await sql`UPDATE users SET profile_pic = ${uploadResult.url}, profile_pic_public_id = ${uploadResult.public_id} WHERE user_id = ${user.user_id} RETURNING user_id,name,email,profile_pic,profile_pic_public_id`;
    if (!updatedUser) throw new ApiError(404,"User not Updated");
    return res.status(200).json({
        success:true,
        message:"profile Pic updated successfully",
        user:updatedUser
    })
    
})

const updateResume = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user = req.user;
    if (!user) throw new ApiError(401,"Authentication Error ");
    const file = req.file;
    if (!file) throw new ApiError(400,"No Resume is found ");
    const oldPublicId = user.resume_public_id;
    const fileBuffer = getBuffer(file);
    const {data:uploadResult} = await axios.post(`http:localhost:5001/api/utils/upload`,{
        buffer:fileBuffer.content,
        public_id:oldPublicId
    },{
        headers:{
            'Content-Type':'application/json'
        }
    }
    )
    console.log("resume upload result is ", uploadResult);
    const [updatedUser] = await sql`UPDATE users SET resume = ${uploadResult.url}, resume_public_id = ${uploadResult.public_id} where user_id = ${user.user_id} RETURNING user_id,name,email,resume,resume_public_id`;
    if (!updatedUser) throw new ApiError(404,"User not Updated");
    return res.status(200).json({
        success:true,
        message:"Resume updated successfully",
        user:updatedUser
    });
})


const addSkill = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
     console.log("request Recieved for adding skill");
    const user_id = req.user?.user_id;
    console.log("user id is ",user_id);
    if (!user_id) throw new ApiError(401,"Authentication Error ");
    const {skill} = req.body;
    console.log("skill is ",skill);
    let wasAdded = false;

    try{
       await sql`BEGIN`;
        const users = await sql`SELECT * FROM users WHERE user_id = ${user_id}` ;
        if (users.length === 0){
            throw new ApiError(404,"User not found");
        }
        
        const [addedSkill] = await sql`INSERT INTO skills(name) VALUES (${skill.trim()}) ON CONFLICT (name)  DO UPDATE SET name = EXCLUDED.name RETURNING skill_id`;
        
        const skillId =   addedSkill.skill_id;
       
        const insertionResult = await sql`INSERT INTO user_skills(user_id,skill_id) VALUES (${user_id},${skillId}) ON CONFLICT (user_id,skill_id) DO NOTHING RETURNING user_id `;
        if (insertionResult.length >0 ){
            wasAdded = true;
        }
       await sql`COMMIT`;
        
    }catch(error){
        await sql`ROLLBACK`;
        throw new ApiError(405,"Error in Adding a skilll ");
    }
    if (!wasAdded) {
        res.status(200).json({"message":"User already has this skill "});
    }

    res.status(200).json({"message":"skill has been added to skills successfully "});
})

const removeSkill = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user_id = req.user?.user_id;
    if (!user_id) throw new ApiError(401,"Authentication Error ");
    const {skill} = req.body;
    if (!skill || skill.trim() === "") throw new ApiError(400,"Select a skill to remove");
    const result = await sql`DELETE FROM user_skills WHERE user_id = ${user_id} AND skill_id = (SELECT skill_id FROM skills WHERE name = ${skill.trim()}) RETURNING user_id ;`;
   if (result.length === 0 ) throw new ApiError(404,"Skill not found");
   
   res.status(200).json({"message":"skill has been removed successfully "});
    
})


const applyForJob = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user = req.user;
    if (!user) throw new ApiError(401,"Authentication Error ");
    if (user.role !== 'jobseeker') throw new ApiError(403,"Only Jobseekers can apply for jobs");
    const applicantId = user.user_id;
    const resume = user.resume;
    if (!resume) throw new ApiError(400,"Resume Not uploaded , Please upload your resume first");
    const resumePublicId = user.resume_public_id;
    const {job_id} = req.body;
    if (!job_id) throw new ApiError(400,"Job Id is required");
    const [job] = await sql`SELECT is_active FROM jobs WHERE job_id = ${job_id}`;
    if (!job || !job.is_active ) throw new ApiError(404,"Job Not more active");
    const now = Date.now();

    const subtime = req.user?.subscription ? new Date(req.user.subscription).getTime() : 0;
    const isSubscribed = subtime > now;

    const [existingApplication] = await sql`SELECT * FROM applications WHERE job_id = ${job_id} AND applicant_id = ${applicantId}`;
    if (existingApplication) throw new ApiError(409,"You have already applied for this job");

    let newApplication;
    try{
        [newApplication] = await sql`INSERT INTO applications(job_id,applicant_id,applicant_email,resume,resume_public_id,subscribed) VALUES(${job_id},${applicantId},${user.email},${resume},${resumePublicId},${isSubscribed}) RETURNING *`;
    }catch(error:any){
        if(error.code === '23505'){
            throw new ApiError(409,"You have already applied for this job");
        }
        throw new ApiError(500,"Error in applying for job");
    }
    return res.status(200).json({"message":"Application Created Successfully","application":newApplication});
})

const getAllApplications = AsyncHandler(async(req:AuthenticatedRequest,res,next)=>{
    const user = req.user;
    if (!user) throw new ApiError(401,"Authentication Error ");
    if (user.role === 'recruiter') throw new ApiError(403,"Recruiter can't apply for Jobs");
    const applications = await sql`SELECT a.* ,j.title AS job_title,j.salary AS job_salary,j.location AS job_location FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.applicant_id = ${req.user?.user_id}`;
    return res.status(200).json({"message":"Applications Fetched Successfully","applications":applications});
})


export {myProfile,getUser,updateUserProfile,updateProfilePic,updateResume,addSkill,removeSkill,applyForJob,getAllApplications};