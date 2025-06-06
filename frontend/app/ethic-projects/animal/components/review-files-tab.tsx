"use client"

import React, { useState, useEffect } from "react"
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileCheck,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// 审查类型定义
const reviewTypes = [
  {
    id: "initial",
    name: "初始审查",
    description: "首次申请审查，包含项目申请表、实验方案等基础文件",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <FileCheck className="h-4 w-4" />,
    iconColor: "text-blue-600"
  },
  {
    id: "amendment",
    name: "变更审查", 
    description: "实验方案变更审查，包含变更申请、调整说明等文件",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: <RefreshCw className="h-4 w-4" />,
    iconColor: "text-orange-600"
  },
  {
    id: "annual",
    name: "年度审查",
    description: "年度进展报告审查，包含进展报告、安全报告等文件", 
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <Calendar className="h-4 w-4" />,
    iconColor: "text-green-600"
  },
  {
    id: "termination",
    name: "终止审查",
    description: "项目结束报告审查，包含结题报告、总结文件等",
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    icon: <XCircle className="h-4 w-4" />,
    iconColor: "text-gray-600"
  },
  {
    id: "violation",
    name: "违规审查",
    description: "违规事件报告审查，包含事件报告、整改措施等文件",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <AlertCircle className="h-4 w-4" />,
    iconColor: "text-red-600"
  }
]

// 文件状态定义
const fileStatusConfig = {
  pending: { 
    label: "待审核", 
    color: "bg-yellow-100 text-yellow-800 border border-yellow-200", 
    icon: <Clock className="h-3.5 w-3.5" />,
    bgColor: "bg-yellow-50"
  },
  approved: { 
    label: "已通过", 
    color: "bg-green-100 text-green-800 border border-green-200", 
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    bgColor: "bg-green-50"
  },
  rejected: { 
    label: "已退回", 
    color: "bg-red-100 text-red-800 border border-red-200", 
    icon: <XCircle className="h-3.5 w-3.5" />,
    bgColor: "bg-red-50"
  },
  reviewing: { 
    label: "审核中", 
    color: "bg-blue-100 text-blue-800 border border-blue-200", 
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    bgColor: "bg-blue-50"
  }
}

// 文件类型定义
const fileTypeConfig = {
  application: { label: "申请表", icon: <FileText className="h-4 w-4" /> },
  protocol: { label: "实验方案", icon: <FileCheck className="h-4 w-4" /> },
  welfare: { label: "动物福利", icon: <FileText className="h-4 w-4" /> },
  amendment: { label: "变更申请", icon: <RefreshCw className="h-4 w-4" /> },
  adjustment: { label: "调整说明", icon: <FileText className="h-4 w-4" /> },
  progress: { label: "进展报告", icon: <Calendar className="h-4 w-4" /> },
  certificate: { label: "资质证明", icon: <FileCheck className="h-4 w-4" /> },
  other: { label: "其他文件", icon: <FileText className="h-4 w-4" /> }
}

