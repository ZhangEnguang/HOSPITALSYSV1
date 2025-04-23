interface Step {
  id: number
  name: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center px-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-[50%] w-[200%] h-[2px] ${
                  currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            )}

            {/* 步骤圆点 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                currentStep > step.id
                  ? "bg-blue-600 text-white"
                  : currentStep === step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              <span>{step.id}</span>
            </div>

            {/* 步骤名称 */}
            <span className={`mt-2 text-xs ${currentStep >= step.id ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

