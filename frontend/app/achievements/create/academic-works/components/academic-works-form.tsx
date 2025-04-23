"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { StepContentDetails } from "./form-steps/step-content-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepCompletion } from "./form-steps/step-completion"

export function AcademicWorksForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState(false)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    title: "",
    workType: "",
    publisher: "",
    publishDate: undefined,
    isbn: "",
    pages: "",
    words: "",
    category: "",

    // 作者信息
    firstAuthor: "",
    editor: "",
    otherAuthors: "",
    contribution: "",

    // 内容详情
    summary: "",
    keywords: "",
    series: "",
    awards: "",

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
    }
  }

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      if (!formData.title) errors["著作名称"] = true
      if (!formData.workType) errors["著作类型"] = true
      if (!formData.publisher) errors["出版社"] = true
      if (formData.publishDate === undefined) errors["出版日期"] = true
      if (!formData.isbn) errors["ISBN"] = true
      if (!formData.category) errors["学科分类"] = true
    } else if (currentStep === 1) {
      // 验证作者信息
      if (!formData.firstAuthor) errors["第一作者"] = true
      if (!formData.editor) errors["主编"] = true
      if (!formData.contribution) errors["本人贡献"] = true
    } else if (currentStep === 2) {
      // 验证内容详情
      if (!formData.summary) errors["内容简介"] = true
      if (!formData.keywords) errors["关键词"] = true
    }
    
    updateFormData("validationErrors", errors)
    return Object.keys(errors).length === 0
  }

  // 处理下一步
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  // 处理上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 处理完成
  const handleComplete = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setShowDialog(true)
    }
  }

  // 处理继续添加
  const handleContinueAdding = () => {
    setShowDialog(false)
    // 重置表单
    setFormData({
      title: "",
      workType: "",
      publisher: "",
      publishDate: undefined,
      isbn: "",
      pages: "",
      words: "",
      category: "",
      firstAuthor: "",
      editor: "",
      otherAuthors: "",
      contribution: "",
      summary: "",
      keywords: "",
      series: "",
      awards: "",
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
          <StepAuthorInfo 
            formData={formData} 
            updateFormData={updateFormData} 
            validationErrors={formData.validationErrors} 
          />
        )
      case 2:
        return (
          <StepContentDetails 
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
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">新增学术著作</h1>
      </div>

      {/* 步骤导航 */}
      <StepNavigation 
        currentStep={currentStep} 
        goToStep={goToStep} 
        validationErrors={formData.validationErrors}
        completedSteps={completedSteps}
      />

      {/* 步骤内容 */}
      <Card>
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

        <div>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              下一步
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <Save className="mr-2 h-4 w-4" />
              提交
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
              您的学术著作已成功提交。您想继续添加新的学术著作，还是返回列表页面？
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
