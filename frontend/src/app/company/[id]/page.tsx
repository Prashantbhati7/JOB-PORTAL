"use client";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { UseAppData } from "@/context/appContext";
import { Company } from "@/type";
import axios from "axios";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const  CompanyPage= () => {
    const {id} = useParams();
    const {user,isAuth} = UseAppData();
    const [loading,setLoading] = useState(true);
    const [btnloading,setBtnLoading] = useState(false);
    const [company,setComapany] = useState<Company | null>(null);
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
          <Card className="overflow-hidden shadow-lg border-2 mb-8"></Card>
         </div>}
    </div>
  )
}

export default CompanyPage;
