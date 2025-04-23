"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Search, FileText, Info as InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { initialProjects } from "@/app/projects/data/project-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BasicInfoFormProps {
  data: any
  onUpdate: (data: any) => void
  validationErrors: Record<string, boolean>
}

export default function BasicInfoForm({ data, onUpdate, validationErrors }: BasicInfoFormProps) {
  const [formValues, setFormValues] = useState({
    projectId: data?.projectId || "",
    projectName: data?.projectName || "",
    contractTitle: data?.contractTitle || "",
    supplierContact: data?.supplierContact || "",
    supplierPhone: data?.supplierPhone || "",
    department: data?.department || "",
    paymentMethod: data?.paymentMethod || "",
    contractAmount: data?.contractAmount || "",
    startDate: data?.startDate || null,
    endDate: data?.endDate || null,
    signDate: data?.signDate || null,
    contractStatus: data?.contractStatus || "processing",
    buyerSatisfaction: data?.buyerSatisfaction || "no",
    supplierSatisfaction: data?.supplierSatisfaction || "no",
    contractReceived: data?.contractReceived || "no",
    contractFile: data?.contractFile || "",
    originalContractFile: data?.originalContractFile || "",
  })

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // 过滤项目列表
  const filteredProjects = initialProjects.filter((project) => 
    project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.projectNumber.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Only update parent when form values actually change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    onUpdate(formValues)
  }, [formValues, onUpdate])

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDate = (date: Date | null) => {
    return date ? format(date, "yyyy-MM-dd") : ""
  }

  const handleSelectProject = (project: any) => {
    setFormValues((prev) => ({
      ...prev,
      projectId: project.projectNumber,
      projectName: project.name,
    }))
    setOpen(false)
  }

  const handleFileUpload = (field: string) => {
    // 模拟文件上传
    handleChange(field, `file_${Math.floor(Math.random() * 10000)}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">原项目信息</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="projectId">项目编号</Label>
          <Input
            id="projectId"
            value={formValues.projectId}
            onChange={(e) => handleChange("projectId", e.target.value)}
            placeholder="请输入项目编号"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectName" className="flex items-center">
            项目名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between",
                  validationErrors?.["项目名称"] && "border-destructive"
                )}
              >
                {formValues.projectName || "请选择项目"}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput 
                  placeholder="搜索项目..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>未找到相关项目</CommandEmpty>
                  <CommandGroup>
                    {filteredProjects.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={project.name}
                        onSelect={() => handleSelectProject(project)}
                      >
                        <div className="flex flex-col">
                          <span>{project.name}</span>
                          <span className="text-xs text-muted-foreground">{project.projectNumber}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {validationErrors?.["项目名称"] && (
            <p className="text-xs text-destructive mt-1">请选择项目名称</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">基本信息</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contractTitle" className="flex items-center">
            合同名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="contractTitle"
            value={formValues.contractTitle}
            onChange={(e) => handleChange("contractTitle", e.target.value)}
            placeholder="请输入合同名称"
            className={cn(
              validationErrors?.["合同标题"] && "border-destructive"
            )}
          />
          {validationErrors?.["合同标题"] && (
            <p className="text-xs text-destructive mt-1">请输入合同名称</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplierContact" className="flex items-center">
            负责人电话 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="supplierPhone"
            value={formValues.supplierPhone}
            onChange={(e) => handleChange("supplierPhone", e.target.value)}
            placeholder="请输入负责人电话"
            className={cn(
              validationErrors?.["负责人电话"] && "border-destructive"
            )}
          />
          {validationErrors?.["负责人电话"] && (
            <p className="text-xs text-destructive mt-1">请输入负责人电话</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department" className="flex items-center">
            所属单位 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formValues.department} 
            onValueChange={(value) => handleChange("department", value)}
          >
            <SelectTrigger 
              id="department"
              className={cn(
                validationErrors?.["所属部门"] && "border-destructive"
              )}
            >
              <SelectValue placeholder="请选择所属单位" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="天文系">天文系</SelectItem>
              <SelectItem value="物理系">物理系</SelectItem>
              <SelectItem value="化学系">化学系</SelectItem>
              <SelectItem value="生物系">生物系</SelectItem>
              <SelectItem value="计算机系">计算机系</SelectItem>
              <SelectItem value="地球科学系">地球科学系</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["所属部门"] && (
            <p className="text-xs text-destructive mt-1">请选择所属单位</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractAmount" className="flex items-center">
            合同金额(万元) <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="contractAmount"
              type="number"
              value={formValues.contractAmount}
              onChange={(e) => handleChange("contractAmount", e.target.value)}
              placeholder="请输入合同金额"
              className={cn(
                validationErrors?.["合同金额"] && "border-destructive",
                "pr-12"
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-gray-500">万元</span>
            </div>
          </div>
          {validationErrors?.["合同金额"] && (
            <p className="text-xs text-destructive mt-1">请输入合同金额</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentMethod" className="flex items-center">
            支付方式 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formValues.paymentMethod} 
            onValueChange={(value) => handleChange("paymentMethod", value)}
          >
            <SelectTrigger 
              id="paymentMethod"
              className={cn(
                validationErrors?.["支付方式"] && "border-destructive"
              )}
            >
              <SelectValue placeholder="请选择支付方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="一次性付款">一次性付款</SelectItem>
              <SelectItem value="分期付款">分期付款</SelectItem>
              <SelectItem value="里程碑付款">里程碑付款</SelectItem>
              <SelectItem value="预付款+尾款">预付款+尾款</SelectItem>
              <SelectItem value="其他">其他</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["支付方式"] && (
            <p className="text-xs text-destructive mt-1">请选择支付方式</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signDate" className="flex items-center">
            签订日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.signDate && "text-muted-foreground",
                  validationErrors?.["签订日期"] && "border-destructive"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formValues.signDate ? formatDate(formValues.signDate) : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formValues.signDate}
                onSelect={(date) => handleChange("signDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors?.["签订日期"] && (
            <p className="text-xs text-destructive mt-1">请选择签订日期</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startDate" className="flex items-center">
            开始日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.startDate && "text-muted-foreground",
                  validationErrors?.["开始日期"] && "border-destructive"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formValues.startDate ? formatDate(formValues.startDate) : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formValues.startDate}
                onSelect={(date) => handleChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors?.["开始日期"] && (
            <p className="text-xs text-destructive mt-1">请选择开始日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="flex items-center">
            结束日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.endDate && "text-muted-foreground",
                  validationErrors?.["结束日期"] && "border-destructive"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formValues.endDate ? formatDate(formValues.endDate) : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formValues.endDate}
                onSelect={(date) => handleChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors?.["结束日期"] && (
            <p className="text-xs text-destructive mt-1">请选择结束日期</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractStatus" className="flex items-center">
            合同状态 <span className="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            value={formValues.contractStatus}
            onValueChange={(value) => handleChange("contractStatus", value)}
            className="flex flex-wrap gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="processing" id="processing" />
              <Label htmlFor="processing" className="font-normal">进行中</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="font-normal">完成</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="terminated" id="terminated" />
              <Label htmlFor="terminated" className="font-normal">暂停</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cancelled" id="cancelled" />
              <Label htmlFor="cancelled" className="font-normal">取消</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="buyerSatisfaction" className="flex items-center">
            甲方满意度调查 <span className="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            value={formValues.buyerSatisfaction}
            onValueChange={(value) => handleChange("buyerSatisfaction", value)}
            className="flex space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="buyer-yes" />
              <Label htmlFor="buyer-yes" className="font-normal">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="buyer-no" />
              <Label htmlFor="buyer-no" className="font-normal">否</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplierSatisfaction" className="flex items-center">
            供方满意度调查 <span className="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            value={formValues.supplierSatisfaction}
            onValueChange={(value) => handleChange("supplierSatisfaction", value)}
            className="flex space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="supplier-yes" />
              <Label htmlFor="supplier-yes" className="font-normal">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="supplier-no" />
              <Label htmlFor="supplier-no" className="font-normal">否</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractReceived" className="flex items-center">
            合同是否回收 <span className="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            value={formValues.contractReceived}
            onValueChange={(value) => handleChange("contractReceived", value)}
            className="flex space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="received-yes" />
              <Label htmlFor="received-yes" className="font-normal">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="received-no" />
              <Label htmlFor="received-no" className="font-normal">否</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractFile" className="flex items-center">
            合同电子版 <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="contractFile"
              value={formValues.contractFile}
              readOnly
              placeholder="请上传合同电子版"
              className={cn(
                "flex-1",
                validationErrors?.["合同电子版"] && "border-destructive"
              )}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleFileUpload("contractFile")}
              className="flex items-center gap-2"
            >
              附件上传
            </Button>
          </div>
          {validationErrors?.["合同电子版"] && (
            <p className="text-xs text-destructive mt-1">请上传合同电子版</p>
          )}
          {formValues.contractFile && (
            <p className="text-xs text-muted-foreground mt-1">已上传: {formValues.contractFile}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">最多可上传10个附件,每个附件大小不超过20M</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="originalContractFile">盖章页电子版</Label>
          <div className="flex items-center gap-4">
            <Input
              id="originalContractFile"
              value={formValues.originalContractFile}
              readOnly
              placeholder="请上传盖章页电子版"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleFileUpload("originalContractFile")}
              className="flex items-center gap-2"
            >
              附件上传
            </Button>
          </div>
          {formValues.originalContractFile && (
            <p className="text-xs text-muted-foreground mt-1">已上传: {formValues.originalContractFile}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">最多可上传10个附件,每个附件大小不超过20M</p>
        </div>
      </div>
    </div>
  )
} 