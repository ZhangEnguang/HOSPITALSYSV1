"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  FormMode, 
  ApplicationFormData,
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
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"

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

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<ApplicationFormData | undefined>(undefined)
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  
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
    setCurrentStep(step)
  }
  
  // 申报表单步骤
  const applicationStepComponents = formData ? [
    <StepBasic 
      key="basic"
      formData={formData} 
      setFormData={setFormData} 
      mode={FormMode.VIEW} 
    />,
    <StepMaterials 
      key="materials"
      formData={formData} 
      setFormData={setFormData} 
      mode={FormMode.VIEW}
    />,
    <StepDates 
      key="dates"
      formData={formData} 
      setFormData={setFormData} 
      mode={FormMode.VIEW}
    />,
    <StepRequirements 
      key="requirements"
      formData={formData} 
      setFormData={setFormData} 
      mode={FormMode.VIEW}
    />,
    <StepComplete 
      key="complete"
      formData={formData} 
      mode={FormMode.VIEW}
    />,
  ] : [];

  // 渲染步骤内容
  const renderStepContent = () => {
    if (!formData || applicationStepComponents.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">暂无申报数据</p>
        </div>
      );
    }
    return applicationStepComponents[currentStep] || null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    )
  }

  // 已完成步骤
  const completedSteps = [0, 1, 2, 3, 4]

  return (
    <div className="2xl:max-w-[1440px] 2xl:mx-auto w-full py-6">
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{formData?.name || "查看申报项目"}</h1>
      </div>

      {/* 副标题：项目分类·申报日期·申报类型 */}
      {formData && (
        <div className="flex items-center text-muted-foreground text-sm mb-6 ml-10">
          {formData.category && (
            <span className="inline-flex items-center">
              {formData.category}
            </span>
          )}
          
          {formData.category && formData.startDate && (
            <span className="mx-2">·</span>
          )}
          
          {formData.startDate && formData.endDate && (
            <span className="inline-flex items-center">
              申报日期: {format(new Date(formData.startDate), "yyyy-MM-dd")} 至 {format(new Date(formData.endDate), "yyyy-MM-dd")}
            </span>
          )}
          
          {((formData.category && formData.type) || (formData.startDate && formData.type)) && (
            <span className="mx-2">·</span>
          )}
          
          {formData.type && (
            <span className="inline-flex items-center">
              {formData.type}
            </span>
          )}
        </div>
      )}

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
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
