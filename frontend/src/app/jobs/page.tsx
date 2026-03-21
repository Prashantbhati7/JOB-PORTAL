"use client"
import JobCard from '@/components/JobCard';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Dialog,DialogClose,DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { job_service } from '@/context/appContext';
import { Job } from '@/type';
import axios from 'axios';
import { Briefcase, Filter, Loader, MapPin, Search, X} from 'lucide-react';


import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
const locations:string[] = ['Dehi','Mumbai','Benglore','Hyderabad','Pune','Kolkata','Chennai','Remote'];
const JobsPage = () => {
    const [loading,setloading] = useState(true);
    const [jobs,setJobs]= useState<Job[]>([]);
    const [title,settitle] = useState("");
    const [location,setlocation] = useState("");
    const ref = useRef<HTMLButtonElement>(null);
    const fetchJobs = async()=>{
        setloading(true);
        try{
            const {data} = await axios.get(`${job_service}/api/job?title=${title}&location=${location}`,{withCredentials:true});
            setJobs(data.jobs);
           // toast.success(data.message);
        }catch(error:any){
            toast.error(error.response?.data?.message || "something went wrong");
        }
        finally{
            setloading(false);
        }
    }
    const clickEvent = ()=>{
        ref.current?.click();
    }
    const clearFilter = ()=>{
        settitle("");
        setlocation("");
        fetchJobs();
        ref.current?.click();
    }
    const haveActiveFilter = title || location;

    useEffect(()=>{
        fetchJobs();
    },[title,location]);
  return (
    <div className='min-h-screen absolute w-full  '>
            <div className='max-w-7xl mx-auto h-full px-4 py-8 '>
                <div className='mb-8 h-full'>
                    <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
                        <div>
                            <h1 className='text-3xl md:text-4xl font-bold mb-2 text-red-500'>
                                Explore <span className='bg-linear-to-r from-blue-500 via-red-400 to-blue-800 text-clip bg-clip-text text-transparent'> Opportunities</span>
                            </h1>
                            <p className='text-base opacity-70'>
                                {jobs.length} Jobs
                            </p>
                        </div>
                        <Button onClick={clickEvent} className="gap-2 h-11"><Filter size={18}/> Filters 
                        {haveActiveFilter && <span className='ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs'>Active</span>}
                        </Button>
                    </div>
                    {haveActiveFilter && <div className='flex items-center gap-2 flex-wrap'>
                         <span className='text-sm opacity-70'> Active Filter :
                            {title && <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-gray900/30 text-blue-600 text-sm'>
                              <Search size={14}/>
                              {title}
                              <button className='hover:bg-blue-200 dark:bg-blue-800 rounded-full p-0.5 ' onClick={()=>settitle("")}><X size={14}/></button>
                            </div>}
                            {location && <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-gray900/30 text-blue-600 text-sm'>
                              <MapPin size={14}/>
                              {location}
                              <button className='hover:bg-blue-200 dark:bg-blue-800 rounded-full p-0.5 ' onClick={()=>setlocation("")}><X size={14}/></button>
                            </div>}
                         </span>
                     </div> }
                    {loading ? <Loading/> :
                    <>
                    {jobs && jobs.length>0 ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                        {jobs.map((job)=>
                            (
                           <JobCard key={job.job_id} job={job}/>
                        ))
                        }
                    </div> :
                    <div className='text-center py-16'>
                        <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
                            <Briefcase size={40} className='opacity-40'/>
                        </div>
                        <h3 className='text-xl font-semibold mb-2 '>No Jobs Found</h3>
                    </div>
                    }
                    </>}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button ref={ref} className='hidden'></Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-125 '>
                        <DialogHeader>
                            <DialogTitle className='text-2xl flex items-center gap-2'>
                                <Filter className='text-blue-600'/> Filter Jobs
                            </DialogTitle>
                        </DialogHeader>
                         <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2"><Search size={16}/> Search by job title </Label>
                                <Input id="title" type="text" placeholder="enter comapany name" className="h-11" value={title} onChange={(e)=>settitle(e.target.value)}/>

                            </div>
                                <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2"><MapPin size={16}/>  Search by location </Label>
                                <select id='location' className='h-11 w-full px-3 border-2 border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500' value={location} onChange={(e)=>setlocation(e.target.value)}>
                                    <option value={''}>All Locations</option>
                                    {locations.map((location)=>(
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter className='gap-2 flex justify-between'>
                                <DialogClose asChild >
                                  <Button className='cursor-pointer' variant={'outline'}> Close </Button>
                                </DialogClose>
                                <Button variant={'outline'} onClick={clearFilter} className='cursor-pointer' >Clear All</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
    </div>
  )
}

export default JobsPage
