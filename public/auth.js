// Import Supabase client and any necessary functions
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = "YOUR_SUPABASE_URL" // Replace with your Supabase URL
const supabaseKey = "YOUR_SUPABASE_ANON_KEY" // Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseKey)

// Placeholder for showToast function (replace with your actual implementation)
function showToast(message) {
  console.log(message) // Replace with your toast notification logic
  // Example using a simple alert:
  // alert(message);
}

// Placeholder for checkUser function (replace with your actual implementation)
function checkUser() {
  // Check if user is logged in and redirect if necessary
  console.log("Checking user session...")
}

// Placeholder for initAuthTabs function (replace with your actual implementation)
function initAuthTabs() {
  // Initialize the authentication tabs
  console.log("Initializing auth tabs...")
}

// Placeholder for checkUrlParams function (replace with your actual implementation)
function checkUrlParams() {
  // Check URL parameters for auto-tab selection
  console.log("Checking URL parameters...")
}

// Placeholder for initBackToHomeButton function (replace with your actual implementation)
function initBackToHomeButton() {
  // Initialize back to home button
  console.log("Initializing back to home button...")
}

// Authentication functions using Supabase

// Sign up with email and password
async function signUp(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    showToast("Registration successful! Please check your email for verification.")
    return data
  } catch (error) {
    showToast(error.message || "Error during sign up")
    console.error("Error signing up:", error)
    return null
  }
}

// Sign in with email and password
async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) throw error

    showToast("Login successful!")

    // Redirect to landing page after successful login
    setTimeout(() => {
      window.location.href = "landing.html"
    }, 1500)

    return data
  } catch (error) {
    showToast(error.message || "Error during sign in")
    console.error("Error signing in:", error)
    return null
  }
}

// Sign out
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    showToast("You have been logged out successfully")

    // Redirect to home page after logout
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1500)
  } catch (error) {
    showToast(error.message || "Error during sign out")
    console.error("Error signing out:", error)
  }
}

// Update auth-script.js to use Supabase
document.addEventListener("DOMContentLoaded", () => {
  // Hide transition overlay on page load to fix back button issue
  const transitionOverlay = document.getElementById("transition-overlay")
  if (transitionOverlay) {
    transitionOverlay.classList.remove("active")
  }

  // Check if user is already logged in
  checkUser()

  // Initialize auth tabs
  initAuthTabs()

  // Initialize form submissions
  initFormSubmissions()

  // Check URL parameters for auto-tab selection
  checkUrlParams()

  // Initialize back to home button
  initBackToHomeButton()
})

// Initialize form submissions with Supabase
function initFormSubmissions() {
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginError = document.getElementById("login-error")
  const signupError = document.getElementById("signup-error")
  const signupSuccess = document.getElementById("signup-success")

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // Validate form
      if (!email || !password) {
        loginError.textContent = "Please fill in all fields"
        loginError.style.display = "block"
        return
      }

      // Sign in with Supabase
      const user = await signIn(email, password)

      if (user) {
        loginError.style.display = "none"
      }
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm").value

      // Validate form
      if (!name || !email || !password || !confirmPassword) {
        signupError.textContent = "Please fill in all fields"
        signupError.style.display = "block"
        signupSuccess.style.display = "none"
        return
      }

      if (password !== confirmPassword) {
        signupError.textContent = "Passwords do not match"
        signupError.style.display = "block"
        signupSuccess.style.display = "none"
        return
      }

      // Sign up with Supabase
      const user = await signUp(email, password, name)

      if (user) {
        signupError.style.display = "none"
        signupSuccess.style.display = "block"
        signupSuccess.textContent = "Account created successfully! Please check your email for verification."

        // Reset form
        signupForm.reset()

        // Switch to login tab after short delay
        setTimeout(() => {
          document.querySelector('.auth-tab[data-tab="login"]').click()
        }, 2000)
      }
    })
  }
}

// Add logout functionality to the existing script.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut()
    })
  }
})

