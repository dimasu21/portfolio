import React, { useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Globe, CheckCircle2, AlertTriangle, Lightbulb, ScanText, FileText, Database, Code2, Layers, Cpu } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import { projectDetails } from "@/data/projectDetails";

// Import images
import netraImg from "../../assets/images/netra-preview.png";

const imageMap = {
  "/assets/images/netra-preview.png": netraImg,
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  // Get current language (en or id)
  const currentLang = i18n.language === "id" ? "id" : "en";

  const project = projectDetails.find((p) => p.id === slug);

  // Aggressive Scroll to Top on Mount
  useLayoutEffect(() => {
    // Force scroll to top immediately before paint
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Safety check needed for some browsers
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);
    
    return () => clearTimeout(timer);
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
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GridBackground />
      </div>
      
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/projects")}
          className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Projects</span>
        </button>

        {/* Clean Minimalist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Category */}
          <div className="flex items-center gap-3 mb-4 text-teal-400">
             <Layers className="w-5 h-5" />
             <span className="font-medium tracking-wide text-sm uppercase">{project.category}</span>
          </div>

          {/* Title - Clean White */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
            {content.title}
          </h1>

          {/* Subtitle - Gray */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed mb-8">
            {content.subtitle}
          </p>
          
          {/* Action Buttons - Standard Style */}
          <div className="flex flex-wrap gap-4">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/20"
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
                className="flex items-center gap-2 px-6 py-3 bg-[#1e293b] border border-gray-700 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                Source Code
              </a>
            )}
          </div>
        </motion.div>

        {/* Hero Image - Clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-[#0f172a]"
        >
          <img
            src={getImage(project.images.hero)}
            alt={content.title}
            className="w-full object-cover"
          />
        </motion.div>

        {/* Content Section - Same as before but consistent style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-500" />
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {content.overview}
              </p>
            </section>

            {/* Engineering Process */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-amber-500" />
                Engineering Process
              </h3>
              
              <div className="space-y-6">
                {content.challenges.map((challenge, idx) => (
                  <div key={idx} className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
                    <div className="mb-4">
                      <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        {challenge.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{challenge.description}</p>
                    </div>

                    <div className="relative pl-6 border-l-2 border-teal-500/20">
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-400 mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Solution
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{content.solutions[idx].description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Tech Stack */}
            <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm font-medium rounded-md border border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ScanText className="w-5 h-5 text-purple-400" />
                Key Features
              </h3>
              <ul className="space-y-3">
                {content.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
             {/* Metadata */}
            <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-400" />
                Project Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-500">Year</span>
                  <span className="text-white">2024</span>
                </div>
                 <div className="flex justify-between py-2 border-b border-gray-700/50 last:border-0">
                  <span className="text-gray-500">Category</span>
                  <span className="text-white">Web Application</span>
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
