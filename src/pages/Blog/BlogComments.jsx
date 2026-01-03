import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BlogComments = ({ postId }) => {
  const { t } = useTranslation();
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch comments and subscribe to changes
  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`blog_comments:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blog_comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert([
        {
          post_id: postId,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Anonymous",
          user_avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          content: newComment.trim(),
        },
      ]);

      if (error) throw error;
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    setDeletingId(commentId);
    try {
      const { error } = await supabase.from("blog_comments").delete().eq("id", commentId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
        if(diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return diffMins <= 1 ? "just now" : `${diffMins}m ago`;
        }
        return `${diffHours}h ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="mt-16 pt-12 border-t border-gray-800">
      <h3 className="text-2xl font-bold text-white mb-8">Comments ({comments.length})</h3>

      {/* Input Section */}
      <div className="mb-10">
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                    user.email?.charAt(0).toUpperCase()
                )}
             </div>
             <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the discussion..."
                  className="w-full px-5 py-3 bg-[#0a1628] border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
             </div>
          </form>
        ) : (
          <div className="bg-[#0a1628] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 mb-4">Sign in to join the discussion</p>
            <div className="flex justify-center gap-3">
                <button onClick={signInWithGoogle} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg text-sm font-medium transition-colors">
                    <FaGoogle /> Google
                </button>
                <button onClick={signInWithGithub} className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-medium transition-colors">
                    <FaGithub /> GitHub
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading discussion...</div>
        ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-600 italic">No comments yet. Be the first to share your thoughts!</div>
        ) : (
            <AnimatePresence>
                {comments.map((comment) => (
                    <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden">
                            {comment.user_avatar ? (
                                <img src={comment.user_avatar} alt={comment.user_name} className="w-full h-full object-cover" />
                            ) : (
                                comment.user_name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-white font-medium">{comment.user_name}</span>
                                <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                                {user && user.id === comment.user_id && (
                                    <button 
                                        onClick={() => handleDelete(comment.id)}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity p-1"
                                        title="Delete"
                                    >
                                        {deletingId === comment.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Trash2 className="w-3 h-3" />}
                                    </button>
                                )}
                            </div>
                            <div className="bg-[#111c2e] px-4 py-2 rounded-2xl rounded-tl-sm inline-block max-w-full">
                                <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default BlogComments;
