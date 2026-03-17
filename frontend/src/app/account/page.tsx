"use client"
import Loading from '@/components/loading';
import { UseAppData } from '@/context/appContext'
import React, { useEffect } from 'react'
import Info from './(components)/info';
import { useRouter } from 'next/navigation';
import Skills from '@/app/account/(components)/Skills';
import Company from '@/app/account/(components)/company';
import AppliedJobs from './(components)/appliedJobs';

const AccountPage = () => {
    const {isAuth,user,loading,applications} = UseAppData();
    const router = useRouter();
    useEffect(()=>{
      if (!isAuth && !loading){
        router.push('/login');
      }
    },[isAuth,loading,router])
    if (loading) return <Loading/>
  return (
   <>
   {user && <div className='w-[90%] md:w-[60%] m-auto'>
     <Info user={user} isYourAccount={true} />
     {user.role=='jobseeker' && <Skills user={user} isYourAccount={true}/> }
     {user.role === 'jobseeker' && <AppliedJobs applications={applications} />}
     {user.role=='recruiter' && <Company />}
    </div>}
   </>
  )
}

export default AccountPage
