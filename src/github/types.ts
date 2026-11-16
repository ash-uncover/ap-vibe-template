export interface Repo {
  full_name: string
  description: string | null
  default_branch: string
  html_url: string
  private: boolean
  stargazers_count: number
  permissions?: {
    admin: boolean
    push: boolean
    pull: boolean
  }
}

export interface ContentFile {
  type: string
  name: string
  path: string
  sha: string
  size: number
  content: string
  encoding: string
  html_url: string
}

export interface GitHubError {
  status: number
  message: string
}
