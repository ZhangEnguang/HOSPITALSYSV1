"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Eye,
  Clock,
  Check,
  XCircle,
  AlertCircle,
  RotateCw,
  Upload,
  PlusCircle,
  FileIcon,
  FileSearch,
  CheckCircle2,
  File
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// 文件类型到图标的映射
function getFileIcon(fileType: string) {
  // 使用统一的蓝色
  const iconColor = "text-blue-600";
  
  switch (fileType) {
    case "application":
      return <FileSearch className={`h-4 w-4 ${iconColor}`} />
    case "protocol":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "consent":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "declaration":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "review":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "handbook":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "report":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "prescription":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    default:
      return <FileIcon className={`h-4 w-4 ${iconColor}`} />
  }
}

// 文件状态到Badge的映射
function getStatusBadge(status: string) {
  switch (status) {
    case "已审核":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>已审核</span>
        </Badge>
      )
    case "待审核":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>待审核</span>
        </Badge>
      )
    case "需修改":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          <span>需修改</span>
        </Badge>
      )
    case "已生成":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 flex items-center gap-1">
          <Check className="h-3 w-3" />
          <span>已生成</span>
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>{status}</span>
        </Badge>
      )
  }
}

// 获取文件类型名称
function getFileTypeName(fileType: string) {
  const typeMap: Record<string, string> = {
    "application": "项目申请书",
    "protocol": "实验方案",
    "consent": "知情同意书",
    "declaration": "声明文件",
    "review": "审查意见",
    "handbook": "研究者手册",
    "report": "报告表",
    "prescription": "处方设计",
    "security": "安全方案",
    "assessment": "评估报告",
    "recruitment": "招募计划",
    "technical": "技术规范",
    "sop": "标准操作程序",
    "quality": "质量控制"
  }
  
  return typeMap[fileType] || "其他文件"
}

