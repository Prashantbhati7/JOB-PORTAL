import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
const page = () => {
return (
<div className="min-h-screen">
{/* Mission Section */}
<section className="container mx-auto px-4 py-12 md:py-16">
<div className="max-w-4xl mx-auto">
{/* Image */}
<div className="flex justify-center mb-8">
<img src="/about.jpg" className="w-full max-w-[500px] rounded-2xl shadow-lg" alt="About HireHeaven"
/>
</div>
{/* Content */}
<div className="text-center space-y-6">
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
Our Mission At <span className="text-red-500">Ez</span>
<span className="bg-linear-to-r from-blue-500 via-red-400 to-blue-800 text-clip bg-clip-text text-transparent">Hire</span>
</h1>
<p
className="text-lg md:text-xl leading-relaxed opacity-90 max-w-3xl mx-auto"
>
At HireHaven, we&apos;re dedicated to revolutionizing the job search
experience. Our mission is to create meaningful connections
between talented individuals and forward-thinking companies,
fostering growth and success for both.
</p>
</div>
</div>
</section>
{/* CTA Section */}
<section className="py-16  md:py-20 bg-linear-to-b  via-blue-300 dark:via-blue-800">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center space-y-6">
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
Ready to find your dream job?
</h2>

<p className="text-lg md:text-xl opacity-80">
Join thousands of successful job seekers on HireHeaven
</p>
<div className="pt-4">
<Link href="/jobs">
<Button size="lg" className="gap-2 h-12 px-8 text-base">
Get Started
<ArrowRight size={18} />
</Button>
</Link>
</div>
</div>
</div>
</section>
</div>
);
};
export default page;