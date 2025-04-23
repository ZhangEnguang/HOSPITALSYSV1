"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

// 假设我们有一个步骤导航组件
const OUTBOUND_STEPS = [
  { id: 0, label: "基本信息" },
  { id: 1, label: "项目与类别" },
  { id: 2, label: "外拨信息" },
  { id: 3, label: "附件上传" },
  { id: 4, label: "完成" },
]

// 简化版的步骤导航组件
function StepNavigation({ currentStep, goToStep, validationErrors, completedSteps }: any) {
  return (
    <div className="flex justify-between mb-8">
      {OUTBOUND_STEPS.map((step) => (
        <div 
          key={step.id}
          className={`flex-1 text-center cursor-pointer ${
            currentStep === step.id ? "font-bold" : ""
          }`}
          onClick={() => goToStep(step.id)}
        >
          <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
            currentStep === step.id 
              ? "bg-blue-500 text-white" 
              : completedSteps.includes(step.id)
                ? "bg-green-500 text-white"
                : "bg-gray-200"
          }`}>
            {step.id + 1}
          </div>
          <div className="mt-2">{step.label}</div>
        </div>
      ))}
    </div>
  )
}

// 模拟项目数据
const projects = [
  { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
  { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
  { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
  { id: "4", name: "高校创新创业教育体系构建研究" },
  { id: "5", name: "智慧校园综合管理平台开发" },
]

// 经费外拨类别
const categories = ["合作单位外拨", "联合研究外拨", "委托服务外拨", "其他外拨"]

export function OutboundForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const isEditMode = initialData?.isEditMode || false
  
  // 初始化表单数据
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    date: initialData?.date || "",
    description: initialData?.description || "",
    projectId: initialData?.projectId || "",
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    receivingUnit: initialData?.receivingUnit || "",
    bankAccount: initialData?.bankAccount || "",
    bankName: initialData?.bankName || "",
    contract: initialData?.contract || "",
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除验证错误
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 验证当前步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}

    if (step === 0) {
      if (!formData.name) errors["外拨名称"] = true
      if (!formData.date) errors["外拨日期"] = true
    } else if (step === 1) {
      if (!formData.projectId) errors["所属项目"] = true
      if (!formData.category) errors["外拨类别"] = true
    } else if (step === 2) {
      if (!formData.amount) errors["外拨金额"] = true
      if (!formData.receivingUnit) errors["接收单位"] = true
      if (!formData.bankAccount) errors["银行账号"] = true
      if (!formData.bankName) errors["开户行"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (currentStep < OUTBOUND_STEPS.length - 1) {
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
    toast({
      title: "草稿已保存",
      description: "您的经费外拨信息已保存为草稿"
    })
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
      receivingUnit: "",
      bankAccount: "",
      bankName: "",
      contract: "",
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

  // 渲染当前步骤内容
  const renderStepContent = () => {
    // 简化版步骤内容
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{OUTBOUND_STEPS[currentStep].label}</h3>
        <p className="text-gray-500">
          {isEditMode ? "编辑经费外拨" : "新增经费外拨"} - 步骤 {currentStep + 1}/{OUTBOUND_STEPS.length}
        </p>
        <div className="h-32 flex items-center justify-center border rounded-md bg-gray-50">
          <p className="text-gray-400">步骤 {currentStep + 1} 表单内容将显示在这里</p>
        </div>
      </div>
    )
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
          {currentStep < OUTBOUND_STEPS.length - 1 ? (
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
          <h1 className="text-2xl font-semibold">{isEditMode ? "编辑经费外拨" : "新增经费外拨"}</h1>
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
            <DialogTitle>{isEditMode ? "外拨更新成功" : "外拨申请提交成功"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "您的经费外拨信息已成功更新，请选择后续操作" 
                : "您的经费外拨申请已成功提交，请选择后续操作"
              }
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