"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContractDetailsForm({ data, onUpdate, validationErrors }) {
  const [formValues, setFormValues] = useState({
    partyA: data?.partyA || "",
    partyB: data?.partyB || "",
    signingDate: data?.signingDate || null,
    effectiveDate: data?.effectiveDate || null,
    expirationDate: data?.expirationDate || null,
    contractScope: data?.contractScope || "",
    contractDuration: data?.contractDuration || "", 
    contractLocation: data?.contractLocation || "", 
    contractWitness: data?.contractWitness || "", 
    confidentialityLevel: data?.confidentialityLevel || "", 
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
          <Label htmlFor="partyA" className="flex items-center">
            甲方
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="partyA"
            value={formValues.partyA}
            onChange={(e) => handleChange("partyA", e.target.value)}
            placeholder="请输入甲方名称"
            className={validationErrors?.["甲方"] ? "border-red-500" : ""}
          />
          {validationErrors?.["甲方"] && (
            <p className="text-sm text-red-500 mt-1">请输入甲方名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="partyB" className="flex items-center">
            乙方
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="partyB"
            value={formValues.partyB}
            onChange={(e) => handleChange("partyB", e.target.value)}
            placeholder="请输入乙方名称"
            className={validationErrors?.["乙方"] ? "border-red-500" : ""}
          />
          {validationErrors?.["乙方"] && (
            <p className="text-sm text-red-500 mt-1">请输入乙方名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signingDate" className="flex items-center">
            签订日期
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.signingDate && "text-muted-foreground",
                  validationErrors?.["签订日期"] && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.signingDate ? format(formValues.signingDate, "yyyy-MM-dd") : "请选择签订日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formValues.signingDate}
                onSelect={(date) => handleChange("signingDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors?.["签订日期"] && (
            <p className="text-sm text-red-500 mt-1">请选择签订日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractLocation" className="flex items-center">
            签约地点
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contractLocation"
            value={formValues.contractLocation}
            onChange={(e) => handleChange("contractLocation", e.target.value)}
            placeholder="请输入签约地点"
            className={validationErrors?.["签约地点"] ? "border-red-500" : ""}
          />
          {validationErrors?.["签约地点"] && (
            <p className="text-sm text-red-500 mt-1">请输入签约地点</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractDuration" className="flex items-center">
            合同期限
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contractDuration"
            value={formValues.contractDuration}
            onChange={(e) => handleChange("contractDuration", e.target.value)}
            placeholder="请输入合同期限（如：12个月）"
            className={validationErrors?.["合同期限"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同期限"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同期限</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractWitness" className="flex items-center">
            合同见证人
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contractWitness"
            value={formValues.contractWitness}
            onChange={(e) => handleChange("contractWitness", e.target.value)}
            placeholder="请输入合同见证人"
            className={validationErrors?.["合同见证人"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同见证人"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同见证人</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="effectiveDate">生效日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.effectiveDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.effectiveDate ? format(formValues.effectiveDate, "yyyy-MM-dd") : "请选择生效日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formValues.effectiveDate}
                onSelect={(date) => handleChange("effectiveDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">到期日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.expirationDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.expirationDate ? format(formValues.expirationDate, "yyyy-MM-dd") : "请选择到期日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formValues.expirationDate}
                onSelect={(date) => handleChange("expirationDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confidentialityLevel" className="flex items-center">
            保密级别
          </Label>
          <Select 
            value={formValues.confidentialityLevel} 
            onValueChange={(value) => handleChange("confidentialityLevel", value)}
          >
            <SelectTrigger id="confidentialityLevel">
              <SelectValue placeholder="请选择保密级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">公开</SelectItem>
              <SelectItem value="internal">内部</SelectItem>
              <SelectItem value="confidential">保密</SelectItem>
              <SelectItem value="secret">机密</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="contractScope" className="flex items-center">
            合同范围
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="contractScope"
            value={formValues.contractScope}
            onChange={(e) => handleChange("contractScope", e.target.value)}
            placeholder="请输入合同范围描述"
            rows={4}
            className={validationErrors?.["合同范围"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同范围"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同范围描述</p>
          )}
        </div>
      </div>
    </div>
  )
}
