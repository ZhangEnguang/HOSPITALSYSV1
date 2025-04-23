"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ApprovalInfoForm({ data, onUpdate, validationErrors }) {
  const [formValues, setFormValues] = useState({
    approvalLevel: data?.approvalLevel || "",
    approver: data?.approver || "",
    expectedApprovalDate: data?.expectedApprovalDate || null,
    comments: data?.comments || "",
    approvalDepartment: data?.approvalDepartment || "", 
    approvalPriority: data?.approvalPriority || "", 
    approvalRequirements: data?.approvalRequirements || "", 
    alternateApprover: data?.alternateApprover || "", 
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    onUpdate(formValues)
  }, [formValues, onUpdate])

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="approvalLevel" className="flex items-center">
            审批级别
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.approvalLevel} 
            onValueChange={(value) => handleChange("approvalLevel", value)}
          >
            <SelectTrigger 
              id="approvalLevel"
              className={validationErrors?.["审批级别"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择审批级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="department">部门级</SelectItem>
              <SelectItem value="division">分部级</SelectItem>
              <SelectItem value="company">公司级</SelectItem>
              <SelectItem value="group">集团级</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["审批级别"] && (
            <p className="text-sm text-red-500 mt-1">请选择审批级别</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalDepartment" className="flex items-center">
            审批部门
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="approvalDepartment"
            value={formValues.approvalDepartment}
            onChange={(e) => handleChange("approvalDepartment", e.target.value)}
            placeholder="请输入审批部门"
            className={validationErrors?.["审批部门"] ? "border-red-500" : ""}
          />
          {validationErrors?.["审批部门"] && (
            <p className="text-sm text-red-500 mt-1">请输入审批部门</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approver" className="flex items-center">
            审批人
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="approver"
            value={formValues.approver}
            onChange={(e) => handleChange("approver", e.target.value)}
            placeholder="请输入审批人"
            className={validationErrors?.["审批人"] ? "border-red-500" : ""}
          />
          {validationErrors?.["审批人"] && (
            <p className="text-sm text-red-500 mt-1">请输入审批人</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternateApprover" className="flex items-center">
            备选审批人
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="alternateApprover"
            value={formValues.alternateApprover}
            onChange={(e) => handleChange("alternateApprover", e.target.value)}
            placeholder="请输入备选审批人"
            className={validationErrors?.["备选审批人"] ? "border-red-500" : ""}
          />
          {validationErrors?.["备选审批人"] && (
            <p className="text-sm text-red-500 mt-1">请输入备选审批人</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedApprovalDate" className="flex items-center">
            预计审批日期
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.expectedApprovalDate && "text-muted-foreground",
                  validationErrors?.["预计审批日期"] && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.expectedApprovalDate
                  ? format(formValues.expectedApprovalDate, "yyyy-MM-dd")
                  : "请选择预计审批日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formValues.expectedApprovalDate}
                onSelect={(date) => handleChange("expectedApprovalDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors?.["预计审批日期"] && (
            <p className="text-sm text-red-500 mt-1">请选择预计审批日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalPriority" className="flex items-center">
            审批优先级
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.approvalPriority} 
            onValueChange={(value) => handleChange("approvalPriority", value)}
          >
            <SelectTrigger 
              id="approvalPriority"
              className={validationErrors?.["审批优先级"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择审批优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="normal">普通</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="urgent">紧急</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["审批优先级"] && (
            <p className="text-sm text-red-500 mt-1">请选择审批优先级</p>
          )}
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="approvalRequirements" className="flex items-center">
            审批要求
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="approvalRequirements"
            value={formValues.approvalRequirements}
            onChange={(e) => handleChange("approvalRequirements", e.target.value)}
            placeholder="请输入审批要求"
            rows={3}
            className={validationErrors?.["审批要求"] ? "border-red-500" : ""}
          />
          {validationErrors?.["审批要求"] && (
            <p className="text-sm text-red-500 mt-1">请输入审批要求</p>
          )}
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="comments">备注</Label>
          <Textarea
            id="comments"
            value={formValues.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="请输入备注信息"
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
