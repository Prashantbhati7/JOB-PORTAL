"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UseAppData } from '@/context/appContext';
import { AccountProps } from '@/type';
import { Briefcase, Camera, FileText, Mail, NotepadText, Phone, User } from 'lucide-react';
import Link from 'next/link';

import { redirect } from 'next/navigation';

import React, { ChangeEvent, useRef, useState } from 'react'

const Info:React.FC<AccountProps> = ({user,isYourAccount}) => {
  const [btnloading,setBtnLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement |null>(null);
  const editRef = useRef<HTMLInputElement | null> (null);
  const resumeRef = useRef<HTMLInputElement | null> (null);
 
  const [name,setName] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  
  const [bio,setBio] = useState("");
  const {updateProfilePic} = UseAppData();
  const handleClick = ()=>{
    inputRef.current?.click();
  }
  const changeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if (file){
      const formData = new FormData();
      formData.append('file',file);
      updateProfilePic(formData);
    }
  }
  const handleEditClick = ()=>{
    editRef.current?.click();
    setName(user.name);
    setPhoneNumber(user.phone_number);
    setBio(user.bio || ""); 
  }
  const updataProfilehandler = ()=>{

  }
  const handleResumeClick = ()=>{
    resumeRef.current?.click();
    
  }
  const changeResume = (e:ChangeEvent<HTMLInputElement>)=>{
     const file = e.target.files?.[0];
    if (file){
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }
      const formData = new FormData();
      formData.append('file',file);
      
    }
  }
  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <Card className='overflow-hidden shadow-lg border-2'>
        <div className='h-32 bg-blue-500 relative'>
          <div className='absolute -bottom-14 left-8'>
            <div className='relative group '>
              <div className='w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-background '>
                {!(user.profile_pic) && <div className='w-full h-full relative bg-gray-500 text-center text-white'> <p className='absolute text-center top-1/4  left-1/2 -translate-x-1/2 -translate-y-1/2h-full text-5xl font-bold '>{<User size={80}/>}</p> </div>}
                { (user.profile_pic)  && <img className={ `w-full h-full object-fill`} src={user?.profile_pic} alt="user" /> }

              </div>
              {/* edit for your account  */}
              {isYourAccount && <> <Button variant={'secondary'} size={'icon'} onClick={handleClick} className='absolute cursor-pointer bottom-0 right-0 rounded-full h-10 w-10 shadow-lg'>
                 <Camera size={18}/> 
                </Button>
                <input type="file" className='hidden' accept='image/*' ref={inputRef} onChange={changeHandler} />
                 </>
                }
            </div>
          </div>
        </div>
        {/* main content */}
        <div className='pt-20 pb-8 mx-8'>
          <div className='flex justify-between items-center flex-wrap gap-4'>
            <div className='space-y-1'>
              <div className="flex items-center gap-3">
                <h1 className='text-3xl font-bold'>{user.name}</h1>
                {/* edit button */}
              </div>
              <div className=' flex items-center gap-2 text-sm opacity-70'>
                <Briefcase size={20}/>
                <span className='capitalize'>{user.role}</span>
              </div>
            </div>
          </div>
          {/* Bio section */}
          {user.role === 'jobseeker' && user.bio && <div className='mt-6
           p-4 rounded-lg border  '>
            <div className='flex items-center gap-2 mb-2 text-sm font-medium opacity-70'>
                <FileText  size={16}/>
                <span>About</span>

               </div>
               <p className='text-base leading-relaxed '>{user.bio}</p>
            </div>}
          {/* contact info */}
          <div className='mt-8 '>
            <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Mail size={20} className='text-blue-600'/>
              Contact Infomation
            </h2>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors'>
                <div className='h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900'>
                  <Mail size={18} className='text-blue-600'/>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs opacity-70 font-medium'>Email</p>
                  <p className='text-sm truncate'>{user.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors'>
                <div className='h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900'>
                  <Phone size={18} className='text-blue-600'/>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs opacity-70 font-medium'>Phone</p>
                  <p className='text-sm truncate'>{user.phone_number}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Resume  */}
          {user.role === 'jobseeker' && user.resume && 
            <div className='mt-8 '>
              <h2 className='text-lg font-semibold mt-4 flex items-center gap-2'>
                <NotepadText size={20} className='text-blue-600'/> Resume
              </h2>
              <div className='flex overflow-hidden items-center gap-3 rounded-lg border hover:border-blue-500 transition-colors'>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <NotepadText size={20} className='text-red-600'/>
                
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>Resume Document</p>
                   <Link href={user.resume} className='text-sm text-blue-500 hover:underline' target='_blank'>View Resume </Link>
                </div>
                {/* edit button */}
                <Button variant={'outline'} size={'sm'} onClick={handleResumeClick} className='gap-2 rounded-2xl mx-2'>Update</Button>
                <input type="file" className='hidden' accept='application/pdf' ref={resumeRef} onChange={changeResume} />
              </div>
            </div>
           }
        </div>
      </Card>
    </div>
  )
}

export default Info;
