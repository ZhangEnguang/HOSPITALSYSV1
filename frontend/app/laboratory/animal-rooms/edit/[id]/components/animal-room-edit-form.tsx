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
  Users,
  Plus,
  Search,
  Trash2
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

// 导入动物档案数据
import { allDemoAnimalItems } from "../../../../animal-files/data/animal-files-demo-data"
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
    department: "",
    manager: "",
    building: "",
    location: "",
    notes: "",
    status: "",
  })

  // 关联动物列表状态
  const [associatedAnimals, setAssociatedAnimals] = useState<any[]>([])
  
  // 动物选择对话框状态
  const [showAnimalDialog, setShowAnimalDialog] = useState(false)
  const [availableAnimals, setAvailableAnimals] = useState<any[]>([])
  const [animalSearchTerm, setAnimalSearchTerm] = useState("")
  
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
          department: roomData.department,
          manager: roomData.manager,
          building: roomData.location.includes('栋') ? roomData.location.split('栋')[0] + '栋' : "",
          location: roomData.location.includes('栋') ? roomData.location.split('栋')[1] || roomData.location : roomData.location,
          notes: roomData.notes || "",
          status: roomData.status,
        })
        
        // 模拟当前关联的动物（基于入住数量）
        const currentAnimals = allDemoAnimalItems
          .filter(animal => animal.status === "健康" || animal.status === "观察中")
          .slice(0, roomData.currentOccupancy)
        setAssociatedAnimals(currentAnimals)
      } else {
        router.push('/laboratory/animal-rooms')
        return
      }
      
      setLoading(false)
    }

    const loadAvailableAnimals = () => {
      const healthyAnimals = allDemoAnimalItems.filter(animal => 
        animal.status === "健康" || animal.status === "观察中"
      )
      setAvailableAnimals(healthyAnimals)
    }

    if (roomId) {
      loadRoomData()
      loadAvailableAnimals()
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
      images: uploadedImages,
      associatedAnimals: associatedAnimals,
      currentOccupancy: associatedAnimals.length.toString()
    }
    
    console.log("更新动物房数据:", roomData)
    setShowCompletionDialog(true)
  }

  // 返回列表页面
  const handleReturnToList = () => {
    router.push('/laboratory/animal-rooms')
  }

  // 添加动物到动物房
  const handleAddAnimal = (animal: any) => {
    if (associatedAnimals.find(a => a.id === animal.id)) {
      toast({
        title: "动物已存在",
        description: "该动物已经添加到动物房中",
        variant: "destructive"
      })
      return
    }
    
    if (associatedAnimals.length >= parseInt(formData.capacity || "0")) {
      toast({
        title: "容量已满",
        description: "动物房容量已满，无法添加更多动物",
        variant: "destructive"
      })
      return
    }
    
    setAssociatedAnimals(prev => [...prev, animal])
    setShowAnimalDialog(false)
    setAnimalSearchTerm("")
    
    toast({
      title: "添加成功",
      description: `动物 ${animal.animalId} 已添加到动物房`,
    })
  }

  // 移除关联动物
  const handleRemoveAnimal = (animalId: string) => {
    setAssociatedAnimals(prev => prev.filter(animal => animal.id !== animalId))
    toast({
      title: "移除成功",
      description: "动物已从动物房中移除",
    })
  }

  // 过滤可选动物
  const filteredAvailableAnimals = availableAnimals.filter(animal =>
    animal.animalId.toLowerCase().includes(animalSearchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(animalSearchTerm.toLowerCase()) ||
    animal.strain.toLowerCase().includes(animalSearchTerm.toLowerCase())
  )

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
              <Label htmlFor="capacity" className="text-muted-foreground">容量 <span className="text-red-500">*</span></Label>
              <Input 
                id="capacity" 
                type="number"
                value={formData.capacity} 
                onChange={(e) => updateFormData("capacity", e.target.value)} 
                onBlur={() => handleBlur("capacity")}
                placeholder="最大容纳动物数量"
                className={cn(
                  "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                  formTouched.capacity && formErrors.capacity ? "border-red-500" : ""
                )}
              />
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

      {/* 关联动物 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <SectionTitle 
              icon={<Users className="h-5 w-5" />} 
              title="关联动物" 
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAnimalDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              添加动物
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            当前入住: {associatedAnimals.length} / {formData.capacity || 0}
          </div>

          {associatedAnimals.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>动物编号</TableHead>
                    <TableHead>种类</TableHead>
                    <TableHead>品系</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>责任人</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associatedAnimals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-medium">{animal.animalId}</TableCell>
                      <TableCell>{animal.species}</TableCell>
                      <TableCell>{animal.strain}</TableCell>
                      <TableCell>{animal.gender}</TableCell>
                      <TableCell>
                        <Badge variant={animal.status === "健康" ? "default" : "secondary"}>
                          {animal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{animal.responsible}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAnimal(animal.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>暂无关联动物</p>
              <p className="text-sm">点击"添加动物"关联现有动物档案</p>
            </div>
          )}

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

      {/* 动物选择对话框 */}
      <Dialog open={showAnimalDialog} onOpenChange={setShowAnimalDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择动物</DialogTitle>
            <DialogDescription>
              从现有动物档案中选择要添加到动物房的动物
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索动物编号、种类或品系..."
                value={animalSearchTerm}
                onChange={(e) => setAnimalSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            {filteredAvailableAnimals.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>动物编号</TableHead>
                      <TableHead>种类</TableHead>
                      <TableHead>品系</TableHead>
                      <TableHead>性别</TableHead>
                      <TableHead>年龄</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>当前位置</TableHead>
                      <TableHead className="w-20">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvailableAnimals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">{animal.animalId}</TableCell>
                        <TableCell>{animal.species}</TableCell>
                        <TableCell>{animal.strain}</TableCell>
                        <TableCell>{animal.gender}</TableCell>
                        <TableCell>{animal.age}周</TableCell>
                        <TableCell>
                          <Badge variant={animal.status === "健康" ? "default" : "secondary"}>
                            {animal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {animal.location}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddAnimal(animal)}
                            disabled={associatedAnimals.find(a => a.id === animal.id) !== undefined}
                          >
                            {associatedAnimals.find(a => a.id === animal.id) ? "已添加" : "添加"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>没有找到符合条件的动物</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnimalDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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