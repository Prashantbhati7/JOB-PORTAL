"use client"
import Loading from '@/components/loading';
import { UseAppData } from '@/context/appContext'
import React from 'react'
import Info from './(components)/info';
import { redirect } from 'next/navigation';
import Skills from '@/app/account/(components)/Skills';
import Company from '@/app/account/(components)/company';

const AccountPage = () => {
    const {isAuth,user,loading} = UseAppData();
    if (loading) return <Loading/>
    if (!isAuth) return redirect('/login');
    if (!user) return redirect('/login');
  return (
   <>
   {user && <div className='w-[90%] md:w-[60%] m-auto'>
     <Info user={user} isYourAccount={true} />
     {user.role=='jobseeker' && <Skills user={user} isYourAccount={true}/> }
     {user.role=='recruiter' && <Company />}
    </div>}
   </>
  )
}

export default AccountPage
