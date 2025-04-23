export interface ApplicationItem {
  id: string
  name: string
  description: string
  type: string
  category: string
  amount: number
  progress: number
  formGenerationType: string
  date: string
  deadline: string
  batch: "申报批次" | "评审批次"
  batchNumber: string
  projectCount: number
  status: string
  priority?: string
  applicant?: {
    id: string
    name: string
  }
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  type: string
  category: string
  amount: number
  progress: number
  date: string
  deadline: string
  batchNumber: string
  status: string
  batch: string
  manager: ProjectManager
  expertCount?: number
  experts?: ExpertInfo[]
}

export interface ProjectManager {
  id: number
  name: string
  department: string
  title: string
}

export interface ExpertInfo {
  id: string
  name: string
  title?: string
  organization?: string
  email?: string
  phone?: string
} 