import { useState, useEffect, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "@/assets/css/tomorrow.css";
import PortfolioPage from "@/pages/About/About";
import SparklesText from "@/components/ui/sparkles-text";
import { FlipWords } from "@/components/ui/flip-words";
import GitHubStats from "@/components/GitHubStats";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useMediaQuery } from "@/hooks/useMediaQuery";


export default function Hero() {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Memoize words array to prevent unnecessary re-renders and ensure proper language switch
  const words = useMemo(() => [
    t("hero.role1"),
    t("hero.role2"),
    t("hero.role3"),
    t("hero.role4"),
  ], [i18n.language, t]);

  const [code] = useState(`
const profile = {
    name: 'Dimas Tri Mulyo',
    title: 'Full-Stack Developer | AI Engineer | Problem Solver',
    skills: [
        'Python', 'Javascript', 'Tailwindcss', 'React',
        'ViteJs', 'MongoDB', 'Docker', 'Git', 'Google Colab',
    ],
    hardWorker: true,
    quickLearner: true,
    problemSolver: true,
    yearsOfExperience: 4, 
    hireable: function() {
        return (
            this.hardWorker &&
            this.problemSolver &&
            this.skills.length >= 5 &&
            this.yearsOfExperience >= 5
        );
    }
};
  `);

  useEffect(() => {
    Prism.highlightAll();

    // Add CSS animation for grid and dots
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gridPulse {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.3; }
      }
      
      @keyframes dotPulse {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 0.5; transform: scale(1.2); }
      }
      
      /* Media query for 1366x768 resolution */
      @media screen and (width: 1366px) and (height: 768px), 
             screen and (width: 1367px) and (height: 768px),
             screen and (width: 1368px) and (height: 769px) {
        .hero {
          padding-top: 12rem !important;
        }
        .hero .container {
          padding-top: 10rem !important;
          margin-top: 5rem !important;
        }
        .hero-section-padding {
          padding-top: 12rem !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Apply extra padding for 1366x768 resolution
    const checkResolution = () => {
      const isTargetResolution =
        window.innerWidth >= 1360 &&
        window.innerWidth <= 1370 &&
        window.innerHeight >= 760 &&
        window.innerHeight <= 775;

      if (isTargetResolution) {
        document.documentElement.style.setProperty(
          "--hero-padding-top",
          "12rem"
        );
      } else {
        document.documentElement.style.setProperty("--hero-padding-top", "0");
      }
    };

    checkResolution();
    window.addEventListener("resize", checkResolution);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener("resize", checkResolution);
    };
  }, [code]);

  return (
    <>
      <main className="text-white min-h-screen relative">
        {/* <GridBackground /> */}
        <SEO 
          title="Home" 
          description="Dimas Tri Mulyo - AI Engineer & Full Stack Developer Portfolio"
          keywords="dimasu, Dimas Tri M, Dimas Tri Mulyo, AI Engineer, Full Stack Developer, Portfolio"
        />
        <section
          className="hero min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-0 pt-24 md:pt-32 hero-section-padding overflow-hidden"
          style={{ paddingTop: "var(--hero-padding-top, 0)" }}
        >
          {/* Main content container */}
          <div
            className="container mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 py-8 md:py-10 lg:py-12 md:pt-28 xl:pt-28"
            style={{
              paddingTop:
                window.innerWidth >= 1360 &&
                  window.innerWidth <= 1370 &&
                  window.innerHeight >= 760 &&
                  window.innerHeight <= 775
                  ? "12rem"
                  : "",
            }}
          >
            {/* Left column - Text content */}
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0 animate__animated animate__fadeInLeft relative">



              {/* Name section */}
              <div className="relative mb-6 sm:mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                  <SparklesText text={t("hero.hello")} />
                  <span className="relative inline-block">
                    {t("hero.im")}
                    <span className="typing-effect gradient-text">
                      {" "}
                      Dimas Tri Mulyo
                    </span>
                  </span>
                </h1>
              </div>

              {/* Role badge */}
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-none bg-transparent border-2 border-black dark:border-gray-400 mb-6 sm:mb-8 animate__animated animate__fadeInUp animate__delay-1s shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(239,241,245,1)] hero-badge">
                <i className="fas fa-rocket text-white animate-bounce text-sm sm:text-base"></i>
                <span>
                  <FlipWords
                    className={"text-lg sm:text-xl text-white font-bold"}
                    words={words}
                  />
                </span>
              </div>

              {/* Description */}
              <div className="relative mb-8 sm:mb-12 max-w-xl">
                <p className="text-base sm:text-xl text-gray-300 leading-relaxed hero-description">
                  {t("hero.description")}
                  <span className="block mt-1 sm:mt-2">
                    {t("hero.subDescription")}
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate__animated animate__fadeInUp animate__delay-2s">
                {/* View Projects Button - Static on Mobile, Links on Desktop */}
                {isMobile ? (
                  <span
                    className="group relative inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-none font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#374151] border-2 border-black dark:border-white cursor-default"
                  >
                    <span className="relative flex items-center justify-center gap-2 text-sm font-bold">
                      <span>{t("hero.curious")}</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </span>
                  </span>
                ) : (
                  <a
                    href="/about"
                    className="group relative inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-none font-bold transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#374151] border-2 border-black dark:border-white"
                  >
                    <span className="relative flex items-center justify-center gap-2 text-sm font-bold">
                      <span>{t("hero.curious")}</span>
                      <i className="fas fa-arrow-right text-xs transform transition-all duration-300 group-hover:translate-x-1"></i>
                    </span>
                  </a>
                )}

                {/* Contact Button */}
                <a
                  href="https://drive.google.com/file/d/1u_X0btJUl9Iq3NvMjADS5Dw2kNCFHNWh/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center bg-transparent text-black dark:text-white px-6 py-3 rounded-none font-bold transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#374151] border-2 border-black dark:border-white"
                >
                  <span className="relative flex items-center justify-center gap-2 text-sm font-bold">
                    <span>{t("hero.hireMe")}</span>
                    <i className="fas fa-envelope text-xs transform transition-all duration-300 group-hover:rotate-12"></i>
                  </span>
                </a>
              </div>
            </div>

            {/* Right column - Code window (hidden on mobile) */}
            <div className="hidden lg:block w-full lg:w-1/2 animate__animated animate__fadeInDown animate__delay-0.1s">
              <div className="rounded-xl overflow-hidden border border-gray-700/50">
                <div className="code-window bg-[#0d1117]">
                  <div className="window-header">
                    <div className="window-dot bg-red-500"></div>
                    <div className="window-dot bg-yellow-500"></div>
                    <div className="window-dot bg-green-500"></div>

                  </div>
                  <pre className="language-javascript">
                    <code className="language-javascript">{code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
          {/* Scroll indicator - Moved inside section */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <i className="fas fa-mouse text-white"></i>
              {t("hero.aboutMe")}
            </span>
            <i className="fas fa-chevron-down text-white text-xl"></i>
          </div>
        </div>
      </section>
        <PortfolioPage />
        {/* <GitHubStats username="dimasu21" /> */}
      </main>
    </>
  );
}
