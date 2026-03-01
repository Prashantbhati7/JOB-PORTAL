 "use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Briefcase, CrossIcon, Home, Info, LogOut, MenuIcon, User, User2Icon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
    const [isOpen,setIsOpen] = useState(false);
    const toggleOpen = ()=>{
        setIsOpen(!isOpen);
    }
    const isAuth = true;
    const logOutHandler = ()=>{
        
    }
  return (
    <nav className="z-50 sticky top-0 bg-backgroud/80 border-b backdrop-blur-md shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16 ">
            {/* Logo Left side */ }
            <div className="flex items-center">
                <Link href="/" className="flex items-center gap-1 group">
                    <div className="font-bold text-red-500 text-2xl tracking-tight">Ez<span className="bg-linear-to-r from-blue-500 via-red-400 to-blue-800 text-clip bg-clip-text text-transparent">Hire</span></div>
                </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ">
                <Link href={'/'}>
                    <Button variant="ghost" className="flex items-center font-medium cursor-pointer"> <Home size={16}></Home>Home</Button>
                </Link>
                <Link href={'/jobs'}>
                  <Button variant={"ghost"} className="flex items-center font-medium cursor-pointer"><Briefcase size={16}></Briefcase> Jobs</Button>
                </Link>
                <Link href={'/about'}>
                  <Button variant={"ghost"} className="flex items-center font-medium cursor-pointer"><Info size={16}></Info> About</Button>
                </Link>
            </div>
            {/* right side Actions */}
            <div className="hidden md:flex items-center gap-3">
                 { isAuth ? (<Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-offset-background ring-blue-500/20 cursor-pointer hover:ring-blue-500/40 transition-all">
                                {/* <AvatarImage src={} alt="avatar"></AvatarImage> */}
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400">P</AvatarFallback>
                            </Avatar>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="end">
                        <div className="px-3 py-2 border-b">
                            <p className="text-sm font-semibold">Prashant</p>
                            <p className="text-xs opacity-80 truncate">prashant@gmail.com</p>
                        </div>
                        <Link href={'/account'}>
                            <Button className="w-full justify-start gap-2" variant={"ghost"}>
                                <User2Icon size={16}></User2Icon> My Profile
                            </Button>
                        </Link>
                        <Button className="w-full justify-start gap-2 mt-1" variant={"ghost"} onClick={logOutHandler}> <LogOut size={16}/> Log Out</Button>
                    </PopoverContent>
                 </Popover>) : (<Link href={'/login'}> <Button variant={"ghost"} className="cursor-pointer font-medium text-sm"> <User size={16}></User> SignIn </Button> </Link>) }
                 <ModeToggle/>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
                <ModeToggle/>
                <Button variant={"ghost"}  className="cursor-pointer hover:bg-accent" aria-label="Toggle Menu"  onClick={toggleOpen}> {isOpen?<><X size={16}/> </>:<> <MenuIcon size={16}></MenuIcon> </>} </Button>
            </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${isOpen?"max-h-96 opacity-100":"max-h-0 opacity-0"}`}>
            <div className="px-3 py-2 space-y-1 bg-background/90 backdrop-blur-md">
                    <Link href={'/'} onClick={toggleOpen}> <Button variant={"ghost"} className="w-full justify-start gap-3 h-11 cursor-pointer font-medium text-sm"> <Home size={16}></Home>Home</Button> </Link>
                    <Link href={'/jobs'} onClick={toggleOpen}> <Button variant={"ghost"} className="w-full justify-start gap-3 h-11 cursor-pointer font-medium text-sm"> <Briefcase size={16}></Briefcase> Jobs</Button> </Link>
                    <Link href={'/about'} onClick={toggleOpen}> <Button variant={"ghost"} className="w-full justify-start gap-3 h-11 cursor-pointer font-medium text-sm"> <Info size={16}></Info> About</Button> </Link>
                    {isAuth?<>
                    <Link href={'/account'} onClick={toggleOpen}> <Button variant={"ghost"} className="w-full justify-start gap-3 h-11 cursor-pointer font-medium text-sm"> <User2Icon size={16}/> My Profile </Button> </Link>
                    <Button variant={'destructive'} onClick={()=> { logOutHandler(); toggleOpen();}} className="w-full justify-start gap-3 h-11 cursor-pointer font-medium text-sm"> <LogOut size={16}/> Log Out </Button></>:
                    <Link href={'/login'} onClick={toggleOpen}> <Button className="w-full h-11 cursor-pointer font-medium text-sm gap-3 justify-start" variant={'ghost'}><User size={16}></User> SignIn </Button> </Link>
                    }
            </div>
      </div>
    </nav>
  )
}

export default Navbar
