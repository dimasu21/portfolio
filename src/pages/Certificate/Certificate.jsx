import React, { useState } from "react";
import CertificateLoader from "@/components/ui/CertificateLoader";
import {
  Star,
  Award,
  Calendar,
  BookOpen,
  GraduationCap,
  Trophy,
  ExternalLink, // Icon link import
  ArrowUpRight, // Icon panah untuk tombol
} from "lucide-react";
import { motion } from "framer-motion";
import GridBackground from "@/components/GridBackground";
import { useTranslation } from "react-i18next";

const CertificateSection = () => {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const CertificateData = [
    {
      title: "Website Fundamentals",
      issuer: "Sololearn",
      year: "2022",
      achievements: ["Beginner"],
      skills: ["HTML", "CSS", "Javascript"],
      description:
        "Learned to build responsive and interactive web pages using modern web standards.",
      link: "https://api2.sololearn.com/v2/certificates/CT-VCUBRPE4/image/png?t=638986086283564790", // <--- Masukkan Link Drive
    },
    {
      title: "AI Engineer",
      issuer: "Dicoding Academy",
      year: "2025",
      achievements: ["Beginner Submission"],
      skills: ["Python", "Tensorflow", "Jupyter Notebook"],
      description:
        "Built, trained, and evaluated basic AI models using Python and TensorFlow frameworks.",
      link: "https://drive.google.com/file/d/1lK-_1qOr0I8tgxBZ1PJK3If7sBt1VDUD/view?usp=sharing",
    },
    {
      title: "Machine Learning Basics",
      issuer: "Dicoding Academy",
      year: "2025",
      achievements: ["Beginner Submission"],
      skills: ["Python", "Scikit-Learn", "Tensorflow", "Google Colab"],
      description:
        "Implemented foundational algorithms for classification, regression, and clustering tasks.",
      link: "https://drive.google.com/file/d/1b40DRYveeC0aAnrpnPZboCGE3FuAoGNK/view?usp=sharing",
    },
    {
      title: "Python Developer",
      issuer: "Dicoding Academy",
      year: "2025",
      achievements: ["Beginner Submission"],
      skills: ["Python", "Sqlite", "PostgreSQL"],
      description:
        "Developed logical problem-solving skills and modular code design using Python's core features.",
      link: "https://drive.google.com/file/d/1ACPdBxyv3L2si2LcqahULa2jPMP-833F/view?usp=sharing",
    },
    {
      title: "Data Science",
      issuer: "Dicoding Academy",
      year: "2025",
      achievements: ["Beginner Submission"],
      skills: ["Pandas", "NumPy", "Matplotlib"],
      description:
        "Data manipulation, cleaning, and visualization using Python libraries like Pandas and Matplotlib.",
      link: "https://drive.google.com/file/d/18aCSHd1ZP0wzL4ml8tQR4dYFDQhpgJ4d/view?usp=sharing",
    },
    {
      title: "Generative AI Fundamentals",
      issuer: "Microsoft Elevate",
      year: "2025",
      achievements: ["Beginner Submission"],
      skills: ["Azure AI Studio", "GPT-4", "Prompt Flow"],
      description:
        "Prompt engineering and model optimization using powerful LLMs on the Azure platform.",
      link: "https://drive.google.com/file/d/15GABiFI6_HYbL4n-TR-4QzIp9_syqMDO/view?usp=sharing",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="min-h-screen relative overflow-hidden py-20 bg-[#04081A]">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0">
        <GridBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04081A] via-transparent to-[#04081A]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="pt-32 text-4xl md:text-5xl font-bold gradient-text mb-6">
            {t("certificate.title")}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            {t("certificate.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {CertificateData.map((cert, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative border rounded-xl p-6 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm flex flex-col h-full group ${hoveredIndex === index
                ? "border-teal-500 scale-[1.02] shadow-lg shadow-teal-500/10"
                : "border-blue-400/20"
                }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="space-y-4 flex-grow">
                {/* Header: Icon & External Link Icon */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-gray-800 rounded-lg p-2">
                      {cert.mascot}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {cert.title}
                    </h3>
                  </div>
                  {/* Icon Link Kecil di Pojok */}
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-teal-400 transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-md text-teal-400 flex items-center gap-2 font-medium">
                    <BookOpen className="w-4 h-4" />
                    {cert.issuer}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
                    <Calendar className="w-3 h-3" />
                    {cert.year}
                  </p>
                </div>

                <p className="text-gray-400 text-sm italic border-l-2 border-teal-500 pl-3 py-1">
                  {cert.description}
                </p>

                {/* Achievements Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {cert.achievements.map((ach, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 flex items-center gap-1"
                    >
                      <Trophy className="w-3 h-3" />
                      {ach}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian Bawah: Tombol & Skills */}
              <div className="mt-6 space-y-4">
                {/* TOMBOL BARU DISINI */}
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-gray-800 hover:bg-teal-500 hover:text-white text-teal-400 py-2 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 border border-gray-700 hover:border-teal-500"
                >
                  <ExternalLink size={14} />
                  {t("certificate.viewCertificate")}
                </a>

                {/* Skills Footer */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CertificateSection;
