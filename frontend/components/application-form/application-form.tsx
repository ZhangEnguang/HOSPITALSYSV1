"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"

// u5bfcu5165u7c7bu578bu5b9au4e49
import {
  ApplicationFormData,
  FormMode,
  Step,
  ApplicationFormProps,
  Attachment,
  ValidationConfig,
} from "./types"

// u5bfcu5165u6b65u9aa4u5bfcu822au7ec4u4ef6
import { StepNavigation } from "./step-navigation"

// u9ed8u8ba4u8868u5355u6570u636e
const defaultFormData: ApplicationFormData = {
  name: "",
  description: "",
  type: "",
  category: "",
  startDate: new Date(),
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  amount: 0,
  autoEnd: "no",
  canReview: "no",
  hasQuota: "no",
  guide: "",
  template: "",
  materials: [{ id: "default-1", name: "", description: "" }],
  keyDates: [{ id: "default-1", name: "", date: new Date() }],
  requirements: [{ id: "default-1", content: "" }],
  notes: "",
}

export function ApplicationForm({
  mode = FormMode.CREATE,
  initialData,
  steps = [],
  validationConfig = {},
  onSubmit,
  onSaveDraft,
  onCancel,
  title = "u521bu5efau7533u62a5u6279u6b21",
  showTemplateSelector = false,
  returnUrl = "/applications",
  disabledFields = [],
  hiddenFields = [],
  hiddenSteps = [],
  className = "",
  // u6dfbu52a0u5bf9u5916u90e8u63a7u5236u5c5eu6027u7684u6224u65ad
  currentStep: externalCurrentStep,
  goToStep: externalGoToStep,
  completedSteps: externalCompletedSteps,
}: ApplicationFormProps) {
  const router = useRouter()
  
  const isViewMode = mode === FormMode.VIEW
  const isEditMode = mode === FormMode.EDIT
  const isCreateMode = mode === FormMode.CREATE
  
  // u83b7u53d6u53efu89c1u7684u6b65u9aa4
  const visibleSteps = steps.filter(step => !hiddenSteps.includes(step.id))
  
  // u8868u5355u72b6u6001
  const [formData, setFormData] = useState<ApplicationFormData>(
    initialData || defaultFormData
  )
  const [internalCurrentStep, setInternalCurrentStep] = useState(0)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [internalCompletedSteps, setInternalCompletedSteps] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // u5224u65adu662fu5426u4f7fu7528u5916u90e8u63a7u5236u7684u6b65u9aa4
  const useExternalControls = externalGoToStep !== undefined && externalCurrentStep !== undefined
  
  // u5b9eu9645u4f7fu7528u7684u5f53u524du6b65u9aa4u548cu5df2u5b8cu6210u6b65u9aa4
  const currentStep = useExternalControls ? externalCurrentStep : internalCurrentStep
  const completedSteps = useExternalControls && externalCompletedSteps ? 
    externalCompletedSteps : internalCompletedSteps

  // u5904u7406u6587u4ef6u4e0au4f20
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewMode) return
    
    const files = e.target.files
    if (!files) return

    const newAttachments: Attachment[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (attachments.length + newAttachments.length >= 10) break

      newAttachments.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }

    setAttachments([...attachments, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    if (isViewMode) return
    setAttachments(attachments.filter((item) => item.id !== id))
  }

  // u683cu5f0fu5316u6587u4ef6u5927u5c0f
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // u5904u7406u8868u5355u63d0u4ea4
  const handleSubmit = async () => {
    if (isViewMode) return
    
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
      
      // u9ed8u8ba4u884cu4e3auff1au63d0u4ea4u6210u529fu540eu8fd4u56deu5217u8868u9875
      router.push(returnUrl)
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "u63d0u4ea4u5931u8d25",
        description: "u8bf7u68c0u67e5u8868u5355u6570u636eu5e76u91cdu8bd5",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // u4fddu5b58u8349u7a3f
  const handleSaveDraft = async () => {
    if (isViewMode) return
    
    setIsSaving(true)
    
    try {
      if (onSaveDraft) {
        await onSaveDraft(formData)
      }
      
      setLastSaved(new Date())
      
      toast({
        title: "u8349u7a3fu5df2u4fddu5b58",
        description: "u7533u62a5u8ba1u5212u8349u7a3fu5df2u6210u529fu4fddu5b58"
      })
    } catch (error) {
      console.error("Save draft error:", error)
      toast({
        title: "u4fddu5b58u5931u8d25",
        description: "u8bf7u68c0u67e5u8868u5355u6570u636eu5e76u91cdu8bd5",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // u9a8cu8bc1u8868u5355u6570u636e
  const validateStep = (stepId: number) => {
    if (isViewMode) return true
    
    const errors: Record<string, boolean> = {}
    const currentStepObj = visibleSteps.find(s => s.id === stepId)
    
    if (!currentStepObj) return true
    
    // u6839u636eu6b65u9aa4IDu548cu9a8cu8bc1u914du7f6eu8fdbu884cu9a8cu8bc1
    // u8fd9u91ccu5e94u8be5u5b9eu73b0u4e00u4e2au903bu8f91uff1au6839u636eu6b65u9aa4u7c7bu578bu786eu5b9au9700u8981u9a8cu8bc1u7684u5b57u6bb5
    // u4e0bu9762u662fu4e00u4e2au7b80u5316u7684u9a8cu8bc1u903bu8f91u793au4f8b
    
    switch (stepId) {
      case 0: // u57fau672cu4fe1u606f
        if (!formData.name?.trim()) errors.name = true
        if (!formData.category) errors.category = true
        if (!formData.startDate) errors.startDate = true
        if (!formData.endDate) errors.endDate = true
        if (!formData.guide?.trim()) errors.guide = true
        break
      case 1: // u7533u62a5u6750u6599
        const validMaterials = formData.materials?.filter(m => m.name.trim() !== '')
        if (!validMaterials || validMaterials.length === 0) errors.materials = true
        break
      case 2: // u65f6u95f4u8282u70b9
        const validDates = formData.keyDates?.filter(
          d => d.name.trim() !== '' && d.date instanceof Date
        )
        if (!validDates || validDates.length === 0) errors.keyDates = true
        break
      case 3: // u7279u6b8au8981u6c42
        const validRequirements = formData.requirements?.filter(r => r.content.trim() !== '')
        if (!validRequirements || validRequirements.length === 0) errors.requirements = true
        break
    }
    
    // u5e94u7528u81eau5b9au4e49u9a8cu8bc1u914du7f6e
    if (validationConfig) {
      Object.entries(validationConfig).forEach(([field, rules]) => {
        const value = formData[field]
        
        // u5fc5u586bu9a8cu8bc1
        if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
          errors[field] = true
        }
        
        // u6700u5c0fu957fu5ea6u9a8cu8bc1
        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
          errors[field] = true
        }
        
        // u6700u5927u957fu5ea6u9a8cu8bc1
        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
          errors[field] = true
        }
        
        // u6b63u5219u9a8cu8bc1
        if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
          errors[field] = true
        }
        
        // u81eau5b9au4e49u9a8cu8bc1u5668
        if (rules.customValidator && !rules.customValidator(value)) {
          errors[field] = true
        }
      })
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // u5904u7406u6b65u9aa4u5bfcu822a
  const handleNext = () => {
    if (isViewMode) {
      if (useExternalControls) {
        externalGoToStep?.(Math.min(visibleSteps.length - 1, currentStep + 1))
      } else {
        setInternalCurrentStep(prev => Math.min(visibleSteps.length - 1, prev + 1))
      }
      return
    }
    
    const currentStepId = visibleSteps[currentStep]?.id
    if (currentStepId !== undefined && validateStep(currentStepId)) {
      if (!completedSteps.includes(currentStepId)) {
        if (useExternalControls) {
          externalCompletedSteps?.push(currentStepId)
        } else {
          setInternalCompletedSteps([...internalCompletedSteps, currentStepId])
        }
      }
      if (useExternalControls) {
        externalGoToStep?.(Math.min(visibleSteps.length - 1, currentStep + 1))
      } else {
        setInternalCurrentStep(prev => Math.min(visibleSteps.length - 1, prev + 1))
      }
    }
  }

  const handlePrevious = () => {
    if (useExternalControls) {
      externalGoToStep?.(Math.max(0, currentStep - 1))
    } else {
      setInternalCurrentStep(prev => Math.max(0, prev - 1))
    }
  }

  const goToStep = (index: number) => {
    const targetStepId = visibleSteps[index]?.id
    const currentStepId = visibleSteps[currentStep]?.id
    
    if (
      isViewMode || 
      index < currentStep || 
      (targetStepId !== undefined && completedSteps.includes(targetStepId)) || 
      (currentStepId !== undefined && validateStep(currentStepId))
    ) {
      if (useExternalControls) {
        externalGoToStep?.(index)
      } else {
        setInternalCurrentStep(index)
      }
    }
  }

  // u6e32u67d3u5f53u524du6b65u9aa4u5185u5bb9
  const renderStepContent = () => {
    if (!visibleSteps.length) return null
    
    const currentStepObj = visibleSteps[currentStep]
    if (!currentStepObj) return null
    
    // u6e32u67d3u81eau5b9au4e49u7ec4u4ef6u6216u9ed8u8ba4u7ec4u4ef6
    return currentStepObj.component ? (
      currentStepObj.component
    ) : (
      <div className="text-center py-8">
        <p className="text-muted-foreground">u6b65u9aa4u5185u5bb9u672au5b9au4e49</p>
      </div>
    )
  }

  // u5904u7406u53d6u6d88
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push(returnUrl)
    }
  }

  return (
    <div className={`2xl:max-w-[1440px] 2xl:mx-auto w-full py-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
        {/* u53efu89c1u6027u63a7u5236u53efu4ee5u5728u8fd9u91ccu6dfbu52a0u66f4u591au5185u5bb9 */}
      </div>

      <div className="space-y-6">
        {/* u6b65u9aa4u5bfcu822a - u53eau5728u6709u591au6b65u9aa4u65f6u663eu793a */}
        {visibleSteps.length > 1 && (
          <div className="mb-2">
            <StepNavigation
              steps={visibleSteps}
              currentStep={currentStep}
              goToStep={goToStep}
              validationErrors={validationErrors}
              completedSteps={completedSteps}
              readonly={isViewMode}
            />
          </div>
        )}

        {/* u6b65u9aa4u5185u5bb9 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <Card className="border-0 shadow-none">
            <CardContent className="pt-6 px-6">
              {renderStepContent()}
            </CardContent>

            <CardFooter className="flex justify-between py-4 px-6 mt-4">
              <div className="flex items-center gap-3">
                {!isViewMode && onSaveDraft && (
                  <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isSubmitting} className="relative">
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                        u6b63u5728u4fddu5b58...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        u4fddu5b58u8349u7a3f
                      </>
                    )}
                  </Button>
                )}
                {lastSaved && (
                  <span className="text-xs text-muted-foreground">
                    u4e0au6b21u4fddu5b58: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    u4e0au4e00u6b65
                  </Button>
                )}
                
                {currentStep < visibleSteps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    u4e0bu4e00u6b65
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  // u6700u540eu4e00u6b65u663eu793au63d0u4ea4u6309u94aeuff0cu4ec5u5728u975eu67e5u770bu6a21u5f0fu4e0bu663eu793a
                  !isViewMode && onSubmit && (
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-primary">
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                          u6b63u5728u63d0u4ea4...
                        </>
                      ) : (
                        "u63d0u4ea4"
                      )}
                    </Button>
                  )
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
