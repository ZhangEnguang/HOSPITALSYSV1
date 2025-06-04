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
  FileIcon,
  FileSearch,
  CheckCircle2,
  File,
  FilePlus2,
  PlusCircle
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// 文件类型到图标的映射
function getFileIcon(fileType: string) {
  // 使用统一的蓝色
  const iconColor = "text-blue-600";
  
  switch (fileType) {
    case "report":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "progress":
      return <FileSearch className={`h-4 w-4 ${iconColor}`} />
    case "safety":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "review":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "application":
      return <FileSearch className={`h-4 w-4 ${iconColor}`} />
    case "protocol":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "declaration":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    case "consent":
      return <FileText className={`h-4 w-4 ${iconColor}`} />
    default:
      return <FileIcon className={`h-4 w-4 ${iconColor}`} />
  }
}

// 获取文件状态徽章
function getStatusBadge(status: string) {
  switch (status) {
    case "未审核":
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <Clock className="h-2.5 w-2.5" />
          <span>未审核</span>
        </Badge>
      )
    case "审核通过":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <CheckCircle2 className="h-2.5 w-2.5" />
          <span>审核通过</span>
        </Badge>
      )
    case "存在问题":
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <XCircle className="h-2.5 w-2.5" />
          <span>存在问题</span>
        </Badge>
      )
    case "已审核":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <CheckCircle2 className="h-2.5 w-2.5" />
          <span>已审核</span>
        </Badge>
      )
    case "审核中":
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <Clock className="h-2.5 w-2.5" />
          <span>审核中</span>
        </Badge>
      )
    case "已拒绝":
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <XCircle className="h-2.5 w-2.5" />
          <span>已拒绝</span>
        </Badge>
      )
    case "待提交":
    case "待审核":
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <Clock className="h-2.5 w-2.5" />
          <span>待审核</span>
        </Badge>
      )
    case "已生成":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <CheckCircle2 className="h-2.5 w-2.5" />
          <span>已生成</span>
        </Badge>
      )
    case "需修改":
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <XCircle className="h-2.5 w-2.5" />
          <span>需修改</span>
        </Badge>
      )
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1 shadow-sm px-2 py-0.5 text-xs font-medium h-6 w-fit">
          <AlertCircle className="h-2.5 w-2.5" />
          <span>{status}</span>
        </Badge>
      )
  }
}

// 获取文件类型名称
function getFileTypeName(fileType: string) {
  const typeMap: Record<string, string> = {
    "report": "跟踪报告",
    "progress": "进展说明",
    "safety": "安全记录",
    "review": "审查意见",
    "application": "项目申请",
    "protocol": "实验方案",
    "declaration": "声明文件",
    "consent": "知情同意"
  }
  
  return typeMap[fileType] || "其他文件"
}

// 跟踪报告文件标签页组件
export default function TrackReportFilesTab({
  project
}: { 
  project: any 
}) {
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // 处理查看文件
  const handleViewFile = (file: any) => {
    setPreviewFile(file);
    setShowFilePreview(true);
    toast({
      title: "查看文件",
      description: `正在打开文件: ${file.name}`,
    });
  };

  // 处理下载文件
  const handleDownloadFile = (file: any) => {
    toast({
      title: "下载文件",
      description: `正在下载文件: ${file.name}`,
    });
  };

  // 处理上传新文件
  const handleUploadFile = () => {
    setUploadDialogOpen(true);
    toast({
      title: "上传新文件",
      description: "选择要上传的文件",
    });
  };

  // 获取文件列表 - 如果是特定项目则显示特定文件
  const getFiles = () => {
    if (project.id === "ETH-TRK-2024-001") {
      return [
        { id: "trk1", name: "跟踪报告表.pdf", type: "report", size: "3.2MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk2", name: "入组进度说明.docx", type: "progress", size: "1.5MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk3", name: "安全性监测报告.pdf", type: "safety", size: "2.8MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk4", name: "方案优化说明.pdf", type: "protocol", size: "1.7MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk5", name: "知情同意书(更新版).docx", type: "consent", size: "1.3MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk6", name: "不良事件报告.pdf", type: "safety", size: "1.2MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk7", name: "数据管理计划.pdf", type: "protocol", size: "0.9MB", uploadedAt: "2024-04-10", status: "审核通过" },
        { id: "trk8", name: "审查意见书.pdf", type: "review", size: "1.1MB", uploadedAt: "2024-05-18", status: "已生成" }
      ];
    }
    
    return project.files || [];
  };

  const files = getFiles();

  return (
    <div className="space-y-6">
      {/* 送审文件卡片 */}
      <Card className="border-t-4 border-t-blue-500 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">送审文件</CardTitle>
              <CardDescription>
                项目跟踪报告相关文件
              </CardDescription>
            </div>
            {/* 在已退回状态时显示上传按钮 */}
            {project.status === "已退回" && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                onClick={handleUploadFile}
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
                  files.map((file: any, index: number) => (
                    <TableRow key={file.id || index} className="hover:bg-gray-50">
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleViewFile(file)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleDownloadFile(file)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {project.status === "已退回" && file.status === "需修改" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={handleUploadFile}>
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
      
      {/* 文件上传区说明 - 仅在项目状态为"已退回"时显示 */}
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
                onClick={handleUploadFile}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                选择文件
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 文件预览对话框 */}
      <Dialog open={showFilePreview} onOpenChange={setShowFilePreview}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-blue-50 p-1 rounded-md">
                {previewFile && getFileIcon(previewFile.type)}
              </div>
              <span>{previewFile?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {previewFile?.uploadedAt} · {previewFile?.size}
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
            <Button variant="outline" onClick={() => setShowFilePreview(false)}>
              关闭
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => previewFile && handleDownloadFile(previewFile)}
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