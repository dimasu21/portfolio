import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#020617] text-gray-300 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert lg:prose-xl mx-auto"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-8">
            {t("privacy.title")}
          </h1>
          
          <div className="space-y-6 text-gray-400">
            <p>{t("privacy.intro")}</p> 

            <h3 className="text-white text-xl font-semibold mt-6 mb-2">1. Data Collection</h3>
            <p>{t("privacy.dataCollection")}</p>

            <h3 className="text-white text-xl font-semibold mt-6 mb-2">2. Authentication</h3>
            <p>{t("privacy.auth")}</p>

            <h3 className="text-white text-xl font-semibold mt-6 mb-2">3. Cookies</h3>
            <p>{t("privacy.cookies")}</p>

            <h3 className="text-white text-xl font-semibold mt-6 mb-2">4. Contact</h3>
            <p>{t("privacy.contact")}</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
