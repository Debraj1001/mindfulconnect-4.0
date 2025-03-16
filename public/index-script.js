document.addEventListener("DOMContentLoaded", () => {
  // Initialize the landing page
  initLandingPage()
})

// Modify the initLandingPage function to ensure the transition overlay is hidden on page load
function initLandingPage() {
  // Hide transition overlay on page load to fix back button issue
  const transitionOverlay = document.getElementById("transition-overlay")
  if (transitionOverlay) {
    transitionOverlay.classList.remove("active")
  }

  // Initialize Go To button
  initGoToButton()

  // Initialize About Us button
  initAboutUsButton()

  // Initialize mouse following background
  initMouseFollowingBackground()
}

// Go To button initialization
function initGoToButton() {
  const goToBtn = document.getElementById("go-to-btn")
  const transitionOverlay = document.getElementById("transition-overlay")

  if (goToBtn && transitionOverlay) {
    goToBtn.addEventListener("click", () => {
      // Add active class to overlay to show it
      transitionOverlay.classList.add("active")

      // After animation completes, redirect to landing.html
      setTimeout(() => {
        window.location.href = "landing.html"
      }, 1500)

      // Add pulse animation to the button
      goToBtn.classList.add("pulse")
    })
  }
}

// About Us button initialization
function initAboutUsButton() {
  const aboutUsBtn = document.getElementById("about-us-btn")
  const transitionOverlay = document.getElementById("transition-overlay")
  const defaultLogo = document.querySelector(".transition-logo:not(.about-us-logo)")
  const aboutUsLogo = document.querySelector(".transition-logo.about-us-logo")

  if (aboutUsBtn && transitionOverlay) {
    aboutUsBtn.addEventListener("click", () => {
      // Hide default logo, show about us logo
      if (defaultLogo && aboutUsLogo) {
        defaultLogo.style.display = "none"
        aboutUsLogo.style.display = "flex"
      }

      // Add active class to overlay to show it
      transitionOverlay.classList.add("active")

      // After animation completes, redirect to about-us.html
      setTimeout(() => {
        window.location.href = "about-us.html"
      }, 1500)

      // Add pulse animation to the button
      aboutUsBtn.classList.add("pulse")
    })
  }
}

// Mouse following background
function initMouseFollowingBackground() {
  const gradientSpheres = document.querySelectorAll(".gradient-sphere")
  const landingContainer = document.querySelector(".landing-container")

  if (landingContainer) {
    landingContainer.addEventListener("mousemove", (e) => {
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

  // Parallax effect for floating elements
  const floatingElements = document.querySelectorAll(".floating-element")
  const imageContainer = document.querySelector(".image-container")

  if (imageContainer && floatingElements.length > 0) {
    imageContainer.addEventListener("mousemove", (e) => {
      const rect = imageContainer.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5

      floatingElements.forEach((element, index) => {
        const depth = index + 1
        const moveX = mouseX * depth * 20
        const moveY = mouseY * depth * 20

        element.style.transform = `translate(${moveX}px, ${moveY}px)`
      })
    })

    // Reset position when mouse leaves
    imageContainer.addEventListener("mouseleave", () => {
      floatingElements.forEach((element) => {
        element.style.transform = "translate(0, 0)"
      })
    })
  }
}

// Add a subtle animation to elements when they come into view
function animateOnScroll() {
  const elements = document.querySelectorAll(".feature-item, .tagline h2, .tagline p, .go-to-btn")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate")
    }
  })
}

// Initialize animation on scroll
window.addEventListener("scroll", animateOnScroll)

