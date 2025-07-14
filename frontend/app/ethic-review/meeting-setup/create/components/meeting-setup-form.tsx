"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar,
  Users,
  PlusCircle,
  Trash2,
  FileText,
  Zap,
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
  role: string; // 参会角色
}

// 定义组件props类型
interface MeetingSetupFormProps {
  mode?: 'create' | 'edit';
  initialData?: any;
}

// 会议管理表单组件
export function MeetingSetupForm({ mode = 'create', initialData }: MeetingSetupFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState(() => {
    if (mode === 'edit' && initialData) {
      return {
        meetingId: initialData.meetingId || `MTG-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        title: initialData.title || "",
        date: initialData.date ? new Date(initialData.date) : new Date(),
        venue: initialData.venue || "",
        organizer: initialData.organizer?.name || "",
        committee: initialData.committee || "",
        status: initialData.status || "未开始",
        description: initialData.description || "",
        quickReviewCount: initialData.quickReviewCount || 0,
        meetingReviewCount: initialData.meetingReviewCount || 0,
        // 项目限制相关
        limitProjectCount: initialData.limitProjectCount !== undefined ? initialData.limitProjectCount : true,
        quickReviewLimit: initialData.quickReviewLimit || 10,
        meetingReviewLimit: initialData.meetingReviewLimit || 15,
      }
    } else {
      return {
        // 基本信息
        meetingId: `MTG-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`, // 系统自动生成
        title: "",
        date: new Date(),
        venue: "",
        organizer: "",
        committee: "",
        status: "未开始", // 默认状态
        description: "",
        
        // 会议报告项目（系统自动计数，不可编辑）
        quickReviewCount: 0,
        meetingReviewCount: 0,
        // 项目限制相关
        limitProjectCount: true, // 默认限制项目数量
        quickReviewLimit: 10, // 默认快速审查限制
        meetingReviewLimit: 15, // 默认会议审查限制
      }
    }
  })

  // 参会人员状态
  const [members, setMembers] = useState<MemberType[]>(() => {
    if (mode === 'edit' && initialData?.members) {
      return initialData.members.map((member: any) => ({
        id: member.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: member.name || "",
        title: member.title || "",
        department: member.department || "",
        email: member.email || "",
        phone: member.phone || "",
        role: member.role || "委员"
      }))
    }
    return []
  })
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [currentMember, setCurrentMember] = useState<MemberType>({
    id: "",
    name: "",
    title: "",
    department: "",
    email: "",
    phone: "",
    role: ""
  })
  const [isEditingMember, setIsEditingMember] = useState(false)
  const [memberErrors, setMemberErrors] = useState<Record<string, string>>({})

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
    
    // 当选择伦理委员会时，自动添加委员会成员
    if (field === "committee" && value) {
      addCommitteeMembers(value)
    }
  }

  // 自动添加委员会成员
  const addCommitteeMembers = (committee: string) => {
    // 根据不同的伦理委员会获取对应的成员数据
    const getCommitteeMembers = (committee: string) => {
      const allMembers = {
        "医学院伦理审查委员会": [
          { name: "张主任", title: "主任委员", department: "医学院", email: "zhang@example.com", phone: "13800138001", role: "主任委员" },
          { name: "李教授", title: "教授", department: "基础医学院", email: "li@example.com", phone: "13800138002", role: "委员" },
          { name: "王博士", title: "副教授", department: "临床医学院", email: "wang@example.com", phone: "13800138003", role: "委员" },
          { name: "赵医生", title: "主治医师", department: "公共卫生学院", email: "zhao@example.com", phone: "13800138004", role: "委员" },
        ],
        "生物医学伦理委员会": [
          { name: "陈主任", title: "主任委员", department: "生物医学工程学院", email: "chen@example.com", phone: "13800138005", role: "主任委员" },
          { name: "刘教授", title: "教授", department: "基础医学院", email: "liu@example.com", phone: "13800138006", role: "委员" },
          { name: "孙博士", title: "副教授", department: "药学院", email: "sun@example.com", phone: "13800138007", role: "委员" },
        ],
        "动物实验伦理委员会": [
          { name: "周主任", title: "主任委员", department: "动物医学院", email: "zhou@example.com", phone: "13800138008", role: "主任委员" },
          { name: "吴教授", title: "教授", department: "基础医学院", email: "wu@example.com", phone: "13800138009", role: "委员" },
          { name: "郑博士", title: "副教授", department: "临床医学院", email: "zheng@example.com", phone: "13800138010", role: "委员" },
        ],
        "药学院伦理委员会": [
          { name: "马主任", title: "主任委员", department: "药学院", email: "ma@example.com", phone: "13800138011", role: "主任委员" },
          { name: "杨教授", title: "教授", department: "药学院", email: "yang@example.com", phone: "13800138012", role: "委员" },
          { name: "许博士", title: "副教授", department: "药学院", email: "xu@example.com", phone: "13800138013", role: "委员" },
        ]
      }
      
      return allMembers[committee as keyof typeof allMembers] || []
    }

    const committeeMembers = getCommitteeMembers(committee)
    
    if (committeeMembers.length === 0) {
      return
    }

    // 过滤掉已存在的成员
    const existingNames = members.map(m => m.name)
    const newMembers = committeeMembers
      .filter(member => !existingNames.includes(member.name))
      .map(member => ({
        ...member,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }))

    if (newMembers.length > 0) {
      setMembers(prev => [...prev, ...newMembers])
      toast({
        title: "委员会成员已自动添加",
        description: `已添加 ${newMembers.length} 名${committee}成员`,
      })
    }
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
      "title", 
      "venue", 
      "organizer", 
      "committee"
    ]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${field === "title" ? "会议标题" : 
                            field === "venue" ? "会议场地" : 
                            field === "organizer" ? "会议主持人" : 
                            field === "committee" ? "参会委员会" : ""}`
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
    const requiredFields = ["name", "department", "email", "role"]
    let isValid = true
    const newErrors: Record<string, string> = {}
    
    // 验证必填字段
    requiredFields.forEach(field => {
      if (!currentMember[field as keyof typeof currentMember]) {
        isValid = false
        newErrors[field] = `${field === "name" ? "姓名" : 
                             field === "department" ? "所属院系" : 
                             field === "email" ? "电子邮箱" : 
                             field === "role" ? "参会角色" : ""} 不能为空`
      }
    })
    
    // 验证邮箱格式
    if (currentMember.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(currentMember.email)) {
        isValid = false
        newErrors.email = "请输入有效的电子邮箱"
      }
    }
    
    // 验证重复姓名
    if (currentMember.name) {
      const existingMember = members.find(m => 
        m.name === currentMember.name && m.id !== currentMember.id
      )
      if (existingMember) {
        isValid = false
        newErrors.name = "该成员已存在"
      }
    }
    
    setMemberErrors(newErrors)
    return isValid
  }

  // 添加或更新成员
  const handleAddOrUpdateMember = () => {
    if (!validateMember()) return
    
    if (isEditingMember) {
      // 更新现有成员
      setMembers(prev => prev.map(member => 
        member.id === currentMember.id ? currentMember : member
      ))
      toast({
        title: "成员信息已更新",
        description: `${currentMember.name} 的信息已成功更新`,
      })
    } else {
      // 添加新成员
      const newMember = {
        ...currentMember,
        id: Date.now().toString()
      }
      setMembers(prev => [...prev, newMember])
      toast({
        title: "成员添加成功",
        description: `${currentMember.name} 已添加到参会人员列表`,
      })
    }
    
    // 重置表单
    setCurrentMember({
      id: "",
      name: "",
      title: "",
      department: "",
      email: "",
      phone: "",
      role: ""
    })
    setMemberErrors({})
    setShowMemberDialog(false)
    setIsEditingMember(false)
  }

  // 编辑成员
  const handleEditMember = (member: MemberType) => {
    setCurrentMember(member)
    setIsEditingMember(true)
    setMemberErrors({})
    setShowMemberDialog(true)
  }

  // 删除成员
  const handleDeleteMember = (id: string) => {
    const member = members.find(m => m.id === id)
    setMembers(prev => prev.filter(m => m.id !== id))
    toast({
      title: "成员已删除",
      description: `${member?.name} 已从参会人员列表中移除`,
    })
  }

  // 打开添加成员对话框
  const handleOpenAddMemberDialog = () => {
    setCurrentMember({
      id: "",
      name: "",
      title: "",
      department: "",
      email: "",
      phone: "",
      role: ""
    })
    setIsEditingMember(false)
    setMemberErrors({})
    setShowMemberDialog(true)
  }

  // 更新成员数据
  const updateMemberData = (field: string, value: any) => {
    setCurrentMember((prev) => ({
      ...prev,
      [field]: value
    }))
  }



  // 保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
              description: "会议草稿已保存，您可以稍后继续编辑",
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) return
    
    setShowCompletionDialog(true)
  }

  // 继续添加新会议
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      meetingId: `MTG-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      title: "",
      date: new Date(),
      venue: "",
      organizer: "",
      committee: "",
      status: "未开始",
      description: "",
      quickReviewCount: 0,
      meetingReviewCount: 0,
      // 项目限制相关
      limitProjectCount: true,
      quickReviewLimit: 10,
      meetingReviewLimit: 15,
    })
    setMembers([])
    setFormErrors({})
    setFormTouched({})
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/ethic-review/meeting-setup")
  }

  // 区块标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="bg-blue-50 p-3 rounded-md mb-4">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">
            {icon}
          </div>
          <h3 className="text-base font-medium text-slate-900">{title}</h3>
        </div>
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
          <h1 className="text-2xl font-bold">{mode === 'edit' ? '编辑会议' : '新增会议'}</h1>
        </div>
      </div>

      {/* 会议基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Calendar className="h-5 w-5" />} 
            title="会议基本信息" 
          />
          
          {/* 第一行：会议编号、会议标题 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingId" className="text-muted-foreground">会议编号</Label>
              <Input 
                id="meetingId" 
                value={formData.meetingId} 
                disabled
                className="border-[#E9ECF2] rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-muted-foreground">会议标题 <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => updateFormData("title", e.target.value)} 
                onBlur={() => handleBlur("title")}
                placeholder="请输入会议标题"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.title && formErrors.title ? "border-red-500" : ""
                )}
              />
              {formTouched.title && <ErrorMessage message={formErrors.title || ""} />}
            </div>
          </div>

          {/* 第二行：会议时间、会议场地 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-muted-foreground">会议时间</Label>
              <DatePicker 
                id="date"
                date={formData.date} 
                onSelect={(date) => date && updateFormData("date", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue" className="text-muted-foreground">会议场地 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.venue} 
                onValueChange={(value) => updateFormData("venue", value)}
                onOpenChange={(open) => !open && handleBlur("venue")}
              >
                <SelectTrigger 
                  id="venue"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.venue && formErrors.venue ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择会议场地" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="学术报告厅">学术报告厅</SelectItem>
                  <SelectItem value="会议室A">会议室A</SelectItem>
                  <SelectItem value="会议室B">会议室B</SelectItem>
                  <SelectItem value="线上会议">线上会议</SelectItem>
                  <SelectItem value="综合楼101">综合楼101</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.venue && <ErrorMessage message={formErrors.venue || ""} />}
            </div>
          </div>

          {/* 第三行：会议主持人、伦理委员会 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-muted-foreground">会议主持人 <span className="text-red-500">*</span></Label>
              <Input 
                id="organizer" 
                value={formData.organizer} 
                onChange={(e) => updateFormData("organizer", e.target.value)} 
                onBlur={() => handleBlur("organizer")}
                placeholder="请输入会议主持人姓名"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.organizer && formErrors.organizer ? "border-red-500" : ""
                )}
              />
              {formTouched.organizer && <ErrorMessage message={formErrors.organizer || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="committee" className="text-muted-foreground">伦理委员会 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.committee} 
                onValueChange={(value) => updateFormData("committee", value)}
                onOpenChange={(open) => !open && handleBlur("committee")}
              >
                <SelectTrigger 
                  id="committee"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.committee && formErrors.committee ? "border-red-500" : ""
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
              {formTouched.committee && <ErrorMessage message={formErrors.committee || ""} />}
            </div>
          </div>

          {/* 第四行：状态（不可编辑） */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">状态</Label>
              <Input 
                id="status" 
                value={formData.status}
                disabled
                className="border-[#E9ECF2] rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div></div>
          </div>

          {/* 第五行：会议描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">会议描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入会议描述（可选）"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 会议报告项目 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileText className="h-5 w-5" />} 
            title="会议报告项目" 
          />
          
          {/* 是否限制审查会议项目数量 */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-gray-900">是否限制审查会议项目数量</Label>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="limitYes"
                  name="limitProjectCount"
                  checked={formData.limitProjectCount === true}
                  onChange={() => updateFormData("limitProjectCount", true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="limitYes" className="text-sm font-medium text-gray-700">是</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="limitNo"
                  name="limitProjectCount"
                  checked={formData.limitProjectCount === false}
                  onChange={() => updateFormData("limitProjectCount", false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="limitNo" className="text-sm font-medium text-gray-700">否</Label>
              </div>
            </div>
          </div>

          {/* 项目限制设置 */}
          {formData.limitProjectCount ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quickReviewLimit" className="text-muted-foreground">快速审查项目限制额度</Label>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="quickReviewLimit" 
                    type="number"
                    min="1"
                    value={formData.quickReviewLimit} 
                    onChange={(e) => updateFormData("quickReviewLimit", parseInt(e.target.value) || 0)}
                    className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  />
                  <span className="text-sm text-muted-foreground">项</span>
                </div>
                <p className="text-xs text-muted-foreground">当前已有 {formData.quickReviewCount} 项</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingReviewLimit" className="text-muted-foreground">会议审查项目限制额度</Label>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="meetingReviewLimit" 
                    type="number"
                    min="1"
                    value={formData.meetingReviewLimit} 
                    onChange={(e) => updateFormData("meetingReviewLimit", parseInt(e.target.value) || 0)}
                    className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  />
                  <span className="text-sm text-muted-foreground">项</span>
                </div>
                <p className="text-xs text-muted-foreground">当前已有 {formData.meetingReviewCount} 项</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">快速审查项目额度</Label>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-[#E9ECF2] rounded-md text-gray-600">
                    不限制
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">当前已有 {formData.quickReviewCount} 项</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">会议审查项目额度</Label>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-[#E9ECF2] rounded-md text-gray-600">
                    不限制
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">当前已有 {formData.meetingReviewCount} 项</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 参会人员 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Users className="h-5 w-5" />} 
            title="参会人员" 
          />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">共 {members.length} 名参会人员</span>
              {members.length > 0 && (
                <span className="text-xs text-gray-400">
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
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[12%]">姓名</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[12%]">职称/职务</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[15%]">所属院系</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[20%]">电子邮箱</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[12%]">联系电话</th>
                    <th className="py-2.5 px-4 text-left font-medium text-gray-700 w-[12%]">参会角色</th>
                    <th className="py-2.5 px-4 text-center font-medium text-gray-700 w-[7%]">操作</th>
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
                      <td className="py-3 px-4 text-gray-700">{member.role}</td>
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
            <div className="bg-white border border-dashed border-gray-300 rounded-md px-6 py-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">暂无参会人员</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                您可以点击右上角的"添加成员"按钮来添加参会人员
              </p>
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
            {mode === 'edit' ? '更新会议' : '确认'}
          </Button>
        </div>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border border-[#E9ECF2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {mode === 'edit' ? '会议更新成功' : '会议创建成功'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {mode === 'edit' ? '会议已成功更新。您可以继续编辑其他会议或返回会议列表。' : '会议已成功创建。您可以继续添加新会议或返回会议列表。'}
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
            {mode === 'create' && (
              <Button 
                type="button"
                onClick={handleContinueAdding}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              >
                继续添加
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 参会人员对话框 */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-lg border border-[#E9ECF2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold leading-none tracking-tight">
              {isEditingMember ? "编辑参会人员" : "添加参会人员"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isEditingMember ? "更新此参会人员的信息。" : "填写参会人员的基本信息并添加到会议中。"}
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
                  placeholder="请输入姓名"
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
                    <SelectItem value="医学院">医学院</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage message={memberErrors.department || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-role" className="text-muted-foreground">
                  参会角色 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentMember.role}
                  onValueChange={(value) => updateMemberData("role", value)}
                >
                  <SelectTrigger
                    id="member-role"
                    className={cn(
                      "border-[#E9ECF2] rounded-md",
                      memberErrors.role ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue placeholder="请选择参会角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="主任委员">主任委员</SelectItem>
                    <SelectItem value="副主任委员">副主任委员</SelectItem>
                    <SelectItem value="委员">委员</SelectItem>
                    <SelectItem value="秘书">秘书</SelectItem>
                    <SelectItem value="专家">专家</SelectItem>
                    <SelectItem value="观察员">观察员</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage message={memberErrors.role || ""} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="border-[#E9ECF2] hover:bg-slate-50 rounded-md"
              onClick={() => {
                setShowMemberDialog(false)
                // 重置表单
                setCurrentMember({
                  id: "",
                  name: "",
                  title: "",
                  department: "",
                  email: "",
                  phone: "",
                  role: ""
                })
                setMemberErrors({})
                setIsEditingMember(false)
              }}
            >
              取消
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleAddOrUpdateMember}
            >
              {isEditingMember ? "更新成员" : "添加成员"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 