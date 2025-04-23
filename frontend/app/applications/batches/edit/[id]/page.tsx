"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { DynamicStepForm } from "@/components/dynamic-form/dynamic-step-form"
import { AIAssistantPanel } from "@/components/dynamic-form/ai-assistant-panel"
import { BatchBasicInfoStep } from "../../form/form-steps/batch-basic-info"
import { BatchConfigStep } from "../../form/form-steps/batch-config-step"
import { BatchMaterialsStep } from "../../form/form-steps/batch-materials-step"
import { BatchPreviewStep } from "../../form/form-steps/batch-preview-step"

// 定义表单步骤
const formSteps = [
  {
    id: "basic-info",
    name: "基本信息",
    description: "填写批次的基本信息",
    component: BatchBasicInfoStep
  },
  {
    id: "config",
    name: "批次配置",
    description: "设置批次配置和限制条件",
    component: BatchConfigStep
  },
  {
    id: "materials",
    name: "申报材料",
    description: "设置申报所需材料",
    component: BatchMaterialsStep
  },
  {
    id: "preview",
    name: "预览确认",
    description: "预览批次信息并确认",
    component: BatchPreviewStep
  }
];

// 模拟批次数据获取函数
const fetchBatchData = async (id: string) => {
  // 这里应该是从API获取数据
  // 暂时使用模拟数据
  const mockBatches = [
    {
      id: "1",
      name: "2025年度第一批校级科研项目申报",
      code: "XKKY-2025-01",
      type: "申报批次",
      projectType: "校级科研项目",
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      status: "已发布",
      description: "本批次用于申报2025年度第一批校级科研项目",
      department: "科研处",
      contactPerson: "张主任",
      contactPhone: "123-4567-8901",
      contactEmail: "zhangzr@example.edu.cn",
      maxProjectsPerPerson: 2,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "项目申请书",
          required: true,
          description: "详细说明项目的研究内容、目标、意义和计划等",
          template: "/templates/project-application.docx"
        },
        {
          id: "2",
          name: "经费预算表",
          required: true,
          description: "详细列出项目预计的各项支出",
          template: "/templates/budget-form.xlsx"
        },
        {
          id: "3",
          name: "研究团队简介",
          required: false,
          description: "介绍研究团队成员及其专业背景",
          template: null
        },
      ]
    },
    {
      id: "2",
      name: "2025年度第一批校级科研项目评审",
      code: "XKPS-2025-01",
      type: "评审批次",
      projectType: "校级科研项目",
      startDate: "2025-03-15",
      endDate: "2025-04-15",
      status: "未发布",
      description: "针对2025年度第一批校级科研项目的评审批次",
      department: "科研处",
      contactPerson: "李主任",
      contactPhone: "123-4567-8902",
      contactEmail: "lizr@example.edu.cn",
      maxProjectsPerPerson: 10,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "评审表",
          required: true,
          description: "评审专家填写的项目评审表",
          template: "/templates/review-form.docx"
        }
      ]
    },
  ]

  const batch = mockBatches.find(batch => batch.id === id)
  if (!batch) {
    throw new Error("Batch not found")
  }
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return batch
}

export default function BatchEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [batch, setBatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadBatch = async () => {
      try {
        const data = await fetchBatchData(params.id)
        setBatch(data)
        setLoading(false)
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }
    
    loadBatch()
  }, [params.id])
  
  // 处理表单提交
  const handleSubmit = async (formData: any) => {
    // 这里应该调用API保存数据
    console.log("提交的数据:", formData)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 提交成功后返回列表页
    router.push("/applications")
    return { success: true }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载批次数据...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">加载失败</h3>
          <p>{error}</p>
          <button 
            onClick={() => router.push("/applications")} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            返回批次列表
          </button>
        </div>
      </div>
    )
  }
  
  if (!batch) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <DynamicStepForm
            steps={formSteps}
            onSubmit={handleSubmit}
            initialData={batch}
            isEditMode={true}
            moduleType="batch"
            titleConfig={{
              field: "name",
              label: "批次名称",
              editable: true
            }}
            returnPath="/applications"
          />
        </div>
        
        <div className="lg:w-[350px]">
          <AIAssistantPanel 
            moduleType="batch"
            formData={batch}
          />
        </div>
      </div>
    </div>
  )
}
