document.addEventListener("DOMContentLoaded", () => {
  // Initialize the about us page
  initAboutUsPage()
})

function initAboutUsPage() {
  // Hide transition overlay on page load to fix back button issue
  const transitionOverlay = document.getElementById("transition-overlay")
  if (transitionOverlay) {
    transitionOverlay.classList.remove("active")
    // Ensure proper visibility settings
    transitionOverlay.style.opacity = "0"
    transitionOverlay.style.visibility = "hidden"
  }

  // Initialize navigation
  initNavigation()

  // Initialize contact form
  initContactForm()

  // Initialize scroll animations
  initScrollAnimations()

  // Initialize mouse following background
  initMouseFollowingBackground()

  // Initialize back to home button
  initBackToHomeButton()
}

// Navigation initialization
function initNavigation() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navLinks = document.querySelector(".nav-links")

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active")

      // Update icon
      const icon = mobileMenuBtn.querySelector("i")
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navLinks && mobileMenuBtn && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navLinks.classList.remove("active")
      const icon = mobileMenuBtn.querySelector("i")
      if (icon) {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    }
  })
}

// Contact form initialization
function initContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Simulate form submission (would connect to backend in real app)
      alert("Thank you for your message! We'll get back to you soon.")

      // Reset form
      contactForm.reset()
    })
  }
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".fade-in")

  // Initial check for elements in viewport
  checkElementsInViewport()

  // Check on scroll
  window.addEventListener("scroll", checkElementsInViewport)

  function checkElementsInViewport() {
    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    })
  }
}

// Mouse following background
function initMouseFollowingBackground() {
  const gradientSpheres = document.querySelectorAll(".gradient-sphere")

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight

    gradientSpheres.forEach((sphere, index) => {
      // Different movement amount for each sphere
      const moveX = (mouseX - 0.5) * (index + 1) * 50
      const moveY = (mouseY - 0.5) * (index + 1) * 50

      // Apply transform with a slight delay for more natural movement
      setTimeout(() => {
        if (index === 0) {
          sphere.style.transform = `translate(${moveX}px, ${moveY}px)`
        } else if (index === 1) {
          sphere.style.transform = `translate(${-moveX}px, ${-moveY}px)`
        } else if (index === 2) {
          sphere.style.transform = `translate(${moveX / 2}px, ${moveY / 2}px) translate(-50%, -50%)`
        }
      }, index * 50)
    })
  })
}

// Back to Home button initialization
function initBackToHomeButton() {
  const backToHomeBtn = document.getElementById("back-to-home-btn")
  const transitionOverlay = document.getElementById("transition-overlay")

  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
      // If there's a transition overlay, use it
      if (transitionOverlay) {
        // Hide default logo, show home logo
        const defaultLogo = document.querySelector(".transition-logo:not(.home-logo)")
        const homeLogo = document.querySelector(".transition-logo.home-logo")

        if (defaultLogo && homeLogo) {
          defaultLogo.style.display = "none"
          homeLogo.style.display = "flex"
        }

        // Add active class to overlay to show it
        transitionOverlay.classList.add("active")
        transitionOverlay.style.opacity = "1"
        transitionOverlay.style.visibility = "visible"

        // After animation completes, redirect to index.html
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1500)
      } else {
        // Direct navigation if no overlay
        window.location.href = "index.html"
      }

      // Add pulse animation to the button
      backToHomeBtn.classList.add("pulse")
    })
  }
}

