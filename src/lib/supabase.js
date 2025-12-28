import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xbqwppphtplntjtbzruk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXdwcHBodHBsbnRqdGJ6cnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTE4NzksImV4cCI6MjA4MjQ4Nzg3OX0.clmUoYGNIUIdliGKfg1N4GIZt2l4chHIMNWmBXlfi3M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
