"use client"

import { useEffect } from "react"
import { SubjectInfoForm, SubjectInfoFormValues } from "./subject-info-form"

interface FeeItemsFormProps {
  data: any
  onUpdate: (data: FeeItemsFormValues) => void
  validationErrors?: Record<string, boolean>
}

interface FeeItemsFormValues {
  feeItemsList: SubjectInfoFormValues["subjects"]
}

export default function FeeItemsForm({
  data,
  onUpdate,
  validationErrors = {},
}: FeeItemsFormProps) {
  // 当子组件中的表单数据变化时更新父组件数据
  const handleSubjectFormSubmit = (formData: SubjectInfoFormValues) => {
    onUpdate({
      feeItemsList: formData.subjects
    })
  }

  // 表单验证状态变化
  const handleValidationChange = (isValid: boolean) => {
    // 这里可以额外处理验证逻辑，目前只需传递子组件的验证状态即可
  }

  // 获取默认值
  const defaultValues = {
    subjects: data.feeItemsList || []
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        请添加经费方案中包含的科目信息，每个科目需要设置比例和是否必选。总比例不能超过100%。
      </div>
      
      {validationErrors["科目项"] && (
        <div className="text-sm text-destructive mb-4">
          请至少添加一个科目
        </div>
      )}

      <SubjectInfoForm 
        defaultValues={defaultValues}
        onSubmit={handleSubjectFormSubmit}
        onValidationChange={handleValidationChange}
      />
    </div>
  )
} 