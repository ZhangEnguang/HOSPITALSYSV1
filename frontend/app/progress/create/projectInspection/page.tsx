"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import StepNavigation, { STEPS } from "./components/step-navigation"
import BasicInfoForm from "./components/basic-info-form"
import InspectionDetailsForm from "./components/inspection-details-form"
import FindingsForm from "./components/findings-form"
import RecommendationsForm from "./components/recommendations-form"
import CompletionStep from "./components/completion-step"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ProjectInspectionPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    inspectionDetails: {},
    findings: {},
    recommendations: {},
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // 验证当前步骤
      if (validateCurrentStep()) {
        // 标记当前步骤为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
        setCurrentStep(currentStep + 1)
      } else {
        // 显示验证错误提示
        toast({
          title: "请填写必填项",
          description: "请确保所有必填字段都已填写。",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}

    if (currentStep === 0) {
      // 基本信息验证
      if (!formData.basicInfo.inspectionNumber) errors.inspectionNumber = true
      if (!formData.basicInfo.inspectionName) errors.inspectionName = true
      if (!formData.basicInfo.inspectionType) errors.inspectionType = true
      if (!formData.basicInfo.relatedProjectNumber) errors.relatedProjectNumber = true
    } else if (currentStep === 1) {
      // 检查详情验证
      if (!formData.inspectionDetails.inspectionScope) errors.inspectionScope = true
      if (!formData.inspectionDetails.methodology) errors.methodology = true
      if (!formData.inspectionDetails.standards) errors.standards = true
    } else if (currentStep === 2) {
      // 发现问题验证
      if (!formData.findings.observations) errors.observations = true
      if (!formData.findings.nonConformities) errors.nonConformities = true
      if (!formData.findings.riskLevel) errors.riskLevel = true
    } else if (currentStep === 3) {
      // 整改措施验证
      if (!formData.recommendations.correctiveActions) errors.correctiveActions = true
      if (!formData.recommendations.followUpDate) errors.followUpDate = true
      if (!formData.recommendations.responsibleParty) errors.responsibleParty = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdateBasicInfo = (data) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: data,
    }))
  }

  const handleUpdateInspectionDetails = (data) => {
    setFormData((prev) => ({
      ...prev,
      inspectionDetails: data,
    }))
  }

  const handleUpdateFindings = (data) => {
    setFormData((prev) => ({
      ...prev,
      findings: data,
    }))
  }

  const handleUpdateRecommendations = (data) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: data,
    }))
  }

  const handleSaveDraft = () => {
    // 保存草稿逻辑
    localStorage.setItem("inspectionDraft", JSON.stringify(formData))
    toast({
      title: "草稿已保存",
      description: "您的项目中检表单已保存为草稿。",
    })
  }

  const handleSubmit = () => {
    // 验证所有步骤
    let allValid = true
    for (let i = 0; i < STEPS.length - 1; i++) {
      setCurrentStep(i)
      if (!validateCurrentStep()) {
        allValid = false
        break
      }
    }

    if (allValid) {
      // 提交表单
      setShowSuccessDialog(true)
      // 清除草稿
      localStorage.removeItem("inspectionDraft")
    } else {
      toast({
        title: "提交失败",
        description: "请确保所有必填字段都已填写。",
        variant: "destructive",
      })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm
            data={formData.basicInfo}
            onUpdate={handleUpdateBasicInfo}
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <InspectionDetailsForm
            data={formData.inspectionDetails}
            onUpdate={handleUpdateInspectionDetails}
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <FindingsForm
            data={formData.findings}
            onUpdate={handleUpdateFindings}
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <RecommendationsForm
            data={formData.recommendations}
            onUpdate={handleUpdateRecommendations}
            validationErrors={validationErrors}
          />
        )
      case 4:
        return <CompletionStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/progress" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新增项目中检</h1>
      </div>

      <div className="mx-8 mb-6">
        <Card className="border-muted/50">
          <CardContent className="p-6">
            <StepNavigation
              currentStep={currentStep}
              validationErrors={validationErrors}
              completedSteps={completedSteps}
            />
          </CardContent>
        </Card>
      </div>

      <motion.div 
        className="mx-8 mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            {currentStep === 0 && (
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
                <div className="text-primary">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">检查基本信息</h3>
              </div>
            )}
            {currentStep === 1 && (
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
                <div className="text-primary">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">检查详情</h3>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
                <div className="text-primary">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">发现问题</h3>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
                <div className="text-primary">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium">整改措施</h3>
              </div>
            )}
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/progress")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                取消
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一步
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  下一步
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  提交
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              提交成功
            </DialogTitle>
            <DialogDescription>
              您的项目中检表单已成功提交。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push("/progress")} className="bg-blue-600 hover:bg-blue-700">
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
