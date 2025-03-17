// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp()
})

// Main initialization function
function initApp() {
  // Hide transition overlay on page load to fix back button issue
  const transitionOverlay = document.getElementById("transition-overlay")
  if (transitionOverlay) {
    transitionOverlay.classList.remove("active")
  }

  // Check authentication status
  checkAuthStatus()

  // Initialize navigation
  initNavigation()

  // Initialize typing effect
  initTypingEffect()

  // Initialize mood tracker
  initMoodTracker()

  // Initialize forums
  initForums()

  // Initialize challenges
  initChallenges()

  // Initialize events
  initEvents()

  // Initialize smooth scrolling
  initSmoothScrolling()

  // Initialize scroll animations
  initScrollAnimations()

  // Initialize feature card links
  initFeatureCardLinks()

  // Initialize mouse following background
  initMouseFollowingBackground()

  // Set current date
  setCurrentDate()

  // Initialize back to home button
  initBackToHomeButton()

  // Initialize logout button
  initLogoutButton()
}

// Check authentication status
function checkAuthStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const authButtons = document.querySelector(".nav-buttons")
  const userProfileBtn = document.getElementById("user-profile-btn")
  const protectedSections = document.querySelectorAll(".protected-section")

  if (currentUser) {
    // User is logged in
    if (authButtons) {
      authButtons.innerHTML = `
        <div class="user-welcome">Welcome, ${currentUser.name.split(" ")[0]}</div>
        <button id="logout-btn" class="logout-btn">Logout</button>
      `
    }

    if (userProfileBtn) {
      userProfileBtn.style.display = "flex"
      userProfileBtn.querySelector(".user-name").textContent = currentUser.name.split(" ")[0]
    }

    // Show protected sections
    protectedSections.forEach((section) => {
      section.classList.remove("auth-required")
      const authOverlay = section.querySelector(".auth-overlay")
      if (authOverlay) {
        authOverlay.style.display = "none"
      }
    })
  } else {
    // User is not logged in
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="auth.html" class="login-btn">Login</a>
        <a href="auth.html?signup=true" class="signup-btn">Sign Up</a>
      `
    }

    if (userProfileBtn) {
      userProfileBtn.style.display = "none"
    }

    // Hide protected sections content and show auth overlay
    protectedSections.forEach((section) => {
      section.classList.add("auth-required")
      let authOverlay = section.querySelector(".auth-overlay")

      if (!authOverlay) {
        authOverlay = document.createElement("div")
        authOverlay.className = "auth-overlay"
        authOverlay.innerHTML = `
          <div class="auth-overlay-content">
            <i class="fas fa-lock"></i>
            <h3>Authentication Required</h3>
            <p>Please log in or sign up to access this feature</p>
            <div class="auth-overlay-buttons">
              <a href="auth.html" class="primary-btn">Login</a>
              <a href="auth.html?signup=true" class="secondary-btn">Sign Up</a>
            </div>
          </div>
        `
        section.appendChild(authOverlay)
      } else {
        authOverlay.style.display = "flex"
      }
    })
  }
}

// Initialize logout button
function initLogoutButton() {
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-btn") {
      // Clear user session
      localStorage.removeItem("currentUser")

      // Show logout message
      showToast("You have been logged out successfully")

      // Redirect to home page after short delay
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    }
  })
}

// Remove the initTheme function completely

// Navigation initialization
function initNavigation() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navLinks = document.querySelector(".nav-links")

  // Mobile menu toggle
  if (mobileMenuBtn) {
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

  // Active link highlighting
  const navItems = document.querySelectorAll(".nav-links a")
  const sections = document.querySelectorAll("section")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active")
      }
    })
  })
}

// Typing effect initialization
function initTypingEffect() {
  const mainText = "Your Mental Wellness Journey Starts Here"
  const subText = "A safe space for students to connect, share, and prioritize mental health."

  const mainTypingElement = document.getElementById("typing-text")
  const subTypingElement = document.getElementById("sub-typing-text")

  if (mainTypingElement && subTypingElement) {
    let index1 = 0,
      index2 = 0

    function typeMainText() {
      if (index1 < mainText.length) {
        mainTypingElement.textContent = mainText.substring(0, index1 + 1)
        index1++
        setTimeout(typeMainText, 100)
      } else {
        setTimeout(typeSubText, 300)
      }
    }

    function typeSubText() {
      if (index2 < subText.length) {
        subTypingElement.textContent = subText.substring(0, index2 + 1)
        index2++
        setTimeout(typeSubText, 50)
      }
    }

    typeMainText()
  }
}

// Mood tracker initialization
function initMoodTracker() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const moodOptions = document.querySelectorAll(".mood-option")
  const factorTags = document.querySelectorAll(".factor-tag")
  const moodChart = document.getElementById("mood-chart")
  const moodSubmitBtn = document.getElementById("mood-submit-btn")
  const moodNotes = document.getElementById("mood-notes")
  const moodHistoryContainer = document.getElementById("mood-history")

  // If user is not logged in, return early
  if (!currentUser) return

  // Load user's mood data
  const userMoodData = JSON.parse(localStorage.getItem(`mood_${currentUser.id}`)) || []

  // Select mood
  if (moodOptions) {
    moodOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Remove active class from all options
        moodOptions.forEach((opt) => opt.classList.remove("active"))

        // Add active class to selected option
        option.classList.add("active")
      })
    })
  }

  // Select factors
  if (factorTags) {
    factorTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        tag.classList.toggle("active")
      })
    })
  }

  // Submit mood entry
  if (moodSubmitBtn) {
    moodSubmitBtn.addEventListener("click", () => {
      const selectedMood = document.querySelector(".mood-option.active")

      if (!selectedMood) {
        showToast("Please select your mood")
        return
      }

      const moodValue = selectedMood.getAttribute("data-mood")
      const moodValueNumeric = getMoodNumericValue(moodValue)
      const selectedFactors = Array.from(document.querySelectorAll(".factor-tag.active")).map((tag) => tag.textContent)
      const notes = moodNotes ? moodNotes.value : ""

      // Create new mood entry
      const newMoodEntry = {
        date: new Date().toISOString(),
        mood: moodValue,
        moodValue: moodValueNumeric,
        factors: selectedFactors,
        notes: notes,
      }

      // Add to user's mood data
      userMoodData.push(newMoodEntry)
      localStorage.setItem(`mood_${currentUser.id}`, JSON.stringify(userMoodData))

      // Show success message
      showToast("Your mood has been recorded!")

      // Reset form
      moodOptions.forEach((opt) => opt.classList.remove("active"))
      factorTags.forEach((tag) => tag.classList.remove("active"))
      if (moodNotes) moodNotes.value = ""

      // Update chart and history
      updateMoodChart()
      updateMoodHistory()
    })
  }

  // Initialize mood chart
  if (moodChart) {
    updateMoodChart()
  }

  // Update mood history display
  if (moodHistoryContainer) {
    updateMoodHistory()
  }

  // Function to update mood chart
  function updateMoodChart() {
    if (!moodChart) return

    const ctx = moodChart.getContext("2d")

    // Get last 7 days of mood data
    const last7DaysData = userMoodData.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7)

    // If no data, show empty state
    if (last7DaysData.length === 0) {
      drawEmptyChart(ctx, moodChart.width, moodChart.height)
      return
    }

    // Format data for chart
    const chartData = last7DaysData.map((entry) => {
      const date = new Date(entry.date)
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        value: entry.moodValue,
      }
    })

    // Set canvas size
    moodChart.width = moodChart.parentElement.offsetWidth
    moodChart.height = 250

    // Draw chart
    drawMoodChart(ctx, chartData, moodChart.width, moodChart.height)

    // Redraw on window resize
    window.addEventListener("resize", () => {
      moodChart.width = moodChart.parentElement.offsetWidth
      drawMoodChart(ctx, chartData, moodChart.width, moodChart.height)
    })
  }

  // Function to update mood history
  function updateMoodHistory() {
    if (!moodHistoryContainer) return

    // Clear existing content
    moodHistoryContainer.innerHTML = ""

    // If no data, show empty state
    if (userMoodData.length === 0) {
      moodHistoryContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-history"></i>
          <p>No mood entries yet. Start tracking your mood to see your history here.</p>
        </div>
      `
      return
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...userMoodData].sort((a, b) => new Date(b.date) - new Date(a.date))

    // Create history items
    sortedEntries.slice(0, 5).forEach((entry) => {
      const date = new Date(entry.date)
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      const historyItem = document.createElement("div")
      historyItem.className = "mood-history-item"
      historyItem.innerHTML = `
        <div class="mood-history-header">
          <div class="mood-emoji">${getMoodEmoji(entry.mood)}</div>
          <div class="mood-date">${formattedDate}</div>
        </div>
        <div class="mood-history-factors">
          ${entry.factors.length > 0 ? `<p>Factors: ${entry.factors.join(", ")}</p>` : "<p>No factors selected</p>"}
        </div>
        ${entry.notes ? `<div class="mood-history-notes">${entry.notes}</div>` : ""}
      `

      moodHistoryContainer.appendChild(historyItem)
    })

    // Add "View All" button if there are more than 5 entries
    if (sortedEntries.length > 5) {
      const viewAllBtn = document.createElement("button")
      viewAllBtn.className = "view-more-btn"
      viewAllBtn.textContent = "View All Entries"
      moodHistoryContainer.appendChild(viewAllBtn)
    }
  }

  // Helper function to get mood emoji
  function getMoodEmoji(mood) {
    switch (mood) {
      case "great":
        return "😄"
      case "good":
        return "🙂"
      case "okay":
        return "😐"
      case "down":
        return "😔"
      case "struggling":
        return "😢"
      default:
        return "😐"
    }
  }

  // Helper function to get numeric value for mood
  function getMoodNumericValue(mood) {
    switch (mood) {
      case "great":
        return 5
      case "good":
        return 4
      case "okay":
        return 3
      case "down":
        return 2
      case "struggling":
        return 1
      default:
        return 3
    }
  }

  // Function to draw empty chart
  function drawEmptyChart(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-muted")
    ctx.textAlign = "center"
    ctx.font = "16px Poppins"
    ctx.fillText("No mood data yet. Start tracking your mood!", width / 2, height / 2)
  }

  // Function to draw mood chart
  function drawMoodChart(ctx, data, width, height) {
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--text-muted")
    ctx.stroke()

    // If no data, show message and return
    if (data.length === 0) {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-muted")
      ctx.textAlign = "center"
      ctx.font = "16px Poppins"
      ctx.fillText("No mood data yet", width / 2, height / 2)
      return
    }

    // Draw data points and lines
    const pointWidth = chartWidth / (data.length - 1 || 1) // Avoid division by zero

    ctx.beginPath()

    // If only one data point, just draw a point
    if (data.length === 1) {
      const x = width / 2
      const y = height - padding - (data[0].value / 5) * chartHeight
      ctx.moveTo(x, y)
      ctx.lineTo(x, y)
    } else {
      ctx.moveTo(padding, height - padding - (data[0].value / 5) * chartHeight)

      data.forEach((point, index) => {
        const x = padding + index * pointWidth
        const y = height - padding - (point.value / 5) * chartHeight

        // Draw line to this point
        if (index > 0) {
          ctx.lineTo(x, y)
        }

        // Draw day label
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-muted")
        ctx.textAlign = "center"
        ctx.fillText(point.day, x, height - padding + 20)
      })
    }

    // Style and stroke the line
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--primary-color")
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw points
    data.forEach((point, index) => {
      const x = data.length === 1 ? width / 2 : padding + index * pointWidth
      const y = height - padding - (point.value / 5) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--primary-color")
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"
      ctx.fill()
    })

    // Draw y-axis labels
    const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"]
    moodLabels.forEach((label, index) => {
      const y = height - padding - (index / 4) * chartHeight
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-muted")
      ctx.textAlign = "right"
      ctx.fillText(label, padding - 10, y + 5)
    })
  }
}

