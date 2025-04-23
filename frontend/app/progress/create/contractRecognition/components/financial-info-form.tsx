"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function FinancialInfoForm({ data, onUpdate, validationErrors }) {
  const [formValues, setFormValues] = useState({
    contractAmount: data?.contractAmount || "",
    paymentMethod: data?.paymentMethod || "",
    paymentSchedule: data?.paymentSchedule || "",
    currency: data?.currency || "",
    taxRate: data?.taxRate || "",
    invoiceType: data?.invoiceType || "", 
    paymentDeadline: data?.paymentDeadline || null, 
    penaltyClause: data?.penaltyClause || "", 
    financialContact: data?.financialContact || "", 
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 合同金额 */}
        <div className="space-y-2">
          <Label htmlFor="contractAmount" className="flex items-center">
            合同金额
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contractAmount"
            placeholder="请输入合同金额"
            value={formValues.contractAmount}
            onChange={(e) => handleChange("contractAmount", e.target.value)}
            className={validationErrors?.["合同金额"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同金额"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同金额</p>
          )}
        </div>

        {/* 币种 */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="flex items-center">
            币种
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.currency} 
            onValueChange={(value) => handleChange("currency", value)}
          >
            <SelectTrigger 
              id="currency"
              className={validationErrors?.["币种"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择币种" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CNY">人民币 (CNY)</SelectItem>
              <SelectItem value="USD">美元 (USD)</SelectItem>
              <SelectItem value="EUR">欧元 (EUR)</SelectItem>
              <SelectItem value="GBP">英镑 (GBP)</SelectItem>
              <SelectItem value="JPY">日元 (JPY)</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["币种"] && (
            <p className="text-sm text-red-500 mt-1">请选择币种</p>
          )}
        </div>

        {/* 支付方式 */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod" className="flex items-center">
            支付方式
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.paymentMethod} 
            onValueChange={(value) => handleChange("paymentMethod", value)}
          >
            <SelectTrigger 
              id="paymentMethod"
              className={validationErrors?.["支付方式"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择支付方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onetime">一次性付款</SelectItem>
              <SelectItem value="installment">分期付款</SelectItem>
              <SelectItem value="milestone">里程碑付款</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["支付方式"] && (
            <p className="text-sm text-red-500 mt-1">请选择支付方式</p>
          )}
        </div>

        {/* 发票类型 */}
        <div className="space-y-2">
          <Label htmlFor="invoiceType" className="flex items-center">
            发票类型
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.invoiceType} 
            onValueChange={(value) => handleChange("invoiceType", value)}
          >
            <SelectTrigger 
              id="invoiceType"
              className={validationErrors?.["发票类型"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择发票类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vat">增值税专用发票</SelectItem>
              <SelectItem value="general">增值税普通发票</SelectItem>
              <SelectItem value="electronic">电子发票</SelectItem>
              <SelectItem value="none">无需发票</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["发票类型"] && (
            <p className="text-sm text-red-500 mt-1">请选择发票类型</p>
          )}
        </div>

        {/* 付款截止日期 */}
        <div className="space-y-2">
          <Label htmlFor="paymentDeadline" className="flex items-center">
            付款截止日期
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.paymentDeadline && "text-muted-foreground",
                  validationErrors?.["付款截止日期"] && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.paymentDeadline ? format(formValues.paymentDeadline, "yyyy-MM-dd") : "请选择付款截止日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formValues.paymentDeadline}
                onSelect={(date) => handleChange("paymentDeadline", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors?.["付款截止日期"] && (
            <p className="text-sm text-red-500 mt-1">请选择付款截止日期</p>
          )}
        </div>

        {/* 财务联系人 */}
        <div className="space-y-2">
          <Label htmlFor="financialContact" className="flex items-center">
            财务联系人
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="financialContact"
            placeholder="请输入财务联系人"
            value={formValues.financialContact}
            onChange={(e) => handleChange("financialContact", e.target.value)}
            className={validationErrors?.["财务联系人"] ? "border-red-500" : ""}
          />
          {validationErrors?.["财务联系人"] && (
            <p className="text-sm text-red-500 mt-1">请输入财务联系人</p>
          )}
        </div>

        {/* 税率 */}
        <div className="space-y-2">
          <Label htmlFor="taxRate" className="flex items-center">
            税率
          </Label>
          <Select value={formValues.taxRate} onValueChange={(value) => handleChange("taxRate", value)}>
            <SelectTrigger id="taxRate">
              <SelectValue placeholder="请选择税率" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0%</SelectItem>
              <SelectItem value="3">3%</SelectItem>
              <SelectItem value="6">6%</SelectItem>
              <SelectItem value="9">9%</SelectItem>
              <SelectItem value="13">13%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 违约金条款 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="penaltyClause" className="flex items-center">
            违约金条款
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="penaltyClause"
            placeholder="请输入违约金条款"
            value={formValues.penaltyClause}
            onChange={(e) => handleChange("penaltyClause", e.target.value)}
            rows={3}
            className={validationErrors?.["违约金条款"] ? "border-red-500" : ""}
          />
          {validationErrors?.["违约金条款"] && (
            <p className="text-sm text-red-500 mt-1">请输入违约金条款</p>
          )}
        </div>

        {/* 支付计划 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="paymentSchedule" className="flex items-center">
            支付计划
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="paymentSchedule"
            placeholder="请输入支付计划描述"
            value={formValues.paymentSchedule}
            onChange={(e) => handleChange("paymentSchedule", e.target.value)}
            rows={4}
            className={validationErrors?.["支付计划"] ? "border-red-500" : ""}
          />
          {validationErrors?.["支付计划"] && (
            <p className="text-sm text-red-500 mt-1">请输入支付计划描述</p>
          )}
        </div>
      </div>
    </div>
  )
}
