import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { FaArrowLeft } from "react-icons/fa";
import parse from "html-react-parser";
import "@/assets/css/blog-content.css";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

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
    <main className="bg-[#020617] text-white min-h-screen pt-32 pb-24">
      {/* Reading Progress Bar (Optional, nice to have) */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        style={{ scaleX: 0 }} // We'd need useScroll for actual progress, keeping simple for now
      />

      <article className="container mx-auto px-4 max-w-3xl"> {/* Slightly tighter container */}
        
        {/* Back Button */}
        <div className="max-w-[65ch] mx-auto mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            <FaArrowLeft />
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
            {/* We could add reading time here later */}
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

        {/* Content */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="blog-content w-full"
        >
          {parse(post.content)}
        </motion.div>

      </article>
    </main>
  );
}
