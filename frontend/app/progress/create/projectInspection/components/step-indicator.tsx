interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { id: 1, name: "基本信息" },
    { id: 2, name: "检查详情" },
    { id: 3, name: "发现问题" },
    { id: 4, name: "整改措施" },
    { id: 5, name: "完成" },
  ]

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full px-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-[50%] w-[calc(200%)] h-[2px] ${
                  currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}

            {/* 步骤圆圈 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                currentStep > step.id
                  ? "bg-blue-600 text-white"
                  : currentStep === step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step.id ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                step.id
              )}
            </div>

            {/* 步骤名称 */}
            <span className={`mt-2 text-sm ${currentStep >= step.id ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

