import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Globe, CheckCircle2, AlertTriangle, Lightbulb, ScanText, FileText, Database, Code2 } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import { projectDetails } from "@/data/projectDetails";

// Import images
import netraImg from "../../assets/images/netra-preview.png";

const imageMap = {
  "/assets/images/netra-preview.png": netraImg,
};

// Map tech stack to icons (optional, or just use generic code icon)
const getTechIcon = (tech) => {
  if (tech.includes("React")) return <Code2 className="w-5 h-5" />;
  if (tech.includes("OCR")) return <ScanText className="w-5 h-5" />;
  if (tech.includes("Algorithm")) return <Database className="w-5 h-5" />; // Algorithm/Data
  return <FileText className="w-5 h-5" />;
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  // Get current language (en or id)
  const currentLang = i18n.language === "id" ? "id" : "en";

  const project = projectDetails.find((p) => p.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-2 bg-teal-600 rounded-lg hover:bg-teal-700 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const content = project.content[currentLang];
  const getImage = (path) => imageMap[path] || path;

  return (
    <main className="min-h-screen bg-[#04081A] text-white overflow-hidden relative">
      <SEO
        title={content.title}
        description={content.subtitle}
      />
      
      {/* Background */}
      <GridBackground />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/projects")}
          className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Projects</span>
        </button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium tracking-wide text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <ScanText className="w-4 h-4" />
            {project.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight max-w-4xl mx-auto">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <Globe className="w-5 h-5" />
                Visit Live Site
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#1e293b]/50 border border-gray-700 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                Source Code
              </a>
            )}
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl relative group max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#04081A] via-transparent to-transparent opacity-20 z-10" />
          <img
            src={getImage(project.images.hero)}
            alt={content.title}
            className="w-full object-cover"
          />
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Overview */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-400" />
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg bg-[#0f172a]/30 p-8 rounded-2xl border border-gray-800/50">
                {content.overview}
              </p>
            </section>

            {/* Challenges & Solutions Grid */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-gray-400" />
                Process & Engineering
              </h3>
              
              <div className="space-y-8">
                {content.challenges.map((challenge, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-gray-800">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-800 border-2 border-[#04081A]" />
                    
                    <div className="mb-6">
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-200 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500/80" />
                        Challenge: {challenge.title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">{challenge.description}</p>
                    </div>

                    <div className="bg-[#0f172a]/40 p-5 rounded-xl border border-gray-800/50">
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-400 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Solution: {content.solutions[idx].title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">{content.solutions[idx].description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Tech Stack - Service Detail Style */}
            <div className="bg-[#0f172a]/30 p-6 rounded-3xl border border-gray-800/50 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-gray-400" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1e293b]/50 text-gray-300 text-sm rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                  >
                    {getTechIcon(tech)}
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features - Service Detail Style */}
            <div className="bg-[#0f172a]/30 p-6 rounded-3xl border border-gray-800/50 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ScanText className="w-5 h-5 text-gray-400" />
                Key Features
              </h3>
              <ul className="space-y-4">
                {content.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-teal-400 transition-colors" />
                    <span className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Meta */}
            <div className="bg-[#0f172a]/30 p-6 rounded-3xl border border-gray-800/50 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-400" />
                Metadata
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
                  <span className="text-gray-500">Year</span>
                  <span className="text-white font-medium">{project.date}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
                  <span className="text-gray-500">Category</span>
                  <span className="text-white font-medium">Web App</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;
