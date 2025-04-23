"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { STEPS, StepNavigation } from "./step-navigation"
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepAuthorInfo } from "./form-steps/step-author-info"
import { StepPaperDetails } from "./form-steps/step-paper-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepComplete } from "./form-steps/step-complete"

export function AcademicPapersForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<File[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 初始化表单数据
  const [formData, setFormData] = useState({
    // 基本信息 (Step 0)
    paperCode: "",
    paperTitle: "",
    paperType: "",
    paperLevel: "",
    paperStatus: "",
    department: "计算机科学与技术学院",
    category: "",
    fundingSource: "",
    startDate: new Date().toISOString(),
    
    // 作者信息 (Step 1)
    firstAuthor: "",
    correspondingAuthor: "",
    firstAuthorUnit: "",
    otherAuthors: "",
    otherUnits: "",
    isFirstUnit: "yes",
    isCorrespondingUnit: "yes",
    
    // 论文详情 (Step 2)
    journal: "",
    publishDate: new Date().toISOString(),
    volume: "",
    doi: "",
    impactFactor: "",
    citations: "",
    keywords: "",
    abstract: "",
    funding: "",
    isEsi: false,
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除验证错误
    if (field === "paperTitle" && validationErrors["论文标题"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["论文标题"]
        return newErrors
      })
    } else if (field === "paperType" && validationErrors["论文类型"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["论文类型"]
        return newErrors
      })
    } else if (field === "paperLevel" && validationErrors["论文级别"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["论文级别"]
        return newErrors
      })
    } else if (field === "paperStatus" && validationErrors["发表状态"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["发表状态"]
        return newErrors
      })
    } else if (field === "firstAuthor" && validationErrors["第一作者"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["第一作者"]
        return newErrors
      })
    } else if (field === "correspondingAuthor" && validationErrors["通讯作者"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["通讯作者"]
        return newErrors
      })
    } else if (field === "firstAuthorUnit" && validationErrors["第一作者单位"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["第一作者单位"]
        return newErrors
      })
    } else if (field === "journal" && validationErrors["期刊名称"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["期刊名称"]
        return newErrors
      })
    } else if (field === "publishDate" && validationErrors["发表日期"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["发表日期"]
        return newErrors
      })
    } else if (field === "volume" && validationErrors["卷号页码"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["卷号页码"]
        return newErrors
      })
    } else if (field === "impactFactor" && validationErrors["影响因子"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors["影响因子"]
        return newErrors
      })
    } else if (field === "validationErrors") {
      // 直接更新验证错误
      setValidationErrors(value)
    }
  }

  // 验证当前步骤
  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {}

    if (step === 0) {
      if (!formData.paperTitle) errors["论文标题"] = true
      if (!formData.paperType) errors["论文类型"] = true
      if (!formData.paperLevel) errors["论文级别"] = true
      if (!formData.paperStatus) errors["发表状态"] = true
    } else if (step === 1) {
      if (!formData.firstAuthor) errors["第一作者"] = true
      if (!formData.correspondingAuthor) errors["通讯作者"] = true
      if (!formData.firstAuthorUnit) errors["第一作者单位"] = true
    } else if (step === 2) {
      if (!formData.journal) errors["期刊名称"] = true
      if (!formData.publishDate) errors["发表日期"] = true
      if (!formData.volume) errors["卷号页码"] = true
      if (!formData.impactFactor) errors["影响因子"] = true
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
    console.log("保存草稿:", formData)
    // 实际应用中这里会保存草稿
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证最后一步
    const isValid = validateStep(currentStep)
    if (!isValid) return
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续添加
  const handleContinueAdding = () => {
    // 重置表单
    setFormData({
      paperCode: "",
      paperTitle: "",
      paperType: "",
      paperLevel: "",
      paperStatus: "",
      department: "计算机科学与技术学院",
      category: "",
      fundingSource: "",
      startDate: new Date().toISOString(),
      firstAuthor: "",
      correspondingAuthor: "",
      firstAuthorUnit: "",
      otherAuthors: "",
      otherUnits: "",
      isFirstUnit: "yes",
      isCorrespondingUnit: "yes",
      journal: "",
      publishDate: new Date().toISOString(),
      volume: "",
      doi: "",
      impactFactor: "",
      citations: "",
      keywords: "",
      abstract: "",
      funding: "",
      isEsi: false,
    })
    setFiles([])
    setCurrentStep(0)
    setCompletedSteps([])
    setShowCompletionDialog(false)
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/achievements")
  }

  // 确保大屏幕下表单内容保持在1440宽度
  useEffect(() => {
    const styleEl = document.createElement("style")
    styleEl.textContent = `
      @media (min-width: 1920px) {
        .form-container {
          max-width: 1440px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    `
    document.head.appendChild(styleEl)

    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasicInfo
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <StepAuthorInfo
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <StepPaperDetails
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <StepDocumentUpload
            files={files}
            setFiles={setFiles}
          />
        )
      case 4:
        return (
          <StepComplete
            formData={formData}
            files={files}
          />
        )
      default:
        return null
    }
  }

  // 渲染底部按钮
  const renderButtons = () => {
    return (
      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={handleSaveDraft} className="mr-2">
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
        </div>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevStep}>
              上一步
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600">
              下一步
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
              完成
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="form-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">新增学术论文</h1>
        </div>

        <StepNavigation
          currentStep={currentStep}
          goToStep={goToStep}
          validationErrors={validationErrors}
          completedSteps={completedSteps}
        />

        <Card className="border shadow-sm mt-6">
          <CardContent className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {renderStepContent()}
              <div className="pt-4 border-t">{renderButtons()}</div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>论文申请提交成功</DialogTitle>
            <DialogDescription>
              您的论文申请已成功提交，请选择后续操作
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" onClick={handleContinueAdding} className="w-full sm:w-auto">
              继续添加
            </Button>
            <Button onClick={handleReturnToList} className="w-full sm:w-auto">
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
