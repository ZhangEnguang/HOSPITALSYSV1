"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  ShieldIcon,
  InfoIcon,
  Thermometer,
  Droplets,
  Clock,
  Heart,
  Activity,
  Utensils,
  Pill,
  Scale,
  Plus,
  X,
  Upload,
  Search,
  Trash2,
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
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

// 导入动物档案数据
// import { allDemoAnimalItems } from "../../../../animal-files/data/animal-files-demo-data"

// 饲养管理表单组件接口
interface AnimalRoomFeedingManageFormProps {
  roomId: string
  isEditMode?: boolean
}

export function AnimalRoomFeedingManageForm({ roomId, isEditMode = false }: AnimalRoomFeedingManageFormProps) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    managementId: "",
    roomId: roomId,
    planName: "",
    planType: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "计划中",
    description: "",
    
    // 饲养计划
    feedingSchedule: "",
    feedType: "",
    feedAmount: "",
    feedingFrequency: "",
    feedingTimes: ["08:00", "14:00", "20:00"],
    waterSupply: "",
    
    // 环境管理
    temperatureRange: { min: "20", max: "25" },
    humidityRange: { min: "40", max: "60" },
    lightCycle: "",
    ventilationLevel: "",
    noiseLevelLimit: "",
    
    // 健康监测
    healthCheckFrequency: "",
    weightMonitoring: "",
    behaviorObservation: "",
    vaccineSchedule: "",
    medicationPlan: "",
    
    // 清洁维护
    cageCleaningSchedule: "",
    roomCleaningSchedule: "",
    disinfectionSchedule: "",
    bedChangingSchedule: "",
    equipmentMaintenance: "",
    
    // 人员安排
    primaryCaretaker: "",
    backupCaretaker: "",
    veterinarian: "",
    supervisorApproval: "",
    
    // 记录要求
    dailyObservationRequired: true,
    weightRecordRequired: true,
    feedingLogRequired: true,
    healthLogRequired: true,
    incidentReportRequired: true,
    
    // 应急预案
    emergencyContacts: "",
    emergencyProcedures: "",
    veterinaryContact: "",
    
    // 成本预算
    estimatedCost: "",
    feedCost: "",
    medicationCost: "",
    laborCost: "",
    
    // 备注信息
    specialRequirements: "",
    notes: "",
  })

  // 关联动物列表状态
  const [managedAnimals, setManagedAnimals] = useState<any[]>([])
  
  // 动物选择对话框状态
  const [showAnimalDialog, setShowAnimalDialog] = useState(false)
  const [availableAnimals, setAvailableAnimals] = useState<any[]>([])
  const [animalSearchTerm, setAnimalSearchTerm] = useState("")
  
  // 上传文件状态
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  // 加载可用动物数据
  useEffect(() => {
    // 模拟动物数据
    const mockAnimals = [
      { id: "1", animalId: "A001", species: "小鼠", status: "健康" },
      { id: "2", animalId: "A002", species: "大鼠", status: "观察中" }
    ]
    setAvailableAnimals(mockAnimals)
  }, [])

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

  // 错误消息组件
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    return (
      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </div>
    )
  }

  // 表单验证
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.planName.trim()) {
      errors.planName = "饲养计划名称不能为空"
    }
    if (!formData.planType) {
      errors.planType = "请选择计划类型"
    }
    if (!formData.primaryCaretaker.trim()) {
      errors.primaryCaretaker = "主要饲养员不能为空"
    }
    if (!formData.feedType) {
      errors.feedType = "请选择饲料类型"
    }
    if (!formData.feedingFrequency) {
      errors.feedingFrequency = "请选择喂食频率"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("保存草稿:", formData)
    toast({
      title: "草稿已保存",
      description: "您的饲养管理计划已保存为草稿",
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    const managementData = {
      ...formData,
      files: uploadedFiles,
      managedAnimals: managedAnimals,
    }
    
    console.log("提交饲养管理数据:", managementData)
    setShowCompletionDialog(true)
  }

  // 继续添加饲养计划
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    // 重置表单逻辑
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

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      {/* 页面标题 */}
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新增饲养管理计划</h1>
          <Badge variant="outline" className="ml-2">
            AR-{roomId} - 动物房{roomId}
          </Badge>
        </div>
      </div>

      {/* 基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="基本信息" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planName" className="text-muted-foreground">计划名称 <span className="text-red-500">*</span></Label>
              <Input 
                id="planName" 
                value={formData.planName} 
                onChange={(e) => updateFormData("planName", e.target.value)} 
                onBlur={() => handleBlur("planName")}
                placeholder="请输入饲养管理计划名称"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.planName && formErrors.planName ? "border-red-500" : ""
                )}
              />
              {formTouched.planName && <ErrorMessage message={formErrors.planName || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="planType" className="text-muted-foreground">计划类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.planType} 
                onValueChange={(value) => updateFormData("planType", value)}
              >
                <SelectTrigger 
                  id="planType"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.planType && formErrors.planType ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择计划类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="日常饲养">日常饲养</SelectItem>
                  <SelectItem value="特殊护理">特殊护理</SelectItem>
                  <SelectItem value="实验期管理">实验期管理</SelectItem>
                  <SelectItem value="康复护理">康复护理</SelectItem>
                  <SelectItem value="隔离观察">隔离观察</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.planType && <ErrorMessage message={formErrors.planType || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-muted-foreground">开始日期</Label>
              <Input 
                id="startDate" 
                type="date"
                value={formData.startDate.toISOString().split('T')[0]} 
                onChange={(e) => updateFormData("startDate", new Date(e.target.value))} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-muted-foreground">结束日期</Label>
              <Input 
                id="endDate" 
                type="date"
                value={formData.endDate.toISOString().split('T')[0]} 
                onChange={(e) => updateFormData("endDate", new Date(e.target.value))} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">计划描述</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => updateFormData("description", e.target.value)} 
              placeholder="请描述饲养管理计划的目标和要求"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 饲养计划 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Utensils className="h-5 w-5" />} 
            title="饲养计划" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedType" className="text-muted-foreground">饲料类型 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.feedType} 
                onValueChange={(value) => updateFormData("feedType", value)}
              >
                <SelectTrigger 
                  id="feedType"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.feedType && formErrors.feedType ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择饲料类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="标准饲料">标准饲料</SelectItem>
                  <SelectItem value="高营养饲料">高营养饲料</SelectItem>
                  <SelectItem value="特殊配方饲料">特殊配方饲料</SelectItem>
                  <SelectItem value="低脂饲料">低脂饲料</SelectItem>
                  <SelectItem value="高纤维饲料">高纤维饲料</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.feedType && <ErrorMessage message={formErrors.feedType || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedingFrequency" className="text-muted-foreground">喂食频率 <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.feedingFrequency} 
                onValueChange={(value) => updateFormData("feedingFrequency", value)}
              >
                <SelectTrigger 
                  id="feedingFrequency"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.feedingFrequency && formErrors.feedingFrequency ? "border-red-500" : ""
                  )}
                >
                  <SelectValue placeholder="请选择喂食频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日1次">每日1次</SelectItem>
                  <SelectItem value="每日2次">每日2次</SelectItem>
                  <SelectItem value="每日3次">每日3次</SelectItem>
                  <SelectItem value="自由取食">自由取食</SelectItem>
                  <SelectItem value="按需喂食">按需喂食</SelectItem>
                </SelectContent>
              </Select>
              {formTouched.feedingFrequency && <ErrorMessage message={formErrors.feedingFrequency || ""} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedAmount" className="text-muted-foreground">每次喂食量</Label>
              <Input 
                id="feedAmount" 
                value={formData.feedAmount} 
                onChange={(e) => updateFormData("feedAmount", e.target.value)} 
                placeholder="如：10-15g/只"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterSupply" className="text-muted-foreground">饮水供应</Label>
              <Select 
                value={formData.waterSupply} 
                onValueChange={(value) => updateFormData("waterSupply", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择饮水供应方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="自动饮水器">自动饮水器</SelectItem>
                  <SelectItem value="水瓶供水">水瓶供水</SelectItem>
                  <SelectItem value="定时更换">定时更换</SelectItem>
                  <SelectItem value="净化水源">净化水源</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 环境管理 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Thermometer className="h-5 w-5" />} 
            title="环境管理" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">温度范围 (°C)</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={formData.temperatureRange.min} 
                  onChange={(e) => updateFormData("temperatureRange", { ...formData.temperatureRange, min: e.target.value })} 
                  placeholder="最低温度"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  value={formData.temperatureRange.max} 
                  onChange={(e) => updateFormData("temperatureRange", { ...formData.temperatureRange, max: e.target.value })} 
                  placeholder="最高温度"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">湿度范围 (%)</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={formData.humidityRange.min} 
                  onChange={(e) => updateFormData("humidityRange", { ...formData.humidityRange, min: e.target.value })} 
                  placeholder="最低湿度"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  value={formData.humidityRange.max} 
                  onChange={(e) => updateFormData("humidityRange", { ...formData.humidityRange, max: e.target.value })} 
                  placeholder="最高湿度"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lightCycle" className="text-muted-foreground">光照周期</Label>
              <Select 
                value={formData.lightCycle} 
                onValueChange={(value) => updateFormData("lightCycle", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择光照周期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12小时明暗循环">12小时明暗循环</SelectItem>
                  <SelectItem value="14小时明10小时暗">14小时明10小时暗</SelectItem>
                  <SelectItem value="10小时明14小时暗">10小时明14小时暗</SelectItem>
                  <SelectItem value="连续光照">连续光照</SelectItem>
                  <SelectItem value="连续黑暗">连续黑暗</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ventilationLevel" className="text-muted-foreground">通风等级</Label>
              <Select 
                value={formData.ventilationLevel} 
                onValueChange={(value) => updateFormData("ventilationLevel", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择通风等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="标准通风">标准通风</SelectItem>
                  <SelectItem value="增强通风">增强通风</SelectItem>
                  <SelectItem value="最小通风">最小通风</SelectItem>
                  <SelectItem value="负压通风">负压通风</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 健康监测 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Heart className="h-5 w-5" />} 
            title="健康监测" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthCheckFrequency" className="text-muted-foreground">健康检查频率</Label>
              <Select 
                value={formData.healthCheckFrequency} 
                onValueChange={(value) => updateFormData("healthCheckFrequency", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择检查频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日检查">每日检查</SelectItem>
                  <SelectItem value="每周检查">每周检查</SelectItem>
                  <SelectItem value="每月检查">每月检查</SelectItem>
                  <SelectItem value="按需检查">按需检查</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightMonitoring" className="text-muted-foreground">体重监测</Label>
              <Select 
                value={formData.weightMonitoring} 
                onValueChange={(value) => updateFormData("weightMonitoring", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择监测频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日称重">每日称重</SelectItem>
                  <SelectItem value="每周称重">每周称重</SelectItem>
                  <SelectItem value="每月称重">每月称重</SelectItem>
                  <SelectItem value="实验前后称重">实验前后称重</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="behaviorObservation" className="text-muted-foreground">行为观察</Label>
            <Textarea 
              id="behaviorObservation" 
              value={formData.behaviorObservation} 
              onChange={(e) => updateFormData("behaviorObservation", e.target.value)} 
              placeholder="请描述需要观察的行为指标和异常表现"
              className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 人员安排 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Users className="h-5 w-5" />} 
            title="人员安排" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryCaretaker" className="text-muted-foreground">主要饲养员 <span className="text-red-500">*</span></Label>
              <Input 
                id="primaryCaretaker" 
                value={formData.primaryCaretaker} 
                onChange={(e) => updateFormData("primaryCaretaker", e.target.value)} 
                onBlur={() => handleBlur("primaryCaretaker")}
                placeholder="请输入主要饲养员姓名"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.primaryCaretaker && formErrors.primaryCaretaker ? "border-red-500" : ""
                )}
              />
              {formTouched.primaryCaretaker && <ErrorMessage message={formErrors.primaryCaretaker || ""} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupCaretaker" className="text-muted-foreground">备用饲养员</Label>
              <Input 
                id="backupCaretaker" 
                value={formData.backupCaretaker} 
                onChange={(e) => updateFormData("backupCaretaker", e.target.value)} 
                placeholder="请输入备用饲养员姓名"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="veterinarian" className="text-muted-foreground">兽医师</Label>
              <Input 
                id="veterinarian" 
                value={formData.veterinarian} 
                onChange={(e) => updateFormData("veterinarian", e.target.value)} 
                placeholder="请输入负责兽医师姓名"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisorApproval" className="text-muted-foreground">监管人员</Label>
              <Input 
                id="supervisorApproval" 
                value={formData.supervisorApproval} 
                onChange={(e) => updateFormData("supervisorApproval", e.target.value)} 
                placeholder="请输入监管人员姓名"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 清洁维护 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<ShieldIcon className="h-5 w-5" />} 
            title="清洁维护" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cageCleaningSchedule" className="text-muted-foreground">笼具清洁频率</Label>
              <Select 
                value={formData.cageCleaningSchedule} 
                onValueChange={(value) => updateFormData("cageCleaningSchedule", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择清洁频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日清洁">每日清洁</SelectItem>
                  <SelectItem value="每2天清洁">每2天清洁</SelectItem>
                  <SelectItem value="每周清洁">每周清洁</SelectItem>
                  <SelectItem value="按需清洁">按需清洁</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomCleaningSchedule" className="text-muted-foreground">房间清洁频率</Label>
              <Select 
                value={formData.roomCleaningSchedule} 
                onValueChange={(value) => updateFormData("roomCleaningSchedule", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择清洁频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日清洁">每日清洁</SelectItem>
                  <SelectItem value="每周清洁">每周清洁</SelectItem>
                  <SelectItem value="每月清洁">每月清洁</SelectItem>
                  <SelectItem value="深度清洁">深度清洁</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disinfectionSchedule" className="text-muted-foreground">消毒计划</Label>
              <Select 
                value={formData.disinfectionSchedule} 
                onValueChange={(value) => updateFormData("disinfectionSchedule", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择消毒频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日消毒">每日消毒</SelectItem>
                  <SelectItem value="每周消毒">每周消毒</SelectItem>
                  <SelectItem value="每月消毒">每月消毒</SelectItem>
                  <SelectItem value="紫外线消毒">紫外线消毒</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedChangingSchedule" className="text-muted-foreground">垫料更换</Label>
              <Select 
                value={formData.bedChangingSchedule} 
                onValueChange={(value) => updateFormData("bedChangingSchedule", value)}
              >
                <SelectTrigger className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1">
                  <SelectValue placeholder="请选择更换频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每日更换">每日更换</SelectItem>
                  <SelectItem value="每2-3天更换">每2-3天更换</SelectItem>
                  <SelectItem value="每周更换">每周更换</SelectItem>
                  <SelectItem value="按需更换">按需更换</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 记录要求 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<Clock className="h-5 w-5" />} 
            title="记录要求" 
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyObservationRequired" className="text-muted-foreground">每日观察记录</Label>
              <Switch
                id="dailyObservationRequired"
                checked={formData.dailyObservationRequired}
                onCheckedChange={(checked) => updateFormData("dailyObservationRequired", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="weightRecordRequired" className="text-muted-foreground">体重记录</Label>
              <Switch
                id="weightRecordRequired"
                checked={formData.weightRecordRequired}
                onCheckedChange={(checked) => updateFormData("weightRecordRequired", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="feedingLogRequired" className="text-muted-foreground">喂食记录</Label>
              <Switch
                id="feedingLogRequired"
                checked={formData.feedingLogRequired}
                onCheckedChange={(checked) => updateFormData("feedingLogRequired", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="healthLogRequired" className="text-muted-foreground">健康记录</Label>
              <Switch
                id="healthLogRequired"
                checked={formData.healthLogRequired}
                onCheckedChange={(checked) => updateFormData("healthLogRequired", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="incidentReportRequired" className="text-muted-foreground">异常事件报告</Label>
              <Switch
                id="incidentReportRequired"
                checked={formData.incidentReportRequired}
                onCheckedChange={(checked) => updateFormData("incidentReportRequired", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成本预算 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<DollarSign className="h-5 w-5" />} 
            title="成本预算" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedCost" className="text-muted-foreground">饲料成本 (元/月)</Label>
              <Input 
                id="feedCost" 
                value={formData.feedCost} 
                onChange={(e) => updateFormData("feedCost", e.target.value)} 
                placeholder="预估月度饲料成本"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicationCost" className="text-muted-foreground">医疗成本 (元/月)</Label>
              <Input 
                id="medicationCost" 
                value={formData.medicationCost} 
                onChange={(e) => updateFormData("medicationCost", e.target.value)} 
                placeholder="预估月度医疗成本"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborCost" className="text-muted-foreground">人工成本 (元/月)</Label>
              <Input 
                id="laborCost" 
                value={formData.laborCost} 
                onChange={(e) => updateFormData("laborCost", e.target.value)} 
                placeholder="预估月度人工成本"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost" className="text-muted-foreground">总预算 (元/月)</Label>
              <Input 
                id="estimatedCost" 
                value={formData.estimatedCost} 
                onChange={(e) => updateFormData("estimatedCost", e.target.value)} 
                placeholder="预估月度总成本"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
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
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContacts" className="text-muted-foreground">紧急联系人</Label>
              <Textarea 
                id="emergencyContacts" 
                value={formData.emergencyContacts} 
                onChange={(e) => updateFormData("emergencyContacts", e.target.value)} 
                placeholder="紧急情况联系人信息（姓名、电话）"
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
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

            {/* 安全提示 */}
            <div className="flex items-start space-x-2 pt-4">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">安全提示</p>
                <p>
                  请确保饲养管理计划符合实验动物饲养标准，定期检查动物健康状态，及时记录异常情况。
                  所有饲养操作应严格按照标准操作程序执行，确保动物福利和实验质量。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          创建饲养计划
        </Button>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <DialogTitle>创建成功</DialogTitle>
            </div>
            <DialogDescription>
              饲养管理计划已成功创建。您可以继续添加新的计划或返回列表查看。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续添加
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 