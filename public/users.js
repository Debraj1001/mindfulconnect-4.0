import supabase from "./supabase-client.js"

document.addEventListener("DOMContentLoaded", () => {
  // Hide transition overlay on page load to fix back button issue
  const transitionOverlay = document.getElementById("transition-overlay")
  if (transitionOverlay) {
    transitionOverlay.classList.remove("active")
    // Ensure proper visibility settings
    transitionOverlay.style.opacity = "0"
    transitionOverlay.style.visibility = "hidden"
  }

  // Check if user is already logged in
  checkAuthStatus()

  // Initialize auth tabs
  initAuthTabs()

  // Initialize form submissions
  initFormSubmissions()

  // Check URL parameters for auto-tab selection
  checkUrlParams()

  // Initialize back to home button
  initBackToHomeButton()

  // Initialize Google Sign In
  initGoogleSignIn()

  // Initialize forgot password
  initForgotPassword()
})

// Check authentication status
async function checkAuthStatus() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (user) {
      // User is already logged in, redirect to landing page
      window.location.href = "landing.html"
    }
  } catch (error) {
    console.error("Error checking auth status:", error)
  }
}

// Auth tabs initialization
function initAuthTabs() {
  const authTabs = document.querySelectorAll(".auth-tab")
  const authForms = document.querySelectorAll(".auth-form")

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and forms
      authTabs.forEach((t) => t.classList.remove("active"))
      authForms.forEach((f) => f.classList.remove("active"))

      // Add active class to clicked tab
      tab.classList.add("active")

      // Show corresponding form
      const formId = `${tab.getAttribute("data-tab")}-form`
      const form = document.getElementById(formId)
      if (form) {
        form.classList.add("active")
      }
    })
  })
}

// Initialize form submissions
function initFormSubmissions() {
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginError = document.getElementById("login-error")
  const loginSuccess = document.getElementById("login-success")
  const signupError = document.getElementById("signup-error")
  const signupSuccess = document.getElementById("signup-success")

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // Validate form
      if (!email || !password) {
        if (loginError) {
          loginError.textContent = "Please fill in all fields"
          loginError.style.display = "block"
        }
        if (loginSuccess) {
          loginSuccess.style.display = "none"
        }
        return
      }

      // Show loading state
      const loginSubmit = document.getElementById("login-submit") || loginForm.querySelector('button[type="submit"]')
      const originalContent = loginSubmit.innerHTML

      loginSubmit.disabled = true
      loginSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...'

      try {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Show success message
        if (loginError) loginError.style.display = "none"
        if (loginSuccess) {
          loginSuccess.textContent = "Login successful! Redirecting..."
          loginSuccess.style.display = "block"
        }

        // Redirect to landing page after short delay
        setTimeout(() => {
          window.location.href = "landing.html"
        }, 1500)
      } catch (error) {
        // Show error message
        if (loginError) {
          loginError.textContent = error.message || "Error signing in"
          loginError.style.display = "block"
        }
        if (loginSuccess) {
          loginSuccess.style.display = "none"
        }
      } finally {
        // Hide loading state
        loginSubmit.disabled = false
        loginSubmit.innerHTML = originalContent
      }
    })
  }

  // Signup form submission
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
        if (signupError) {
          signupError.textContent = "Please fill in all fields"
          signupError.style.display = "block"
        }
        if (signupSuccess) {
          signupSuccess.style.display = "none"
        }
        return
      }

      if (password !== confirmPassword) {
        if (signupError) {
          signupError.textContent = "Passwords do not match"
          signupError.style.display = "block"
        }
        if (signupSuccess) {
          signupSuccess.style.display = "none"
        }
        return
      }

      if (password.length < 6) {
        if (signupError) {
          signupError.textContent = "Password must be at least 6 characters"
          signupError.style.display = "block"
        }
        if (signupSuccess) {
          signupSuccess.style.display = "none"
        }
        return
      }

      // Show loading state
      const signupSubmit = document.getElementById("signup-submit") || signupForm.querySelector('button[type="submit"]')
      const originalContent = signupSubmit.innerHTML

      signupSubmit.disabled = true
      signupSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing up...'

      try {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })

        if (error) throw error

        // Create profile entry
        if (data.user) {
          try {
            const { error: profileError } = await supabase.from("profiles").insert([
              {
                id: data.user.id,
                full_name: name,
                email: email,
                username: email.split("@")[0] + Math.floor(Math.random() * 1000),
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
              },
            ])

            if (profileError) console.error("Error creating profile:", profileError)
          } catch (profileErr) {
            console.error("Error creating profile:", profileErr)
          }
        }

        // Show success message
        if (signupError) signupError.style.display = "none"
        if (signupSuccess) {
          signupSuccess.textContent = "Registration successful! Please check your email for verification."
          signupSuccess.style.display = "block"
        }

        // Reset form
        signupForm.reset()

        // Switch to login tab after short delay
        setTimeout(() => {
          const loginTab = document.querySelector('.auth-tab[data-tab="login"]')
          if (loginTab) loginTab.click()
        }, 3000)
      } catch (error) {
        // Show error message
        if (signupError) {
          signupError.textContent = error.message || "Error signing up"
          signupError.style.display = "block"
        }
        if (signupSuccess) {
          signupSuccess.style.display = "none"
        }
      } finally {
        // Hide loading state
        signupSubmit.disabled = false
        signupSubmit.innerHTML = originalContent
      }
    })
  }
}

