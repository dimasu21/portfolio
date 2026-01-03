import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

export default function Blog() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current year
  const currentYear = new Date().getFullYear();

  // Fetch published posts from Supabase
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

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
          {/* Year in background - outline only */}
          <div 
            className="absolute -left-4 sm:-left-8 top-0 text-[7rem] sm:text-[10rem] font-black leading-none select-none pointer-events-none -z-0 tracking-tight"
            style={{
              WebkitTextStroke: '1px rgba(75, 85, 99, 0.4)',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {currentYear}
          </div>

          {/* Blog Posts List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 pt-8 space-y-6"
          >
            {isLoading ? (
              <div className="text-gray-500 py-8">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-gray-500 py-8">
                {t("blog.comingSoon")}
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="block group"
                >
                  <Link to={`/blog/${post.slug}`} className="flex items-baseline gap-3 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-300 group-hover:text-white transition-colors">
                      {post.title}
                    </h2>
                    <span className="text-gray-600 text-sm">
                      {formatDate(post.created_at)}
                    </span>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
