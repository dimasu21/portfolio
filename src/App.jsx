import React, { useState, useEffect, Suspense, lazy } from "react";
import "./assets/css/index.css";
import Header from "./pages/Header/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeProvider } from "./context/ThemeContext";
import StarsBackground from "./components/StarsBackground";
import CursorTrail from "./components/CursorTrail";
import { useMediaQuery } from "./hooks/useMediaQuery";

// Wrapper to hide stars on mobile for /about and /skills
const StarsBackgroundWrapper = ({ isMobile }) => {
  const location = useLocation();
  const hideOnMobile = isMobile && (location.pathname === "/about" || location.pathname === "/skills");
  
  if (hideOnMobile) return null;
  return <StarsBackground />;
};

import Hero from "./pages/Hero/Hero";
// Helper for lazy loading with retry (fixes "Failed to load module script" / ChunkLoadError)
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem("page-has-been-force-refreshed") || "false"
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem("page-has-been-force-refreshed", "false");
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not defined in the version, we force a refresh
        window.sessionStorage.setItem("page-has-been-force-refreshed", "true");
        window.location.reload(); 
      }
      throw error; // Let ErrorBoundary handle it if reload didn't work
    }
  });

// Lazy load pages for code splitting (reduces initial bundle size)
// const Hero = lazy(() => import("./pages/Hero/Hero"));
const Blog = lazyWithRetry(() => import("./pages/Blog/Blog"));
const BlogPost = lazyWithRetry(() => import("./pages/Blog/BlogPost"));
const BlogAdmin = lazyWithRetry(() => import("./pages/BlogAdmin/BlogAdmin"));
const Skills = lazyWithRetry(() => import("./pages/Skills/Skills"));
const AboutMe = lazyWithRetry(() => import("./pages/AboutMe/AboutMe"));
const Certificate = lazyWithRetry(() => import("./pages/Certificate/Certificate"));
const Contact = lazyWithRetry(() => import("./pages/Contact/Contact"));
const Projects = lazyWithRetry(() => import("./pages/Projects/Projects"));
const Guestbook = lazyWithRetry(() => import("./pages/Guestbook/Guestbook"));
const PrivacyPage = lazyWithRetry(() => import("./pages/Legal/PrivacyPage"));
const Disclaimer = lazyWithRetry(() => import("./pages/Legal/Disclaimer"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-theme-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
      <span className="text-theme-text-muted text-sm">Loading...</span>
    </div>
  </div>
);



export default function App() {
  const [isOnePage, setIsOnePage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <div 
            className={`min-h-screen bg-theme-bg transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
          {/* Global Space Theme Background - Hidden on mobile for /about and /skills */}
          <StarsBackgroundWrapper isMobile={isMobile} />
          {!isMobile && <CursorTrail />}
          
          <Header />
        <Suspense fallback={<PageLoader />}>
          {isOnePage ? (
            <>
              <Hero />
              <Skills />
              <AboutMe />
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
              <Route path="/about" element={<AboutMe />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/guestbook" element={<Guestbook />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
            </Routes>
          )}

        </Suspense>
        <Footer />
        </div>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
