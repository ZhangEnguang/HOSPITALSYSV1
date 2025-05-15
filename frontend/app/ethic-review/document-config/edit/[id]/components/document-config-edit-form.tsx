"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  ListIcon,
  PlusCircle,
  Trash2,
  Save,
  Upload,
  Eye,
  Copy,
  FileUp,
  BrainCog,
  PlusIcon,
  Lightbulb,
  Sparkles,
  Brain,
  Download
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
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  REVIEW_TYPE_OPTIONS, 
  PROJECT_TYPE_OPTIONS, 
  DOCUMENT_TYPE_OPTIONS,
  REQUIREMENT_LEVEL_OPTIONS,
  documentConfigItems
} from "../../../data/document-config-demo-data"
import { Badge } from "@/components/ui/badge"

// 添加文档类型定义
interface DocumentItem {
  id: string
  name: string
  type: string
  requirementLevel: string
  template: boolean
  templateFile?: File | null
  description: string
}

// 添加配置数据类型
interface ConfigData {
  id: string
  name: string
  reviewType: string
  projectType: string
  description: string
  status: string
  documents: DocumentItem[]
  documentCount: number
  requiredCount: number
  optionalCount: number
  templateCount: number
  createdBy?: any
  createdAt?: string
  updatedAt?: string
}

