import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp, Facebook, Instagram } from "lucide-react";
import { FaKey } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/dimasu21",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/dimas-tri-mulyo-1283a5392/",
      icon: Linkedin,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1AYB9D9fPp/",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/dimasu_tm?igsh=MXF2dWNubTF4N205Mw==",
      icon: Instagram,
    },
    {
      name: "Email",
      href: "mailto:dimsartz021@gmail.com",
      icon: Mail,
    },
  ];

  const navLinks = [
    { name: t("nav.skills"), href: "/skills" },
    { name: t("nav.experience"), href: "/experience" },
    { name: t("nav.projects"), href: "/projects" },
    { name: t("nav.certificate"), href: "/certificate" },
    { name: t("nav.guestbook"), href: "/guestbook" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="bg-[#04081A] text-white py-12 md:py-16 relative z-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Gradient Divider - At Top */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent mb-8"></div>

        {/* Social Icons - Circular Style with Glow Effect */}
        <div className="flex gap-4 mb-8">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target={social.name !== "Email" ? "_blank" : undefined}
              rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-400 hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-300"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.name}
            >
              <social.icon size={18} />
            </motion.a>
          ))}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-start gap-x-2 gap-y-3 mb-8">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.name}>
            <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-xs md:text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300 uppercase tracking-wider cursor-pointer"
              >
                {link.name}
              </a>
              {index < navLinks.length - 1 && (
                <span className="text-gray-700">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Copyright - Stacked on mobile */}
        <div className="flex flex-col gap-4 mb-6">
          <p className="text-xs text-gray-500">
            © 2021 - Present Dimas Tri M. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-teal-400 transition-colors">{t("footer.privacy")}</Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-teal-400 transition-colors">{t("footer.disclaimer")}</Link>
            <Link to="/admin/blog" className="ml-2 inline-flex items-center text-gray-600 hover:text-teal-400 transition-colors" aria-label="Admin Access">
              <FaKey size={12} />
            </Link>
          </div>
        </div>
        
        {/* Protection Badges */}
        <div className="flex items-center gap-4">
          {/* Creative Commons Badge */}
          <a 
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 transition-colors"
            title="Creative Commons BY-NC-SA 4.0"
          >
            <img 
              src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" 
              alt="Creative Commons License" 
              className="h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
          </a>
          
          {/* DMCA Protected Badge */}
          <a 
            href="https://www.dmca.com/Protection/Status.aspx?ID=f8498327-bc27-4b80-9f4b-0ec1a84c96aa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 transition-colors"
            title="DMCA.com Protection Status"
          >
            <img 
              src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-09.png?ID=f8498327-bc27-4b80-9f4b-0ec1a84c96aa" 
              alt="DMCA.com Protection Status" 
              className="h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;
