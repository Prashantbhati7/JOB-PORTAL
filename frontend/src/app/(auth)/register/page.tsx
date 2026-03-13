"use client"

import { UseAppData } from "@/context/appContext";
import axios from "axios";
import { redirect } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';
import { Label } from "@/components/ui/label";
import { ArrowRight,  Lock, Mail, NotebookIcon, PenIcon, PhoneCall, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";
import { Select,SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterPage = () => {
    const [email,setEmail] = useState("");
    const [name ,setname] = useState("");
    const [role,setRole] = useState("");
    const [phone,setPhone] = useState("");
    const [bio,setBio] = useState("");
    const [resume,setResume] = useState<File | null >(null);
    const [password,setPassword] = useState("");
    const [BtnLoading,setBtnLoading] = useState(false);
    const {isAuth,setUser,loading,setIsAuth,setLoading }= UseAppData();
    if (loading) return <Loading/>
    if (isAuth){
      return redirect('/');
    }
    const submitHandler = async(e:React.SubmitEvent<HTMLFormElement>)=>{
      e.preventDefault();
      setBtnLoading(true);
      const formData = new FormData();
      formData.append('email',email);
      formData.append('name',name);
      formData.append('password',password);
      formData.append('phone_number',phone);
      formData.append('role',role);
      
      if (role=='jobseeker'){
        formData.append('file',resume);
        formData.append('bio',bio);
      }
      
      if (!email || !password){
        toast.error("Please fill all the fields");
        setBtnLoading(false);
        return;
      }
      try{
        console.log("form data is ",formData);
        const response = await axios.post('http://localhost:5002/api/auth/register',formData,{withCredentials:true});
         
        if (response.data.user) {
          console.log("user is ",response.data.user);
          setUser(response.data.user);
          setIsAuth(true);
          setLoading(false);
          toast.success(response.data.message);
          // Cookies.set('token', response.data.token,{expires: 15,secure:true,path:'/'});
          setEmail("");
          setPassword("");
          // redirect('/');
        }else{
          console.log("this is else block error ")
          toast.error(response.data.message);
          setEmail("");
          setPassword("");
          return;
        }
      }catch(error:any){
        console.log("error is : ",error.response);
        toast.error(error?.response?.data.message || "Something went wrong")
        setEmail("");
        setIsAuth(false);
        setPassword("");
        return;
      }finally{
        setBtnLoading(false);
      }
    }
  
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 md:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center ">
             <div className="text-4xl tracking-tight font-bold mb-2"> Welcome to  <span className="inline-flex gap-0"> <span className=" text-red-500 ">Ez</span> <span className="bg-linear-to-r from-blue-500 via-red-400 to-blue-800 text-clip bg-clip-text text-transparent">Hire</span> </span> </div>
             <p className="text-sm opacity-70">Create new account to start new journey</p>
          </div> 
          <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="space-y-2">
                 <Label htmlFor="name" className="text-sm font-medium ">Name </Label>
                 <div className="relative "> <User className="icon-style"/> <Input type="name"
                  id="name" placeholder="john"  value={name} 
                  onChange={(e)=> setname(e.target.value)} required
                  className="pl-10 w-full border-2 border-gray-500/50 h-12 rounded-2xl " /> </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="email" className="text-sm font-medium ">Email </Label>
                 <div className="relative "> <Mail className="icon-style"/> <Input type="email"
                  id="email" placeholder="your@example.com"  value={email} 
                  onChange={(e)=> setEmail(e.target.value)} required
                  className="pl-10 w-full border-2 border-gray-500/50 h-12 rounded-2xl " /> </div>
              </div>
              <div className="space-y-2  ">
                 <Label htmlFor="password" className="text-sm font-medium ">Password </Label>
                 <div className="relative">
                  <Lock className="icon-style"/>
                  <Input type="password"
                  id="password"   value={password} 
                  onChange={(e)=> setPassword(e.target.value)} placeholder="********"
                  className="pl-11 w-full h-12 rounded-2xl border-2 border-gray-500/50 " /> 
                  </div>
              </div>
              <div className="space-y-2  ">
                 <Label htmlFor="phone" className="text-sm font-medium "> Phone Number </Label>
                 <div className="relative">
                  <PhoneCall className="icon-style"/>
                  <Input type="text"
                  id="phone"   value={phone} 
                  onChange={(e)=> setPhone(e.target.value)} placeholder="9999xxxxx"
                  className="pl-11 w-full h-12 rounded-2xl border-2 border-gray-500/50 " /> 
                  </div>
              </div>
              <div className="space-y-2  ">
                 <Label htmlFor="Role" className="text-sm font-medium "> Role </Label>
                 <div className="relative">
                 
                    <Select onValueChange={(val: string) => setRole(val)} value={role}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="jobseeker">Job Seeker</SelectItem>
                        <SelectItem value="recruiter">Recruiter</SelectItem>
        
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </div>
              </div>
             { role==='jobseeker' && <div className="space-y-2  ">
                 <Label htmlFor="Bio" className="text-sm font-medium "> Bio </Label>
                 <div className="relative">
                   
                  <textarea id="Bio" className="w-full " placeholder="Write about yourself" value={bio} onChange={(e)=> setBio(e.target.value)}></textarea>
                   
                  </div>
              </div> }
              { role==='jobseeker' && 
               <div className="space-y-2  ">
                 <Label htmlFor="Resume" className="text-sm font-medium "> Resume</Label>
                 <div className="relative">
                  <NotebookIcon className="icon-style"/>
                  
                  <input type="file" id="Resume" className="pl-11 w-full h-12 rounded-2xl border-2 border-gray-500/50 " onChange={(e)=> { if (e.target.files && e.target.files[0]) { setResume(e.target.files[0]) }  }} />
                   
                  </div>
              </div>}
              <div className="flex items-center justify-end">
                <Link href={'/forgot'}  className="text-sm text-blue-500 hover:underline transition-all  ">Forgot Password ?  </Link>
              </div>
              <Button disabled={BtnLoading} className="w-full" >{BtnLoading?"Please Wait..." : "Register"} <ArrowRight/> </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-gray-400">
              <p className="text-center text-md">Already have an Account? <Link className="text-blue-500 font-medium hover:underline transition-all" href={'/login'}>Login </Link> </p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RegisterPage;
