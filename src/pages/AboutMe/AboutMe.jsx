import React from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import StarsBackground from "@/components/StarsBackground";

// Lazy load Spline to improve performance
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const AboutMe = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      <SEO 
        title="About Me" 
        description="Learn more about my journey and passion for technology."
      />

      {/* Background - Consistent with other pages */}
      <div className="fixed inset-0 z-0">
         <StarsBackground />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
             {t("nav.aboutMe")}
          </h2>
        </div>

        {/* Spline Design */}
        <div className="w-full h-[600px] flex items-center justify-center relative">
           <React.Suspense fallback={
             <div className="flex items-center justify-center text-gray-500 gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Loading 3D Scene...
             </div>
           }>
              <Spline scene="/models/about-me.spline" className="w-full h-full" />
           </React.Suspense>
        </div>

      </div>
    </div>
  );
};

export default AboutMe;
