"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth_service, UseAppData } from "@/context/appContext";
import axios from "axios";
import { User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";




import React, { useEffect, useState } from "react"
import toast from "react-hot-toast";

const ResendPage = () => {
    const {token} = useParams();
    const [Password,setPassword] = useState("");
    const [btnloading,setBtnLoading] = useState(false);
    const {isAuth} = UseAppData();
    const router = useRouter();
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!Password.trim()) {
            toast.error("Please enter your email address");
            return;
        }
        setBtnLoading(true);
        try{
            const {data} = await axios.post(`${auth_service}/api/auth/reset/${token}`,{password:Password});
            toast.success(data?.message || "Password reset successfully ");
            setPassword("");
            router.push('/login')
        }catch(error:any){
            toast.error(error?.message || "Something went wrong Unable to reset Password");
        } finally {
            setBtnLoading(false);
        }
    }
    useEffect(()=>{
        if(isAuth){
            router.push('/');
        }
    })
  return (
 <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 md:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center ">
             <div className="text-4xl tracking-tight font-bold mb-2"> Forgot Password</div>
             <p className="text-sm opacity-70">enter your email to recieve reset password link</p>
              <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
                <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium ">Password </Label>
                    <div className="relative "> <User className="icon-style"/> <Input type="text"
                    id="email" placeholder="user@gmail.com"  value={Password} 
                    onChange={(e)=> setPassword(e.target.value)}  
                    className="pl-10 w-full border-2 border-gray-500/50 h-12 rounded-2xl " />
                    </div>
                </div>
                <Button className="w-full text-center cursor-pointer hover:shadow-gray-400 shadow-md" disabled={btnloading}> {btnloading?'please wait' : 'Reset Password'}  </Button>
                <div className="w-full text-right"> <Link className="text-blue-500 text-sm hover:underline relative -top-4 text-right w-full" href={'/login'}>Go to Login Page</Link> </div>
                </form>
              </div>
            </div>
        </div>
    </div>
  )
}

export default ResendPage
