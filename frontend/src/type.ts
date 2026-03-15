export interface JobOptions{
    title: string;
    responsibilities: string;
    why:string;
}

export interface SkillsToLearn{
    title:string;
    why:string;
    how:string;
}
export interface SkillCategory{
    category:string;
    skills:SkillsToLearn[];
}

export interface LearningApproach{
    title:string;
    points:string[];
}
export interface CareerGuideResponse{
    summary:string;
    jobOptions:JobOptions[];
    skillsToLearn:SkillCategory[];
    learningApproach:LearningApproach;
}

export interface ScoreBreakdown{
    formatting:{
        score:number;
        feedback:string
    },
    keywords:{
        score:number;
        feedback:string
    },
    structure:{
        score:number;
        feedback:string
    },
    readability:{
        score:number;
        feedback:string
    }

}

export interface suggestion{
    category:string;
    issue:string;
    recommendation:string;
    priority:"high"|"medium"|"low";
}

export interface ResumeAnalysisResponse{
    atsScore:number;
    scoreBreakdown:ScoreBreakdown;
    suggestions:suggestion[];
    strengths:string[];
    summary:string;
}

export interface User{
    user_id:number,
    name:string,
    email:string,
    password:string,
    phone_number:string,
    role:'jobseeker'|'recruiter',
    bio?:string,
    resume?:string,
    resume_public_id?:string,
    profile_pic?:string,
    profile_pic_public_id?:string,
    skills?:string[],
    subscription:string|null
}

export interface AppContextType{
    user:User|null;
    loading:boolean;
    btnloading:boolean;
    isAuth:boolean;
    setUser:React.Dispatch<React.SetStateAction<User|null>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    logout:()=>Promise<void>;
    fetchUser:()=>Promise<void>;
    updateProfilePic:(formData:any)=>Promise<void>;
    updateResume:(formData:any)=>Promise<void>;
    updateUser:(name:string,phone_number:string,bio:string)=>Promise<void>;
    addSkill:(skill:string,setSkill:React.Dispatch<React.SetStateAction<string | "">>)=>Promise<void>;
    removeSkill:(skill:string)=>Promise<void>;
}

export interface AppProviderProps{
    children:React.ReactNode;
}

export interface AccountProps{
    user:User;
    isYourAccount:boolean;
}
export interface Job{
    job_id:number;
    title:string;
    description:string;
    salary:number | null;
    location:string | null;
    job_type:'Full-time'|'Part-time'|'Contract'|'Internship';
    openings:number;
    role:string;
    work_location:'Remote'|'On-site'|'Hybrid';
    company_id:number;
    posted_by_recruiter_id:number;
    created_at:string;
    is_active:boolean;
}

export interface Company{
    company_id:string;
    name:string;
    description:string;
    website:string;
    logo:string;
    logo_public_id:string;
    recruiter_id:number;
    created_at:string;
    jobs?:Job[];
}

export type ApplicationStatus = 'Submitted'|'Rejected'|'Hired';

export interface Application{
    application_id:number;
    job_id:number;
    applicant_id:number;
    applicant_email:string;
    status:ApplicationStatus;
    resume:string;
    applied_at:string;
    subscribed:boolean;
    job_title:string;
    job_salary:string;
    job_location:string;

}