import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { FaPen, FaTrash, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaPlus, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Loader2, LogOut, Image as ImageIcon, SplitSquareHorizontal, Minus } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// CSS for Quill Dark Mode
import "@/assets/css/quill-dark.css"; 

export default function BlogAdmin() {
  const { user, signInWithGoogle, signInWithGithub, signOut, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
    created_at: "", // Add this
  });
  const [isSaving, setIsSaving] = useState(false);
  const quillRef = useRef(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("admins")
          .select("email")
          .eq("email", user.email)
          .single();

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  // Fetch posts when admin
  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: currentPost ? formData.slug : generateSlug(title),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
      created_at: "",
      tags: "", // State for tags input string
    });
    setCurrentPost(null);
    setIsEditing(false);
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      published: post.published,
      created_at: post.created_at ? new Date(post.created_at).toISOString().slice(0, 16) : "",
      tags: post.tags ? post.tags.join(", ") : "", // Convert array to comma-string
    });
    setIsEditing(true);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from("blog-images")
            .getPublicUrl(filePath);

          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.publicUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image");
        }
      }
    };
  };

  // Insert Page Break
  const insertPageBreak = () => {
    const marker = `<p class="text-center font-bold text-gray-500 my-4">__________PAGE_BREAK__________</p>`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + marker
    }));
  };

  // Insert Divider (Horizontal Rule)
  const insertDivider = () => {
    const marker = `<hr class="my-8" />`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + marker
    }));
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ["small", false, "large", "huge"] }], // Font size
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }], // Text alignment
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and content are required!");
      return;
    }

    setIsSaving(true);
    try {
      if (currentPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update({
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            excerpt: formData.excerpt,
            published: formData.published,
            updated_at: new Date().toISOString(),
            created_at: formData.created_at ? new Date(formData.created_at).toISOString() : currentPost.created_at,
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean), // String to Array
          })
          .eq("id", currentPost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert([
          {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            excerpt: formData.excerpt,
            published: formData.published,
            created_at: formData.created_at ? new Date(formData.created_at).toISOString() : new Date().toISOString(),
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean), // String to Array
          },
        ]);

        if (error) throw error;
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const togglePublish = async (post) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published: !post.published })
        .eq("id", post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ... (Login & Loading UI code remains same, updated Editor below)

  if (authLoading || checkingAdmin) {
    return (
      <main className="bg-[#020617] text-white min-h-screen pt-32 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-[#020617] text-white min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8"
          >
            <h1 className="text-2xl font-bold mb-2 text-center">Blog Admin</h1>
            <p className="text-gray-400 text-sm text-center mb-6">Sign in to manage your blog</p>
            
            <div className="space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-medium transition-colors"
              >
                <FaGoogle />
                Sign in with Google
              </button>
              <button
                onClick={signInWithGithub}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl font-medium transition-colors"
              >
                <FaGithub />
                Sign in with GitHub
              </button>
            </div>

            <Link
              to="/blog"
              className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              Back to Blog
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="bg-[#020617] text-white min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-400 mb-6">
              You don't have admin access. Contact the site owner if you need access.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={signOut}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
              <Link
                to="/blog"
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                Back to Blog
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#020617] text-white min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Admin</h1>
            <p className="text-gray-400 text-sm mt-1">
              Logged in as {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              View Blog
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Editor Form */}
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {currentPost ? "Edit Post" : "New Post"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Post title..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-url-slug"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Excerpt (optional)</label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Publish Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.created_at}
                  onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use current time</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. javascript, tutorial, coding"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm text-gray-400">Content</label>
                <button
                  type="button"
                  onClick={insertPageBreak}
                  className="text-xs flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <SplitSquareHorizontal size={14} />
                  Insert Page Break
                </button>
                <button
                  type="button"
                  onClick={insertDivider}
                  className="text-xs flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors ml-4"
                >
                  <Minus size={14} />
                  Insert Divider
                </button>
              </div>
              <div className="bg-white text-gray-900 rounded-xl overflow-hidden">
                  <ReactQuill
                    ref={quillRef}
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={modules}
                    theme="snow"
                    placeholder="Write your amazing post here..."
                    className="h-96 mb-12" // mb-12 for toolbar space
                  />
                </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm text-gray-300">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors"
                >
                  <FaSave />
                  {isSaving ? "Saving..." : "Save Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors mb-8"
          >
            <FaPlus />
            New Post
          </button>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Posts ({posts.length})</h2>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No posts yet. Create your first post!
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white truncate">{post.title}</h3>
                    {post.published ? (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(post)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    title="Edit"
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
