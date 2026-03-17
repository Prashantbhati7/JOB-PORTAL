"use client"
import Loading from '@/components/loading';
import useRazorpay from '@/components/scriptLoader'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { payment_service, UseAppData } from '@/context/appContext';
import axios from 'axios';
import { error } from 'console';
import { CheckCircle, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
    const razopayLoaded = useRazorpay();
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const {setUser} =UseAppData();
    const handleSubscribe = async()=>{
         setLoading(true);
        //  try{
         const {data} = await axios.post(`http://localhost:5005/api/payment/checkout`,
            {}
            ,{withCredentials:true})
            const order = data.order;
            console.log("order recieved is ",order);
         const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Replace with your Razorpay key_id
                amount: order.id, // Amount is in currency subunits.
                currency: 'INR',
                name: 'EzHire',
                description: 'Find job easily',
                order_id: order.id, // This is the order_id created in the backend
                handler:async function(response:any){
                    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = response;
                    try{
                        const {data} = await axios.post(`${payment_service}/api/payment/verify`,
                            {razorpay_order_id,razorpay_payment_id,razorpay_signature},{withCredentials:true});
                        toast.success(data.message);
                        setUser(data.user);
                        setLoading(false);
                        router.push(`/payment/success/${razorpay_payment_id}`);

                    }catch(error:any){
                        console.log(error);
                        toast.error(error.response?.data?.message || "something went wrong");
                        setLoading(false);
                        router.push('/');
                    }finally{
                        setLoading(false);
                    }
                },
                theme: {
                color: '#F37254'
                }
         };
         if (!razopayLoaded) console.log("something went wrong with script");
         const razorpay = new window.Razorpay(options);
         razorpay.open();
        
        // }
        // catch(error){
        //     console.log('error ',error);
        // }
    } 
    if (loading) return <Loading/>   
  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-secondary/30'>
        <Card className='max-w-md w-full p-8 text-center shadow-lg border-2'>
            <div className='inline-flex items-center rounded-full mb-4 bg-blue-100 dark:bg-blue-900 justify-center w-16 h-16 '>
                <Crown size={32} className='text-blue-600'/>
            </div>
            <h1 className='text-3xl font-bold mb-2'>Premium Subscription</h1>
            <p className='text-sm opacity-70 mb-6'>Boost your job search</p>
            <div className='mb-6'>
                <p className='text-5xl font-bold text-blue-600'>₹ 119 </p>
                <p className='text-sm opacity-60 mt-1'>Per month</p>
            </div>
            <div className='space-y-3 mb-8 text-left'>
                <div className='flex items-start gap-3'>
                    <CheckCircle size={20} className='text-green-600 shrink-0 mt-0.5 '/>
                    <p className='text-sm'>Your application will be shown first to recruiters</p>
                </div>
                 <div className='flex items-start gap-3'>
                    <CheckCircle size={20} className='text-green-600 shrink-0 mt-0.5 '/>
                    <p className='text-sm'>Priority support</p>
                </div>
            </div>
            <Button onClick={handleSubscribe} className='w-full h-12 text-base gap-2'> 
                <Crown size={18}/> Subscribe Now 
                 </Button>
        </Card>
      
    </div>
  )
}

export default SubscriptionPage 
