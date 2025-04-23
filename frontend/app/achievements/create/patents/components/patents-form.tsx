"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { StepNavigation, STEPS } from "./step-navigation"
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepInventorInfo } from "./form-steps/step-inventor-info"
import { StepPatentDetails } from "./form-steps/step-patent-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepCompletion } from "./form-steps/step-completion"

export function PatentsForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    patentNumber: "",
    patentName: "",
    patentType: "",
    patentStatus: "",
    applicationDate: "",
    approvalDate: "",

    // 发明人信息
    inventors: "",
    affiliatedUnit: "",

    // 专利详情
    patentAbstract: "",
    disciplineCategory: "",
    applicationArea: "",
    
    // 文档上传
    files: [],
    
    // 验证错误
    validationErrors: {} as Record<string, boolean>,
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    if (field === "validationErrors") {
      setFormData({ ...formData, validationErrors: value })
    } else {
      setFormData({ ...formData, [field]: value })
      
      // 清除该字段的验证错误
      if (formData.validationErrors[field]) {
        const newErrors = { ...formData.validationErrors }
        delete newErrors[field]
        setFormData(prev => ({ ...prev, validationErrors: newErrors }))
      }
    }
  }

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      if (!formData.patentNumber) errors["专利号"] = true
      if (!formData.patentName) errors["专利名称"] = true
      if (!formData.patentType) errors["专利类型"] = true
      if (!formData.patentStatus) errors["专利状态"] = true
      if (!formData.applicationDate) errors["申请日期"] = true
    } else if (currentStep === 1) {
      // 验证发明人信息
      if (!formData.inventors) errors["发明人"] = true
      if (!formData.affiliatedUnit) errors["所属单位"] = true
    } else if (currentStep === 2) {
      // 验证专利详情
      if (!formData.patentAbstract) errors["专利摘要"] = true
      if (!formData.disciplineCategory) errors["学科类别"] = true
      if (!formData.applicationArea) errors["应用领域"] = true
    }
    
    updateFormData("validationErrors", errors)
    return Object.keys(errors).length === 0
  }

  // 处理下一步
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => [...prev.filter(step => step !== currentStep), currentStep])
      setCurrentStep(prev => prev + 1)
    }
  }

  // 处理上一步
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  // 处理完成
  const handleComplete = async () => {
    if (validateCurrentStep()) {
      setIsSubmitting(true)
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 显示成功对话框
        setShowDialog(true)
        setIsSubmitting(false)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: "提交失败",
          description: "请稍后重试",
          variant: "destructive",
        })
      }
    }
  }

  // 处理继续添加
  const handleContinueAdding = () => {
    setShowDialog(false)
    // 重置表单
    setFormData({
      patentNumber: "",
      patentName: "",
      patentType: "",
      patentStatus: "",
      applicationDate: "",
      approvalDate: "",
      inventors: "",
      affiliatedUnit: "",
      patentAbstract: "",
      disciplineCategory: "",
      applicationArea: "",
      files: [],
      validationErrors: {},
    })
    setCurrentStep(0)
    setCompletedSteps([])
  }

  // 处理返回列表
  const handleReturnToList = () => {
    setShowDialog(false)
    router.push("/achievements")
  }

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasicInfo 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 1:
        return (
          <StepInventorInfo 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 2:
        return (
          <StepPatentDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 3:
        return (
          <StepDocumentUpload 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 4:
        return <StepCompletion formData={formData} />
      default:
        return null
    }
  }

  // 前往指定步骤
  const goToStep = (step: number) => {
    // 只允许前往已完成的步骤或当前步骤
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center mb-4">
        <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">新增专利</h1>
      </div>

      {/* 步骤导航 */}
      <StepNavigation 
        currentStep={currentStep} 
        goToStep={goToStep} 
        validationErrors={formData.validationErrors}
        completedSteps={completedSteps}
      />

      {/* 步骤内容 */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="pt-4">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          上一步
        </Button>

        <div>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              下一步
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">提交中...</span>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  提交
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 完成对话框 */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提交成功</AlertDialogTitle>
            <AlertDialogDescription>
              您的专利信息已成功提交。您想继续添加新的专利还是返回列表?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleContinueAdding}>继续添加</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnToList}>返回列表</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
