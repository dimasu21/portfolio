import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Generate a unique device fingerprint
const getDeviceFingerprint = () => {
  let fingerprint = localStorage.getItem("device_fingerprint");
  if (!fingerprint) {
    fingerprint = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("device_fingerprint", fingerprint);
  }
  return fingerprint;
};

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const deviceFingerprint = getDeviceFingerprint();

  useEffect(() => {
    fetchLikeStatus();
  }, [postId]);

  const fetchLikeStatus = async () => {
    try {
      // Get total likes count
      const { count } = await supabase
        .from("blog_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      setLikesCount(count || 0);

      // Check if current device has liked
      const { data } = await supabase
        .from("blog_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("device_fingerprint", deviceFingerprint)
        .single();

      setLiked(!!data);
    } catch (error) {
      // No like found is expected
      setLiked(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

    try {
      if (liked) {
        // Unlike - remove from database
        await supabase
          .from("blog_likes")
          .delete()
          .eq("post_id", postId)
          .eq("device_fingerprint", deviceFingerprint);

        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like - add to database
        await supabase.from("blog_likes").insert({
          post_id: postId,
          device_fingerprint: deviceFingerprint,
        });

        setLiked(true);
        setLikesCount((prev) => prev + 1);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 600);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      className={`relative group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        liked
          ? "bg-red-500/10 border-red-500/50 text-red-500"
          : "bg-gray-900 border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Heart Icon */}
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={20}
          className={`transition-all duration-300 ${
            liked ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </motion.div>

      {/* Likes Count */}
      <span className="font-medium text-sm">{likesCount}</span>

      {/* Floating Hearts Animation */}
      <AnimatePresence>
        {showAnimation && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0.5,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: (Math.random() - 0.5) * 60,
                  y: -40 - Math.random() * 30,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute pointer-events-none"
              >
                <Heart size={12} className="fill-red-500 text-red-500" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
