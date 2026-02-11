"use server"

import { getFirestoreServer } from "@/lib/firebase/server"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, getDoc, setDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"
import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server"
import type { Project, News, NewsComment } from "@/lib/types"
import { normalizeDeveloperName, DEFAULT_DEVELOPER_NAME } from "@/lib/site-settings"

export async function createProject(formData: FormData) {
  const db = await getFirestoreServer()

  const title = (formData.get("title") as string) || ""
  const description = (formData.get("description") as string) || ""
  const image_url = (formData.get("image_url") as string) || ""
  const tagsStr = (formData.get("tags") as string) || ""
  const tags = tagsStr.split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string
  const in_development = formData.get("in_development") === "true"
  const development_status = (formData.get("development_status") as 'active' | 'paused') || 'active'
  const is_completed = formData.get("is_completed") === "true"
  const is_archived = formData.get("is_archived") === "true"
  const development_progress = parseInt(formData.get("development_progress") as string) || 0
  const requires_auth = formData.get("requires_auth") === "true"

  // Parse changelog if provided
  let changelog = []
  const changelogRaw = formData.get("changelog") as string
  if (changelogRaw) {
    try {
      changelog = JSON.parse(changelogRaw)
    } catch (e) {
      console.error("Failed to parse changelog:", e)
    }
  }

  // Create slug from title
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  try {
    await addDoc(collection(db, "portfolio"), {
      title,
      slug,
      description,
      image_url: image_url || null,
      tags,
      project_url: project_url || null,
      github_url: github_url || null,
      in_development: in_development,
      development_status: development_status,
      is_completed: is_completed,
      is_archived: is_archived,
      development_progress: development_progress,
      requires_auth: requires_auth,
      changelog: changelog,
      created_at: new Date().toISOString(),
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const db = await getFirestoreServer()

  const title = (formData.get("title") as string) || ""
  const description = (formData.get("description") as string) || ""
  const image_url = (formData.get("image_url") as string) || ""
  const tagsStr = (formData.get("tags") as string) || ""
  const tags = tagsStr.split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string
  const in_development = formData.get("in_development") === "true"
  const development_status = (formData.get("development_status") as 'active' | 'paused') || 'active'
  const is_completed = formData.get("is_completed") === "true"
  const is_archived = formData.get("is_archived") === "true"
  const development_progress = parseInt(formData.get("development_progress") as string) || 0
  const requires_auth = formData.get("requires_auth") === "true"

  // Parse changelog
  let changelog = []
  const changelogRaw = formData.get("changelog") as string
  if (changelogRaw) {
    try {
      changelog = JSON.parse(changelogRaw)
    } catch (e) {
      console.error("Failed to parse changelog:", e)
    }
  }

  // Create slug from title
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  try {
    const projectRef = doc(db, "portfolio", id)
    await updateDoc(projectRef, {
      title,
      slug,
      description,
      image_url: image_url || null,
      tags,
      project_url: project_url || null,
      github_url: github_url || null,
      in_development: in_development,
      development_status: development_status,
      is_completed: is_completed,
      is_archived: is_archived,
      development_progress: development_progress,
      requires_auth: requires_auth,
      changelog: changelog,
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating project:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteProject(id: string) {
  const db = await getFirestoreServer()

  try {
    await deleteDoc(doc(db, "portfolio", id))

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { success: false, error: error.message }
  }
}

export async function createAdmin(formData: FormData) {
  const db = await getFirestoreServer()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  try {
    await addDoc(collection(db, "admins"), {
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error creating admin:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteAdmin(id: string) {
  const db = await getFirestoreServer()

  try {
    await deleteDoc(doc(db, "admins", id))
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting admin:", error)
    return { success: false, error: error.message }
  }
}

export async function getAdmins() {
  const db = await getFirestoreServer()

  try {
    const adminsQuery = query(collection(db, "admins"), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(adminsQuery)

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      created_at: doc.data().created_at,
    }))

    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching admins:", error)

    return { success: false, error: error.message, data: [] }
  }
}

export async function getMaintenanceMode() {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        success: true,
        isMaintenance: data.maintenance_mode || false,
        message: data.maintenance_message || "",
        progress: data.maintenance_progress || 0
      }
    }
    return { success: true, isMaintenance: false, message: "", progress: 0 }
  } catch (error: any) {
    console.error("Error fetching maintenance mode:", error)
    return { success: false, error: error.message, isMaintenance: false, message: "", progress: 0 }
  }
}

export async function getV4Mode() {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        success: true,
        isV4Mode: data.v4_mode || false,
        message: data.v4_message || `${normalizeDeveloperName(data.developer_name)} v4 is coming.`,
        progress: data.v4_progress || 0
      }
    }
    return { success: true, isV4Mode: false, message: `${DEFAULT_DEVELOPER_NAME} v4 is coming.`, progress: 0 }
  } catch (error: any) {
    console.error("Error fetching v4 mode:", error)
    return { success: false, error: error.message, isV4Mode: false, message: `${DEFAULT_DEVELOPER_NAME} v4 is coming.`, progress: 0 }
  }
}

export async function getSiteSettings() {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    const docSnap = await getDoc(docRef)

    const developerName = normalizeDeveloperName(docSnap.exists() ? (docSnap.data().developer_name as string | undefined) : undefined)

    return { success: true, developerName }
  } catch (error: any) {
    console.error("Error fetching site settings:", error)
    return { success: false, error: error.message, developerName: DEFAULT_DEVELOPER_NAME }
  }
}

export async function getErrorMode() {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        success: true,
        isErrorMode: data.error_mode || false,
        message: data.error_message || ""
      }
    }
    return { success: true, isErrorMode: false, message: "" }
  } catch (error: any) {
    console.error("Error fetching error mode:", error)
    return { success: false, error: error.message, isErrorMode: false, message: "" }
  }
}

