"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
}

// 定义步骤列表
export const STEPS: Step[] = [
  {
    id: 0,
    name: "基本信息",
    description: "填写检查基本信息",
  },
  {
    id: 1,
    name: "检查详情",
    description: "填写检查方法和范围",
  },
  {
    id: 2,
    name: "发现问题",
    description: "记录检查发现的问题",
  },
  {
    id: 3,
    name: "整改措施",
    description: "提出整改建议和措施",
  },
  {
    id: 4,
    name: "完成",
    description: "确认并提交",
  },
]

interface StepNavigationProps {
  currentStep: number
  steps?: Step[]
  validationErrors?: Record<string, boolean>
  completedSteps?: number[]
  goToStep?: (step: number) => void
}

export default function StepNavigation({
  currentStep,
  steps = STEPS,
  validationErrors = {},
  completedSteps = [],
  goToStep,
}: StepNavigationProps) {
  // 检查步骤是否有错误
  const hasStepError = (stepId: number) => {
    if (stepId === 0) {
      return (
        validationErrors.inspectionNumber ||
        validationErrors.inspectionName ||
        validationErrors.inspectionType ||
        validationErrors.relatedProjectNumber ||
        validationErrors.inspectionDate
      )
    } else if (stepId === 1) {
      return (
        validationErrors.inspectionScope ||
        validationErrors.methodology ||
        validationErrors.standards
      )
    } else if (stepId === 2) {
      return (
        validationErrors.observations ||
        validationErrors.nonConformities ||
        validationErrors.riskLevel
      )
    } else if (stepId === 3) {
      return (
        validationErrors.correctiveActions ||
        validationErrors.followUpDate ||
        validationErrors.responsibleParty
      )
    }
    return false
  }

  // 检查步骤是否已完成
  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step)
  }

  // 处理步骤点击
  const handleStepClick = (step: number) => {
    if (goToStep && (step <= currentStep || isStepCompleted(step))) {
      goToStep(step);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative w-full">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-[2px]",
                  currentStep > index ? "bg-primary" : isStepCompleted(index) ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}

            {/* 步骤圆点 */}
            <button
              onClick={() => handleStepClick(index)}
              disabled={currentStep < index && !isStepCompleted(index)}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                currentStep === index
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep > index || isStepCompleted(index)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted-foreground/30 text-muted-foreground",
                hasStepError(index) && "border-destructive bg-destructive/10",
              )}
            >
              {hasStepError(index) ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : currentStep > index || isStepCompleted(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </button>

            {/* 步骤名称 */}
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep === index
                  ? "text-primary"
                  : currentStep > index || isStepCompleted(index)
                    ? "text-primary"
                    : "text-muted-foreground",
              )}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
