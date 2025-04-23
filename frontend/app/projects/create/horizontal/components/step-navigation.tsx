"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const STEPS = [
  { id: "info", name: "项目信息" },
  { id: "members", name: "团队成员" },
  { id: "budget", name: "预算" },
  { id: "documents", name: "文档" },
  { id: "complete", name: "完成" },
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
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isActive = currentStep === index
          const isCompleted = completedSteps.includes(index)
          const hasError = Object.keys(validationErrors).length > 0 && index === currentStep

          return (
            <div key={step.id} className="flex items-center relative">
              {/* 步骤圆圈 */}
              <button
                onClick={() => goToStep(index)}
                disabled={index > currentStep && !isCompleted}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all relative z-10",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : isCompleted
                      ? "bg-primary/90 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  hasError && "bg-destructive text-destructive-foreground",
                  index <= currentStep || isCompleted ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
              </button>

              {/* 步骤名称 */}
              <span
                className={cn(
                  "absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.name}
              </span>

              {/* 连接线 - 除了最后一个步骤外，每个步骤后面都有连接线 */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] w-[calc(100%-2rem)] absolute top-5 left-10 -z-0",
                    index < currentStep || (isCompleted && index === currentStep) ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

