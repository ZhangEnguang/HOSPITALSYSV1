export interface Achievement {
  id: string
  title: string
  name: string
  type: string
  status: string
  date: string
  description: string
  attachments?: string[]
  project?: {
    id: string
    name: string
  }
  author?: {
    id: string
    name: string
  }
  level?: string
} 