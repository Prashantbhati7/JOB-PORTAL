
"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Company as companyType } from "@/type";
import axios from "axios";
import { Briefcase, Building,  Building2,  Eye, FileText, Globe, Image,  LoaderCircle, Plus, Trash } from "lucide-react";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Company = () => {
    const [loading,setLoading] = useState(false);
    const addRef =useRef<HTMLButtonElement |null>(null);
    const openDialog = ()=>{
      addRef.current?.click();
    }
    const [name,setName]=useState("");
    const [description,setDescription]=useState("");
    const [website,setWebsite]=useState("");
    const [logo,setLogo]=useState<File|null>(null);
    const [btnloading,setBtnLoading]=useState(false);
    const [companies,setComapanies] = useState<companyType[]>([]);

    const clearData = ()=>{
      setName("");
      setDescription("");
      setWebsite("");
      setLogo(null);
    }
    const fetchCompanies = async()=>{
      setLoading(true);
      try{
        const {data} = await axios.get('http://localhost:5004/api/company',{withCredentials:true});
        console.log("all comapnies are ",data.companies);
        setComapanies(data.companies);
      }catch(error:any){
        toast.error(error.response?.data?.message || "something went wrong !")
      }
      finally{
        setLoading(false);
      }
    }
    const addCompany = async()=>{
      setBtnLoading(true);
      try{
        if (!name.trim() || !description.trim() || !website.trim() || !logo) {
          toast.error("please fill all the fields");
          return;
        }
        const formData = new FormData();
        formData.append('name',name);
        formData.append('description',description);
        formData.append('website',website);
        formData.append('file',logo as File);
        const {data} = await axios.post('http://localhost:5004/api/company',formData,{withCredentials:true});
        toast.success(data.message);
        clearData();
        fetchCompanies();
      }catch(error:any){
        toast.error(error.response?.data?.message || "something went wrong !")
      }finally{
        setBtnLoading(false);
      }
    }
    const deleteCompany = async(companyId:string)=>{
      setBtnLoading(true);
      try{
        const {data} = await axios.delete(`http://localhost:5004/api/company/${companyId}`,{withCredentials:true});
        toast.success(data.message);
        fetchCompanies();
      }catch(error:any){
        toast.error(error.response?.data?.message || "something went wrong !")
      }
      finally{
        setBtnLoading(false);
      }
    }
    useEffect(()=>{
      fetchCompanies();
    },[])
  if (loading){
    return <div className="max-w-7xl text-center text-2xl mx-auto px-4 py-6"> <span className="animate-ping">Loading....</span> </div>
  }
  return (
   
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Building size={20} className="text-blue-600 "></Building>
              </div>
            </div>
            <CardTitle className="text-2xl text-primary">Add Company</CardTitle>
            <CardDescription className="text-sm mt-1 text-primary">
              Manage your registered comapnies ({companies.length}/3)
            </CardDescription>
        {companies.length<3 && <Button className="gap-2" onClick={openDialog}><Plus size={18}></Plus> Add Company</Button>}
          </div>
        </div>
        {companies.length>0 ? 
        <div className="grid gap-4">
          { companies.map((c)=> (<div key={c.company_id} className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-blue-500 transition-all bg-background">
              <div className="h-16 w-16 rounded-full border-2 overflow-hidden shrink-0 bg-background ">
                 <img className="w-full h-full object-cover" src={c.logo} alt={c.name}></img>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg mb-1 truncate font-semibold">{c.name}</h3>
                <p className="text-sm opacity-70 line-clamp-2 mb-2">{c.description}</p>
                <a href={c.website} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1 ">
                  <Globe size={12}></Globe>
                  {c.website}
                </a>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link   href={`/company/${c.company_id}`}>
                   <Button disabled={btnloading} variant={'outline'} size={'icon'} className="h-9 cursor-pointer px-4"><Eye size={16}/></Button>
                </Link> 
                {!btnloading? <Button variant={'destructive'} size={'icon'} onClick={()=>deleteCompany(c.company_id)} className="h-9 p-5 cursor-pointer"><Trash size={16}/></Button>:
                <div><LoaderCircle className="animate-spin h-6 w-6"></LoaderCircle></div>}
              </div>
          </div>))}
        </div> 
        :<div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Building size={32} className="opacity-40"/> 
          </div>
          <CardDescription className="text-base mb-4">No companies rgistered yet</CardDescription>
          <p className="text-sm opacity-60">Add your first comapany to start posting jobs </p>
          </div>}
        </Card>
        {/* Dialog box for adding company  */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="hidden" ref={addRef}></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Building2 className="text-blue-600"/> Add new Comapany
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
               <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2"><Briefcase size={16}/>Company Name </Label>
                <Input id="name" type="text" placeholder="enter comapany name" className="h-11" value={name} onChange={(e)=>setName(e.target.value)}/>

               </div>
                <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2"><FileText size={16}/>  Description </Label>
                <Input id="description" type="text" placeholder="enter description" className="h-11" value={description} onChange={(e)=>setDescription(e.target.value)}/>

               </div>
                <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2"><Globe size={16}/> Website </Label>
                <Input id="website" type="text" placeholder="enter website " className="h-11" value={website} onChange={(e)=>setWebsite(e.target.value)}/>

               </div>
                <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium flex items-center gap-2"><Image size={16}/>Company Logo</Label>
                <Input id="logo" type="file"  accept="image/*" className="cursor-pointer h-11"   onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setLogo(e.target.files?.[0] || null)}/>

               </div>
            </div>
            <DialogFooter>
              <Button disabled={btnloading} onClick={addCompany} className="w-full h-11" type="submit">{btnloading?'saving changes...':'Add Company'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default Company
