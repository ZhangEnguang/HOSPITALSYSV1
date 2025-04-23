"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DynamicStepForm } from "@/components/dynamic-form/dynamic-step-form"
import { AIAssistantPanel } from "@/components/dynamic-form/ai-assistant-panel"
import { BatchBasicInfoStep } from "../form/form-steps/batch-basic-info"
import { BatchConfigStep } from "../form/form-steps/batch-config-step"
import { BatchMaterialsStep } from "../form/form-steps/batch-materials-step"
import { BatchPreviewStep } from "../form/form-steps/batch-preview-step"

// 表单步骤定义
const formSteps = [
  {
    id: "basic-info",
    name: "基本信息",
    component: BatchBasicInfoStep,
    validation: (data: Record<string, any>) => {
      const errors: Record<string, string> = {}
      if (!data["批次名称"]) errors["批次名称"] = "批次名称不能为空"
      if (!data["批次编号"]) errors["批次编号"] = "批次编号不能为空"
      if (!data["批次类型"]) errors["批次类型"] = "请选择批次类型"
      if (!data["项目类型"]) errors["项目类型"] = "请选择项目类型"
      if (!data["开始日期"]) errors["开始日期"] = "请选择开始日期"
      if (!data["结束日期"]) errors["结束日期"] = "请选择结束日期"
      return errors
    }
  },
  {
    id: "config",
    name: "配置信息",
    component: BatchConfigStep,
    validation: (data: Record<string, any>) => {
      const errors: Record<string, string> = {}
      if (!data["每人最大申报数量"] && data["每人最大申报数量"] !== 0) 
        errors["每人最大申报数量"] = "请填写每人最大申报数量"
      // 其他验证
      return errors
    }
  },
  {
    id: "materials",
    name: "申报材料",
    component: BatchMaterialsStep,
  },
  {
    id: "preview",
    name: "预览",
    component: BatchPreviewStep,
  },
]

// u6a21u62dfu6279u6279u6b21u6570u636eu83b7u53d6u51fdu6570
const fetchBatchData = async (id: string) => {
  // u8fd9u91ccu5e94u8be5u662fu4eceAPIu83b7u53d6u6570u636e
  // u6682u65f6u4f7fu7528u6a21u62dfu6570u636e
  const mockBatches = [
    {
      id: "1",
      name: "2025u5e74u5ea6u7b2cu4e00u6279u6821u7ea7u79d1u7814u9879u76eeu7533u62a5",
      code: "XKKY-2025-01",
      type: "u7533u62a5u6279u6b21",
      projectType: "u6821u7ea7u79d1u7814u9879u76ee",
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      status: "u5df2u53d1u5e03",
      description: "u672cu6279u6b21u7528u4e8eu7533u62a52025u5e74u5ea6u7b2cu4e00u6279u6821u7ea7u79d1u7814u9879u76ee",
      department: "u79d1u7814u5904",
      contactPerson: "u5f20u4e3bu4efb",
      contactPhone: "123-4567-8901",
      contactEmail: "zhangzr@example.edu.cn",
      maxProjectsPerPerson: 2,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "u9879u76eeu7533u8bf7u4e66",
          required: true,
          description: "u8be6u7ec6u8bf4u660eu9879u76eeu7684u7814u7a76u5185u5bb9u3001u76eeu6807u3001u610fu4e49u548cu8ba1u5212u7b49",
          template: "/templates/project-application.docx"
        },
        {
          id: "2",
          name: "u7ecfu8d39u9884u7b97u8868",
          required: true,
          description: "u8be6u7ec6u5217u51fau9879u76eeu9884u8ba1u7684u5404u9879u652fu51fa",
          template: "/templates/budget-form.xlsx"
        },
        {
          id: "3",
          name: "u7814u7a76u56e2u961fu7b80u4ecj",
          required: false,
          description: "u4ecbu7ecdu7814u7a76u56e2u961fu6210u5458u53cau5176u4e13u4e1au80ccu666f",
          template: null
        },
      ]
    },
    {
      id: "2",
      name: "2025u5e74u5ea6u7b2cu4e00u6279u6821u7ea7u79d1u7814u9879u76eeu8bc4u5ba1",
      code: "XKPS-2025-01",
      type: "u8bc4u5ba1u6279u6b21",
      projectType: "u6821u7ea7u79d1u7814u9879u76ee",
      startDate: "2025-03-15",
      endDate: "2025-04-15",
      status: "u672au53d1u5e03",
      description: "u9488u5bf92025u5e74u5ea6u7b2cu4e00u6279u6821u7ea7u79d1u7814u9879u76eeu7684u8bc4u5ba1u6279u6b21",
      department: "u79d1u7814u5904",
      contactPerson: "u674eu4e3bu4efb",
      contactPhone: "123-4567-8902",
      contactEmail: "lizr@example.edu.cn",
      maxProjectsPerPerson: 10,
      requiresApproval: true,
      materialsRequired: [
        {
          id: "1",
          name: "u8bc4u5ba1u8868",
          required: true,
          description: "u8bc4u5ba1u4e13u5bb6u586bu5199u7684u9879u76eeu8bc4u5ba1u8868",
          template: "/templates/review-form.docx"
        }
      ]
    },
  ]

  const batch = mockBatches.find(batch => batch.id === id)
  if (!batch) {
    throw new Error("Batch not found")
  }
  
  // u6a21u62dfu7f51u7edcu5ef6u8fdf
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return batch
}

// 内容组件
function BatchEditContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [batch, setBatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!id) {
      router.push("/applications")
      return
    }
    
    const loadBatch = async () => {
      try {
        const data = await fetchBatchData(id)
        setBatch(data)
        setLoading(false)
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }
    
    loadBatch()
  }, [id, router])
  
  // u5904u7406u8868u5355u63d0u4ea4
  const handleSubmit = async (formData: any) => {
    // u8fd9u91ccu5e94u8be5u8c03u7528APIu4fddu5b58u6570u636e
    console.log("u63d0u4ea4u7684u6570u636e:", formData)
    
    // u6a21u62dfAPIu8c03u7528u5ef6u8fdf
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // u63d0u4ea4u6210u529fu540eu8fd4u56deu5217u8868u9875
    router.push("/applications")
    return { success: true }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">u6b63u5728u52a0u8f7du6279u6b21u6570u636e...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">u52a0u8f7du5931u8d25</h3>
          <p>{error}</p>
          <button 
            onClick={() => router.push("/applications")} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            u8fd4u56deu6279u6b21u5217u8868
          </button>
        </div>
      </div>
    )
  }
  
  if (!batch) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">u672au627eu5230u6279u6b21</h3>
          <p>u627eu4e0du5230IDu4e3a {id} u7684u6279u6b21u4fe1u606f</p>
          <button 
            onClick={() => router.push("/applications")} 
            className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          >
            u8fd4u56deu6279u6b21u5217u8868
          </button>
        </div>
      </div>
    )
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
            returnPath="/applications"
            moduleType="批次"
            titleConfig={{
              field: "批次名称",
              label: "编辑批次",
              editable: true
            }}
            subtitleFields={["批次编号", "项目类型"]}
          />
        </div>
        
        <div className="lg:w-[350px]">
          <AIAssistantPanel
            moduleType="批次"
            formData={batch || {}}
          />
        </div>
      </div>
    </div>
  )
}

// 导出使用Suspense包装的页面组件
export default function BatchEditPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>加载中...</p></div>}>
      <BatchEditContent />
    </Suspense>
  )
}
