"use client"

import { useState } from "react"
import { 
  File, 
  FileText, 
  Download, 
  Calendar, 
  Eye, 
  Upload,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"

interface EvaluatedAchievementDocumentsTabProps {
  data: any
}

export default function EvaluatedAchievementDocumentsTab({ data }: EvaluatedAchievementDocumentsTabProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 模拟文档数据
  const documents = [
    {
      id: "doc1",
      name: "鉴定申请报告.pdf",
      type: "申请文件",
      size: "2.4 MB",
      uploadedBy: data.author.name,
      uploadDate: "2023-06-10",
      status: "已审核"
    },
    {
      id: "doc2",
      name: "技术方案说明书.docx",
      type: "技术文档",
      size: "3.8 MB",
      uploadedBy: data.author.name,
      uploadDate: "2023-06-15",
      status: "已审核"
    },
    {
      id: "doc3",
      name: "鉴定委员会意见.pdf",
      type: "鉴定文件",
      size: "1.2 MB",
      uploadedBy: "系统管理员",
      uploadDate: "2023-07-10",
      status: "已审核"
    },
    {
      id: "doc4",
      name: "鉴定证书.pdf",
      type: "证书文件",
      size: "0.8 MB",
      uploadedBy: "系统管理员",
      uploadDate: "2023-07-15",
      status: "已审核"
    },
    {
      id: "doc5",
      name: "技术测试报告.pdf",
      type: "测试文档",
      size: "5.2 MB",
      uploadedBy: data.coAuthors?.[0]?.name || "张工程师",
      uploadDate: "2023-06-20",
      status: "已审核"
    }
  ]

  // 过滤文档
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 获取文档图标
  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (extension === 'pdf') {
      return <File className="h-4 w-4 text-red-500" />
    } else if (extension === 'docx' || extension === 'doc') {
      return <File className="h-4 w-4 text-blue-500" />
    } else if (extension === 'xlsx' || extension === 'xls') {
      return <File className="h-4 w-4 text-green-500" />
    } else if (extension === 'pptx' || extension === 'ppt') {
      return <File className="h-4 w-4 text-orange-500" />
    } else {
      return <FileText className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>鉴定相关文档</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                <span>上传文档</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <div className="space-y-4">
                  {/* 搜索和过滤 */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="搜索文档..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-1" />
                      <span>筛选</span>
                    </Button>
                  </div>

                  {/* 文档表格 */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>文档名称</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>大小</TableHead>
                          <TableHead>上传者</TableHead>
                          <TableHead>上传日期</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.length > 0 ? (
                          filteredDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getDocumentIcon(doc.name)}
                                  <span className="font-medium">{doc.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{doc.type}</TableCell>
                              <TableCell>{doc.size}</TableCell>
                              <TableCell>{doc.uploadedBy}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{doc.uploadDate}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    doc.status === "已审核" 
                                      ? "bg-green-50 text-green-700 border-green-200" 
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }
                                >
                                  {doc.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4 text-slate-500" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Download className="h-4 w-4 text-slate-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                              未找到匹配的文档
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 上传区域 */}
                  <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-slate-400" />
                      <h3 className="text-slate-700 font-medium">拖放文件到此处或点击上传</h3>
                      <p className="text-sm text-slate-500">支持 PDF、Word、Excel、PPT 等格式，单个文件不超过20MB</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        <span>选择文件</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
