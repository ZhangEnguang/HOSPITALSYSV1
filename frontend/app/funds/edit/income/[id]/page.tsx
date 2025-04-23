"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, ChevronRight, ChevronLeft, Info, FileText, DollarSign, PiggyBank, Upload, CheckCircle } from "lucide-react"

// 导入步骤导航组件
import { StepNavigation, INCOME_STEPS } from "../../../create/income/components/step-navigation"

// 导入各步骤组件
import { StepBasicInfo } from "../../../create/income/components/form-steps/step-basic-info"
import { StepProjectInfo } from "../../../create/income/components/form-steps/step-project-info"
import { StepAmountInfo } from "../../../create/income/components/form-steps/step-amount-info"
import { StepAttachments } from "../../../create/income/components/form-steps/step-attachments"
import { StepComplete } from "../../../create/income/components/form-steps/step-complete"

// 创建一个无标题的包装组件
const NoTitleWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="[&_.card-header]:hidden [&_h3.text-lg.font-medium]:hidden">
      {children}
    </div>
  );
}

export default function EditIncomePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // 添加完整的演示数据
  const [formData, setFormData] = useState({
    // 基本信息
    name: "国家自然科学基金项目经费入账",
    description: "2023年度国家自然科学基金面上项目的经费入账",
    date: "2023-07-15",
    category: "纵向项目经费",
    accountNumber: "62271234567890",
    
    // 项目信息
    projectId: "1",
    budgetAllocation: "设备费用40%，材料费用20%，人员费用30%，其他10%",
    
    // 金额信息
    amount: "300000",
    source: "国家自然科学基金委员会",
    directAmount: "210000",
    indirectAmount: "90000",
    amountNotes: "直接费用包括设备费、材料费和人员费，间接费用为学校管理费",
    
    // 其他信息
    status: "待审核",
    applicant: "李四",
    attachments: []
  })
  
  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 验证当前步骤
    validateCurrentStep(currentStep, {
      ...formData,
      [field]: value
    })
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
    // 编辑模式下允许自由切换步骤
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }
  
  // 保存草稿
  const saveDraft = () => {
    toast({
      title: "更新已保存",
      description: "您的经费入账信息更新已保存"
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
        title: "更新成功",
        description: "经费入账信息已成功更新"
      })
      
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
        <h1 className="text-2xl font-semibold">编辑经费入账</h1>
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
          <Card className="p-6 shadow-sm bg-white">
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{INCOME_STEPS[0].name}</h3>
            </div>
            <NoTitleWrapper>
              <StepBasicInfo formData={formData} updateFormData={updateFormData} />
            </NoTitleWrapper>
          </Card>
        )}
        
        {currentStep === 1 && (
          <Card className="p-6 shadow-sm bg-white">
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <PiggyBank className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{INCOME_STEPS[1].name}</h3>
            </div>
            <NoTitleWrapper>
              <StepProjectInfo formData={formData} updateFormData={updateFormData} />
            </NoTitleWrapper>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card className="p-6 shadow-sm bg-white">
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{INCOME_STEPS[2].name}</h3>
            </div>
            <NoTitleWrapper>
              <StepAmountInfo formData={formData} updateFormData={updateFormData} />
            </NoTitleWrapper>
          </Card>
        )}
        
        {currentStep === 3 && (
          <Card className="p-6 shadow-sm bg-white">
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{INCOME_STEPS[3].name}</h3>
            </div>
            <NoTitleWrapper>
              <StepAttachments formData={formData} updateFormData={updateFormData} />
            </NoTitleWrapper>
          </Card>
        )}
        
        {currentStep === 4 && (
          <Card className="p-6 shadow-sm bg-white">
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{INCOME_STEPS[4].name}</h3>
            </div>
            <NoTitleWrapper>
              <StepComplete 
                formData={formData} 
                isSubmitting={isSubmitting} 
                isSubmitted={isSubmitted}
                onSubmit={handleSubmit}
              />
            </NoTitleWrapper>
          </Card>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={saveDraft}>
          <Save className="h-4 w-4 mr-2" />
          保存更新
        </Button>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一步
            </Button>
          )}
          
          {currentStep < INCOME_STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              下一步
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || isSubmitted}>
              {isSubmitting ? "更新中..." : "完成更新"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 