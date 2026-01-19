"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image_url = formData.get("image_url") as string
  const tags = (formData.get("tags") as string).split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string

  const { error } = await supabase.from("projects").insert({
    title,
    description,
    image_url: image_url || null,
    tags,
    project_url: project_url || null,
    github_url: github_url || null,
  })

  if (error) {
    console.error("Error creating project:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image_url = formData.get("image_url") as string
  const tags = (formData.get("tags") as string).split(",").map((tag) => tag.trim())
  const project_url = formData.get("project_url") as string
  const github_url = formData.get("github_url") as string

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      description,
      image_url: image_url || null,
      tags,
      project_url: project_url || null,
      github_url: github_url || null,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating project:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function createAdmin(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  const { error } = await supabase.from("admins").insert({
    email,
    password: hashedPassword,
  })

  if (error) {
    console.error("Error creating admin:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAdmin(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("admins").delete().eq("id", id)

  if (error) {
    console.error("Error deleting admin:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getAdmins() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("admins")
    .select("id, email, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admins:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}
