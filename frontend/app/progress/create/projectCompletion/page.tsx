"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, InfoIcon, Save, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { motion } from "framer-motion"
import { StepNavigation, STEPS } from "./components/step-navigation"

export default function ProjectCompletionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    // 基本信息
    projectName: "",
    projectCode: "",
    projectType: "",
    projectManager: "",
    department: "",

    // 结项详情
    completionDate: "",
    completionRate: "",
    completionStatus: "",
    completionDescription: "",

    // 成果信息
    achievements: "",
    patents: "",
    papers: "",
    products: "",

    // 验收信息
    acceptanceResult: "",
    acceptanceDate: "",
    acceptanceComments: "",
    acceptanceAttachments: "",

    // 备注
    remarks: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, value: Date | undefined) => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        [name]: format(value, "yyyy-MM-dd"),
      }))
    }
  }

  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {}
    
    if (currentStep === 0) {
      // 基本信息验证
      if (!formData.projectName) errors.projectName = true
      if (!formData.projectCode) errors.projectCode = true
      if (!formData.projectType) errors.projectType = true
      if (!formData.projectManager) errors.projectManager = true
      if (!formData.department) errors.department = true
    } 
    else if (currentStep === 1) {
      // 结项详情验证
      if (!formData.completionDate) errors.completionDate = true
      if (!formData.completionRate) errors.completionRate = true
      if (!formData.completionStatus) errors.completionStatus = true
      if (!formData.completionDescription) errors.completionDescription = true
    }
    else if (currentStep === 2) {
      // 成果信息验证
      if (!formData.achievements) errors.achievements = true
    }
    else if (currentStep === 3) {
      // 验收信息验证
      if (!formData.acceptanceResult) errors.acceptanceResult = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // 验证当前步骤
      if (validateCurrentStep()) {
        // 标记当前步骤为已完成
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
        setCurrentStep(currentStep + 1)
      } else {
        // 显示验证错误提示
        toast({
          title: "请填写必填项",
          description: "请确保所有必填字段都已填写。",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "您的项目结项信息已保存为草稿",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    toast({
      title: "提交成功",
      description: "项目结项信息已成功提交",
    })
    router.push("/progress")
  }

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    // 只允许跳转到已完成的步骤或当前步骤的下一步
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">项目名称 *</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  placeholder="请输入项目名称"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  className={cn(validationErrors.projectName && "border-destructive")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectCode">项目编号 *</Label>
                <Input
                  id="projectCode"
                  name="projectCode"
                  placeholder="请输入项目编号"
                  value={formData.projectCode}
                  onChange={handleChange}
                  required
                  className={cn(validationErrors.projectCode && "border-destructive")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">项目类型 *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("projectType", value)}
                  value={formData.projectType}
                >
                  <SelectTrigger className={cn(validationErrors.projectType && "border-destructive")}>
                    <SelectValue placeholder="请选择项目类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="科研项目">科研项目</SelectItem>
                    <SelectItem value="教学项目">教学项目</SelectItem>
                    <SelectItem value="合作项目">合作项目</SelectItem>
                    <SelectItem value="其他项目">其他项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectManager">项目负责人 *</Label>
                <Input
                  id="projectManager"
                  name="projectManager"
                  placeholder="请输入项目负责人"
                  value={formData.projectManager}
                  onChange={handleChange}
                  required
                  className={cn(validationErrors.projectManager && "border-destructive")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">所属部门 *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("department", value)}
                  value={formData.department}
                >
                  <SelectTrigger className={cn(validationErrors.department && "border-destructive")}>
                    <SelectValue placeholder="请选择所属部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="计算机学院">计算机学院</SelectItem>
                    <SelectItem value="电子工程学院">电子工程学院</SelectItem>
                    <SelectItem value="机械工程学院">机械工程学院</SelectItem>
                    <SelectItem value="管理学院">管理学院</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="completionDate">结项日期 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal", 
                        !formData.completionDate && "text-muted-foreground",
                        validationErrors.completionDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.completionDate ? formData.completionDate : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate)
                        handleDateChange("completionDate", newDate)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionRate">完成率 (%) *</Label>
                <Input
                  id="completionRate"
                  name="completionRate"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="请输入完成率"
                  value={formData.completionRate}
                  onChange={handleChange}
                  required
                  className={cn(validationErrors.completionRate && "border-destructive")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionStatus">结项状态 *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("completionStatus", value)}
                  value={formData.completionStatus}
                >
                  <SelectTrigger className={cn(validationErrors.completionStatus && "border-destructive")}>
                    <SelectValue placeholder="请选择结项状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="按期结项">按期结项</SelectItem>
                    <SelectItem value="提前结项">提前结项</SelectItem>
                    <SelectItem value="延期结项">延期结项</SelectItem>
                    <SelectItem value="部分结项">部分结项</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="completionDescription">结项说明 *</Label>
              <Textarea
                id="completionDescription"
                name="completionDescription"
                placeholder="请输入结项说明"
                rows={4}
                value={formData.completionDescription}
                onChange={handleChange}
                required
                className={cn(validationErrors.completionDescription && "border-destructive")}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="achievements">主要成果 *</Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  placeholder="请描述项目主要成果"
                  rows={3}
                  value={formData.achievements}
                  onChange={handleChange}
                  required
                  className={cn(validationErrors.achievements && "border-destructive")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patents">专利情况</Label>
                <Textarea
                  id="patents"
                  name="patents"
                  placeholder="请描述专利申请/授权情况"
                  rows={2}
                  value={formData.patents}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="papers">论文发表</Label>
                <Textarea
                  id="papers"
                  name="papers"
                  placeholder="请描述论文发表情况"
                  rows={2}
                  value={formData.papers}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">产品/软件</Label>
                <Textarea
                  id="products"
                  name="products"
                  placeholder="请描述产品或软件开发情况"
                  rows={2}
                  value={formData.products}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="acceptanceResult">验收结果 *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("acceptanceResult", value)}
                  value={formData.acceptanceResult}
                >
                  <SelectTrigger className={cn(validationErrors.acceptanceResult && "border-destructive")}>
                    <SelectValue placeholder="请选择验收结果" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="通过">通过</SelectItem>
                    <SelectItem value="有条件通过">有条件通过</SelectItem>
                    <SelectItem value="不通过">不通过</SelectItem>
                    <SelectItem value="待验收">待验收</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acceptanceDate">验收日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.acceptanceDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.acceptanceDate ? formData.acceptanceDate : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.acceptanceDate ? new Date(formData.acceptanceDate) : undefined}
                      onSelect={(newDate) => handleDateChange("acceptanceDate", newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="acceptanceComments">验收意见</Label>
              <Textarea
                id="acceptanceComments"
                name="acceptanceComments"
                placeholder="请输入验收意见"
                rows={3}
                value={formData.acceptanceComments}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="acceptanceAttachments">验收附件</Label>
              <Input
                id="acceptanceAttachments"
                name="acceptanceAttachments"
                type="file"
                className="cursor-pointer"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="bg-muted/30 p-4 rounded-md mb-6">
              <h4 className="font-medium mb-4">项目结项信息确认</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                <div>
                  <span className="text-muted-foreground">项目名称：</span>
                  <span>{formData.projectName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目编号：</span>
                  <span>{formData.projectCode}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目类型：</span>
                  <span>{formData.projectType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目负责人：</span>
                  <span>{formData.projectManager}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">所属部门：</span>
                  <span>{formData.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">结项日期：</span>
                  <span>{formData.completionDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">完成率：</span>
                  <span>{formData.completionRate}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">结项状态：</span>
                  <span>{formData.completionStatus}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">验收结果：</span>
                  <span>{formData.acceptanceResult}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="remarks">备注</Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  placeholder="请输入备注信息"
                  rows={3}
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/progress" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新增项目结项</h1>
      </div>

      <div className="mx-8 mb-6">
        <Card className="border-muted/50">
          <CardContent className="p-6">
            <StepNavigation
              currentStep={currentStep}
              goToStep={goToStep}
              validationErrors={validationErrors}
              completedSteps={completedSteps}
            />
          </CardContent>
        </Card>
      </div>

      <motion.div 
        className="mx-8 mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <Card className="border-muted/50 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md mb-4">
              <div className="text-primary">
                <InfoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">{STEPS[currentStep].name}</h3>
            </div>
            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-muted/30 py-4">
            <Button type="button" variant="outline" onClick={handleSaveDraft} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存草稿
            </Button>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  上一步
                </Button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext} className="flex items-center gap-1">
                  下一步
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} className="flex items-center gap-1">
                  提交
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
