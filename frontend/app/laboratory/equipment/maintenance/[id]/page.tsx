"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, Wrench, Calendar, MapPin, User, Phone, Mail, Zap, AlertTriangle, CheckCircle2, Clock, FileText, Settings } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { allDemoEquipmentItems } from "../../data/equipment-demo-data"

// 从真实数据中获取仪器信息
const getEquipmentData = (id: string) => {
  console.log("正在查找设备ID:", id);
  const equipment = allDemoEquipmentItems.find((item: any) => item.id === id)
  if (!equipment) {
    console.log("未找到设备，使用默认设备:", allDemoEquipmentItems[0]);
    // 如果找不到，返回第一个作为默认值
    return allDemoEquipmentItems[0]
  }
  console.log("找到设备:", equipment.name, "图片:", equipment.images);
  return equipment
}

// 维护类型选项
const maintenanceTypes = [
  { value: "routine", label: "例行维护" },
  { value: "repair", label: "故障维修" },
  { value: "calibration", label: "校准检定" },
  { value: "upgrade", label: "升级改造" },
  { value: "cleaning", label: "清洁保养" },
  { value: "inspection", label: "安全检查" },
]

// 优先级选项
const priorities = [
  { value: "low", label: "低", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "medium", label: "中", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "high", label: "高", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "urgent", label: "紧急", color: "bg-red-100 text-red-800 border-red-200" },
]

// 技术规格键名中文映射
const getSpecificationLabel = (key: string): string => {
  const labelMap: { [key: string]: string } = {
    'powerSupply': '电源供应',
    'power': '功率',
    'dimensions': '尺寸',
    'weight': '重量',
    'operatingTemperature': '工作温度',
    'humidity': '湿度',
    'specialRequirements': '特殊要求',
    'voltage': '电压',
    'frequency': '频率',
    'resolution': '分辨率',
    'accuracy': '精度',
    'range': '测量范围',
    'sensitivity': '灵敏度',
    'stability': '稳定性',
    'interface': '接口',
    'software': '软件',
    'calibration': '校准',
    'maintenance': '维护',
    'warranty': '保修',
    'manufacturer': '制造商',
    'model': '型号',
    'serialNumber': '序列号'
  }
  
  return labelMap[key] || key
}

