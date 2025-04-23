"use client"

import { useState } from "react"
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Clock, 
  FileImage,
  FileBadge,
  FileCheck,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FilePlus,
  Search,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

interface AchievementAwardDocumentsTabProps {
  data: any
}

export default function AchievementAwardDocumentsTab({ data }: AchievementAwardDocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // 模拟文档数据
  const documents = [
    {
      id: "doc1",
      name: "获奖证书.pdf",
      type: "certificate",
      size: "2.4 MB",
      uploadDate: "2023-12-15",
      uploadedBy: "张三",
      icon: <FileBadge className="h-5 w-5 text-amber-500" />,
      category: "证书文件"
    },
    {
      id: "doc2",
      name: "申报材料.pdf",
      type: "application",
      size: "8.7 MB",
      uploadDate: "2023-10-05",
      uploadedBy: "张三",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      category: "申报文件"
    },
    {
      id: "doc3",
      name: "技术报告.docx",
      type: "report",
      size: "3.2 MB",
      uploadDate: "2023-09-20",
      uploadedBy: "李四",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      category: "技术文档"
    },
    {
      id: "doc4",
      name: "成果照片.zip",
      type: "image",
      size: "15.6 MB",
      uploadDate: "2023-09-18",
      uploadedBy: "王五",
      icon: <FileImage className="h-5 w-5 text-purple-500" />,
      category: "图片资料"
    },
    {
      id: "doc5",
      name: "评审意见.pdf",
      type: "review",
      size: "1.8 MB",
      uploadDate: "2023-11-25",
      uploadedBy: "张三",
      icon: <FileCheck className="h-5 w-5 text-green-500" />,
      category: "评审文件"
    },
    {
      id: "doc6",
      name: "数据分析表.xlsx",
      type: "data",
      size: "4.3 MB",
      uploadDate: "2023-08-30",
      uploadedBy: "赵六",
      icon: <FileSpreadsheet className="h-5 w-5 text-green-500" />,
      category: "数据文件"
    },
    {
      id: "doc7",
      name: "源代码.zip",
      type: "code",
      size: "28.5 MB",
      uploadDate: "2023-08-15",
      uploadedBy: "孙七",
      icon: <FileCode className="h-5 w-5 text-slate-500" />,
      category: "代码文件"
    },
    {
      id: "doc8",
      name: "项目演示视频.mp4",
      type: "video",
      size: "86.2 MB",
      uploadDate: "2023-09-10",
      uploadedBy: "李四",
      icon: <FileArchive className="h-5 w-5 text-red-500" />,
      category: "多媒体"
    }
  ]
  
  // 根据标签和搜索过滤文档
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "certificates") return doc.type === "certificate" && matchesSearch
    if (activeTab === "applications") return doc.type === "application" && matchesSearch
    if (activeTab === "reports") return (doc.type === "report" || doc.type === "review") && matchesSearch
    if (activeTab === "media") return (doc.type === "image" || doc.type === "video") && matchesSearch
    if (activeTab === "data") return (doc.type === "data" || doc.type === "code") && matchesSearch
    
    return false
  })
  
  // 处理文档下载
  const handleDownload = (docId: string) => {
    const doc = documents.find(d => d.id === docId)
    if (doc) {
      toast({
        title: "开始下载",
        description: `正在下载 ${doc.name}`,
        duration: 3000,
      })
    }
  }
  
  // 处理文档预览
  const handlePreview = (docId: string) => {
    const doc = documents.find(d => d.id === docId)
    if (doc) {
      toast({
        title: "文档预览",
        description: `正在打开 ${doc.name} 预览`,
        duration: 3000,
      })
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">相关文档</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="搜索文档..."
                  className="w-full pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">筛选</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setActiveTab("all")}>
                    全部文档
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("certificates")}>
                    证书文件
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("applications")}>
                    申报文件
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("reports")}>
                    报告与评审
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("media")}>
                    图片与视频
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("data")}>
                    数据与代码
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="h-9 gap-1">
                <FilePlus className="h-4 w-4" />
                <span className="hidden sm:inline">上传</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all" className="text-xs">全部文档</TabsTrigger>
              <TabsTrigger value="certificates" className="text-xs">证书文件</TabsTrigger>
              <TabsTrigger value="applications" className="text-xs">申报文件</TabsTrigger>
              <TabsTrigger value="reports" className="text-xs">报告与评审</TabsTrigger>
              <TabsTrigger value="media" className="text-xs">图片与视频</TabsTrigger>
              <TabsTrigger value="data" className="text-xs">数据与代码</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-slate-900 mb-1">未找到文档</h3>
                  <p className="text-sm text-slate-500">没有符合当前筛选条件的文档</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {doc.icon}
                        <div>
                          <div className="font-medium text-sm text-slate-900">{doc.name}</div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span>{doc.size}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.uploadDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {doc.uploadedBy}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {doc.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handlePreview(doc.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownload(doc.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">文档上传历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-100 border-2 border-green-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">上传了获奖证书</h4>
                  <p className="text-xs text-slate-500 mt-0.5">张三上传了获奖证书.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-12-15 14:32</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-amber-100 border-2 border-amber-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">上传了评审意见</h4>
                  <p className="text-xs text-slate-500 mt-0.5">张三上传了评审意见.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-11-25 09:15</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">上传了申报材料</h4>
                  <p className="text-xs text-slate-500 mt-0.5">张三上传了申报材料.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-10-05 16:48</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-purple-100 border-2 border-purple-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">上传了技术报告</h4>
                  <p className="text-xs text-slate-500 mt-0.5">李四上传了技术报告.docx</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-09-20 11:23</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-slate-100 border-2 border-slate-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">上传了成果照片</h4>
                  <p className="text-xs text-slate-500 mt-0.5">王五上传了成果照片.zip</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-09-18 15:07</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
