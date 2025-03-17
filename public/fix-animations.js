/**
 * This file contains functions to fix animation issues across the website
 */

// Fix text typing animations
function fixTypingAnimations() {
  const typingElements = document.querySelectorAll("[data-typing]")

  typingElements.forEach((element) => {
    const text = element.getAttribute("data-typing")
    const speed = Number.parseInt(element.getAttribute("data-typing-speed") || "100")

    if (text) {
      // Clear existing content
      element.textContent = ""

      let i = 0
      function typeWriter() {
        if (i < text.length) {
          element.textContent += text.charAt(i)
          i++
          setTimeout(typeWriter, speed)
        }
      }

      // Start typing animation
      typeWriter()
    }
  })
}

// Fix reveal animations on scroll
function fixScrollAnimations() {
  const animatedElements = document.querySelectorAll(".fade-in, .reveal-text")

  // Initial check
  checkElementsInViewport()

  // Check on scroll
  window.addEventListener("scroll", checkElementsInViewport)

  function checkElementsInViewport() {
    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        if (element.classList.contains("fade-in")) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        } else if (element.classList.contains("reveal-text")) {
          // Force animation restart
          element.style.animation = "none"
          element.offsetHeight // Trigger reflow
          element.style.animation = null
        }
      }
    })
  }
}

// Fix gradient sphere animations
function fixGradientSpheres() {
  const gradientSpheres = document.querySelectorAll(".gradient-sphere")

  if (gradientSpheres.length > 0) {
    // Make sure spheres are visible
    gradientSpheres.forEach((sphere, index) => {
      sphere.style.opacity = "0.15"

      // Apply different animations to each sphere
      if (index === 0) {
        sphere.style.animation = "float1 20s infinite ease-in-out, colorShift1 30s infinite alternate"
      } else if (index === 1) {
        sphere.style.animation = "float2 25s infinite ease-in-out, colorShift2 35s infinite alternate"
      } else if (index === 2) {
        sphere.style.animation = "float3 30s infinite ease-in-out, colorShift3 40s infinite alternate"
      }
    })
  }
}

// Fix floating elements animation
function fixFloatingElements() {
  const floatingElements = document.querySelectorAll(".floating-element")

  if (floatingElements.length > 0) {
    floatingElements.forEach((element, index) => {
      // Set initial opacity
      element.style.opacity = "0"

      // Animate with delay based on index
      setTimeout(
        () => {
          element.style.opacity = "1"
          element.style.animation = `float ${6 + index}s infinite ease-in-out ${index * 0.5}s`
        },
        500 + index * 300,
      )
    })
  }
}

// Fix back to home button
function fixBackToHomeButton() {
  const backToHomeBtn = document.getElementById("back-to-home-btn")
  const backToHomeLink = document.querySelector(".back-to-home")

  const handleBackToHome = (element) => {
    if (element) {
      element.addEventListener("click", (e) => {
        e.preventDefault()

        // Add pulse animation
        element.classList.add("pulse")

        // Use transition overlay if available
        const transitionOverlay = document.getElementById("transition-overlay")
        if (transitionOverlay) {
          // Show home logo if available
          const defaultLogo = document.querySelector(".transition-logo:not(.home-logo)")
          const homeLogo = document.querySelector(".transition-logo.home-logo")

          if (defaultLogo && homeLogo) {
            defaultLogo.style.display = "none"
            homeLogo.style.display = "flex"
          }

          // Show overlay
          transitionOverlay.classList.add("active")
          transitionOverlay.style.opacity = "1"
          transitionOverlay.style.visibility = "visible"

          // Navigate after animation
          setTimeout(() => {
            window.location.href = "index.html"
          }, 1500)
        } else {
          // Direct navigation
          window.location.href = "index.html"
        }
      })
    }
  }

  // Apply to both elements
  handleBackToHome(backToHomeBtn)
  handleBackToHome(backToHomeLink)
}

// Initialize all fixes
document.addEventListener("DOMContentLoaded", () => {
  // Fix animations
  fixTypingAnimations()
  fixScrollAnimations()
  fixGradientSpheres()
  fixFloatingElements()

  // Fix navigation
  fixBackToHomeButton()
})

// Export functions for use in other files
export { fixTypingAnimations, fixScrollAnimations, fixGradientSpheres, fixFloatingElements, fixBackToHomeButton }

