import React, { useState } from "react";
import { FaCode, FaPaintBrush, FaBrain } from "react-icons/fa";
import GridBackground from "@/components/GridBackground";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FlipCard = ({ icon: Icon, title, description, label }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="w-full h-[450px] cursor-pointer perspective-1000 group"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, animationDirection: "normal" }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full h-full relative"
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 bg-[#0B1121] border border-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className="w-32 h-32 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-colors duration-500">
                        <Icon className="text-7xl text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-wide">
                        {title}
                    </h3>
                    <div className="w-12 h-1 bg-blue-500 rounded-full mt-4 mb-6"></div>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">
                        {label}
                    </p>
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 bg-[#0B1121] border border-blue-500/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-blue-500/10"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-teal-400 absolute top-0 left-0 rounded-t-2xl"></div>
                    <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default function Service() {
    const { t } = useTranslation();
    
    const services = [
        {
            icon: FaCode,
            title: t("service.webDev.title"),
            description: t("service.webDev.description"),
        },
        {
            icon: FaPaintBrush,
            title: t("service.uiux.title"),
            description: t("service.uiux.description"),
        },
        {
            icon: FaBrain,
            title: t("service.ai.title"),
            description: t("service.ai.description"),
        },
    ];

    return (
        <section className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
            <GridBackground />
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-20 animate__animated animate__fadeInDown">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        {t("service.title")} <span className="text-blue-400">{t("service.titleHighlight")}</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {t("service.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate__animated animate__fadeInUp animate__delay-0.5s px-4">
                    {services.map((service, index) => (
                        <FlipCard key={index} {...service} label={t("service.label")} />
                    ))}
                </div>
            </div>
        </section>
    );
}
