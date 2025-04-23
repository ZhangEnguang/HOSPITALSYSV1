"use client"

import React, { useState, useEffect, Suspense } from "react"
import type { ChangeEvent } from "react"

import { useRouter, useSearchParams } from "next/navigation"
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
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion } from "framer-motion"
import { StepNavigation, STEPS } from "../../create/projectCompletion/components/step-navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 演示数据 - 项目结项数据
const demoCompletionData = {
  // 基本信息
  projectName: "新能源汽车动力电池回收利用技术研究",
  projectCode: "XNY-2023-005",
  projectType: "横向项目",
  projectManager: "赵教授",
  department: "新能源研究院",

  // 结项详情
  completionDate: "2024-02-03",
  completionStatus: "已完成",
  completionRate: "100",
  completionDescription: "项目按计划完成所有研究内容，成功开发了动力电池回收利用的全套技术流程，包括电池拆解、材料分选、再生工艺等核心技术，并通过了企业方的验收测试。",

  // 成果信息
  achievements: "1. 开发了一套高效低成本的动力电池拆解技术，提高拆解效率50%\n2. 设计了正极材料再生新工艺，回收率达95%以上\n3. 建立了电池材料快速分选系统，纯度达99.5%\n4. 完成了中试生产线建设，日处理量可达500kg",
  patents: "1. 一种动力电池自动化拆解装置（发明专利，已授权）\n2. 锂电池正极材料回收再生方法（发明专利，已授权）\n3. 废旧电池材料分选系统（实用新型专利，已授权）\n4. 电池回收全过程管理系统（软件著作权，已登记）",
  papers: "1. Li-ion Battery Recycling: From Waste to Wealth（SCI一区论文，已发表）\n2. 动力电池回收技术进展（中文核心期刊，已发表）\n3. 电池材料再生工艺优化研究（EI收录会议论文，已发表）",
  products: "1. 动力电池拆解一体化设备（已投产）\n2. 电池材料分选系统V2.0（已交付使用）\n3. 电池回收管理软件平台（已上线运行）",

  // 验收信息
  acceptanceResult: "优秀",
  acceptanceDate: "2024-02-15",
  acceptanceComments: "项目完成情况优秀，各项指标全部达到或超过预期目标。研发团队工作积极主动，技术成果实用性强，具有良好的应用前景和经济效益。建议继续深入研究，拓展更多应用场景。",
  acceptanceAttachments: "验收报告.pdf, 测试数据.xlsx, 现场照片.zip, 视频演示.mp4",

  // 备注
  remarks: "本项目获得企业方高度评价，已签订后续技术合作协议，计划在全国范围内推广应用。团队多名成员获得企业技术创新奖励。",
};

// 定义接口类型
interface CompletionFormData {
  projectName: string;
  projectCode: string;
  projectType: string;
  projectManager: string;
  department: string;
  completionDate: string;
  completionStatus: string;
  completionRate: string;
  completionDescription: string;
  achievements: string;
  patents: string;
  papers: string;
  products: string;
  acceptanceResult: string;
  acceptanceDate: string;
  acceptanceComments: string;
  acceptanceAttachments: string;
  remarks: string;
}

