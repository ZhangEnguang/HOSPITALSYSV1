"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  PackageIcon,
  Upload,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  ShieldIcon,
  InfoIcon
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

// 耗材表单组件接口
interface ConsumableFormProps {
  consumableId?: string
  isEditMode?: boolean
}

// 耗材表单组件
export function ConsumableForm({ consumableId, isEditMode = false }: ConsumableFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    alias: [""],
    category: "",
    model: "",
    catalogNumber: "",
    description: "",
    
    // 供应信息
    manufacturer: "",
    supplier: "",
    expiryDate: new Date(),
    price: "",
    department: "",
    
    // 库存信息
    location: "",
    minStock: "",
    maxStock: "",
    status: "充足",
    currentStock: "",
    unit: "",
    notes: "",
    
    // 管理信息
    manager: "",
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
      "category", 
      "model", 
      "catalogNumber",
      "supplier",
      "department",
      "location",
      "status",
      "currentStock",
      "minStock",
      "maxStock",
      "unit",
      "manager"
    ]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${
          field === "name" ? "耗材名称" : 
          field === "category" ? "耗材类型" : 
          field === "model" ? "型号规格" : 
          field === "catalogNumber" ? "目录号" :
          field === "supplier" ? "供应商" :
          field === "department" ? "所属部门" : 
          field === "location" ? "存放位置" : 
          field === "status" ? "库存状态" :
          field === "currentStock" ? "当前库存" :
          field === "minStock" ? "最小库存" :
          field === "maxStock" ? "最大库存" :
          field === "unit" ? "单位" :
          field === "manager" ? "负责人" : ""
        }`
      }
    })
    
    // 验证价格是否为有效数字
    if (formData.price && isNaN(Number(formData.price))) {
      isValid = false
      newErrors.price = "请输入有效的价格"
    }
    
    // 验证数量是否为有效数字
    if (formData.currentStock && isNaN(Number(formData.currentStock))) {
      isValid = false
      newErrors.currentStock = "请输入有效的数量"
    }
    
    if (formData.minStock && isNaN(Number(formData.minStock))) {
      isValid = false
      newErrors.minStock = "请输入有效的数量"
    }
    
    if (formData.maxStock && isNaN(Number(formData.maxStock))) {
      isValid = false
      newErrors.maxStock = "请输入有效的数量"
    }
    
    // 验证库存逻辑
    if (formData.minStock && formData.maxStock) {
      const min = Number(formData.minStock)
      const max = Number(formData.maxStock)
      if (min >= max) {
        isValid = false
        newErrors.minStock = "最小库存应小于最大库存"
        newErrors.maxStock = "最大库存应大于最小库存"
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

  // 移除图片
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "您的耗材信息已保存为草稿",
      duration: 3000,
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true)
      // 模拟提交延迟
      setTimeout(() => {
        setIsLoading(false)
        setShowCompletionDialog(true)
        // 在这里添加实际的提交逻辑
        console.log("提交耗材数据:", formData)
      }, 1500)
    }
  }

  // 继续添加
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    // 重置表单
    setFormData({
      name: "",
      alias: [""],
      category: "",
      model: "",
      catalogNumber: "",
      description: "",
      manufacturer: "",
      supplier: "",
      expiryDate: new Date(),
      price: "",
      department: "",
      location: "",
      minStock: "",
      maxStock: "",
      status: "充足",
      currentStock: "",
      unit: "",
      notes: "",
      manager: "",
    })
    setUploadedImages([])
    setFormErrors({})
    setFormTouched({})
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/laboratory/consumables")
  }

  // 节标题组件
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

  // 错误消息组件
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </div>
    )
  }

  // 处理别名添加
  const handleAddAlias = () => {
    setFormData(prev => ({
      ...prev,
      alias: [...prev.alias, ""]
    }))
  }

  // 处理别名删除
  const handleRemoveAlias = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alias: prev.alias.filter((_, i) => i !== index)
    }))
  }

  // 处理别名更新
  const handleUpdateAlias = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      alias: prev.alias.map((alias, i) => i === index ? value : alias)
    }))
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
          <h1 className="text-2xl font-bold">新增耗材</h1>
        </div>
      </div>

      {/* 耗材基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          {/* 基本信息部分 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">耗材名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => updateFormData("name", e.target.value)} 
                onBlur={() => handleBlur("name")}
                placeholder="请输入耗材名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.name && formErrors.name ? "border-red-500" : ""
                )}
              />
              {formTouched.name && <ErrorMessage message={formErrors.name || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">耗材类型 <span className="text-red-500">*</span></Label>
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
                  <SelectValue placeholder="请选择耗材类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="玻璃器皿">玻璃器皿</SelectItem>
                  <SelectItem value="塑料器皿">塑料器皿</SelectItem>
                  <SelectItem value="移液器材">移液器材</SelectItem>
                  <SelectItem value="防护用品">防护用品</SelectItem>
                  <SelectItem value="培养耗材">培养耗材</SelectItem>
                  <SelectItem value="分析耗材">分析耗材</SelectItem>
                  <SelectItem value="通用耗材">通用耗材</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.category && <ErrorMessage message={formErrors.category || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-muted-foreground">型号规格 <span className="text-red-500">*</span></Label>
              <Input 
                id="model" 
                value={formData.model} 
                onChange={(e) => updateFormData("model", e.target.value)} 
                onBlur={() => handleBlur("model")}
                placeholder="如: 1.5mL透明离心管"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.model && formErrors.model ? "border-red-500" : ""
                )}
              />
              {formTouched.model && <ErrorMessage message={formErrors.model || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalogNumber" className="text-muted-foreground">目录号 <span className="text-red-500">*</span></Label>
              <Input 
                id="catalogNumber" 
                value={formData.catalogNumber} 
                onChange={(e) => updateFormData("catalogNumber", e.target.value)} 
                onBlur={() => handleBlur("catalogNumber")}
                placeholder="如: EP-15-T"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.catalogNumber && formErrors.catalogNumber ? "border-red-500" : ""
                )}
              />
              {formTouched.catalogNumber && <ErrorMessage message={formErrors.catalogNumber || ""} />}
            </div>
          </div>

          {/* 别名管理 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">别名</Label>
            <div className="space-y-2">
              {formData.alias.map((alias, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={alias}
                    onChange={(e) => handleUpdateAlias(index, e.target.value)}
                    placeholder={`别名 ${index + 1}`}
                    className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  />
                  {formData.alias.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveAlias(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAlias}
                className="mt-2"
              >
                + 添加别名
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">耗材描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入耗材的用途、特性等描述信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">耗材图片</Label>
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
                        alt={`耗材图片 ${index + 1}`}
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

          {/* 供应信息 */}
          <SectionTitle 
            icon={<DollarSign className="h-5 w-5" />} 
            title="供应信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-muted-foreground">生产厂商</Label>
              <Input 
                id="manufacturer" 
                value={formData.manufacturer} 
                onChange={(e) => updateFormData("manufacturer", e.target.value)} 
                placeholder="如: 艾本德"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-muted-foreground">供应商 <span className="text-red-500">*</span></Label>
              <Input 
                id="supplier" 
                value={formData.supplier} 
                onChange={(e) => updateFormData("supplier", e.target.value)} 
                onBlur={() => handleBlur("supplier")}
                placeholder="如: 德国艾本德（中国）有限公司"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.supplier && formErrors.supplier ? "border-red-500" : ""
                )}
              />
              {formTouched.supplier && <ErrorMessage message={formErrors.supplier || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-muted-foreground">有效期</Label>
              <DatePicker
                id="expiryDate"
                date={formData.expiryDate}
                onSelect={(date) => date && updateFormData("expiryDate", date)}
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-muted-foreground">单价（元）</Label>
              <Input 
                id="price" 
                type="number"
                value={formData.price} 
                onChange={(e) => updateFormData("price", e.target.value)} 
                onBlur={() => handleBlur("price")}
                placeholder="请输入单价"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.price && formErrors.price ? "border-red-500" : ""
                )}
              />
              {formTouched.price && <ErrorMessage message={formErrors.price || ""} />}
            </div>
          </div>

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
                <SelectValue placeholder="请选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="生物实验室">生物实验室</SelectItem>
                <SelectItem value="化学实验室">化学实验室</SelectItem>
                <SelectItem value="物理实验室">物理实验室</SelectItem>
                <SelectItem value="药学实验室">药学实验室</SelectItem>
                <SelectItem value="材料实验室">材料实验室</SelectItem>
                <SelectItem value="分析实验室">分析实验室</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
          </div>

          {/* 库存信息 */}
          <SectionTitle 
            icon={<PackageIcon className="h-5 w-5" />} 
            title="库存信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-muted-foreground">存放位置 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => updateFormData("location", value)}
                onOpenChange={(open) => !open && handleBlur("location")}
              >
                <SelectTrigger 
                  id="location"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.location && formErrors.location ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择存放位置" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A栋储物柜">A栋储物柜</SelectItem>
                  <SelectItem value="B栋试剂柜">B栋试剂柜</SelectItem>
                  <SelectItem value="C栋专用柜">C栋专用柜</SelectItem>
                  <SelectItem value="D栋临时存放">D栋临时存放</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.location && <ErrorMessage message={formErrors.location || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-muted-foreground">库存状态 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => updateFormData("status", value)}
                onOpenChange={(open) => !open && handleBlur("status")}
              >
                <SelectTrigger 
                  id="status"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.status && formErrors.status ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择库存状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="充足">充足</SelectItem>
                  <SelectItem value="库存不足">库存不足</SelectItem>
                  <SelectItem value="缺货">缺货</SelectItem>
                  <SelectItem value="已停用">已停用</SelectItem>
                  <SelectItem value="待采购">待采购</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.status && <ErrorMessage message={formErrors.status || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock" className="text-muted-foreground">当前库存 <span className="text-red-500">*</span></Label>
              <Input 
                id="currentStock" 
                type="number"
                value={formData.currentStock} 
                onChange={(e) => updateFormData("currentStock", e.target.value)} 
                onBlur={() => handleBlur("currentStock")}
                placeholder="请输入数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.currentStock && formErrors.currentStock ? "border-red-500" : ""
                )}
              />
              {formTouched.currentStock && <ErrorMessage message={formErrors.currentStock || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock" className="text-muted-foreground">最小库存 <span className="text-red-500">*</span></Label>
              <Input 
                id="minStock" 
                type="number"
                value={formData.minStock} 
                onChange={(e) => updateFormData("minStock", e.target.value)} 
                onBlur={() => handleBlur("minStock")}
                placeholder="最小库存"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.minStock && formErrors.minStock ? "border-red-500" : ""
                )}
              />
              {formTouched.minStock && <ErrorMessage message={formErrors.minStock || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock" className="text-muted-foreground">最大库存 <span className="text-red-500">*</span></Label>
              <Input 
                id="maxStock" 
                type="number"
                value={formData.maxStock} 
                onChange={(e) => updateFormData("maxStock", e.target.value)} 
                onBlur={() => handleBlur("maxStock")}
                placeholder="最大库存"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.maxStock && formErrors.maxStock ? "border-red-500" : ""
                )}
              />
              {formTouched.maxStock && <ErrorMessage message={formErrors.maxStock || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-muted-foreground">单位 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => updateFormData("unit", value)}
                onOpenChange={(open) => !open && handleBlur("unit")}
              >
                <SelectTrigger 
                  id="unit"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.unit && formErrors.unit ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="单位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="个">个</SelectItem>
                  <SelectItem value="包">包</SelectItem>
                  <SelectItem value="盒">盒</SelectItem>
                  <SelectItem value="套">套</SelectItem>
                  <SelectItem value="块">块</SelectItem>
                  <SelectItem value="支">支</SelectItem>
                  <SelectItem value="只">只</SelectItem>
                  <SelectItem value="张">张</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.unit && <ErrorMessage message={formErrors.unit || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">注意事项</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateFormData("notes", e.target.value)} 
              placeholder="请输入耗材使用时的注意事项、存储要求等"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 管理信息 */}
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="管理信息" 
          />

          <div className="space-y-2">
            <Label htmlFor="manager" className="text-muted-foreground">负责人 <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.manager} 
              onValueChange={(value) => updateFormData("manager", value)}
              onOpenChange={(open) => !open && handleBlur("manager")}
            >
              <SelectTrigger 
                id="manager"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.manager && formErrors.manager ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="请选择负责人" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="张七">张七 (实验室管理员)</SelectItem>
                <SelectItem value="李三">李三 (耗材管理员)</SelectItem>
                <SelectItem value="王五">王五 (实验室主任)</SelectItem>
                <SelectItem value="李四">李四 (技术员)</SelectItem>
                <SelectItem value="赵六">赵六 (技术员)</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.manager && <ErrorMessage message={formErrors.manager || ""} />}
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">提示</p>
              <p>
                请确保耗材信息填写准确，特别是库存数量和存放位置。系统将根据最小库存自动提醒补货。
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
              disabled={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "提交中..." : "提交审核"}
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
            <DialogTitle>耗材添加成功！</DialogTitle>
            <DialogDescription>
              您的耗材信息已成功提交，系统将进行审核处理。您可以选择继续添加新耗材或返回列表页面。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续添加耗材
            </Button>
            <Button onClick={handleReturnToList}>
              返回耗材列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 