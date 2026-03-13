"use client"
import CareerGuide from "@/components/career-guide"
import Hero from "@/components/Hero"
import Loading from "@/components/loading"
import ResumeAnalyzer from "@/components/ResumeAnalyser"
import { UseAppData } from "@/context/appContext"


const page = () => {
  const {loading} = UseAppData();
  if (loading) return <Loading/>
  return (

    <div>
       <Hero></Hero>
       <CareerGuide/>
       <ResumeAnalyzer/>
    </div>
  )
}

export default page
