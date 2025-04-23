"use client"

import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"

// 定义步骤类型
export interface Step {
  id: number
  name: string
  description?: string
}

// 基本步骤定义
export const BASIC_STEPS: Step[] = [
  {
    id: 0,
    name: "基本信息",
    description: "填写项目基础信息",
  },
  {
    id: 1,
    name: "成员信息",
    description: "管理项目团队成员",
  },
  {
    id: 2,
    name: "经费预算",
    description: "规划项目经费使用",
  }
]

// 针对不同申报书生成方式的额外步骤
export const ONLINE_STEPS: Step[] = [
  {
    id: 3,
    name: "正文信息",
    description: "补充项目实施细节",
  },
  {
    id: 4,
    name: "预览确认",
    description: "核对申报信息",
  }
]

export const INTELLIGENT_STEPS: Step[] = [
  {
    id: 3,
    name: "正文信息",
    description: "上传申报书正文",
  },
  {
    id: 4,
    name: "预览确认",
    description: "核对申报信息",
  }
]

export const OFFLINE_STEPS: Step[] = [
  {
    id: 3,
    name: "附件材料",
    description: "上传相关证明文件",
  },
  {
    id: 4,
    name: "预览确认",
    description: "核对申报信息",
  }
]

// 根据申报书生成方式获取步骤列表
export const getStepsByFormType = (formType: string): Step[] => {
  const baseSteps = [...BASIC_STEPS];
  
  if (formType === "全流程在线生成") {
    return [...baseSteps, ...ONLINE_STEPS];
  } else if (formType === "智能协同生成") {
    return [...baseSteps, ...INTELLIGENT_STEPS];
  } else {
    // 默认为线下模板化
    return [...baseSteps, ...OFFLINE_STEPS];
  }
}

interface StepNavigationProps {
  steps: Array<{ id: number; name: string; description?: string }>
  currentStep: number
  completedSteps: number[]
  onStepClick: (step: number) => void
  validationErrors?: Record<string, boolean>
}

export function StepNavigation({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  validationErrors = {},
}: StepNavigationProps) {
  // 检查步骤是否有错误
  const hasStepError = (step: number) => {
    if (step === 0) {
      return Object.keys(validationErrors).some(
        (key) => ["项目名称", "所属单位", "项目分类", "申请人", "性别", "研究开始日期", "研究结束日期", "申请经费", "一级学科", "预期成果", "关键词", "项目摘要"].includes(key) && validationErrors[key],
      )
    }
    if (step === 1) {
      return validationErrors["项目成员"] === true
    }
    if (step === 2) {
      return validationErrors["总预算"] === true
    }
    if (step === 3) {
      // 根据不同步骤类型检查不同字段
      const stepName = steps[step]?.name || "";
      if (stepName === "正文信息") {
        return Object.keys(validationErrors).some(
          (key) => ["研究背景", "研究目标", "研究内容", "预期成果详情", "申报书正文"].includes(key) && validationErrors[key],
        )
      } else if (stepName === "附件材料") {
        return validationErrors["附件"] === true
      }
    }
    return false
  }

  // 检查步骤是否已完成
  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step)
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
              onClick={() => onStepClick(index)}
              disabled={currentStep < index && !isStepCompleted(index)}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-[20px] border-2 transition-all",
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