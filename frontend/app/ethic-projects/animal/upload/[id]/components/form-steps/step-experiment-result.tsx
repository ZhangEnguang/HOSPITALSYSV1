"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { BadgeCheck, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepExperimentResultProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepExperimentResult({ formData, updateFormData, validationErrors }: StepExperimentResultProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <BadgeCheck className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">实验结果</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resultSummary" className="text-sm font-medium flex items-center">
            结果摘要 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="resultSummary"
            name="resultSummary"
            placeholder="请简要描述实验的关键结果"
            value={formData.resultSummary || ""}
            onChange={handleInputChange}
            className={cn(
              "min-h-[120px]",
              validationErrors["resultSummary"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["resultSummary"] && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              请填写实验结果摘要
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="animalCondition" className="text-sm font-medium">
            动物状况
          </Label>
          <Textarea
            id="animalCondition"
            name="animalCondition"
            placeholder="请描述实验过程中和实验后动物的健康状况"
            value={formData.animalCondition || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="successRate" className="text-sm font-medium">
              实验成功率
            </Label>
            <Input
              id="successRate"
              name="successRate"
              placeholder="请输入实验成功率，如：90%"
              value={formData.successRate || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sampleCount" className="text-sm font-medium">
              样本数量
            </Label>
            <Input
              id="sampleCount"
              name="sampleCount"
              placeholder="请输入实验样本数量"
              value={formData.sampleCount || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataDescription" className="text-sm font-medium">
            数据描述
          </Label>
          <Textarea
            id="dataDescription"
            name="dataDescription"
            placeholder="请描述所收集的数据类型和特点"
            value={formData.dataDescription || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations" className="text-sm font-medium">
            观察记录
          </Label>
          <Textarea
            id="observations"
            name="observations"
            placeholder="请输入实验过程中的重要观察记录"
            value={formData.observations || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unexpectedResults" className="text-sm font-medium">
            未预期结果
          </Label>
          <Textarea
            id="unexpectedResults"
            name="unexpectedResults"
            placeholder="请描述实验中遇到的任何未预期结果或异常情况"
            value={formData.unexpectedResults || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>
      </div>
    </div>
  )
} 