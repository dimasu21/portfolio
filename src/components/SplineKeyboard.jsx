import React, { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSounds } from "../hooks/useSounds";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { SKILLS } from "../data/skills";
import { getKeyboardState } from "../config/keyboardConfig";
import { useTheme } from "../context/ThemeContext";

import { useTranslation } from "react-i18next";

// Lazy load Spline
const Spline = React.lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

// Helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SplineKeyboard = () => {
  const [splineApp, setSplineApp] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  // Custom hooks
  const { t } = useTranslation();
  const { playPressSound, playReleaseSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Refs
  const selectedSkillRef = useRef(null);
  const textContainerRef = useRef(null);

  // Handle Text Visibility & Positioning - User provided fix
  useEffect(() => {
    if (!splineApp) return;

    const activeSection = "skills"; // Component specific

    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    // --- BAGIAN BARU: Override Posisi Mobile & Warna ---
    const overrideColor = (obj, color) => {
      if (obj) {
        // Try multiple properties as Spline runtime can vary
        if (obj.color !== undefined) obj.color = color;
        if (obj.material && obj.material.color) obj.material.color = color; 
      }
    };

    // Force Dark Color for Light Mode texts (override gradient)
    overrideColor(textDesktopLight, '#111314');
    overrideColor(textMobileLight, '#111314');

    if (isMobile) {
      // Atur angka ini untuk menggeser teks
      const mobileX = 0;    // 0 = Tengah secara horizontal
      const mobileY = 450;  // Semakin besar angka, semakin ke ATAS. Coba 350 - 500.
      
      // Terapkan ke object teks
      textMobileLight.position.x = mobileX;
      textMobileLight.position.y = mobileY;
      // textMobileLight.rotation.x = 0; // Uncomment jika ingin meratakan rotasi
      textMobileDark.position.x = mobileX;
      textMobileDark.position.y = mobileY;
      // textMobileDark.rotation.x = 0; // Uncomment jika ingin meratakan rotasi
    }
    // ------------------------------------------

    const setVisibility = (
      dDark,
      dLight,
      mDark,
      mLight
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills") {
      setVisibility(false, false, false, false);
    } else if (theme === "dark") {
      isMobile
        ? setVisibility(false, false, false, true)
        : setVisibility(false, true, false, false);
    } else {
      isMobile
        ? setVisibility(false, false, true, false)
        : setVisibility(true, false, false, false);
    }
  }, [theme, splineApp, isMobile]);

  // Update transformation based on screen size
  useEffect(() => {
    const updateTransform = async () => {
      if (!splineApp) return;
      const kbd = splineApp.findObjectByName("keyboard");
      if (!kbd) return;

      const state = getKeyboardState({ section: "skills", isMobile });
      
      gsap.to(kbd.scale, { ...state.scale, duration: 1, ease: "power2.out" });
      gsap.to(kbd.position, { ...state.position, duration: 1, ease: "power2.out" });
      gsap.to(kbd.rotation, { ...state.rotation, duration: 1, ease: "power2.out" });
    };

    updateTransform();
    window.addEventListener("resize", updateTransform);
    return () => window.removeEventListener("resize", updateTransform);
  }, [splineApp, isMobile]);

  // Idle Animation Loop (Floating Effect for BOTH Keyboard and Text)
  useEffect(() => {
    if (!splineApp || !isLoaded || isMobile) return;
    
    const timer = setTimeout(() => {
        const kbd = splineApp.findObjectByName("keyboard");
        if (!kbd) return;

        // 1. Float Keyboard 3D (Y-axis)
        const floatTweenKbd = gsap.to(kbd.position, {
          y: "+=15",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        
        // 2. Float Text Overlay 2D to match rhythm
        let floatTweenText;
        if (textContainerRef.current) {
            floatTweenText = gsap.to(textContainerRef.current, {
                y: 15, // Float up/down same pixels roughly matched to 3D unit
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        // Gentle rotation
        const rotateTween = gsap.to(kbd.rotation, {
          x: "+=0.05",
          z: "-=0.05",
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        return () => {
            floatTweenKbd.kill();
            rotateTween.kill();
            if (floatTweenText) floatTweenText.kill();
        };
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [splineApp, isLoaded]);

  // Handle Spline Events
  const handleSplineLoad = (app) => {
    setSplineApp(app);
    setIsLoaded(true);

    // Initial animation: Keycaps popping up
    const animateKeycaps = async () => {
      const keycaps = Object.values(SKILLS)
        .map(skill => app.findObjectByName(skill.name))
        .filter(Boolean);
      
      keycaps.forEach((keycap, idx) => {
        gsap.fromTo(
          keycap.position,
          { y: keycap.position.y + 200 }, 
          { y: keycap.position.y, duration: 0.5, delay: idx * 0.05, ease: "bounce.out" }
        );
      });
    };
    
    setTimeout(animateKeycaps, 500);

    // Event Listeners
    const onHover = (e) => {
      const targetName = e.target.name;
      
      if (selectedSkillRef.current?.name === targetName) return;

      const skillEntry = Object.entries(SKILLS).find(([key, val]) => val.name === targetName);
      
      if (skillEntry) {
        const skill = skillEntry[1];
        if (selectedSkillRef.current) playReleaseSound();
        playPressSound();
        
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;

        // Pop Scale effect 
        const obj = app.findObjectByName(targetName);
        if (obj) {
           // PRO UPDATE: Instant snap on mobile (0 duration) to eliminate ANY delay feel
           const duration = isMobile ? 0 : 0.1;
           gsap.to(obj.scale, { x: 1.15, y: 1.15, z: 1.15, duration: duration, ease: "back.out(1.7)" });
        }
      } else {
        // Return to normal if hovering off
        if (selectedSkillRef.current) {
           playReleaseSound();
           
           const prevObj = app.findObjectByName(selectedSkillRef.current.name);
           if (prevObj) {
              const duration = isMobile ? 0 : 0.2;
              gsap.to(prevObj.scale, { x: 1, y: 1, z: 1, duration: duration, ease: "power1.out" });
           }
           setSelectedSkill(null);
           selectedSkillRef.current = null;
        }
      }
    };

    // OPTIMIZATION: Disable hover listener on mobile to save performance (raycasting overhead)
    if (!isMobile) {
      app.addEventListener("mouseHover", onHover);
    }
    
    // Add mouseDown for mobile tap response (Primary interaction for mobile)
    if (isMobile) {
      app.addEventListener("mouseDown", onHover);
    }
  };

  // Auto-cycle for mobile
  useEffect(() => {
    if (!isMobile || !isLoaded || !splineApp) return;

    const skillsArray = Object.values(SKILLS);
    let currentIndex = 0;

    const interval = setInterval(() => {
      const skill = skillsArray[currentIndex];
      setSelectedSkill(skill);

      // Visual Pop Effect
      const obj = splineApp.findObjectByName(skill.name);
      if (obj) {
        // Reset scale first to ensure clean animation
        gsap.set(obj.scale, { x: 1, y: 1, z: 1 });
        // Pop animation
        gsap.to(obj.scale, { 
          x: 1.15, 
          y: 1.15, 
          z: 1.15, 
          duration: 0.2, 
          yoyo: true, 
          repeat: 1,
          ease: "back.out(1.7)"
        });
      }

      currentIndex = (currentIndex + 1) % skillsArray.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [isMobile, isLoaded, splineApp]);

  return (
    <div className="relative w-full h-[450px] md:h-[700px] flex items-center justify-center overflow-visible touch-pan-y"> 
      {/* Added touch-none to prevent scrolling interference */}
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Loading 3D Experience...</p>
          </div>
        </div>
      )}

      {/* Spline 3D Scene */}
      <Suspense fallback={null}>
        <Spline
          className="w-full h-full"
          onLoad={handleSplineLoad}
          scene="/tech-stack6.spline"
        />
      </Suspense>



      {/* Unified Layout: Title + Description on Left with 3D tilt */}
      <div 
        ref={textContainerRef}
        className={`absolute pointer-events-none transition-opacity ease-out transform-gpu z-30
          ${selectedSkill ? 'opacity-100' : 'opacity-0'}
          ${isMobile ? 'duration-0' : 'duration-100'} 
        `}
        style={{
          top: isMobile ? '2%' : '15%',
          left: isMobile ? '5%' : '12%',
          maxWidth: isMobile ? '70%' : '380px',
          transform: isMobile 
             ? "rotateX(45deg) rotateZ(-35deg)" 
             : "rotateX(55deg) rotateZ(-45deg)",
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {selectedSkill && (
          <div className="flex flex-col gap-1">
            <h2 
              className={`font-black leading-none font-league-spartan select-none ${
                isMobile ? 'text-4xl' : 'text-5xl md:text-7xl'
              }`}
              style={{ 
                color: isDarkMode ? '#eff1f5' : '#111314', 
                textShadow: isDarkMode 
                  ? "4px 4px 0 #374151"  // Hard shadow dark
                  : "4px 4px 0 #94a3b8", // Hard shadow light
                transform: "translateZ(30px)",
              }}
            >
              {selectedSkill.label}
            </h2>
            <p 
              className={`font-bold font-league-spartan leading-snug select-none ${
                isMobile ? 'text-sm mt-2' : 'text-lg md:text-2xl mt-6'
              }`}
              style={{
                color: isDarkMode ? '#cbd5e1' : '#4b5563',
                textShadow: isDarkMode 
                  ? "2px 2px 0 #374151" 
                  : "2px 2px 0 #cbd5e1",
                transform: "translateZ(20px)", 
              }}
            >
              {t(`skillsData.${selectedSkill.name}`)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplineKeyboard;
