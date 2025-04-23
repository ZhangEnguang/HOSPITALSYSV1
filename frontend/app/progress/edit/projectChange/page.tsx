"use client"

import React, { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"

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

// 演示数据 - 项目变更数据
const demoProjectChangeData = {
  basicInfo: {
    projectId: "PRJ-2024-005",
    projectName: "新能源汽车动力电池回收利用技术研究",
    changeType: "schedule",
    changeTitle: "研究周期延长申请",
    changeReason: "由于实验设备采购延迟，以及部分核心技术攻关需要更多时间，申请将项目研究周期延长3个月。\n\n主要受到以下因素影响：\n1. 高精度测试设备供应链延迟\n2. 关键材料性能测试需要更长观察周期\n3. 技术难点突破需要额外实验验证",
    proposedDate: new Date(2024, 3, 15),
    proposer: "张明",
    department: "新能源材料研究室",
  },
  changeDetails: {
    originalPlan: "项目原计划研究周期为2024年1月至2024年12月，共12个月。\n\n主要里程碑：\n- 3月：完成文献调研和技术路线确定\n- 6月：完成样品制备和初步测试\n- 9月：完成性能优化和中试验证\n- 12月：完成成果总结和技术报告",
    changedPlan: "申请将项目周期延长至2025年3月，总周期调整为15个月。\n\n调整后里程碑：\n- 3月：完成文献调研和技术路线确定（已完成）\n- 7月：完成样品制备和初步测试（延后1个月）\n- 11月：完成性能优化和中试验证（延后2个月）\n- 2025年3月：完成成果总结和技术报告（延后3个月）",
    changeScope: "time",
    priority: "medium",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2025, 2, 31),
  },
  impactAnalysis: {
    scheduleImpactLevel: "moderate",
    scheduleImpact: "项目整体延期3个月，对后续科研计划安排有一定影响，但不影响年度总体目标的实现。需要与合作单位协调调整交付时间表。",
    costImpactLevel: "low",
    costImpact: "延期带来的额外成本主要包括：\n1. 设备使用费延长：约增加1.2万元\n2. 人员工资延长：约增加4.5万元\n3. 材料消耗增加：约0.8万元\n\n共计增加预算约6.5万元，占总预算的5%，在可控范围内。",
    riskAnalysis: "1. 市场风险：延期可能导致技术推广时间延后，但当前市场需求稳定，影响有限\n2. 技术风险：延长研究时间有利于技术攻关，降低技术失败风险\n3. 团队风险：部分研究人员在项目延期后可能面临时间冲突，需提前协调\n4. 资源风险：实验室设备使用时间需重新协调安排",
  },
  approvalInfo: {
    approvalLevel: "department",
    approvers: ["王主任", "李教授", "赵院长"],
    expectedApprovalDate: new Date(2024, 3, 20),
    attachments: [
      { name: "变更申请表.pdf", size: "1.2MB" },
      { name: "进度调整计划.xlsx", size: "0.8MB" },
      { name: "预算调整说明.docx", size: "0.5MB" }
    ]
  },
};

// 定义接口类型
interface ProjectChangeFormData {
  basicInfo: {
    projectId: string;
    projectName: string;
    changeType: string;
    changeTitle: string;
    changeReason: string;
    proposedDate: Date;
    proposer: string;
    department: string;
  };
  changeDetails: {
    originalPlan: string;
    changedPlan: string;
    changeScope: string;
    priority: string;
    startDate: Date;
    endDate: Date;
  };
  impactAnalysis: {
    scheduleImpactLevel: string;
    scheduleImpact: string;
    costImpactLevel: string;
    costImpact: string;
    riskAnalysis: string;
  };
  approvalInfo: {
    approvalLevel: string;
    approvers: string[];
    expectedApprovalDate: Date;
    attachments: Array<{name: string, size: string}>;
  };
}

