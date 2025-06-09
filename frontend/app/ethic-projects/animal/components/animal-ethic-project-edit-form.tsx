"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  UserIcon,
  PlusCircle,
  Trash2,
  Users,
  X
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

// 定义成员信息类型
type MemberType = {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
}

// 动物伦理项目编辑表单组件
export function AnimalEthicProjectEditForm({ projectData }: { projectData: any }) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    projectNumber: "",
    projectType: "动物",
    animalType: "",
    animalCount: "",
    ethicsCommittee: "",
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

  // 项目成员状态
  const [members, setMembers] = useState<MemberType[]>([])
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [currentMember, setCurrentMember] = useState<MemberType>({
    id: "",
    name: "",
    title: "",
    department: "",
    email: "",
    phone: ""
  })
  const [isEditingMember, setIsEditingMember] = useState(false)
  const [memberErrors, setMemberErrors] = useState<Record<string, string>>({})

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  // 加载项目数据
  useEffect(() => {
    if (projectData) {
      // 更新表单数据
      setFormData({
        name: projectData.name || "",
        projectNumber: projectData.projectNumber || "",
        projectType: "动物", // 对于动物伦理项目，始终设置为"动物"
        animalType: projectData.animalType || "",
        animalCount: projectData.animalCount || "",
        ethicsCommittee: projectData.ethicsCommittee || "",
        facilityUnit: projectData.facilityUnit || "",
        startDate: projectData.startDate ? new Date(projectData.startDate) : new Date(),
        endDate: projectData.endDate ? new Date(projectData.endDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        budget: projectData.budget || "",
        
        leader: projectData.leader || "",
        department: projectData.department || "",
        title: projectData.title || "",
        phone: projectData.phone || "",
        email: projectData.email || "",
        address: projectData.address || "",
        
        researchPurpose: projectData.researchPurpose || "",
        researchMethod: projectData.researchMethod || "",
      })

      // 更新成员列表
      if (Array.isArray(projectData.members)) {
        setMembers(projectData.members)
      }
    }
  }, [projectData])

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
      "ethicsCommittee",
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
                            field === "ethicsCommittee" ? "伦理委员会" : 
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
    
    // 验证成员邮箱格式
    members.forEach((member, index) => {
      if (member.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(member.email)) {
          isValid = false
          toast({
            title: "成员信息有误",
            description: `第${index + 1}个成员 ${member.name} 的邮箱格式不正确`,
            variant: "destructive"
          })
        }
      }
    })
    
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

  // 验证成员信息
  const validateMember = () => {
    const requiredFields = ["name", "department", "email"]
    let isValid = true
    const newErrors: Record<string, string> = {}
    
    // 验证必填字段
    requiredFields.forEach(field => {
      if (!currentMember[field as keyof typeof currentMember]) {
        isValid = false
        newErrors[field] = `${field === "name" ? "姓名" : 
                             field === "department" ? "所属院系" : 
                             field === "email" ? "电子邮箱" : ""} 不能为空`
      }
    })
    
    // 验证邮箱格式
    if (currentMember.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(currentMember.email)) {
        isValid = false
        newErrors.email = "请输入有效的电子邮箱"
      }
      
      // 检查邮箱是否重复（除了当前编辑的成员）
      const duplicateEmail = members.find(m => 
        m.email === currentMember.email && 
        (!isEditingMember || m.id !== currentMember.id)
      )
      if (duplicateEmail) {
        isValid = false
        newErrors.email = `邮箱已存在，与成员 "${duplicateEmail.name}" 重复`
      }
    }
    
    setMemberErrors(newErrors)
    return isValid
  }

  // 添加或更新成员
  const handleAddOrUpdateMember = () => {
    if (!validateMember()) return
    
    if (isEditingMember) {
      // 更新成员
      setMembers(prev => prev.map(member => 
        member.id === currentMember.id ? currentMember : member
      ))
      toast({
        title: "成员已更新",
        description: `成员 ${currentMember.name} 的信息已更新`
      })
    } else {
      // 添加新成员
      const newMember = {
        ...currentMember,
        id: Date.now().toString()
      }
      setMembers(prev => [...prev, newMember])
      toast({
        title: "成员已添加",
        description: `成员 ${newMember.name} 已添加到项目团队`
      })
    }
    
    // 重置表单并关闭对话框
    setCurrentMember({
      id: "",
      name: "",
      title: "",
      department: "",
      email: "",
      phone: ""
    })
    setMemberErrors({})
    setIsEditingMember(false)
    setShowMemberDialog(false)
  }

  // 编辑成员
  const handleEditMember = (member: MemberType) => {
    setCurrentMember({...member})
    setIsEditingMember(true)
    setMemberErrors({})
    setShowMemberDialog(true)
  }

  // 删除成员
  const handleDeleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id)
    if (!memberToDelete) return
    
    setMembers(prev => prev.filter(member => member.id !== id))
    toast({
      title: "成员已删除",
      description: `成员 "${memberToDelete.name}" 已从项目团队中移除`
    })
  }

  // 打开新增成员对话框
  const handleOpenAddMemberDialog = () => {
    setCurrentMember({
      id: "",
      name: "",
      title: "",
      department: "",
      email: "",
      phone: ""
    })
    setMemberErrors({})
    setIsEditingMember(false)
    setShowMemberDialog(true)
  }

  // 更新当前成员信息
  const updateMemberData = (field: string, value: any) => {
    setCurrentMember(prev => ({
      ...prev,
      [field]: value
    }))
    // 清除对应字段的错误
    if (memberErrors[field]) {
      setMemberErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
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
      console.log("项目成员:", members)
      
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
          <h1 className="text-2xl font-bold">编辑动物伦理项目</h1>
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
          {/* 第一行：项目名称、项目编号 */}
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

          {/* 第二行：项目类型、伦理委员会 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-muted-foreground">项目类型</Label>
              <Input 
                id="projectType" 
                value={formData.projectType}
                disabled
                className="border-[#E9ECF2] rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ethicsCommittee" className="text-muted-foreground">伦理委员会 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.ethicsCommittee} 
                onValueChange={(value) => updateFormData("ethicsCommittee", value)}
                onOpenChange={(open) => !open && handleBlur("ethicsCommittee")}
              >
                <SelectTrigger 
                  id="ethicsCommittee"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.ethicsCommittee && formErrors.ethicsCommittee ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择伦理委员会" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="医学院伦理审查委员会">医学院伦理审查委员会</SelectItem>
                  <SelectItem value="生物医学伦理委员会">生物医学伦理委员会</SelectItem>
                  <SelectItem value="动物实验伦理委员会">动物实验伦理委员会</SelectItem>
                  <SelectItem value="药学院伦理委员会">药学院伦理委员会</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.ethicsCommittee && <ErrorMessage message={formErrors.ethicsCommittee || ""} />}
            </div>
          </div>

          {/* 第三行：动物种类、动物数量 */}
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

          {/* 第四行：动物实施设备单位（跨两列） */}
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

          {/* 第五行：开始日期、结束日期 */}
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

          {/* 第六行：项目预算 */}
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
        </CardContent>
      </Card>

      {/* 研究信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
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
        </CardContent>
      </Card>

      {/* 主要研究者信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
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

      {/* 项目成员信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Users className="h-5 w-5" />} 
            title="项目成员" 
          />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500">共 {members.length} 名成员</span>
              {members.length > 0 && (
                <span className="ml-4 text-xs text-gray-400">
                  提示：点击操作列中的按钮可编辑或删除成员
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenAddMemberDialog}
              className="h-8 gap-1 text-xs bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              添加成员
            </Button>
          </div>
          
          {members.length > 0 ? (
            <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[15%]">姓名</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[15%]">职称/职务</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[20%]">所属院系</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[25%]">电子邮箱</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[15%]">联系电话</th>
                    <th className="py-2.5 px-4 text-center font-medium text-gray-700 w-[10%]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr 
                      key={member.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">{member.name}</td>
                      <td className="py-3 px-4 text-gray-700">{member.title || "-"}</td>
                      <td className="py-3 px-4 text-gray-700">{member.department}</td>
                      <td className="py-3 px-4 text-gray-700">{member.email}</td>
                      <td className="py-3 px-4 text-gray-700">{member.phone || "-"}</td>
                      <td className="py-2 px-2">
                        <div className="flex justify-center space-x-3">
                          <button
                            type="button"
                            onClick={() => handleEditMember(member)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="编辑"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16.862 4.487L18.549 2.799C18.9007 2.44733 19.3777 2.25005 19.875 2.25005C20.3723 2.25005 20.8493 2.44733 21.201 2.799C21.5527 3.15068 21.75 3.62766 21.75 4.125C21.75 4.62234 21.5527 5.09932 21.201 5.451L10.582 16.07C10.0533 16.5984 9.40137 16.9867 8.684 17.2L6 18L6.8 15.316C7.01328 14.5986 7.40163 13.9467 7.93 13.418L16.862 4.487ZM16.862 4.487L19.5 7.125" 
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>  
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="删除"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.74 9L14.394 18M9.606 18L9.26 9M19.228 5.79C19.57 5.842 19.91 5.897 20.25 5.956M19.228 5.79L18.16 19.673C18.1164 20.2383 17.8611 20.7662 17.445 21.1512C17.029 21.5363 16.4829 21.7502 15.916 21.75H8.084C7.5171 21.7502 6.97102 21.5363 6.55498 21.1512C6.13894 20.7662 5.88359 20.2383 5.84 19.673L4.772 5.79M19.228 5.79C18.0739 5.61552 16.9138 5.48769 15.75 5.407M4.772 5.79C4.43 5.842 4.09 5.897 3.75 5.956M4.772 5.79C5.92613 5.61552 7.08623 5.48769 8.25 5.407M15.75 5.407V4.477C15.75 3.297 14.84 2.313 13.66 2.276C12.5536 2.2406 11.4464 2.2406 10.34 2.276C9.16 2.313 8.25 3.297 8.25 4.477V5.407M15.75 5.407C13.2537 5.22095 10.7463 5.22095 8.25 5.407" 
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-md px-6 py-10 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">暂无项目成员</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                您可以添加项目参与人员，系统将记录每位成员的基本信息和联系方式
              </p>
              <Button
                type="button"
                onClick={handleOpenAddMemberDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-9 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                添加项目成员
              </Button>
            </div>
          )}
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
              项目更新成功
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              动物伦理项目已成功更新。您可以继续编辑或返回项目列表。
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
              onClick={() => setShowCompletionDialog(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              继续编辑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 项目成员对话框 */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-lg border border-[#E9ECF2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold leading-none tracking-tight">
              {isEditingMember ? "编辑成员信息" : "添加项目成员"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isEditingMember ? "更新此项目成员的信息。" : "填写项目成员的基本信息并添加到项目团队。"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-name" className="text-muted-foreground">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="member-name"
                  value={currentMember.name}
                  onChange={(e) => updateMemberData("name", e.target.value)}
                  placeholder="请输入成员姓名"
                  className={cn(
                    "border-[#E9ECF2] rounded-md",
                    memberErrors.name ? "border-red-500" : ""
                  )}
                />
                <ErrorMessage message={memberErrors.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-title" className="text-muted-foreground">职称/职务</Label>
                <Input
                  id="member-title"
                  value={currentMember.title}
                  onChange={(e) => updateMemberData("title", e.target.value)}
                  placeholder="请输入职称或职务"
                  className="border-[#E9ECF2] rounded-md"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-department" className="text-muted-foreground">
                  所属院系 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentMember.department}
                  onValueChange={(value) => updateMemberData("department", value)}
                >
                  <SelectTrigger
                    id="member-department"
                    className={cn(
                      "border-[#E9ECF2] rounded-md",
                      memberErrors.department ? "border-red-500" : ""
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
                <ErrorMessage message={memberErrors.department || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-email" className="text-muted-foreground">
                  电子邮箱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="member-email"
                  type="email"
                  value={currentMember.email}
                  onChange={(e) => updateMemberData("email", e.target.value)}
                  placeholder="请输入电子邮箱"
                  className={cn(
                    "border-[#E9ECF2] rounded-md",
                    memberErrors.email ? "border-red-500" : ""
                  )}
                />
                <ErrorMessage message={memberErrors.email || ""} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-phone" className="text-muted-foreground">联系电话</Label>
              <Input
                id="member-phone"
                value={currentMember.phone}
                onChange={(e) => updateMemberData("phone", e.target.value)}
                placeholder="请输入联系电话"
                className="border-[#E9ECF2] rounded-md"
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="border-[#E9ECF2] hover:bg-slate-50 rounded-md"
              onClick={() => setShowMemberDialog(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleAddOrUpdateMember}
            >
              {isEditingMember ? "更新" : "添加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 