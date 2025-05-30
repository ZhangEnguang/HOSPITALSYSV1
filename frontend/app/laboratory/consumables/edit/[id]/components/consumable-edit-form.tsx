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
import { allDemoConsumableItems } from "../../../data/consumable-demo-data"

// 耗材编辑表单组件接口
interface ConsumableEditFormProps {
  consumableId: string
}

// 耗材编辑表单组件
export function ConsumableEditForm({ consumableId }: ConsumableEditFormProps) {
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
  const [isLoading, setIsLoading] = useState(true)
  
  // 数据加载状态
  const [dataLoaded, setDataLoaded] = useState(false)

  // 加载耗材数据
  useEffect(() => {
    const loadConsumableData = async () => {
      try {
        setIsLoading(true)
        
        // 模拟API调用，实际项目中这里应该是真实的API调用
        const consumable = allDemoConsumableItems.find(item => item.id === consumableId)
        
        if (!consumable) {
          toast({
            title: "加载失败",
            description: "未找到指定的耗材信息",
            variant: "destructive",
          })
          router.push("/laboratory/consumables")
          return
        }

        // 填充表单数据
        setFormData({
          name: consumable.name,
          alias: consumable.alias || [""],
          category: consumable.category,
          model: consumable.model,
          catalogNumber: consumable.catalogNumber,
          description: consumable.description,
          manufacturer: consumable.manufacturer,
          supplier: consumable.supplier,
          expiryDate: new Date(consumable.expiryDate),
          price: consumable.unitPrice?.toString() || "",
          department: consumable.department,
          location: consumable.location,
          minStock: consumable.minStock?.toString() || "",
          maxStock: consumable.maxStock?.toString() || "",
          status: consumable.status,
          currentStock: consumable.currentStock?.toString() || "",
          unit: consumable.unit,
          notes: consumable.notes || "",
          manager: consumable.manager?.name || "",
        })

        // 加载图片
        if (consumable.imageUrl) {
          setUploadedImages([consumable.imageUrl])
        }

        setDataLoaded(true)
        
        toast({
          title: "数据加载成功",
          description: `已加载耗材"${consumable.name}"的信息`,
        })
      } catch (error) {
        console.error("加载耗材数据失败:", error)
        toast({
          title: "加载失败",
          description: "加载耗材数据时发生错误",
          variant: "destructive",
        })
        router.push("/laboratory/consumables")
      } finally {
        setIsLoading(false)
      }
    }

    if (consumableId) {
      loadConsumableData()
    }
  }, [consumableId, router])

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
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImages(prev => [...prev, result])
      }
      reader.readAsDataURL(file)
    }
  }

  // 处理图片删除
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 处理保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "草稿已保存",
      description: "耗材信息已保存为草稿，您可以稍后继续编辑",
      duration: 3000,
    })
  }

  // 处理提交
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // 模拟保存操作
    setTimeout(() => {
      setIsLoading(false)
      setShowCompletionDialog(true)
      
      toast({
        title: "保存成功",
        description: "耗材信息已成功更新",
        duration: 3000,
      })
    }, 1500)
  }

  // 处理继续编辑其他耗材
  const handleContinueEditing = () => {
    setShowCompletionDialog(false)
    router.push("/laboratory/consumables")
  }

  // 处理返回列表
  const handleReturnToList = () => {
    router.push("/laboratory/consumables")
  }

  // 节标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
      <div className="text-blue-500">
        {icon}
      </div>
      <h3 className="text-base font-medium">{title}</h3>
    </div>
  )

  // 错误信息组件
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3 text-red-500" />
      <span className="text-xs text-red-500">{message}</span>
    </div>
  )

  // 处理别名添加
  const handleAddAlias = () => {
    if (formData.alias.length < 10) {
      setFormData(prev => ({
        ...prev,
        alias: [...prev.alias, ""]
      }))
    }
  }

  // 处理别名删除
  const handleRemoveAlias = (index: number) => {
    if (formData.alias.length > 1) {
      setFormData(prev => ({
        ...prev,
        alias: prev.alias.filter((_, i) => i !== index)
      }))
    }
  }

  // 处理别名更新
  const handleUpdateAlias = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      alias: prev.alias.map((alias, i) => i === index ? value : alias)
    }))
  }

  if (isLoading && !dataLoaded) {
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
            <h1 className="text-2xl font-bold">编辑耗材</h1>
          </div>
        </div>
        <Card className="border-[#E9ECF2] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-muted-foreground">正在加载耗材数据...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dataLoaded) {
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
            <h1 className="text-2xl font-bold">编辑耗材</h1>
          </div>
        </div>
        <Card className="border-[#E9ECF2] shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">加载失败</p>
              <p className="text-sm text-gray-500 mb-4">未能加载耗材信息</p>
              <Button onClick={() => router.push("/laboratory/consumables")}>
                返回耗材列表
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <h1 className="text-2xl font-bold">编辑耗材</h1>
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
                  <SelectItem value="塑料器皿">塑料器皿</SelectItem>
                  <SelectItem value="移液器材">移液器材</SelectItem>
                  <SelectItem value="培养耗材">培养耗材</SelectItem>
                  <SelectItem value="分析耗材">分析耗材</SelectItem>
                  <SelectItem value="通用耗材">通用耗材</SelectItem>
                  <SelectItem value="防护用品">防护用品</SelectItem>
                  <SelectItem value="清洁用品">清洁用品</SelectItem>
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
                placeholder="请输入型号规格"
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
                placeholder="请输入目录号"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.catalogNumber && formErrors.catalogNumber ? "border-red-500" : ""
                )}
              />
              {formTouched.catalogNumber && <ErrorMessage message={formErrors.catalogNumber || ""} />}
            </div>
          </div>

          {/* 别名设置 */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">别名设置</Label>
            <div className="space-y-3">
              {formData.alias.map((alias, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={alias}
                    onChange={(e) => handleUpdateAlias(index, e.target.value)}
                    placeholder={`别名 ${index + 1}`}
                    className="flex-1 border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  />
                  {formData.alias.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAlias(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.alias.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAlias}
                  className="text-primary border-primary hover:bg-primary/5"
                >
                  + 添加别名
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              添加别名可以帮助更好地搜索和识别此耗材，最多可添加10个别名
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">耗材描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请输入耗材的详细描述"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 供应信息 */}
          <SectionTitle 
            icon={<PackageIcon className="h-5 w-5" />} 
            title="供应信息" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-muted-foreground">生产厂商</Label>
              <Input 
                id="manufacturer" 
                value={formData.manufacturer} 
                onChange={(e) => updateFormData("manufacturer", e.target.value)} 
                placeholder="请输入生产厂商"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-muted-foreground">供应商 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.supplier} 
                onValueChange={(value) => updateFormData("supplier", value)}
                onOpenChange={(open) => !open && handleBlur("supplier")}
              >
                <SelectTrigger 
                  id="supplier"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.supplier && formErrors.supplier ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择供应商" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="西陆科学">西陆科学</SelectItem>
                  <SelectItem value="国药集团">国药集团</SelectItem>
                  <SelectItem value="百灵威">百灵威</SelectItem>
                  <SelectItem value="阿拉丁">阿拉丁</SelectItem>
                  <SelectItem value="默克">默克</SelectItem>
                  <SelectItem value="赛默飞">赛默飞</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.supplier && <ErrorMessage message={formErrors.supplier || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">有效期</Label>
              <DatePicker
                date={formData.expiryDate}
                onSelect={(date) => updateFormData("expiryDate", date || new Date())}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-muted-foreground">单价 (元)</Label>
              <Input 
                id="price" 
                type="number"
                value={formData.price} 
                onChange={(e) => updateFormData("price", e.target.value)} 
                onBlur={() => handleBlur("price")}
                placeholder="0.00"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.price && formErrors.price ? "border-red-500" : ""
                )}
                step="0.01"
                min="0"
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
                <SelectValue placeholder="请选择所属部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="生物实验室">生物实验室</SelectItem>
                <SelectItem value="化学实验室">化学实验室</SelectItem>
                <SelectItem value="物理实验室">物理实验室</SelectItem>
                <SelectItem value="分子生物实验室">分子生物实验室</SelectItem>
                <SelectItem value="分析检测实验室">分析检测实验室</SelectItem>
                <SelectItem value="通用实验室">通用实验室</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
          </div>

          {/* 库存信息 */}
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="库存信息" 
          />

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="待采购">待采购</SelectItem>
                  <SelectItem value="已停用">已停用</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.status && <ErrorMessage message={formErrors.status || ""} />}
            </div>
          </div>

          <div className="grid grid-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock" className="text-muted-foreground">当前库存 <span className="text-red-500">*</span></Label>
              <Input 
                id="currentStock" 
                type="number"
                value={formData.currentStock} 
                onChange={(e) => updateFormData("currentStock", e.target.value)} 
                onBlur={() => handleBlur("currentStock")}
                placeholder="请输入当前库存数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.currentStock && formErrors.currentStock ? "border-red-500" : ""
                )}
                min="0"
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
                placeholder="请输入最小库存数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.minStock && formErrors.minStock ? "border-red-500" : ""
                )}
                min="0"
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
                placeholder="请输入最大库存数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.maxStock && formErrors.maxStock ? "border-red-500" : ""
                )}
                min="0"
              />
              {formTouched.maxStock && <ErrorMessage message={formErrors.maxStock || ""} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit" className="text-muted-foreground">计量单位 <span className="text-red-500">*</span></Label>
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
                <SelectValue placeholder="请选择计量单位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="个">个</SelectItem>
                <SelectItem value="包">包</SelectItem>
                <SelectItem value="盒">盒</SelectItem>
                <SelectItem value="块">块</SelectItem>
                <SelectItem value="套">套</SelectItem>
                <SelectItem value="支">支</SelectItem>
                <SelectItem value="根">根</SelectItem>
                <SelectItem value="片">片</SelectItem>
                <SelectItem value="瓶">瓶</SelectItem>
                <SelectItem value="袋">袋</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.unit && <ErrorMessage message={formErrors.unit || ""} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">备注信息</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateFormData("notes", e.target.value)} 
              placeholder="请输入其他相关备注信息"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>

          {/* 管理信息 */}
          <SectionTitle 
            icon={<InfoIcon className="h-5 w-5" />} 
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
                <SelectItem value="张三">张三</SelectItem>
                <SelectItem value="李四">李四</SelectItem>
                <SelectItem value="王五">王五</SelectItem>
                <SelectItem value="赵六">赵六</SelectItem>
                <SelectItem value="钱七">钱七</SelectItem>
              </SelectContent>
            </Select>
            {formTouched.manager && <ErrorMessage message={formErrors.manager || ""} />}
          </div>

          {/* 图片上传 */}
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-muted-foreground">产品图片</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">点击上传</span> 或拖拽图片到此处
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG 格式 (最大 10MB)</p>
                </div>
                <input 
                  id="image-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`上传图片 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              更新耗材信息
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
            <DialogTitle>耗材更新成功！</DialogTitle>
            <DialogDescription>
              您的耗材信息已成功更新。您可以选择返回耗材列表页面或继续管理其他耗材。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleContinueEditing}>
              返回耗材列表
            </Button>
            <Button onClick={handleReturnToList}>
              继续管理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 