"use client";

import { AppProviderProps,AppContextType ,User } from "@/type";

import React, { createContext, useContext, useState } from "react";
import { Toaster } from "react-hot-toast";
const AppContext = createContext<AppContextType| undefined >(undefined);

const AppProvider:React.FC<AppProviderProps> = ({children})=>{
    const [user,setUser] = useState<User |null>(null);
    const [isAuth,setIsAuth] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const [btnloading,setBtnLoading] = useState<boolean>(false);
    return(
        <AppContext.Provider value={{user,setUser,btnloading,isAuth,setIsAuth,loading,setLoading}}>
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