export async function updateV4Mode(isV4Mode: boolean, message?: string, progress?: number) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    const data: any = { v4_mode: isV4Mode }
    if (message !== undefined) data.v4_message = message
    if (progress !== undefined) data.v4_progress = progress

    await setDoc(docRef, data, { merge: true })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating v4 mode:", error)
    return { success: false, error: error.message }
  }
}

export async function updateErrorMode(isErrorMode: boolean, message?: string) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    const data: any = { error_mode: isErrorMode }
    if (message !== undefined) data.error_message = message

    await setDoc(docRef, data, { merge: true })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating error mode:", error)
    return { success: false, error: error.message }
  }
}

export async function updateMaintenanceMode(isMaintenance: boolean, message?: string, progress?: number) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "general")
    // Use setDoc with merge to ensure document exists
    const data: any = { maintenance_mode: isMaintenance }
    if (message !== undefined) data.maintenance_message = message
    if (progress !== undefined) data.maintenance_progress = progress

    await setDoc(docRef, data, { merge: true })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating maintenance mode:", error)
    return { success: false, error: error.message }
  }
}

export async function updateDeveloperName(name: string) {
  const db = await getFirestoreServer()
  try {
    const developerName = normalizeDeveloperName(name)
    const docRef = doc(db, "settings", "general")
    await setDoc(docRef, { developer_name: developerName }, { merge: true })

    const pathsToRevalidate = [
      "/",
      "/v2",
      "/about",
      "/contact",
      "/news",
      "/stats",
      "/tags-info",
      "/terms",
      "/privacy",
      "/cookies",
      "/admin/dashboard",
      "/admin/projects",
      "/admin/configure",
    ]

    await Promise.all(pathsToRevalidate.map((path) => revalidatePath(path)))
    await revalidatePath("/", "layout")
    await revalidatePath("/v2", "layout")

    return { success: true, developerName }
  } catch (error: any) {
    console.error("Error updating developer name:", error)
    return { success: false, error: error.message, developerName: DEFAULT_DEVELOPER_NAME }
  }
}


