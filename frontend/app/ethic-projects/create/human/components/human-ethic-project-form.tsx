"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  CheckCircle2, 
  Save, 
  Info as InfoIcon, 
  User as UserIcon,
  FileText as FileTextIcon,
  AlertCircle
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export function HumanEthicProjectForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 表单数据
  const [formData, setFormData] = useState({
    // 基本信息
    projectNumber: "",
    name: "",
    projectType: "",
    projectSource: "",
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    budget: "",
    participantCount: "",
    researchPurpose: "",
    researchMethod: "",
    inclusionCriteria: "",
    exclusionCriteria: "",
    dataProtection: "",
    
    // 主要研究者信息
    leader: "",
    department: "",
    title: "",
    phone: "",
    email: "",
    address: "",
    implementationUnit: "",
  })

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 标记字段为已触摸
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }))
    
    // 如果字段有错误，重新验证
    if (formErrors[field]) {
      validateField(field, value)
    }
  }
  
  // 验证单个字段
  const validateField = (field: string, value: any = undefined) => {
    const fieldValue = value !== undefined ? value : formData[field as keyof typeof formData]
    const errors: Record<string, string> = { ...formErrors }
    
    // 必填字段验证
    const requiredFields: Record<string, string> = {
      name: "请输入项目名称",
      projectType: "请选择项目类型",
      projectSource: "请选择项目来源",
      leader: "请输入负责人姓名",
      department: "请输入所属院系",
      email: "请输入电子邮箱"
    }
    
    if (field in requiredFields && !fieldValue) {
      errors[field] = requiredFields[field]
    } else {
      // 邮箱格式验证
      if (field === "email" && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(fieldValue)) {
          errors[field] = "请输入有效的电子邮箱"
        } else {
          delete errors[field]
        }
      } else {
        delete errors[field]
      }
    }
    
    setFormErrors(errors)
    return !errors[field]
  }
  
  // 处理字段失焦事件
  const handleBlur = (field: string) => {
    // 标记字段为已触摸
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }))
    
    // 验证字段
    validateField(field)
  }

  // 验证表单
  const validateForm = () => {
    const requiredFields = [
      "name", 
      "projectType", 
      "projectSource", 
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
                            field === "projectType" ? "项目类型" : 
                            field === "projectSource" ? "项目来源" : 
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
      projectNumber: "",
      name: "",
      projectType: "",
      projectSource: "",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      budget: "",
      participantCount: "",
      researchPurpose: "",
      researchMethod: "",
      inclusionCriteria: "",
      exclusionCriteria: "",
      dataProtection: "",
      
      // 主要研究者信息
      leader: "",
      department: "",
      title: "",
      phone: "",
      email: "",
      address: "",
      implementationUnit: "",
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
    router.push("/ethic-projects/human")
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
          <h1 className="text-2xl font-bold">新增人体伦理项目</h1>
        </div>
      </div>

      {/* 项目基本信息 */}
      <Card className="border border-[#E9ECF2] rounded-lg transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
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
              <Label htmlFor="projectType" className="text-muted-foreground">项目类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.projectType} 
                onValueChange={(value) => updateFormData("projectType", value)}
                onOpenChange={(open) => !open && handleBlur("projectType")}
              >
                <SelectTrigger 
                  id="projectType"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.projectType && formErrors.projectType ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择项目类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="临床研究">临床研究</SelectItem>
                  <SelectItem value="社会调查">社会调查</SelectItem>
                  <SelectItem value="干预性研究">干预性研究</SelectItem>
                  <SelectItem value="观察性研究">观察性研究</SelectItem>
                  <SelectItem value="心理学研究">心理学研究</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.projectType && <ErrorMessage message={formErrors.projectType || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectSource" className="text-muted-foreground">项目来源 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.projectSource} 
                onValueChange={(value) => updateFormData("projectSource", value)}
                onOpenChange={(open) => !open && handleBlur("projectSource")}
              >
                <SelectTrigger 
                  id="projectSource"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.projectSource && formErrors.projectSource ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择项目来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="院内立项">院内立项</SelectItem>
                  <SelectItem value="国家自然科学基金">国家自然科学基金</SelectItem>
                  <SelectItem value="医学发展基金">医学发展基金</SelectItem>
                  <SelectItem value="卫健委项目">卫健委项目</SelectItem>
                  <SelectItem value="产学研合作">产学研合作</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.projectSource && <ErrorMessage message={formErrors.projectSource || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">开始日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : <span>请选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => updateFormData("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">结束日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : <span>请选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => updateFormData("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="participantCount" className="text-muted-foreground">参与者数量</Label>
              <Input 
                id="participantCount" 
                type="number"
                value={formData.participantCount} 
                onChange={(e) => updateFormData("participantCount", e.target.value)} 
                placeholder="请输入参与者数量"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          {/* 研究信息部分 */}
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
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchMethod" className="text-muted-foreground">研究方法</Label>
            <Textarea 
              id="researchMethod" 
              value={formData.researchMethod} 
              onChange={(e) => updateFormData("researchMethod", e.target.value)} 
              placeholder="请描述研究方法..."
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
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
              <Input 
                id="department" 
                value={formData.department} 
                onChange={(e) => updateFormData("department", e.target.value)} 
                onBlur={() => handleBlur("department")}
                placeholder="请输入所属院系"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.department && formErrors.department ? "border-red-500" : ""
                )}
              />
              {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="implementationUnit" className="text-muted-foreground">研究单位</Label>
              <Input 
                id="implementationUnit" 
                value={formData.implementationUnit} 
                onChange={(e) => updateFormData("implementationUnit", e.target.value)} 
                placeholder="请输入研究单位"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* 底部按钮 */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button 
          variant="outline" 
          type="button"
          onClick={handleSaveDraft}
          onMouseDown={() => console.log("鼠标按下保存草稿按钮")}
          className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        >
          <Save className="h-4 w-4 mr-2" />
          保存草稿
        </Button>
        <Button 
          type="button"
          onClick={handleSubmit}
          onMouseDown={() => console.log("鼠标按下确认按钮")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" 
        >
          确认
        </Button>
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
              人体伦理项目已成功创建并提交审核。您可以继续添加新项目或返回项目列表。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              className="sm:mr-auto border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" 
              type="button"
              onClick={handleReturnToList}
              onMouseDown={() => console.log("鼠标按下返回列表按钮")}
            >
              返回列表
            </Button>
            <Button 
              type="button"
              onClick={handleContinueAdding}
              onMouseDown={() => console.log("鼠标按下继续添加按钮")}
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