"use client"

import { useState, useEffect, useRef } from "react"
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
import { BatchBasicInfoStep, BatchBasicInfoStepRef } from "./form-steps/batch-basic-info-step"
import { ReviewConfigStep, ReviewConfigStepRef } from "./form-steps/review-config-step"
import { ReviewPreviewStep } from "./form-steps/review-preview-step"

// 示例数据（编辑模式下使用）
const sampleBatchData = {
  "评审计划名称": "2025年度第一批校级科研项目评审",
  "批次编号": "XKPS-2025-01",
  "批次类型": "评审批次",
  "项目类型": "校级科研项目",
  "评审开始日期": "2025-03-15T00:00:00.000Z",
  "评审结束日期": "2025-04-15T00:00:00.000Z",
  "评审指南": "本批次面向全校教师，采用线上评审方式，对本年度第一批科研项目进行评审。\n\n评审着重考察项目的创新性、可行性和学术价值。",
  "评审指南附件": "评审指南.pdf",
  "备注": "本次评审为试点项目，过程中可能会有调整。",
  "reviewPlan": "plan2",
  "reviewType": "regular",
  "reviewerIds": ["user1", "user3", "user5"],
  "reviewItems": ["item1", "item2", "item3"],
  "groupReview": true,
  "reviewFlow": "sequential",
  "minReviewers": "2",
  "isBlindReview": false,
  "批次状态": "未发布",
  "是否公开": "是",
  "要求_职称要求": true,
  "职称要求": "副高及以上",
  "要求_部门限制": false
}

