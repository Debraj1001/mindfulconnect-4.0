import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// Initialize Supabase client
const supabaseUrl = "https://htfbaphxhwzjfngrqxda.supabase.co" // Replace with your actual Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmJhcGh4aHd6amZuZ3JxeGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTU0OTcsImV4cCI6MjA1Nzc5MTQ5N30.l8n1k8Xm6x7dQlkJdSfl3hcMtTtgxaTdCtGKAotQXT0" // Replace with your actual Supabase anon key
const supabase = createClient("https://htfbaphxhwzjfngrqxda.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmJhcGh4aHd6amZuZ3JxeGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTU0OTcsImV4cCI6MjA1Nzc5MTQ5N30.l8n1k8Xm6x7dQlkJdSfl3hcMtTtgxaTdCtGKAotQXT0")

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

