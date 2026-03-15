"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UseAppData } from "@/context/appContext";
import { Company, Job} from "@/type";
import axios from "axios";
import { Briefcase, Globe } from "lucide-react";
import Link from "next/link";

import { useParams } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import {  useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";


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
            if (!title.trim() || !description.trim() || !salary.trim() || !location.trim() || !openings.trim() || !job_type.trim() || !work_location.trim()) {
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
                comapny_id:id,
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
        setSalary(String(job.salary || ""));
        setLocation(job.location || "");
        setrole(job.role);
        setOpenings(job.openings.toString());
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
                is_active:isActive
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
                        <img src={company.logo} alt={company.name} className='w-full h-full object-cover'> </img>
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
                        </div>
                    </div>
                </Card>
            </Dialog>
         </div>}
    </div>
  )
}

export default CompanyPage;
