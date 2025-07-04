"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  HomeIcon,
  Upload,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  ShieldIcon,
  InfoIcon,
  Thermometer,
  Droplets,
  Building,
  Settings,
  Eye
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

// 动物房表单组件接口
interface AnimalRoomFormProps {
  roomId?: string
  isEditMode?: boolean
}

export function AnimalRoomForm({ roomId, isEditMode = false }: AnimalRoomFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    roomId: "",
    name: "",
    type: "",
    description: "",
    
    // 容量信息
    capacity: "",
    capacityUnit: "饲养笼", // 新增容量单位字段，默认为饲养笼
    currentOccupancy: "0",
    
    // 位置信息
    building: "",
    floor: "",
    location: "",
    area: "",
    
    // 环境信息
    temperature: "22",
    humidity: "50",
    ventilation: "",
    lighting: "",
    soundProofing: "",
    
    // 管理信息
    department: "",
    manager: "",
    status: "空闲",
    setupDate: new Date(),
    
    // 安全信息
    securityLevel: "",
    accessRestriction: "",
    emergencyContact: "",
    
    // 其他信息
    notes: "",
    equipment: "",
    specialRequirements: "",
  })


  
  // 上传图片状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
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

  // 表单验证
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // 基本信息验证
    if (!formData.roomId.trim()) {
      errors.roomId = "房间编号不能为空"
    }
    if (!formData.name.trim()) {
      errors.name = "房间名称不能为空"
    }
    if (!formData.type) {
      errors.type = "请选择房间类型"
    }
    if (!formData.capacity.trim()) {
      errors.capacity = "容量不能为空"
    } else if (parseInt(formData.capacity) <= 0) {
      errors.capacity = "容量必须大于0"
    }
    
    // 位置信息验证
    if (!formData.department) {
      errors.department = "请选择所属部门"
    }
    if (!formData.building.trim()) {
      errors.building = "建筑不能为空"
    }
    if (!formData.location.trim()) {
      errors.location = "具体位置不能为空"
    }
    
    // 管理信息验证
    if (!formData.manager.trim()) {
      errors.manager = "管理员不能为空"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("保存草稿:", formData)
    toast({
      title: "草稿已保存",
      description: "您的动物房信息已保存为草稿",
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    // 构建完整的动物房数据
    const roomData = {
      ...formData,
      images: uploadedImages
    }
    
    console.log("提交动物房数据:", roomData)
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续添加动物房
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      roomId: "",
      name: "",
      type: "",
      description: "",
      capacity: "",
      capacityUnit: "饲养笼", // 重置时也设置默认单位
      currentOccupancy: "0",
      building: "",
      floor: "",
      location: "",
      area: "",
      temperature: "22",
      humidity: "50",
      ventilation: "",
      lighting: "",
      soundProofing: "",
      department: "",
      manager: "",
      status: "空闲",
      setupDate: new Date(),
      securityLevel: "",
      accessRestriction: "",
      emergencyContact: "",
      notes: "",
      equipment: "",
      specialRequirements: "",
    })
    
    setUploadedImages([])
    setFormErrors({})
    setFormTouched({})
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 返回列表页面
  const handleReturnToList = () => {
    router.push('/laboratory/animal-rooms')
  }



  // 区域标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium">{title}</h3>
      </div>
    )
  }

  // 错误信息组件
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
          <h1 className="text-2xl font-bold">新增动物房</h1>
        </div>
      </div>

      {/* 动物房基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomId" className="text-muted-foreground">房间编号 <span className="text-red-500">*</span></Label>
              <Input 
                id="roomId" 
                value={formData.roomId} 
                onChange={(e) => updateFormData("roomId", e.target.value)} 
                onBlur={() => handleBlur("roomId")}
                placeholder="请输入房间编号，如: AR-001"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.roomId && formErrors.roomId ? "border-red-500" : ""
                )}
              />
              {formTouched.roomId && <ErrorMessage message={formErrors.roomId || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">房间名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)} 
                onBlur={() => handleBlur("name")}
                placeholder="请输入房间名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.name && formErrors.name ? "border-red-500" : ""
                )}
              />
              {formTouched.name && <ErrorMessage message={formErrors.name || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-muted-foreground">房间类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => updateFormData("type", value)}
                onOpenChange={(open) => !open && handleBlur("type")}
              >
                <SelectTrigger 
                  id="type"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.type && formErrors.type ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择房间类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="普通饲养间">普通饲养间</SelectItem>
                  <SelectItem value="无菌饲养间">无菌饲养间</SelectItem>
                  <SelectItem value="SPF饲养间">SPF饲养间</SelectItem>
                  <SelectItem value="隔离饲养间">隔离饲养间</SelectItem>
                  <SelectItem value="检疫间">检疫间</SelectItem>
                  <SelectItem value="实验间">实验间</SelectItem>
                  <SelectItem value="手术间">手术间</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.type && <ErrorMessage message={formErrors.type || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-muted-foreground">最大容量 <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Input 
                  id="capacity" 
                  type="number"
                  value={formData.capacity} 
                  onChange={(e) => updateFormData("capacity", e.target.value)} 
                  onBlur={() => handleBlur("capacity")}
                  placeholder="请输入最大容量"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 flex-1",
                    formTouched.capacity && formErrors.capacity ? "border-red-500" : ""
                  )}
                />
                <Select 
                  value={formData.capacityUnit} 
                  onValueChange={(value) => updateFormData("capacityUnit", value)}
                >
                  <SelectTrigger className="w-24 border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="饲养笼">饲养笼</SelectItem>
                    <SelectItem value="饲养栏">饲养栏</SelectItem>
                    <SelectItem value="隔离器">隔离器</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formTouched.capacity && <ErrorMessage message={formErrors.capacity || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">房间描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入房间的用途、特点等描述信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 位置信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Building className="h-5 w-5" />} 
            title="位置信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-muted-foreground">所属部门 <span className="text-red-500">*</span></Label>
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
                  <SelectValue placeholder="请选择所属部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="动物实验中心">动物实验中心</SelectItem>
                  <SelectItem value="生物医学研究院">生物医学研究院</SelectItem>
                  <SelectItem value="药学院">药学院</SelectItem>
                  <SelectItem value="基础医学院">基础医学院</SelectItem>
                  <SelectItem value="临床医学院">临床医学院</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="building" className="text-muted-foreground">建筑 <span className="text-red-500">*</span></Label>
              <Input 
                id="building" 
                value={formData.building} 
                onChange={(e) => updateFormData("building", e.target.value)} 
                onBlur={() => handleBlur("building")}
                placeholder="如: A栋"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.building && formErrors.building ? "border-red-500" : ""
                )}
              />
              {formTouched.building && <ErrorMessage message={formErrors.building || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor" className="text-muted-foreground">楼层</Label>
              <Input 
                id="floor" 
                value={formData.floor} 
                onChange={(e) => updateFormData("floor", e.target.value)} 
                placeholder="如: 1楼"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-muted-foreground">具体位置 <span className="text-red-500">*</span></Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => updateFormData("location", e.target.value)} 
                onBlur={() => handleBlur("location")}
                placeholder="如: 东侧101室"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.location && formErrors.location ? "border-red-500" : ""
                )}
              />
              {formTouched.location && <ErrorMessage message={formErrors.location || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area" className="text-muted-foreground">面积(m²)</Label>
            <Input 
              id="area" 
              type="number"
              value={formData.area} 
              onChange={(e) => updateFormData("area", e.target.value)} 
              placeholder="房间面积"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* 环境信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Settings className="h-5 w-5" />} 
            title="环境信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-muted-foreground">温度(°C)</Label>
              <Input 
                id="temperature" 
                type="number"
                value={formData.temperature} 
                onChange={(e) => updateFormData("temperature", e.target.value)} 
                placeholder="推荐20-26°C"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity" className="text-muted-foreground">湿度(%)</Label>
              <Input 
                id="humidity" 
                type="number"
                value={formData.humidity} 
                onChange={(e) => updateFormData("humidity", e.target.value)} 
                placeholder="推荐40-70%"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ventilation" className="text-muted-foreground">通风系统</Label>
              <Input 
                id="ventilation" 
                value={formData.ventilation} 
                onChange={(e) => updateFormData("ventilation", e.target.value)} 
                placeholder="如: 中央空调，换风次数15次/小时"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lighting" className="text-muted-foreground">照明系统</Label>
              <Input 
                id="lighting" 
                value={formData.lighting} 
                onChange={(e) => updateFormData("lighting", e.target.value)} 
                placeholder="如: LED，12小时明暗循环"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soundProofing" className="text-muted-foreground">隔音措施</Label>
            <Input 
              id="soundProofing" 
              value={formData.soundProofing} 
              onChange={(e) => updateFormData("soundProofing", e.target.value)} 
              placeholder="隔音材料和措施"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            />
          </div>
        </CardContent>
      </Card>



      {/* 管理信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="管理信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-muted-foreground">管理员 <span className="text-red-500">*</span></Label>
              <Input 
                id="manager" 
                value={formData.manager} 
                onChange={(e) => updateFormData("manager", e.target.value)} 
                onBlur={() => handleBlur("manager")}
                placeholder="负责管理该动物房的人员"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.manager && formErrors.manager ? "border-red-500" : ""
                )}
              />
              {formTouched.manager && <ErrorMessage message={formErrors.manager || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">房间状态</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => updateFormData("status", value)}
              >
                <SelectTrigger 
                  id="status"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择房间状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="使用中">使用中</SelectItem>
                  <SelectItem value="维修中">维修中</SelectItem>
                  <SelectItem value="清洁中">清洁中</SelectItem>
                  <SelectItem value="空闲">空闲</SelectItem>
                  <SelectItem value="停用">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="securityLevel" className="text-muted-foreground">安全等级</Label>
              <Select 
                value={formData.securityLevel} 
                onValueChange={(value) => updateFormData("securityLevel", value)}
              >
                <SelectTrigger 
                  id="securityLevel"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择安全等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="一般">一般</SelectItem>
                  <SelectItem value="重要">重要</SelectItem>
                  <SelectItem value="机密">机密</SelectItem>
                  <SelectItem value="绝密">绝密</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="setupDate" className="text-muted-foreground">启用日期</Label>
              <Input 
                id="setupDate" 
                type="date"
                value={formData.setupDate ? formData.setupDate.toISOString().split('T')[0] : ''} 
                onChange={(e) => updateFormData("setupDate", new Date(e.target.value))} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessRestriction" className="text-muted-foreground">准入限制</Label>
              <Textarea 
                id="accessRestriction" 
                value={formData.accessRestriction} 
                onChange={(e) => updateFormData("accessRestriction", e.target.value)} 
                placeholder="谁可以进入该动物房，需要什么权限"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-muted-foreground">紧急联系人</Label>
              <Textarea 
                id="emergencyContact" 
                value={formData.emergencyContact} 
                onChange={(e) => updateFormData("emergencyContact", e.target.value)} 
                placeholder="紧急情况下的联系人及联系方式"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 其他信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<InfoIcon className="h-5 w-5" />} 
            title="其他信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment" className="text-muted-foreground">设备清单</Label>
              <Textarea 
                id="equipment" 
                value={formData.equipment} 
                onChange={(e) => updateFormData("equipment", e.target.value)} 
                placeholder="房间内的设备列表"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequirements" className="text-muted-foreground">特殊要求</Label>
              <Textarea 
                id="specialRequirements" 
                value={formData.specialRequirements} 
                onChange={(e) => updateFormData("specialRequirements", e.target.value)} 
                placeholder="特殊的饲养要求或注意事项"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">备注</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateFormData("notes", e.target.value)} 
              placeholder="其他需要说明的信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">动物房图片</Label>
            <div className="border-2 border-dashed border-[#E9ECF2] rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="imageUpload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">上传图片</span>
                    <Input
                      id="imageUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                  <p className="text-gray-500 text-sm mt-1">支持PNG、JPG格式，最大10MB</p>
                </div>
              </div>
              
              {/* 显示上传的图片 */}
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`动物房图片 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 安全提示 */}
          <div className="flex items-start space-x-2 pt-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">安全提示</p>
              <p>
                请确保动物房的环境参数符合实验动物饲养标准，定期检查温湿度、通风等设施，确保动物的健康和安全。
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              className="px-6"
            >
              保存草稿
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              创建动物房
            </Button>
          </div>
        </CardContent>
      </Card>



      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle>动物房创建成功！</DialogTitle>
            <DialogDescription>
              您的动物房信息已成功保存。您可以选择继续创建新的动物房或返回列表页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续创建动物房
            </Button>
            <Button onClick={handleReturnToList}>
              返回动物房列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 