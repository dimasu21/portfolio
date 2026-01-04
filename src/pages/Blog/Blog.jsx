import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

export default function Blog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  // Keyboard shortcut: Ctrl+Shift+B to go to admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "B") {
        e.preventDefault();
        navigate("/admin/blog");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

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
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="bg-[#020617] text-white min-h-screen pt-32 md:pt-40 pb-16 border-0">
      <SEO 
        title="Blog" 
        description="Thoughts, tutorials, and insights on AI Engineering and Web Development."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 inline gradient-text">
            {t("blog.title")}
          </h1>
          <span className="text-gray-500 text-lg ml-3">
            {t("blog.tagline")}
          </span>
          
          <p className="text-gray-400 mt-6 leading-relaxed max-w-2xl">
            {t("blog.description")}
          </p>
          
          {/* Saweria Support Button - Neobrutalism Style */}
          <a
            href="https://saweria.co/dimasu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-6 px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded border border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
          >
            Support Me
          </a>
        </motion.div>

        {/* Year Background + Posts */}
        <div className="relative">


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
              <>
                {currentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="block group"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-200 group-hover:text-white transition-colors mb-1">
                        {post.title}
                      </h2>
                      <span className="text-gray-500 text-sm">
                        {formatDate(post.created_at)}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* Pagination Controls */}
                {posts.length > postsPerPage && (
                  <div className="flex items-center justify-between pt-12 border-t border-gray-800 mt-12">
                     <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                          currentPage === 1 
                            ? "invisible" 
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>

                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {Math.ceil(posts.length / postsPerPage)}
                      </span>

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                           currentPage === Math.ceil(posts.length / postsPerPage)
                            ? "invisible" 
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