// 送审文件标签页组件
export default function ReviewFilesTab({
  project
}: { 
  project: any 
}) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  
  // 根据项目审查类型生成增强的文件列表
  const generateEnhancedFiles = () => {
    const baseFiles = project.files || []
    const reviewType = project.reviewType || "初始审查"
    const projectType = project.projectType || "人体"
    const projectSubType = project.projectSubType || "人体"
    const enhancedFiles = [...baseFiles]
    
    // 根据审查类型添加特定文件
    switch (reviewType) {
      case "初始审查":
        if (projectSubType === "动物") {
          enhancedFiles.push(
            { id: `${project.id}-init-1`, name: "动物实验设计方案.pdf", type: "protocol", size: "3.2MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-2`, name: "3R原则声明书.pdf", type: "declaration", size: "0.8MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-3`, name: "动物福利监督计划.docx", type: "protocol", size: "1.5MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-4`, name: "实验动物使用许可证.pdf", type: "declaration", size: "0.6MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-5`, name: "麻醉和安乐死标准操作程序.pdf", type: "protocol", size: "2.1MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-6`, name: "实验人员资质证明.pdf", type: "declaration", size: "1.2MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
          )
        } else {
          enhancedFiles.push(
            { id: `${project.id}-init-1`, name: "临床研究设计方案.pdf", type: "protocol", size: "4.1MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-2`, name: "受试者招募广告.pdf", type: "consent", size: "0.9MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-3`, name: "数据安全管理计划.docx", type: "protocol", size: "1.8MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-4`, name: "不良事件报告流程.pdf", type: "protocol", size: "1.3MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
            { id: `${project.id}-init-5`, name: "研究者简历及资质.pdf", type: "declaration", size: "2.4MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
          )
        }
        break
        
      case "人遗采集审批":
        enhancedFiles.push(
          { id: `${project.id}-genetic-1`, name: "人类遗传资源采集申请书.pdf", type: "application", size: "3.5MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-genetic-2`, name: "采集标准操作程序.pdf", type: "protocol", size: "2.8MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-genetic-3`, name: "样本保存方案.docx", type: "protocol", size: "1.6MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-genetic-4`, name: "知情同意书（遗传检测专用）.pdf", type: "consent", size: "2.2MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-genetic-5`, name: "遗传信息保护方案.pdf", type: "protocol", size: "1.9MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-genetic-6`, name: "采集点设施条件证明.pdf", type: "declaration", size: "1.1MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-genetic-7`, name: "样本运输安全协议.pdf", type: "protocol", size: "0.9MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
        )
        break
        
      case "修正案审查":
        enhancedFiles.push(
          { id: `${project.id}-amend-1`, name: "修正案申请书.pdf", type: "application", size: "2.1MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-amend-2`, name: "原始研究方案.pdf", type: "protocol", size: "3.8MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-amend-3`, name: "修改内容对比表.xlsx", type: "report", size: "1.2MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-amend-4`, name: "修改风险评估报告.pdf", type: "report", size: "2.5MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-amend-5`, name: "更新后的知情同意书.pdf", type: "consent", size: "2.0MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-amend-6`, name: "现有受试者重新同意方案.docx", type: "consent", size: "1.4MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
        )
        break
        
      case "国际合作科学研究审批":
        enhancedFiles.push(
          { id: `${project.id}-intl-1`, name: "国际合作协议书.pdf", type: "application", size: "4.2MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-intl-2`, name: "数据传输安全协议.pdf", type: "protocol", size: "2.3MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-intl-3`, name: "多国伦理标准对比分析.docx", type: "report", size: "3.1MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-intl-4`, name: "知识产权保护协议.pdf", type: "declaration", size: "1.8MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-intl-5`, name: "跨境数据传输许可申请.pdf", type: "application", size: "2.6MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-intl-6`, name: "合作方伦理委员会证明.pdf", type: "declaration", size: "1.5MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-intl-7`, name: "数据安全监管方案.pdf", type: "protocol", size: "2.0MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
        )
        break
        
      case "复审":
        enhancedFiles.push(
          { id: `${project.id}-rerev-1`, name: "复审申请书.pdf", type: "application", size: "1.9MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-rerev-2`, name: "前期审查意见回复.pdf", type: "report", size: "2.7MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-rerev-3`, name: "改进措施实施报告.docx", type: "report", size: "2.1MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-rerev-4`, name: "质量控制检查表.xlsx", type: "report", size: "0.8MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-rerev-5`, name: "持续改进机制说明.pdf", type: "protocol", size: "1.6MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-rerev-6`, name: "监督检查记录.pdf", type: "report", size: "1.3MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
        )
        break
        
      default:
        // 为其他审查类型添加通用文件
        enhancedFiles.push(
          { id: `${project.id}-common-1`, name: "补充材料清单.pdf", type: "report", size: "0.7MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" },
          { id: `${project.id}-common-2`, name: "伦理培训证书.pdf", type: "declaration", size: "1.0MB", uploadedAt: project.submittedAt || "2024-01-28", status: "已审核" }
        )
    }
    
    return enhancedFiles
  }
  
  // 文件列表 - 使用增强后的文件列表
  const files = generateEnhancedFiles()
  
  // 处理文件预览
  const handlePreview = (file: any) => {
    setSelectedFile(file)
    setPreviewDialogOpen(true)
  }
  
  // 处理文件下载
  const handleDownload = (file: any) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${file.name}`,
      duration: 3000,
    })
  }
  
  // 处理文件上传
  const handleUpload = () => {
    setUploadDialogOpen(true)
  }
  
  // 处理文件更新
  const handleUpdateFile = (file: any) => {
    toast({
      title: "文件更新",
      description: `请上传新版本的 ${file.name}`,
      duration: 3000,
    })
    setUploadDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 送审文件卡片 */}
      <Card className="border-t-4 border-t-blue-500 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">送审文件</CardTitle>
              <CardDescription>
                项目审查相关文件
              </CardDescription>
            </div>
            {/* 项目状态为已退回时，显示上传按钮 */}
            {project.status === "已退回" && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                onClick={handleUpload}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>上传文件</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="w-[40%] text-gray-700">文件名称</TableHead>
                  <TableHead className="w-[15%] text-gray-700">类型</TableHead>
                  <TableHead className="w-[10%] text-gray-700">大小</TableHead>
                  <TableHead className="w-[15%] text-gray-700">上传时间</TableHead>
                  <TableHead className="w-[10%] text-gray-700">AI形审状态</TableHead>
                  <TableHead className="w-[10%] text-right text-gray-700">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      暂无送审文件
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((file: any) => (
                    <TableRow key={file.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-1 rounded-md flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <span className="text-gray-700">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{getFileTypeName(file.type)}</TableCell>
                      <TableCell className="text-gray-600">{file.size}</TableCell>
                      <TableCell className="text-gray-600">{file.uploadedAt}</TableCell>
                      <TableCell>{getStatusBadge(file.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handlePreview(file)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleDownload(file)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {project.status === "已退回" && file.status === "需修改" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleUpdateFile(file)}>
                              <RotateCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 文件上传区说明 */}
      {project.status === "已退回" && (
        <Card className="border border-dashed border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="bg-blue-50 p-3 rounded-full">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">上传修改后的文件</h3>
              <p className="mt-2 text-sm text-gray-600">
                请上传修改后的送审文件，系统将自动跟踪文件更新记录。
              </p>
              <Button
                variant="outline"
                className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                onClick={handleUpload}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                选择文件
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 文件预览对话框 */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-blue-50 p-1 rounded-md">
                {selectedFile && getFileIcon(selectedFile.type)}
              </div>
              <span>{selectedFile?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedFile?.uploadedAt} · {selectedFile?.size}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-6 rounded-md min-h-[300px] flex items-center justify-center border border-gray-100">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mx-auto mb-3 inline-flex">
                <File className="h-12 w-12 text-blue-400" />
              </div>
              <p className="text-sm text-gray-600">文件预览功能正在开发中</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              关闭
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => selectedFile && handleDownload(selectedFile)}
            >
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 文件上传对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>上传送审文件</DialogTitle>
            <DialogDescription>
              请选择要上传的文件，支持PDF、Word、Excel等格式
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center bg-gray-50">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">
                拖放文件到此处，或点击选择文件
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  toast({
                    title: "文件选择",
                    description: "文件选择功能模拟中...",
                    duration: 3000,
                  })
                }}
              >
                选择文件
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              取消
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast({
                  title: "文件上传",
                  description: "文件上传成功",
                  duration: 3000,
                })
                setUploadDialogOpen(false)
              }}
            >
              上传
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 