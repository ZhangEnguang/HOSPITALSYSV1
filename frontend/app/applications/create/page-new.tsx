"use client"

import { useState } from "react" 
import { 
  ApplicationForm, 
  FormMode, 
  ApplicationFormData,
  Step
} from "@/components/application-form"
import {
  StepBasic,
  StepMaterials,
  StepDates,
  StepRequirements,
  StepComplete
} from "@/components/application-form/steps"

export default function ApplicationCreatePage() {
  // 初始数据可以通过API获取或从localStorage读取草稿
  const [formData, setFormData] = useState<ApplicationFormData | undefined>(undefined)
  
  // 定义应用表单步骤
  const applicationSteps: Step[] = [
    {
      id: 0,
      name: "基本信息",
      description: "填写申报计划基本信息",
      component: <StepBasic formData={formData || {}} setFormData={setFormData} />
    },
    {
      id: 1,
      name: "申报材料",
      description: "添加申报材料和附件",
      component: <StepMaterials formData={formData || {}} setFormData={setFormData} />
    },
    {
      id: 2,
      name: "关键日期",
      description: "设置关键时间节点",
      component: <StepDates formData={formData || {}} setFormData={setFormData} />
    },
    {
      id: 3,
      name: "特殊要求",
      description: "添加特殊要求和限制",
      component: <StepRequirements formData={formData || {}} setFormData={setFormData} />
    },
    {
      id: 4,
      name: "确认提交",
      description: "检查并提交",
      component: <StepComplete formData={formData || {}} />
    }
  ]
  
  // 提交表单
  const handleSubmit = async (data: ApplicationFormData) => {
    console.log("提交的数据:", data)
    // 实际应用中这里会调用API保存数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Promise.resolve()
  }
  
  // 保存草稿
  const handleSaveDraft = async (data: ApplicationFormData) => {
    console.log("保存草稿:", data)
    // 实际应用中这里会调用API保存草稿或存入localStorage
    await new Promise(resolve => setTimeout(resolve, 800))
    return Promise.resolve()
  }

  return (
    <ApplicationForm
      mode={FormMode.CREATE}
      initialData={formData}
      steps={applicationSteps}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      title="创建申报批次"
      returnUrl="/applications"
    />
  )
}
