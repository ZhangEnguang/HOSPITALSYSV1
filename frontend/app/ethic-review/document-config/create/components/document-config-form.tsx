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
  Brain
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  REVIEW_TYPE_OPTIONS, 
  PROJECT_TYPE_OPTIONS, 
  DOCUMENT_TYPE_OPTIONS,
  REQUIREMENT_LEVEL_OPTIONS,
  documentConfigItems
} from "../../data/document-config-demo-data"
import { Badge } from "@/components/ui/badge"

// 添加文档类型定义
interface DocumentItem {
  id: string
  name: string
  type: string
  requirementLevel: string
  template: boolean
  templateFile: File | null
  description: string
}

// 送审文件配置表单组件
export function DocumentConfigForm() {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    reviewType: "",
    projectType: "",
    description: "",
    status: "enabled",
    
    // 送审文件清单
    documents: [
      { 
        id: `doc-${Date.now()}`,
        name: "", 
        type: "", 
        requirementLevel: "必交", 
        template: false,
        templateFile: null,
        description: "" 
      } as DocumentItem
    ]
  })

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 模板预览对话框状态
  const [showTemplatePreview, setShowTemplatePreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<{name: string, file: File | null} | null>(null)
  
  // 复制配置对话框状态
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState("")
  
  // 添加智能推荐状态
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [recommendations, setRecommendations] = useState<DocumentItem[]>([])
  
  // 获取参考配置列表
  const configOptions = documentConfigItems.map(item => ({
    id: item.id,
    name: item.name,
    reviewType: item.reviewType,
    projectType: item.projectType
  }))

  // 添加智能推荐数据库（按审查类型和项目类型分类的推荐文件）
  const recommendationDatabase = {
    "人体初始审查": {
      "人体": [
        { name: "初始审查申请表", type: "申请表", requirementLevel: "必交", description: "人体研究初始审查标准申请表" },
        { name: "项目详细方案", type: "研究方案", requirementLevel: "必交", description: "详细的研究方案，包括背景、目标、方法等" },
        { name: "知情同意书", type: "知情同意书", requirementLevel: "必交", description: "受试者/参与者知情同意书" },
        { name: "项目预算书", type: "项目预算书", requirementLevel: "必交", description: "项目经费使用计划" },
        { name: "研究者简历", type: "其他", requirementLevel: "必交", description: "主要研究者及参与者简历" },
        { name: "相关文献", type: "参考资料", requirementLevel: "选交", description: "支持研究的相关文献资料" },
      ]
    },
    "动物初始审查": {
      "动物": [
        { name: "动物实验申请表", type: "申请表", requirementLevel: "必交", description: "动物实验标准申请表" },
        { name: "动物实验方案", type: "动物实验方案", requirementLevel: "必交", description: "详细的动物实验方案" },
        { name: "3R原则实施计划", type: "其他", requirementLevel: "必交", description: "减少、优化和替代原则的实施计划" },
        { name: "动物设施资质证明", type: "其他", requirementLevel: "选交", description: "动物实验设施的资质证明" },
      ]
    },
    "修正案审查": {
      "人体": [
        { name: "修正案申请表", type: "申请表", requirementLevel: "必交", description: "项目修正变更的标准申请表" },
        { name: "修正方案详细说明", type: "研究方案", requirementLevel: "必交", description: "修正内容的详细说明" },
        { name: "变更前后对比表", type: "其他", requirementLevel: "必交", description: "详细列出变更前后的内容对比" },
        { name: "原批准文件", type: "伦理批件", requirementLevel: "必交", description: "原伦理委员会批准文件" },
      ],
      "动物": [
        { name: "动物实验修正案申请表", type: "申请表", requirementLevel: "必交", description: "动物实验修正变更的标准申请表" },
        { name: "修正方案详细说明", type: "研究方案", requirementLevel: "必交", description: "修正内容的详细说明" },
        { name: "变更前后对比表", type: "其他", requirementLevel: "必交", description: "详细列出变更前后的内容对比" },
      ]
    },
    "年度/定期审查": {
      "人体": [
        { name: "年度/定期审查申请表", type: "申请表", requirementLevel: "必交", description: "项目年度/定期审查的标准申请表" },
        { name: "研究进展报告", type: "研究方案", requirementLevel: "必交", description: "详细的研究进展报告" },
        { name: "受试者/参与者统计", type: "其他", requirementLevel: "必交", description: "受试者/参与者招募与参与情况统计" },
        { name: "知情同意执行情况", type: "其他", requirementLevel: "必交", description: "知情同意实施情况说明" },
        { name: "数据安全报告", type: "其他", requirementLevel: "选交", description: "研究数据安全性情况报告" },
      ],
      "动物": [
        { name: "动物实验年度审查表", type: "申请表", requirementLevel: "必交", description: "动物实验年度审查的标准申请表" },
        { name: "实验进展报告", type: "研究方案", requirementLevel: "必交", description: "动物实验进展详细报告" },
        { name: "动物使用情况统计", type: "其他", requirementLevel: "必交", description: "实验动物使用数量和状况统计" },
      ]
    }
  }

  // 在useEffect中添加监听审查类型和项目类型变化，更新推荐列表
  useEffect(() => {
    if (formData.reviewType && formData.projectType) {
      // 获取对应审查类型和项目类型的推荐文件
      const typeRecommendations = recommendationDatabase[formData.reviewType as keyof typeof recommendationDatabase];
      if (typeRecommendations) {
        const projectRecommendations = typeRecommendations[formData.projectType as keyof typeof typeRecommendations];
        if (projectRecommendations) {
          // 转换为文档项目格式
          const recommendedDocs = (projectRecommendations as any[]).map((doc: any) => ({
            id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: doc.name,
            type: doc.type,
            requirementLevel: doc.requirementLevel,
            template: false,
            templateFile: null,
            description: doc.description
          } as DocumentItem));
          
          setRecommendations(recommendedDocs);
          return;
        }
      }
      // 如果没有找到匹配的推荐，清空推荐列表
      setRecommendations([]);
    }
  }, [formData.reviewType, formData.projectType]);

  // 添加处理一键添加单个推荐文件的函数
  const handleAddRecommendation = (recommendation: DocumentItem) => {
    setFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          ...recommendation,
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }
      ]
    }));
    
    toast({
      title: "已添加推荐文件",
      description: `已添加 "${recommendation.name}" 到文件清单`
    });
  };

  // 添加处理一键添加所有推荐文件的函数
  const handleAddAllRecommendations = () => {
    if (recommendations.length === 0) {
      toast({
        title: "无可用推荐",
        description: "当前没有可用的推荐文件，请先选择审查类型和项目类型"
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        ...recommendations.map(rec => ({
          ...rec,
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }))
      ]
    }));
    
    toast({
      title: "已添加全部推荐文件",
      description: `已添加 ${recommendations.length} 个推荐文件到清单`
    });
  };

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

  // 更新文件数据
  const updateDocumentData = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents]
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        [field]: value
      }
      return {
        ...prev,
        documents: updatedDocuments
      }
    })
  }

  // 处理模板文件上传
  const handleTemplateUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      updateDocumentData(index, "templateFile", file)
      updateDocumentData(index, "template", true)
      toast({
        title: "模板上传成功",
        description: `已上传模板文件: ${file.name}`
      })
    }
  }

  // 预览模板文件
  const handlePreviewTemplate = (index: number) => {
    const document = formData.documents[index];
    if (document.templateFile) {
      setPreviewTemplate({
        name: document.name || `文件${index+1}`,
        file: document.templateFile
      });
      setShowTemplatePreview(true);
    } else {
      toast({
        title: "暂无模板文件",
        description: "请先上传模板文件",
        variant: "destructive"
      });
    }
  };

  // 从现有配置复制
  const handleCopyFromExisting = () => {
    if (!selectedConfig) {
      toast({
        title: "请选择配置",
        description: "请先选择要复制的配置",
        variant: "destructive"
      })
      return
    }
    
    const selectedConfigData = documentConfigItems.find(item => item.id === selectedConfig)
    if (selectedConfigData) {
      // 转换文档数据格式
      const documents = selectedConfigData.documents.map(doc => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: doc.name,
        type: doc.type,
        requirementLevel: doc.requirementLevel,
        template: doc.template,
        templateFile: null, // 文件对象不能复制
        description: doc.description
      }))
      
      setFormData({
        name: `${selectedConfigData.name} - 副本`,
        reviewType: selectedConfigData.reviewType,
        projectType: selectedConfigData.projectType,
        description: selectedConfigData.description,
        status: selectedConfigData.status,
        documents: documents
      })
      
      setShowCopyDialog(false)
      
      toast({
        title: "复制成功",
        description: "已成功复制所选配置内容"
      })
    }
  }

  // 添加文件
  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        { 
          id: `doc-${Date.now()}-${prev.documents.length}`,
          name: "", 
          type: "", 
          requirementLevel: "必交", 
          template: false,
          templateFile: null,
          description: "" 
        } as DocumentItem
      ]
    }))
  }

  // 删除文件
  const removeDocument = (index: number) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents]
      updatedDocuments.splice(index, 1)
      return {
        ...prev,
        documents: updatedDocuments
      }
    })
  }

  // 验证表单
  const validateForm = () => {
    const requiredFields = ["name", "reviewType", "projectType"]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证基本信息必填字段
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${
          field === "name" ? "配置名称" : 
          field === "reviewType" ? "审查类型" : 
          field === "projectType" ? "项目类型" : ""
        }`
      }
    })
    
    // 验证文件清单
    if (formData.documents.length === 0) {
      isValid = false
      newErrors.documents = "请至少添加一个送审文件"
    } else {
      formData.documents.forEach((document, index) => {
        if (!document.name) {
          isValid = false
          newErrors[`document-${index}-name`] = "请填写文件名称"
        }
        if (!document.type) {
          isValid = false
          newErrors[`document-${index}-type`] = "请选择文件类型"
        }
      })
    }
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({
      ...prev,
      ...newTouched
    }))
    
    return isValid
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("点击保存草稿按钮")
    // 这里可以添加保存草稿的逻辑
    toast({
      title: "已保存草稿",
      description: "送审文件配置已保存为草稿"
    })
  }

  // 提交表单
  const handleSubmit = () => {
    console.log("点击确认按钮，开始验证表单")
    try {
      if (!validateForm()) {
        toast({
          title: "表单验证失败",
          description: "请检查并填写所有必填字段",
          variant: "destructive"
        })
        return
      }
      
      // 这里添加提交表单的逻辑
      console.log("提交表单数据:", formData)
      
      // 显示完成对话框
      setShowCompletionDialog(true)
    } catch (error) {
      console.error("表单提交出错:", error)
      toast({
        title: "提交失败",
        description: "表单提交过程中发生错误",
        variant: "destructive"
      })
    }
  }

  // 继续添加
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      name: "",
      reviewType: "",
      projectType: "",
      description: "",
      status: "enabled",
      documents: [
        { 
          id: `doc-${Date.now()}`,
          name: "", 
          type: "", 
          requirementLevel: "必交", 
          template: false,
          templateFile: null,
          description: "" 
        } as DocumentItem
      ]
    })
    
    // 重置错误和触摸状态
    setFormErrors({})
    setFormTouched({})
    
    toast({
      title: "已清空表单",
      description: "可以继续添加新配置"
    })
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/ethic-review/document-config")
  }

  // 自定义表单标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
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
    <div className="container py-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新建送审文件配置</h1>
        </div>
        
        {/* 添加复制配置按钮 */}
        <Button
          variant="outline"
          onClick={() => setShowCopyDialog(true)}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>从现有配置复制</span>
        </Button>
      </div>

      <div className="flex gap-4">
        {/* 左侧表单主体 */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* 基本信息 */}
          <Card>
            <CardContent className="pt-6">
              <SectionTitle icon={<FileTextIcon className="h-5 w-5" />} title="基本信息" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 配置名称 */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    配置名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="请输入配置名称"
                    className={cn(
                      formTouched.name && formErrors.name ? "border-red-500" : ""
                    )}
                  />
                  {formTouched.name && <ErrorMessage message={formErrors.name || ""} />}
                </div>

                {/* 审查类型 */}
                <div className="space-y-2">
                  <Label htmlFor="reviewType" className="text-sm font-medium">
                    审查类型 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.reviewType}
                    onValueChange={(value) => updateFormData("reviewType", value)}
                    onOpenChange={() => handleBlur("reviewType")}
                  >
                    <SelectTrigger 
                      id="reviewType"
                      className={cn(
                        formTouched.reviewType && formErrors.reviewType ? "border-red-500" : ""
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
                  {formTouched.reviewType && <ErrorMessage message={formErrors.reviewType || ""} />}
                </div>

                {/* 项目类型 */}
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-sm font-medium">
                    适用项目类型 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => updateFormData("projectType", value)}
                    onOpenChange={() => handleBlur("projectType")}
                  >
                    <SelectTrigger 
                      id="projectType"
                      className={cn(
                        formTouched.projectType && formErrors.projectType ? "border-red-500" : ""
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
                  {formTouched.projectType && <ErrorMessage message={formErrors.projectType || ""} />}
                </div>

                {/* 状态 */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    状态
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => updateFormData("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">启用</SelectItem>
                      <SelectItem value="disabled">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 配置描述 */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    配置描述
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="请输入配置描述"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 送审文件清单 */}
          <Card>
            <CardContent className="pt-6">
              <SectionTitle icon={<ListIcon className="h-5 w-5" />} title="送审文件清单" />
              
              {formErrors.documents && (
                <div className="mb-4">
                  <ErrorMessage message={formErrors.documents} />
                </div>
              )}

              <ScrollArea className="max-h-[600px]">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px] whitespace-nowrap">文件名称 <span className="text-red-500">*</span></TableHead>
                      <TableHead className="w-[110px] whitespace-nowrap">文件类型 <span className="text-red-500">*</span></TableHead>
                      <TableHead className="w-[90px] whitespace-nowrap">要求级别</TableHead>
                      <TableHead className="w-[80px] whitespace-nowrap">提供模板</TableHead>
                      <TableHead className="w-[140px] whitespace-nowrap">模板文件</TableHead>
                      <TableHead className="whitespace-nowrap">文件描述</TableHead>
                      <TableHead className="w-[70px] whitespace-nowrap text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.documents.map((document, index) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Input
                            value={document.name}
                            onChange={(e) => updateDocumentData(index, "name", e.target.value)}
                            placeholder="请输入文件名称"
                            className={cn(
                              formErrors[`document-${index}-name`] ? "border-red-500" : ""
                            )}
                          />
                          {formErrors[`document-${index}-name`] && (
                            <ErrorMessage message={formErrors[`document-${index}-name`] || ""} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={document.type}
                            onValueChange={(value) => updateDocumentData(index, "type", value)}
                          >
                            <SelectTrigger 
                              className={cn(
                                "w-full",
                                formErrors[`document-${index}-type`] ? "border-red-500" : ""
                              )}
                            >
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                            <SelectContent>
                              {DOCUMENT_TYPE_OPTIONS.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors[`document-${index}-type`] && (
                            <ErrorMessage message={formErrors[`document-${index}-type`] || ""} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={document.requirementLevel}
                            onValueChange={(value) => updateDocumentData(index, "requirementLevel", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="选择级别" />
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
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={document.template}
                              onCheckedChange={(checked) => 
                                updateDocumentData(index, "template", checked === true)
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {document.templateFile ? (
                              <>
                                <div className="relative flex-1 group">
                                  <div className="flex items-center p-1.5 pr-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-xs">
                                    <FileTextIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                    <span className="truncate max-w-[90px]">{document.templateFile.name}</span>
                                  </div>
                                  <div className="absolute inset-0 bg-blue-100/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <Label 
                                      htmlFor={`template-file-${index}`} 
                                      className="cursor-pointer h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-700 hover:bg-blue-50"
                                      title="更换模板"
                                    >
                                      <FileUp className="h-3 w-3" />
                                    </Label>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 rounded-full bg-white flex items-center justify-center text-blue-700 hover:bg-blue-50"
                                      onClick={() => handlePreviewTemplate(index)}
                                      title="预览模板"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Label 
                                htmlFor={`template-file-${index}`} 
                                className="flex items-center p-1.5 pr-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md cursor-pointer text-gray-600 text-xs transition-colors"
                              >
                                <FileUp className="h-3.5 w-3.5 mr-1.5" />
                                <span>上传模板</span>
                              </Label>
                            )}
                            <Input
                              id={`template-file-${index}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => handleTemplateUpload(index, e)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={document.description}
                            onChange={(e) => updateDocumentData(index, "description", e.target.value)}
                            placeholder="请输入文件描述"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            disabled={formData.documents.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDocument}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>添加文件</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 表单操作按钮 */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>保存草稿</span>
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>确认提交</span>
            </Button>
          </div>
        </div>
        
        {/* 右侧智能推荐面板 */}
        <div className="w-[330px] shrink-0">
          <Card className="sticky top-4 overflow-hidden border-blue-100 dark:border-blue-900/50 shadow-md bg-gradient-to-br from-white to-blue-50/20 dark:from-gray-900 dark:to-blue-950/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-xl"></div>
            
            <CardContent className="pt-6 px-5 relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 relative">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">智能推荐</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                >
                  {showRecommendations ? "隐藏" : "显示"}
                </Button>
              </div>
              
              {showRecommendations && (
                <div className="space-y-4">
                  {!formData.reviewType || !formData.projectType ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <div className="relative bg-gradient-to-b from-blue-50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <div className="absolute inset-0 rounded-full bg-blue-200/20 dark:bg-blue-500/10 animate-pulse"></div>
                        <Lightbulb className="h-10 w-10 text-blue-500 relative z-10" />
                      </div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">请先选择审查类型和项目类型</p>
                      <p className="mt-1 text-xs text-gray-500">以获取智能推荐文件清单</p>
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <div className="relative bg-gradient-to-b from-blue-50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <div className="absolute inset-0 rounded-full bg-blue-200/20 dark:bg-blue-500/10 animate-pulse"></div>
                        <Lightbulb className="h-10 w-10 text-blue-500 relative z-10" />
                      </div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">当前所选类型暂无推荐文件</p>
                      <p className="mt-1 text-xs text-gray-500">请尝试其他类型组合</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddAllRecommendations}
                          className="group w-full text-sm bg-white hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-4 w-4 animate-pulse text-blue-500" />
                          <span>一键添加全部推荐</span>
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[600px] pr-3">
                        <div className="space-y-2">
                          {recommendations.map((rec, index) => (
                            <div 
                              key={rec.id} 
                              className="group border border-blue-200 dark:border-blue-900/40 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:translate-y-[-2px]"
                              style={{
                                animationDelay: `${index * 100}ms`,
                                animation: "fadeInUp 0.5s ease-out forwards",
                                opacity: 0,
                                transform: "translateY(5px)",
                              }}
                            >
                              <style jsx global>{`
                                @keyframes fadeInUp {
                                  from {
                                    opacity: 0;
                                    transform: translateY(5px);
                                  }
                                  to {
                                    opacity: 1;
                                    transform: translateY(0);
                                  }
                                }
                              `}</style>
                              <div className="relative p-3">
                                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-500 opacity-80 rounded-tr-md rounded-br-md"></div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <h4 className="font-medium text-blue-800 dark:text-blue-300 pl-2 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">{rec.name}</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddRecommendation(rec)}
                                    className="h-6 w-6 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 p-0 text-blue-700 dark:text-blue-300 transition-all duration-300 hover:scale-105 opacity-70 group-hover:opacity-100"
                                    title="添加到文件清单"
                                  >
                                    <PlusIcon className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-1.5 pl-2">
                                  <Badge className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-xs px-2 py-0.5 rounded-md transition-colors duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 inline-block"></span>
                                    {rec.type}
                                  </Badge>
                                  <Badge 
                                    className={cn("text-xs px-2 py-0.5 rounded-md border-0 transition-colors duration-300",
                                      rec.requirementLevel === "必交" 
                                        ? "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/40" 
                                        : "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40"
                                    )}
                                  >
                                    <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 inline-block",
                                      rec.requirementLevel === "必交" 
                                        ? "bg-green-500 dark:bg-green-400" 
                                        : "bg-amber-500 dark:bg-amber-400"
                                    )}></span>
                                    {rec.requirementLevel}
                                  </Badge>
                                </div>
                                {rec.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pl-2 transition-colors duration-300 group-hover:text-gray-800 dark:group-hover:text-gray-300">{rec.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>文件配置创建成功</DialogTitle>
            <DialogDescription>
              送审文件配置已成功创建，请选择下一步操作
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleContinueAdding}
              className="flex-1"
            >
              继续添加
            </Button>
            <Button
              type="button"
              onClick={handleReturnToList}
              className="flex-1"
            >
              返回列表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 模板预览对话框 */}
      <Dialog open={showTemplatePreview} onOpenChange={setShowTemplatePreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>模板文件预览: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 h-[60vh] overflow-auto border rounded-md">
            {previewTemplate?.file && (
              <div className="flex justify-center items-center h-full">
                {previewTemplate.file.type.includes("image") ? (
                  <img 
                    src={URL.createObjectURL(previewTemplate.file)} 
                    alt={previewTemplate.name}
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <div className="text-center">
                    <FileTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">{previewTemplate.file.name}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {(previewTemplate.file.size / 1024).toFixed(2)} KB
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => {
                        if (previewTemplate.file) {
                          const url = URL.createObjectURL(previewTemplate.file as Blob);
                          window.open(url);
                        }
                      }}
                    >
                      在新窗口中打开
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowTemplatePreview(false)}
            >
              关闭
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
              选择一个现有配置作为模板，系统将复制其基本信息和文件清单
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="configSelect" className="text-sm font-medium mb-2 block">
              选择配置
            </Label>
            <Select
              value={selectedConfig}
              onValueChange={setSelectedConfig}
            >
              <SelectTrigger id="configSelect">
                <SelectValue placeholder="请选择要复制的配置" />
              </SelectTrigger>
              <SelectContent>
                {configOptions.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    <div className="flex flex-col">
                      <span>{config.name}</span>
                      <span className="text-xs text-gray-500">
                        {config.reviewType} | {config.projectType}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCopyDialog(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleCopyFromExisting}
            >
              确认复制
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 