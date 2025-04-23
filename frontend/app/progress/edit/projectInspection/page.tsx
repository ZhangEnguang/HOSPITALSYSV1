"use client"

import React, { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, InfoIcon, Save, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import StepNavigation, { STEPS } from "../../create/projectInspection/components/step-navigation"
import BasicInfoForm from "../../create/projectInspection/components/basic-info-form"
import InspectionDetailsForm from "../../create/projectInspection/components/inspection-details-form"
import FindingsForm from "../../create/projectInspection/components/findings-form"
import RecommendationsForm from "../../create/projectInspection/components/recommendations-form"
import CompletionStep from "../../create/projectInspection/components/completion-step"
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

// 演示数据 - 项目中检数据
const demoInspectionData = {
  basicInfo: {
    inspectionNumber: "ZJ-2024-003",
    inspectionName: "国家自然科学基金项目中期检查",
    inspectionType: "进度检查",
    relatedProjectNumber: "NSFC-2023-B015",
    relatedProjectName: "基于深度学习的复杂场景目标检测与跟踪关键技术研究",
    inspectionDate: new Date(2024, 3, 15),
    inspector: "张教授",
    department: "科研处",
    contactPhone: "13912345678",
    contactEmail: "zhangprof@university.edu.cn"
  },
  inspectionDetails: {
    inspectionScope: "项目研究进度、科研成果产出及经费使用情况",
    methodology: "文档审查、实验室现场检查、研究团队访谈、数据分析",
    standards: "《国家自然科学基金项目管理办法》、《科技计划项目绩效评价规范》",
    inspectionLocation: "人工智能研究实验室",
    teamMembers: ["李博士", "王工程师", "赵研究员"],
    attachments: [
      { name: "项目进度报告.pdf", size: "2.8MB" },
      { name: "研究数据集.xlsx", size: "5.2MB" },
      { name: "经费使用明细.docx", size: "1.5MB" }
    ],
    inspectionObjectives: "评估项目研究进展是否符合预期计划，科研产出是否达到中期目标，经费使用是否合规"
  },
  findings: {
    observations: "1. 项目已完成第一阶段的算法设计和初步测试\n2. 已发表SCI论文2篇，申请专利1项\n3. 部分实验设备采购延迟，影响了部分实验的开展\n4. 研究团队人员稳定，分工明确",
    nonConformities: "1. 经费使用进度较慢，仅执行总预算的35%\n2. 部分研究指标完成进度滞后，特别是在模型优化方面",
    riskLevel: "中等风险",
    projectSchedule: {
      plannedProgress: 60,
      actualProgress: 45,
      delayReasons: "实验设备采购延迟，部分关键技术攻关难度大于预期"
    },
    achievementsSummary: "已完成基础算法设计和初步验证，发表相关论文，但部分核心技术指标进展不及预期"
  },
  recommendations: {
    correctiveActions: "1. 加快设备采购进度，调整采购计划\n2. 增强研究团队在模型优化方面的力量，可考虑引入相关领域专家合作\n3. 制定更详细的研究里程碑计划，明确时间节点",
    followUpDate: new Date(2024, 6, 15),
    responsibleParty: "项目负责人：张教授",
    resources: "建议调整部分经费用途，增加计算资源投入",
    priorityLevel: "高",
    expectedOutcomes: "在3个月内完成设备采购并加速研究进度，争取在下次检查前达到预期进度",
    comments: "项目总体方向明确，研究内容有创新性，但需要更好的进度管理和资源协调"
  }
};

// 添加类型定义
interface BasicInfoType {
  inspectionNumber: string;
  inspectionName: string;
  inspectionType: string;
  relatedProjectNumber: string;
  relatedProjectName: string;
  inspectionDate: Date;
  inspector: string;
  department: string;
  contactPhone: string;
  contactEmail: string;
}

interface InspectionDetailsType {
  inspectionScope: string;
  methodology: string;
  standards: string;
  inspectionLocation: string;
  teamMembers: string[];
  attachments: Array<{name: string, size: string}>;
  inspectionObjectives: string;
}

interface FindingsType {
  observations: string;
  nonConformities: string;
  riskLevel: string;
  projectSchedule: {
    plannedProgress: number;
    actualProgress: number;
    delayReasons: string;
  };
  achievementsSummary: string;
}

interface RecommendationsType {
  correctiveActions: string;
  followUpDate: Date;
  responsibleParty: string;
  resources: string;
  priorityLevel: string;
  expectedOutcomes: string;
  comments: string;
}

interface InspectionFormData {
  basicInfo: BasicInfoType;
  inspectionDetails: InspectionDetailsType;
  findings: FindingsType;
  recommendations: RecommendationsType;
}

// 内容组件
function ProjectInspectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inspectionId = searchParams ? searchParams.get('id') : null
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3])
  const [formData, setFormData] = useState<InspectionFormData>(demoInspectionData as InspectionFormData)
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
  }, [inspectionId])

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

  const handleUpdateBasicInfo = (data: BasicInfoType) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: data,
    }))
  }

  const handleUpdateInspectionDetails = (data: InspectionDetailsType) => {
    setFormData((prev) => ({
      ...prev,
      inspectionDetails: data,
    }))
  }

  const handleUpdateFindings = (data: FindingsType) => {
    setFormData((prev) => ({
      ...prev,
      findings: data,
    }))
  }

  const handleUpdateRecommendations = (data: RecommendationsType) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: data,
    }))
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const handleSaveDraft = () => {
    // 保存草稿逻辑
    console.log("保存中检数据", formData);
    toast({
      title: "保存成功",
      description: "您的项目中检表单已成功保存。",
    })
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const handleSubmit = () => {
    // 验证所有步骤
    let allValid = true
    for (let i = 0; i < STEPS.length - 1; i++) {
      // 临时设置当前步骤以验证
      const tempCurrentStep = currentStep;
      setCurrentStep(i)
      if (!validateCurrentStep()) {
        allValid = false
        setCurrentStep(tempCurrentStep) // 恢复原来的步骤
        break
      }
      setCurrentStep(tempCurrentStep) // 恢复原来的步骤
    }

    if (allValid) {
      // 提交表单
      console.log("提交中检数据", formData);
      setShowSuccessDialog(true)
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
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
      <Link href="/progress" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">编辑项目中检</h1>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <StepNavigation
              currentStep={currentStep}
              completedSteps={completedSteps}
              goToStep={goToStep}
              validationErrors={validationErrors}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="bg-muted/40 p-4 rounded-md mb-6 flex items-center">
              <InfoIcon className="h-5 w-5 text-muted-foreground mr-2" />
              <span>{STEPS[currentStep].description}</span>
            </div>

            {renderStepContent()}
          </CardContent>

          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>

            <div className="flex space-x-2">
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
                <Button onClick={handleSubmit}>
                  保存更新
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              更新成功
            </DialogTitle>
            <DialogDescription>
              项目中检已成功更新，您可以返回列表查看或继续编辑。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button variant="default" onClick={() => router.push("/progress")}>
              返回列表
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
              }}
            >
              继续编辑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 导出使用Suspense包装的页面组件
export default function EditProjectInspectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>加载中...</p></div>}>
      <ProjectInspectionContent />
    </Suspense>
  )
} 