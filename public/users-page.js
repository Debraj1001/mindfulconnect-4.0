// Import supabase client
import { supabase } from "./supabaseClient.js"

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Hide transition overlay on page load
  const transitionOverlay = document.getElementById("transition-overlay")
  if (transitionOverlay) {
    transitionOverlay.classList.remove("active")
  }

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login page if not authenticated
    window.location.href = "auth.mjs"
    return
  }

  // Initialize users page
  initUsersPage()
})

// Initialize users page
async function initUsersPage() {
  // Get DOM elements
  const usersList = document.getElementById("users-list")
  const userSearch = document.getElementById("user-search")
  const searchBtn = document.getElementById("search-btn")
  const statusFilter = document.getElementById("status-filter")
  const pagination = document.getElementById("pagination")

  // Set up state variables
  let currentPage = 1
  const usersPerPage = 12
  let totalUsers = 0
  let searchQuery = ""
  let statusFilterValue = "all"

  // Load initial users
  await loadUsers()

  // Set up event listeners
  userSearch.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchQuery = userSearch.value.trim()
      currentPage = 1
      loadUsers()
    }
  })

  searchBtn.addEventListener("click", () => {
    searchQuery = userSearch.value.trim()
    currentPage = 1
    loadUsers()
  })

  statusFilter.addEventListener("change", () => {
    statusFilterValue = statusFilter.value
    currentPage = 1
    loadUsers()
  })

  // Function to load users
  async function loadUsers() {
    try {
      // Show loading state
      usersList.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>
          <p>Loading users...</p>
        </div>
      `

      // Build query
      let query = supabase.from("profiles").select("*", { count: "exact" })

      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(
          `full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
        )
      }

      // Apply status filter if not "all"
      if (statusFilterValue !== "all") {
        const isOnline = statusFilterValue === "online"
        query = query.eq("is_online", isOnline)
      }

      // Calculate pagination
      const from = (currentPage - 1) * usersPerPage
      const to = from + usersPerPage - 1

      // Execute query with pagination
      const { data: users, count, error } = await query.order("created_at", { ascending: false }).range(from, to)

      if (error) throw error

      // Update total users count
      totalUsers = count || 0

      // Clear loading state
      usersList.innerHTML = ""

      // If no users found
      if (!users || users.length === 0) {
        usersList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-users"></i>
            <p>No users found. Try adjusting your search criteria.</p>
          </div>
        `
        pagination.innerHTML = ""
        return
      }

      // Render users
      users.forEach((user) => {
        const userCard = document.createElement("div")
        userCard.className = "user-card"
        userCard.setAttribute("data-user-id", user.id)

        // Format joined date
        const joinedDate = new Date(user.created_at).toLocaleDateString()

        // Truncate bio if too long
        const bio = user.bio || "No bio available"
        const truncatedBio = bio.length > 100 ? bio.substring(0, 100) + "..." : bio

        userCard.innerHTML = `
          <div class="user-card-header">
            <div class="user-avatar">
              <img src="${user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id}" alt="${user.full_name || "User"} Avatar">
              <span class="status-indicator ${user.is_online ? "online" : "offline"}"></span>
            </div>
            <div class="user-info">
              <h3>${user.full_name || "Anonymous User"}</h3>
              <p>@${user.username || user.id.substring(0, 8)}</p>
            </div>
          </div>
          <div class="user-bio">
            <p>${truncatedBio}</p>
          </div>
          <div class="user-actions">
            <button class="primary-btn view-profile-btn" data-user-id="${user.id}">
              <i class="fas fa-user"></i> View Profile
            </button>
            <button class="secondary-btn message-btn" data-user-id="${user.id}">
              <i class="fas fa-comment"></i> Message
            </button>
          </div>
        `

        usersList.appendChild(userCard)
      })

      // Set up view profile buttons
      document.querySelectorAll(".view-profile-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const userId = btn.getAttribute("data-user-id")
          openUserProfileModal(userId)
        })
      })

      // Set up message buttons
      document.querySelectorAll(".message-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const userId = btn.getAttribute("data-user-id")
          // Implement message functionality
          alert("Messaging feature coming soon!")
        })
      })

      // Update pagination
      updatePagination()
    } catch (error) {
      console.error("Error loading users:", error)
      usersList.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error loading users. Please try again later.</p>
        </div>
      `
    }
  }

  // Function to update pagination
  function updatePagination() {
    const totalPages = Math.ceil(totalUsers / usersPerPage)

    if (totalPages <= 1) {
      pagination.innerHTML = ""
      return
    }

    let paginationHTML = ""

    // Previous button
    paginationHTML += `
      <button class="pagination-btn ${currentPage === 1 ? "disabled" : ""}" 
        ${currentPage === 1 ? "disabled" : 'data-page="prev"'}>
        <i class="fas fa-chevron-left"></i>
      </button>
    `

    // Page numbers
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">
          ${i}
        </button>
      `
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`
      }
      paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`
    }

    // Next button
    paginationHTML += `
      <button class="pagination-btn ${currentPage === totalPages ? "disabled" : ""}" 
        ${currentPage === totalPages ? "disabled" : 'data-page="next"'}>
        <i class="fas fa-chevron-right"></i>
      </button>
    `

    pagination.innerHTML = paginationHTML

    // Add event listeners to pagination buttons
    document.querySelectorAll(".pagination-btn:not(.disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = btn.getAttribute("data-page")

        if (page === "prev") {
          currentPage--
        } else if (page === "next") {
          currentPage++
        } else {
          currentPage = Number.parseInt(page)
        }

        loadUsers()

        // Scroll to top of users section
        document.querySelector(".users-section").scrollIntoView({ behavior: "smooth" })
      })
    })
  }

  // Function to open user profile modal
  async function openUserProfileModal(userId) {
    try {
      const modal = document.getElementById("user-profile-modal")
      const modalUserName = document.getElementById("modal-user-name")
      const modalUserEmail = document.getElementById("modal-user-email")
      const modalUserJoined = document.getElementById("modal-user-joined")
      const modalUserAvatar = document.getElementById("modal-user-avatar")
      const modalUserStatus = document.getElementById("modal-user-status")
      const modalUserBio = document.getElementById("modal-user-bio")
      const modalUserPosts = document.getElementById("modal-user-posts")
      const modalUserConnections = document.getElementById("modal-user-connections")
      const modalUserChallenges = document.getElementById("modal-user-challenges")

      // Set loading state
      modalUserName.textContent = "Loading..."
      modalUserEmail.textContent = "Loading..."
      modalUserJoined.textContent = "Joined: Loading..."
      modalUserBio.textContent = "Loading..."
      modalUserPosts.textContent = "0"
      modalUserConnections.textContent = "0"
      modalUserChallenges.textContent = "0"

      // Show modal
      modal.classList.add("active")

      // Fetch user data
      const { data: user, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error

      // Update modal with user data
      modalUserName.textContent = user.full_name || "Anonymous User"
      modalUserEmail.textContent = user.email || "No email available"

      const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      modalUserJoined.textContent = `Joined: ${joinedDate}`

      modalUserAvatar.src = user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      modalUserStatus.className = `status-indicator ${user.is_online ? "online" : "offline"}`
      modalUserBio.textContent = user.bio || "No bio available"

      // Fetch user stats
      const { count: postsCount } = await supabase.from("posts").select("*", { count: "exact" }).eq("user_id", userId)

      const { count: connectionsCount } = await supabase
        .from("connections")
        .select("*", { count: "exact" })
        .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`)

      const { count: challengesCount } = await supabase
        .from("user_challenges")
        .select("*", { count: "exact" })
        .eq("user_id", userId)

      // Update stats
      modalUserPosts.textContent = postsCount || "0"
      modalUserConnections.textContent = connectionsCount || "0"
      modalUserChallenges.textContent = challengesCount || "0"

      // Set up connect button
      const connectBtn = document.getElementById("connect-btn")
      connectBtn.addEventListener("click", async () => {
        try {
          const {
            data: { user: currentUser },
          } = await supabase.auth.getUser()

          if (!currentUser) {
            alert("Please log in to connect with users")
            return
          }

          if (currentUser.id === userId) {
            alert("You cannot connect with yourself")
            return
          }

          // Check if already connected
          const { data: existingConnection, error: connectionError } = await supabase
            .from("connections")
            .select("*")
            .or(
              `and(user_id.eq.${currentUser.id},connected_user_id.eq.${userId}),and(user_id.eq.${userId},connected_user_id.eq.${currentUser.id})`,
            )
            .single()

          if (connectionError && connectionError.code !== "PGRST116") {
            throw connectionError
          }

          if (existingConnection) {
            alert("You are already connected with this user")
            return
          }

          // Create connection
          const { error: createError } = await supabase.from("connections").insert([
            {
              user_id: currentUser.id,
              connected_user_id: userId,
              status: "pending",
            },
          ])

          if (createError) throw createError

          alert("Connection request sent!")
          connectBtn.textContent = "Request Sent"
          connectBtn.disabled = true
        } catch (error) {
          console.error("Error connecting with user:", error)
          alert("Error connecting with user. Please try again later.")
        }
      })

      // Set up message button
      const messageBtn = document.getElementById("message-btn")
      messageBtn.addEventListener("click", () => {
        alert("Messaging feature coming soon!")
      })
    } catch (error) {
      console.error("Error opening user profile:", error)
      alert("Error loading user profile. Please try again later.")
    }
  }

  // Set up close modal button
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("user-profile-modal").classList.remove("active")
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("user-profile-modal")
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })

  // Set up real-time subscription for user status changes
  const subscription = supabase
    .channel("public:profiles")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
      },
      (payload) => {
        // Update user status in the UI
        const userId = payload.new.id
        const isOnline = payload.new.is_online

        // Update in user list
        const userCard = document.querySelector(`.user-card[data-user-id="${userId}"]`)
        if (userCard) {
          const statusIndicator = userCard.querySelector(".status-indicator")
          if (statusIndicator) {
            statusIndicator.className = `status-indicator ${isOnline ? "online" : "offline"}`
          }
        }

        // Update in modal if open
        const modal = document.getElementById("user-profile-modal")
        if (modal.classList.contains("active")) {
          const modalUserId = document.querySelector(".view-profile-btn").getAttribute("data-user-id")
          if (modalUserId === userId) {
            const modalStatusIndicator = document.getElementById("modal-user-status")
            if (modalStatusIndicator) {
              modalStatusIndicator.className = `status-indicator ${isOnline ? "online" : "offline"}`
            }
          }
        }
      },
    )
    .subscribe()
}

