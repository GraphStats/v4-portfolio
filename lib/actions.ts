"use server"

import { getFirestoreServer } from "@/lib/firebase/server"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, getDoc, setDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"
import type { Project } from "@/lib/types"

export async function createProject(formData: FormData) {
  const db = await getFirestoreServer()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image_url = formData.get("image_url") as string
  const tags = (formData.get("tags") as string).split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string
  const in_development = formData.get("in_development") === "true"
  const is_completed = formData.get("is_completed") === "true"
  const is_archived = formData.get("is_archived") === "true"
  const development_progress = parseInt(formData.get("development_progress") as string) || 0

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
      is_completed: is_completed,
      is_archived: is_archived,
      development_progress: development_progress,
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

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image_url = formData.get("image_url") as string
  const tags = (formData.get("tags") as string).split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string
  const in_development = formData.get("in_development") === "true"
  const is_completed = formData.get("is_completed") === "true"
  const is_archived = formData.get("is_archived") === "true"
  const development_progress = parseInt(formData.get("development_progress") as string) || 0

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
      is_completed: is_completed,
      is_archived: is_archived,
      development_progress: development_progress,
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
