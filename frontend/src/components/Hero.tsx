import { ArrowRight, Briefcase, Search, TrendingUp } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"


const Hero = () => {
  return (
   <section className="relative  overflow-hidden bg-secondary  min-h-screen ">
        <div className="absolute inset-0 opacity-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl "></div>
            <div className="absolute  bottom-20 right-10 w-96 h-96 rounded-full blur-3xl "></div>
        </div>
        <div className="container mx-auto px-5 py-16 md:py-24 relative">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16 "> 
                <div className="flex-1 flex  flex-col  items-center text-center md:text-left space-y-6 md:items-start">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm">
                       <TrendingUp size={16} className="text-blue-600"></TrendingUp>
                       <span className="text-sm font-medium">#1 Job Portal in India</span>
                    </div>
                    <h1 className="text-4xl text-black dark:text-white md:text-5xl lg:text-6xl font-bold e leading-tight">
                        Find Your Dream Job at <span className="text-red-500">Ez<span className="bg-linear-to-r bg-clip-text text-transparent from-blue-500 via-red-400 to-blue-800">Hire</span> </span>
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl "> Connect with top employers and discover opportunities that match your skills and interests. wheather you are job seeker or recruiter, we have got you covered with powerful tools and seamless experience.</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-8 py-4 ">
                        <div className="text-center md:text-left">
                            <p className="text-3xl font-bold text-blue-600">10k+</p>
                            <p className="text-sm opacity-80">Active Jobs</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-3xl font-bold text-blue-600">5k+</p>
                            <p className="text-sm opacity-80">Companies</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-3xl font-bold text-blue-600">50k+</p>
                            <p className="text-sm opacity-80">Job Requests</p>
                        </div>
                    </div>

                    <div className=" flex flex-col sm:flex-row items-center gap-4 pt-2" >
                        <Link href="/jobs">
                             <Button size={'lg'} className="text-base  cursor-pointer px-8 h-12 gap-2 group transition-all ">
                                <Search className="group-hover:scale-150 transition-all" size={18}></Search> Browse Jobs <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/> 
                             </Button>
                        </Link>
                        <Link href={'/about'}>
                            <Button variant={'outline'} size={'lg'} className="text-base px-8 h-12 gap-2">
                                <Briefcase></Briefcase> Learn More
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-60 pt-4">
                         <span> ✔️ Free to use </span>
                         <span>· </span>
                         <span> ✔️ Verified employers </span>
                         <span>· </span>
                         <span> ✔️ Secure platform </span>
                         <span>· </span>
                     </div>
                </div>
                <div className="flex-1 relative  ">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-blue-400 opacity-20 blur-xl group-hover:opactiy-30 transition-opacity"> </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background ">
                            <img src={'https://thumbs.dreamstime.com/b/concept-people-fill-out-form-application-employment-select-resume-job-web-page-presentation-social-media-documents-127398056.jpg'} className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-110" alt="hero image"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </section>
  )
}

export default Hero
