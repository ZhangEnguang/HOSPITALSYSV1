"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
import { StepAuthorInfo } from "./form-steps/step-author-info"
import { StepAwardInfo } from "./form-steps/step-award-info"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepCompletion } from "./form-steps/step-completion"

type AchievementAwardsFormProps = {
  initialData: any
  mode: "create" | "edit"
}

export function AchievementAwardsForm({
  initialData,
  mode
}: AchievementAwardsFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    awardName: initialData?.awardName || "",
    awardLevel: initialData?.awardLevel || "",
    awardDate: initialData?.awardDate ? new Date(initialData.awardDate) : undefined,
    awardingBody: initialData?.awardingBody || "",

    // 获奖人信息
    firstAuthor: initialData?.firstAuthor || "",
    secondAuthor: initialData?.secondAuthor || "",
    otherAuthors: initialData?.otherAuthors || "",
    contribution: initialData?.contribution || "",
    rankingConfirmed: initialData?.rankingConfirmed || false,

    // 奖励信息
    awardCategory: initialData?.awardCategory || "",
    awardRank: initialData?.awardRank || "",
    certificateNumber: initialData?.certificateNumber || "",
    awardDescription: initialData?.awardDescription || "",

    // 文档上传
    files: initialData?.files || [],
    
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
      if (!formData.awardName) errors["奖励名称"] = true
      if (!formData.awardLevel) errors["奖励级别"] = true
      if (formData.awardDate === undefined) errors["获奖日期"] = true
      if (!formData.awardingBody) errors["颁奖单位"] = true
    } else if (currentStep === 1) {
      // 验证获奖人信息
      if (!formData.firstAuthor) errors["第一获奖人"] = true
      if (!formData.contribution) errors["本人贡献"] = true
    } else if (currentStep === 2) {
      // 验证奖励信息
      if (!formData.awardCategory) errors["奖励类别"] = true
      if (!formData.awardRank) errors["奖励等级"] = true
      if (!formData.certificateNumber) errors["证书编号"] = true
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
          <StepAuthorInfo 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 2:
        return (
          <StepAwardInfo 
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
    <div className="space-y-6 w-full">
      {/* 步骤导航 */}
      <StepNavigation 
        currentStep={currentStep} 
        goToStep={goToStep} 
        validationErrors={formData.validationErrors}
        completedSteps={completedSteps}
      />

      {/* 步骤内容 */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          上一步
        </Button>
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            下一步
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : "更新成果获奖"}
          </Button>
        )}
      </div>

      {/* 成功对话框 */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>成果获奖已更新</AlertDialogTitle>
            <AlertDialogDescription>
              您的成果获奖信息已成功更新。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleReturnToList}>返回列表</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 