"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// 导入步骤导航组件
import { StepNavigation, INCOME_STEPS } from "./components/step-navigation"
import { StepBankIncome } from "./components/form-steps/step-bank-income"
import { StepFundClaim } from "./components/form-steps/step-fund-claim"
import { StepComplete } from "./components/form-steps/step-complete"

export default function CreateIncomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    // 银行来款信息
    incomeName: "",
    incomeDate: "",
    amount: "",
    bankAccount: "",
    bankRemark: "",
    
    // 经费认领信息
    projectId: "",
    category: "",
    source: "",
    budgetAllocation: "",
    claimRemark: ""
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // 清除相关的验证错误
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证银行来款信息
      if (!formData.incomeName) errors["来款名称"] = true
      if (!formData.incomeDate) errors["入账日期"] = true
      if (!formData.amount) errors["来款金额"] = true
    } else if (currentStep === 1) {
      // 验证经费认领信息
      if (!formData.projectId) errors["关联项目"] = true
      if (!formData.category) errors["入账类别"] = true
      if (!formData.source) errors["经费来源"] = true
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 切换到指定步骤
  const goToStep = (step: number) => {
    if (step <= Math.max(...completedSteps, 0)) {
      setCurrentStep(step)
    }
  }

  // 下一步
  const nextStep = () => {
    if (validateCurrentStep()) {
      const newCompletedSteps = [...completedSteps]
      if (!newCompletedSteps.includes(currentStep)) {
        newCompletedSteps.push(currentStep)
      }
      setCompletedSteps(newCompletedSteps)
      setCurrentStep(currentStep + 1)
    } else {
      toast({
        title: "请完善必填信息",
        description: "请填写所有必填字段才能继续",
        variant: "destructive",
      })
    }
  }

  // 上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 保存草稿
  const saveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "您的经费入账信息已保存为草稿",
    })
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证当前步骤
    if (!validateCurrentStep()) {
      toast({
        title: "请完善必填信息",
        description: "请填写所有必填字段才能提交",
        variant: "destructive",
      })
      return
    }

    // 在实际应用中，这里会提交表单数据到服务器
    console.log("提交数据:", formData)

    toast({
      title: "提交成功",
      description: "经费入账信息已成功提交",
    })

    // 提交成功后返回列表页
    router.push("/funds")
  }

  // 渲染当前步骤的内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepBankIncome formData={formData} updateFormData={updateFormData} />
      case 1:
        return <StepFundClaim formData={formData} updateFormData={updateFormData} />
      case 2:
        return <StepComplete formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="w-full py-6 bg-[#f5f7fa] min-h-screen px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">新增经费入账</h1>
      </div>

      <div className="mb-6">
        <StepNavigation
          steps={INCOME_STEPS}
          currentStep={currentStep}
          goToStep={goToStep}
          completedSteps={completedSteps}
          validationErrors={validationErrors}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={saveDraft} className="mr-2">
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
        </div>
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="mr-2">
              上一步
            </Button>
          )}
          {currentStep < INCOME_STEPS.length - 1 ? (
            <Button onClick={nextStep}>下一步</Button>
          ) : (
            <Button onClick={handleSubmit}>提交</Button>
          )}
        </div>
      </div>
    </div>
  )
}
