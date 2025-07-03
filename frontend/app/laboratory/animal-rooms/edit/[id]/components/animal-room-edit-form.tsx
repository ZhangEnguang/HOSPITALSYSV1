"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  Upload,
  X,
  AlertCircle,
  ShieldIcon,

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

// 导入动物房数据
import { allDemoAnimalRoomItems } from "../../../data/animal-rooms-demo-data"

// 动物房编辑表单组件接口
interface AnimalRoomEditFormProps {
  roomId: string
}

export function AnimalRoomEditForm({ roomId }: AnimalRoomEditFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    roomId: "",
    name: "",
    type: "",
    description: "",
    capacity: "",
    capacityUnit: "饲养笼", // 新增容量单位字段，默认为饲养笼
    department: "",
    manager: "",
    building: "",
    location: "",
    notes: "",
    status: "",
  })


  
  // 上传图片状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  // 加载状态
  const [loading, setLoading] = useState(true)

  // 加载动物房数据和可用动物数据
  useEffect(() => {
    const loadRoomData = () => {
      // 根据ID查找动物房数据
      const roomData = allDemoAnimalRoomItems.find((room: any) => room.id === roomId)
      
      if (roomData) {
        // 预填充表单数据
        setFormData({
          roomId: roomData.roomId,
          name: roomData.name,
          type: roomData.type,
          description: roomData.description || "",
          capacity: roomData.capacity.toString(),
          capacityUnit: roomData.capacityUnit || "饲养笼", // 从数据中获取容量单位，如果没有则默认为饲养笼
          department: roomData.department,
          manager: roomData.manager,
          building: roomData.location.includes('栋') ? roomData.location.split('栋')[0] + '栋' : "",
          location: roomData.location.includes('栋') ? roomData.location.split('栋')[1] || roomData.location : roomData.location,
          notes: roomData.notes || "",
          status: roomData.status,
        })

      } else {
        router.push('/laboratory/animal-rooms')
        return
      }
      
      setLoading(false)
    }

    if (roomId) {
      loadRoomData()
    }
  }, [roomId, router])

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
    }
    if (!formData.department) {
      errors.department = "请选择所属部门"
    }
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

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    const roomData = {
      ...formData,
      images: uploadedImages
    }
    
    console.log("更新动物房数据:", roomData)
    setShowCompletionDialog(true)
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

  // 加载状态
  if (loading) {
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
            <h1 className="text-2xl font-bold">编辑动物房</h1>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">加载中...</p>
        </div>
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
          <h1 className="text-2xl font-bold">编辑动物房</h1>
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

      {/* 管理信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="管理信息" 
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building" className="text-muted-foreground">建筑</Label>
              <Input 
                id="building" 
                value={formData.building} 
                onChange={(e) => updateFormData("building", e.target.value)} 
                placeholder="如: A栋"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-muted-foreground">具体位置</Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => updateFormData("location", e.target.value)} 
                placeholder="如: 东侧101室"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
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
        </CardContent>
      </Card>

      {/* 备注和操作按钮 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="其他信息" 
          />

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

          {/* 操作按钮 */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => toast({ title: "草稿已保存" })}
              className="px-6"
            >
              保存草稿
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              保存修改
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
            <DialogTitle>动物房修改成功！</DialogTitle>
            <DialogDescription>
              您的动物房信息已成功更新。您可以选择继续编辑或返回列表页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
              继续编辑
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