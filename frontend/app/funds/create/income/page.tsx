"use client"

import { useState, useEffect } from "react"
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
  
  // 添加状态来跟踪按钮点击
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false)

  // 添加防抖功能
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
      // 验证经费认领信息 - 移除旧的必填项检查
      // 这些字段在第二步已不存在，因此不再检查
      // if (!formData.projectId) errors["关联项目"] = true
      // if (!formData.category) errors["入账类别"] = true
      // if (!formData.source) errors["经费来源"] = true
      
      // 第二步验证放行，不再验证这些不存在的字段
      console.log("经费认领步骤验证 - 已放行")
    }
    
    // 记录错误并返回验证结果
    console.log("验证错误:", errors)
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 切换到指定步骤
  const goToStep = (step: number) => {
    if (step <= Math.max(...completedSteps, 0)) {
      setCurrentStep(step)
    }
  }

  // 使用useEffect监听按钮点击状态
  useEffect(() => {
    if (isNextButtonClicked) {
      console.log("按钮点击状态已更新，执行nextStep逻辑");
      // 处理下一步逻辑
      if (validateCurrentStep()) {
        console.log("验证通过，准备进入下一步");
        const newCompletedSteps = [...completedSteps];
        if (!newCompletedSteps.includes(currentStep)) {
          newCompletedSteps.push(currentStep);
        }
        setCompletedSteps(newCompletedSteps);
        
        // 更新当前步骤
        setCurrentStep(currentStep + 1);
      } else {
        console.log("验证未通过");
        toast({
          title: "请完善必填信息",
          description: "请填写所有必填字段才能继续",
          variant: "destructive",
        });
      }
      
      // 重置按钮点击状态
      setIsNextButtonClicked(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNextButtonClicked, currentStep]);

  // 点击下一步按钮的处理函数
  const handleNextButtonClick = () => {
    // 防止重复点击
    if (isButtonDisabled) {
      console.log("按钮已禁用，跳过处理");
      return;
    }
    
    console.log("下一步按钮被点击，当前步骤:", currentStep);
    console.log("当前表单数据:", formData);
    
    // 禁用按钮防止多次点击
    setIsButtonDisabled(true);
    
    // 设置按钮点击状态，触发useEffect
    setIsNextButtonClicked(true);
    
    // 1秒后重新启用按钮
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

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

  // 渲染按钮区域
  const renderActionButtons = () => {
    return (
      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={saveDraft} className="mr-2">
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
        </div>
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="mr-2" disabled={isButtonDisabled}>
              上一步
            </Button>
          )}
          {currentStep < INCOME_STEPS.length - 1 ? (
            <Button 
              type="button" 
              onClick={handleNextButtonClick}
              id="nextStepButton"
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "处理中..." : "下一步"}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isButtonDisabled}>
              提交
            </Button>
          )}
        </div>
      </div>
    );
  };

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

      {renderActionButtons()}
    </div>
  )
}
