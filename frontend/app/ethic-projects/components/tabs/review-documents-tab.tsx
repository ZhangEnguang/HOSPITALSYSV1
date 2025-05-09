"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  FileCheck,
  Filter,
  SlidersHorizontal,
  FileIcon,
  File,
  ImageIcon,
  FileSpreadsheetIcon,
  Archive,
  HelpCircle,
} from "lucide-react"

// 获取文件图标
const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />
    case "doc":
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "xls":
    case "xlsx":
      return <FileSpreadsheetIcon className="h-5 w-5 text-green-500" />
    case "jpg":
    case "jpeg":
    case "png":
      return <ImageIcon className="h-5 w-5 text-purple-500" />
    case "zip":
    case "rar":
      return <Archive className="h-5 w-5 text-amber-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

// 相关送审文件标签页组件
export default function ReviewDocumentsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // 审查类型及相关文件模拟数据
  const reviewDocuments = [
    {
      id: "1",
      reviewType: "伦理审查",
      documents: [
        {
          id: "doc1",
          name: "实验动物伦理申请表.pdf",
          type: "pdf",
          size: "2.3 MB",
          uploadDate: "2024-03-15",
          uploadedBy: "王教授",
          status: "已审核",
          reviewType: "伦理审查",
        },
        {
          id: "doc2",
          name: "实验方案详细说明.docx",
          type: "docx",
          size: "1.5 MB",
          uploadDate: "2024-03-15",
          uploadedBy: "王教授",
          status: "已审核",
          reviewType: "伦理审查",
        },
        {
          id: "doc3",
          name: "过往相关研究成果.pdf",
          type: "pdf",
          size: "4.7 MB",
          uploadDate: "2024-03-15",
          uploadedBy: "王教授",
          status: "已审核",
          reviewType: "伦理审查",
        }
      ]
    },
    {
      id: "2",
      reviewType: "安全审查",
      documents: [
        {
          id: "doc4",
          name: "试剂安全数据表.pdf",
          type: "pdf",
          size: "1.8 MB",
          uploadDate: "2024-03-20",
          uploadedBy: "李助理",
          status: "审核中",
          reviewType: "安全审查",
        },
        {
          id: "doc5",
          name: "危险物品处理规程.docx",
          type: "docx",
          size: "0.9 MB",
          uploadDate: "2024-03-20",
          uploadedBy: "李助理",
          status: "审核中",
          reviewType: "安全审查",
        }
      ]
    },
    {
      id: "3",
      reviewType: "实验前评估",
      documents: [
        {
          id: "doc6",
          name: "实验操作规程.pdf",
          type: "pdf",
          size: "3.2 MB",
          uploadDate: "2024-02-10",
          uploadedBy: "王教授",
          status: "已批准",
          reviewType: "实验前评估",
        },
        {
          id: "doc7",
          name: "动物福利措施说明.docx",
          type: "docx",
          size: "1.2 MB",
          uploadDate: "2024-02-10",
          uploadedBy: "王教授",
          status: "已批准",
          reviewType: "实验前评估",
        },
        {
          id: "doc8",
          name: "设备使用申请表.pdf",
          type: "pdf",
          size: "0.5 MB",
          uploadDate: "2024-02-10",
          uploadedBy: "王教授",
          status: "已批准",
          reviewType: "实验前评估",
        }
      ]
    },
    {
      id: "4",
      reviewType: "设施条件审查",
      documents: [
        {
          id: "doc9",
          name: "饲养环境检查报告.pdf",
          type: "pdf",
          size: "2.1 MB",
          uploadDate: "2024-01-20",
          uploadedBy: "张技术员",
          status: "已批准",
          reviewType: "设施条件审查",
        },
        {
          id: "doc10",
          name: "设施照片记录.zip",
          type: "zip",
          size: "15.3 MB",
          uploadDate: "2024-01-20",
          uploadedBy: "张技术员",
          status: "已批准",
          reviewType: "设施条件审查",
        }
      ]
    }
  ]

  // 整合所有文档
  const allDocuments = reviewDocuments.flatMap(review => review.documents)
  
  // 按照审查类型筛选文档
  const getFilteredDocuments = () => {
    let filtered = allDocuments
    
    // 按类型筛选
    if (activeFilter !== "all") {
      filtered = filtered.filter(doc => doc.reviewType === activeFilter)
    }
    
    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.reviewType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }
  
  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch(status) {
      case "审核中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "已批准":
      case "已审核":
        return "bg-green-50 text-green-700 border-green-200"
      case "已驳回":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* 搜索和筛选区域 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索文件名、上传人或审查类型..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            全部文件
          </Button>
          {reviewDocuments.map(review => (
            <Button 
              key={review.id}
              variant={activeFilter === review.reviewType ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveFilter(review.reviewType)}
            >
              {review.reviewType}
            </Button>
          ))}
        </div>
      </div>
      
      {/* 文件列表 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>送审文件</CardTitle>
              <CardDescription>
                {activeFilter === "all" ? "所有审查类型的送审文件" : `${activeFilter}的送审文件`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getFilteredDocuments().length} 个文件</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredDocuments().length > 0 ? (
              getFilteredDocuments().map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/10 transition-colors">
                  <div className="flex items-center gap-3">
                    {getFileIcon(document.type)}
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">{document.size}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {document.uploadDate}
                        </span>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-1" />
                      下载
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                没有找到相关文件
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 审查说明卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>审查说明</CardTitle>
          <CardDescription>各类审查对应的描述和要求</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewDocuments.map((review) => (
              <div key={review.id}>
                <h3 className="text-base font-medium">{review.reviewType}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {review.reviewType === "伦理审查" && "评估实验是否符合动物福利和伦理标准，确保遵循3R原则。"}
                  {review.reviewType === "安全审查" && "评估实验过程中的安全风险，包括操作人员、实验动物和环境安全。"}
                  {review.reviewType === "实验前评估" && "实验开始前的准备工作评估，包括实验方案、人员培训等。"}
                  {review.reviewType === "设施条件审查" && "评估实验设施是否满足实验要求，包括饲养环境、设备等。"}
                </p>
                <Separator className="my-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 