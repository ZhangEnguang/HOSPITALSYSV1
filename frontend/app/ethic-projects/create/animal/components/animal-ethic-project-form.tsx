"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  UserIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { DatePicker } from "@/components/date-picker"

// 动物伦理项目表单组件
export function AnimalEthicProjectForm() {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    projectNumber: "",
    animalType: "",
    animalCount: "",
    facilityUnit: "",
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    budget: "",
    
    // 主要研究者信息
    leader: "",
    department: "",
    title: "",
    phone: "",
    email: "",
    address: "",
    
    // 研究信息
    researchPurpose: "",
    researchMethod: "",
  })

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理字段失去焦点
  const handleBlur = (field: string) => {
    setFormTouched((prev) => ({
      ...prev,
      [field]: true
    }))
  }

  // 验证表单
  const validateForm = () => {
    const requiredFields = [
      "name", 
      "animalType", 
      "animalCount", 
      "facilityUnit",
      "leader", 
      "department", 
      "email"
    ]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${field === "name" ? "项目名称" : 
                            field === "animalType" ? "动物种类" : 
                            field === "animalCount" ? "动物数量" : 
                            field === "facilityUnit" ? "动物实施设备单位" : 
                            field === "leader" ? "负责人姓名" : 
                            field === "department" ? "所属院系" : 
                            field === "email" ? "电子邮箱" : ""}`
      }
    })
    
    // 验证邮箱格式
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        isValid = false
        newErrors.email = "请输入有效的电子邮箱"
      }
    }
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({
      ...prev,
      ...newTouched
    }))
    
    if (!isValid) {
      // 滚动到第一个错误字段
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    
    return isValid
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("点击保存草稿按钮")
    toast({
      title: "已保存草稿",
      description: "项目信息已保存为草稿"
    })
  }

  // 提交表单
  const handleSubmit = () => {
    console.log("点击确认按钮，开始验证表单")
    try {
      if (!validateForm()) return
      
      // 这里添加提交表单的逻辑
      console.log("提交表单数据:", formData)
      
      // 显示完成对话框
      setShowCompletionDialog(true)
    } catch (error) {
      console.error("表单提交出错:", error)
      toast({
        title: "提交失败",
        description: "表单提交过程中发生错误",
        variant: "destructive"
      })
    }
  }

  // 继续添加
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      // 基本信息
      name: "",
      projectNumber: "",
      animalType: "",
      animalCount: "",
      facilityUnit: "",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      budget: "",
      
      // 主要研究者信息
      leader: "",
      department: "",
      title: "",
      phone: "",
      email: "",
      address: "",
      
      // 研究信息
      researchPurpose: "",
      researchMethod: "",
    })
    
    // 重置错误和触摸状态
    setFormErrors({})
    setFormTouched({})
    
    toast({
      title: "已清空表单",
      description: "可以继续添加新项目"
    })
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/ethic-projects/animal")
  }

  // 自定义表单标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
      </div>
    )
  }
  
  // 错误提示组件
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新增动物伦理项目</h1>
        </div>
      </div>

      {/* 项目基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          {/* 基本信息部分 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">项目名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => updateFormData("name", e.target.value)} 
                onBlur={() => handleBlur("name")}
                placeholder="请输入项目名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.name && formErrors.name ? "border-red-500" : ""
                )}
              />
              {formTouched.name && <ErrorMessage message={formErrors.name || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectNumber" className="text-muted-foreground">项目编号</Label>
              <Input 
                id="projectNumber" 
                value={formData.projectNumber}
                onChange={(e) => updateFormData("projectNumber", e.target.value)} 
                placeholder="系统自动生成或手动输入"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalType" className="text-muted-foreground">动物种类 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.animalType} 
                onValueChange={(value) => updateFormData("animalType", value)}
                onOpenChange={(open) => !open && handleBlur("animalType")}
              >
                <SelectTrigger 
                  id="animalType"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.animalType && formErrors.animalType ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择动物种类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="小鼠">小鼠</SelectItem>
                  <SelectItem value="大鼠">大鼠</SelectItem>
                  <SelectItem value="兔子">兔子</SelectItem>
                  <SelectItem value="犬类">犬类</SelectItem>
                  <SelectItem value="猪">猪</SelectItem>
                  <SelectItem value="猴子">猴子</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.animalType && <ErrorMessage message={formErrors.animalType || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="animalCount" className="text-muted-foreground">动物数量 <span className="text-red-500">*</span></Label>
              <Input 
                id="animalCount" 
                type="number"
                value={formData.animalCount} 
                onChange={(e) => updateFormData("animalCount", e.target.value)}
                onBlur={() => handleBlur("animalCount")}
                placeholder="请输入动物数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.animalCount && formErrors.animalCount ? "border-red-500" : ""
                )}
              />
              {formTouched.animalCount && <ErrorMessage message={formErrors.animalCount || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilityUnit" className="text-muted-foreground">动物实施设备单位 <span className="text-red-500">*</span></Label>
            <Input 
              id="facilityUnit" 
              value={formData.facilityUnit} 
              onChange={(e) => updateFormData("facilityUnit", e.target.value)} 
              onBlur={() => handleBlur("facilityUnit")}
              placeholder="请输入动物实施设备单位"
              className={cn(
                "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                formTouched.facilityUnit && formErrors.facilityUnit ? "border-red-500" : ""
              )}
            />
            {formTouched.facilityUnit && <ErrorMessage message={formErrors.facilityUnit || ""} />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-muted-foreground">开始日期</Label>
              <DatePicker 
                id="startDate"
                date={formData.startDate} 
                onSelect={(date) => date && updateFormData("startDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-muted-foreground">结束日期</Label>
              <DatePicker 
                id="endDate"
                date={formData.endDate} 
                onSelect={(date) => date && updateFormData("endDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-muted-foreground">项目预算</Label>
            <Input 
              id="budget" 
              type="number"
              value={formData.budget} 
              onChange={(e) => updateFormData("budget", e.target.value)} 
              placeholder="请输入项目预算（元）"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            />
          </div>

          {/* 研究信息 */}
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="研究信息" 
          />
          
          <div className="space-y-2">
            <Label htmlFor="researchPurpose" className="text-muted-foreground">研究目的</Label>
            <Textarea 
              id="researchPurpose" 
              value={formData.researchPurpose} 
              onChange={(e) => updateFormData("researchPurpose", e.target.value)} 
              placeholder="请描述研究目的..."
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchMethod" className="text-muted-foreground">研究方法</Label>
            <Textarea 
              id="researchMethod" 
              value={formData.researchMethod} 
              onChange={(e) => updateFormData("researchMethod", e.target.value)} 
              placeholder="请描述研究方法..."
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              rows={3}
            />
          </div>

          {/* 主要研究者信息标题 */}
          <SectionTitle 
            icon={<UserIcon className="h-5 w-5" />} 
            title="主要研究者信息" 
          />
          
          {/* 主要研究者信息部分 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leader" className="text-muted-foreground">负责人姓名 <span className="text-red-500">*</span></Label>
              <Input 
                id="leader" 
                value={formData.leader} 
                onChange={(e) => updateFormData("leader", e.target.value)} 
                onBlur={() => handleBlur("leader")}
                placeholder="请输入负责人姓名"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.leader && formErrors.leader ? "border-red-500" : ""
                )}
              />
              {formTouched.leader && <ErrorMessage message={formErrors.leader || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-muted-foreground">职称/职务</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => updateFormData("title", e.target.value)} 
                placeholder="请输入职称或职务"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-muted-foreground">所属院系 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => updateFormData("department", value)}
                onOpenChange={(open) => !open && handleBlur("department")}
              >
                <SelectTrigger 
                  id="department"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.department && formErrors.department ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择所属院系" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="基础医学院">基础医学院</SelectItem>
                  <SelectItem value="临床医学院">临床医学院</SelectItem>
                  <SelectItem value="公共卫生学院">公共卫生学院</SelectItem>
                  <SelectItem value="药学院">药学院</SelectItem>
                  <SelectItem value="生物医学工程学院">生物医学工程学院</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">电子邮箱 <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => updateFormData("email", e.target.value)} 
                onBlur={() => handleBlur("email")}
                placeholder="请输入电子邮箱"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.email && formErrors.email ? "border-red-500" : ""
                )}
              />
              {formTouched.email && <ErrorMessage message={formErrors.email || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-muted-foreground">联系电话</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => updateFormData("phone", e.target.value)} 
                placeholder="请输入联系电话"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-muted-foreground">通讯地址</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={(e) => updateFormData("address", e.target.value)} 
                placeholder="请输入通讯地址"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 底部操作按钮 */}
      <div className="flex justify-between items-center pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSaveDraft} 
          className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        >
          保存草稿
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReturnToList} 
            className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
          >
            取消
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
          >
            确认
          </Button>
        </div>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border border-[#E9ECF2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              项目创建成功
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              动物伦理项目已成功创建并提交审核。您可以继续添加新项目或返回项目列表。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              className="sm:mr-auto border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" 
              type="button"
              onClick={handleReturnToList}
            >
              返回列表
            </Button>
            <Button 
              type="button"
              onClick={handleContinueAdding}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              继续添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 