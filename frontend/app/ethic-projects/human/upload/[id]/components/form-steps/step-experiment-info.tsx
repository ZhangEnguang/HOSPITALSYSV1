"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, AlertCircle, Beaker } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

interface StepExperimentInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepExperimentInfo({ formData, updateFormData, validationErrors }: StepExperimentInfoProps) {
  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
  }
  
  const handleDateChange = (field: string, value: Date | undefined) => {
    updateFormData(field, value)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Beaker className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">试验阶段信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="experimentStage" className="text-sm font-medium flex items-center">
            试验阶段 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.experimentStage || ""} 
            onValueChange={(value) => handleSelectChange("experimentStage", value)}
          >
            <SelectTrigger 
              id="experimentStage"
              className={cn(
                validationErrors["experimentStage"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="请选择试验阶段" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="筛选阶段">筛选阶段</SelectItem>
              <SelectItem value="基线评估">基线评估</SelectItem>
              <SelectItem value="干预阶段">干预阶段</SelectItem>
              <SelectItem value="随访阶段">随访阶段</SelectItem>
              <SelectItem value="数据收集">数据收集</SelectItem>
              <SelectItem value="结果评估">结果评估</SelectItem>
              <SelectItem value="受试者招募">受试者招募</SelectItem>
              <SelectItem value="知情同意获取">知情同意获取</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors["experimentStage"] && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              请选择试验阶段
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experimentDate" className="text-sm font-medium flex items-center">
            实验日期 <span className="text-red-500 ml-1">*</span>
          </Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="experimentDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.experimentDate && "text-muted-foreground",
                    validationErrors["experimentDate"] && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.experimentDate ? (
                    format(new Date(formData.experimentDate), "yyyy-MM-dd")
                  ) : (
                    <span>请选择日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.experimentDate ? new Date(formData.experimentDate) : undefined}
                  onSelect={(date) => handleDateChange("experimentDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {validationErrors["experimentDate"] && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              请选择实验日期
            </p>
          )}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="experimentLocation" className="text-sm font-medium">
            实验地点
          </Label>
          <Input
            id="experimentLocation"
            name="experimentLocation"
            placeholder="请输入实验地点，例如：临床试验中心、专科门诊部等"
            value={formData.experimentLocation || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="experimentOperator" className="text-sm font-medium">
            实验操作人员
          </Label>
          <Input
            id="experimentOperator"
            name="experimentOperator"
            placeholder="请输入实验操作人员，例如：主治医师、研究助理等"
            value={formData.experimentOperator || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="experimentEquipment" className="text-sm font-medium">
            使用设备
          </Label>
          <Input
            id="experimentEquipment"
            name="experimentEquipment"
            placeholder="请输入实验使用的主要设备，例如：超声波检查仪、心电图机、动态血压监测仪等"
            value={formData.experimentEquipment || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
} 