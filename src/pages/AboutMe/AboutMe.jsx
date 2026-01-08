import React, { useState, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useTheme } from "@/context/ThemeContext";

// Lazy load Spline to improve performance
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const AboutMe = () => {
  const { t } = useTranslation();
  // Lock mobile state on mount
  const [isMobile] = useState(() => window.innerWidth <= 768);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mountId] = useState(() => Date.now()); // Unique key per visit to force reset
  
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Choose Spline scene
  const splineScene = isMobile 
    ? "/models/about-me-mobile.spline" 
    : "/models/about-me-desktop.spline";

  const handleSplineLoad = (splineApp) => {
    // Small delay to ensure scene is actually ready to render frame
    setTimeout(() => {
        setIsLoaded(true);
    }, isMobile ? 500 : 100);
  };

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

      {/* Spline Design - Fixed Height on Mobile */}
      <div 
        className={`w-full relative z-10 ${isMobile ? 'h-[600px] min-h-[60vh]' : 'h-[85vh]'}`}
      >
          {/* Loading Overlay - Matches Skills Page Logic */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 gap-2 z-20">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-sm">Loading 3D Scene...</span>
            </div>
          )}

          <React.Suspense fallback={null}>
            <Spline 
              key={mountId} /* Force completely fresh instance on every visit */
              scene={splineScene} 
              className={`w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleSplineLoad}
            />
          </React.Suspense>
      </div>
    </div>
  );
};

export default AboutMe;
