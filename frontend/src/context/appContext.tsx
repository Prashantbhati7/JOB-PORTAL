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
    const fethcUser = async()=>{
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
    const logout = async()=>{
        setLoading(true);
        try{
            const {data} = await axios.get(`${auth_service}/api/auth/logout`,{withCredentials:true});
            toast.success(data.message)
        }
        catch(error){
            console.log(error);
        }
        finally{
            setUser(null);
            setIsAuth(false);
            setLoading(false);
        }
    }
    useEffect(()=>{
        fethcUser();
    },[])
    return(
        <AppContext.Provider value={{user,setUser,btnloading,isAuth,setIsAuth,loading,setLoading,logout}}>
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