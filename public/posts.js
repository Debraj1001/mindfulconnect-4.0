import supabase from "./supabase-client.js"

// Posts management functions

// Create a new post
async function createPost(content, category, isAnonymous, displayName) {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error("You must be logged in to create a post")

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: user.id,
          content,
          category,
          is_anonymous: isAnonymous,
          display_name: displayName,
        },
      ])
      .select()

    if (error) throw error

    showToast("Post created successfully!")
    return data[0]
  } catch (error) {
    showToast(error.message || "Error creating post")
    console.error("Error creating post:", error)
    return null
  }
}

// Get all posts
async function getPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (username, avatar_url, full_name)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// Get posts by category
async function getPostsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (username, avatar_url, full_name)
      `)
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching posts by category:", error)
    return []
  }
}

// Delete a post
async function deletePost(postId) {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error("You must be logged in to delete a post")

    // First check if the post belongs to the current user
    const { data: post, error: fetchError } = await supabase.from("posts").select("user_id").eq("id", postId).single()

    if (fetchError) throw fetchError

    if (!post || post.user_id !== user.id) {
      throw new Error("You can only delete your own posts")
    }

    const { error } = await supabase.from("posts").delete().eq("id", postId)

    if (error) throw error

    showToast("Post deleted successfully!")
    return true
  } catch (error) {
    showToast(error.message || "Error deleting post")
    console.error("Error deleting post:", error)
    return false
  }
}

// Initialize posts section
async function initPostsSection() {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Set up post form submission
  const forumPostForm = document.getElementById("forum-post-form")
  if (forumPostForm) {
    forumPostForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (!user) {
        showToast("Please log in to post")
        return
      }

      const category = document.getElementById("forum-category").value
      const content = document.getElementById("post-content").value
      const isAnonymous = document.getElementById("stay-anonymous").checked
      const nameType = document.getElementById("anonymous-name").value

      // Validate form
      if (!category || !content) {
        showToast("Please fill in all required fields")
        return
      }

      // Generate display name
      let displayName = user.user_metadata?.full_name || user.email.split("@")[0]
      if (isAnonymous) {
        if (nameType === "random") {
          const animals = ["Owl", "Fox", "Eagle", "Deer", "Wolf", "Bear", "Lion", "Tiger", "Rabbit", "Dolphin"]
          displayName = "Anonymous " + animals[Math.floor(Math.random() * animals.length)]
        } else {
          displayName = "Anonymous User"
        }
      }

      // Show loading state
      const submitBtn = forumPostForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...'

      try {
        // Create post
        const post = await createPost(content, category, isAnonymous, displayName)

        if (post) {
          // Reset form
          forumPostForm.reset()
        }
      } finally {
        // Reset button state
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }
    })
  }

  // Load posts
  await loadPosts()

  // Set up category tabs
  const categoryTabs = document.querySelectorAll(".category-tab")
  if (categoryTabs) {
    categoryTabs.forEach((tab) => {
      tab.addEventListener("click", async () => {
        // Remove active class from all tabs
        categoryTabs.forEach((t) => t.classList.remove("active"))

        // Add active class to clicked tab
        tab.classList.add("active")

        // Get category
        const category = tab.getAttribute("data-category")

        // Load posts for this category
        if (category === "all") {
          await loadPosts()
        } else {
          await loadPostsByCategory(category)
        }
      })
    })
  }
}

// Load all posts
async function loadPosts() {
  const forumPostsContainer = document.querySelector(".forums-preview")
  if (!forumPostsContainer) return

  // Show loading state
  forumPostsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading posts...</div>'

  // Get posts
  const posts = await getPosts()

  // Group posts by category
  const categorizedPosts = {}
  posts.forEach((post) => {
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
      loadPostsByCategory(category)
    })
  })

  // Add event listeners to delete buttons
  addDeleteButtonListeners()

  // Set up real-time subscription for new posts
  setupPostsSubscription()
}

// Load posts by category
async function loadPostsByCategory(category) {
  const forumPostsContainer = document.querySelector(".forums-preview")
  if (!forumPostsContainer) return

  // Show loading state
  forumPostsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading posts...</div>'

  // Get posts
  const posts = await getPostsByCategory(category)

  // Clear container
  forumPostsContainer.innerHTML = ""

  // If no posts, show empty state
  if (posts.length === 0) {
    forumPostsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-comments"></i>
        <p>No posts in the ${category} category yet. Be the first to start a discussion!</p>
      </div>
    `
    return
  }

  // Create category section
  const categorySection = document.createElement("div")
  categorySection.className = "forum-category"

  categorySection.innerHTML = `
    <h3>${category}</h3>
    <div class="forum-posts">
      ${posts.map((post) => createPostHTML(post)).join("")}
    </div>
    <button class="back-btn">Back to All Categories</button>
  `

  forumPostsContainer.appendChild(categorySection)

  // Add event listener to "Back" button
  document.querySelector(".back-btn").addEventListener("click", loadPosts)

  // Add event listeners to delete buttons
  addDeleteButtonListeners()
}

