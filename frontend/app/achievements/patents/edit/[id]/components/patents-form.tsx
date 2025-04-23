"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StepNavigation } from "./step-navigation"
import { StepBasicInfo } from "./form-steps/step-basic-info"
import { StepInventorInfo } from "./form-steps/step-inventor-info"
import { StepPatentDetails } from "./form-steps/step-patent-details"
import { StepDocumentUpload } from "./form-steps/step-document-upload"
import { StepCompletion } from "./form-steps/step-completion"

// 定义表单数据接口
export interface FormData {
  patentNumber: string
  patentName: string
  patentType: string
  patentStatus: string
  applicationDate: string
  approvalDate: string
  inventors: string
  affiliatedUnit: string
  patentAbstract: string
  disciplineCategory: string
  applicationArea: string
  files: any[]
  id?: string
}

// 初始表单数据
const initialFormData: FormData = {
  patentNumber: "",
  patentName: "",
  patentType: "",
  patentStatus: "",
  applicationDate: "",
  approvalDate: "",
  inventors: "",
  affiliatedUnit: "",
  patentAbstract: "",
  disciplineCategory: "",
  applicationArea: "",
  files: []
}

// 表单验证规则
const validationRules = {
  basicInfo: {
    patentNumber: (value: string) => !!value || "专利号不能为空",
    patentName: (value: string) => !!value || "专利名称不能为空",
    patentType: (value: string) => !!value || "专利类型不能为空",
    patentStatus: (value: string) => !!value || "专利状态不能为空",
    applicationDate: (value: string) => !!value || "申请日期不能为空"
  },
  inventorInfo: {
    inventors: (value: string) => !!value || "发明人不能为空",
    affiliatedUnit: (value: string) => !!value || "所属单位不能为空"
  },
  patentDetails: {
    patentAbstract: (value: string) => !!value || "专利摘要不能为空",
    disciplineCategory: (value: string) => !!value || "学科类别不能为空",
    applicationArea: (value: string) => !!value || "应用领域不能为空"
  },
  documentUpload: {
    // 文件上传验证可选
  }
}

export function PatentsForm({ initialData = null, mode = "create" }: { initialData?: any, mode?: "create" | "edit" }) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // 如果是编辑模式且有初始数据，则填充表单
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...initialFormData,
        ...initialData
      })
      // 在编辑模式下，所有步骤默认为已完成
      setCompletedSteps([1, 2, 3, 4])
    }
  }, [initialData, mode])

  // 表单数据更新函数
  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))

    // 如果字段有验证错误，更新后清除错误
    if (validationErrors[key]) {
      setValidationErrors(prev => ({
        ...prev,
        [key]: ""
      }))
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    let errors: Record<string, string> = {}
    let isValid = true

    // 根据当前步骤应用验证规则
    if (currentStep === 1) {
      Object.entries(validationRules.basicInfo).forEach(([field, rule]) => {
        const value = formData[field as keyof FormData] as string
        const error = rule(value)
        if (error !== true) {
          errors[field] = error
          isValid = false
        }
      })
    } else if (currentStep === 2) {
      Object.entries(validationRules.inventorInfo).forEach(([field, rule]) => {
        const value = formData[field as keyof FormData] as string
        const error = rule(value)
        if (error !== true) {
          errors[field] = error
          isValid = false
        }
      })
    } else if (currentStep === 3) {
      Object.entries(validationRules.patentDetails).forEach(([field, rule]) => {
        const value = formData[field as keyof FormData] as string
        const error = rule(value)
        if (error !== true) {
          errors[field] = error
          isValid = false
        }
      })
    } else if (currentStep === 4) {
      // 文件上传步骤，可以自定义验证规则
    }

    setValidationErrors(errors)
    return isValid
  }

  // 下一步处理
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1)
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps(prev => [...prev, currentStep])
        }
      }
    }
  }

  // 上一步处理
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤的下一步
    if (completedSteps.includes(step) || step === currentStep || step === currentStep + 1) {
      setCurrentStep(step)
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (validateCurrentStep()) {
      try {
        // 实际项目中应该调用API提交数据
        console.log("提交数据:", formData)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 显示成功对话框
        setShowSuccessDialog(true)
      } catch (error) {
        console.error("提交失败", error)
        // 处理提交错误
      }
    }
  }

  // 完成编辑/创建后的处理
  const handleFinish = () => {
    setShowSuccessDialog(false)
    // 重定向到专利列表页
    router.push("/achievements")
  }

  return (
    <div className="w-full space-y-6">
      <StepNavigation
        currentStep={currentStep}
        goToStep={goToStep}
        validationErrors={validationErrors}
        completedSteps={completedSteps}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {currentStep === 1 && (
          <StepBasicInfo
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )}

        {currentStep === 2 && (
          <StepInventorInfo
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )}

        {currentStep === 3 && (
          <StepPatentDetails
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )}

        {currentStep === 4 && (
          <StepDocumentUpload
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
          />
        )}

        {currentStep === 5 && (
          <StepCompletion
            formData={formData}
          />
        )}

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            上一步
          </Button>

          {currentStep < 5 ? (
            <Button type="button" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              {mode === "edit" ? "保存修改" : "提交"}
            </Button>
          )}
        </div>
      </div>

      {/* 成功提交对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>操作成功</DialogTitle>
            <DialogDescription>
              {mode === "edit" ? "专利信息已成功更新" : "专利信息已成功提交"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleFinish}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 