"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react"

import BasicInfoForm from "@/app/progress/create/projectInspection/components/basic-info-form"
import InspectionDetailsForm from "@/app/progress/create/projectInspection/components/inspection-details-form"
import FindingsForm from "@/app/progress/create/projectInspection/components/findings-form"
import RecommendationsForm from "@/app/progress/create/projectInspection/components/recommendations-form"
import { STEPS } from "@/app/progress/create/projectInspection/components/step-navigation"

// 定义表单数据类型
export interface InspectionFormData {
  // 基本信息
  inspectionNumber: string
  inspectionName: string
  inspectionType: string
  relatedProjectNumber: string
  inspectionDate: string
  // 检查详情
  inspectionScope: string
  methodology: string
  standards: string
  participants?: string
  // 发现问题
  observations: string
  nonConformities: string
  evidenceCollected?: string
  riskLevel: string
  // 整改措施
  correctiveActions: string
  followUpDate: string
  responsibleParty: string
  preventiveActions?: string
  improvementOpportunities?: string
}

interface InspectionCreationFormProps {
  onComplete?: (data: InspectionFormData) => void
}

export default function InspectionCreationForm({ onComplete }: InspectionCreationFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<InspectionFormData>({
    inspectionNumber: "",
    inspectionName: "",
    inspectionType: "",
    relatedProjectNumber: "",
    inspectionDate: "",
    inspectionScope: "",
    methodology: "",
    standards: "",
    participants: "",
    observations: "",
    nonConformities: "",
    evidenceCollected: "",
    riskLevel: "",
    correctiveActions: "",
    followUpDate: "",
    responsibleParty: "",
    preventiveActions: "",
    improvementOpportunities: "",
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // 处理表单数据更新
  const handleFormUpdate = useCallback((step: number, data: Partial<InspectionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  // 验证当前步骤
  const validateStep = useCallback(() => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    if (currentStep === 0) {
      // 验证基本信息
      if (!formData.inspectionNumber) {
        newErrors.inspectionNumber = true
        isValid = false
      }
      if (!formData.inspectionName) {
        newErrors.inspectionName = true
        isValid = false
      }
      if (!formData.inspectionType) {
        newErrors.inspectionType = true
        isValid = false
      }
      if (!formData.relatedProjectNumber) {
        newErrors.relatedProjectNumber = true
        isValid = false
      }
      if (!formData.inspectionDate) {
        newErrors.inspectionDate = true
        isValid = false
      }
    } else if (currentStep === 1) {
      // 验证检查详情
      if (!formData.inspectionScope) {
        newErrors.inspectionScope = true
        isValid = false
      }
      if (!formData.methodology) {
        newErrors.methodology = true
        isValid = false
      }
      if (!formData.standards) {
        newErrors.standards = true
        isValid = false
      }
    } else if (currentStep === 2) {
      // 验证发现问题
      if (!formData.observations) {
        newErrors.observations = true
        isValid = false
      }
      if (!formData.nonConformities) {
        newErrors.nonConformities = true
        isValid = false
      }
      if (!formData.riskLevel) {
        newErrors.riskLevel = true
        isValid = false
      }
    } else if (currentStep === 3) {
      // 验证整改措施
      if (!formData.correctiveActions) {
        newErrors.correctiveActions = true
        isValid = false
      }
      if (!formData.followUpDate) {
        newErrors.followUpDate = true
        isValid = false
      }
      if (!formData.responsibleParty) {
        newErrors.responsibleParty = true
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }, [currentStep, formData])

  // 处理下一步
  const handleNext = useCallback(() => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 2) {
        setCurrentStep(prev => prev + 1)
      } else {
        handleSubmit()
      }
    } else {
      toast.error("请填写所有必填字段")
    }
  }, [currentStep, validateStep])

  // 处理上一步
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // 处理保存草稿
  const handleSaveDraft = useCallback(() => {
    toast.success("草稿已保存")
    // 实际保存逻辑
  }, [])

  // 处理提交
  const handleSubmit = useCallback(() => {
    if (validateStep()) {
      setIsSubmitting(true)
      // 模拟提交
      setTimeout(() => {
        setIsSubmitting(false)
        setShowSuccess(true)
        if (onComplete) {
          onComplete(formData)
        }
      }, 1500)
    } else {
      toast.error("请填写所有必填字段")
    }
  }, [formData, onComplete, validateStep])

  // 处理完成
  const handleComplete = useCallback(() => {
    router.push("/progress")
  }, [router])

  // 渲染当前步骤表单
  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm
            data={formData}
            onUpdate={(data) => handleFormUpdate(0, data)}
            validationErrors={errors}
          />
        )
      case 1:
        return (
          <InspectionDetailsForm
            data={formData}
            onUpdate={(data) => handleFormUpdate(1, data)}
            validationErrors={errors}
          />
        )
      case 2:
        return (
          <FindingsForm
            data={formData}
            onUpdate={(data) => handleFormUpdate(2, data)}
            validationErrors={errors}
          />
        )
      case 3:
        return (
          <RecommendationsForm
            data={formData}
            onUpdate={(data) => handleFormUpdate(3, data)}
            validationErrors={errors}
          />
        )
      case 4:
        return (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-center text-lg font-medium">项目检查已完成</h3>
            <p className="text-center text-gray-500">
              您已成功提交项目检查信息。
            </p>
          </div>
        )
      default:
        return null
    }
  }, [currentStep, formData, errors, handleFormUpdate])

  // 渲染底部按钮
  const renderFooterButtons = useCallback(() => {
    if (currentStep === 4) {
      return (
        <Button onClick={handleComplete} className="w-full">
          返回项目进度列表
        </Button>
      )
    }

    return (
      <div className="flex justify-between w-full">
        <div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              上一步
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            保存草稿
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center gap-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "提交中..." : currentStep < STEPS.length - 2 ? "下一步" : "提交"}
            {!isSubmitting && currentStep < STEPS.length - 2 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    )
  }, [currentStep, handleComplete, handleNext, handlePrevious, handleSaveDraft, isSubmitting])

  // 获取当前步骤标题
  const getStepTitle = useCallback(() => {
    return STEPS[currentStep]?.name || ""
  }, [currentStep])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          {getStepTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {renderFooterButtons()}
      </CardFooter>
    </Card>
  )
}