// Create post HTML
async function createPostHTML(post) {
  const date = new Date(post.created_at)
  const timeAgo = getTimeAgo(date)

  // Check if current user is the post author
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isCurrentUserPost = user && user.id === post.user_id

  return `
    <div class="forum-post" data-post-id="${post.id}">
      <div class="post-header">
        <div class="post-author">
          ${
            !post.is_anonymous && post.profiles
              ? `<img src="${post.profiles.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + post.user_id}" alt="Avatar" class="post-avatar">`
              : '<div class="anonymous-avatar"><i class="fas fa-user-secret"></i></div>'
          }
          <span class="post-username">${post.display_name}</span>
        </div>
        <span class="post-time">${timeAgo}</span>
      </div>
      <p class="post-content">${post.content}</p>
      <div class="post-footer">
        <span class="post-like"><i class="fas fa-heart"></i> 0 Support</span>
        <span class="post-reply"><i class="fas fa-comment"></i> 0 Replies</span>
        ${
          isCurrentUserPost
            ? `<span class="post-delete" data-post-id="${post.id}"><i class="fas fa-trash"></i> Delete</span>`
            : ""
        }
      </div>
    </div>
  `
}

// Add event listeners to delete buttons
function addDeleteButtonListeners() {
  document.querySelectorAll(".post-delete").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      const postId = deleteBtn.getAttribute("data-post-id")

      // Show confirmation dialog
      if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        // Show loading state
        const originalHTML = deleteBtn.innerHTML
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...'
        deleteBtn.style.pointerEvents = "none"

        const success = await deletePost(postId)

        if (success) {
          // Remove post from DOM
          const postElement = document.querySelector(`.forum-post[data-post-id="${postId}"]`)
          if (postElement) {
            postElement.style.opacity = "0"
            setTimeout(() => {
              postElement.remove()

              // Check if category is now empty
              const categorySection = deleteBtn.closest(".forum-category")
              const remainingPosts = categorySection.querySelectorAll(".forum-post")

              if (remainingPosts.length === 0) {
                // Reload all posts to show empty state
                loadPosts()
              }
            }, 300)
          }
        } else {
          // Reset button state
          deleteBtn.innerHTML = originalHTML
          deleteBtn.style.pointerEvents = "auto"
        }
      }
    })
  })
}

// Set up real-time subscription for posts
function setupPostsSubscription() {
  // Unsubscribe from any existing subscription
  if (window.postsSubscription) {
    supabase.removeChannel(window.postsSubscription)
  }

  // Subscribe to changes in the posts table
  window.postsSubscription = supabase
    .channel("public:posts")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, handleNewPost)
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "posts" }, handleDeletedPost)
    .subscribe()
}

// Handle new post from real-time subscription
async function handleNewPost(payload) {
  console.log("New post received:", payload)

  // Get the post with profile information
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (username, avatar_url, full_name)
    `)
    .eq("id", payload.new.id)
    .single()

  if (error) {
    console.error("Error fetching new post details:", error)
    return
  }

  // Find the category section
  const categorySection = document.querySelector(`.forum-category h3:contains('${data.category}')`)

  if (categorySection) {
    const section = categorySection.closest(".forum-category")
    // Get the posts container
    const postsContainer = section.querySelector(".forum-posts")

    // Create the new post HTML
    const postHTML = await createPostHTML(data)

    // Add the new post to the top
    postsContainer.insertAdjacentHTML("afterbegin", postHTML)

    // Add event listeners to the new delete button
    addDeleteButtonListeners()

    // Highlight the new post
    setTimeout(() => {
      const newPost = postsContainer.querySelector(`.forum-post[data-post-id="${data.id}"]`)
      if (newPost) {
        newPost.classList.add("new-post")

        // Remove highlight after animation
        setTimeout(() => {
          newPost.classList.remove("new-post")
        }, 3000)
      }
    }, 100)
  } else {
    // Category doesn't exist yet, reload all posts
    loadPosts()
  }
}

// Handle deleted post from real-time subscription
function handleDeletedPost(payload) {
  console.log("Post deleted:", payload)

  // Find and remove the post element
  const postElement = document.querySelector(`.forum-post[data-post-id="${payload.old.id}"]`)
  if (postElement) {
    postElement.style.opacity = "0"
    setTimeout(() => {
      postElement.remove()

      // Check if category is now empty
      const categorySection = postElement.closest(".forum-category")
      if (categorySection) {
        const remainingPosts = categorySection.querySelectorAll(".forum-post")

        if (remainingPosts.length === 0) {
          // Reload all posts to show empty state
          loadPosts()
        }
      }
    }, 300)
  }
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", initPostsSection)

// Export functions for use in other files
export { createPost, getPosts, getPostsByCategory, deletePost, loadPosts, loadPostsByCategory }

