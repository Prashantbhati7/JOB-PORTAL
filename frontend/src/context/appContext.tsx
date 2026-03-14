"use client";

import { AppProviderProps,AppContextType ,User } from "@/type";
import axios from "axios";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const AppContext = createContext<AppContextType| undefined >(undefined);

const AppProvider:React.FC<AppProviderProps> = ({children})=>{
    const [user,setUser] = useState<User |null>(null);
    const [isAuth,setIsAuth] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const [btnloading,setBtnLoading] = useState<boolean>(false);
    const fetchUser = async()=>{
        setLoading(true);
        try{
            const {data} = await axios.get(`${user_service}/api/user/profile` ,{withCredentials:true});
            console.log("user is ",data);
            setUser(data.user);
            setIsAuth(true);
            return;
    }catch(error){
        console.log(error);
        setIsAuth(false);
        return;
    }finally{
        setLoading(false);
        
    }
    }
    const updateProfilePic = async(formData:any)=>{
        setLoading(true);
        try{
            const {data} = await axios.patch('http://localhost:5003/api/user/profile/pic',formData,{withCredentials:true});
            toast.success(data.message);
            fetchUser();    // it will updata the user states to new updated one 
        }catch(error:any){
            toast.error(error.response.data.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }
    }
    const updateResume = async(formData:any)=>{
        setLoading(true);
        try{
            const {data} = await axios.patch('http://localhost:5003/api/user/resume',formData,{withCredentials:true});
            toast.success(data.message);
            fetchUser();    // it will updata the user states to new updated one 
        }catch(error:any){
            toast.error(error.response.data.message || 'something went wrong');
        }
        finally{
            setLoading(false);
        }
    }
    const updateUser = async(name:string,phone_number:string,bio:string)=>{
        setBtnLoading(true);
        try{
            const {data} = await axios.patch('http://localhost:5003/api/user/profile',{name,phone_number,bio},{withCredentials:true});
            toast.success(data.message);
            fetchUser();    // it will updata the user states to new updated one 
        }catch(error:any){
            console.log(error);
            toast.error(error.response.data.message || 'something went wrong');
        }
        finally{
            setBtnLoading(false);
        }
    }
    const addSkill = async(skill:string,setSkill:React.Dispatch<React.SetStateAction<string | "">>)=>{
        setBtnLoading(true);
        try{
            const {data} = await axios.patch('http://localhost:5003/api/user/skills',{skill},{withCredentials:true});
            toast.success(data.message);
            setSkill("");
            fetchUser();    // it will updata the user states to new updated one 
        }catch(error:any){
            console.log(error);
            toast.error(error.response.data.message || 'something went wrong');
        }finally{
            setBtnLoading(false);
        }
    }
    const removeSkill = async(skill:string)=>{
        setBtnLoading(true);
        try{
            const {data} = await axios.post('http://localhost:5003/api/user/skills/remove',{skill},{withCredentials:true});
            toast.success(data.message);
            fetchUser();
        }catch(error:any){
            toast.error(error.response.message || "something went wrong");
        }finally{
            setBtnLoading(false);
        }
    }
    const logout = async()=>{
        setLoading(true);
        try{
            const {data} = await axios.get(`${auth_service}/api/auth/logout`,{withCredentials:true});
            toast.success(data.message)
        }
        catch(error:any){
            console.log(error);
            toast.error(error.response.data.message || 'something went wrong');
        }
        finally{
            setUser(null);
            setIsAuth(false);
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchUser();
    },[])
    return(
        <AppContext.Provider value={{user,setUser,btnloading,isAuth,setIsAuth,loading,setLoading,logout,fetchUser,updateProfilePic,updateResume,updateUser,addSkill,removeSkill}}>
            {children}
            <Toaster/>
        </AppContext.Provider>
    )
}

const UseAppData = ():AppContextType =>{
    const context = useContext(AppContext);
    if (!context){
        throw new Error("useAppData must be used within an AppProvider");
    }
    
    return context;
    
}

const utils_service = "http://localhost:5001";
const auth_service = "http://localhost:5002";
const user_service = "http://localhost:5003";
const job_service = "http://localhost:5004";


export {AppContext,AppProvider,UseAppData}