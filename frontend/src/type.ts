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