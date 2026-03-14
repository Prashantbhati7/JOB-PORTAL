"use client"

import Loading from "@/components/loading";
import { User } from "@/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Info from "../(components)/info";
import Skills from "@/components/Skills";


const Userpage = () => {
    const {id} = useParams();
   
    const [user,setUser] = useState<User |null >(null);
    const [loading,setLoading] = useState<boolean>(true);
    const fetchUser = async()=>{
        try{
            setLoading(true);
            const {data} = await axios.get(`http://localhost:5003/api/user/${id}`,{withCredentials:true});
            setUser(data.user);
            console.log('data is ',data);
        }
        catch(error:any)
        {
            console.log(error);
            toast.error(error.response?.data?.message || 'something went wrong ');
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchUser();
    },[id])
    if (loading) return <Loading/>
  return (
    <>
    {user && <div className='w-[90%] md:w-[60%] m-auto'>
     <Info user={user} isYourAccount={false} />
      {user.role=='jobseeker' && <Skills user={user} isYourAccount={false}/> }
    </div>}
    </>
  )
}

export default Userpage;
