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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
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
              <SelectItem value="preliminary">初步试验</SelectItem>
              <SelectItem value="midterm">中期阶段</SelectItem>
              <SelectItem value="final">最终阶段</SelectItem>
              <SelectItem value="followUp">随访阶段</SelectItem>
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
          <Label htmlFor="plannedStartDate" className="text-sm font-medium flex items-center">
            预计开始时间 <span className="text-red-500 ml-1">*</span>
          </Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="plannedStartDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.plannedStartDate && "text-muted-foreground",
                    validationErrors["plannedStartDate"] && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.plannedStartDate ? (
                    format(new Date(formData.plannedStartDate), "yyyy-MM-dd")
                  ) : (
                    <span>请选择预计开始时间</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.plannedStartDate ? new Date(formData.plannedStartDate) : undefined}
                  onSelect={(date) => handleDateChange("plannedStartDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {validationErrors["plannedStartDate"] && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              请选择预计开始时间
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="plannedEndDate" className="text-sm font-medium flex items-center">
            预计结束时间 <span className="text-red-500 ml-1">*</span>
          </Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="plannedEndDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.plannedEndDate && "text-muted-foreground",
                    validationErrors["plannedEndDate"] && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.plannedEndDate ? (
                    format(new Date(formData.plannedEndDate), "yyyy-MM-dd")
                  ) : (
                    <span>请选择预计结束时间</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.plannedEndDate ? new Date(formData.plannedEndDate) : undefined}
                  onSelect={(date) => handleDateChange("plannedEndDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {validationErrors["plannedEndDate"] && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              请选择预计结束时间
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="actualStartDate" className="text-sm font-medium">
            实际开始时间
          </Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="actualStartDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.actualStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.actualStartDate ? (
                    format(new Date(formData.actualStartDate), "yyyy-MM-dd")
                  ) : (
                    <span>请选择实际开始时间</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.actualStartDate ? new Date(formData.actualStartDate) : undefined}
                  onSelect={(date) => handleDateChange("actualStartDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actualEndDate" className="text-sm font-medium">
            实际结束时间
          </Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="actualEndDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.actualEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.actualEndDate ? (
                    format(new Date(formData.actualEndDate), "yyyy-MM-dd")
                  ) : (
                    <span>请选择实际结束时间</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.actualEndDate ? new Date(formData.actualEndDate) : undefined}
                  onSelect={(date) => handleDateChange("actualEndDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="experimentLocation" className="text-sm font-medium">
            实验地点
          </Label>
          <Input
            id="experimentLocation"
            name="experimentLocation"
            placeholder="请输入实验地点"
            value={formData.experimentLocation || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="experimentOperator" className="text-sm font-medium">
            实验操作人员
          </Label>
          <Input
            id="experimentOperator"
            name="experimentOperator"
            placeholder="请输入实验操作人员"
            value={formData.experimentOperator || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="experimentEquipment" className="text-sm font-medium">
            使用设备
          </Label>
          <Input
            id="experimentEquipment"
            name="experimentEquipment"
            placeholder="请输入实验使用的主要设备"
            value={formData.experimentEquipment || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
} 