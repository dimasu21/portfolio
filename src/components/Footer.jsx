import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import VisitCounter from "./VisitCounter";

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
      name: "Whatsapp",
      href: "https://wa.me/qr/CMB7MS5HTX2VB1",
      icon: BsWhatsapp,
    },
    {
      name: "Email",
      href: "mailto:dimastry21@gmail.com",
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
        {/* Logo/Name Section - Gradient Text */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-teal-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            dimasu.dev
          </h2>
        </div>

        {/* Social Icons - Circular Style with Glow Effect */}
        <div className="flex gap-4 mb-10">
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

        {/* Gradient Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent my-8"></div>

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

        {/* Visit Counter */}
        <div className="mb-6">
          <VisitCounter />
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © 2021 - Present Dimas Tri M. {t("footer.rights")}
          <span className="mx-2">|</span>
          <Link to="/privacy" className="hover:text-teal-400 transition-colors">{t("footer.privacy")}</Link>
          <span className="mx-2">•</span>
          <Link to="/disclaimer" className="hover:text-teal-400 transition-colors">{t("footer.disclaimer")}</Link>
          <Link to="/admin/blog" className="ml-3 inline-flex items-center text-gray-600 hover:text-teal-400 transition-colors" aria-label="Admin Access">
            <FaKey size={12} />
          </Link>
        </p>
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
