import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import VisitCounter from "./VisitCounter";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

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
  ];

  return (
    <footer className="bg-[#0B1121] text-gray-400 py-10 md:py-16 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {/* Left Section: Copyright & Visit Counter */}
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-gray-300">
              &copy; {currentYear} Dimas Tri Mulyo. {t("footer.rights")}
            </p>
            <div className="mt-3">
              <VisitCounter />
            </div>
          </div>

          {/* Right Section: Social Icons */}
          <div className="flex gap-6 items-center">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target={social.name !== "Email" ? "_blank" : undefined}
                rel={
                  social.name !== "Email" ? "noopener noreferrer" : undefined
                }
                className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-teal-500/30"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.name}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
