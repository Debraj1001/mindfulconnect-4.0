import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabaseUrl = "https://qeuppsmpoyhectbluhfv.supabase.co"; // Replace with your actual Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXBwc21wb3loZWN0Ymx1aGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQ4NTAsImV4cCI6MjA1NzY4MDg1MH0.i7VLvIeeOum6uaE8KEF-Z244Cf7TaJJdWoqE9whUSzc"; // Replace with your actual Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the supabase client for use in other files
export default supabase;

