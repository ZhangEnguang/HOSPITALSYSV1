"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepItem {
  id: number
  name: string
}

interface StepsProps {
  steps: StepItem[]
  currentStep: number
}

export function Steps({ steps, currentStep }: StepsProps) {
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
                  currentStep > index ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}

            {/* 步骤圆点 */}
            <div
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                currentStep === index
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep > index
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-white border-muted-foreground/30 text-muted-foreground/70"
              )}
            >
              {currentStep > index ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>

            {/* 步骤名称 */}
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep === index
                  ? "text-primary"
                  : currentStep > index
                    ? "text-primary"
                    : "text-muted-foreground"
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