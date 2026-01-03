import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, Loader2, Trash2, Shield, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { FaGoogle, FaGithub } from "react-icons/fa";
import GridBackground from "@/components/GridBackground";

// Secret admin key
const ADMIN_SECRET = "dimasu";

const Guestbook = () => {
  const { t } = useTranslation();
  const { user, signInWithGoogle, signInWithGithub, signOut, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Check for admin mode in localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("guestbook_admin");
    if (storedAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Keyboard shortcut: Ctrl+Shift+A to open admin modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setShowAdminModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel("guestbook_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guestbook",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch all messages from Supabase
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Fetch messages and add minimum 2 second delay to show loading animation
      const [result] = await Promise.all([
        supabase
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false }),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 second minimum
      ]);

      const { data, error } = result;
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display - relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("guestbook").insert([
        {
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Anonymous",
          message: newMessage.trim(),
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminInput === ADMIN_SECRET) {
      setIsAdmin(true);
      localStorage.setItem("guestbook_admin", "true");
      setShowAdminModal(false);
      setAdminInput("");
    } else {
      alert("Wrong secret key!");
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("guestbook_admin");
  };

  // Handle delete message
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("guestbook").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    } finally {
      setDeletingId(null);
    }
  };

  // Get user display name
  const getUserName = () => {
    if (!user) return "";
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  };

  return (
    <section className="min-h-screen relative overflow-hidden py-20 bg-[#04081A]">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0">
        <GridBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04081A] via-transparent to-[#04081A]" />
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a1628] border border-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              Admin Access
            </h3>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                placeholder="Enter secret key..."
                className="w-full px-4 py-3 bg-[#0d1f35] border border-gray-700 rounded-xl text-white mb-4 focus:outline-none focus:border-teal-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 text-white py-2 rounded-xl font-semibold hover:bg-teal-600 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 pt-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t("guestbook.title")}
          </h2>
          <p className="text-gray-400">
            {t("guestbook.subtitle")}
          </p>
          
          {/* Admin indicator */}
          {isAdmin && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-full">
              <Shield className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">Admin Mode</span>
              <button
                onClick={handleAdminLogout}
                className="ml-2 text-xs text-gray-400 hover:text-white underline"
              >
                Logout
              </button>
            </div>
          )}

          {/* Logged in user indicator */}
          {user && (
            <div className="mt-4 flex items-center gap-3">
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()}
                  alt={getUserName()}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {getUserName().charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-gray-300 text-sm">{t("guestbook.signedInAs")} <span className="text-white font-medium">{getUserName()}</span></span>
              <button
                onClick={signOut}
                className="ml-auto flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t("guestbook.signOut")}
              </button>
            </div>
          )}
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 mb-8"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#0a1628] rounded-2xl border border-gray-800">
              {/* Cute Loading Icon - Octocat style */}
              <div className="mb-4 text-gray-500">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="animate-bounce">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c.79 0 1.5-.71 1.5-1.5S8.79 9 8 9s-1.5.71-1.5 1.5S7.21 12 8 12zm8 0c.79 0 1.5-.71 1.5-1.5S16.79 9 16 9s-1.5.71-1.5 1.5.71 1.5 1.5 1.5zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Loading comments...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t("guestbook.noMessages")}
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="flex items-start gap-3 group"
              >
                {/* Avatar */}
                {msg.avatar_url ? (
                  <img
                    src={msg.avatar_url}
                    alt={msg.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-medium text-white">{msg.name}</span>
                    <span className="text-xs text-gray-500">{formatDate(msg.created_at)}</span>
                    
                    {/* Delete button - only visible for admin */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(msg.id)}
                        disabled={deletingId === msg.id}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                        title="Delete message"
                      >
                        {deletingId === msg.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="mt-1 inline-block bg-[#0a1628] rounded-2xl rounded-tl-sm px-4 py-2 max-w-full">
                    <p className="text-gray-200 break-words">{msg.message}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Bottom Section - Sign In or Message Input - Hidden while loading */}
        {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 pt-6"
        >
          {authLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : user ? (
            /* Message Input for logged in users */
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()}
                  alt={getUserName()}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {getUserName().charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 bg-[#0a1628] border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors pr-12"
                  maxLength={500}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Sign In Section for guests - GitHub style */
            <div className="bg-[#0a1628] border border-gray-800 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-800 px-4">
                <span className="px-4 py-3 text-sm font-medium text-white">
                  Write a message
                </span>
              </div>
              
              {/* Textarea Area */}
              <div className="p-4">
                <textarea
                  disabled
                  placeholder={t("guestbook.signInToComment") || "Sign in to comment"}
                  className="w-full h-32 bg-transparent text-gray-500 placeholder-gray-600 resize-none focus:outline-none cursor-not-allowed"
                />
              </div>
              
              {/* Footer with Sign In Buttons */}
              <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                >
                  <FaGoogle className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </button>
                <button
                  onClick={signInWithGithub}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>Sign in with GitHub</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;
