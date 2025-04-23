"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  FormMode, 
  ApplicationFormData,
  Step
} from "@/components/application-form"
import { StepNavigation, STEPS } from "@/app/applications/create/components/step-navigation"
import {
  StepBasic,
  StepMaterials,
  StepDates,
  StepRequirements,
  StepComplete
} from "@/components/application-form/steps"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { motion } from "framer-motion"

// 模拟从API获取的数据
const mockApplicationData: ApplicationFormData = {
  name: "2025年度国家自然科学基金项目",
  description: "国家自然科学基金委员会年度常规项目申报，包括面上项目、青年项目和重点项目",
  type: "国家级",
  category: "自然科学",
  startDate: new Date("2025-03-01"),
  endDate: new Date("2025-03-20"),
  amount: 1000,
  autoEnd: "yes",
  canReview: "yes",
  hasQuota: "yes",
  guide: "国家自然科学基金委员会2025年度项目申报指南。本年度重点支持基础研究和前沿探索，鼓励原创性研究。申请人须符合国家自然科学基金委员会规定的申请资格。",
  template: "请按照国家自然科学基金委员会最新发布的申请书模板填写，注意遵循字数限制格式要求。",
  materials: [
    { id: "m1", name: "申请书", description: "模板自动挂接最新版" },
    { id: "m2", name: "申请人简历", description: "在线生成" },
    { id: "m3", name: "伦理审查证明", description: "需上传" },
  ],
  keyDates: [
    { id: "d1", name: "校内截止", date: new Date("2025-03-10") },
    { id: "d2", name: "形式审查", date: new Date("2025-03-15") },
    { id: "d3", name: "提交基金委", date: new Date("2025-03-20") },
  ],
  requirements: [
    { id: "r1", content: "限项说明：高级职称限2项（根据年度政策自动更新）" },
    { id: "r2", content: "合作单位盖章：需提前10个工作日申请" },
  ],
  notes: "本批次申报将由科研处统一组织形式审查，请各申请人务必在校内截止日期前提交。",
}

// 模拟API请求获取申报数据
const fetchApplicationData = async (id: string): Promise<ApplicationFormData> => {
  // 实际应用中这里会发送API请求获取数据
  await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟
  return Promise.resolve(mockApplicationData)
}

// 模拟API请求更新申报数据
const updateApplicationData = async (id: string, data: ApplicationFormData): Promise<boolean> => {
  // 实际应用中这里会发送API请求更新数据
  await new Promise(resolve => setTimeout(resolve, 800)) // 模拟网络延迟
  console.log('更新的数据:', data)
  return Promise.resolve(true)
}

export default function ApplicationEditPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ApplicationFormData | undefined>(undefined)
  const [currentStep, setCurrentStep] = useState(0) 
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false) // 新增isSuccess状态
  
  // 获取申报数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApplicationData(applicationId)
        setFormData(data)
      } catch (error) {
        console.error('Failed to fetch application data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [applicationId])
  
  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 跳转到指定步骤，并更新当前步骤
    setCurrentStep(step)
  }
  
  // 保存更新后的申报数据
  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (formData) {
        const success = await updateApplicationData(applicationId, formData)
        if (success) {
          // 设置成功状态为true
          setIsSuccess(true)
        }
      }
      return Promise.resolve()
    } catch (error) {
      console.error('Failed to update application:', error)
      return Promise.reject(error)
    } finally {
      setSaving(false)
    }
  }
  
  // 保存草稿
  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      if (formData) {
        await updateApplicationData(applicationId, formData)
        setLastSaved(new Date())
      }
      return Promise.resolve()
    } catch (error) {
      console.error('Failed to save draft:', error)
      return Promise.reject(error)
    } finally {
      setIsSaving(false)
    }
  }
  
  // 下一步
  const handleNext = () => {
    const currentStepId = STEPS[currentStep]?.id
    
    // 验证当前步骤 (这里简化处理，实际应用需要更详细的验证逻辑)
    if (currentStepId !== undefined) {
      // 添加当前步骤到已完成步骤中
      if (!completedSteps.includes(currentStepId)) {
        setCompletedSteps([...completedSteps, currentStepId])
      }
      
      // 进入下一步
      setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))
    }
  }
  
  // 上一步
  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }
  
  // 定义申报表单步骤
  const applicationStepComponents = [
    <StepBasic 
      key="basic"
      formData={formData || {}} 
      setFormData={setFormData} 
      mode={FormMode.EDIT} 
      disabledFields={['type', 'category']} 
    />,
    <StepMaterials 
      key="materials"
      formData={formData || {}} 
      setFormData={setFormData} 
      mode={FormMode.EDIT}
    />,
    <StepDates 
      key="dates"
      formData={formData || {}} 
      setFormData={setFormData} 
      mode={FormMode.EDIT}
    />,
    <StepRequirements 
      key="requirements"
      formData={formData || {}} 
      setFormData={setFormData} 
      mode={FormMode.EDIT}
    />,
    <StepComplete 
      key="complete"
      formData={formData || {}} 
      onSubmit={handleSubmit} 
      isSubmitting={saving}
      mode={FormMode.EDIT}
    />,
  ]

  // 渲染当前步骤内容
  const renderStepContent = () => {
    return applicationStepComponents[currentStep] || null
  }

  // 渲染成功页面
  const renderSuccessPage = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center">申请提交成功</h2>
        <p className="text-center text-gray-600 max-w-md">
          您的申请已经成功提交，我们将在短时间内与您联系，请您耐心等待。
        </p>
        <div className="flex space-x-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/applications')}
          >
            返回列表
          </Button>
          <Button 
            onClick={() => router.push(`/applications/view/${applicationId}`)}
          >
            查看申请
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    )
  }

  if (isSuccess) {
    return renderSuccessPage()
  }

  return (
    <div className="2xl:max-w-[1440px] 2xl:mx-auto w-full py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{formData?.name || "编辑申报批次"}</h1>
      </div>

      <div className="space-y-6">
        {/* 步骤导航 */}
        <div className="mb-2">
          <StepNavigation
            currentStep={currentStep}
            goToStep={goToStep}
            validationErrors={validationErrors}
            completedSteps={completedSteps}
          />
        </div>

        {/* 步骤内容 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <Card className="border-0 shadow-none">
            <CardContent className="pt-6 px-6">
              {renderStepContent()}
            </CardContent>

            {currentStep === 4 ? (
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => goToStep(currentStep - 1)}
                  >
                    上一步
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        正在提交...
                      </>
                    ) : (
                      "确认提交"
                    )}
                  </Button>
                </div>
              </CardFooter>
            ) : (
              <CardFooter className="flex justify-between py-4 px-6 mt-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="relative">
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                        正在保存...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        保存草稿
                      </>
                    )}
                  </Button>
                  {lastSaved && (
                    <span className="text-xs text-muted-foreground">
                      最后保存: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      上一步
                    </Button>
                  )}
                  
                  {currentStep < 4 ? (
                    <Button type="button" onClick={handleNext}>
                      下一步
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : null}
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