// Forums initialization
function initForums() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const forumPostForm = document.getElementById("forum-post-form")
  const forumCategory = document.getElementById("forum-category")
  const postContent = document.getElementById("post-content")
  const stayAnonymous = document.getElementById("stay-anonymous")
  const anonymousName = document.getElementById("anonymous-name")
  const forumPostsContainer = document.querySelector(".forums-preview")

  // If user is not logged in, return early
  if (!currentUser && forumPostForm) {
    forumPostForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showToast("Please log in to post in the forums")
    })
    return
  }

  // Load and display forum posts
  if (forumPostsContainer) {
    loadForumPosts()
  }

  if (forumPostForm) {
    forumPostForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const category = forumCategory.value
      const content = postContent.value
      const isAnonymous = stayAnonymous.checked
      const nameType = anonymousName.value

      // Validate form
      if (!category || !content) {
        showToast("Please fill in all required fields")
        return
      }

      // Generate anonymous name
      let displayName = currentUser.name
      if (isAnonymous) {
        if (nameType === "random") {
          const animals = ["Owl", "Fox", "Eagle", "Deer", "Wolf", "Bear", "Lion", "Tiger", "Rabbit", "Dolphin"]
          displayName = "Anonymous " + animals[Math.floor(Math.random() * animals.length)]
        } else {
          displayName = "Anonymous User"
        }
      }

      // Create new post
      const newPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        category: category,
        content: content,
        displayName: displayName,
        isAnonymous: isAnonymous,
        date: new Date().toISOString(),
        likes: 0,
        replies: [],
      }

      // Save post to localStorage
      const forumPosts = JSON.parse(localStorage.getItem("forumPosts")) || []
      forumPosts.push(newPost)
      localStorage.setItem("forumPosts", JSON.stringify(forumPosts))

      // Show success message
      showToast("Your post has been submitted!")

      // Reset form
      forumPostForm.reset()

      // Reload forum posts
      loadForumPosts()
    })
  }

  // Function to load forum posts
  function loadForumPosts() {
    if (!forumPostsContainer) return

    const forumPosts = JSON.parse(localStorage.getItem("forumPosts")) || []

    // Group posts by category
    const categorizedPosts = {}
    forumPosts.forEach((post) => {
      if (!categorizedPosts[post.category]) {
        categorizedPosts[post.category] = []
      }
      categorizedPosts[post.category].push(post)
    })

    // Clear container
    forumPostsContainer.innerHTML = ""

    // If no posts, show empty state
    if (Object.keys(categorizedPosts).length === 0) {
      forumPostsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comments"></i>
          <p>No forum posts yet. Be the first to start a discussion!</p>
        </div>
      `
      return
    }

    // Create category sections
    for (const category in categorizedPosts) {
      const categoryPosts = categorizedPosts[category]

      // Sort posts by date (newest first)
      categoryPosts.sort((a, b) => new Date(b.date) - new Date(a.date))

      // Create category section
      const categorySection = document.createElement("div")
      categorySection.className = "forum-category"
      categorySection.setAttribute("data-aos", "fade-up")

      categorySection.innerHTML = `
        <h3>${category}</h3>
        <div class="forum-posts">
          ${categoryPosts
            .slice(0, 2)
            .map((post) => createPostHTML(post))
            .join("")}
        </div>
        <button class="view-more-btn" data-category="${category}">View More</button>
      `

      forumPostsContainer.appendChild(categorySection)
    }

    // Add event listeners to "View More" buttons
    document.querySelectorAll(".view-more-btn[data-category]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category")
        showCategoryPosts(category)
      })
    })
  }

  // Function to create post HTML
  function createPostHTML(post) {
    const date = new Date(post.date)
    const timeAgo = getTimeAgo(date)

    return `
      <div class="forum-post" data-post-id="${post.id}">
        <div class="post-header">
          <span class="anonymous-user">${post.displayName}</span>
          <span class="post-time">${timeAgo}</span>
        </div>
        <p class="post-content">${post.content}</p>
        <div class="post-footer">
          <span class="post-like"><i class="fas fa-heart"></i> 0 Support</span>
          <span class="post-reply"><i class="fas fa-comment"></i> 0 Replies</span>
        </div>
      </div>
    `
  }

  // Function to show all posts in a category
  function showCategoryPosts(category) {
    // Implementation would go here - could open a modal or expand the section
    showToast(`Viewing all posts in ${category} category`)
  }

  // Helper function to format time ago
  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) {
      return interval === 1 ? "1 year ago" : `${interval} years ago`
    }

    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) {
      return interval === 1 ? "1 month ago" : `${interval} months ago`
    }

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) {
      return interval === 1 ? "1 day ago" : `${interval} days ago`
    }

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`
    }

    interval = Math.floor(seconds / 60)
    if (interval >= 1) {
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`
    }

    return "just now"
  }
}

// Challenges initialization
function initChallenges() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const challengeGrid = document.querySelector(".challenge-grid")
  const activeChallenge = document.querySelector(".active-challenge")

  // If user is not logged in, return early
  if (!currentUser) return

  // Load challenges from localStorage or initialize with defaults
  let challenges = JSON.parse(localStorage.getItem("challenges"))
  if (!challenges) {
    challenges = [
      {
        id: "1",
        title: "5-Minute Meditation",
        description: "Start each day with a short meditation to improve focus and reduce stress.",
        duration: 7,
        category: "mindfulness",
        icon: "fa-spa",
      },
      {
        id: "2",
        title: "Daily Nature Walk",
        description: "Spend 15 minutes each day walking outdoors to boost mood and energy.",
        duration: 14,
        category: "physical",
        icon: "fa-walking",
      },
      {
        id: "3",
        title: "Digital Detox",
        description: "Reduce screen time and practice being present with daily digital detox activities.",
        duration: 5,
        category: "mindfulness",
        icon: "fa-ban",
      },
      {
        id: "4",
        title: "Journaling Journey",
        description: "Develop a daily journaling habit with guided prompts for self-reflection.",
        duration: 21,
        category: "mindfulness",
        icon: "fa-book",
      },
    ]
    localStorage.setItem("challenges", JSON.stringify(challenges))
  }

  // Load user's active challenge
  const userChallenges = JSON.parse(localStorage.getItem(`challenges_${currentUser.id}`)) || {
    active: null,
    completed: [],
  }

  // Display challenges
  if (challengeGrid) {
    displayChallenges(challenges, userChallenges)
  }

  // Display active challenge if exists
  if (activeChallenge) {
    displayActiveChallenge(userChallenges, challenges)
  }

  // Function to display challenges
  function displayChallenges(challenges, userChallenges) {
    if (!challengeGrid) return

    // Clear existing challenges
    challengeGrid.innerHTML = ""

    // Display each challenge
    challenges.forEach((challenge) => {
      // Skip if this is the active challenge
      if (userChallenges.active && userChallenges.active.challengeId === challenge.id) return

      // Skip if already completed
      if (userChallenges.completed.includes(challenge.id)) return

      const challengeCard = document.createElement("div")
      challengeCard.className = "challenge-card"
      challengeCard.setAttribute("data-aos", "fade-up")
      challengeCard.setAttribute("data-challenge-id", challenge.id)

      challengeCard.innerHTML = `
      <div class="challenge-header">
        <div class="challenge-icon">
          <i class="fas ${challenge.icon}"></i>
        </div>
        <div class="challenge-info">
          <h4>${challenge.title}</h4>
          <p>${challenge.duration}-day challenge</p>
        </div>
      </div>
      <p class="challenge-description">${challenge.description}</p>
      <div class="challenge-footer">
        <button class="join-challenge-btn" data-challenge-id="${challenge.id}">Join Challenge</button>
      </div>
    `

      challengeGrid.appendChild(challengeCard)
    })

    // Add event listeners to join buttons
    document.querySelectorAll(".join-challenge-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const challengeId = btn.getAttribute("data-challenge-id")
        joinChallenge(challengeId)
      })
    })

    // If no challenges available, show message
    if (challengeGrid.children.length === 0) {
      challengeGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>You've completed all available challenges! Check back later for new ones.</p>
      </div>
    `
    }
  }

  // Function to display active challenge
  function displayActiveChallenge(userChallenges, allChallenges) {
    if (!activeChallenge) return

    const activeContent = activeChallenge.querySelector(".active-challenge-content")
    if (!activeContent) return

    // If no active challenge
    if (!userChallenges.active) {
      activeContent.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-flag-checkered"></i>
          <p>You don't have an active challenge. Join one from the list below!</p>
        </div>
      `
      return
    }

    // Get challenge details
    const challenge = allChallenges.find((c) => c.id === userChallenges.active.challengeId)
    if (!challenge) return

    // Calculate progress
    const daysPassed = Math.min(
      Math.floor((new Date() - new Date(userChallenges.active.startDate)) / (1000 * 60 * 60 * 24)) + 1,
      challenge.duration,
    )
    const progress = Math.round((daysPassed / challenge.duration) * 100)

    // Display active challenge
    activeContent.innerHTML = `
      <div class="challenge-card active">
        <div class="challenge-header">
          <div class="challenge-icon">
            <i class="fas ${challenge.icon}"></i>
          </div>
          <div class="challenge-info">
            <h4>${challenge.title}</h4>
            <p>Day ${daysPassed} of ${challenge.duration}</p>
          </div>
        </div>
        <div class="challenge-progress">
          <div class="progress-bar">
            <div class="progress" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${progress}% Complete</span>
        </div>
        <div class="today-task">
          <h5>Today's Task</h5>
          <p>${getTodayTask(challenge, daysPassed)}</p>
          <div class="task-actions">
            <button class="secondary-btn complete-task-btn">Mark Complete</button>
            <button class="text-btn skip-task-btn">Skip Today</button>
          </div>
        </div>
        <div class="challenge-streak">
          <span><i class="fas fa-fire"></i> ${userChallenges.active.streak || 0} Day Streak!</span>
        </div>
      </div>
    `

    // Add event listeners for task buttons
    const completeTaskBtn = activeContent.querySelector(".complete-task-btn")
    const skipTaskBtn = activeContent.querySelector(".skip-task-btn")

    if (completeTaskBtn) {
      completeTaskBtn.addEventListener("click", () => {
        completeTask(userChallenges, challenge)
      })
    }

    if (skipTaskBtn) {
      skipTaskBtn.addEventListener("click", () => {
        skipTask(userChallenges)
      })
    }
  }

  // Function to join a challenge
  function joinChallenge(challengeId) {
    // Get challenge details
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return

    // Update user challenges
    const userChallenges = JSON.parse(localStorage.getItem(`challenges_${currentUser.id}`)) || {
      active: null,
      completed: [],
    }

    // Check if user already has an active challenge
    if (userChallenges.active) {
      if (confirm("You already have an active challenge. Do you want to abandon it and start this new one?")) {
        // Abandon current challenge
        userChallenges.active = null
      } else {
        return
      }
    }

    // Start new challenge
    userChallenges.active = {
      challengeId: challengeId,
      startDate: new Date().toISOString(),
      currentDay: 1,
      streak: 0,
      lastCompleted: null,
    }

    // Save to localStorage
    localStorage.setItem(`challenges_${currentUser.id}`, JSON.stringify(userChallenges))

    // Show success message
    showToast(`You've joined the ${challenge.title} challenge!`)

    // Refresh displays
    displayChallenges(challenges, userChallenges)
    displayActiveChallenge(userChallenges, challenges)
  }

  // Function to complete a task
  function completeTask(userChallenges, challenge) {
    if (!userChallenges.active) return

    // Update streak
    userChallenges.active.streak = (userChallenges.active.streak || 0) + 1
    userChallenges.active.lastCompleted = new Date().toISOString()

    // Check if challenge is completed
    const daysPassed = Math.floor((new Date() - new Date(userChallenges.active.startDate)) / (1000 * 60 * 60 * 24)) + 1

    if (daysPassed >= challenge.duration) {
      // Challenge completed
      userChallenges.completed.push(userChallenges.active.challengeId)
      userChallenges.active = null

      showToast("Congratulations! You've completed the challenge!")
    } else {
      showToast("Great job! Task marked as complete.")
    }

    // Save to localStorage
    localStorage.setItem(`challenges_${currentUser.id}`, JSON.stringify(userChallenges))

    // Refresh displays
    displayChallenges(challenges, userChallenges)
    displayActiveChallenge(userChallenges, challenges)
  }

  // Function to skip a task
  function skipTask(userChallenges) {
    if (!userChallenges.active) return

    // Reset streak
    userChallenges.active.streak = 0
    userChallenges.active.lastCompleted = new Date().toISOString()

    // Save to localStorage
    localStorage.setItem(`challenges_${currentUser.id}`, JSON.stringify(userChallenges))

    // Show message
    showToast("Task skipped. You can try again tomorrow!")

    // Refresh displays
    displayActiveChallenge(userChallenges, challenges)
  }

  // Helper function to get today's task
  function getTodayTask(challenge, day) {
    // In a real app, each challenge would have daily tasks defined
    // For this demo, we'll generate tasks based on the challenge type
    const tasks = {
      mindfulness: [
        "Meditate for 5 minutes in the morning",
        "Practice deep breathing for 2 minutes, three times today",
        "Take a mindful walk, paying attention to your surroundings",
        "Practice gratitude by writing down 3 things you're thankful for",
        "Do a body scan meditation before bed",
        "Practice mindful eating during one meal today",
        "Spend 5 minutes in silence, just observing your thoughts",
      ],
      physical: [
        "Take a 15-minute walk outside",
        "Do 10 minutes of stretching",
        "Try a new physical activity for 20 minutes",
        "Do 3 sets of 10 push-ups or modified push-ups",
        "Take the stairs instead of the elevator today",
        "Do a 10-minute yoga session",
        "Dance to your favorite song for 5 minutes",
      ],
      social: [
        "Reach out to a friend you haven't spoken to in a while",
        "Give someone a genuine compliment",
        "Practice active listening in a conversation today",
        "Attend a social event or club meeting",
        "Share something positive with a classmate or colleague",
        "Ask someone how they're really doing and listen fully",
        "Express gratitude to someone who has helped you",
      ],
      academic: [
        "Study in a new location today",
        "Try the Pomodoro technique (25 min work, 5 min break)",
        "Create a mind map for a topic you're studying",
        "Teach someone else something you've learned",
        "Review your notes from a recent class",
        "Set specific goals for your study session",
        "Try a new study method you haven't used before",
      ],
    }

    // Get tasks for this challenge category
    const categoryTasks = tasks[challenge.category] || tasks.mindfulness

    // Return task based on day (cycling through available tasks)
    return categoryTasks[day % categoryTasks.length]
  }
}

