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

      <div className="space-y-6">
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

        {/* 时间字段：响应式网格布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 预计开始时间 */}
          <div className="space-y-2">
            <Label htmlFor="plannedStartTime" className="text-sm font-medium flex items-center">
              预计开始时间 <span className="text-red-500 ml-1">*</span>
            </Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="plannedStartTime"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.plannedStartTime && "text-muted-foreground",
                      validationErrors["plannedStartTime"] && "border-red-500 focus-visible:ring-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.plannedStartTime ? (
                      format(new Date(formData.plannedStartTime), "yyyy-MM-dd")
                    ) : (
                      <span>选择日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.plannedStartTime ? new Date(formData.plannedStartTime) : undefined}
                    onSelect={(date) => handleDateChange("plannedStartTime", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {validationErrors["plannedStartTime"] && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                请选择预计开始时间
              </p>
            )}
          </div>

          {/* 预计结束时间 */}
          <div className="space-y-2">
            <Label htmlFor="plannedEndTime" className="text-sm font-medium flex items-center">
              预计结束时间 <span className="text-red-500 ml-1">*</span>
            </Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="plannedEndTime"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.plannedEndTime && "text-muted-foreground",
                      validationErrors["plannedEndTime"] && "border-red-500 focus-visible:ring-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.plannedEndTime ? (
                      format(new Date(formData.plannedEndTime), "yyyy-MM-dd")
                    ) : (
                      <span>选择日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.plannedEndTime ? new Date(formData.plannedEndTime) : undefined}
                    onSelect={(date) => handleDateChange("plannedEndTime", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {validationErrors["plannedEndTime"] && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                请选择预计结束时间
              </p>
            )}
          </div>

          {/* 实际开始时间 */}
          <div className="space-y-2">
            <Label htmlFor="actualStartTime" className="text-sm font-medium">
              实际开始时间
            </Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="actualStartTime"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.actualStartTime && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.actualStartTime ? (
                      format(new Date(formData.actualStartTime), "yyyy-MM-dd")
                    ) : (
                      <span>选择日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.actualStartTime ? new Date(formData.actualStartTime) : undefined}
                    onSelect={(date) => handleDateChange("actualStartTime", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 实际结束时间 */}
          <div className="space-y-2">
            <Label htmlFor="actualEndTime" className="text-sm font-medium">
              实际结束时间
            </Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="actualEndTime"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.actualEndTime && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.actualEndTime ? (
                      format(new Date(formData.actualEndTime), "yyyy-MM-dd")
                    ) : (
                      <span>选择日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.actualEndTime ? new Date(formData.actualEndTime) : undefined}
                    onSelect={(date) => handleDateChange("actualEndTime", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
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
        
        <div className="space-y-2">
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
        
        <div className="space-y-2">
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