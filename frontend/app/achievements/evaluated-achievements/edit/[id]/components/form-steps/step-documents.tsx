"use client"

import { UseFormReturn } from "react-hook-form"
import { EvaluatedAchievementsFormValues } from "../evaluated-achievements-form"

interface StepDocumentsProps {
  form: UseFormReturn<EvaluatedAchievementsFormValues>
}

export function StepDocuments({ form }: StepDocumentsProps) {
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">文档上传</div>
      <div className="border p-4 rounded-md">
        <p>这是文档上传表单步骤（示例）</p>
        <p>已上传文件数: {form.getValues("files")?.length || 0}</p>
      </div>
    </div>
  )
} 