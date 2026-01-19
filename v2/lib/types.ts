export interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  tags: string[]
  project_url: string | null
  github_url: string | null
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  created_at: string
}
