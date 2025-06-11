"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  SettingsIcon,
  Upload,
  X,
  Calendar,
  DollarSign,
  AlertCircle
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
import { allDemoEquipmentItems } from "../../data/equipment-demo-data"

// 仪器表单组件接口
interface EquipmentFormProps {
  equipmentId?: string
  isEditMode?: boolean
}

// 仪器表单组件
export function EquipmentForm({ equipmentId, isEditMode = false }: EquipmentFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    model: "",
    serialNumber: "",
    description: "",
    category: "",
    status: "正常",
    department: "",
    location: "",
    
    // 购置信息
    purchaseDate: new Date(),
    warrantyExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
    price: "",
    supplier: "",
    
    // 技术规格
    powerSupply: "",
    dimensions: "",
    weight: "",
    operatingTemperature: "",
    humidity: "",
    specialRequirements: "",
    
    // 维护信息
    maintenanceStatus: "正常",
    useFrequency: "中",
  })

  // 图片上传状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false)

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
      "model", 
      "category", 
      "department",
      "location",
      "supplier"
    ]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${field === "name" ? "仪器名称" : 
                            field === "model" ? "型号" : 
                            field === "category" ? "仪器类型" : 
                            field === "department" ? "所属部门" : 
                            field === "location" ? "存放位置" : 
                            field === "supplier" ? "供应商" : ""}`
      }
    })
    
    // 验证价格是否为有效数字
    if (formData.price && isNaN(Number(formData.price))) {
      isValid = false
      newErrors.price = "请输入有效的价格"
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

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setUploadedImages(prev => [...prev, result])
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  // 删除上传的图片
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "您的仪器信息已保存为草稿",
      duration: 3000,
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    // 构建完整的仪器数据，包含图片
    const equipmentData = {
      ...formData,
      images: uploadedImages
    }
    
    // 这里应该调用API保存数据
    console.log("提交仪器数据:", equipmentData)
    
    setShowCompletionDialog(true)
  }

  // 继续添加下一个仪器
  const handleContinueAdding = () => {
    // 重置表单
    setFormData({
      name: "",
      model: "",
      serialNumber: "",
      description: "",
      category: "",
      status: "正常",
      department: "",
      location: "",
      purchaseDate: new Date(),
      warrantyExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
      price: "",
      supplier: "",
      powerSupply: "",
      dimensions: "",
      weight: "",
      operatingTemperature: "",
      humidity: "",
      specialRequirements: "",
      maintenanceStatus: "正常",
      useFrequency: "中",
    })
    setUploadedImages([])
    setFormErrors({})
    setFormTouched({})
    setShowCompletionDialog(false)
    
    toast({
      title: "表单已重置",
      description: "您可以继续添加新的仪器",
      duration: 3000,
    })
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/laboratory/equipment")
  }

  // 章节标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">{icon}</div>
        <h3 className="text-base font-medium">{title}</h3>
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
          <h1 className="text-2xl font-bold">新增仪器</h1>
        </div>
      </div>

      {/* 仪器基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          {/* 基本信息部分 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">仪器名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => updateFormData("name", e.target.value)} 
                onBlur={() => handleBlur("name")}
                placeholder="请输入仪器名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.name && formErrors.name ? "border-red-500" : ""
                )}
              />
              {formTouched.name && <ErrorMessage message={formErrors.name || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-muted-foreground">型号 <span className="text-red-500">*</span></Label>
              <Input 
                id="model" 
                value={formData.model}
                onChange={(e) => updateFormData("model", e.target.value)} 
                onBlur={() => handleBlur("model")}
                placeholder="请输入仪器型号"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.model && formErrors.model ? "border-red-500" : ""
                )}
              />
              {formTouched.model && <ErrorMessage message={formErrors.model || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className="text-muted-foreground">序列号</Label>
              <Input 
                id="serialNumber" 
                value={formData.serialNumber} 
                onChange={(e) => updateFormData("serialNumber", e.target.value)} 
                placeholder="请输入序列号"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">仪器类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => updateFormData("category", value)}
                onOpenChange={(open) => !open && handleBlur("category")}
              >
                <SelectTrigger 
                  id="category"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.category && formErrors.category ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择仪器类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="分析仪器">分析仪器</SelectItem>
                  <SelectItem value="光学仪器">光学仪器</SelectItem>
                  <SelectItem value="电子仪器">电子仪器</SelectItem>
                  <SelectItem value="医学仪器">医学仪器</SelectItem>
                  <SelectItem value="物理仪器">物理仪器</SelectItem>
                  <SelectItem value="测量仪器">测量仪器</SelectItem>
                  <SelectItem value="计算设备">计算设备</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.category && <ErrorMessage message={formErrors.category || ""} />}
            </div>
          </div>

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
                  <SelectItem value="物理实验室">物理实验室</SelectItem>
                  <SelectItem value="化学实验室">化学实验室</SelectItem>
                  <SelectItem value="生物实验室">生物实验室</SelectItem>
                  <SelectItem value="计算机实验室">计算机实验室</SelectItem>
                  <SelectItem value="电子实验室">电子实验室</SelectItem>
                  <SelectItem value="材料实验室">材料实验室</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-muted-foreground">存放位置 <span className="text-red-500">*</span></Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => updateFormData("location", e.target.value)} 
                onBlur={() => handleBlur("location")}
                placeholder="请输入存放位置"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.location && formErrors.location ? "border-red-500" : ""
                )}
              />
              {formTouched.location && <ErrorMessage message={formErrors.location || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">仪器状态</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => updateFormData("status", value)}
              >
                <SelectTrigger 
                  id="status"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择仪器状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="维修中">维修中</SelectItem>
                  <SelectItem value="报废">报废</SelectItem>
                  <SelectItem value="待验收">待验收</SelectItem>
                  <SelectItem value="外借">外借</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="useFrequency" className="text-muted-foreground">使用频率</Label>
              <Select 
                value={formData.useFrequency} 
                onValueChange={(value) => updateFormData("useFrequency", value)}
              >
                <SelectTrigger 
                  id="useFrequency"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择使用频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="高">高</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="低">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">仪器描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入仪器的详细描述、用途和特点"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">仪器图片</Label>
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
                        alt={`仪器图片 ${index + 1}`}
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

          {/* 购置信息 */}
          <SectionTitle 
            icon={<DollarSign className="h-5 w-5" />} 
            title="购置信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-muted-foreground">购置日期</Label>
              <DatePicker 
                id="purchaseDate"
                date={formData.purchaseDate} 
                onSelect={(date) => date && updateFormData("purchaseDate", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry" className="text-muted-foreground">保修到期日期</Label>
              <DatePicker 
                id="warrantyExpiry"
                date={formData.warrantyExpiry} 
                onSelect={(date) => date && updateFormData("warrantyExpiry", date)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-muted-foreground">购置价格（元）</Label>
              <Input 
                id="price" 
                type="number"
                value={formData.price} 
                onChange={(e) => updateFormData("price", e.target.value)} 
                onBlur={() => handleBlur("price")}
                placeholder="请输入购置价格"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.price && formErrors.price ? "border-red-500" : ""
                )}
              />
              {formTouched.price && <ErrorMessage message={formErrors.price || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-muted-foreground">供应商 <span className="text-red-500">*</span></Label>
              <Input 
                id="supplier" 
                value={formData.supplier} 
                onChange={(e) => updateFormData("supplier", e.target.value)} 
                onBlur={() => handleBlur("supplier")}
                placeholder="请输入供应商名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.supplier && formErrors.supplier ? "border-red-500" : ""
                )}
              />
              {formTouched.supplier && <ErrorMessage message={formErrors.supplier || ""} />}
            </div>
          </div>

          {/* 技术规格 */}
          <SectionTitle 
            icon={<SettingsIcon className="h-5 w-5" />} 
            title="技术规格" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="powerSupply" className="text-muted-foreground">电源要求</Label>
              <Input 
                id="powerSupply" 
                value={formData.powerSupply} 
                onChange={(e) => updateFormData("powerSupply", e.target.value)} 
                placeholder="如：220V±10%, 50Hz"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions" className="text-muted-foreground">外形尺寸</Label>
              <Input 
                id="dimensions" 
                value={formData.dimensions} 
                onChange={(e) => updateFormData("dimensions", e.target.value)} 
                placeholder="如：60cm × 50cm × 75cm"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-muted-foreground">重量</Label>
              <Input 
                id="weight" 
                value={formData.weight} 
                onChange={(e) => updateFormData("weight", e.target.value)} 
                placeholder="如：85kg"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operatingTemperature" className="text-muted-foreground">工作温度</Label>
              <Input 
                id="operatingTemperature" 
                value={formData.operatingTemperature} 
                onChange={(e) => updateFormData("operatingTemperature", e.target.value)} 
                placeholder="如：15-30°C"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="humidity" className="text-muted-foreground">湿度要求</Label>
              <Input 
                id="humidity" 
                value={formData.humidity} 
                onChange={(e) => updateFormData("humidity", e.target.value)} 
                placeholder="如：20-80%"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceStatus" className="text-muted-foreground">维护状态</Label>
              <Select 
                value={formData.maintenanceStatus} 
                onValueChange={(value) => updateFormData("maintenanceStatus", value)}
              >
                <SelectTrigger 
                  id="maintenanceStatus"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                >
                  <SelectValue placeholder="请选择维护状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="正常">正常</SelectItem>
                  <SelectItem value="待维护">待维护</SelectItem>
                  <SelectItem value="异常">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements" className="text-muted-foreground">特殊要求</Label>
            <Textarea 
              id="specialRequirements" 
              value={formData.specialRequirements} 
              onChange={(e) => updateFormData("specialRequirements", e.target.value)} 
              placeholder="请输入安装和使用的特殊要求，如避免阳光直射、远离强磁场等"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
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
              提交审核
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
            <DialogTitle>仪器添加成功！</DialogTitle>
            <DialogDescription>
              您的仪器信息已成功提交，系统将进行审核处理。您可以选择继续添加新仪器或返回列表页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续添加仪器
            </Button>
            <Button onClick={handleReturnToList}>
              返回仪器列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 