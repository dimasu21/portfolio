import React, { useState, useEffect } from "react";
import { Monitor, Smartphone, Brain, Palette } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";

// Service keywords that cycle through
const serviceKeywords = ["Web", "AI", "UI/UX"];

export default function Service() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(3);

  // Auto-cycle through keywords
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % serviceKeywords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-[#04081A] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO 
        title="Services" 
        description="Services offered: Web Development, AI Solutions, and UI/UX Design."
      />
      {/* Background */}
      <GridBackground />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-full blur-[100px]" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Main Service Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/70 border border-gray-700/50 p-8 md:p-12 backdrop-blur-xl overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-700/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-14 h-14 rounded-xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center mb-6"
              >
                <Monitor className="w-7 h-7 text-gray-300" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-white mb-4"
              >
                {t("service.titleHighlight")}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm"
              >
                {t("service.subtitle")}
              </motion.p>
            </div>

            {/* Right Content - Stacked Keywords with Fade Effect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col items-end justify-center space-y-2 min-w-[150px]"
            >
              {serviceKeywords.map((keyword, index) => {
                // Calculate opacity based on distance from active
                const distance = Math.abs(index - activeIndex);
                const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : distance === 2 ? 0.15 : 0.05;
                const blur = distance === 0 ? 0 : distance === 1 ? 1 : distance === 2 ? 2 : 3;
                const scale = distance === 0 ? 1 : 0.9;

                return (
                  <motion.span
                    key={keyword}
                    animate={{
                      opacity,
                      filter: `blur(${blur}px)`,
                      scale,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-2xl md:text-3xl font-bold text-white cursor-pointer hover:opacity-100 hover:scale-100 transition-all"
                    onClick={() => setActiveIndex(index)}
                  >
                    {keyword}
                  </motion.span>
                );
              })}
            </motion.div>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"
          />
        </motion.div>

        {/* Service Detail Cards Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Monitor, title: t("service.webDev.title"), desc: t("service.webDev.description") },
            { icon: Palette, title: t("service.uiux.title"), desc: t("service.uiux.description") },
            { icon: Brain, title: t("service.ai.title"), desc: t("service.ai.description") },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300"
            >
              <item.icon className="w-8 h-8 text-gray-500 group-hover:text-gray-300 transition-colors mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