// 内容组件
function ProjectCompletionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const completionId = searchParams ? searchParams.get('id') : null
  
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3])
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<CompletionFormData>(demoCompletionData as CompletionFormData)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      // 假设这里是从API获取数据
      // 但我们直接使用演示数据
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [completionId])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    console.log("保存结项数据", formData);
    toast({
      title: "保存成功",
      description: "您的项目结项信息已成功保存",
    })
    setTimeout(() => {
      router.push("/progress")
    }, 1000)
  }

  const handleSubmit = () => {
    console.log("提交结项数据", formData);
    setShowSuccessDialog(true)
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
                <Label htmlFor="projectName">项目名称 <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="projectCode">项目编号 <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="projectType">项目类型 <span className="text-destructive">*</span></Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("projectType", value)}
                  value={formData.projectType}
                >
                  <SelectTrigger className={cn(validationErrors.projectType && "border-destructive")}>
                    <SelectValue placeholder="请选择项目类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="纵向项目">纵向项目</SelectItem>
                    <SelectItem value="横向项目">横向项目</SelectItem>
                    <SelectItem value="校企合作">校企合作</SelectItem>
                    <SelectItem value="国际合作">国际合作</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectManager">项目负责人 <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="department">所属部门 <span className="text-destructive">*</span></Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="请输入所属部门"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className={cn(validationErrors.department && "border-destructive")}
                />
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="completionDate">结项日期 <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.completionDate && "text-muted-foreground",
                        validationErrors.completionDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.completionDate ? format(new Date(formData.completionDate), "yyyy-MM-dd") : "请选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      onSelect={(date) => handleDateChange("completionDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionStatus">结项状态 <span className="text-destructive">*</span></Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("completionStatus", value)}
                  value={formData.completionStatus}
                >
                  <SelectTrigger className={cn(validationErrors.completionStatus && "border-destructive")}>
                    <SelectValue placeholder="请选择结项状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="部分完成">部分完成</SelectItem>
                    <SelectItem value="延期完成">延期完成</SelectItem>
                    <SelectItem value="未完成">未完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionRate">完成率(%) <span className="text-destructive">*</span></Label>
                <Input
                  id="completionRate"
                  name="completionRate"
                  placeholder="请输入完成率"
                  value={formData.completionRate}
                  onChange={handleChange}
                  required
                  type="number"
                  min="0"
                  max="100"
                  className={cn(validationErrors.completionRate && "border-destructive")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="completionDescription">结项说明 <span className="text-destructive">*</span></Label>
                <Textarea
                  id="completionDescription"
                  name="completionDescription"
                  placeholder="请输入结项说明"
                  value={formData.completionDescription}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={cn(validationErrors.completionDescription && "border-destructive")}
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="achievements">主要成果 <span className="text-destructive">*</span></Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  placeholder="请输入项目主要成果"
                  value={formData.achievements}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={cn(validationErrors.achievements && "border-destructive")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patents">知识产权</Label>
                <Textarea
                  id="patents"
                  name="patents"
                  placeholder="请输入知识产权信息（专利、软著等）"
                  value={formData.patents}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="papers">发表论文</Label>
                <Textarea
                  id="papers"
                  name="papers"
                  placeholder="请输入发表论文情况"
                  value={formData.papers}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">产品/系统</Label>
                <Textarea
                  id="products"
                  name="products"
                  placeholder="请输入产品或系统开发情况"
                  value={formData.products}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="acceptanceResult">验收结果 <span className="text-destructive">*</span></Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("acceptanceResult", value)}
                  value={formData.acceptanceResult}
                >
                  <SelectTrigger className={cn(validationErrors.acceptanceResult && "border-destructive")}>
                    <SelectValue placeholder="请选择验收结果" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="优秀">优秀</SelectItem>
                    <SelectItem value="良好">良好</SelectItem>
                    <SelectItem value="合格">合格</SelectItem>
                    <SelectItem value="待整改">待整改</SelectItem>
                    <SelectItem value="不合格">不合格</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acceptanceDate">验收日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.acceptanceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.acceptanceDate ? format(new Date(formData.acceptanceDate), "yyyy-MM-dd") : "请选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      onSelect={(date) => handleDateChange("acceptanceDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="acceptanceComments">验收意见</Label>
                <Textarea
                  id="acceptanceComments"
                  name="acceptanceComments"
                  placeholder="请输入验收意见"
                  value={formData.acceptanceComments}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="acceptanceAttachments">验收附件</Label>
                <Input
                  id="acceptanceAttachments"
                  name="acceptanceAttachments"
                  placeholder="请输入验收附件清单"
                  value={formData.acceptanceAttachments}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">备注</Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  placeholder="请输入备注信息"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="py-10 text-center">
            <div className="mx-auto mb-8 max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">项目结项信息编辑完成</h3>
              <p className="text-muted-foreground">
                您已完成"{formData.projectName}"的项目结项信息编辑。点击下方"保存更新"按钮完成提交。
              </p>
            </div>

            <div className="border rounded-lg p-6 mb-6 max-w-4xl mx-auto">
              <h4 className="font-semibold text-lg mb-4 text-left">项目信息概览</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-muted-foreground">项目名称：</span>
                  <span className="font-medium">{formData.projectName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目编号：</span>
                  <span className="font-medium">{formData.projectCode}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目类型：</span>
                  <span className="font-medium">{formData.projectType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目负责人：</span>
                  <span className="font-medium">{formData.projectManager}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">完成状态：</span>
                  <span className="font-medium">{formData.completionStatus}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">完成率：</span>
                  <span className="font-medium">{formData.completionRate}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">验收结果：</span>
                  <span className="font-medium">{formData.acceptanceResult}</span>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }
  
  if (isLoading) {
    return (
      <div className="w-full py-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-t-2 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center px-8 mb-6">
        <Link href="/progress" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">编辑项目结项</h1>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <StepNavigation 
              currentStep={currentStep} 
              completedSteps={completedSteps} 
              goToStep={goToStep}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="bg-muted/40 p-4 rounded-md mb-6 flex items-center">
              <InfoIcon className="h-5 w-5 text-muted-foreground mr-2" />
              <span>{STEPS[currentStep].name}</span>
            </div>

            {renderStepContent()}
          </CardContent>

          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  保存更新
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              更新成功
            </DialogTitle>
            <DialogDescription>
              项目结项信息已成功更新，您可以返回列表查看或继续编辑。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button variant="default" onClick={() => router.push("/progress")}>
              返回列表
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
              }}
            >
              继续编辑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 导出使用Suspense包装的页面组件
export default function EditProjectCompletionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>加载中...</p></div>}>
      <ProjectCompletionContent />
    </Suspense>
  )
} 