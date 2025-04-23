"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Info } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StepNavigation, getStepsByFormType } from "./components/step-navigation"
import { CompletionNotice } from "./components/completion-notice"
import {
  BasicInfoStep,
  TeamMembersStep,
  ProjectDetailStep,
  BudgetPlanStep,
  AttachmentsStep
} from "./form-steps"
import { CompletionPreviewStep } from "./form-steps/completion-preview-step"
import { extendedApplicationItems } from "../../data/applications-data"

export default function CreateApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const batchId = searchParams ? searchParams.get('batchId') || '' : ''
  const formType = searchParams ? searchParams.get('formType') || '' : ''
  
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [validationErrorFlags, setValidationErrorFlags] = useState<Record<string, boolean>>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [batchInfo, setBatchInfo] = useState<{ formGenerationType?: string } | null>(null)
  const [steps, setSteps] = useState<Array<{ id: number; name: string; description?: string }>>([])
  
  // 加载批次信息
  useEffect(() => {
    if (batchId) {
      // 从模拟数据中获取批次信息
      const batch = extendedApplicationItems.find(item => item.id === batchId)
      if (batch) {
        // 优先使用从URL中获取的formType，如果没有则使用批次数据中的formGenerationType
        const generationType = formType || batch.formGenerationType || "全流程在线生成";
        setBatchInfo({
          formGenerationType: generationType
        })
        
        // 设置申请书生成方式到表单数据中
        setFormData(prev => ({
          ...prev,
          "申请书生成方式": generationType
        }))
        
        // 根据申请书生成方式设置步骤
        setSteps(getStepsByFormType(generationType));
      }
    } else {
      // 如果有指定的表单类型但没有批次ID
      if (formType) {
        setFormData(prev => ({
          ...prev,
          "申请书生成方式": formType
        }));
        setBatchInfo({
          formGenerationType: formType
        });
        setSteps(getStepsByFormType(formType));
      } else {
        // 默认为全流程在线生成
        setSteps(getStepsByFormType("全流程在线生成"));
      }
    }
  }, [batchId, formType])

  // 当申请书生成方式变化时更新步骤
  useEffect(() => {
    if (formData["申请书生成方式"]) {
      setSteps(getStepsByFormType(formData["申请书生成方式"]));
    }
  }, [formData["申请书生成方式"]])
  
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
      
      setValidationErrorFlags((prev) => ({
        ...prev,
        [field]: false,
      }))
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    let errors: Record<string, string> = {}
    let errorFlags: Record<string, boolean> = {}
    
    const currentStepName = steps[currentStep]?.name || "";
    
    if (currentStepName === "基本信息") {
      // 基本信息验证
      if (!formData["项目名称"]) {
        errors["项目名称"] = "项目名称不能为空"
        errorFlags["项目名称"] = true
      }
      if (!formData["项目分类"]) {
        errors["项目分类"] = "请选择项目分类"
        errorFlags["项目分类"] = true
      }
      if (!formData["申请人"]) {
        errors["申请人"] = "请填写申请人信息"
        errorFlags["申请人"] = true
      }
      if (!formData["所属单位"]) {
        errors["所属单位"] = "请选择所属单位"
        errorFlags["所属单位"] = true
      }
      if (!formData["性别"]) {
        errors["性别"] = "请选择性别"
        errorFlags["性别"] = true
      }
      if (!formData["研究开始日期"]) {
        errors["研究开始日期"] = "请选择研究开始日期"
        errorFlags["研究开始日期"] = true
      }
      if (!formData["研究结束日期"]) {
        errors["研究结束日期"] = "请选择研究结束日期"
        errorFlags["研究结束日期"] = true
      }
      if (!formData["申请经费"]) {
        errors["申请经费"] = "请填写申请经费"
        errorFlags["申请经费"] = true
      }
      if (!formData["一级学科"]) {
        errors["一级学科"] = "请选择一级学科"
        errorFlags["一级学科"] = true
      }
      if (!formData["预期成果"] || 
          !Array.isArray(formData["预期成果"]) || 
          formData["预期成果"].length === 0) {
        errors["预期成果"] = "请至少选择一项预期成果"
        errorFlags["预期成果"] = true
      }
      if (!formData["关键词"]) {
        errors["关键词"] = "请填写关键词"
        errorFlags["关键词"] = true
      }
      if (!formData["项目摘要"]) {
        errors["项目摘要"] = "请填写项目摘要"
        errorFlags["项目摘要"] = true
      }
    } else if (currentStepName === "成员信息") {
      // 成员信息验证
      if (!formData["项目成员"] || !Array.isArray(formData["项目成员"]) || formData["项目成员"].length === 0) {
        errors["项目成员"] = "请至少添加一名项目成员"
        errorFlags["项目成员"] = true
      }
    } else if (currentStepName === "经费预算") {
      // 经费预算验证
      if (!formData["总预算"]) {
        errors["总预算"] = "请填写总预算"
        errorFlags["总预算"] = true
      }
      if (formData["总预算"] && isNaN(Number(formData["总预算"]))) {
        errors["总预算"] = "总预算必须是数字"
        errorFlags["总预算"] = true
      }
    } else if (currentStepName === "正文信息") {
      // 项目详情验证 - 根据申请书生成方式进行不同的验证
      const isIntelligentGeneration = formData["申请书生成方式"] === "智能协同生成";
      
      if (isIntelligentGeneration) {
        // 智能协同生成模式下验证正文文件
        if (!formData["申报书正文"]) {
          errors["申报书正文"] = "请上传申报书正文文件"
          errorFlags["申报书正文"] = true
        }
      } else {
        // 全流程在线生成模式下验证具体字段
        if (!formData["研究背景"]) {
          errors["研究背景"] = "请填写研究背景"
          errorFlags["研究背景"] = true
        }
        if (!formData["研究目标"]) {
          errors["研究目标"] = "请填写研究目标"
          errorFlags["研究目标"] = true
        }
        if (!formData["研究内容"]) {
          errors["研究内容"] = "请填写研究内容"
          errorFlags["研究内容"] = true
        }
        if (!formData["预期成果详情"]) {
          errors["预期成果详情"] = "请填写预期成果详情"
          errorFlags["预期成果详情"] = true
        }
      }
    } else if (currentStepName === "附件材料") {
      // 附件材料验证 - 线下模板化时需要上传附件
      // 这里可以根据需要添加附件上传的验证
    }

    setValidationErrors(errors)
    setValidationErrorFlags(errorFlags)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
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
    // 保存当前步骤
    const originalStep = currentStep
    
    // 验证所有步骤
    let allValid = true
    for (let step = 0; step < steps.length - 1; step++) {
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
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // 模拟成功响应
      setIsCompleted(true)
      setShowCompletionDialog(true)
      
    } catch (error) {
      console.error("提交失败:", error)
      toast({
        title: "提交失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 返回列表页
  const handleBackToList = () => {
    router.push('/applications')
  }

  // 重置表单，创建新申报
  const handleCreateNew = () => {
    setFormData({})
    setCurrentStep(0)
    setValidationErrors({})
    setValidationErrorFlags({})
    setCompletedSteps([])
    setIsCompleted(false)
    setShowCompletionDialog(false)
  }
  
  // 渲染步骤内容
  const renderStepContent = () => {
    const currentStepName = steps[currentStep]?.name || "";
    
    switch (currentStepName) {
      case "基本信息":
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "成员信息":
        return (
          <TeamMembersStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "经费预算":
        return (
          <BudgetPlanStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "正文信息":
        return (
          <ProjectDetailStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
            batchInfo={{
              formGenerationType: formType || batchInfo?.formGenerationType || formData["申请书生成方式"] || "全流程在线生成"
            }}
          />
        )
      case "附件材料":
        return (
          <AttachmentsStep
            formData={formData}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        )
      case "预览确认":
        return (
          <CompletionPreviewStep
            formData={formData}
          />
        )
      default:
        return null
    }
  }
  
  // 如果步骤列表还没有加载，显示加载状态
  if (steps.length === 0) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <h1 className="text-2xl font-semibold">创建申报书</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">加载中...</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8 space-y-6">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToList}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-semibold">创建申报书</h1>
      </div>

      {/* 步骤条导航 */}
      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
        validationErrors={validationErrorFlags}
      />

      {/* 表单主体 */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          {/* 步骤内容 */}
          {renderStepContent()}
        </CardContent>

        {/* 表单底部操作按钮 */}
        <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              onClick={handlePrevStep}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              上一步
            </Button>
          ) : (
            <div></div>
          )}
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNextStep}>
                下一步
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "提交中..." : "提交申报"}
                <Save className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* 成功提交对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>申报提交成功</DialogTitle>
            <DialogDescription>
              您的申报已成功提交，请等待审核
            </DialogDescription>
          </DialogHeader>
          <CompletionNotice onCreateNew={handleCreateNew} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 