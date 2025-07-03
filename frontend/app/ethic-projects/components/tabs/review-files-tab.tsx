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
  FileJson,
  FolderIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// 评审文件标签组件
export default function ReviewFilesTab({ projectId, projectType }: { projectId?: string; projectType?: "animal" | "human" }) {
  const [activeTab, setActiveTab] = useState("submitted")
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())
  
  // 模拟文件数据
  const submittedFiles = [
    {
      id: "1",
      name: "项目申请书.pdf",
      category: "项目申请",
      version: "V1.0",
      size: "2.4 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "2",
      name: projectType === "human" ? "知情同意书.docx" : "动物使用申请.docx",
      category: projectType === "human" ? "知情同意" : "动物使用",
      version: "V1.0",
      size: "1.8 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    {
      id: "3",
      name: projectType === "human" ? "研究方案.pdf" : "动物实验方案.pdf",
      category: "实验方案",
      version: "V1.2",
      size: "3.5 MB",
      uploadDate: "2024-01-10",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    },
    {
      id: "4",
      name: "研究者简历.pdf",
      category: "研究者资质",
      version: "V1.0",
      size: "1.2 MB",
      uploadDate: "2024-01-05",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    }
  ]
  
  // 审查类型及其相关文件 - 按审查类型分组
  const reviewTypes = [
    {
      id: "initial",
      name: "初始审查",
      status: "已完成",
      submittedDate: "2024-01-15",
      completedDate: "2024-01-20",
      submittedMaterials: [
        {
          id: "initial_1",
          name: "动物伦理审查申请表.pdf",
          category: "申请表",
          version: "V1.0",
          size: "2.3 MB",
          uploadDate: "2024-01-15",
          uploadedBy: "王教授",
          status: "已通过",
          icon: <FileText className="h-4 w-4 text-red-500" />
        },
        {
          id: "initial_2",
          name: "实验方案详细说明.docx",
          category: "实验方案",
          version: "V1.0",
          size: "5.7 MB",
          uploadDate: "2024-01-15",
          uploadedBy: "王教授",
          status: "已通过",
          icon: <FileText className="h-4 w-4 text-blue-500" />
        },
        {
          id: "initial_3",
          name: "动物福利保障说明.pdf",
          category: "动物福利",
          version: "V1.0",
          size: "1.8 MB",
          uploadDate: "2024-01-16",
          uploadedBy: "李助理",
          status: "已通过",
          icon: <FileText className="h-4 w-4 text-red-500" />
        },
        {
          id: "initial_4",
          name: "研究人员资质证明.pdf",
          category: "资质证明",
          version: "V1.0",
          size: "3.1 MB",
          uploadDate: "2024-01-16",
          uploadedBy: "李助理",
          status: "已通过",
          icon: <FileText className="h-4 w-4 text-red-500" />
        }
      ],
      reviewResultFiles: [
        {
          id: "initial_result_1",
          name: "受理通知书.pdf",
          category: "审查结果",
          version: "V1.0",
          size: "0.8 MB",
          uploadDate: "2024-01-17",
          uploadedBy: "医学院伦理审查委员会",
          status: "已生成",
          icon: <FileText className="h-4 w-4 text-green-500" />
        },
        {
          id: "initial_result_2",
          name: "伦理审批文件.pdf",
          category: "审查结果",
          version: "V1.0",
          size: "1.2 MB",
          uploadDate: "2024-01-20",
          uploadedBy: "医学院伦理审查委员会",
          status: "已生成",
          icon: <FileText className="h-4 w-4 text-green-500" />
        }
      ]
    },
    {
      id: "amendment",
      name: "修订审查",
      status: "审核中",
      submittedDate: "2024-03-10",
      completedDate: null,
      submittedMaterials: [
        {
          id: "amendment_1",
          name: "实验方案变更申请.pdf",
          category: "变更申请",
          version: "V1.0",
          size: "3.2 MB",
          uploadDate: "2024-03-10",
          uploadedBy: "王教授",
          status: "审核中",
          icon: <FileText className="h-4 w-4 text-red-500" />
        },
        {
          id: "amendment_2",
          name: "动物数量调整说明.docx",
          category: "调整说明",
          version: "V1.0",
          size: "1.5 MB",
          uploadDate: "2024-03-10",
          uploadedBy: "王教授",
          status: "审核中",
          icon: <FileText className="h-4 w-4 text-blue-500" />
        }
      ],
      reviewResultFiles: [
        {
          id: "amendment_result_1",
          name: "受理通知书.pdf",
          category: "审查结果",
          version: "V1.0",
          size: "0.7 MB",
          uploadDate: "2024-03-11",
          uploadedBy: "医学院伦理审查委员会",
          status: "已生成",
          icon: <FileText className="h-4 w-4 text-green-500" />
        },
        {
          id: "amendment_result_2",
          name: "伦理审批文件.pdf",
          category: "审查结果",
          version: "V1.0",
          size: "0.0 MB",
          uploadDate: "-",
          uploadedBy: "-",
          status: "待生成",
          icon: <FileText className="h-4 w-4 text-gray-400" />
        }
      ]
    },
    {
      id: "annual",
      name: "年度跟踪审查",
      status: "已完成",
      submittedDate: "2024-02-01",
      completedDate: "2024-02-15",
      submittedMaterials: [
        {
          id: "annual_1",
          name: "年度研究进展报告.pdf",
          category: "进展报告",
          version: "V1.0",
          size: "4.5 MB",
          uploadDate: "2024-02-01",
          uploadedBy: "王教授",
          status: "已通过",
          icon: <FileText className="h-4 w-4 text-red-500" />
        },
        {
          id: "annual_2",
          name: "动物使用情况统计.xlsx",
          category: "统计报告",
          version: "V1.0",
          size: "2.1 MB",
          uploadDate: "2024-02-01",
          uploadedBy: "王教授",
          status: "已通过",
          icon: <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />
        }
      ],
      reviewResultFiles: [
        {
          id: "annual_result_1",
          name: "受理通知书.pdf",
          category: "审查结果",
          version: "V1.0",
          size: "0.8 MB",
          uploadDate: "2024-02-02",
          uploadedBy: "医学院伦理审查委员会",
          status: "已生成",
          icon: <FileText className="h-4 w-4 text-green-500" />
        },
        {
          id: "annual_result_2",
          name: "伦理审批文件.pdf",
          category: "审查结果",
          version: "V1.0",
          size: "1.1 MB",
          uploadDate: "2024-02-15",
          uploadedBy: "医学院伦理审查委员会",
          status: "已生成",
          icon: <FileText className="h-4 w-4 text-green-500" />
        }
      ]
    }
  ]
  
  const amendmentFiles = [
    {
      id: "9",
      name: projectType === "human" ? "方案修订说明.docx" : "实验方案修订说明.docx",
      category: "修订说明",
      version: "V1.0",
      size: "0.8 MB",
      uploadDate: "2024-02-10",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    {
      id: "10",
      name: projectType === "human" ? "研究方案_修订版.pdf" : "动物实验方案_修订版.pdf",
      category: "实验方案",
      version: "V2.0",
      size: "3.6 MB",
      uploadDate: "2024-02-10",
      status: "已通过",
      icon: <FileText className="h-4 w-4 text-red-500" />
    }
  ]
  
  // 获取文件状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "已通过":
      case "已生成":
        return "bg-green-100 text-green-800 border-green-200"
      case "审核中":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "已拒绝":
        return "bg-red-100 text-red-800 border-red-200"
      case "待修订":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "待生成":
        return "bg-gray-100 text-gray-600 border-gray-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // 获取审查状态样式
  const getReviewStatusStyle = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800 border-green-200"
      case "审核中":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "已拒绝":
        return "bg-red-100 text-red-800 border-red-200"
      case "暂停":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // 切换审查类型展开状态
  const toggleReviewExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  // 计算所有送审材料总数
  const totalSubmittedFiles = reviewTypes.reduce((total, review) => total + review.submittedMaterials.length, 0)
  
  // 计算所有审查结果文件总数
  const totalReviewResultFiles = reviewTypes.reduce((total, review) => total + review.reviewResultFiles.length, 0)
    
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
            项目申请与审查相关的所有文件
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                  <FileCheck className="h-4 w-4" />
                  送审材料
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{totalSubmittedFiles}</div>
                <div className="text-xs text-slate-500 mt-1">各审查类型的送审文件</div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-purple-600">
                  <FileWarning className="h-4 w-4" />
                  审查结果
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{totalReviewResultFiles}</div>
                <div className="text-xs text-slate-500 mt-1">受理通知书与审批文件</div>
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

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-orange-600">
                  <FolderIcon className="h-4 w-4" />
                  审查类型
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{reviewTypes.length}</div>
                <div className="text-xs text-slate-500 mt-1">总审查类型数量</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 文件列表标签页 */}
      <Tabs defaultValue="by-review-type" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="by-review-type" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <FolderIcon className="h-4 w-4 mr-2" />
            按审查类型
          </TabsTrigger>
          <TabsTrigger value="all-submitted" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            <FileCheck className="h-4 w-4 mr-2" />
            所有送审材料
          </TabsTrigger>
          <TabsTrigger value="amendment" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <FileText className="h-4 w-4 mr-2" />
            修订文件
          </TabsTrigger>
        </TabsList>

        {/* 按审查类型分组显示 */}
        <TabsContent value="by-review-type" className="mt-0">
          <div className="space-y-4">
            {reviewTypes.map((review) => (
              <Card key={review.id} className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader 
                  className="pb-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleReviewExpanded(review.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {expandedReviews.has(review.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-blue-500" />
                          {review.name}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className={`${getReviewStatusStyle(review.status)}`}>
                        {review.status === "已完成" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                        {review.status === "审核中" ? <Clock className="h-3 w-3 mr-1" /> : null}
                        {review.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>提交: {review.submittedDate}</span>
                      </div>
                      {review.completedDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>完成: {review.completedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedReviews.has(review.id) && (
                  <CardContent className="pt-0 space-y-6">
                    {/* 送审材料部分 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-500" />
                        送审材料 ({review.submittedMaterials.length})
                      </h4>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader className="bg-blue-50">
                            <TableRow>
                              <TableHead className="w-[300px]">文件名称</TableHead>
                              <TableHead>分类</TableHead>
                              <TableHead>版本</TableHead>
                              <TableHead>大小</TableHead>
                              <TableHead>上传日期</TableHead>
                              <TableHead>上传人</TableHead>
                              <TableHead>状态</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {review.submittedMaterials.map((file) => (
                              <TableRow key={file.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                  {file.icon}
                                  <span>{file.name}</span>
                                </TableCell>
                                <TableCell>{file.category}</TableCell>
                                <TableCell>{file.version}</TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>{file.uploadDate}</TableCell>
                                <TableCell>{file.uploadedBy}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`${getStatusStyle(file.status)}`}>
                                    {file.status === "已通过" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                                    {file.status === "审核中" ? <Clock className="h-3 w-3 mr-1" /> : null}
                                    {file.status === "已拒绝" ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
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
                      </div>
                    </div>

                    {/* 审查结果文件部分 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FileWarning className="h-4 w-4 text-green-500" />
                        审查结果文件 ({review.reviewResultFiles.length})
                      </h4>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader className="bg-green-50">
                            <TableRow>
                              <TableHead className="w-[300px]">文件名称</TableHead>
                              <TableHead>分类</TableHead>
                              <TableHead>版本</TableHead>
                              <TableHead>大小</TableHead>
                              <TableHead>生成日期</TableHead>
                              <TableHead>生成机构</TableHead>
                              <TableHead>状态</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {review.reviewResultFiles.map((file) => (
                              <TableRow key={file.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                  {file.icon}
                                  <span>{file.name}</span>
                                </TableCell>
                                <TableCell>{file.category}</TableCell>
                                <TableCell>{file.version}</TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>{file.uploadDate}</TableCell>
                                <TableCell>{file.uploadedBy}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`${getStatusStyle(file.status)}`}>
                                    {file.status === "已生成" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                                    {file.status === "待生成" ? <Clock className="h-3 w-3 mr-1" /> : null}
                                    {file.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {file.status === "已生成" ? (
                                      <>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </>
                                    ) : (
                                      <span className="text-sm text-gray-400">待生成</span>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 所有送审材料标签内容 */}
        <TabsContent value="all-submitted" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  所有送审材料
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
                    <TableHead>审查类型</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewTypes.flatMap(review => 
                    review.submittedMaterials.map(file => ({
                      ...file,
                      reviewType: review.name
                    }))
                  ).map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {file.icon}
                        <span>{file.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {file.reviewType}
                        </Badge>
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