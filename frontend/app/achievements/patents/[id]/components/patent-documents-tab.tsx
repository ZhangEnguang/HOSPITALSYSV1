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

interface PatentDocumentsTabProps {
  data: any
}

export default function PatentDocumentsTab({ data }: PatentDocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // 模拟文档数据
  const documents = [
    {
      id: "doc1",
      name: "专利申请书.pdf",
      type: "application",
      size: "3.5 MB",
      uploadDate: "2023-06-10",
      uploadedBy: "张三",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      category: "申请文件"
    },
    {
      id: "doc2",
      name: "说明书.pdf",
      type: "specification",
      size: "5.2 MB",
      uploadDate: "2023-06-10",
      uploadedBy: "张三",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      category: "申请文件"
    },
    {
      id: "doc3",
      name: "权利要求书.pdf",
      type: "claims",
      size: "1.8 MB",
      uploadDate: "2023-06-10",
      uploadedBy: "张三",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      category: "申请文件"
    },
    {
      id: "doc4",
      name: "说明书附图.pdf",
      type: "drawings",
      size: "4.3 MB",
      uploadDate: "2023-06-10",
      uploadedBy: "张三",
      icon: <FileImage className="h-5 w-5 text-purple-500" />,
      category: "附图"
    },
    {
      id: "doc5",
      name: "受理通知书.pdf",
      type: "notice",
      size: "0.8 MB",
      uploadDate: "2023-06-25",
      uploadedBy: "李四",
      icon: <FileBadge className="h-5 w-5 text-amber-500" />,
      category: "通知书"
    },
    {
      id: "doc6",
      name: "公开通知书.pdf",
      type: "notice",
      size: "0.7 MB",
      uploadDate: "2023-09-15",
      uploadedBy: "李四",
      icon: <FileBadge className="h-5 w-5 text-amber-500" />,
      category: "通知书"
    },
    {
      id: "doc7",
      name: "实质审查通知书.pdf",
      type: "notice",
      size: "1.2 MB",
      uploadDate: "2023-12-05",
      uploadedBy: "李四",
      icon: <FileBadge className="h-5 w-5 text-amber-500" />,
      category: "通知书"
    },
    {
      id: "doc8",
      name: "审查意见答复.pdf",
      type: "response",
      size: "2.5 MB",
      uploadDate: "2024-01-10",
      uploadedBy: "张三",
      icon: <FileCheck className="h-5 w-5 text-green-500" />,
      category: "答复文件"
    },
    {
      id: "doc9",
      name: "专利检索报告.pdf",
      type: "search",
      size: "3.1 MB",
      uploadDate: "2023-08-20",
      uploadedBy: "王五",
      icon: <FileSpreadsheet className="h-5 w-5 text-green-500" />,
      category: "检索报告"
    },
    {
      id: "doc10",
      name: "技术交底书.docx",
      type: "disclosure",
      size: "2.8 MB",
      uploadDate: "2023-05-15",
      uploadedBy: "张三",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      category: "内部文件"
    }
  ]
  
  // 根据标签和搜索过滤文档
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "application") return (doc.type === "application" || doc.type === "specification" || doc.type === "claims") && matchesSearch
    if (activeTab === "notices") return doc.type === "notice" && matchesSearch
    if (activeTab === "drawings") return doc.type === "drawings" && matchesSearch
    if (activeTab === "responses") return doc.type === "response" && matchesSearch
    if (activeTab === "internal") return (doc.type === "disclosure" || doc.type === "search") && matchesSearch
    
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
            <CardTitle className="text-lg font-semibold">专利文档</CardTitle>
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
                  <DropdownMenuItem onClick={() => setActiveTab("application")}>
                    申请文件
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("notices")}>
                    通知书
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("drawings")}>
                    附图
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("responses")}>
                    答复文件
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("internal")}>
                    内部文件
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
              <TabsTrigger value="application" className="text-xs">申请文件</TabsTrigger>
              <TabsTrigger value="notices" className="text-xs">通知书</TabsTrigger>
              <TabsTrigger value="drawings" className="text-xs">附图</TabsTrigger>
              <TabsTrigger value="responses" className="text-xs">答复文件</TabsTrigger>
              <TabsTrigger value="internal" className="text-xs">内部文件</TabsTrigger>
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
          <CardTitle className="text-lg font-semibold">专利流程记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-100 border-2 border-green-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">收到实质审查通知书</h4>
                  <p className="text-xs text-slate-500 mt-0.5">李四上传了实质审查通知书.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-12-05 10:15</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">收到公开通知书</h4>
                  <p className="text-xs text-slate-500 mt-0.5">李四上传了公开通知书.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-09-15 14:30</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-purple-100 border-2 border-purple-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">完成专利检索</h4>
                  <p className="text-xs text-slate-500 mt-0.5">王五上传了专利检索报告.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-08-20 11:45</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 pb-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-amber-100 border-2 border-amber-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">收到受理通知书</h4>
                  <p className="text-xs text-slate-500 mt-0.5">李四上传了受理通知书.pdf</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-06-25 09:20</span>
                </div>
              </div>
            </div>
            
            <div className="relative pl-6 border-l border-slate-200">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-slate-100 border-2 border-slate-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">提交专利申请</h4>
                  <p className="text-xs text-slate-500 mt-0.5">张三上传了专利申请文件</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>2023-06-10 16:30</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
