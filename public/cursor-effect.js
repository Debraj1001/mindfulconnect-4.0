// Mouse cursor water ripple effect
document.addEventListener("DOMContentLoaded", () => {
  // Remove the custom cursor elements and only keep the ripple effect

  // Track mouse position
  let mouseX = 0
  let mouseY = 0
  let lastX = 0
  let lastY = 0
  const threshold = 5 // Minimum distance to create a new ripple

  // Update mouse position and create ripple effect
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Calculate distance moved
    const distance = Math.sqrt(Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2))

    // Only create ripple if mouse has moved enough
    if (distance > threshold) {
      createRipple(mouseX, mouseY, distance)
      lastX = mouseX
      lastY = mouseY
    }
  })

  // Create ripple effect
  function createRipple(x, y, speed) {
    const ripple = document.createElement("div")
    ripple.className = "water-ripple"

    // Set initial position
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"

    // Set initial size based on movement speed (capped)
    const initialSize = Math.min(10 + speed * 0.3, 20)
    ripple.style.width = initialSize + "px"
    ripple.style.height = initialSize + "px"

    // Add to document
    document.body.appendChild(ripple)

    // Animate the ripple
    setTimeout(() => {
      ripple.style.transform = "scale(8)"
      ripple.style.opacity = "0"
    }, 10)

    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove()
    }, 1500)
  }

  // Create initial ripple on click
  document.addEventListener("click", (e) => {
    createRipple(e.clientX, e.clientY, 20)
  })

  // Hide ripple effect on mobile devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add("no-ripple")
  }
})