// 模拟数据
const mockReviewFiles = [
  {
    id: "1",
    reviewType: "initial",
    fileName: "动物伦理申请表.pdf",
    fileType: "application",
    uploadDate: "2024-01-15",
    uploadUser: "王教授",
    fileSize: "2.3MB",
    status: "approved",
    version: "1.0",
    reviewComments: "申请表格式正确，内容完整",
    reviewDate: "2024-01-20",
    description: "标准动物伦理委员会申请表"
  },
  {
    id: "2", 
    reviewType: "initial",
    fileName: "实验方案详细说明.docx",
    fileType: "protocol",
    uploadDate: "2024-01-15",
    uploadUser: "王教授",
    fileSize: "5.7MB",
    status: "approved",
    version: "1.0",
    reviewComments: "实验方案设计合理，符合动物伦理要求",
    reviewDate: "2024-01-20",
    description: "详细实验流程及动物使用计划"
  },
  {
    id: "3",
    reviewType: "initial", 
    fileName: "动物福利保障声明.pdf",
    fileType: "welfare",
    uploadDate: "2024-01-16",
    uploadUser: "李助理",
    fileSize: "1.8MB",
    status: "approved", 
    version: "1.0",
    reviewComments: "动物福利保障措施完善",
    reviewDate: "2024-01-21",
    description: "动物福利保障措施及监督机制"
  },
  {
    id: "4",
    reviewType: "initial",
    fileName: "研究人员资质证明.pdf",
    fileType: "certificate",
    uploadDate: "2024-01-16",
    uploadUser: "李助理",
    fileSize: "3.1MB",
    status: "approved",
    version: "1.0",
    reviewComments: "资质证明材料齐全有效",
    reviewDate: "2024-01-21",
    description: "实验人员培训合格证书及资质材料"
  },
  {
    id: "5",
    reviewType: "amendment",
    fileName: "实验方案变更申请.pdf",
    fileType: "amendment",
    uploadDate: "2024-03-10",
    uploadUser: "王教授", 
    fileSize: "3.2MB",
    status: "reviewing",
    version: "1.0",
    reviewComments: "",
    reviewDate: "",
    description: "动物数量及实验流程变更申请"
  },
  {
    id: "6",
    reviewType: "amendment",
    fileName: "动物数量调整说明.docx",
    fileType: "adjustment",
    uploadDate: "2024-03-10",
    uploadUser: "王教授",
    fileSize: "1.5MB", 
    status: "pending",
    version: "1.0",
    reviewComments: "",
    reviewDate: "",
    description: "基于中期结果的动物数量调整依据"
  },
  {
    id: "7",
    reviewType: "amendment",
    fileName: "变更影响评估报告.pdf",
    fileType: "other",
    uploadDate: "2024-03-12",
    uploadUser: "张技术员",
    fileSize: "2.8MB",
    status: "pending",
    version: "1.0",
    reviewComments: "",
    reviewDate: "",
    description: "实验方案变更对动物福利的影响评估"
  },
  {
    id: "8",
    reviewType: "annual",
    fileName: "年度进展报告.pdf",
    fileType: "progress",
    uploadDate: "2024-12-01",
    uploadUser: "张技术员",
    fileSize: "4.1MB",
    status: "rejected",
    version: "1.0", 
    reviewComments: "报告内容不够详细，需要补充实验数据分析",
    reviewDate: "2024-12-05",
    description: "年度实验进展及动物使用情况报告"
  },
  {
    id: "9",
    reviewType: "annual",
    fileName: "动物福利监督报告.pdf",
    fileType: "welfare",
    uploadDate: "2024-12-01",
    uploadUser: "李助理",
    fileSize: "2.7MB",
    status: "approved",
    version: "1.0",
    reviewComments: "动物福利监督情况良好",
    reviewDate: "2024-12-03",
    description: "年度动物福利监督检查报告"
  }
]

interface ReviewFilesTabProps {
  projectId?: string
}

