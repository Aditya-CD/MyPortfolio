import { personalData } from "@/utils/data/personal-data";
import HomePageClient from "./components/client-wrappers/HomePageClient"; // 👈 New import

// You can safely remove all imports for HeroSection, Education, and Experience from here.

async function getData() {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`)

    if (!res.ok) {
        console.error('Failed to fetch blog data:', res.status, res.statusText);
        throw new Error('Failed to fetch data'); 
    }

    const data = await res.json();
    const filtered = data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);
    return filtered;
};

export default async function Home() {
    let blogs = [];
    try {
        blogs = await getData();
    } catch (error) {
        console.error("Error loading blogs for Home page:", error.message);
    }

    return (
        <div suppressHydrationWarning >
            {/* 💡 The client-safe components are rendered inside the wrapper */}
            <HomePageClient blogs={blogs} />
        </div>
    )
};