export default function EquipmentMaintenancePage() {
  const router = useRouter()
  const params = useParams()
  const equipmentId = (params?.id as string) || ""
  
  const [equipment] = useState(getEquipmentData(equipmentId))
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    priority: "",
    scheduledDate: "",
    estimatedDuration: "",
    technician: "",
    contact: "",
    phone: "",
    partsNeeded: "",
    cost: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 表单验证
    if (!formData.type || !formData.title || !formData.description || !formData.priority || !formData.scheduledDate || !formData.technician) {
      toast({
        title: "表单验证失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // 模拟提交维护登记
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "维护登记创建成功",
        description: "维护任务已安排，相关人员将收到通知",
        duration: 3000,
      })

      router.push("/laboratory/equipment")
    } catch (error) {
      toast({
        title: "创建失败",
        description: "创建维护登记时发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "在用": return "bg-green-100 text-green-800 border-green-200"
      case "维修中": return "bg-orange-100 text-orange-800 border-orange-200"
      case "闲置": return "bg-gray-100 text-gray-800 border-gray-200"
      case "报废": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // 安全格式化日期
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "未设置"
    try {
      return format(new Date(dateString), "yyyy/MM/dd")
    } catch {
      return "日期格式错误"
    }
  }

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <div className="z-10">
        <div className="container mx-auto py-3">
          <div className="flex items-center gap-2">
            {/* 返回按钮 */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              维护登记
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-stretch">
          {/* 仪器信息卡片 */}
          <div className="xl:col-span-1">
            <Card className="overflow-hidden bg-white border h-full group">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Eye className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">仪器信息</CardTitle>
                    <CardDescription className="text-xs">设备详细信息</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 仪器图片 */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow">
                    {equipment.images && equipment.images.length > 0 ? (
                      <img
                        src={equipment.images[0]}
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log("图片加载成功:", equipment.images[0]);
                          setIsImageLoaded(true);
                        }}
                        onError={(e) => {
                          console.log("图片加载失败:", equipment.images[0]);
                          setIsImageLoaded(false);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Eye className="h-16 w-16 mx-auto mb-2" />
                          <p className="text-sm">暂无图片</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(equipment.status)
                  )}>
                    {equipment.status}
                  </div>
                </div>
                
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{equipment.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      {equipment.model}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        类型
                      </span>
                      <span className="text-sm font-medium">{equipment.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        部门
                      </span>
                      <span className="text-sm font-medium">{equipment.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        位置
                      </span>
                      <span className="text-sm font-medium">{equipment.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* 维护状态信息 */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-500" />
                    维护状态
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-xs text-gray-600">当前状态</span>
                      <Badge variant={equipment.maintenanceStatus === "正常" ? "default" : "destructive"}>
                        {equipment.maintenanceStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-xs text-gray-600">上次维护</span>
                      <span className="text-xs font-medium">{formatDate(equipment.lastMaintenanceDate)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-xs text-gray-600">下次维护</span>
                      <span className="text-xs font-medium">{formatDate(equipment.nextMaintenanceDate)}</span>
                    </div>
                  </div>
                </div>

                {/* 管理员信息 */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    管理联系人
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                          {equipment.manager.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{equipment.manager.name}</p>
                        <p className="text-xs text-gray-500">{equipment.manager.role}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {equipment.manager.email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 维护登记表单 */}
          <div className="xl:col-span-3 space-y-8">
            {/* 维护信息表单卡片 */}
            <Card className="overflow-hidden bg-white border h-full">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Wrench className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">创建维护登记</CardTitle>
                    <CardDescription className="text-xs">请填写详细的维护信息</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 维护类型 */}
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-semibold text-gray-700">
                        维护类型 <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="请选择维护类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {maintenanceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 优先级 */}
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">
                        优先级 <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="请选择优先级" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn("px-2 py-1 rounded text-xs font-medium border", priority.color)}>
                                  {priority.label}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 维护标题 */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                        维护标题 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="请输入维护标题"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>

                    {/* 计划日期 */}
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate" className="text-sm font-semibold text-gray-700">
                        计划日期 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>

                    {/* 预计时长 */}
                    <div className="space-y-2">
                      <Label htmlFor="estimatedDuration" className="text-sm font-semibold text-gray-700">
                        预计时长（小时）
                      </Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        value={formData.estimatedDuration}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                        placeholder="请输入预计时长"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        min="0.5"
                        step="0.5"
                      />
                    </div>

                    {/* 负责技术员 */}
                    <div className="space-y-2">
                      <Label htmlFor="technician" className="text-sm font-semibold text-gray-700">
                        负责技术员 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="technician"
                        value={formData.technician}
                        onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                        placeholder="请输入负责技术员姓名"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  {/* 维护描述 */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      维护描述 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="请详细描述维护内容、问题现象、处理方案等"
                      rows={4}
                      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* 联系信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 联系人 */}
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-semibold text-gray-700">
                        联系人
                      </Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder="请输入联系人姓名"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>

                    {/* 联系电话 */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        联系电话
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="请输入联系电话"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* 其他信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 所需配件 */}
                    <div className="space-y-2">
                      <Label htmlFor="partsNeeded" className="text-sm font-semibold text-gray-700">
                        所需配件
                      </Label>
                      <Textarea
                        id="partsNeeded"
                        value={formData.partsNeeded}
                        onChange={(e) => setFormData(prev => ({ ...prev, partsNeeded: e.target.value }))}
                        placeholder="请列出所需的配件或材料"
                        rows={3}
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>

                    {/* 预计费用 */}
                    <div className="space-y-2">
                      <Label htmlFor="cost" className="text-sm font-semibold text-gray-700">
                        预计费用（元）
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                        placeholder="请输入预计费用"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* 备注 */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">备注说明</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="请输入其他备注信息"
                      rows={3}
                      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="hover:bg-gray-50"
                    >
                      取消
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          创建中...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          创建维护登记
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 