export default function ReviewFilesTab({ projectId = "1" }: ReviewFilesTabProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState(mockReviewFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['initial', 'amendment', 'annual']))
  const [uploadForm, setUploadForm] = useState({
    reviewType: "",
    fileType: "",
    fileName: "",
    description: ""
  })

  // 过滤文件
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.uploadUser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || file.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 按审查类型分组
  const groupedFiles = reviewTypes.reduce((acc, type) => {
    acc[type.id] = filteredFiles.filter(file => file.reviewType === type.id)
    return acc
  }, {} as Record<string, any[]>)

  // 统计信息
  const totalFiles = files.length
  const approvedFiles = files.filter(f => f.status === 'approved').length
  const pendingFiles = files.filter(f => f.status === 'pending').length
  const reviewingFiles = files.filter(f => f.status === 'reviewing').length

  // 切换展开状态
  const toggleExpanded = (typeId: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId)
    } else {
      newExpanded.add(typeId)
    }
    setExpandedTypes(newExpanded)
  }

  // 处理文件上传
  const handleFileUpload = () => {
    if (!uploadForm.reviewType || !uploadForm.fileType || !uploadForm.fileName) {
      toast({
        title: "请填写完整信息",
        description: "请填写所有必填字段",
        variant: "destructive"
      })
      return
    }

    const newFile = {
      id: Date.now().toString(),
      reviewType: uploadForm.reviewType,
      fileName: uploadForm.fileName,
      fileType: uploadForm.fileType,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadUser: "当前用户",
      fileSize: "0MB",
      status: "pending" as const,
      version: "1.0",
      reviewComments: "",
      reviewDate: "",
      description: uploadForm.description
    }

    setFiles(prev => [...prev, newFile])
    setUploadDialogOpen(false)
    setUploadForm({ reviewType: "", fileType: "", fileName: "", description: "" })
    
    toast({
      title: "文件上传成功",
      description: "文件已成功上传，等待审核"
    })
  }

  // 处理文件下载
  const handleFileDownload = (file: any) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${file.fileName}`
    })
  }

  // 处理文件预览
  const handleFilePreview = (file: any) => {
    setSelectedFile(file)
    setPreviewDialogOpen(true)
  }

  // 处理文件删除
  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    toast({
      title: "文件已删除",
      description: "文件已成功删除"
    })
  }

  // 审查类型映射
  const reviewTypeMapping = {
    initial: "初始审查",
    amendment: "变更审查",
    annual: "年度审查", 
    termination: "终止审查",
    violation: "违规审查"
  }

  return (
    <div className="space-y-6">
      {/* 总览统计卡片 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                送审文件管理
                <Badge variant="outline" className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2">
                  {totalFiles}个文件
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-500">
                管理项目各审查阶段的送审文件，跟踪文件审核状态
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{approvedFiles}</div>
              <div className="text-xs text-slate-500 mt-0.5">已通过审核</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{reviewingFiles}</div>
              <div className="text-xs text-slate-500 mt-0.5">审核中</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{pendingFiles}</div>
              <div className="text-xs text-slate-500 mt-0.5">待审核</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{((approvedFiles / totalFiles) * 100).toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-0.5">通过率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索和筛选 */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索文件名或上传者..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="reviewing">审核中</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="rejected">已退回</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              className="w-full md:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 按审查类型分组的文件列表 */}
      <div className="space-y-4">
        {reviewTypes.map((reviewType) => {
          const typeFiles = groupedFiles[reviewType.id] || []
          const isExpanded = expandedTypes.has(reviewType.id)
          
          return (
            <Card key={reviewType.id} className="border-slate-200 shadow-sm">
              <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(reviewType.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${reviewType.color.replace('text-', 'bg-').replace('border-', '').split(' ')[0]}`}>
                          <div className={reviewType.iconColor}>
                            {reviewType.icon}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">{reviewType.name}</CardTitle>
                            <Badge variant="outline" className={`px-2 py-0.5 text-xs ${reviewType.color}`}>
                              {typeFiles.length} 个文件
                            </Badge>
                            {typeFiles.some(f => f.status === 'pending') && (
                              <Badge variant="secondary" className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800">
                                {typeFiles.filter(f => f.status === 'pending').length} 待审
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-slate-500 text-sm">
                            {reviewType.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                                                 <Button
                           variant="outline"
                           size="sm"
                           onClick={(e) => {
                             e.stopPropagation()
                             setUploadDialogOpen(true)
                           }}
                           className="h-8"
                         >
                           <Plus className="h-3.5 w-3.5 mr-1" />
                           添加文件
                         </Button>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {typeFiles.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium">暂无{reviewType.name}文件</p>
                        <p className="text-sm mt-1">点击上方"添加"按钮上传相关文件</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {/* 文件列表表头 */}
                        <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50 rounded-md">
                          <div className="col-span-4">文件信息</div>
                          <div className="col-span-2">上传者</div>
                          <div className="col-span-2">上传时间</div>
                          <div className="col-span-2">状态</div>
                          <div className="col-span-2 text-right">操作</div>
                        </div>
                        
                        {/* 文件列表项 */}
                        {typeFiles.map((file, index) => (
                          <div
                            key={file.id}
                            className={`grid grid-cols-12 gap-4 px-3 py-3 text-sm border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                              index === typeFiles.length - 1 ? 'border-b-0' : ''
                            }`}
                          >
                            {/* 文件信息 */}
                            <div className="col-span-4 flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${fileStatusConfig[file.status as keyof typeof fileStatusConfig].bgColor}`}>
                                {fileTypeConfig[file.fileType as keyof typeof fileTypeConfig]?.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate text-slate-800">{file.fileName}</p>
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    v{file.version}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span>{fileTypeConfig[file.fileType as keyof typeof fileTypeConfig]?.label}</span>
                                  <span>•</span>
                                  <span>{file.fileSize}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* 上传者 */}
                            <div className="col-span-2 flex items-center">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-slate-400" />
                                <span className="text-slate-600">{file.uploadUser}</span>
                              </div>
                            </div>
                            
                            {/* 上传时间 */}
                            <div className="col-span-2 flex items-center">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span className="text-slate-600">{file.uploadDate}</span>
                              </div>
                            </div>
                            
                            {/* 状态 */}
                            <div className="col-span-2 flex items-center">
                              <Badge className={fileStatusConfig[file.status as keyof typeof fileStatusConfig].color}>
                                {fileStatusConfig[file.status as keyof typeof fileStatusConfig].icon}
                                <span className="ml-1">
                                  {fileStatusConfig[file.status as keyof typeof fileStatusConfig].label}
                                </span>
                              </Badge>
                            </div>
                            
                            {/* 操作 */}
                            <div className="col-span-2 flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleFilePreview(file)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    查看详情
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleFileDownload(file)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    下载文件
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleFileDelete(file.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除文件
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>

      {/* 上传文件对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>上传送审文件</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reviewType">审查类型 *</Label>
                <Select value={uploadForm.reviewType} onValueChange={(value) => 
                  setUploadForm(prev => ({ ...prev, reviewType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="选择审查类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fileType">文件类型 *</Label>
                <Select value={uploadForm.fileType} onValueChange={(value) => 
                  setUploadForm(prev => ({ ...prev, fileType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="选择文件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fileTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="fileName">文件名称 *</Label>
              <Input
                id="fileName"
                value={uploadForm.fileName}
                onChange={(e) => setUploadForm(prev => ({ ...prev, fileName: e.target.value }))}
                placeholder="请输入文件名称"
              />
            </div>
            <div>
              <Label htmlFor="description">文件描述</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="请输入文件描述（可选）"
                rows={3}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600">
                点击上传文件或拖拽文件到此处
              </p>
              <p className="text-xs text-gray-500 mt-2">
                支持 PDF、DOC、DOCX 格式，文件大小不超过 10MB
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleFileUpload}>
              上传文件
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 文件预览对话框 */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>文件详情</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {fileTypeConfig[selectedFile.fileType as keyof typeof fileTypeConfig]?.icon}
                <div>
                  <h4 className="font-medium">{selectedFile.fileName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {fileTypeConfig[selectedFile.fileType as keyof typeof fileTypeConfig]?.label} • {selectedFile.fileSize}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">审查类型</p>
                  <p>{reviewTypeMapping[selectedFile.reviewType as keyof typeof reviewTypeMapping]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">上传时间</p>
                  <p>{selectedFile.uploadDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">上传人</p>
                  <p>{selectedFile.uploadUser}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">文件版本</p>
                  <p>v{selectedFile.version}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">审核状态</p>
                  <Badge className={fileStatusConfig[selectedFile.status as keyof typeof fileStatusConfig].color}>
                    {fileStatusConfig[selectedFile.status as keyof typeof fileStatusConfig].icon}
                    <span className="ml-1">
                      {fileStatusConfig[selectedFile.status as keyof typeof fileStatusConfig].label}
                    </span>
                  </Badge>
                </div>
              </div>
              {selectedFile.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">文件描述</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">
                      {selectedFile.description}
                    </p>
                  </div>
                </>
              )}
              {selectedFile.reviewComments && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">审核意见</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">
                      {selectedFile.reviewComments}
                    </p>
                    {selectedFile.reviewDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        审核时间：{selectedFile.reviewDate}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => selectedFile && handleFileDownload(selectedFile)}>
              <Download className="h-4 w-4 mr-2" />
              下载文件
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 