export async function getProjectBySlug(slug: string) {
  const db = await getFirestoreServer()
  try {
    // 1. Try to find by the real slug field
    const q = query(collection(db, "portfolio"), where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Project
    }

    // 2. Fallback for legacy projects (check if any project's title-based slug matches)
    const allQuery = query(collection(db, "portfolio"))
    const allSnapshot = await getDocs(allQuery)

    for (const doc of allSnapshot.docs) {
      const data = doc.data()
      if (!data.title) continue;

      const titleSlug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      if (titleSlug === slug) {
        return { id: doc.id, ...data } as Project
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching project by slug:", error)
    return null
  }
}


// Chat / Conversation Actions

export async function createConversation(formData: FormData) {
  const db = await getFirestoreServer()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  const initialMessage = {
    id: crypto.randomUUID(),
    content: message,
    sender: 'user',
    createdAt: new Date().toISOString()
  }

  try {
    const docRef = await addDoc(collection(db, "conversations"), {
      userName: name,
      userEmail: email,
      subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      read: false,
      messages: [initialMessage]
    })

    revalidatePath("/admin/dashboard")
    return { success: true, conversationId: docRef.id }
  } catch (error: any) {
    console.error("Error creating conversation:", error)
    return { success: false, error: error.message }
  }
}


export async function getConversation(id: string) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "conversations", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { success: true, conversation: { id: docSnap.id, ...docSnap.data() } }
    }
    return { success: false, error: "Conversation not found" }
  } catch (error: any) {
    console.error("Error fetching conversation:", error)
    return { success: false, error: error.message }
  }
}

export async function sendMessage(conversationId: string, content: string, sender: 'user' | 'admin') {
  const db = await getFirestoreServer()

  const newMessage = {
    id: crypto.randomUUID(),
    content,
    sender,
    createdAt: new Date().toISOString()
  }

  try {
    const docRef = doc(db, "conversations", conversationId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: "Conversation not found" }
    }

    const currentMessages = docSnap.data().messages || []

    // Determine updates
    const updates: any = {
      messages: [...currentMessages, newMessage],
      updatedAt: new Date().toISOString()
    }

    if (sender === 'admin') {
      updates.read = true // Admin replied, so it's "read" / handled
      // optional: updates.status = 'active'
    } else {
      updates.read = false // User replied, admin needs to read it
    }

    await updateDoc(docRef, updates)

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error sending message:", error)
    return { success: false, error: error.message }
  }
}

// Availability System
export async function getAvailability() {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "availability")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { success: true, isAvailable: docSnap.data().isAvailable }
    }
    // Default to true if not set
    return { success: true, isAvailable: true }
  } catch (error: any) {
    console.error("Error fetching availability:", error)
    return { success: false, isAvailable: true }
  }
}

export async function updateAvailability(isAvailable: boolean) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "settings", "availability")
    await setDoc(docRef, { isAvailable }, { merge: true })

    revalidatePath("/")
    revalidatePath("/contact") // Because contact page might show this
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating availability:", error)
    return { success: false, error: error.message }
  }
}

export async function getConversations() {
  const db = await getFirestoreServer()
  try {
    const q = query(collection(db, "conversations"), orderBy("updatedAt", "desc"))
    const querySnapshot = await getDocs(q)

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching conversations:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function markConversationAsRead(id: string) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "conversations", id)
    await updateDoc(docRef, {
      read: true
    })
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error marking conversation as read:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteConversation(id: string) {
  const db = await getFirestoreServer()
  try {
    await deleteDoc(doc(db, "conversations", id))
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting conversation:", error)
    return { success: false, error: error.message }
  }
}

export async function submitContactMessage(formData: FormData) {
  return createConversation(formData)
}

export async function getContactMessages() {
  const result = await getConversations()
  if (!result.success) {
    return { success: false, error: result.error, data: [] }
  }

  // Map conversations to ContactMessage format
  const messages = result.data.map((conv: any) => ({
    id: conv.id,
    name: conv.userName,
    email: conv.userEmail,
    subject: conv.subject,
    message: conv.messages && conv.messages.length > 0 ? conv.messages[0].content : "",
    created_at: conv.createdAt,
    read: conv.read,
    replied: conv.replied || false
  }))

  return { success: true, data: messages }
}

export async function markMessageAsRead(id: string) {
  return markConversationAsRead(id)
}

export async function deleteMessage(id: string) {
  return deleteConversation(id)
}

export async function markMessageAsReplied(id: string) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "conversations", id)
    await updateDoc(docRef, {
      replied: true,
      read: true
    })
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error marking message as replied:", error)
    return { success: false, error: error.message }
  }
}

// News Actions

export async function createNews(formData: FormData) {
  const db = await getFirestoreServer()

  const title = (formData.get("title") as string) || ""
  const content = (formData.get("content") as string) || ""
  const image_url = (formData.get("image_url") as string) || ""

  try {
    await addDoc(collection(db, "news"), {
      title,
      content,
      image_url: image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes: [],
      author_id: "admin",
    })

    revalidatePath("/news")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating news:", error)
    return { success: false, error: error.message }
  }
}

