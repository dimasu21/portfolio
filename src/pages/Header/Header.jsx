import React, { useState, useEffect, useRef } from "react";
import {
  FaCoffee,
  FaLaptopCode,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaEnvelope,
  FaBars,
  FaConciergeBell,
  FaComments,
  FaChevronDown,
  FaLayerGroup,
  FaPen,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeLink, setActiveLink] = useState(() => {
    const path = location.pathname.substring(1) || "home";
    return path;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Main nav links (shown directly in navbar)
  const mainNavLinks = [
    { id: "home", icon: FaCoffee, textKey: "nav.home", path: "/" },
    { id: "blog", icon: FaPen, textKey: "nav.blog", path: "/blog" },
    { id: "projects", icon: FaLaptopCode, textKey: "nav.projects", path: "/projects" },
  ];

  // Dropdown links (Skills, About Me, Certificate, Guestbook, Contact)
  const dropdownLinks = [
    { id: "skills", icon: FaCode, textKey: "nav.skills", path: "/skills" },
    { id: "about", icon: FaUser, textKey: "nav.aboutMe", path: "/about" },
    { id: "certificate", icon: FaGraduationCap, textKey: "nav.certificate", path: "/certificate" },
    { id: "guestbook", icon: FaComments, textKey: "nav.guestbook", path: "/guestbook" },
    { id: "contact", icon: FaEnvelope, textKey: "nav.contact", path: "/contact" },
  ];

  // All links for mobile menu
  const allNavLinks = [
    { id: "home", icon: FaCoffee, textKey: "nav.home", path: "/" },
    { id: "blog", icon: FaPen, textKey: "nav.blog", path: "/blog" },
    { id: "skills", icon: FaCode, textKey: "nav.skills", path: "/skills" },
    { id: "about", icon: FaUser, textKey: "nav.aboutMe", path: "/about" },
    { id: "certificate", icon: FaGraduationCap, textKey: "nav.certificate", path: "/certificate" },
    { id: "projects", icon: FaLaptopCode, textKey: "nav.projects", path: "/projects" },
    { id: "guestbook", icon: FaComments, textKey: "nav.guestbook", path: "/guestbook" },
    { id: "contact", icon: FaEnvelope, textKey: "nav.contact", path: "/contact" },
  ];

  // Check if any dropdown link is active
  const isDropdownActive = dropdownLinks.some(link => link.id === activeLink);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Full-width navbar container - Solid on mobile, blur on desktop */}
      <nav className="w-full bg-theme-bg border-b border-gray-700 md:border-none md:bg-theme-secondary/90 md:backdrop-blur-md px-4 md:px-8 py-2.5">
        <div className="w-full flex items-center justify-between">
          {/* Left Side: Home/Logo */}
          <Link
            to="/"
            onClick={() => setActiveLink("home")}
            className={`flex items-center gap-2 text-sm font-medium
              transition-all duration-300
              ${activeLink === "home"
                ? "text-white"
                : "text-gray-300 hover:text-white"
              }
            `}
          >
            <FaCoffee className={`text-base ${activeLink === "home" ? "scale-110" : ""}`} />
            <span className="hidden sm:inline">{t("nav.home")}</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              <FaBars />
            </button>
          </div>

          {/* Desktop Right Side: More, Blog, Projects, Theme, Lang */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-300 flex items-center gap-2
                  hover:bg-white/10 
                  ${isDropdownActive
                    ? "bg-white/15 text-white"
                    : "text-gray-300 hover:text-white"
                  }
                `}
              >
                <FaLayerGroup className="text-base" />
                <span>More</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-theme-card rounded-none border-2 border-[#eff1f5] shadow-[4px_4px_0px_0px_rgba(239,241,245,1)]">
                  {dropdownLinks.map(({ id, icon: Icon, textKey, path }) => (
                    <Link
                      key={id}
                      to={path}
                      onClick={() => {
                        setActiveLink(id);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm font-medium
                        transition-all duration-300 flex items-center gap-3
                        hover:bg-[#eff1f5]/10 
                        ${activeLink === id
                          ? "bg-[#eff1f5]/10 text-white"
                          : "text-gray-300 hover:text-white"
                        }
                      `}
                    >
                      <Icon className={`text-base ${activeLink === id ? "text-white" : ""}`} />
                      <span>{t(textKey)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Link */}
            <Link
              to="/blog"
              onClick={() => setActiveLink("blog")}
              className={`px-2 py-1.5 text-sm font-medium
                transition-all duration-300 flex items-center gap-2
                ${activeLink === "blog"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
                }
              `}
            >
              <span>{t("nav.blog")}</span>
            </Link>

            {/* Projects Link */}
            <Link
              to="/projects"
              onClick={() => setActiveLink("projects")}
              className={`px-2 py-1.5 text-sm font-medium
                transition-all duration-300 flex items-center gap-2
                ${activeLink === "projects"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
                }
              `}
            >
              <span>{t("nav.projects")}</span>
            </Link>
            
            {/* Icons: Theme & Language */}
            <div className="flex items-center gap-1 ml-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden mt-4 max-w-7xl mx-auto`}>
          <div className="flex flex-col gap-2 py-2">
            {allNavLinks.map(({ id, icon: Icon, textKey, path }) => (
              <Link
                key={id}
                to={path}
                onClick={() => {
                  setActiveLink(id);
                  setIsMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 flex items-center gap-2
                  hover:bg-white/10 
                  ${activeLink === id
                    ? "bg-white/15 text-white"
                    : "text-gray-300 hover:text-white"
                  }
                `}
              >
                <Icon className={`text-base ${activeLink === id ? "scale-110" : ""}`} />
                <span className="inline">{t(textKey)}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s linear infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </header>
  );
}
