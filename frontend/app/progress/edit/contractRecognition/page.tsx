"use client"

import React, { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { StepNavigation, STEPS } from "../../create/contractRecognition/components/step-navigation"
import BasicInfoForm from "../../create/contractRecognition/components/basic-info-form"
import ContractDetailsForm from "../../create/contractRecognition/components/contract-details-form"
import FinancialInfoForm from "../../create/contractRecognition/components/financial-info-form"
import ApprovalInfoForm from "../../create/contractRecognition/components/approval-info-form"
import CompletionStep from "../../create/contractRecognition/components/completion-step"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 演示数据 - 合同认定数据
const demoContractData = {
  basicInfo: {
    contractNumber: "HT-2024-002",
    contractName: "校企合作人工智能应用研究项目",
    contractType: "横向项目",
    contractCategory: "技术开发",
    contractSource: "企业委托",
    contractPurpose: "联合开发基于深度学习的复杂场景目标检测与跟踪技术，推动研究成果产业化应用",
    projectId: "PRJ-2024-001",
    projectName: "基于深度学习的复杂场景目标检测与跟踪关键技术研究",
  },
  contractDetails: {
    partyA: "华为技术有限公司",
    partyB: "某高校人工智能研究院",
    signingDate: new Date(2024, 1, 15),
    contractScope: "1. 复杂场景多目标检测算法研发\n2. 跨镜头目标跟踪技术研究\n3. 模型优化与落地应用\n4. 技术成果转化与产业化",
    contractLocation: "深圳市南山区",
    contractDuration: "2024年2月15日至2025年2月14日",
    contractWitness: "深圳市科技创新委员会",
    contractTerms: "1. 甲方提供研究经费和必要的数据支持\n2. 乙方负责核心算法研发和技术迭代\n3. 双方共同拥有研究成果的知识产权\n4. 项目成果应用优先在甲方产品中实施",
  },
  financialInfo: {
    contractAmount: 1200000,
    currency: "人民币",
    paymentMethod: "分期支付",
    paymentSchedule: "合同签订后支付40%，中期检查合格后支付30%，项目验收通过后支付30%",
    invoiceType: "增值税专用发票",
    taxRate: 6,
    paymentDeadline: "收到发票后15个工作日内",
    financialContact: "李总监（财务部）",
    financialContactPhone: "13912345678",
    financialContactEmail: "lizongjian@example.com",
    penaltyClause: "逾期付款按应付金额的0.05%/日计算违约金；项目延期交付按合同总金额的0.05%/日计算违约金",
  },
  approvalInfo: {
    approvalLevel: "校级",
    approvers: ["张院长", "王部长", "李处长"],
    approvalComments: "项目符合学校产学研合作方向，经费预算合理，技术路线可行，同意立项",
    approvalDocuments: [
      { name: "合同文本.pdf", size: "2.5MB" },
      { name: "技术方案.docx", size: "1.8MB" },
      { name: "预算书.xlsx", size: "0.7MB" }
    ],
    approvalDate: new Date(2024, 1, 20),
    legalReview: "已通过法务审核，符合学校合同管理规定",
    specialRequirements: "需按学校科研项目管理办法报科研处备案"
  },
};

// 定义接口类型
interface FormData {
  basicInfo: {
    contractNumber: string;
    contractName: string;
    contractType: string;
    contractCategory: string;
    contractSource: string;
    contractPurpose: string;
    projectId: string;
    projectName: string;
  };
  contractDetails: {
    partyA: string;
    partyB: string;
    signingDate: Date;
    contractScope: string;
    contractLocation: string;
    contractDuration: string;
    contractWitness: string;
    contractTerms: string;
  };
  financialInfo: {
    contractAmount: number;
    currency: string;
    paymentMethod: string;
    paymentSchedule: string;
    invoiceType: string;
    taxRate: number;
    paymentDeadline: string;
    financialContact: string;
    financialContactPhone: string;
    financialContactEmail: string;
    penaltyClause: string;
  };
  approvalInfo: {
    approvalLevel: string;
    approvers: string[];
    approvalComments: string;
    approvalDocuments: Array<{name: string, size: string}>;
    approvalDate: Date;
    legalReview: string;
    specialRequirements: string;
  };
}

interface ValidationErrors {
  [key: string]: boolean;
}

function ContractRecognitionPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contractId = searchParams.get('id')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([1, 2, 3, 4])
  const [formData, setFormData] = useState<FormData>(demoContractData)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      // 假设这里是从API获取数据
      // 但我们直接使用演示数据
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [contractId])

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
      title: "保存成功",
      description: "合同认定已保存",
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

  const handleContinueEdit = () => {
    // 重置表单数据和步骤
    setFormData(demoContractData)
    setCurrentStep(1)
    setCompletedSteps([1, 2, 3, 4])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/progress")
  }

  const updateFormData = (step: number, data: any) => {
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

  const getStepData = (step: number) => {
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
    const errors: ValidationErrors = {}
    
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
      if (!paymentSchedule) errors["支付进度"] = true
      if (!invoiceType) errors["发票类型"] = true
      if (!paymentDeadline) errors["付款期限"] = true
      if (!financialContact) errors["财务联系人"] = true
      if (!penaltyClause) errors["违约条款"] = true
    }
    else if (currentStep === 4) {
      // 验证审批信息
      const { 
        approvalLevel, 
        approvers, 
        approvalDate, 
        legalReview 
      } = formData.approvalInfo
      
      if (!approvalLevel) errors["审批级别"] = true
      if (!approvers || approvers.length === 0) errors["审批人"] = true
      if (!approvalDate) errors["审批日期"] = true
      if (!legalReview) errors["法务审核"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
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
            onUpdate={(data: FormData['basicInfo']) => updateFormData(1, data)} 
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <ContractDetailsForm 
            data={formData.contractDetails} 
            onUpdate={(data: FormData['contractDetails']) => updateFormData(2, data)} 
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <FinancialInfoForm 
            data={formData.financialInfo} 
            onUpdate={(data: FormData['financialInfo']) => updateFormData(3, data)} 
            validationErrors={validationErrors}
          />
        )
      case 4:
        return (
          <ApprovalInfoForm 
            data={formData.approvalInfo} 
            onUpdate={(data: FormData['approvalInfo']) => updateFormData(4, data)} 
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

  if (isLoading) {
    return (
      <div className="w-full py-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-t-2 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/progress" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">编辑合同认定</h1>
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
              <h3 className="text-base font-medium">{STEPS[currentStep - 1]?.name || ""}</h3>
            </div>
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存
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
                  保存更新
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
              更新成功
            </DialogTitle>
            <DialogDescription>
              合同认定已成功更新，您可以继续编辑或返回列表查看。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleContinueEdit}>
              继续编辑
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

export default function EditContractRecognitionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>加载中...</p></div>}>
      <ContractRecognitionPageContent />
    </Suspense>
  )
} 