import { cn } from "@/lib/utils"

export default function StepIndicator({ steps, currentStep, completedSteps = [] }) {
  return (
    <div className="relative w-full px-4 py-6">
      {/* 步骤指示器 */}
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto relative">
        {/* 连接线背景 - 放在最底层 */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-300"></div>

        {/* 已完成步骤的连接线 - 放在中间层 */}
        {completedSteps.length > 0 && (
          <div
            className="absolute top-4 left-0 h-[2px] bg-blue-500 transition-all duration-300"
            style={{
              width: `calc(${(Math.max(...completedSteps) - 1) / (steps.length - 1)} * 100%)`,
            }}
          ></div>
        )}

        {/* 步骤圆点 - 放在最上层 */}
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id

          return (
            <div key={step.id} className="z-10 flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-white font-medium text-sm",
                  isCompleted || isCurrent ? "bg-blue-500" : "bg-gray-300",
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm whitespace-nowrap",
                  isCompleted || isCurrent ? "text-blue-500 font-medium" : "text-gray-500",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

