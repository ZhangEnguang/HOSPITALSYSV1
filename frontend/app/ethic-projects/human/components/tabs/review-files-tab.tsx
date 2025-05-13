"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileIcon,
  FileText,
  FileCheck,
  FileWarning,
  Download, 
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  CloudUpload,
  ChevronRight,
  FileArchive,
  FileImage,
  FileSpreadsheetIcon,
  FileJson
} from "lucide-react"

// 人体伦理项目评审文件标签组件
export default function ReviewFilesTab({ projectId, projectType = "human" }: { projectId?: string; projectType?: "animal" | "human" }) {
  const [activeTab, setActiveTab] = useState("submitted")
  
  // 模拟文件数据
  const submittedFiles = [
    {
      id: "1",
      name: "人体研究项目申请书.pdf",
      category: "项目申请",
      version: "V1.0",
      size: "2.4 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "2",
      name: "受试者知情同意书.docx",
      category: "知情同意",
      version: "V1.0",
      size: "1.8 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    {
      id: "3",
      name: "临床研究方案.pdf",
      category: "研究方案",
      version: "V1.2",
      size: "3.5 MB",
      uploadDate: "2024-01-10",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "4",
      name: "研究者资质证明.pdf",
      category: "研究者资质",
      version: "V1.0",
      size: "1.2 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "5",
      name: "人体伦理审查申请表.pdf",
      category: "伦理申请",
      version: "V1.0",
      size: "0.9 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "6",
      name: "受试者个人数据记录表.xlsx",
      category: "数据记录",
      version: "V1.0",
      size: "1.1 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />
    }
  ]
  
  const reviewFiles = [
    {
      id: "7",
      name: "人体伦理委员会审查意见.pdf",
      category: "审查意见",
      version: "V1.0",
      size: "0.7 MB",
      uploadDate: "2024-01-15",
      reviewer: "医学院人体伦理审查委员会",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "8",
      name: "人体伦理审查批准证书.pdf",
      category: "审批证书",
      version: "V1.0",
      size: "0.5 MB",
      uploadDate: "2024-01-20",
      reviewer: "医学院人体伦理审查委员会",
      icon: <FileText className="h-4 w-4 text-red-500" />
    }
  ]
  
  const amendmentFiles = [
    {
      id: "9",
      name: "知情同意书修订说明.docx",
      category: "修订说明",
      version: "V1.0",
      size: "0.8 MB",
      uploadDate: "2024-02-10",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    {
      id: "10",
      name: "临床研究方案_修订版.pdf",
      category: "研究方案",
      version: "V2.0",
      size: "3.6 MB",
      uploadDate: "2024-02-10",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "11",
      name: "受试者招募材料.pdf",
      category: "招募材料",
      version: "V1.0",
      size: "1.2 MB",
      uploadDate: "2024-02-15",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    }
  ]

  // 获取文件状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "已通过":
        return "bg-green-100 text-green-800 border-green-200"
      case "审核中":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "已拒绝":
        return "bg-red-100 text-red-800 border-red-200"
      case "待修订":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }
    
  return (
    <div className="space-y-6">
      {/* 文件统计卡片 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            送审文件概览
          </CardTitle>
          <CardDescription>
            人体伦理项目申请与审查相关的所有文件
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                  <FileCheck className="h-4 w-4" />
                  提交文件
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{submittedFiles.length}</div>
                <div className="text-xs text-slate-500 mt-1">所有文件已通过审核</div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-purple-600">
                  <FileWarning className="h-4 w-4" />
                  审查文件
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{reviewFiles.length}</div>
                <div className="text-xs text-slate-500 mt-1">伦理委员会反馈文件</div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                  <FileText className="h-4 w-4" />
                  修订文件
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{amendmentFiles.length}</div>
                <div className="text-xs text-slate-500 mt-1">方案修订与更新文件</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 文件列表标签页 */}
      <Tabs defaultValue="submitted" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <FileCheck className="h-4 w-4 mr-2" />
            提交文件
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            <FileWarning className="h-4 w-4 mr-2" />
            审查文件
          </TabsTrigger>
          <TabsTrigger value="amendment" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <FileText className="h-4 w-4 mr-2" />
            修订文件
          </TabsTrigger>
        </TabsList>

        {/* 提交文件标签内容 */}
        <TabsContent value="submitted" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  已提交文件
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CloudUpload className="h-4 w-4" />
                  <span>上传文件</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[300px]">文件名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {file.icon}
                        <span>{file.name}</span>
                      </TableCell>
                      <TableCell>{file.category}</TableCell>
                      <TableCell>{file.version}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusStyle(file.status)}`}>
                          {file.status === "已通过" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                          {file.status === "审核中" ? <Clock className="h-3 w-3 mr-1" /> : null}
                          {file.status === "已拒绝" ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                          {file.status === "待修订" ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                          {file.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 审查文件标签内容 */}
        <TabsContent value="review" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-purple-500" />
                审查文件
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[300px]">文件名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>审查单位</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {file.icon}
                        <span>{file.name}</span>
                      </TableCell>
                      <TableCell>{file.category}</TableCell>
                      <TableCell>{file.version}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell>{file.reviewer}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 修订文件标签内容 */}
        <TabsContent value="amendment" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  修订文件
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CloudUpload className="h-4 w-4" />
                  <span>上传修订文件</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[300px]">文件名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amendmentFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {file.icon}
                        <span>{file.name}</span>
                      </TableCell>
                      <TableCell>{file.category}</TableCell>
                      <TableCell>{file.version}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusStyle(file.status)}`}>
                          {file.status === "已通过" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                          {file.status === "审核中" ? <Clock className="h-3 w-3 mr-1" /> : null}
                          {file.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {amendmentFiles.length === 0 && (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                    <FileIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">暂无修订文件</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    上传修订文件
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 