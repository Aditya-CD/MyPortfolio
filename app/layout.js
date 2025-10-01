import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import ScrollToTop from "./components/helper/scroll-to-top";
import Navbar from "./components/navbar";
import "./css/card.scss";
import "./css/globals.scss";

const inter = Inter({ subsets: ["latin"] });

// Load ToastContainer only on client side
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export const metadata = {
  title: "Aditya Gupta Portfolio",
  description:
    "This is the portfolio of Aditya Gupta. I am a AI/ML developer. I love to learn new things and I am always open to collaborating with others. I am a quick learner and I am always looking for new challenges.",
  icons: {
    icon: "/favicon-v2.ico"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-v2.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          <Navbar />
          {children}
          <ScrollToTop />
        </main>
        <Footer />
      </body>
      {/* Only load GTM if the ID is provided */}
      {process.env.NEXT_PUBLIC_GTM && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
      )}
    </html>
  );
}