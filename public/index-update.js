// Add this to index-script.js to add a link to the users page
document.addEventListener("DOMContentLoaded", () => {
  // Add users button to the hero section
  const heroButtons = document.querySelector(".hero-buttons")
  if (heroButtons) {
    const usersButton = document.createElement("a")
    usersButton.href = "users-page.html"
    usersButton.className = "secondary-btn"
    usersButton.innerHTML = '<i class="fas fa-users"></i> View Community'
    heroButtons.appendChild(usersButton)
  }

  // Initialize the rest of the page
  initLandingPage()
})

