import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, User, MessageSquare, Clock, Loader2, Trash2, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Secret admin key - change this to your own secret!
const ADMIN_SECRET = "dimasu21admin";

const Guestbook = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Check for admin mode in URL or localStorage
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
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("guestbook").insert([
        {
          name: newMessage.name.trim(),
          message: newMessage.message.trim(),
        },
      ]);

      if (error) throw error;
      setNewMessage({ name: "", message: "" });
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

  return (
    <section className="min-h-screen relative overflow-hidden py-20 bg-[#04081A]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-[#04081A]" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-4 focus:outline-none focus:border-teal-500"
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

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="pt-16 text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
            {t("guestbook.title")}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
        </motion.div>

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              {t("guestbook.leaveMessage")}
            </h3>
            
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t("guestbook.name")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={newMessage.name}
                    onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                    placeholder={t("guestbook.namePlaceholder")}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    required
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t("guestbook.message")}
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  placeholder={t("guestbook.messagePlaceholder")}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  required
                  maxLength={500}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !newMessage.name.trim() || !newMessage.message.trim()}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("guestbook.sending")}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t("guestbook.send")}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            {t("guestbook.recentMessages")} ({messages.length})
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t("guestbook.noMessages")}
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{msg.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete button - only visible for admin */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50"
                      title="Delete message"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-gray-300 leading-relaxed">{msg.message}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Guestbook;
