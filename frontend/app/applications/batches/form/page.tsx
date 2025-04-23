"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StepNavigation, STEPS } from "./components/step-navigation"
import { CompletionNotice } from "./components/completion-notice"
import { BatchBasicInfoStep } from "./form-steps/batch-basic-info"
import { BatchConfigStep } from "./form-steps/batch-config-step"
import { BatchPreviewStep } from "./form-steps/batch-preview-step"

// 示例数据（编辑模式下使用）
const sampleBatchData = {
  "计划名称": "2025年度第一批校级科研项目申报",
  "项目分类": "校级科研项目",
  "申报开始日期": "2025-02-01T00:00:00.000Z",
  "申报结束日期": "2025-03-01T00:00:00.000Z",
  "申请指南": {
    fileName: "2025年度科研项目申请指南.pdf"
  },
  "批次说明": "本批次面向全校教师，采用线上申报方式，申报手续简化。\n\n重点支持人工智能、新能源、新材料等领域的基础研究和应用研究。",
  "申报书生成方式": "智能协同生成",
  "每人最大申报数量": "2",
  "项目预算上限": "10",
  "批次状态": "已发布",
  "是否公开": "是",
  "要求_职称要求": true,
  "职称要求": "副高及以上",
  "要求_部门限制": false,
  "申报材料": [
    {
      "id": "1",
      "名称": "申报书",
      "必填": true,
      "说明": "请下载模板填写，并转成PDF格式上传"
    },
    {
      "id": "2",
      "名称": "研究计划书",
      "必填": true,
      "说明": "请下载模板填写，包含研究背景、意义、目标、内容、方法、创新点等"
    },
    {
      "id": "3",
      "名称": "预算申请表",
      "必填": true,
      "说明": "请按照模板要求详细列出各项经费预算"
    },
    {
      "id": "4",
      "名称": "作者简历",
      "必填": false,
      "说明": "请提供项目负责人和主要参与人的简历"
    }
  ]
}

export default function ApplicationBatchFormPage() {
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false) // 查看模式
  const [initialData, setInitialData] = useState<Record<string, any>>({})
  const [formData, setFormData] = useState<Record<string, any>>({
    "批次状态": "未发布",
    "是否公开": "是"
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)
  
  // 从URL获取模式和ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    const mode = urlParams.get('mode') // 可以使用mode=view来标记查看模式
    
    if (id) {
      setBatchId(id)
      
      if (mode === 'view') {
        setIsViewMode(true)
      } else {
        setIsEditMode(true)
      }
      
      // 模拟从API获取数据，这里使用示例数据
      // 实际应调用API：fetchBatchData(id)
      setInitialData(sampleBatchData)
      setFormData(sampleBatchData)
      setCompletedSteps([0, 1, 2, 3])
    }
  }, [])
  
  // 处理输入变化
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除该字段的验证错误
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 获取页面标题
  const getPageTitle = () => {
    if (isViewMode) {
      return "查看批次详情"
    }
    
    if (isEditMode) {
      return "编辑批次信息"
    }
    
    return "创建申报批次"
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    let errors: Record<string, string> = {}
    console.log("验证当前步骤:", currentStep, formData)

    if (currentStep === 0) {
      // 基本信息验证
      if (!formData["计划名称"]) errors["计划名称"] = "计划名称不能为空"
      if (!formData["项目分类"]) errors["项目分类"] = "请选择项目分类"
      if (!formData["申报开始日期"]) errors["申报开始日期"] = "请选择申报开始日期"
      if (!formData["申报结束日期"]) errors["申报结束日期"] = "请选择申报结束日期"
      if (!formData["申请指南"]) errors["申请指南"] = "请上传申请指南"
      
      if (formData["申报开始日期"] && formData["申报结束日期"]) {
        const startDate = new Date(formData["申报开始日期"])
        const endDate = new Date(formData["申报结束日期"])
        if (endDate < startDate) {
          errors["申报结束日期"] = "申报结束日期不能早于申报开始日期"
        }
      }
    } 

    console.log("验证错误:", errors)
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        // 记录完成的步骤
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep])
        }
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  // 上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // 跳转到特定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  // 处理表单提交
  const handleSubmit = async () => {
    // 查看模式下不允许提交
    if (isViewMode) {
      router.push('/applications')
      return
    }
    
    // 保存当前步骤
    const originalStep = currentStep
    
    // 验证所有步骤
    let allValid = true
    for (let step = 0; step < STEPS.length - 1; step++) {
      setCurrentStep(step)
      if (!validateCurrentStep()) {
        allValid = false
        break
      }
    }
    
    // 恢复到原来的步骤
    setCurrentStep(originalStep)
    
    if (!allValid) {
      toast({
        title: "表单验证失败",
        description: "请检查并修正表单中的错误",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      console.log("提交数据:", formData)
      
      // 实际项目中应实现API调用
      // const url = isEditMode ? `/api/batches/${batchId}` : '/api/batches'
      // const method = isEditMode ? 'PUT' : 'POST'
      // const response = await fetch(url, { method, body: JSON.stringify(formData) })
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setIsSubmitting(false)
      setIsCompleted(true)
      setShowCompletionDialog(true)
      
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "提交失败",
        description: "服务器错误，请稍后重试",
        variant: "destructive",
      })
    }
  }
  
  // 继续添加新批次
  const handleContinueAdd = () => {
    setShowCompletionDialog(false)
    setFormData({
      "批次状态": "未发布",
      "是否公开": "是"
    })
    setCompletedSteps([])
    setCurrentStep(0)
    setIsCompleted(false)
  }
  
  // 返回列表
  const handleBackToList = () => {
    router.push('/applications')
  }
  
  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BatchBasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
            isViewMode={isViewMode}
          />
        )
      case 1:
        return (
          <BatchConfigStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <BatchPreviewStep
            formData={formData}
            isViewMode={isViewMode}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container py-6">
      {/* 返回按钮和标题 */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => router.push('/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
      </div>

      {/* 步骤导航 */}
      <div className="mb-6">
        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors as any}
          completedSteps={completedSteps}
        />
      </div>

      {/* 表单内容 */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between py-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            上一步
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNextStep}>
              下一步
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || isViewMode}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-1">⏳</span>
                  提交中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  {isEditMode ? "保存修改" : "提交"}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>申报批次创建成功</DialogTitle>
            <DialogDescription>
              您已成功创建申报批次 <span className="font-medium">{formData["计划名称"]}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button onClick={handleContinueAdd}>
              继续添加
            </Button>
            <Button variant="outline" onClick={handleBackToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
