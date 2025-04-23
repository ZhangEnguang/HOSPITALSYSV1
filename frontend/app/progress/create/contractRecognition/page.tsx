"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { StepNavigation, STEPS } from "./components/step-navigation"
import BasicInfoForm from "./components/basic-info-form"
import ContractDetailsForm from "./components/contract-details-form"
import FinancialInfoForm from "./components/financial-info-form"
import ApprovalInfoForm from "./components/approval-info-form"
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

export default function ContractRecognitionPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({
    basicInfo: {},
    contractDetails: {},
    financialInfo: {},
    approvalInfo: {},
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleNext = () => {
    if (currentStep < STEPS.length) {
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
          title: "表单验证失败",
          description: "请填写所有必填项",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("保存草稿", formData)
    // 实现保存草稿逻辑
    toast({
      title: "暂存成功",
      description: "合同认定已保存为草稿",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("提交合同认定", formData)
    // 实现提交逻辑
    setShowSuccessDialog(true)
  }

  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormData({
      basicInfo: {},
      contractDetails: {},
      financialInfo: {},
      approvalInfo: {},
    })
    setCurrentStep(1)
    setCompletedSteps([])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/progress")
  }

  const updateFormData = (step, data) => {
    // 防止无限循环，只在数据真正变化时更新
    const currentStepData = getStepData(step)
    if (JSON.stringify(currentStepData) !== JSON.stringify(data)) {
      setFormData((prev) => {
        const newData = { ...prev }
        switch (step) {
          case 1:
            newData.basicInfo = data
            break
          case 2:
            newData.contractDetails = data
            break
          case 3:
            newData.financialInfo = data
            break
          case 4:
            newData.approvalInfo = data
            break
          default:
            break
        }
        return newData
      })
    }
  }

  const getStepData = (step) => {
    switch (step) {
      case 1:
        return formData.basicInfo
      case 2:
        return formData.contractDetails
      case 3:
        return formData.financialInfo
      case 4:
        return formData.approvalInfo
      default:
        return {}
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors = {}
    
    if (currentStep === 1) {
      // 验证基本信息
      const { 
        contractNumber, 
        contractName, 
        contractType, 
        contractCategory, 
        contractSource, 
        contractPurpose 
      } = formData.basicInfo
      
      if (!contractNumber) errors["合同编号"] = true
      if (!contractName) errors["合同名称"] = true
      if (!contractType) errors["合同类型"] = true
      if (!contractCategory) errors["合同分类"] = true
      if (!contractSource) errors["合同来源"] = true
      if (!contractPurpose) errors["合同目的"] = true
    } 
    else if (currentStep === 2) {
      // 验证合同详情
      const { 
        partyA, 
        partyB, 
        signingDate, 
        contractScope, 
        contractLocation, 
        contractDuration, 
        contractWitness 
      } = formData.contractDetails
      
      if (!partyA) errors["甲方"] = true
      if (!partyB) errors["乙方"] = true
      if (!signingDate) errors["签订日期"] = true
      if (!contractScope) errors["合同范围"] = true
      if (!contractLocation) errors["签约地点"] = true
      if (!contractDuration) errors["合同期限"] = true
      if (!contractWitness) errors["合同见证人"] = true
    }
    else if (currentStep === 3) {
      // 验证财务信息
      const { 
        contractAmount, 
        currency, 
        paymentMethod, 
        paymentSchedule, 
        invoiceType, 
        paymentDeadline, 
        financialContact, 
        penaltyClause 
      } = formData.financialInfo
      
      if (!contractAmount) errors["合同金额"] = true
      if (!currency) errors["币种"] = true
      if (!paymentMethod) errors["支付方式"] = true
      if (!paymentSchedule) errors["支付计划"] = true
      if (!invoiceType) errors["发票类型"] = true
      if (!paymentDeadline) errors["付款截止日期"] = true
      if (!financialContact) errors["财务联系人"] = true
      if (!penaltyClause) errors["违约金条款"] = true
    }
    else if (currentStep === 4) {
      // 验证审批信息
      const { 
        approvalLevel, 
        approver, 
        expectedApprovalDate, 
        approvalDepartment, 
        alternateApprover, 
        approvalPriority, 
        approvalRequirements 
      } = formData.approvalInfo
      
      if (!approvalLevel) errors["审批级别"] = true
      if (!approver) errors["审批人"] = true
      if (!expectedApprovalDate) errors["预计审批日期"] = true
      if (!approvalDepartment) errors["审批部门"] = true
      if (!alternateApprover) errors["备选审批人"] = true
      if (!approvalPriority) errors["审批优先级"] = true
      if (!approvalRequirements) errors["审批要求"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 跳转到指定步骤
  const goToStep = (step) => {
    // 只允许跳转到已完成的步骤或当前步骤的下一步
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm 
            data={formData.basicInfo} 
            onUpdate={(data) => updateFormData(1, data)} 
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <ContractDetailsForm 
            data={formData.contractDetails} 
            onUpdate={(data) => updateFormData(2, data)} 
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <FinancialInfoForm 
            data={formData.financialInfo} 
            onUpdate={(data) => updateFormData(3, data)} 
            validationErrors={validationErrors}
          />
        )
      case 4:
        return (
          <ApprovalInfoForm 
            data={formData.approvalInfo} 
            onUpdate={(data) => updateFormData(4, data)} 
            validationErrors={validationErrors}
          />
        )
      case 5:
        return (
          <CompletionStep formData={formData} />
        )
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
        <h1 className="text-2xl font-bold">新增合同认定</h1>
      </div>

      <div className="mx-8 mb-6">
        <StepNavigation 
          currentStep={currentStep} 
          goToStep={goToStep} 
          completedSteps={completedSteps} 
          validationErrors={validationErrors}
        />
      </div>

      <motion.div 
        className="mx-8 mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
              <div className="text-primary">
                <InfoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{STEPS[currentStep - 1].name}</h3>
            </div>
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存草稿
            </Button>
            <div className="space-x-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}
              {currentStep < STEPS.length ? (
                <Button onClick={handleNext}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  完成
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 提交成功弹框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              提交成功
            </DialogTitle>
            <DialogDescription>
              合同认定申请已成功提交，您可以继续添加新的合同认定申请或返回列表查看。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleContinueAdd}>
              继续添加
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
