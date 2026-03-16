"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UseAppData } from "@/context/appContext";
import { Company, Job} from "@/type";
import axios from "axios";
import { Briefcase, Building2, Check, CheckCircle, Clock, DollarSign, Eye, FileText, Globe, Laptop, LocateIcon, MapPin, Pencil, Plus, Trash, Users, XCircle } from "lucide-react";
import Link from "next/link";

import { useParams } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {  useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const  CompanyPage= () => {
    const {id} = useParams();
    const {user,isAuth} = UseAppData();
    const [loading,setLoading] = useState(true);
    const [btnloading,setBtnLoading] = useState(false);
    const [company,setComapany] = useState<Company | null>(null);
    const [isUpdatedModalOpen,setIsUpdatedModalOpen] = useState(false);
    const [selectedJob,setSelectedJob] = useState<Job | null>(null);
    const addModalRef = useRef<HTMLButtonElement | null>(null);
    const updateModalRef = useRef<HTMLButtonElement | null>(null);

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [salary,setSalary] = useState("");
    const [location,setLocation] = useState("");
    const [job_type,setJob_type] = useState("");
    const [role,setrole] = useState("");
    const [openings,setOpenings] = useState("");
    const [work_location,setWork_location] = useState("");
    const [isActive,setIsActive] = useState(true);


    const clearData = ()=>{
        setTitle("");
        setDescription("");
        setSalary("");
        setLocation("");
        setrole("");
        setOpenings("");
        setJob_type("");
        setWork_location("");
        setIsActive(true);
    }

    const addJobHandler = async()=>{
        setBtnLoading(true);
        try{
            if (!title.trim() || !description.trim() || !location.trim() || !job_type.trim() || !work_location.trim()) {
                toast.error("please fill all the fields");
                return;
            }
            const jobData = {
                title,
                description,
                salary:Number(salary),
                location,
                openings:Number(openings),
                job_type,
                role,
                company_id:Number(id),
                work_location,
                isActive
            }
            
            const {data} = await axios.post('http://localhost:5004/api/job',jobData,{withCredentials:true});
            toast.success(data.message);
            clearData();
            setIsUpdatedModalOpen(false);
            addModalRef.current?.click();
            fetchCompany();
        }catch(error:any){
            toast.error( error.response?.data?.message ||"something went wrong !")
        }finally{
            setBtnLoading(false);
        }
    }
    const handleOpenUpdateModal = (job:Job)=>{
        setSelectedJob(job);
        setTitle(job.title);
        setDescription(job.description); 
        setSalary(job.salary?.toString() || '');
        setLocation(job.location || "");
        setrole(job.role);
        setOpenings(job.openings?.toString() || '');
        setJob_type(job.job_type);
        setWork_location(job.work_location);
        setIsActive(job.is_active);
        setIsUpdatedModalOpen(true);
       
    }
    const handleCloseUpdateModal = ()=>{
        setIsUpdatedModalOpen(false);
        setSelectedJob(null);
        clearData();
    }

    const UpdateJobHandler = async()=>{
        if (!selectedJob) return ;
        setBtnLoading(true);
        try{
            const updateData = {
                title,
                description,
                salary:Number(salary),
                location,
                openings:Number(openings),
                job_type,
                role,
                work_location,
                is_active:isActive,
                company_id:Number(id)
            }
            const {data} = await axios.put(`http://localhost:5004/api/job/${selectedJob.job_id}`,updateData,{withCredentials:true});
            toast.success(data.message);
            clearData();
            setIsUpdatedModalOpen(false);
            updateModalRef.current?.click();
            fetchCompany();
        }catch(error:any){
            toast.error(error.response.data.message || "something went wrong !")
        }finally{
            setBtnLoading(false)
        }
    }

    const deleteHanlder = async(jobId:number)=>{
        setBtnLoading(true);
        try{
            const {data} = await axios.delete(`http://localhost:5004/api/job/${jobId}`,{withCredentials:true});
            toast.success(data.message);
            fetchCompany();
        }catch(error:any){
            toast.error(error.response.data.message || "something went wrong !")
        }finally{
            setBtnLoading(false);
        }
    }



    const fetchCompany = async()=>{
        setLoading(true);
        try{
            const {data} = await axios.get(`http://localhost:5004/api/company/${id}`,{withCredentials:true});
            setComapany(data.company);
            console.log("company is ",data.company);
        }catch(error:any){
            toast.error(error.response?.data?.message || "something went wrong !")
        }finally{
            setLoading(false);
        }
    }
    const isRecuiterOwner = user && company && user.user_id === company.recruiter_id;
    useEffect(()=>{
        fetchCompany();
    },[])
    if (loading) return <Loading/>
  return (
    <div className="min-h-screen bg-secondary/30 "> 
       {company && <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="overflow-hidden shadow-lg border-2 mb-8">
            <div className="h-32 bg-blue-600 "></div>
            <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
                    <div className="w-32 h-32 rounded-2xl border-4 border-background overflow-hidden shadow-xl bg-background shrink-0">
                        <img src={company.logo} alt={company.name} className='w-full h-full object-cover' /> 
                    </div>
                    <div className="flex-1 md:mb-4 ">
                        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                        <p className="text-base leading-relaxed opacity-80 max-w-3xl">{company.description}</p>
                    </div>
                    <Link href={company.website} className="md:mb-4 " target="_blank"> <Button className="gap-2"><Globe size={18}/> Visit Website</Button> </Link>
                </div>
            </div>
          </Card>
            <Dialog>
                <Card className="shadow-lg border-2 overflow-hidden">
                    <div className="bg-blue-500 p-6 border-b">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <Briefcase size={20} className="text-blue-600"></Briefcase>
                                </div>

                            </div>
                            <h2 className="text-2xl font-bold">Open Positions</h2>
                            <p className="text-sm opacity-70">{company.jobs?.length || 0 } active Jobs {company.jobs?.length ? 's':''} </p>
                        </div>
                    </div>
                    {isRecuiterOwner && 
                    <>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus size={18}/>Post New Job</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">Post a new job</DialogTitle>
                        </DialogHeader>
                         <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2"><Briefcase size={16}/>Job Title </Label>
                            <Input id="title" type="text" placeholder="enter job title" className="h-11" value={title} onChange={(e)=>setTitle(e.target.value)}/>

                        </div>
                            <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2"><FileText size={16}/>  Description </Label>
                            <Input id="description" type="text" placeholder="enter description" className="h-11" value={description} onChange={(e)=>setDescription(e.target.value)}/>

                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2"><Building2 size={16}/>  Role/Department </Label>
                            <Input id="role" type="text" placeholder="enter Job role" className="h-11" value={role} onChange={(e)=>setrole(e.target.value)}/>
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary" className="text-sm font-medium flex items-center gap-2"><DollarSign size={16}/>Salary</Label>
                            <Input id="salary" type="number"  placeholder="enter salary"   className="cursor-pointer h-11" value={salary}   onChange={(e)=>setSalary((e.target.value))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="openings" className="text-sm font-medium flex items-center gap-2"><Users size={16}/>Openings</Label>
                            <Input id="openings" type="number"  placeholder="enter openings"   className="cursor-pointer h-11" value={openings}   onChange={(e)=>setOpenings((e.target.value))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2"><MapPin size={16}/>Location </Label>
                            <Input id="location" type="text"  placeholder="enter Location"   className="cursor-pointer h-11" value={location}   onChange={(e)=>setLocation(e.target.value)}/>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                 <Label htmlFor="job_type" className="text-sm font-medium flex items-center gap-1"> <Clock size={16}/> Job Type </Label>
                                <div className="relative w-full">
                                
                                    <Select onValueChange={(val: string) => setJob_type(val)} value={job_type}>
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder=" Select Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                         <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </div>  
                            </div>  
                             <div className="space-y-2">
                                 <Label htmlFor="work_location" className="text-sm font-medium flex items-center gap-1"> <Laptop size={16}/> Work Location </Label>
                                <div className="relative w-full">
                                
                                    <Select onValueChange={(val: string) => setWork_location(val)} value={work_location}>
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder=" Select work location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                         <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                         
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </div>  
                            </div>                        
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button ref={addModalRef} variant={'outline'}>Cancel</Button>
                            </DialogClose>
                            <Button disabled={btnloading} onClick={addJobHandler} className="w-full gap-2 h-11">{btnloading?'saving changes...':'Post Job'}</Button>
                        </DialogFooter>
                    </DialogContent>
                    </>}
                    <div className="p-6">
                        {company.jobs && company.jobs.length>0 ?
                        <div className="space-y-4">
                            {company.jobs.map((job)=>(
                                <div key={job.job_id} className=" p-5 rounded-lg border-2 hover:border-blue-500 transition-all bg-background">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-0"> 
                                            <div className="flex items-center gap-3 mb-3 flex-wrap ">
                                                <h3 className="text-xl font-semibold">{job.title}</h3>
                                                <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${job.is_active ?"bg-green-100 dark:bg-green-900/30 text-green-600":"bg-gray-100 dark:bg-gray-800 text-gray-600"}`}>{job.is_active ? <CheckCircle size={14}/> :<XCircle size={14}/>} {job.is_active ? 'Active' : 'Inactive'} </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                                                <div className="flex items-center gap-2 opacity-70">
                                                    <Building2 size={16}/>
                                                    <span>{job.role}</span>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-70">
                                                  <DollarSign size={16}/>
                                                  <span>{job.salary ? `₹${job.salary.toLocaleString()}`:"Not Disclosed"}</span>  
                                                </div>
                                                <div className="flex items-center gap-2 opacity-70">
                                                    <MapPin size={16}/>
                                                    <span>{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-70">
                                                    <Laptop size={16}/>
                                                    <span>{job.job_type}</span>
                                                
                                                </div>
                                                <div className="flex items-center gap-2 opacity-70">
                                                    <Users size={16}/>
                                                    <span>{job.openings} openings</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/jobs/${job.job_id}`}>
                                              <Button variant={'outline'} size={'sm'} className="gap-2"><Eye size={16}/>View</Button>  
                                            </Link>
                                            {isRecuiterOwner && <>
                                            <Button  variant={'outline'} size={'sm'}  onClick={()=> handleOpenUpdateModal(job)}> <Pencil size={16}/>Edit </Button>
                                            {/* <Button variant={'destructive'} size={'sm'} onClick={()=>deleteHanlder(job.job_id)} disabled={btnloading}> <Trash size={16}/>  </Button> */}
                                            </>}
                                        </div>
                                    </div>
                            </div>
                            ))}
                        </div> :<div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <Briefcase size={32} className="opacity-40"/> 

                            </div>
                            <p className="text-base opacity-70 mb-2">No Jobs posted yet </p>
                        </div>}
                    </div>
                </Card>
            </Dialog>
            <Dialog open={isUpdatedModalOpen} onOpenChange={setIsUpdatedModalOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">Update the job</DialogTitle>
                        </DialogHeader>
                         <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2"><Briefcase size={16}/>Job Title </Label>
                            <Input id="title" type="text" placeholder="enter job title" className="h-11" value={title} onChange={(e)=>setTitle(e.target.value)}/>

                        </div>
                            <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2"><FileText size={16}/>  Description </Label>
                            <Input id="description" type="text" placeholder="enter description" className="h-11" value={description} onChange={(e)=>setDescription(e.target.value)}/>

                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2"><Building2 size={16}/>  Role/Department </Label>
                            <Input id="role" type="text" placeholder="enter Job role" className="h-11" value={role} onChange={(e)=>setrole(e.target.value)}/>
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary" className="text-sm font-medium flex items-center gap-2"><DollarSign size={16}/>Salary</Label>
                            <Input id="salary" type="number"  placeholder="enter salary"   className="cursor-pointer h-11" value={salary}   onChange={(e)=>setSalary((e.target.value))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="openings" className="text-sm font-medium flex items-center gap-2"><Users size={16}/>Openings</Label>
                            <Input id="openings" type="number"  placeholder="enter openings"   className="cursor-pointer h-11" value={openings}   onChange={(e)=>setOpenings((e.target.value))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2"><MapPin size={16}/>Location </Label>
                            <Input id="location" type="text"  placeholder="enter Location"   className="cursor-pointer h-11" value={location}   onChange={(e)=>setLocation(e.target.value)}/>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                 <Label htmlFor="job_type" className="text-sm font-medium flex items-center gap-1"> <Clock size={16}/> Job Type </Label>
                                <div className="relative w-full">
                                
                                    <Select onValueChange={(val: string) => setJob_type(val)} value={job_type}>
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder=" Select Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                         <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </div>  
                            </div>  

                             <div className="space-y-2">
                                 <Label htmlFor="work_location" className="text-sm font-medium flex items-center gap-1"> <Laptop size={16}/> Work Location </Label>
                                <div className="relative w-full">
                                
                                    <Select onValueChange={(val: string) => setWork_location(val)} value={work_location}>
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder=" Select work location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                         <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                         
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </div>  
                            </div> 
                                <div className="space-y-2">
                                    <Label htmlFor="update-is_active" className="text-sm font-medium flex items-center gap-2 ">{isActive?<CheckCircle size={16} className="text-green-600"/> : <XCircle size={16} className="text-gray-500"/>}</Label>
                                     <Select onValueChange={(val: string) => setIsActive(val==='true'?true:false)} value={isActive?'true':'false'} >
                                     <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder=" Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="true">Active</SelectItem>
                                         <SelectItem value="false">Inactive</SelectItem>
                                        
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </div>

                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button ref={addModalRef} variant={'outline'}>Cancel</Button>
                            </DialogClose>
                            <Button disabled={btnloading} onClick={UpdateJobHandler} className="w-full gap-2 h-11">{btnloading?'Updating job...':'Update Job'}</Button>
                        </DialogFooter>
                    </DialogContent>           
            </Dialog>
         </div>}
    </div>
  )
}

export default CompanyPage;
