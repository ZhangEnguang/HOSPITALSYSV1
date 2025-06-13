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
  ChevronRight,
  BarChart3,
  Shield,
  Database,
  FileSpreadsheet,
  Users,
  Clipboard
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

// 人遗资源文件类型定义
const fileTypeConfig = {
  application: { label: "申请表", icon: <FileText className="h-4 w-4" /> },
  protocol: { label: "研究方案", icon: <FileCheck className="h-4 w-4" /> },
  consent: { label: "知情同意书", icon: <FileText className="h-4 w-4" /> },
  protection: { label: "数据保护方案", icon: <Shield className="h-4 w-4" /> },
  collection: { label: "采集方案", icon: <Database className="h-4 w-4" /> },
  quality: { label: "质量控制方案", icon: <BarChart3 className="h-4 w-4" /> },
  agreement: { label: "合作协议", icon: <FileSpreadsheet className="h-4 w-4" /> },
  security: { label: "安全方案", icon: <Shield className="h-4 w-4" /> },
  plan: { label: "实施计划", icon: <Clipboard className="h-4 w-4" /> },
  intervention: { label: "干预方案", icon: <Users className="h-4 w-4" /> },
  review: { label: "审查意见", icon: <FileText className="h-4 w-4" /> },
  other: { label: "其他文件", icon: <FileText className="h-4 w-4" /> }
}

// 文件数据类型
interface ReviewFile {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  uploadUser: string
  fileSize: string
  status: 'pending' | 'approved' | 'rejected' | 'reviewing'
  version: string
  reviewComments: string
  reviewDate: string
  description: string
}

interface ReviewFilesTabProps {
  project?: any
}

export default function ReviewFilesTab({ project }: ReviewFilesTabProps) {
  const { toast } = useToast()
  
  // 根据项目信息生成文件数据
  const generateProjectFiles = (): ReviewFile[] => {
    if (!project || !project.files) return []
    
    return project.files.map((file: any, index: number) => ({
      id: file.id || index.toString(),
      fileName: file.name,
      fileType: file.type || "other",
      uploadDate: file.uploadedAt?.split('T')[0] || file.uploadedAt,
      uploadUser: project.leader || (project.projectLeader && project.projectLeader.name) || "项目负责人",
      fileSize: file.size,
      status: file.status === "审核通过" ? "approved" as const : 
              file.status === "待审核" ? "pending" as const :
              file.status === "需修改" ? "rejected" as const : 
              file.status === "已生成" ? "approved" as const : "pending" as const,
      version: "1.0",
      reviewComments: file.status === "审核通过" ? "文件审核通过，符合人遗资源管理要求" : 
                     file.status === "需修改" ? "文件需要修改，请按意见完善" : "",
      reviewDate: file.status === "审核通过" ? project.approvedAt?.split('T')[0] || "" : "",
      description: `人遗资源${project.reviewType || "遗传学研究"}相关文件`
    }))
  }
  
  const [files, setFiles] = useState<ReviewFile[]>(generateProjectFiles())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ReviewFile | null>(null)
  const [uploadForm, setUploadForm] = useState({
    fileType: "",
    fileName: "",
    description: ""
  })

  // 过滤文件
  const filteredFiles = files.filter((file: ReviewFile) => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.uploadUser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || file.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 统计信息
  const totalFiles = files.length
  const approvedFiles = files.filter((f: ReviewFile) => f.status === 'approved').length
  const pendingFiles = files.filter((f: ReviewFile) => f.status === 'pending').length
  const reviewingFiles = files.filter((f: ReviewFile) => f.status === 'reviewing').length

  // 处理文件上传
  const handleFileUpload = () => {
    if (!uploadForm.fileType || !uploadForm.fileName) {
      toast({
        title: "请填写完整信息",
        description: "请填写所有必填字段",
        variant: "destructive"
      })
      return
    }

    const newFile: ReviewFile = {
      id: Date.now().toString(),
      fileName: uploadForm.fileName,
      fileType: uploadForm.fileType,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadUser: project?.leader || (project?.projectLeader && project.projectLeader.name) || "当前用户",
      fileSize: "0MB",
      status: "pending",
      version: "1.0",
      reviewComments: "",
      reviewDate: "",
      description: uploadForm.description
    }

    setFiles((prev: ReviewFile[]) => [...prev, newFile])
    setUploadDialogOpen(false)
    setUploadForm({ fileType: "", fileName: "", description: "" })
    
    toast({
      title: "文件上传成功",
      description: "文件已成功上传，等待审核"
    })
  }

  // 处理文件下载
  const handleFileDownload = (file: ReviewFile) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${file.fileName}`
    })
  }

  // 处理文件预览
  const handleFilePreview = (file: ReviewFile) => {
    setSelectedFile(file)
    setPreviewDialogOpen(true)
  }

  // 处理文件删除
  const handleFileDelete = (fileId: string) => {
    setFiles((prev: ReviewFile[]) => prev.filter((f: ReviewFile) => f.id !== fileId))
    toast({
      title: "文件已删除",
      description: "文件已成功删除"
    })
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
                管理人遗资源项目的送审文件，跟踪文件审核状态
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
              <div className="text-lg font-semibold text-slate-700">{totalFiles > 0 ? ((approvedFiles / totalFiles) * 100).toFixed(1) : '0'}%</div>
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
            <Button onClick={() => setUploadDialogOpen(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              添加文件
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 文件列表 */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                <FileCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">人遗资源审查文件</CardTitle>
                <CardDescription className="text-slate-500 text-sm">
                  {project?.reviewType || "遗传学研究"}项目相关文件，包含申请表、研究方案等基础文件
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 border-blue-200">
              {filteredFiles.length} 个文件
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">暂无审查文件</p>
              <p className="text-sm mt-1">点击上方"添加文件"按钮上传相关文件</p>
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
              {filteredFiles.map((file, index) => (
                <div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 px-3 py-3 text-sm border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    index === filteredFiles.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  {/* 文件信息 */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${fileStatusConfig[file.status].bgColor}`}>
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
                    <Badge className={fileStatusConfig[file.status].color}>
                      {fileStatusConfig[file.status].icon}
                      <span className="ml-1">
                        {fileStatusConfig[file.status].label}
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
                      <DropdownMenuContent align="end" className="w-32">
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
      </Card>

      {/* 上传文件对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>上传送审文件</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                  <p>{project?.reviewType || "遗传学研究"}</p>
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
                  <Badge className={fileStatusConfig[selectedFile.status].color}>
                    {fileStatusConfig[selectedFile.status].icon}
                    <span className="ml-1">
                      {fileStatusConfig[selectedFile.status].label}
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