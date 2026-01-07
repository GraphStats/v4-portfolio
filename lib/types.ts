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
  in_development?: boolean
  development_progress?: number
  is_completed?: boolean
  is_archived?: boolean
}

export interface Admin {
  id: string
  email: string
  created_at: string
}

export interface ChangelogEntry {
  id: string
  version: string
  date: string
  changes: string[]
}

export interface SiteUpdate {
  id?: string
  next_update_date: string | null
  no_update_planned: boolean
  planned_features: string[];
  changelog: ChangelogEntry[];
  latest_update_text?: string;
  updated_at: string;
}

