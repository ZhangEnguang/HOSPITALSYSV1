"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, ChevronRight, ChevronLeft } from "lucide-react"

// 导入步骤导航组件
import { StepNavigation, INCOME_STEPS } from "../components/step-navigation"

// 导入各步骤组件
import { StepBasicInfo } from "../components/form-steps/step-basic-info"
import { StepProjectInfo } from "../components/form-steps/step-project-info"
import { StepAmountInfo } from "../components/form-steps/step-amount-info"
import { StepAttachments } from "../components/form-steps/step-attachments"
import { StepComplete } from "../components/form-steps/step-complete"

export default function CreateIncomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // 表单数据
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    category: "",
    date: "",
    accountNumber: "",
    description: "",
    
    // 项目信息
    projectId: "",
    budgetAllocation: "",
    
    // 金额信息
    amount: "",
    source: "",
    directAmount: "",
    indirectAmount: "",
    amountNotes: "",
    
    // 附件信息
    attachments: []
  })
  
  // 从本地存储加载草稿
  useEffect(() => {
    const savedDraft = localStorage.getItem("incomeFormDraft")
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft)
        setFormData(parsedData)
        
        // 检查已完成的步骤
        const completed = []
        if (parsedData.name && parsedData.category && parsedData.date) {
          completed.push(0) // 基本信息已完成
        }
        if (parsedData.projectId) {
          completed.push(1) // 项目信息已完成
        }
        if (parsedData.amount && parsedData.source) {
          completed.push(2) // 金额信息已完成
        }
        if (parsedData.attachments && parsedData.attachments.length > 0) {
          completed.push(3) // 附件信息已完成
        }
        setCompletedSteps(completed)
      } catch (error) {
        console.error("加载草稿失败:", error)
      }
    }
  }, [])
  
  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 自动保存草稿
    const updatedData = {
      ...formData,
      [field]: value
    }
    localStorage.setItem("incomeFormDraft", JSON.stringify(updatedData))
    
    // 验证当前步骤
    validateCurrentStep(currentStep, updatedData)
  }
  
  // 验证当前步骤
  const validateCurrentStep = (step: number, data = formData) => {
    const errors: Record<string, boolean> = {}
    
    if (step === 0) {
      // 验证基本信息
      if (!data.name) errors["入账名称"] = true
      if (!data.category) errors["入账类别"] = true
      if (!data.date) errors["入账日期"] = true
    } else if (step === 1) {
      // 验证项目信息
      if (!data.projectId) errors["关联项目"] = true
    } else if (step === 2) {
      // 验证金额信息
      if (!data.amount) errors["入账金额"] = true
      if (!data.source) errors["经费来源"] = true
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // 切换到下一步
  const nextStep = () => {
    // 验证当前步骤
    if (!validateCurrentStep(currentStep)) {
      toast({
        title: "信息不完整",
        description: "请填写所有必填字段",
        variant: "destructive"
      })
      return
    }
    
    // 标记当前步骤为已完成
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }
    
    // 切换到下一步
    if (currentStep < INCOME_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }
  
  // 切换到上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }
  
  // 切换到指定步骤
  const goToStep = (step: number) => {
    // 只允许切换到已完成的步骤或当前步骤的下一步
    if (step <= currentStep + 1 && (completedSteps.includes(step) || step <= currentStep)) {
      setCurrentStep(step)
      window.scrollTo(0, 0)
    }
  }
  
  // 保存草稿
  const saveDraft = () => {
    localStorage.setItem("incomeFormDraft", JSON.stringify(formData))
    toast({
      title: "草稿已保存",
      description: "您的经费入账信息已保存为草稿"
    })
  }
  
  // 提交表单
  const handleSubmit = () => {
    // 验证所有步骤
    for (let i = 0; i < INCOME_STEPS.length - 1; i++) {
      if (!validateCurrentStep(i)) {
        toast({
          title: "信息不完整",
          description: `请完成${INCOME_STEPS[i].name}中的必填字段`,
          variant: "destructive"
        })
        setCurrentStep(i)
        return
      }
    }
    
    // 开始提交
    setIsSubmitting(true)
    
    // 模拟提交过程
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // 提交成功后显示提示
      toast({
        title: "提交成功",
        description: "经费入账信息已成功提交"
      })
      
      // 清除草稿
      localStorage.removeItem("incomeFormDraft")
      
      // 3秒后返回列表页
      setTimeout(() => {
        router.push("/funds")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="w-full py-6 bg-[#f5f7fa] min-h-screen px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">新增经费入账</h1>
      </div>

      {/* 步骤导航 */}
      <div className="mb-6">
        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />
      </div>

      {/* 步骤内容 */}
      <div className="mb-6">
        {currentStep === 0 && (
          <StepBasicInfo formData={formData} updateFormData={updateFormData} />
        )}
        
        {currentStep === 1 && (
          <StepProjectInfo formData={formData} updateFormData={updateFormData} />
        )}
        
        {currentStep === 2 && (
          <StepAmountInfo formData={formData} updateFormData={updateFormData} />
        )}
        
        {currentStep === 3 && (
          <StepAttachments formData={formData} updateFormData={updateFormData} />
        )}
        
        {currentStep === 4 && (
          <StepComplete 
            formData={formData} 
            isSubmitting={isSubmitting} 
            isSubmitted={isSubmitted} 
            onSubmit={handleSubmit} 
          />
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center"
              disabled={isSubmitting || isSubmitted}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一步
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={saveDraft}
            className="flex items-center"
            disabled={isSubmitting || isSubmitted}
          >
            <Save className="h-4 w-4 mr-1" />
            保存草稿
          </Button>
          
          {currentStep < INCOME_STEPS.length - 1 && (
            <Button
              onClick={nextStep}
              className="flex items-center"
              disabled={isSubmitting || isSubmitted}
            >
              下一步
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
