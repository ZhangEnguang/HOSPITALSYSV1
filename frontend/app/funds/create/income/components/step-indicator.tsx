interface Step {
  id: number
  name: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center px-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center relative">
          {/* 连接线 */}
          {index < steps.length - 1 && (
            <div
              className={`absolute top-4 h-[2px] ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`}
              style={{
                left: "50%",
                width: "calc(100% * 2)",
                zIndex: 0,
              }}
            />
          )}

          {/* 步骤圆点 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
              currentStep === step.id
                ? "bg-blue-600 text-white"
                : currentStep > step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            <span className="text-sm font-medium">{step.id}</span>
          </div>

          {/* 步骤名称 */}
          <span
            className={`mt-2 text-xs ${
              currentStep === step.id
                ? "text-blue-600 font-medium"
                : currentStep > step.id
                  ? "text-blue-600"
                  : "text-gray-500"
            }`}
          >
            {step.name}
          </span>
        </div>
      ))}
    </div>
  )
}

