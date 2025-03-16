// Import necessary modules (assuming Supabase and showToast are globally available or imported elsewhere)
// If not globally available, uncomment and adjust the following lines:
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'YOUR_SUPABASE_URL'
// const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
// const supabase = createClient(supabaseUrl, supabaseKey)

// Chat management functions

// Get chat messages
async function getChatMessages(senderId, receiverId) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id (username, avatar_url, full_name),
        receiver:receiver_id (username, avatar_url, full_name)
      `)
      .or(
        `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`,
      )
      .order("created_at", { ascending: true })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return []
  }
}

// Send a message
async function sendMessage(senderId, receiverId, content) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error("Error sending message:", error)
    return null
  }
}

// Mark messages as read
async function markMessagesAsRead(senderId, receiverId) {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", senderId)
      .eq("receiver_id", receiverId)
      .eq("is_read", false)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return false
  }
}

// Get user details
async function getUserDetails(userId) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}

// Open chat with a user
async function openChat(userId) {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    showToast("Please log in to chat")
    return
  }

  // Get chat modal elements
  const chatModal = document.getElementById("chat-modal")
  const chatUserName = document.getElementById("chat-user-name")
  const chatAvatar = document.querySelector(".chat-avatar")
  const chatMessages = document.getElementById("chat-messages")
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")

  // Get user details
  const receiver = await getUserDetails(userId)

  if (!receiver) {
    showToast("Error loading user details")
    return
  }

  // Update chat header
  chatUserName.textContent = receiver.full_name || receiver.username || "User"
  if (receiver.avatar_url) {
    chatAvatar.src = receiver.avatar_url
  }

  // Clear previous messages
  chatMessages.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>'

  // Load chat messages
  const messages = await getChatMessages(user.id, userId)

  // Clear loading state
  chatMessages.innerHTML = ""

  // Display messages
  if (messages.length === 0) {
    chatMessages.innerHTML = `
      <div class="empty-chat">
        <p>No messages yet. Start the conversation!</p>
      </div>
    `
  } else {
    messages.forEach((message) => {
      const messageElement = document.createElement("div")
      messageElement.className = `message ${message.sender_id === user.id ? "sent" : "received"}`

      const messageTime = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      messageElement.innerHTML = `
        <div class="message-content">${message.content}</div>
        <div class="message-time">${messageTime}</div>
      `

      chatMessages.appendChild(messageElement)
    })

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Mark messages as read
    await markMessagesAsRead(userId, user.id)
  }

  // Show chat modal
  chatModal.classList.add("active")

  // Focus input
  chatInput.focus()

  // Set up form submission
  chatForm.onsubmit = async (e) => {
    e.preventDefault()

    const content = chatInput.value.trim()

    if (!content) return

    // Clear input
    chatInput.value = ""

    // Send message
    const message = await sendMessage(user.id, userId, content)

    if (message) {
      // Add message to chat
      const messageElement = document.createElement("div")
      messageElement.className = "message sent"

      const messageTime = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      messageElement.innerHTML = `
        <div class="message-content">${message.content}</div>
        <div class="message-time">${messageTime}</div>
      `

      chatMessages.appendChild(messageElement)

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }

  // Set up close button
  document.getElementById("close-chat").onclick = () => {
    chatModal.classList.remove("active")
  }

  // Set up real-time subscription for new messages
  setupChatSubscription(user.id, userId)
}

// Set up real-time subscription for new messages
function setupChatSubscription(currentUserId, otherUserId) {
  // Unsubscribe from previous subscription if exists
  if (window.chatSubscription) {
    window.chatSubscription.unsubscribe()
  }

  // Subscribe to changes in the messages table
  const subscription = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${currentUserId}`,
      },
      (payload) => {
        // A new message was received
        if (payload.new.sender_id === otherUserId) {
          handleNewMessage(payload.new)
        }
      },
    )
    .subscribe()

  // Store subscription for cleanup
  window.chatSubscription = subscription
}

// Handle new message from real-time subscription
async function handleNewMessage(message) {
  // Get chat messages container
  const chatMessages = document.getElementById("chat-messages")

  if (chatMessages) {
    // Create message element
    const messageElement = document.createElement("div")
    messageElement.className = "message received"

    const messageTime = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageElement.innerHTML = `
      <div class="message-content">${message.content}</div>
      <div class="message-time">${messageTime}</div>
    `

    // Add message to chat
    chatMessages.appendChild(messageElement)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Play notification sound
    playNotificationSound()

    // Mark message as read
    await markMessagesAsRead(message.sender_id, message.receiver_id)
  }
}

// Play notification sound
function playNotificationSound() {
  const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-notification-256.mp3")
  audio.volume = 0.5
  audio.play().catch((e) => console.log("Error playing notification sound:", e))
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set up close chat button
  const closeChat = document.getElementById("close-chat")
  if (closeChat) {
    closeChat.addEventListener("click", () => {
      document.getElementById("chat-modal").classList.remove("active")
    })
  }
})

