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
    description: "填写合同基本信息",
  },
  {
    id: 1,
    name: "合同详情",
    description: "填写合同详细信息",
  },
  {
    id: 2,
    name: "财务信息",
    description: "设置合同财务信息",
  },
  {
    id: 3,
    name: "审批信息",
    description: "填写审批相关信息",
  },
  {
    id: 4,
    name: "完成",
    description: "确认并提交",
  },
]

interface StepNavigationProps {
  currentStep: number
  goToStep: (step: number) => void
  validationErrors?: Record<string, boolean>
  completedSteps?: number[]
}

export function StepNavigation({
  currentStep,
  goToStep,
  validationErrors = {},
  completedSteps = [],
}: StepNavigationProps) {
  // 检查步骤是否有错误
  const hasStepError = (step: number) => {
    if (step === 0) {
      return Object.keys(validationErrors).some(
        (key) => ["合同编号", "合同名称", "合同类型", "合同分类", "合同来源", "合同目的"].includes(key) && validationErrors[key],
      )
    }
    if (step === 1) {
      return Object.keys(validationErrors).some(
        (key) => ["甲方", "乙方", "签订日期", "合同范围", "签约地点", "合同期限", "合同见证人"].includes(key) && validationErrors[key],
      )
    }
    if (step === 2) {
      return Object.keys(validationErrors).some(
        (key) => ["合同金额", "币种", "支付方式", "支付计划", "发票类型", "付款截止日期", "财务联系人", "违约金条款"].includes(key) && validationErrors[key],
      )
    }
    if (step === 3) {
      return Object.keys(validationErrors).some(
        (key) => ["审批级别", "审批人", "预计审批日期", "审批部门", "备选审批人", "审批优先级", "审批要求"].includes(key) && validationErrors[key],
      )
    }
    return false
  }

  // 检查步骤是否已完成
  const isStepCompleted = (step: number) => {
    // 将步骤索引转换为步骤ID（索引+1），以匹配原有的completedSteps数组
    return completedSteps.includes(step + 1)
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative w-full">
            {/* 连接线 */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-[2px]",
                  currentStep > index ? "bg-primary" : isStepCompleted(index) ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}

            {/* 步骤圆点 */}
            <button
              onClick={() => goToStep(index + 1)}
              disabled={currentStep < index + 1 && !isStepCompleted(index)}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                currentStep === index + 1
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep > index + 1 || isStepCompleted(index)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted-foreground/30 text-muted-foreground",
                hasStepError(index) && "border-destructive bg-destructive/10",
              )}
            >
              {hasStepError(index) ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : currentStep > index + 1 || isStepCompleted(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </button>

            {/* 步骤名称 */}
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep === index + 1
                  ? "text-primary"
                  : currentStep > index + 1 || isStepCompleted(index)
                    ? "text-primary"
                    : "text-muted-foreground",
                hasStepError(index) && "text-destructive",
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
