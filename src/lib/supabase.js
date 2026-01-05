import { createClient } from "@supabase/supabase-js";

// Use environment variables for security
// In development, create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xbqwppphtplntjtbzruk.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXdwcHBodHBsbnRqdGJ6cnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTE4NzksImV4cCI6MjA4MjQ4Nzg3OX0.clmUoYGNIUIdliGKfg1N4GIZt2l4chHIMNWmBXlfi3M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
