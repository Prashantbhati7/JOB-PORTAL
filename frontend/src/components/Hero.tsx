import { ArrowRight, Briefcase, LoaderIcon, Search, TrendingUp } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

import LightRays from "./LightRays"

const Hero = () => {
   
    
  return (
   <section className="relative min-h-dvh flex items-center justify-center flex-col overflow-hidden">
    <div className="absolute inset-0 z-0 hidden dark:block">
        <LightRays
        raysOrigin="top-center"
        raysColor='#C5A6F7'
        raysSpeed={1}
        lightSpread={0.7}
        rayLength={10}
        followMouse={true}
        mouseInfluence={0.6}
        noiseAmount={0}
        distortion={0}
        className="custom-rays"
        pulsating={false}
        fadeDistance={3}
        saturation={1}
    />
    </div>
    <div className="container relative z-10 w-full mx-auto px-5 py-24 md:py-24 flex flex-col items-center justify-center min-h-dvh">
        <div className="w-full max-w-5xl flex flex-col items-center text-center md:items-start md:text-left gap-8 md:gap-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium">
               <TrendingUp size={16} className="text-blue-600" />
               <span>#1 Job Portal in India</span>
            </div>
            
            {/* Heading and Description */}
            <div className="flex flex-col gap-5 w-full max-w-4xl">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] text-black dark:text-white tracking-tight">
                    Find Your Dream Job at <span className="text-red-500">Ez<span className="bg-linear-to-r bg-clip-text text-transparent from-blue-500 via-red-400 to-blue-800">Hire</span></span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl md:mx-0 mx-auto">
                    Connect with top employers and discover opportunities that match your skills and interests. Whether you are a job seeker or recruiter, we have got you covered with powerful tools and a seamless experience.
                </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-10 py-2">
                <div className="flex flex-col items-center md:items-start">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">10k+</p>
                    <p className="text-xs sm:text-sm opacity-80 font-medium">Active Jobs</p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">5k+</p>
                    <p className="text-xs sm:text-sm opacity-80 font-medium">Companies</p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">50k+</p>
                    <p className="text-xs sm:text-sm opacity-80 font-medium">Job Requests</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link href="/jobs" className="flex-1 sm:flex-none">
                     <Button size="lg" className="w-full text-base px-8 h-14 sm:h-12 gap-2 group transition-all">
                        <Search className="group-hover:scale-125 transition-all" size={18} /> Browse Jobs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> 
                     </Button>
                </Link>
                <Link href="/about" className="flex-1 sm:flex-none">
                    <Button variant="outline" size="lg" className="w-full text-base px-8 h-14 sm:h-12 gap-2">
                        <Briefcase size={18} /> Learn More
                    </Button>
                </Link>
            </div>

            {/* Features list */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-xs sm:text-sm opacity-60 font-medium">
                 <span className="flex items-center gap-1.5">✔️ Free to use</span>
                 <span className="hidden sm:inline-block">·</span>
                 <span className="flex items-center gap-1.5">✔️ Verified employers</span>
                 <span className="hidden sm:inline-block">·</span>
                 <span className="flex items-center gap-1.5">✔️ Secure platform</span>
            </div>
        </div>
    </div>
   </section>
  )
}

export default Hero
