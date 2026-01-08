import React, { useState, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "@/context/ThemeContext";

// Lazy load Spline to improve performance
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const AboutMe = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Force scroll to top BEFORE paint using useLayoutEffect
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Delay Spline loading significantly on mobile to prevent crash and scroll issues
  useEffect(() => {
    const delay = isMobile ? 1500 : 300; // Much longer delay on mobile
    const timer = setTimeout(() => {
      setShouldLoadSpline(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Choose Spline scene based on device
  const splineScene = isMobile 
    ? "/models/about-me-mobile.spline" 
    : "/models/about-me-desktop.spline";

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-x-hidden">
      <SEO 
        title="About Me" 
        description="Learn more about my journey and passion for technology."
      />

      {/* Background now handled globally in App.jsx */}

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header - Gradient like Skills page */}
        <div className="text-center mb-8">
          <h2 
            className="text-5xl md:text-7xl font-bold tracking-tight font-league-spartan"
            style={{ 
              color: isDarkMode ? 'transparent' : '#111314',
              backgroundImage: isDarkMode ? 'linear-gradient(to right, white, #6b7280)' : 'none',
              backgroundClip: isDarkMode ? 'text' : 'border-box',
              WebkitBackgroundClip: isDarkMode ? 'text' : 'border-box'
            }}
          >
             {t("nav.aboutMe")}
          </h2>
        </div>

      </div>

      {/* Spline Design - Fixed height, touch-none to prevent scroll interference */}
      <div 
        className={`w-full relative z-10 touch-none ${isMobile ? 'h-[70vh]' : 'h-[85vh]'}`}
        style={{ touchAction: 'none', overflow: 'hidden' }}
      >
          {shouldLoadSpline ? (
            <React.Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-gray-500 gap-2">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Loading 3D Scene...</span>
              </div>
            }>
              <Spline 
                scene={splineScene} 
                className="w-full h-full"
                style={{ touchAction: 'none' }}
              />
            </React.Suspense>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-sm">Preparing 3D Experience...</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default AboutMe;
