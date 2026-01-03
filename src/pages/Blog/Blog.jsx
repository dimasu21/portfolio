import { useTranslation } from "react-i18next";
import { FaPen, FaClock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Blog() {
  const { t } = useTranslation();

  // Placeholder blog posts - you can replace with actual data later
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Machine Learning",
      excerpt: "An introduction to machine learning concepts and how to get started with your first ML project.",
      date: "2024-01-15",
      category: "AI/ML",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Building Modern Web Apps with React",
      excerpt: "Learn best practices for building scalable and maintainable React applications.",
      date: "2024-01-10",
      category: "Web Dev",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "UI/UX Design Principles for Developers",
      excerpt: "Essential design principles every developer should know to create better user experiences.",
      date: "2024-01-05",
      category: "Design",
      readTime: "6 min read",
    },
  ];

  return (
    <main className="bg-[#020617] text-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {t("blog.title")}
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {post.category}
                </span>
              </div>

              {/* Placeholder Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20 flex items-center justify-center">
                <FaPen className="text-6xl text-blue-500/30" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-xs" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <button className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                  {t("blog.readMore")}
                  <FaArrowRight className="text-xs" />
                </button>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.article>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            {t("blog.comingSoon")}
          </p>
        </motion.div>
      </div>
    </main>
  );
}