// 内容组件
function ProjectChangeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const changeId = searchParams.get('id')
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3])
  const [formData, setFormData] = useState<ProjectChangeFormData>(demoProjectChangeData as ProjectChangeFormData)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
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
  }, [changeId])

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
          title: "表单验证失败",
          description: "请填写所有必填项",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("保存草稿", formData)
    // 实现保存草稿逻辑
    toast({
      title: "保存成功",
      description: "项目变更已保存",
      duration: 3000,
    })
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const handleComplete = () => {
    console.log("提交变更申请", formData)
    // 实现提交逻辑
    setShowSuccessDialog(true)
  }

  const handleContinueAdd = () => {
    // 重置表单数据和步骤
    setFormData(demoProjectChangeData as ProjectChangeFormData)
    setCurrentStep(0)
    setCompletedSteps([0, 1, 2, 3])
    setShowSuccessDialog(false)
    setValidationErrors({})
  }

  const handleReturnToList = () => {
    router.push("/progress")
  }

  const updateFormData = (step: number, data: unknown) => {
    // 防止无限循环，只在数据真正变化时更新
    const currentStepData = getStepData(step)
    if (JSON.stringify(currentStepData) !== JSON.stringify(data)) {
      setFormData((prev) => {
        const newData = { ...prev }
        switch (step) {
          case 0:
            newData.basicInfo = data as ProjectChangeFormData['basicInfo']
            break
          case 1:
            newData.changeDetails = data as ProjectChangeFormData['changeDetails']
            break
          case 2:
            newData.impactAnalysis = data as ProjectChangeFormData['impactAnalysis']
            break
          case 3:
            newData.approvalInfo = data as ProjectChangeFormData['approvalInfo']
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
      case 0:
        return formData.basicInfo
      case 1:
        return formData.changeDetails
      case 2:
        return formData.impactAnalysis
      case 3:
        return formData.approvalInfo
      default:
        return {}
    }
  }

  // 验证当前步骤
  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 验证基本信息
      const { projectName, changeType, changeTitle, changeReason, proposedDate, proposer, department } = formData.basicInfo as any
      
      if (!projectName) errors["项目名称"] = true
      if (!changeType) errors["变更类型"] = true
      if (!changeTitle) errors["变更标题"] = true
      if (!changeReason) errors["变更原因"] = true
      if (!proposedDate) errors["提出日期"] = true
      if (!proposer) errors["提出人"] = true
      if (!department) errors["所属部门"] = true
    } 
    else if (currentStep === 1) {
      // 验证变更详情
      const { originalPlan, changedPlan, changeScope, priority, startDate, endDate } = formData.changeDetails as any
      
      if (!originalPlan) errors["原计划内容"] = true
      if (!changedPlan) errors["变更后内容"] = true
      if (!changeScope) errors["变更范围"] = true
      if (!priority) errors["优先级"] = true
      if (!startDate) errors["开始日期"] = true
      if (!endDate) errors["结束日期"] = true
    }
    else if (currentStep === 2) {
      // 验证影响分析
      const { scheduleImpactLevel, scheduleImpact, costImpactLevel, costImpact, riskAnalysis } = formData.impactAnalysis as any
      
      if (!scheduleImpactLevel) errors["进度影响程度"] = true
      if (!scheduleImpact) errors["进度影响说明"] = true
      if (!costImpactLevel) errors["成本影响程度"] = true
      if (!costImpact) errors["成本影响说明"] = true
      if (!riskAnalysis) errors["风险分析"] = true
    }
    else if (currentStep === 3) {
      // 验证审批信息
      const { approvalLevel, approvers, expectedApprovalDate } = formData.approvalInfo as any
      
      if (!approvalLevel) errors["审批级别"] = true
      if (!approvers) errors["审批人"] = true
      if (!expectedApprovalDate) errors["预计审批日期"] = true
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
      case 0:
        return (
          <BasicInfoForm 
            data={formData.basicInfo} 
            onUpdate={(data: ProjectChangeFormData['basicInfo']) => updateFormData(0, data)} 
            validationErrors={validationErrors}
          />
        )
      case 1:
        return (
          <ChangeDetailsForm 
            data={formData.changeDetails} 
            onUpdate={(data: ProjectChangeFormData['changeDetails']) => updateFormData(1, data)} 
            validationErrors={validationErrors}
          />
        )
      case 2:
        return (
          <ImpactAnalysisForm 
            data={formData.impactAnalysis} 
            onUpdate={(data: ProjectChangeFormData['impactAnalysis']) => updateFormData(2, data)} 
            validationErrors={validationErrors}
          />
        )
      case 3:
        return (
          <ApprovalInfoForm 
            data={formData.approvalInfo} 
            onUpdate={(data: ProjectChangeFormData['approvalInfo']) => updateFormData(3, data)} 
            validationErrors={validationErrors}
          />
        )
      case 4:
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
        <h1 className="text-2xl font-bold">编辑项目变更</h1>
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
              <h3 className="text-base font-medium">{STEPS[currentStep].name}</h3>
            </div>
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
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
              项目变更已成功更新，您可以继续编辑或返回列表查看。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleContinueAdd}>
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

// 导出使用Suspense包装的页面组件
export default function EditProjectChangePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>加载中...</p></div>}>
      <ProjectChangeContent />
    </Suspense>
  )
} 