"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Clipboard, Plus, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StepExperimentProcedureProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepExperimentProcedure({ formData, updateFormData, validationErrors }: StepExperimentProcedureProps) {
  const [steps, setSteps] = useState<string[]>(formData.experimentSteps || [""])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
    updateFormData("experimentSteps", newSteps)
  }

  const addStep = () => {
    setSteps([...steps, ""])
    updateFormData("experimentSteps", [...steps, ""])
  }

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
    setSteps(newSteps)
    updateFormData("experimentSteps", newSteps)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Clipboard className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">实验过程</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="methodology" className="text-sm font-medium">
            实验方法
          </Label>
          <Textarea
            id="methodology"
            name="methodology"
            placeholder="请描述所使用的实验方法"
            value={formData.methodology || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">实验步骤</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addStep}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              添加步骤
            </Button>
          </div>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground">步骤 {index + 1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Textarea
                      placeholder={`请描述实验步骤 ${index + 1}`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="min-h-[80px]"
                    />
                    {steps.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeStep(index)}
                        className="mt-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedureDetails" className="text-sm font-medium">
            实验步骤补充说明
          </Label>
          <Textarea
            id="procedureDetails"
            name="procedureDetails"
            placeholder="请详细描述实验的关键步骤或特殊注意事项"
            value={formData.procedureDetails || ""}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="reagents" className="text-sm font-medium">
              试剂材料
            </Label>
            <Textarea
              id="reagents"
              name="reagents"
              placeholder="请列出实验中使用的主要试剂和材料"
              value={formData.reagents || ""}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlMeasures" className="text-sm font-medium">
              控制措施
            </Label>
            <Textarea
              id="controlMeasures"
              name="controlMeasures"
              placeholder="请描述实验中采用的控制措施"
              value={formData.controlMeasures || ""}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experimentDuration" className="text-sm font-medium">
            实验持续时间
          </Label>
          <Input
            id="experimentDuration"
            name="experimentDuration"
            placeholder="请输入实验持续时间，如：4小时"
            value={formData.experimentDuration || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
} 