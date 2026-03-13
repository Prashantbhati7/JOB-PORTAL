"use client"
import { CareerGuideResponse } from "@/type";
import axios from "axios";
import { ArrowRight, BookOpen, Briefcase, Lightbulb, Loader, Sparkle, Target, TrendingUp, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

import toast from "react-hot-toast";


const CareerGuide = () => {
  const [isOpen,setIsOpen] = useState(false);
  const [skills,setSkills] = useState<string[]>([]);
  const [currentSkill ,setCurrentSkill] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<null | string >(null);
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
        if (ele !== skillToRemove) return true;
        return false;
      })
      return newskills;
    })
  }
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>)=>{
    if (e.key === 'Enter'){
      addSkill();
    }
  }
  const getcareerGuidance = async()=>{
      if (skills.length === 0) {
        toast.error("Please add atleast one skill")
      }
      setLoading(true);
      setError(null);
      try{
        const response = await axios.post('http://localhost:5001/api/utils/carrier',{skills:skills})
        console.log("guidence reponse is ",response);
        setResponse(response.data);
        toast.success('Career Guidance Generated');
      }catch(error){
        console.log(error);
        toast.error('Failed to generate Career Guidance')
      }finally{
        setLoading(false);
      }
  }

  const resetDialog = ()=>{
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setError(null);
    setIsOpen(false);
  }


  return (
    <div className="   w-full py-4 bg-linear-to-b from-secondary via-blue-300 dark:via-blue-800 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 dark:bg-blue-900 mb-4">
                <Sparkle className="text-blue-600" size={16}></Sparkle> <span className="text-sm font-medium ">AI-Powered Career Guidance</span>  </div>
        </div>
        <h2 className="text-3xl text-center font-bold md:text-4xl mb-4">Discover Your Career Path</h2>
        <p className="text-lg opacity-70 max-w-3xl mx-auto mb-8">Get personalized job recommendations and learning roadmaps 
          based on your Skills.
        </p>
        <div className="flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
              <Button   size={'lg'} className="gap-4 group tracking-tighter transition-all cursor-pointer h-12 px-8"><Sparkle className="group:hover:scale-150 transition-all duration-300" size={18}></Sparkle> Get Career Guidance <ArrowRight></ArrowRight> </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl mx-auto  max-h-[90vh] overflow-y-auto">
                {!response ? <> 
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
                       <Sparkle className="text-blue-500"/> Tell us about your skills
                    </DialogTitle>
                    <DialogDescription>Add your technical skills to recieve personalized career guidance.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4  ">
                    <div className="space-y-2   w-full">
                      <Label htmlFor="skill" className="">Add skills</Label>
                      <div className="flex   gap-2 w-full ">
                         <input onKeyDown={handleKeyPress} type="skill" placeholder="e.g., React, Node.js,Python,Next.js..." className="h-11 flex-1 rounded-xl px-4 flex items-center" value={currentSkill} onChange={(e)=> setCurrentSkill(e.target.value)} />
                         <Button onClick={addSkill} className="gap-2 cursor-pointer">Add</Button>
                      </div>
                    </div>
                    {
                      skills.length>0 && <div className="space-y-2">
                        <Label>Your skills ({skills.length}) </Label>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill,index)=>{
                            return <div className="inline-flex items-center gap-2 py-2 pl-3 pr-2 rounded-full bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700 **:" key={index}>
                                <span className="text-sm font-medium">{skill}</span> <Button className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center" onClick={()=> removeSkill(skill) }> <X size={16}></X> </Button>
                            </div>
                          })}
                        </div>
                      </div>
                    }
                    <div className="flex justify-center ">
                        <Button onClick={getcareerGuidance} disabled={ loading || skills.length === 0 } className="px-4 group cursor-pointer py-2 rounded-2xl "> { loading? <><Loader size={18} className="animate-spin"></Loader> Analysing Your Skills </>:<><Sparkle className="group:hover:text-yellow-500 transition-all" size={18}></Sparkle>Get Career Guidance</>}</Button>
                    </div>
                  </div>
                </> :<>
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
                         <Target className="text-blue-500"/> Your Personalized Career Guide
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30  border border-b-blue-200 dark:border-b-blue-800">
                        <div className="flex items-start gap-3">

                          <Lightbulb className="text-blue-600 mt-1 shrink-0" size={20} ></Lightbulb>
                          <div> 
                            <h3 className="font-semibold mb-2">Carrer Summary</h3>
                            <p className="text-sm opacity-80 leading-relaxed">{response.summary}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"> <Briefcase size={20} className="text-blue-600 "/> Recommended Career Paths </h3>
                        <div className="space-y-2"> 
                          {response.jobOptions.map((job,index)=>{
                            return <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 hover:border-blue-400  border border-b-blue-200 dark:border-b-blue-80
                            " key={index}>
                              <div className="flex items-start gap-3">
                                <Briefcase className="text-blue-600 mt-1 shrink-0" size={20} ></Briefcase>
                                <div> 
                                  <h3 className="font-semibold mb-2">{job.title}</h3>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                 <div> 
                                   <span className="font-medium opacity-70">Responsibilites : </span>
                                   <span className="opacity-80">{job.responsibilities} </span>
                                 </div>
                                 <span className="font-medium opacity-70">Why this Role ? :</span>
                                 <span className="opacity-80">{job.why}</span>
                              </div>
                            </div>
                          })} 
                        </div>
                      </div>
                      {/* Skills to learn */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600"></TrendingUp> Skills to enhance Your Career
                        </h3>
                        <div className="space-y-4 ">{
                          response.skillsToLearn.map((category,index)=>
                            (
                              <div className="space-y-2" key={index}>
                            <h4  className="font-semibold text-sm text-blue-600">{category.category}</h4>
                            <div className="space-y-2">{
                                 category.skills.map((skill,sid)=>(<div key={sid} className="p-3 rounded-lg bg-secondary border text-sm">
                                  <p className="font-medium mb-1 ">{skill.title}</p>
                                  <p className="text-xs opacity-70 mb-1 "> <span className="font-medium ">Why</span> : {skill.why} </p>
                                  <p className="text-xs opacity-70 mb-1 "> <span className="font-medium ">How</span> : {skill.how} </p>
                                 </div>))
                              }</div>
                            </div>
                          )
                        )
                          }</div>
                      </div>
                    {/* Learning Approach */}
                    <div className="p-4 rounded-lg bg-blue-950/20  dark:bg-red-950/20">
                       <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"> <BookOpen size={20} className="text-blue-600 "/> {response.learningApproach.title} </h3>
                       <ul className="space-y-2">
                        {response.learningApproach.points.map((point,index)=>(<li key={index} className="text-sm flex items-start gap-2">
                            <span  className="font-bold text-blue-600 mt-0.5">·</span> 
                            <span className="opacity-90" dangerouslySetInnerHTML={{__html:point}}/>
                           </li>))}
                       </ul>
                    </div>
                    <Button onClick={resetDialog} variant={"outline"} className="w-full "> Start New Analysis</Button>
                    </div>
                </>} 
            </DialogContent>
        </Dialog>
        </div>

    </div>
    </div>
  )
}

export default CareerGuide;
