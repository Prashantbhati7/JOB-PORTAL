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
}

export interface AppProviderProps{
    children:React.ReactNode;
}