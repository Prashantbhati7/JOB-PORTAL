'use client';
import { UseAppData } from "@/context/appContext";
import { AccountProps } from "@/type"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "../../../components/ui/card";
import { Award, Plus, Sparkle, X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";



const Skills:React.FC<AccountProps> = ({user,isYourAccount}) => {
    const {addSkill,btnloading,removeSkill} = UseAppData();
    const [skill,setSkill] = useState("");
    const addSkillHandler = ()=>{
        if (!skill.trim()){
            alert("please enter a skill");
            return;
        }
        addSkill(skill,setSkill);
         
    }
    const handleKeyPerss = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Enter'){
            addSkillHandler();
        }
    }
    const removeSkillHandler = (skillToRemove:string)=>{
        if (confirm('Are you sure you want to remove this skill?')){
            
        }
    }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 ">
      <Card className="shadow-lg border-2 overflow-hidden ">
        <div className="bg-blue-500 p-6 border-b ">
            <div className="flex items-center gap-3 mb-4 ">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Award size={20} className="text-blue-200"></Award>
                
                </div>
                <CardTitle className="text-2xl">{isYourAccount?"Your Skills":"User Skills"}</CardTitle>
            {isYourAccount && <CardDescription className="text-sm text-primary mt-1">showcase your expertise and abilites </CardDescription>}
            </div> 
           
        </div>
        {/* add skill input */}
        {isYourAccount && 
        <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
                <Sparkle size={18} className="absolute left-3 top-1/2 -translate-y-0.5 opacity-50"></Sparkle>
                <Input type='text' placeholder="e.g. React,Node.js Python..." className="h-11 pl-10 bg-background" value={skill} onChange={(e)=>setSkill(e.target.value)} onKeyDown={handleKeyPerss}></Input>
            </div>
            <Button disabled={btnloading || !skill.trim()} onClick={addSkillHandler} className='h-11 gap-2 px-6'> <Plus size={18}></Plus> {btnloading?'Loading...':'Add Skill'} </Button>
        </div>
        }
        {/* Skills Display */}
        <CardContent className="p-6">
            {user.skills && user.skills.length>0 ? <div className="flex flex-wrap gap-3">{user.skills.map((skill,idx)=> <div className="border-2 group relative inline-flex border-gray-400/40 py-2 items-center shadow-md hover:shadow-red-300  duration-200 transition-all gap-4 px-4 rounded-2xl pl-4 pr-3" key={skill}>
            {<span>{skill}</span>}{ isYourAccount && <button disabled={btnloading}  className="cursor-pointer text-red-500" onClick={(e)=> removeSkill(skill)} ><X size={14}/></button>} </div>)}</div> 
            :<div className="text-center py-12 ">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Award size={32} className="opacity-40"/>
                </div>
                <CardDescription className="text-base">{isYourAccount? 'No Skills Added Yet.Start Building Your Profile !':'No Skills Added by the User'}</CardDescription>
            </div>}
        </CardContent>
      </Card>
    </div>
  )
}

export default Skills
