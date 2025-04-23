"use client"

import { ProjectEditForm } from "@/components/project-edit/project-edit-form"
import { useParams } from "next/navigation"

export default function EditHorizontalProjectPage() {
  // 使用useParams钩子获取参数
  const params = useParams() || {}
  const id = typeof params.id === 'string' ? params.id : 
             Array.isArray(params.id) && params.id.length > 0 ? params.id[0] : ''
  
  return (
    <ProjectEditForm
      projectId={id}
      redirectPath="/projects"
      projectType="horizontal"
    />
  )
}
