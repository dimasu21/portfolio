import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "id" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={i18n.language === "en" ? "Switch to Indonesian" : "Switch to English"}
    >
      <span className="text-base">🌐</span>
      <span className="uppercase font-bold">{i18n.language}</span>
    </motion.button>
  );
};

export default LanguageSwitcher;
