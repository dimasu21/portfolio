import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { FaArrowLeft, FaArrowRight, FaTag } from "react-icons/fa";
import parse from "html-react-parser";
import BlogComments from "./BlogComments"; // Import comments
import LikeButton from "@/components/LikeButton"; // Import like button
import "@/assets/css/blog-content.css";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [post, setPost] = useState(null);
  const [paginatedContent, setPaginatedContent] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  
  const [nextPost, setNextPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPostData();
  }, [slug]);

  const fetchPostData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Current Post
      const { data: currentPost, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !currentPost) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setPost(currentPost);

      // 2. Fetch Next Post logic (remains here)
      const { data: nextData } = await supabase
        .from("blog_posts")
        .select("title, slug")
        .eq("published", true)
        .gt("created_at", currentPost.created_at)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      setNextPost(nextData);

    } catch (error) {
      console.error("Error fetching post:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle pagination when post or page changes
  useEffect(() => {
    if (!post) return;

    const rawContent = post.content || "";
    const delimiterRegex = /<p[^>]*>__________PAGE_BREAK__________<\/p>/g;
    const parts = rawContent.split(delimiterRegex);
    
    setTotalPages(parts.length);

    if (currentPage > parts.length) {
       setPaginatedContent(parts[parts.length - 1]);
    } else {
       setPaginatedContent(parts[currentPage - 1]);
    }
  }, [post, currentPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  if (isLoading) {
    return (
      <main className="bg-[#020617] text-white min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-gray-500 animate-pulse">Loading...</div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="bg-[#020617] text-white min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#020617] text-white min-h-screen pt-32 pb-24 relative overflow-hidden isolate">
      <article className="container mx-auto px-4 max-w-3xl relative z-10">
        
        {/* Top Back Link */}
        <div className="max-w-[65ch] mx-auto mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            <div className="p-1 rounded-full border border-gray-700">
             <FaArrowLeft size={10} />
            </div>
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-[65ch] mx-auto mb-12 border-b border-gray-800 pb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight text-white"
          >
            {post.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-gray-500 text-sm font-mono"
          >
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          </motion.div>

          {post.excerpt && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl text-gray-400 leading-relaxed font-light"
            >
              {post.excerpt}
            </motion.p>
          )}
        </header>

        {/* Like Button */}
        <div className="max-w-[65ch] mx-auto mb-8 flex justify-end">
          <LikeButton postId={post.id} />
        </div>

        {/* Content */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="blog-content w-full mb-16"
        >
          {parse(paginatedContent)}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-16">
            {/* Prev Page */}
            {currentPage > 1 && (
              <Link 
                to={`/blog/${slug}?page=${currentPage - 1}`}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Previous
              </Link>
            )}

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <Link
                  key={p}
                  to={`/blog/${slug}?page=${p}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                    p === currentPage
                      ? "bg-gradient-to-r from-teal-400 to-blue-500 border-transparent text-white font-bold"
                      : "bg-gray-900 border-gray-800 text-gray-400 hover:text-teal-400 hover:border-teal-500/50"
                  }`}
                >
                  {p}
                </Link>
              );
            })}

            {/* Next Page */}
            {currentPage < totalPages && (
              <Link 
                to={`/blog/${slug}?page=${currentPage + 1}`}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Next
              </Link>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="max-w-[65ch] mx-auto">
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-gray-400 text-sm font-semibold mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 text-sm hover:border-gray-600 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-800 mb-12" />

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            
            {/* Back to Blog */}
            <Link
              to="/blog"
              className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <div className="p-2 rounded-full border border-gray-800 group-hover:border-gray-600 transition-colors">
                <FaArrowLeft className="w-3 h-3" />
              </div>
              <span className="font-medium text-lg">Back to Blog</span>
            </Link>

            {/* Next Post */}
            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="group text-right max-w-[250px] sm:max-w-[300px]"
              >
                <div className="flex items-center justify-end gap-2 text-gray-500 mb-1 text-sm">
                  Next <FaArrowRight size={10} />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                  {nextPost.title}
                </h4>
              </Link>
            ) : (
              <div className="hidden sm:block"></div> /* Spacer if no next post */
            )}

          </div>

          {/* Comments Section */}
          <BlogComments postId={post.id} />

        </div>

      </article>
    </main>
  );
}
