import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// Initialize Supabase client
const supabaseUrl = "https://qeuppsmpoyhectbluhfv.supabase.co" // Replace with your actual Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXBwc21wb3loZWN0Ymx1aGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQ4NTAsImV4cCI6MjA1NzY4MDg1MH0.i7VLvIeeOum6uaE8KEF-Z244Cf7TaJJdWoqE9whUSzc" // Replace with your actual Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey)

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session)

  if (event === "SIGNED_IN") {
    // Update user's online status
    if (session?.user) {
      supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("id", session.user.id)
        .then(({ error }) => {
          if (error) console.error("Error updating online status:", error)
        })
    }
  } else if (event === "SIGNED_OUT") {
    // User is signed out, no need to update status as it was done before logout
    console.log("User signed out")
  }
})

// Export the supabase client for use in other files
export default supabase

