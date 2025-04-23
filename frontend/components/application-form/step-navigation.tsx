"use client"

import { Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Step } from "./types"

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  goToStep: (index: number) => void
  validationErrors?: Record<string, boolean>
  completedSteps?: number[]
  readonly?: boolean
}

export function StepNavigation({
  steps,
  currentStep,
  goToStep,
  validationErrors = {},
  completedSteps = [],
  readonly = false,
}: StepNavigationProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-3 md:flex md:space-x-5 md:space-y-0">
        {steps.map((step, index) => {
          const stepId = step.id
          const isActive = index === currentStep
          const isCompleted = completedSteps.includes(stepId)
          const hasError = Object.keys(validationErrors).length > 0 && isActive
          
          return (
            <li key={stepId} className="md:flex-1">
              <button
                onClick={() => goToStep(index)}
                disabled={readonly}
                className={cn(
                  "group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  isActive
                    ? "border-primary text-primary md:pt-0"
                    : isCompleted
                    ? "border-primary/70 text-primary/70"
                    : "border-muted-foreground/30 text-muted-foreground/70"
                )}
              >
                <span className="flex items-center text-sm font-medium">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full mr-2 text-xs",
                      isActive
                        ? "bg-primary text-white"
                        : isCompleted
                        ? "bg-primary/70 text-white"
                        : "border border-muted-foreground/30 text-muted-foreground/70"
                    )}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : stepId + 1}
                  </span>
                  <span>{step.name}</span>
                  {hasError && (
                    <AlertCircle className="ml-2 h-4 w-4 text-destructive" />
                  )}
                </span>
                <span className="mt-0.5 ml-8 text-sm text-muted-foreground">
                  {step.description}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