// Events initialization
function initEvents() {
  const calendarNav = document.querySelectorAll(".calendar-nav")
  const calendarDates = document.getElementById("calendar-dates")
  const currentMonthElement = document.getElementById("current-month")
  const upcomingEvents = document.querySelector(".event-list")

  // Track current displayed month and year
  let currentDisplayMonth
  let currentDisplayYear

  // Generate calendar
  if (calendarDates && currentMonthElement) {
    const today = new Date()
    currentDisplayMonth = today.getMonth()
    currentDisplayYear = today.getFullYear()

    generateCalendar(currentDisplayMonth, currentDisplayYear)

    // Calendar navigation
    if (calendarNav) {
      calendarNav.forEach((nav) => {
        nav.addEventListener("click", () => {
          const direction = nav.querySelector("i").classList.contains("fa-chevron-left") ? -1 : 1

          // Update current display month and year
          if (direction === 1) {
            if (currentDisplayMonth === 11) {
              currentDisplayMonth = 0
              currentDisplayYear++
            } else {
              currentDisplayMonth++
            }
          } else {
            if (currentDisplayMonth === 0) {
              currentDisplayMonth = 11
              currentDisplayYear--
            } else {
              currentDisplayMonth--
            }
          }

          generateCalendar(currentDisplayMonth, currentDisplayYear)
        })
      })
    }
  }

  // Load events
  if (upcomingEvents) {
    loadEvents()
  }

  // Function to generate calendar
  function generateCalendar(month, year) {
    if (!calendarDates || !currentMonthElement) return

    const today = new Date()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Update month display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    currentMonthElement.textContent = `${monthNames[month]} ${year}`

    // Clear previous calendar
    calendarDates.innerHTML = ""

    // Get previous month's last day
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

    // Add previous month's days
    for (let i = 0; i < startingDay; i++) {
      const dayNum = prevMonthLastDay - startingDay + i + 1
      const dayElement = document.createElement("span")
      dayElement.textContent = dayNum
      dayElement.classList.add("prev-month")
      dayElement.setAttribute("data-date", `${prevMonthYear}-${prevMonth + 1}-${dayNum}`)
      calendarDates.appendChild(dayElement)
    }

    // Get events for this month
    const events = getEventsForMonth(month, year)

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("span")
      dayElement.textContent = i
      dayElement.setAttribute("data-date", `${year}-${month + 1}-${i}`)

      // Check if this is today
      if (today.getDate() === i && today.getMonth() === month && today.getFullYear() === year) {
        dayElement.classList.add("current-day")
      }

      // Check if this day has events
      const hasEvents = events.some((event) => {
        const eventDate = new Date(event.date)
        return eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year
      })

      if (hasEvents) {
        dayElement.classList.add("has-event")
      }

      dayElement.addEventListener("click", () => {
        // Remove selected-day class from all dates
        document.querySelectorAll(".calendar-dates span").forEach((date) => {
          date.classList.remove("selected-day")
        })

        // Add selected-day class to clicked date
        dayElement.classList.add("selected-day")

        // Show events for this day
        const selectedDate = new Date(year, month, i)
        showEventsForDate(selectedDate)
      })

      calendarDates.appendChild(dayElement)
    }

    // Calculate how many days from next month to show
    const totalDaysDisplayed = startingDay + daysInMonth
    const remainingDays = 7 - (totalDaysDisplayed % 7)

    // Add next month's days to fill the grid (if needed)
    if (remainingDays < 7) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextMonthYear = month === 11 ? year + 1 : year

      for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement("span")
        dayElement.textContent = i
        dayElement.classList.add("next-month")
        dayElement.setAttribute("data-date", `${nextMonthYear}-${nextMonth + 1}-${i}`)
        calendarDates.appendChild(dayElement)
      }
    }

    // Add extra rows if needed to make the calendar look more balanced
    const totalCells = calendarDates.children.length
    if (totalCells <= 35) {
      // If we have 5 rows or less
      const nextMonth = month === 11 ? 0 : month + 1
      const nextMonthYear = month === 11 ? year + 1 : year
      const daysToAdd = 42 - totalCells // Add enough days to make 6 rows

      let nextMonthDay = remainingDays < 7 ? remainingDays + 1 : 1

      for (let i = 0; i < daysToAdd; i++) {
        const dayElement = document.createElement("span")
        dayElement.textContent = nextMonthDay
        dayElement.classList.add("next-month")
        dayElement.setAttribute("data-date", `${nextMonthYear}-${nextMonth + 1}-${nextMonthDay}`)
        calendarDates.appendChild(dayElement)
        nextMonthDay++
      }
    }
  }

  // Function to load events
  function loadEvents() {
    if (!upcomingEvents) return

    // Get events from localStorage or use defaults
    let events = JSON.parse(localStorage.getItem("events"))

    if (!events) {
      // Create some default events
      const today = new Date()

      // Create event for tomorrow
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Create event for next week
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      // Create event for two weeks from now
      const twoWeeks = new Date(today)
      twoWeeks.setDate(twoWeeks.getDate() + 14)

      // Create event for this month
      const thisMonth = new Date(today)
      thisMonth.setDate(today.getDate() + Math.floor(Math.random() * 10) + 3)

      events = [
        {
          id: "1",
          title: "Mindfulness Workshop",
          date: tomorrow.toISOString(),
          time: "2:00 PM - 3:30 PM",
          location: "Student Activity Center",
          description:
            "Learn practical mindfulness techniques to reduce stress and improve focus. No prior meditation experience required.",
          category: "Workshop",
        },
        {
          id: "2",
          title: "Anxiety Support Group",
          date: nextWeek.toISOString(),
          time: "5:00 PM - 6:30 PM",
          location: "Counseling Center, Group Room",
          description:
            "A facilitated peer support group for students experiencing anxiety. Share experiences and coping strategies in a safe space.",
          category: "Support Group",
        },
        {
          id: "3",
          title: "Stress Management Seminar",
          date: twoWeeks.toISOString(),
          time: "3:00 PM - 4:30 PM",
          location: "Library Conference Room",
          description: "Learn effective techniques to manage academic stress and maintain balance during exam periods.",
          category: "Seminar",
        },
        {
          id: "4",
          title: "Yoga for Mental Wellness",
          date: thisMonth.toISOString(),
          time: "10:00 AM - 11:00 AM",
          location: "Student Recreation Center",
          description:
            "A gentle yoga session focused on reducing anxiety and improving mental clarity. All experience levels welcome.",
          category: "Fitness",
        },
      ]

      localStorage.setItem("events", JSON.stringify(events))
    }

    // Display upcoming events
    displayUpcomingEvents(events)

    // Highlight days with events on the calendar
    highlightEventDays(events)
  }

  // Function to highlight days with events on the calendar
  function highlightEventDays(events) {
    if (!calendarDates) return

    const dateElements = calendarDates.querySelectorAll("span")

    dateElements.forEach((dateElement) => {
      const dateAttr = dateElement.getAttribute("data-date")
      if (!dateAttr) return

      const [year, month, day] = dateAttr.split("-").map((num) => Number.parseInt(num))

      // Check if any events fall on this date
      const hasEvent = events.some((event) => {
        const eventDate = new Date(event.date)
        return eventDate.getDate() === day && eventDate.getMonth() === month - 1 && eventDate.getFullYear() === year
      })

      if (hasEvent) {
        dateElement.classList.add("has-event")
      }
    })
  }

  // Function to display upcoming events
  function displayUpcomingEvents(events) {
    if (!upcomingEvents) return

    // Clear container
    upcomingEvents.innerHTML = ""

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

    // Filter for future events
    const futureEvents = sortedEvents.filter((event) => new Date(event.date) >= new Date())

    // If no events, show empty state
    if (futureEvents.length === 0) {
      upcomingEvents.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>No upcoming events. Check back later!</p>
        </div>
      `
      return
    }

    // Display events
    futureEvents.slice(0, 3).forEach((event) => {
      const eventDate = new Date(event.date)
      const eventCard = document.createElement("div")
      eventCard.className = "event-card"
      eventCard.setAttribute("data-aos", "fade-up")

      eventCard.innerHTML = `
        <div class="event-date">
          <span class="event-day">${eventDate.getDate()}</span>
          <span class="event-month">${eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase()}</span>
        </div>
        <div class="event-details">
          <h4>${event.title}</h4>
          <p class="event-time"><i class="fas fa-clock"></i> ${event.time}</p>
          <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
          <p class="event-description">${event.description}</p>
          <div class="event-footer">
            <span class="event-category">${event.category}</span>
            <button class="secondary-btn add-calendar-btn" data-event-id="${event.id}">Add to Calendar</button>
          </div>
        </div>
      `

      upcomingEvents.appendChild(eventCard)
    })

    // Add "View All" button if there are more than 3 events
    if (futureEvents.length > 3) {
      const viewAllBtn = document.createElement("button")
      viewAllBtn.className = "view-more-btn"
      viewAllBtn.textContent = "View All Events"
      upcomingEvents.appendChild(viewAllBtn)

      viewAllBtn.addEventListener("click", () => {
        showAllEvents(futureEvents)
      })
    }

    // Add event listeners to calendar buttons
    document.querySelectorAll(".add-calendar-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const eventId = btn.getAttribute("data-event-id")
        addToCalendar(eventId)
      })
    })
  }

  // Function to show events for a specific date
  function showEventsForDate(date) {
    const events = JSON.parse(localStorage.getItem("events")) || []

    // Filter events for this date
    const dateEvents = events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })

    // Create a modal to display events
    if (dateEvents.length > 0) {
      // Remove any existing event modal
      const existingModal = document.getElementById("event-modal")
      if (existingModal) {
        existingModal.remove()
      }

      // Create modal
      const modal = document.createElement("div")
      modal.id = "event-modal"
      modal.className = "event-modal"

      // Format date for display
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Create modal content
      modal.innerHTML = `
        <div class="event-modal-content">
          <div class="event-modal-header">
            <h3>Events on ${formattedDate}</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
          </div>
          <div class="event-modal-body">
            ${dateEvents
              .map(
                (event) => `
              <div class="modal-event-card">
                <div class="modal-event-time">${event.time}</div>
                <div class="modal-event-details">
                  <h4>${event.title}</h4>
                  <p class="modal-event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                  <p class="modal-event-description">${event.description}</p>
                  <span class="event-category">${event.category}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `

      // Add modal to body
      document.body.appendChild(modal)

      // Show modal with animation
      setTimeout(() => {
        modal.classList.add("active")
      }, 10)

      // Close modal when clicking the close button
      modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.classList.remove("active")
        setTimeout(() => {
          modal.remove()
        }, 300)
      })

      // Close modal when clicking outside the content
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
          setTimeout(() => {
            modal.remove()
          }, 300)
        }
      })
    } else {
      showToast(`No events on ${date.toLocaleDateString()}`)
    }
  }

  // Function to show all events
  function showAllEvents(events) {
    // Create a modal to display all events
    const existingModal = document.getElementById("all-events-modal")
    if (existingModal) {
      existingModal.remove()
    }

    // Group events by month
    const eventsByMonth = {}
    events.forEach((event) => {
      const eventDate = new Date(event.date)
      const monthYear = eventDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = []
      }

      eventsByMonth[monthYear].push(event)
    })

    // Create modal
    const modal = document.createElement("div")
    modal.id = "all-events-modal"
    modal.className = "event-modal"

    // Create modal content
    let modalContent = `
      <div class="event-modal-content all-events">
        <div class="event-modal-header">
          <h3>All Upcoming Events</h3>
          <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="event-modal-body">
    `

    // Add events grouped by month
    for (const monthYear in eventsByMonth) {
      modalContent += `<h4 class="month-divider">${monthYear}</h4>`

      eventsByMonth[monthYear].forEach((event) => {
        const eventDate = new Date(event.date)
        const formattedDate = eventDate.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        })

        modalContent += `
          <div class="modal-event-card">
            <div class="modal-event-date">${formattedDate}</div>
            <div class="modal-event-time">${event.time}</div>
            <div class="modal-event-details">
              <h4>${event.title}</h4>
              <p class="modal-event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
              <p class="modal-event-description">${event.description}</p>
              <div class="modal-event-footer">
                <span class="event-category">${event.category}</span>
                <button class="secondary-btn add-calendar-btn" data-event-id="${event.id}">Add to Calendar</button>
              </div>
            </div>
          </div>
        `
      })
    }

    modalContent += `
        </div>
      </div>
    `

    modal.innerHTML = modalContent

    // Add modal to body
    document.body.appendChild(modal)

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add("active")
    }, 10)

    // Close modal when clicking the close button
    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.classList.remove("active")
      setTimeout(() => {
        modal.remove()
      }, 300)
    })

    // Close modal when clicking outside the content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
        setTimeout(() => {
          modal.remove()
        }, 300)
      }
    })

    // Add event listeners to calendar buttons
    modal.querySelectorAll(".add-calendar-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const eventId = btn.getAttribute("data-event-id")
        addToCalendar(eventId)
      })
    })
  }

  // Function to add event to calendar
  function addToCalendar(eventId) {
    const events = JSON.parse(localStorage.getItem("events")) || []
    const event = events.find((e) => e.id === eventId)

    if (!event) return

    // In a real app, this would integrate with the device's calendar
    // For now, we'll just show a success message and simulate adding to calendar

    // Create a toast with more details
    const toast = document.createElement("div")
    toast.className = "calendar-toast"

    const eventDate = new Date(event.date)
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    toast.innerHTML = `
      <div class="calendar-toast-content">
        <div class="calendar-toast-header">
          <i class="fas fa-calendar-check"></i>
          <h4>Added to Calendar</h4>
          <button class="close-toast"><i class="fas fa-times"></i></button>
        </div>
        <div class="calendar-toast-body">
          <p><strong>${event.title}</strong></p>
          <p>${formattedDate}, ${event.time}</p>
          <p>${event.location}</p>
        </div>
      </div>
    `

    document.body.appendChild(toast)

    // Show toast with animation
    setTimeout(() => {
      toast.classList.add("show")
    }, 10)

    // Close toast when clicking the close button
    toast.querySelector(".close-toast").addEventListener("click", () => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.remove()
      }, 300)
    })

    // Auto-close toast after 5 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.remove("show")
        setTimeout(() => {
          if (document.body.contains(toast)) {
            toast.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Helper function to get events for a specific month
  function getEventsForMonth(month, year) {
    const events = JSON.parse(localStorage.getItem("events")) || []

    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getMonth() === month && eventDate.getFullYear() === year
    })
  }
}

