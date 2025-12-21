"use server"

import { getFirestoreServer } from "@/lib/firebase/server"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where } from "firebase/firestore"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const db = await getFirestoreServer()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image_url = formData.get("image_url") as string
  const tags = (formData.get("tags") as string).split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string

  try {
    await addDoc(collection(db, "portfolio"), {
      title,
      description,
      image_url: image_url || null,
      tags,
      project_url: project_url || null,
      github_url: github_url || null,
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

  try {
    const projectRef = doc(db, "portfolio", id)
    await updateDoc(projectRef, {
      title,
      description,
      image_url: image_url || null,
      tags,
      project_url: project_url || null,
      github_url: github_url || null,
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
