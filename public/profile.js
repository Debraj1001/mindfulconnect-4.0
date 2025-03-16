// Import necessary modules (assuming Supabase and showToast are globally available or imported elsewhere)
// If not, you'll need to import them here.  For example:
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'YOUR_SUPABASE_URL'
// const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
// const supabase = createClient(supabaseUrl, supabaseKey)

// Assuming showToast is a function defined elsewhere, or needs to be defined here:
// function showToast(message) {
//   alert(message); // Replace with your desired toast implementation
// }

// User profile management functions

// Get user profile
async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

// Update user profile
async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select()

    if (error) throw error

    showToast("Profile updated successfully!")
    return data
  } catch (error) {
    showToast(error.message || "Error updating profile")
    console.error("Error updating profile:", error)
    return null
  }
}

// Upload avatar
async function uploadAvatar(userId, file) {
  try {
    // Create a unique file path
    const filePath = `avatars/${userId}/${Date.now()}-${file.name}`

    // Upload the file
    const { data, error } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    // Update the user's profile with the new avatar URL
    await updateUserProfile(userId, { avatar_url: publicUrl })

    return publicUrl
  } catch (error) {
    showToast(error.message || "Error uploading avatar")
    console.error("Error uploading avatar:", error)
    return null
  }
}

// Initialize profile page
async function initProfilePage() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = "auth.html"
    return
  }

  // Get user profile
  const profile = await getUserProfile(user.id)

  if (!profile) {
    showToast("Error loading profile")
    return
  }

  // Populate profile form
  document.getElementById("profile-username").value = profile.username || ""
  document.getElementById("profile-fullname").value = profile.full_name || ""
  document.getElementById("profile-bio").value = profile.bio || ""

  // Display avatar
  const avatarImg = document.getElementById("profile-avatar")
  if (profile.avatar_url) {
    avatarImg.src = profile.avatar_url
  }

  // Set up form submission
  const profileForm = document.getElementById("profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const updates = {
        username: document.getElementById("profile-username").value,
        full_name: document.getElementById("profile-fullname").value,
        bio: document.getElementById("profile-bio").value,
        updated_at: new Date(),
      }

      await updateUserProfile(user.id, updates)
    })
  }

  // Set up avatar upload
  const avatarInput = document.getElementById("avatar-upload")
  if (avatarInput) {
    avatarInput.addEventListener("change", async () => {
      const file = avatarInput.files[0]
      if (file) {
        const avatarUrl = await uploadAvatar(user.id, file)
        if (avatarUrl) {
          avatarImg.src = avatarUrl
        }
      }
    })
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initProfilePage)