export default function ReviewBatchFormPage() {
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false) // 查看模式
  const [initialData, setInitialData] = useState<Record<string, any>>({})
  const [formData, setFormData] = useState<Record<string, any>>({
    "reviewPlan": "",
    "reviewType": "regular",
    "reviewerIds": [],
    "reviewItems": [],
    "groupReview": false,
    "reviewFlow": "sequential",
    "minReviewers": "1",
    "isBlindReview": false
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)
  
  // 添加refs
  const basicInfoStepRef = useRef<BatchBasicInfoStepRef>(null)
  const configStepRef = useRef<ReviewConfigStepRef>(null)
  
  // 从URL获取模式和ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    const mode = urlParams.get('mode') // 可以使用mode=view来标记查看模式
    
    if (id) {
      console.log("检测到ID参数:", id, "模式:", mode || "编辑模式")
      setBatchId(id)
      
      if (mode === 'view') {
        setIsViewMode(true)
      } else {
        setIsEditMode(true)
      }
      
      // 模拟从API获取数据，这里使用示例数据
      // TODO: 实际项目中应该实现fetchBatchData(id)函数来从API获取真实数据
      const fetchData = async () => {
        try {
          console.log("开始获取批次数据，ID:", id)
          // 模拟API调用延迟
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // 在实际项目中，这里应该调用API:
          // const response = await fetch(`/api/batches/${id}`)
          // const data = await response.json()
          
          // 使用示例数据代替
          const data = sampleBatchData
          console.log("成功获取批次数据:", data)
          
          setInitialData(data)
          setFormData(data)
          setCompletedSteps([0, 1, 2])
        } catch (error) {
          console.error("获取批次数据失败:", error)
          toast({
            title: "数据加载失败",
            description: "无法获取批次信息，请稍后重试",
            variant: "destructive",
          })
        }
      }
      
      fetchData()
    } else {
      console.log("未检测到ID参数，进入创建模式")
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
    
    return "创建评审批次"
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    let errors: Record<string, string> = {}
    console.log("验证当前步骤:", currentStep, formData)

    if (currentStep === 0) {
      // 基本信息验证
      if (!formData["评审计划名称"]) errors["评审计划名称"] = "评审计划名称不能为空"
      if (!formData["评审开始日期"]) errors["评审开始日期"] = "请选择评审开始日期"
      if (!formData["评审结束日期"]) errors["评审结束日期"] = "请选择评审结束日期"
      
      if (formData["评审开始日期"] && formData["评审结束日期"]) {
        const startDate = new Date(formData["评审开始日期"])
        const endDate = new Date(formData["评审结束日期"])
        if (endDate < startDate) {
          errors["评审结束日期"] = "结束日期不能早于开始日期"
        }
      }
    } else if (currentStep === 1) {
      // 评审配置验证
      if (!formData["reviewType"]) errors["reviewType"] = "请选择评审类型"
      if (!formData.reviewerIds || formData.reviewerIds.length === 0) {
        errors["reviewerIds"] = "请选择至少一名评审人员"
      }
      if (!formData.reviewItems || formData.reviewItems.length === 0) {
        errors["reviewItems"] = "请选择至少一项评审内容"
      }
    }

    console.log("验证错误:", errors)
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 更新下一步函数
  const handleNextStep = async () => {
    // 当前是基本信息步骤时，调用表单的提交方法
    if (currentStep === 0 && basicInfoStepRef.current) {
      const isValid = await basicInfoStepRef.current.submit();
      if (isValid) {
        // 表单验证通过，记录完成的步骤并前进到下一步
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep]);
        }
        setCurrentStep((prev) => prev + 1);
      }
    } else if (currentStep === 1 && configStepRef.current) {
      // 当前是评审配置步骤时
      const isValid = await configStepRef.current.submit();
      if (isValid) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep]);
        }
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      // 其他步骤使用原有逻辑
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
      console.log(`开始${isEditMode ? '更新' : '创建'}评审批次:`, formData)
      
      // 实际项目中应实现API调用
      // const url = isEditMode ? `/api/batches/${batchId}` : '/api/batches'
      // const method = isEditMode ? 'PUT' : 'POST'
      // const response = await fetch(url, { 
      //   method, 
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData) 
      // })
      // const data = await response.json()
      // console.log("API响应:", data)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setIsSubmitting(false)
      
      if (isEditMode) {
        // 编辑模式下提交成功后，显示成功消息并返回列表
        toast({
          title: "更新成功",
          description: `评审批次 "${formData["评审计划名称"]}" 已成功更新`,
        })
        // 延迟后返回列表页
        setTimeout(() => {
          router.push('/applications')
        }, 1500)
      } else {
        // 创建模式下显示完成对话框
        setIsCompleted(true)
        setShowCompletionDialog(true)
      }
    } catch (error) {
      console.error("提交失败:", error)
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
      "reviewPlan": "",
      "reviewType": "regular",
      "reviewerIds": [],
      "reviewItems": [],
      "groupReview": false,
      "reviewFlow": "sequential",
      "minReviewers": "1",
      "isBlindReview": false
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
            ref={basicInfoStepRef}
            formData={formData}
            updateFormData={setFormData}
            onValidationChange={(errors) => setValidationErrors(errors)}
            onStepComplete={handleNextStep}
          />
        )
      case 1:
        return (
          <ReviewConfigStep
            ref={configStepRef}
            formData={formData}
            updateFormData={setFormData}
            onValidationChange={(errors) => setValidationErrors(errors)}
            onStepComplete={handleNextStep}
            onPrevStep={handlePrevStep}
          />
        )
      case 2:
        return (
          <ReviewPreviewStep formData={formData} />
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
      <Card className="mb-6">
        <CardContent className="pt-6">
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
            <DialogTitle>{isEditMode ? "评审批次更新成功" : "评审批次创建成功"}</DialogTitle>
            <DialogDescription>
              您已成功{isEditMode ? "更新" : "创建"}评审批次 <span className="font-medium">{formData["评审计划名称"]}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            {!isEditMode && (
              <Button onClick={handleContinueAdd}>
                继续添加
              </Button>
            )}
            <Button variant="outline" onClick={handleBackToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 