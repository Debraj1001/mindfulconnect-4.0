// This file manages the event section to remove fake content
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const eventListContainer = document.querySelector(".event-list")
  const eventsCalendar = document.querySelector(".events-calendar")

  if (currentUser && eventListContainer) {
    // Get user's events
    const events = JSON.parse(localStorage.getItem("events")) || []

    // If there are no events, show empty state
    if (events.length === 0) {
      eventListContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>No upcoming events scheduled yet. Check back later or join a community event!</p>
        </div>
      `

      // Show empty calendar too
      if (eventsCalendar) {
        const calendarDates = document.getElementById("calendar-dates")
        if (calendarDates) {
          // Still show the calendar but with no events
          const today = new Date()
          const currentMonth = today.getMonth()
          const currentYear = today.getFullYear()

          // Remove any "has-event" classes that might be predefined
          setTimeout(() => {
            const hasEventElements = calendarDates.querySelectorAll(".has-event")
            hasEventElements.forEach((elem) => {
              elem.classList.remove("has-event")
            })
          }, 500) // Small delay to ensure calendar is rendered
        }
      }
    }
  }
})