// Make feature cards clickable to navigate to corresponding sections
function initFeatureCardLinks() {
  const featureCards = document.querySelectorAll(".features-grid .feature-card")

  featureCards.forEach((card) => {
    card.style.cursor = "pointer"

    // Extract section ID from the card title
    const titleElement = card.querySelector("h3")
    if (!titleElement) return

    const title = titleElement.textContent.trim().toLowerCase()
    let targetSection = ""

    // Map card titles to section IDs
    if (title.includes("anonymous forums")) {
      targetSection = "forums"
    } else if (title.includes("peer connection")) {
      targetSection = "connect"
    } else if (title.includes("mood tracking")) {
      targetSection = "track"
    } else if (title.includes("wellness challenges")) {
      targetSection = "challenges"
    } else if (title.includes("resource library")) {
      targetSection = "resources"
    } else if (title.includes("event board")) {
      targetSection = "events"
    }

    if (targetSection) {
      card.addEventListener("click", () => {
        const section = document.getElementById(targetSection)
        if (section) {
          // Add a subtle highlight effect to the target section
          section.classList.add("section-highlight")

          // Remove the highlight after animation completes
          setTimeout(() => {
            section.classList.remove("section-highlight")
          }, 2000)

          // Scroll to the section
          const headerOffset = 80
          const sectionPosition = section.getBoundingClientRect().top
          const offsetPosition = sectionPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      })
    }
  })
}

// Smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")

      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Close mobile menu if open
        const navLinks = document.querySelector(".nav-links")
        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active")

          const icon = document.querySelector(".mobile-menu-btn i")
          if (icon) {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }

        // Scroll to target with offset for header
        const headerOffset = 80
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .connection-card, .challenge-card, .resource-card, .event-card, .emergency-card",
  )

  // Initial check for elements in viewport
  checkElementsInViewport()

  // Check on scroll
  window.addEventListener("scroll", checkElementsInViewport)

  function checkElementsInViewport() {
    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("fade-in")
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

// Set current date
function setCurrentDate() {
  const currentDateElement = document.getElementById("current-date")
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }
}

// Back to Home button initialization
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
      }, 500)

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

