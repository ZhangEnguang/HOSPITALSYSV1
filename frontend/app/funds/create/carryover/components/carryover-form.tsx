"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { STEPS, StepNavigation } from "./step-navigation"
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepProjectCategory } from "./form-steps/step-project-category"
import { StepAmountCarryover } from "./form-steps/step-amount-carryover"
import { StepAttachments } from "./form-steps/step-attachments"
import { StepComplete } from "./form-steps/step-complete"

// 模拟项目数据
const projects = [
  { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
  { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
  { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
  { id: "4", name: "高校创新创业教育体系构建研究" },
  { id: "5", name: "智慧校园综合管理平台开发" },
]

// 结转类别
const categories = ["年度结转", "结题结转", "合同结转", "其他结转"]

// 结转原因
const reasons = ["项目实施进度调整", "项目延期", "合作方要求延期", "经费使用计划调整"]

export function CarryoverForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const isEditMode = initialData?.isEditMode || false
  
  // 初始化表单数据
  const [formData, setFormData] = useState({
    name: initialData?.expenseName || "",
    date: initialData?.date || "",
    description: initialData?.description || "",
    projectId: initialData?.projectId || "",
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    fromYear: initialData?.fromYear || new Date().getFullYear().toString(),
    toYear: initialData?.toYear || (new Date().getFullYear() + 1).toString(),
    carryoverReason: initialData?.carryoverReason || "",
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除验证错误
    if (field === "name" && validationErrors["结转名称"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转名称"]
        return newErrors
      })
    } else if (field === "date" && validationErrors["结转日期"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转日期"]
        return newErrors
      })
    } else if (field === "projectId" && validationErrors["所属项目"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["所属项目"]
        return newErrors
      })
    } else if (field === "category" && validationErrors["结转类别"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转类别"]
        return newErrors
      })
    } else if (field === "amount" && validationErrors["结转金额"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转金额"]
        return newErrors
      })
    } else if (field === "fromYear" && validationErrors["结转年度(从)"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转年度(从)"]
        return newErrors
      })
    } else if (field === "toYear" && validationErrors["结转年度(至)"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转年度(至)"]
        return newErrors
      })
    } else if (field === "carryoverReason" && validationErrors["结转原因"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["结转原因"]
        return newErrors
      })
    } else if (field === "validationErrors") {
      // 直接更新验证错误
      setValidationErrors(value)
    }
  }

  // 验证当前步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}

    if (step === 0) {
      if (!formData.name) errors["结转名称"] = true
      if (!formData.date) errors["结转日期"] = true
    } else if (step === 1) {
      if (!formData.projectId) errors["所属项目"] = true
      if (!formData.category) errors["结转类别"] = true
    } else if (step === 2) {
      if (!formData.amount) errors["结转金额"] = true
      if (!formData.fromYear) errors["结转年度(从)"] = true
      if (!formData.toYear) errors["结转年度(至)"] = true
      if (!formData.carryoverReason) errors["结转原因"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const isValid = validateStep(currentStep)
      
      if (!isValid) {
        return
      }
      
      // 添加到已完成步骤
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  // 上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    if (step > currentStep) {
      // 如果向前跳转，需要验证当前步骤
      const isValid = validateStep(currentStep)
      if (!isValid) return
    }
    
    setCurrentStep(step)
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("保存草稿:", formData)
    // 实际应用中这里会保存草稿
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证最后一步
    const isValid = validateStep(currentStep)
    if (!isValid) return
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续添加
  const handleContinueAdding = () => {
    // 重置表单
    setFormData({
      name: "",
      date: "",
      description: "",
      projectId: "",
      category: "",
      amount: "",
      fromYear: new Date().getFullYear().toString(),
      toYear: (new Date().getFullYear() + 1).toString(),
      carryoverReason: "",
    })
    setFiles([])
    setCurrentStep(0)
    setCompletedSteps([])
    setShowCompletionDialog(false)
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/funds")
  }

  // 确保大屏幕下表单内容保持在1440宽度
  useEffect(() => {
    const styleEl = document.createElement("style")
    styleEl.textContent = `
      @media (min-width: 1920px) {
        .form-container {
          max-width: 1440px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    `
    document.head.appendChild(styleEl)

    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasicInfo
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <StepProjectCategory
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
            projects={projects}
            categories={categories}
          />
        )
      case 2:
        return (
          <StepAmountCarryover
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
            reasons={reasons}
          />
        )
      case 3:
        return (
          <StepAttachments
            files={files}
            setFiles={setFiles}
          />
        )
      case 4:
        return (
          <StepComplete
            formData={formData}
            files={files}
            projects={projects}
          />
        )
      default:
        return null
    }
  }

  // 渲染底部按钮
  const renderButtons = () => {
    return (
      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={handleSaveDraft} className="mr-2">
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
        </div>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevStep}>
              上一步
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600">
              下一步
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
              完成
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="form-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "编辑经费结转" : "新增经费结转"}
          </h1>
        </div>

        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />

        <Card className="border shadow-sm mt-6">
          <CardContent className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {renderStepContent()}
              <div className="pt-4 border-t">{renderButtons()}</div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "结转更新成功" : "结转申请提交成功"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "您的结转申请已成功更新，请选择后续操作" : "您的结转申请已成功提交，请选择后续操作"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" onClick={handleContinueAdding} className="w-full sm:w-auto">
              {isEditMode ? "继续编辑" : "继续添加"}
            </Button>
            <Button onClick={handleReturnToList} className="w-full sm:w-auto">
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
