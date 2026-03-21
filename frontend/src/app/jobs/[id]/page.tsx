"use client"
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { job_service, UseAppData } from '@/context/appContext'
import { Application, Job } from '@/type';
import axios from 'axios';
import { ArrowRight, Briefcase,   Building2,  CheckCircle2, DollarSign, MapPin, Users2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const JobPage = () => {
    const {id} = useParams();
    const {user,isAuth,applyJob,applications,btnloading} = UseAppData();
    const router = useRouter();
    const [job,setJob] = useState<Job | null>(null);
    const [applied,setApplied]= useState(true);

    const applyJobHandler = async(id:number)=>{
            await applyJob(id)
    } 
    const [loading,setloading] = useState(true);
    const fetchSingleJob = async()=>{
        try{
            const {data} = await axios.get(`${job_service}/api/job/${id}`)
            setJob(data.job);
            setloading(false);
        }catch(error:any){
            console.log(error);
            toast.error(error.response?.data?.message || 'something went wrong')
        }finally{
            setloading(false);
        }
    }

    useEffect(()=>{
        fetchSingleJob();
    },[id])

    const [jobApplications,setJobApplicatoins] = useState<Application[]>([]); 


    const fetchJobApplications = async()=>{
        try{
            const {data} = await axios.get(`${job_service}/api/job/${id}/applications`,{withCredentials:true});
            setJobApplicatoins(data.applications);
        }catch(error){
            console.log(error);
        }
    }

    const [load,setload] = useState(true);
    useEffect(()=>{
        if (applications && id){
                applications.forEach((item:any)=>{
                    if (item.job_id.toString()===id){
                        setApplied(true)
                }
        })
        }
        setload(false);
    },[applications,id]) 


    useEffect(()=>{
        if (user && job && user.user_id === job.posted_by_recruiter_id){
            fetchJobApplications();
        }
    },[user,job])
    const [filterStatus,setFilterStatus] = useState("All");
    const filteredApplications = filterStatus ==='All' ? jobApplications :
    jobApplications.filter((app)=>app.status==filterStatus);

    const [value,setValue] = useState("")
    const updateApplicationHandler = async(id:number)=>{
        if (value==='') return toast.error("please give valid input");
        try{
            const {data} = await axios.patch(`${job_service}/api/application/${id}`,{status:value},{withCredentials:true});
            toast.success(data.message);
            fetchJobApplications();
        }catch(error:any){

            console.log(error);
            toast.error(error.response?.data?.message || 'something went wrong ')
        }
    }
  return (
    <div className='min-h-screen bg-secondary/30  '>
      {
        loading ? <Loading/> :<>
        {job && <div className='max-w-5xl mx-auto px-4 py-8'>
            <Button onClick={()=>router.back()} variant={'ghost'} className='mb-6 gap-2'>
                <ArrowRight size={18}/>Back to jobs
            </Button>

            <Card className='overflow-hidden shadow-lg border-2 mb-6'>
                <div className='bg-blue-600 p-8 border-b '>
                    <div className='flex justify-between items-center gap-4 flex-wrap'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-3'>
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${job.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-600':'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                                    {job.is_active ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <h1 className='text-3xl text-primary md:text-4xl font-bold mb-4'>{job.title} </h1>
                            <div className='flex text-primary items-center gap-2 text-base opacity-70 mb-2'>
                                <Building2 size={18}/>
                                <span>{job.company_name}</span>
                            </div>
                        </div>
                        {user && user.role ==='jobseeker' && <div className='shrink-0'>
                            { load ?<div>Loading...</div>: applied ? <div className='flex items-center gap-2 px-6 py-3 rounded-lg bg-green-100 dark:bg-gray-900/30 text-green-600 font-medium'>
                              <CheckCircle2 size={20}/> Already Applied
                            </div> : <>{job.is_active && <Button onClick={()=>applyJobHandler(job.job_id)} disabled={btnloading} className='gap-2 h-12 px-8'> <Briefcase size={18}/> {btnloading?'Applying...':'Easy Apply'} </Button>}</>}
                            </div>}
                    </div>
                </div>
                <div className='p-8'>
                    <div className='grid md:grid-cols-3 gap-6 mb-8'>
                        <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                            <div className='h-12 w-12 rounded-full flex bg-blue-100 dark:bg-blue-900/30 items-center justify-center shrink-0 '>
                             <MapPin size={20} className='text-blue-600 ' />
                            </div>
                            <div>
                                <p className='text-xs opacity-70 font-medium mb-1'>Location</p>
                                <p className='font-semibold'>{job.location}</p>
                            </div>
                        </div>

                         <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                            <div className='h-12 w-12 flex rounded-full bg-blue-100 dark:bg-blue-900/30 items-center  justify-center shrink-0 '>
                             <DollarSign size={20} className='text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs opacity-70 font-medium mb-1'>Salary</p>
                                <p className='font-semibold'>₹{job.salary} P.A</p>
                            </div>
                        </div>

                          <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                            <div className='h-12 flex w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center  justify-center shrink-0 '>
                             <Users2 size={20} className='text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs opacity-70 font-medium mb-1'>Openings</p>
                                <p className='font-semibold'>{job.openings} positions </p>
                            </div>
                        </div>
                    </div>
                    {/* job description  */}
                    <div className='space-y-4'>
                        <h2 className='text-2xl font-bold flex items-center gap-2'> <Briefcase size={24} className='text-blue-600' /> Job Description </h2>
                        <div className='p-6 rounded-lg bg-secondary border'>
                            <p className='text-base leading-relaxed whitespace-pre-line'>{job.description}</p>
                        </div>
                    </div>
                </div>
            </Card>
            </div>}
        </>
      }
      {user && job && user.user_id == job.posted_by_recruiter_id && 
      <div className='w-[90%] md:w-2/3 container mx-auto mt-8 mb-8 '>
         <div className='flex items-center justify-between mb-4 flex-wrap'>
            <h2 className='text-2xl font-bold'>All Applications</h2>
            <div className='flex items-center gap-2'>
                <label htmlFor="filter-status" className='text-sm font-medium'>Filter:</label>
                <select   value={filterStatus} className='p-2 border-2 border-gray-300 rounded-md bg-background' onChange={(e)=>setFilterStatus(e.target.value)} id="filter-status">
                    <option value="All">All Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
         </div>
         {jobApplications && jobApplications.length >0 ?
         <>
          <div className='space-y-4'>
            {filteredApplications.map(e=>(<div className='p-4 rounded-lg bg-background' key={e.application_id}>
                <div className='flex items-center justify-between mb-3'> <span className={`px-3 py-1 rounded-full text-sm font-medium ${e.status === "Hired"?"bg-green-100 dark:bg-green-900/30 text-green-600 ":e.status==="Rejected"?"bg-red-100 dark:bg-red-900/30 text-red-600":"bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"}`}> {e.status} </span> </div>
                    <div className='flex gap-3 mb-3'>
                        <Link href={e.resume} target='_blank' className='text-blue-500 hover:underline text-sm'>View Resume</Link>
                        <Link href={`/account/${e.applicant_id}`} target='_blank' className='text-blue-500 hover:underline text-sm'>View Profile</Link>
                    </div>
                {/* status update */}
                    <div className='flex gap-2 pt-3 border-t'>
                        <select className='flex-1 p-2 border-2 border-gray-300 rounded-md bg-background' value={value} onChange={e=> setValue(e.target.value)}>
                            <option value="">Update Status</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <Button disabled={btnloading} onClick={()=>updateApplicationHandler(e.application_id)} > Update </Button>
                    </div>
                </div>))}
          </div> 
          {filteredApplications.length === 0 && <p className='text-center py-8 opacity-70 '> No application with status {filterStatus} </p>}
          </>:
          <>
             <p className='text-center py-8 opacity-70 '> No application yet. </p>
          </>}
        </div>}
    </div>
  )
}

export default JobPage;
