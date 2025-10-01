"use client"

import dynamic from 'next/dynamic';
import AboutSection from "../homepage/about";
import Skills from "../homepage/skills";
import Projects from "../homepage/projects";
import ContactSection from "../homepage/contact";

// 💡 Move the dynamic imports here where 'ssr: false' is allowed
const HeroSection = dynamic(() => import("../homepage/hero-section"), { 
    ssr: false,
    loading: () => <div className="h-[75vh] w-full flex items-center justify-center text-white">Loading HomePage...</div>
});

const Education = dynamic(() => import("../homepage/education"), { 
    ssr: false,
    loading: () => <div className="h-[50vh] w-full flex items-center justify-center text-white">Loading Education...</div>
});

const Experience = dynamic(() => import("../homepage/experience"), { 
    ssr: false,
    loading: () => <div className="h-[50vh] w-full flex items-center justify-center text-white">Loading Experience...</div>
});

// Assuming 'blogs' is passed as a prop from the server component
export default function HomePageClient({ blogs }) {
    return (
        <>
            <HeroSection />
            <AboutSection />
            {/* <Experience /> */}
            <Skills />
            <Projects />
            <Education />
            {/* <Blog blogs={blogs} /> */}
            <ContactSection />
        </>
    );
}