"use client"

import { ProjectEditForm } from "@/components/project-edit/project-edit-form"

export default function EditVerticalProjectPage({ params }: { params: { id: string } }) {
  return (
    <ProjectEditForm
      projectId={params.id}
      redirectPath="/projects"
      projectType="纵向"
    />
  )
} 