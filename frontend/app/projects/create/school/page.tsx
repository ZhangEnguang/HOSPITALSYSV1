"use client"

import { ProjectCreationForm } from "@/components/project-creation/project-creation-form"

export default function CreateSchoolProjectPage() {
  return (
    <ProjectCreationForm
      projectType="校级"
      additionalFields={["合作企业", "合同编号", "知识产权归属", "保密等级"]}
      localStorageKey="schoolProjectDraft"
      redirectPath="/projects"
      showAIPanel={true}
      defaultPanelCollapsed={false}
    />
  )
}

