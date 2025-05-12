"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Save
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"

import { STEPS, StepNavigation } from "./step-navigation"
import { StepExperimentInfo } from "./form-steps/step-experiment-info"
import { StepExperimentResult } from "./form-steps/step-experiment-result"
import { StepExperimentProcedure } from "./form-steps/step-experiment-procedure"
import { StepDataAnalysis } from "./form-steps/step-data-analysis"
import { StepComplete } from "./form-steps/step-complete"

interface AnimalExperimentDataUploadFormProps {
  projectId: string
}

// 动物伦理实验数据上传表单组件
export function AnimalExperimentDataUploadForm({ projectId }: AnimalExperimentDataUploadFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 试验阶段信息
    experimentStage: "",
    experimentDate: new Date(),
    experimentLocation: "",
    experimentOperator: "",
    experimentEquipment: "",
    
    // 实验结果
    resultSummary: "",
    animalCondition: "",
    successRate: "",
    sampleCount: "",
    dataDescription: "",
    observations: "",
    unexpectedResults: "",
    
    // 实验过程
    methodology: "",
    experimentSteps: [""],
    procedureDetails: "",
    reagents: "",
    controlMeasures: "",
    experimentDuration: "",
    
    // 数据分析
    dataAnalysisMethod: "",
    significanceLevel: "",
    softwareUsed: "",
    dataAnalysis: "",
    hasCharts: false,
    hasTrends: false,
    conclusion: "",
    limitations: "",
    furtherResearch: "",
    
    // 项目信息（用于显示，不编辑）
    projectId: projectId,
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
    
    // 清除验证错误
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 验证当前步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}
    
    if (step === 0) {
      if (!formData.experimentStage) errors.experimentStage = true
      if (!formData.experimentDate) errors.experimentDate = true
    } else if (step === 1) {
      if (!formData.resultSummary) errors.resultSummary = true
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 下一步
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const isValid = validateStep(currentStep)
      
      if (!isValid) {
        return
      }
      
      // 添加到已完成步骤
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  // 上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    if (step > currentStep) {
      // 如果向前跳转，需要验证当前步骤
      const isValid = validateStep(currentStep)
      if (!isValid) return
    }
    
    setCurrentStep(step)
  }

  // 保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "实验数据草稿已保存成功"
    })
  }

  // 提交表单
  const handleSubmit = () => {
    setShowCompletionDialog(true)
    
    // 这里应该有实际的API调用来提交表单数据和文件
    console.log("提交的表单数据:", formData)
    console.log("上传的文件:", files)
  }

  // 处理返回列表
  const handleReturnToList = () => {
    router.push("/ethic-projects/animal")
  }

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepExperimentInfo
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <StepExperimentResult
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <StepExperimentProcedure
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <StepDataAnalysis
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 4:
        return (
          <StepComplete
            formData={formData}
            files={files}
            setFiles={setFiles}
            onSubmit={handleSubmit}
            onPrevStep={handlePrevStep}
            onSaveDraft={handleSaveDraft}
          />
        )
      default:
        return null
    }
  }

  // 渲染按钮
  const renderButtons = () => {
    return (
      <div className="mt-8 flex justify-between items-center pt-4 pb-4">
        {currentStep > 0 ? (
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            保存草稿
          </Button>
        )}
        
        {currentStep < STEPS.length - 1 && (
          <Button 
            onClick={handleNextStep}
            className="flex items-center gap-1"
          >
            下一步
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StepNavigation
        currentStep={currentStep}
        goToStep={goToStep}
        validationErrors={validationErrors}
        completedSteps={completedSteps}
      />

      <Card className="bg-white shadow-sm border border-gray-100">
        <div className="p-6">
          {renderStepContent()}
          {currentStep < STEPS.length - 1 && renderButtons()}
        </div>
      </Card>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>实验数据上传成功</DialogTitle>
            <DialogDescription>
              您的动物伦理实验数据已成功提交。
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            <div className="bg-green-50 rounded-full p-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/ethic-projects/animal/${projectId}`)}
            >
              返回项目详情
            </Button>
            <Button 
              onClick={handleReturnToList}
            >
              返回项目列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}