// 编辑表单组件
export function DocumentConfigEditForm({ configData }: { configData: ConfigData }) {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息 - 预填充现有数据
    name: configData.name || "",
    reviewType: configData.reviewType || "",
    projectType: configData.projectType || "",
    description: configData.description || "",
    status: configData.status || "enabled",
    
    // 送审文件清单 - 预填充现有文档
    documents: configData.documents.map(doc => ({
      ...doc,
      templateFile: null // 重置文件对象，因为File对象无法从服务端传递
    })) as DocumentItem[]
  })

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 复制配置对话框状态
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState("")
  
  // 获取参考配置列表
  const configOptions = documentConfigItems
    .filter(item => item.id !== configData.id) // 排除当前编辑的配置
    .map(item => ({
      id: item.id,
      name: item.name,
      reviewType: item.reviewType,
      projectType: item.projectType
    }))

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormTouched(prev => ({ ...prev, [field]: true }))
    
    // 如果字段有错误，更新后清除错误
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 处理输入框失焦
  const handleBlur = (field: string) => {
    setFormTouched(prev => ({ ...prev, [field]: true }))
  }

  // 更新文档数据
  const updateDocumentData = (index: number, field: string, value: any) => {
    const updatedDocuments = [...formData.documents]
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value
    }
    
    setFormData(prev => ({
      ...prev,
      documents: updatedDocuments
    }))
    
    // 标记文档字段为已触摸
    setFormTouched(prev => ({ 
      ...prev, 
      [`documents[${index}].${field}`]: true 
    }))
  }

  // 处理模板文件上传
  const handleTemplateUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      updateDocumentData(index, 'templateFile', file)
    }
  }

  // 处理从现有配置复制
  const handleCopyFromExisting = () => {
    if (!selectedConfig) return
    
    const sourceConfig = documentConfigItems.find(item => item.id === selectedConfig)
    if (sourceConfig) {
      // 复制文档，但保留原始ID
      const sourceDocuments = sourceConfig.documents.map(doc => ({
        ...doc,
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        templateFile: null
      }))
      
      setFormData(prev => ({
        ...prev,
        documents: sourceDocuments
      }))
      
      setShowCopyDialog(false)
      
      toast({
        title: "复制成功",
        description: `已从「${sourceConfig.name}」复制了 ${sourceDocuments.length} 个文件项`,
      })
    }
  }

  // 添加新文档
  const addDocument = () => {
    const newDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      type: "",
      requirementLevel: "必交",
      template: false,
      templateFile: null,
      description: ""
    }
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }))
  }

  // 删除文档
  const removeDocument = (index: number) => {
    const updatedDocuments = [...formData.documents]
    updatedDocuments.splice(index, 1)
    
    setFormData(prev => ({
      ...prev,
      documents: updatedDocuments
    }))
  }

  // 表单验证
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // 基本信息验证
    if (!formData.name.trim()) {
      errors['name'] = "配置名称不能为空"
    }
    
    if (!formData.reviewType) {
      errors['reviewType'] = "请选择审查类型"
    }
    
    if (!formData.projectType) {
      errors['projectType'] = "请选择项目类型"
    }
    
    // 文档列表验证
    formData.documents.forEach((doc, index) => {
      if (!doc.name.trim()) {
        errors[`documents[${index}].name`] = "文件名称不能为空"
      }
      
      if (!doc.type) {
        errors[`documents[${index}].type`] = "请选择文件类型"
      }
      
      if (doc.template && !doc.templateFile && !configData.documents[index]?.template) {
        errors[`documents[${index}].templateFile`] = "请上传模板文件"
      }
    })
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 保存草稿
  const handleSaveDraft = () => {
    toast({
      title: "保存成功",
      description: "配置已保存为草稿",
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "表单验证失败",
        description: "请检查表单中的错误并修正",
        variant: "destructive",
      })
      return
    }
    
    // 模拟API请求 - 实际环境中应调用更新接口
    console.log("更新配置：", {
      id: configData.id,
      ...formData
    })
    
    setShowCompletionDialog(true)
  }

  // 处理继续添加
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    router.push("/ethic-review/document-config/create")
  }

  // 处理返回列表
  const handleReturnToList = () => {
    router.push(`/ethic-review/document-config`)
  }

  // 自定义节标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
      </div>
    )
  }

  // 自定义错误消息组件
  const ErrorMessage = ({ message }: { message: string }) => {
    return (
      <div className="flex items-center text-red-500 text-sm mt-1">
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>{message}</span>
      </div>
    )
  }

  // 设置按钮高度
  const buttonsHeight = 32;

  // 处理返回按钮点击
  const handleBack = () => {
    router.push(`/ethic-review/document-config`);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="h-8 w-8 flex items-center justify-center border rounded-md text-gray-500 hover:text-primary transition-colors duration-200 bg-white shadow-sm"
            style={{ height: `${buttonsHeight}px`, width: `${buttonsHeight}px` }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold">编辑送审文件配置</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            保存草稿
          </Button>
          <Button onClick={handleSubmit}>
            保存更改
          </Button>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="space-y-6">
        {/* 基本信息卡片 */}
        <Card>
          <CardContent className="pt-6">
            <SectionTitle 
              icon={<FileTextIcon className="h-5 w-5" />}
              title="基本信息"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* 配置名称 */}
              <div className="space-y-2">
                <Label htmlFor="name">配置名称</Label>
                <Input
                  id="name"
                  placeholder="请输入送审文件配置名称"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={cn(
                    formTouched['name'] && formErrors['name'] ? "border-red-500" : ""
                  )}
                />
                {formTouched['name'] && formErrors['name'] && (
                  <ErrorMessage message={formErrors['name']} />
                )}
              </div>
              
              {/* 审查类型 */}
              <div className="space-y-2">
                <Label htmlFor="reviewType">审查类型</Label>
                <Select
                  value={formData.reviewType}
                  onValueChange={(value) => updateFormData('reviewType', value)}
                  onOpenChange={() => handleBlur('reviewType')}
                >
                  <SelectTrigger 
                    className={cn(
                      formTouched['reviewType'] && formErrors['reviewType'] ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue placeholder="请选择审查类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEW_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formTouched['reviewType'] && formErrors['reviewType'] && (
                  <ErrorMessage message={formErrors['reviewType']} />
                )}
              </div>
              
              {/* 项目类型 */}
              <div className="space-y-2">
                <Label htmlFor="projectType">适用项目类型</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => updateFormData('projectType', value)}
                  onOpenChange={() => handleBlur('projectType')}
                >
                  <SelectTrigger 
                    className={cn(
                      formTouched['projectType'] && formErrors['projectType'] ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue placeholder="请选择项目类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formTouched['projectType'] && formErrors['projectType'] && (
                  <ErrorMessage message={formErrors['projectType']} />
                )}
              </div>
              
              {/* 配置描述 */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">配置描述</Label>
                <Textarea
                  id="description"
                  placeholder="请输入配置描述..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              {/* 状态 */}
              <div className="space-y-2">
                <Label>状态</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-enabled"
                      checked={formData.status === "enabled"}
                      onCheckedChange={() => updateFormData('status', "enabled")}
                    />
                    <label htmlFor="status-enabled" className="text-sm">
                      启用
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-disabled"
                      checked={formData.status === "disabled"}
                      onCheckedChange={() => updateFormData('status', "disabled")}
                    />
                    <label htmlFor="status-disabled" className="text-sm">
                      禁用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 送审文件清单卡片 */}
        <Card>
          <CardContent className="pt-6">
            <SectionTitle 
              icon={<ListIcon className="h-5 w-5" />}
              title="送审文件清单"
            />
            
            <div className="mt-4">
              {/* 带有边框的横向滚动容器 */}
              <div className="overflow-x-auto border rounded-md" style={{ maxWidth: '100%' }}>
                <Table className="min-w-[1200px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">文件名称</TableHead>
                      <TableHead className="w-[150px]">文件类型</TableHead>
                      <TableHead className="w-[100px]">需求级别</TableHead>
                      <TableHead className="w-[100px]">是否有模板</TableHead>
                      <TableHead className="w-[200px]">模板文件</TableHead>
                      <TableHead className="w-[300px]">文件描述</TableHead>
                      <TableHead className="w-[100px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.documents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          暂无送审文件，请添加
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.documents.map((document, index) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <Input
                              placeholder="文件名称"
                              value={document.name}
                              onChange={(e) => updateDocumentData(index, 'name', e.target.value)}
                              onBlur={() => setFormTouched(prev => ({ ...prev, [`documents[${index}].name`]: true }))}
                              className={cn(
                                "max-w-[230px]",
                                formTouched[`documents[${index}].name`] && formErrors[`documents[${index}].name`] ? "border-red-500" : ""
                              )}
                            />
                            {formTouched[`documents[${index}].name`] && formErrors[`documents[${index}].name`] && (
                              <ErrorMessage message={formErrors[`documents[${index}].name`]} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={document.type}
                              onValueChange={(value) => updateDocumentData(index, 'type', value)}
                              onOpenChange={() => setFormTouched(prev => ({ ...prev, [`documents[${index}].type`]: true }))}
                            >
                              <SelectTrigger
                                className={cn(
                                  "max-w-[140px]",
                                  formTouched[`documents[${index}].type`] && formErrors[`documents[${index}].type`] ? "border-red-500" : ""
                                )}
                              >
                                <SelectValue placeholder="请选择" />
                              </SelectTrigger>
                              <SelectContent>
                                {DOCUMENT_TYPE_OPTIONS.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formTouched[`documents[${index}].type`] && formErrors[`documents[${index}].type`] && (
                              <ErrorMessage message={formErrors[`documents[${index}].type`]} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={document.requirementLevel}
                              onValueChange={(value) => updateDocumentData(index, 'requirementLevel', value)}
                            >
                              <SelectTrigger className="max-w-[80px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {REQUIREMENT_LEVEL_OPTIONS.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Checkbox
                                checked={document.template}
                                onCheckedChange={(checked) => updateDocumentData(index, 'template', checked)}
                              />
                              <label className="ml-2 text-sm">是</label>
                            </div>
                          </TableCell>
                          <TableCell>
                            {document.template && (
                              <div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    asChild
                                  >
                                    <label>
                                      <input
                                        type="file"
                                        className="sr-only"
                                        onChange={(e) => handleTemplateUpload(index, e)}
                                      />
                                      <Upload className="h-3 w-3 mr-1" />
                                      上传
                                    </label>
                                  </Button>
                                </div>
                                {formTouched[`documents[${index}].templateFile`] && formErrors[`documents[${index}].templateFile`] && (
                                  <ErrorMessage message={formErrors[`documents[${index}].templateFile`]} />
                                )}
                                {document.templateFile && (
                                  <div className="text-xs text-gray-500 mt-1 truncate max-w-[190px]">
                                    {document.templateFile.name}
                                  </div>
                                )}
                                {!document.templateFile && configData.documents[index]?.template && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    已有模板文件
                                  </div>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Textarea
                              placeholder="文件描述..."
                              value={document.description}
                              onChange={(e) => updateDocumentData(index, 'description', e.target.value)}
                              className="min-h-[60px] text-sm w-full"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  共 <span className="font-medium">{formData.documents.length}</span> 个文件项
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 操作按钮 */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
            >
              保存草稿
            </Button>
            <Button onClick={handleSubmit}>
              保存更改
            </Button>
          </div>
        </div>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>配置已更新</span>
            </DialogTitle>
            <DialogDescription>
              送审文件配置已成功更新！
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center w-full">
              <p className="font-medium">配置详情</p>
              <p className="text-sm mt-1">名称：{formData.name}</p>
              <p className="text-sm">包含 {formData.documents.length} 个文件项</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="outline" onClick={handleContinueAdding}>
              继续添加配置
            </Button>
            <Button onClick={handleReturnToList}>
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 复制配置对话框 */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>从现有配置复制</DialogTitle>
            <DialogDescription>
              选择一个现有的送审文件配置作为基础
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="configSelect">选择配置</Label>
            <Select
              value={selectedConfig}
              onValueChange={setSelectedConfig}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="请选择配置" />
              </SelectTrigger>
              <SelectContent>
                {configOptions.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    <div className="flex flex-col">
                      <span>{config.name}</span>
                      <span className="text-xs text-gray-500">
                        {config.reviewType} / {config.projectType}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCopyFromExisting} disabled={!selectedConfig}>
              确认复制
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}