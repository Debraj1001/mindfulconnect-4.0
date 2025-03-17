// This is a new file to improve the mood tracker functionality
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // Initialize mood tracker if user is logged in
  if (currentUser) {
    // Get UI elements
    const moodChart = document.getElementById("mood-chart")
    const moodHistoryContainer = document.getElementById("mood-history")
    const moodSubmitBtn = document.getElementById("mood-submit-btn")
    const emptyStateContainer = document.getElementById("mood-empty-state")

    // Get user's mood data
    const userMoodData = JSON.parse(localStorage.getItem(`mood_${currentUser.id}`)) || []

    // Update UI based on whether user has mood data
    if (userMoodData.length === 0 && emptyStateContainer) {
      // Show empty state
      emptyStateContainer.style.display = "block"

      // Hide insights if they exist
      const insightsSection = document.querySelector(".mood-insights")
      if (insightsSection) {
        insightsSection.style.display = "none"
      }
    } else if (emptyStateContainer) {
      // Hide empty state
      emptyStateContainer.style.display = "none"

      // Show insights if they exist
      const insightsSection = document.querySelector(".mood-insights")
      if (insightsSection) {
        insightsSection.style.display = "block"
      }
    }

    // Add event listeners for the mood submission
    if (moodSubmitBtn) {
      moodSubmitBtn.addEventListener("click", () => {
        // After successful submission
        if (emptyStateContainer) {
          emptyStateContainer.style.display = "none"
        }

        // Show insights if they exist
        const insightsSection = document.querySelector(".mood-insights")
        if (insightsSection) {
          insightsSection.style.display = "block"
        }
      })
    }
  }
})

