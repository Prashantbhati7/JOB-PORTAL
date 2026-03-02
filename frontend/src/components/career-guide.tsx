"use client"
import { CareerGuideResponse } from "@/type";
import { Sparkle } from "lucide-react";
import { useState } from "react";


const CareerGuide = () => {
  const [isOpen,setIsOpen] = useState(false);
  const [skills,setSkills] = useState<string[]>([]);
  const [currentSkill ,setCurrentSkill] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [response,setResponse] = useState<CareerGuideResponse | null>(null);
  const addSkill = ()=>{
    if (currentSkill.trim() && !skills.includes(currentSkill.trim() )){
        setSkills([...skills,currentSkill.trim()])
    }
    // else if (currentSkill.trim()){
    //   setSkills((prevskills)=>{
    //       const newskill = prevskills.filter((ele)=> {
    //         if (ele !== currentSkill.trim()) return ele;
    //       })
    //       return newskill;
    //   })
      setCurrentSkill("");
  }
  const removeSkill = (skillToRemove:string)=>{
    setSkills((prevskills)=>{
      const newskills = prevskills.filter((ele)=>{
        if (ele !== skillToRemove) return ele;
      })
      return newskills;
    })
  }
  const handleKeyPress = (e:KeyboardEvent<HTMLInputElement>)=>{
    if (e.key === 'Enter'){
      addSkill();
    }
  }
  const getcareerGuidance = async()=>{
    
  }
  return (
    <div className="min-h-screen w-full bg-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 dark:bg-blue-900 mb-4">
                <Sparkle className="text-blue-600" size={16}></Sparkle> <span className="text-sm font-medium ">AI-Powered Career Guidance</span>  </div>
        </div>
        <h2 className="text-3xl text-center font-bold md:text-4xl mb-4">Discover Your Career Path</h2>
        <p className="text-lg opacity-70 max-w-3xl mx-auto mb-8">Get personalized job recommendations and learning roadmaps 
          based on your Skills.
        </p>
    </div>
    </div>
  )
}

export default CareerGuide;
