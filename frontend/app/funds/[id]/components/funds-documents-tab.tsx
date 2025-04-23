"use client"

import { useState } from "react"
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Trash2, 
  Archive, 
  Image,
  FileSpreadsheet,
  FileJson,
  File
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatFileSize } from "@/lib/utils"

// 文档类型图标映射
const documentTypeIcons = {
  pdf: <File className="h-5 w-5 text-red-500" />,
  doc: <FileText className="h-5 w-5 text-blue-500" />,
  docx: <FileText className="h-5 w-5 text-blue-500" />,
  xls: <FileSpreadsheet className="h-5 w-5 text-green-500" />,
  xlsx: <FileSpreadsheet className="h-5 w-5 text-green-500" />,
  ppt: <FileText className="h-5 w-5 text-orange-500" />,
  pptx: <FileText className="h-5 w-5 text-orange-500" />,
  zip: <Archive className="h-5 w-5 text-purple-500" />,
  rar: <Archive className="h-5 w-5 text-purple-500" />,
  jpg: <Image className="h-5 w-5 text-pink-500" />,
  jpeg: <Image className="h-5 w-5 text-pink-500" />,
  png: <Image className="h-5 w-5 text-pink-500" />,
  txt: <FileText className="h-5 w-5 text-gray-500" />,
  code: <FileJson className="h-5 w-5 text-cyan-500" />,
  default: <FileText className="h-5 w-5 text-gray-500" />
}

// 示例文档数据
const sampleDocuments = [
  {
    id: "doc1",
    name: "经费申请表.docx",
    type: "docx",
    size: 1024 * 1024 * 2.3, // 2.3MB
    uploadDate: "2023-12-15",
    uploadedBy: "张三",
    description: "国家自然科学基金项目经费申请表",
    category: "申请材料"
  },
  {
    id: "doc2",
    name: "预算明细表.xlsx",
    type: "xlsx",
    size: 1024 * 1024 * 1.5, // 1.5MB
    uploadDate: "2023-12-15",
    uploadedBy: "张三",
    description: "项目预算明细及分配方案",
    category: "预算文件"
  },
  {
    id: "doc3",
    name: "研究计划书.pdf",
    type: "pdf",
    size: 1024 * 1024 * 3.7, // 3.7MB
    uploadDate: "2023-12-16",
    uploadedBy: "李四",
    description: "详细的研究计划和方法论",
    category: "研究计划"
  },
  {
    id: "doc4",
    name: "设备购置清单.xlsx",
    type: "xlsx",
    size: 1024 * 1024 * 0.8, // 0.8MB
    uploadDate: "2023-12-18",
    uploadedBy: "王五",
    description: "项目所需设备清单及价格",
    category: "采购文件"
  },
  {
    id: "doc5",
    name: "专家评审意见.pdf",
    type: "pdf",
    size: 1024 * 1024 * 1.2, // 1.2MB
    uploadDate: "2024-01-05",
    uploadedBy: "系统管理员",
    description: "项目评审专家意见汇总",
    category: "评审文件"
  }
]

// 文档分类
const documentCategories = [
  "全部文档",
  "申请材料",
  "预算文件",
  "研究计划",
  "采购文件",
  "评审文件",
  "其他"
]

export default function FundsDocumentsTab({ data }: { data: any }) {
  const [activeCategory, setActiveCategory] = useState("全部文档")
  const [documents, setDocuments] = useState(sampleDocuments)
  
  // 根据分类筛选文档
  const filteredDocuments = activeCategory === "全部文档" 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">项目文档</CardTitle>
            <Button size="sm" className="h-8">
              <Upload className="h-4 w-4 mr-1" />
              上传文档
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 pb-4 overflow-x-auto">
            {documentCategories.map(category => (
              <Badge 
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                  <div className="flex items-center space-x-3">
                    {documentTypeIcons[doc.type as keyof typeof documentTypeIcons] || documentTypeIcons.default}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center text-xs text-slate-500 space-x-3 mt-1">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>上传于: {doc.uploadDate}</span>
                        <span>上传人: {doc.uploadedBy}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{doc.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <FileText className="h-10 w-10 mb-2 opacity-30" />
              <p>没有找到相关文档</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
