import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Blog() {
  const { t } = useTranslation();

  // Get current year
  const currentYear = new Date().getFullYear();

  // Blog posts - simple list with title and date
  const blogPosts = [
    {
      id: 1,
      title: "Setting Up Zsh on Windows with Cygwin",
      date: "December 29",
    },
    {
      id: 2,
      title: "Understanding How Computer Calculate Mathematical Equation",
      date: "June 17",
    },
    {
      id: 3,
      title: "Functional Programming Quick Tour",
      date: "March 30",
    },
  ];

  return (
    <main className="bg-[#020617] text-white min-h-screen pt-32 md:pt-40 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 inline">
            {t("blog.title")}
          </h1>
          <span className="text-gray-500 text-lg ml-3">
            {t("blog.tagline")}
          </span>
          
          <p className="text-gray-400 mt-6 leading-relaxed max-w-2xl">
            {t("blog.description")}
          </p>
        </motion.div>

        {/* Year Background + Posts */}
        <div className="relative">
          {/* Year in background */}
          <div className="absolute -left-4 sm:-left-8 top-0 text-[7rem] sm:text-[10rem] font-black text-gray-800/30 leading-none select-none pointer-events-none -z-0 tracking-tight">
            {currentYear}
          </div>

          {/* Blog Posts List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 pt-8 space-y-6"
          >
            {blogPosts.map((post, index) => (
              <motion.a
                key={post.id}
                href="#"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="block group"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-medium text-gray-300 group-hover:text-white transition-colors">
                    {post.title}
                  </h2>
                  <span className="text-gray-600 text-sm">
                    {post.date}
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
