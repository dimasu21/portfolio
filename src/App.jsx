import React, { useState, useEffect, Suspense, lazy } from "react";
import "./assets/css/index.css";
import Header from "./pages/Header/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Lazy load pages for code splitting (reduces initial bundle size)
const Hero = lazy(() => import("./pages/Hero/Hero"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const BlogPost = lazy(() => import("./pages/Blog/BlogPost"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin/BlogAdmin"));
const Skills = lazy(() => import("./pages/Skills/Skills"));
const Experience = lazy(() => import("./pages/Experience/Experience"));
const Certificate = lazy(() => import("./pages/Certificate/Certificate"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Service = lazy(() => import("./pages/Service/Service"));
const Guestbook = lazy(() => import("./pages/Guestbook/Guestbook"));
const PrivacyPage = lazy(() => import("./pages/Legal/PrivacyPage"));
const Disclaimer = lazy(() => import("./pages/Legal/Disclaimer"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#020617] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-400 text-sm">Loading...</span>
    </div>
  </div>
);

export default function App() {
  const [isOnePage, setIsOnePage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent flickering by waiting for initial render to complete
  useEffect(() => {
    // Small delay to ensure scroll position is set before showing content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <div 
          className={`min-h-screen bg-[#020617] transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
        {/* <CursorTrail /> */}
        <Header />
        <Suspense fallback={<PageLoader />}>
          {isOnePage ? (
            <>
              <Hero />
              <Skills />
              <Experience />
              <Certificate />
              <Contact />
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/blog" element={<BlogAdmin />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/service" element={<Service />} />
              <Route path="/guestbook" element={<Guestbook />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
            </Routes>
          )}
        </Suspense>
        <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
