"use client"

import { ProjectCreationForm } from "@/components/project-creation/project-creation-form"

export default function CreateHorizontalProjectPage() {
  return (
    <ProjectCreationForm
      projectType="horizontal"
      additionalFields={["合作企业", "合同编号", "知识产权归属", "保密等级"]}
      localStorageKey="horizontalProjectDraft"
      redirectPath="/projects"
      showAIPanel={true}
      defaultPanelCollapsed={false}
    />
  )
}

