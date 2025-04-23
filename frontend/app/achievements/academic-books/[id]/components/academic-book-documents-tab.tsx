"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Upload,
  Plus,
  ExternalLink,
  File
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

interface AcademicBookDocumentsTabProps {
  data: any
}

export default function AcademicBookDocumentsTab({ data }: AcademicBookDocumentsTabProps) {
  const [documents, setDocuments] = useState([
    {
      id: "1",
      name: "著作样章.pdf",
      type: "样章",
      size: "3.2 MB",
      uploadDate: "2023-10-15",
      uploadBy: "张三",
      version: "1.0",
      downloadUrl: "#"
    },
    {
      id: "2",
      name: "目录与前言.pdf",
      type: "目录",
      size: "1.5 MB",
      uploadDate: "2023-10-15",
      uploadBy: "张三",
      version: "1.0",
      downloadUrl: "#"
    },
    {
      id: "3",
      name: "勘误表.pdf",
      type: "勘误",
      size: "0.8 MB",
      uploadDate: "2023-11-20",
      uploadBy: "李四",
      version: "1.1",
      downloadUrl: "#"
    },
    {
      id: "4",
      name: "配套习题集.pdf",
      type: "配套资料",
      size: "2.6 MB",
      uploadDate: "2023-12-05",
      uploadBy: "张三",
      version: "1.0",
      downloadUrl: "#"
    }
  ])

  const handleDownload = (document: any) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${document.name}`,
      duration: 3000,
    })
  }

  const handlePreview = (document: any) => {
    toast({
      title: "文档预览",
      description: `正在打开 ${document.name} 预览`,
      duration: 3000,
    })
  }

  const handleUpload = () => {
    toast({
      title: "上传文档",
      description: "文档上传功能正在开发中",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>著作文档</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {documents.length} 个文件
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              size="sm"
              className="gap-1"
              onClick={handleUpload}
            >
              <Upload className="h-4 w-4" />
              <span>上传文档</span>
            </Button>
          </div>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{doc.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-slate-100">
                          {doc.type}
                        </Badge>
                      </span>
                      <span className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        {doc.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {doc.uploadDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-slate-600"
                    onClick={() => handlePreview(doc)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-xs">预览</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-slate-600"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="text-xs">下载</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>出版信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">出版社官网</div>
                  <div className="text-xs text-blue-600 hover:underline">
                    {data.publisher ? `https://${data.publisher.toLowerCase().replace(/\s+/g, '')}.com/books/${data.id}` : '#'}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-slate-600"
                onClick={() => window.open(data.publisher ? `https://${data.publisher.toLowerCase().replace(/\s+/g, '')}.com/books/${data.id}` : '#', '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="text-xs">访问</span>
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">图书在线购买</div>
                  <div className="text-xs text-blue-600 hover:underline">
                    https://book.example.com/detail/{data.id}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-slate-600"
                onClick={() => window.open(`https://book.example.com/detail/${data.id}`, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="text-xs">访问</span>
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">豆瓣读书评价</div>
                  <div className="text-xs text-blue-600 hover:underline">
                    https://book.douban.com/subject/{data.id}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-slate-600"
                onClick={() => window.open(`https://book.douban.com/subject/${data.id}`, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="text-xs">访问</span>
              </Button>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  toast({
                    title: "添加链接",
                    description: "添加外部链接功能正在开发中",
                    duration: 3000,
                  })
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>添加链接</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