export async function updateNews(id: string, formData: FormData) {
  const db = await getFirestoreServer()

  const title = (formData.get("title") as string) || ""
  const content = (formData.get("content") as string) || ""
  const image_url = (formData.get("image_url") as string) || ""

  try {
    const newsRef = doc(db, "news", id)
    await updateDoc(newsRef, {
      title,
      content,
      image_url: image_url || null,
      updated_at: new Date().toISOString(),
    })

    revalidatePath("/news")
    revalidatePath(`/news/${id}`)
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating news:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteNews(id: string) {
  const db = await getFirestoreServer()

  try {
    // Delete the news document
    await deleteDoc(doc(db, "news", id))

    // Optional: Delete all comments associated with this news
    const commentsQuery = query(collection(db, "news_comments"), where("news_id", "==", id))
    const commentsSnapshot = await getDocs(commentsQuery)
    for (const commentDoc of commentsSnapshot.docs) {
      await deleteDoc(doc(db, "news_comments", commentDoc.id))
    }

    revalidatePath("/news")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting news:", error)
    return { success: false, error: error.message }
  }
}

export async function getNews() {
  const db = await getFirestoreServer()
  try {
    const q = query(collection(db, "news"), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as News[]
    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching news:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getNewsById(id: string) {
  const db = await getFirestoreServer()
  try {
    const docRef = doc(db, "news", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, news: { id: docSnap.id, ...docSnap.data() } as News }
    }
    return { success: false, error: "News not found" }
  } catch (error: any) {
    console.error("Error fetching news by id:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleLikeNews(newsId: string) {
  const session = await clerkAuth()
  const userId = session.userId

  if (!userId) {
    console.warn("toggleLikeNews: No userId found")
    return { success: false, error: "Authentication required" }
  }

  const db = await getFirestoreServer()
  try {
    const newsRef = doc(db, "news", newsId)
    const newsSnap = await getDoc(newsRef)

    if (!newsSnap.exists()) return { success: false, error: "News not found" }

    const data = newsSnap.data()
    const likes = data.likes || []
    const hasLiked = likes.includes(userId)

    const newLikes = hasLiked
      ? likes.filter((id: string) => id !== userId)
      : [...likes, userId]

    await updateDoc(newsRef, { likes: newLikes })

    console.log(`toggleLikeNews: ${userId} ${hasLiked ? "unliked" : "liked"} news ${newsId}`)

    revalidatePath("/news")
    revalidatePath(`/news/${newsId}`)
    return { success: true, liked: !hasLiked }
  } catch (error: any) {
    console.error("Error toggling like:", error)
    return { success: false, error: error.message }
  }
}

export async function addComment(newsId: string, content: string) {
  const session = await clerkAuth()
  const user = await currentUser()

  if (!session.userId || !user) {
    console.warn("addComment: No user found")
    return { success: false, error: "Authentication required" }
  }

  const db = await getFirestoreServer()
  try {
    const docRef = await addDoc(collection(db, "news_comments"), {
      news_id: newsId,
      user_id: user.id,
      user_name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || "Anonymous",
      user_image: user.imageUrl,
      content,
      created_at: new Date().toISOString(),
    })

    console.log(`addComment: Comment ${docRef.id} added to news ${newsId}`)

    revalidatePath(`/news/${newsId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return { success: false, error: error.message }
  }
}


export async function getComments(newsId: string) {
  const db = await getFirestoreServer()
  try {
    const q = query(collection(db, "news_comments"), where("news_id", "==", newsId), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as NewsComment[]
    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function deleteComment(commentId: string, newsId: string) {
  const session = await clerkAuth()
  if (!session.userId) return { success: false, error: "Authentication required" }

  const db = await getFirestoreServer()
  try {
    const commentRef = doc(db, "news_comments", commentId)
    const commentSnap = await getDoc(commentRef)

    if (!commentSnap.exists()) return { success: false, error: "Comment not found" }

    if (commentSnap.data().user_id !== session.userId) {
      return { success: false, error: "Unauthorized" }
    }

    await deleteDoc(commentRef)
    revalidatePath(`/news/${newsId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting comment:", error)
    return { success: false, error: error.message }
  }
}