// Initialize Google Sign In
function initGoogleSignIn() {
  const googleSignInBtn = document.getElementById("google-signin")

  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/landing.html`,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        })

        if (error) throw error
      } catch (error) {
        showToast(error.message || "Error signing in with Google")
      }
    })
  }
}

// Initialize forgot password
function initForgotPassword() {
  const forgotPasswordLink = document.getElementById("forgot-password")

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", async (e) => {
      e.preventDefault()

      const email = document.getElementById("login-email").value
      const loginError = document.getElementById("login-error")
      const loginSuccess = document.getElementById("login-success")

      if (!email) {
        if (loginError) {
          loginError.textContent = "Please enter your email address"
          loginError.style.display = "block"
        }
        return
      }

      // Show loading state
      const originalText = forgotPasswordLink.textContent
      forgotPasswordLink.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      forgotPasswordLink.style.pointerEvents = "none"

      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password.html`,
        })

        if (error) throw error

        if (loginSuccess) {
          loginSuccess.textContent = "Password reset email sent. Please check your inbox."
          loginSuccess.style.display = "block"
        }
        if (loginError) {
          loginError.style.display = "none"
        }
      } catch (error) {
        if (loginError) {
          loginError.textContent = error.message || "Error sending reset email"
          loginError.style.display = "block"
        }
      } finally {
        // Reset button state
        forgotPasswordLink.innerHTML = originalText
        forgotPasswordLink.style.pointerEvents = "auto"
      }
    })
  }
}

// Check URL parameters for auto-tab selection
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const signupParam = urlParams.get("signup")

  if (signupParam === "true") {
    // Trigger click on signup tab
    const signupTab = document.querySelector('.auth-tab[data-tab="signup"]')
    if (signupTab) signupTab.click()
  }
}

/// Back to Home button initialization
function initBackToHomeButton() {
  const backToHomeBtn = document.getElementById("back-to-home-btn")
  const transitionOverlay = document.getElementById("transition-overlay")

  if (backToHomeBtn && transitionOverlay) {
    backToHomeBtn.addEventListener("click", () => {
      // Hide default logo, show home logo
      const defaultLogo = document.querySelector(".transition-logo:not(.home-logo)")
      const homeLogo = document.querySelector(".transition-logo.home-logo")

      if (defaultLogo && homeLogo) {
        defaultLogo.style.display = "none"
        homeLogo.style.display = "flex"
      }

      // Add active class to overlay to show it
      transitionOverlay.classList.add("active")

      // After animation completes, redirect to index.html
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)

      // Add pulse animation to the button
      backToHomeBtn.classList.add("pulse")
    })
  }
}

// Show toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast-notification")
  if (!toast) {
    toast = document.createElement("div")
    toast.id = "toast-notification"
    document.body.appendChild(toast)
  }

  // Set message and show toast
  toast.textContent = message
  toast.classList.add("show")

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

