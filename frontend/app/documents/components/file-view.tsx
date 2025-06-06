"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  FilePenLine,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  File,
  Star,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Tag,
  Info,
} from "lucide-react"
import type { Document } from "../data/documents-data"

// 虚拟科研论文名称
const researchPaperTitles = [
  "基于深度学习的城市交通流量预测模型研究",
  "新型纳米材料在光催化降解有机污染物中的应用与机理探究",
  "人工智能辅助医学影像诊断系统的开发与临床验证",
  "气候变化对长江流域生态系统结构与功能的影响研究",
  "量子计算在密码学中的应用前景与安全性分析",
  "中医药现代化研究：传统理论与现代科��的融合与创新",
  "基于区块链技术的医疗数据安全共享机制设计与实现",
  "高效钙钛矿太阳能电池材料的设计、制备与性能优化",
  "城市空气污染物扩散模型的构建与多尺度验证",
  "脑机接口技术在运动功能障碍康复中的应用研究",
  "CRISPR/Cas9基因编辑技术在遗传性疾病治疗中的应用与伦理考量",
  "智能制造系统中的人机协作模式与效能评估研究",
  "新型冠状病毒变异株的免疫逃逸机制与疫苗保护效力研究",
  "可降解生物材料在软组织工程中的应用进展与临床转化",
  "大数据驱动的精准农业决策支持系统开发与应用效果评估",
]

// 科研领域和对应的颜色
const researchFields = [
  { name: "人工智能", color: "bg-blue-100 text-blue-800" },
  { name: "材料科学", color: "bg-purple-100 text-purple-800" },
  { name: "医学研究", color: "bg-green-100 text-green-800" },
  { name: "环境科学", color: "bg-teal-100 text-teal-800" },
  { name: "信息安全", color: "bg-red-100 text-red-800" },
  { name: "传统医学", color: "bg-amber-100 text-amber-800" },
  { name: "区块链", color: "bg-indigo-100 text-indigo-800" },
  { name: "新能源", color: "bg-emerald-100 text-emerald-800" },
  { name: "城市规划", color: "bg-sky-100 text-sky-800" },
  { name: "脑科学", color: "bg-violet-100 text-violet-800" },
  { name: "基因工程", color: "bg-pink-100 text-pink-800" },
  { name: "智能制造", color: "bg-orange-100 text-orange-800" },
  { name: "病毒学", color: "bg-rose-100 text-rose-800" },
  { name: "生物材料", color: "bg-lime-100 text-lime-800" },
  { name: "农业科技", color: "bg-cyan-100 text-cyan-800" },
]

interface FileViewProps {
  documents: Document[]
  onToggleStar: (docId: string) => void
  onAddTag: (docId: string, tag: string) => void
  onRemoveTag: (docId: string, tag: string) => void
}

export default function FileView({ documents, onToggleStar, onAddTag, onRemoveTag }: FileViewProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [newTag, setNewTag] = useState("")

  // Toggle file selection
  const toggleFileSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]))
  }

  // Get icon for document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Word":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "Excel":
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />
      case "PowerPoint":
        return <FilePenLine className="h-10 w-10 text-orange-500" />
      case "PDF":
        return <FileText className="h-10 w-10 text-red-500" />
      case "Image":
        return <FileImage className="h-10 w-10 text-purple-500" />
      case "Video":
        return <FileVideo className="h-10 w-10 text-pink-500" />
      case "Audio":
        return <FileAudio className="h-10 w-10 text-cyan-500" />
      case "Archive":
        return <Archive className="h-10 w-10 text-gray-500" />
      default:
        return <File className="h-10 w-10 text-slate-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN")
  }

  // Handle document click
  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    setShowDetailsDrawer(true)
  }

  // Get random research field
  const getRandomResearchField = (index: number) => {
    return researchFields[index % researchFields.length]
  }

  // If no documents
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <File className="h-16 w-16 text-muted-foreground/60 mb-4" />
        <h3 className="text-lg font-medium">该文件夹为空</h3>
        <p className="text-sm text-muted-foreground mt-1">此文件夹中还没有任何文档</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {documents.map((doc, index) => {
          const researchTitle = researchPaperTitles[index % researchPaperTitles.length]
          const researchField = getRandomResearchField(index)

          return (
            <Card
              key={doc.id}
              className={`overflow-hidden border cursor-pointer transition-all hover:border-primary/50 hover:shadow-md hover:translate-y-[-2px] ${
                selectedFiles.includes(doc.id) ? "border-primary ring-1 ring-primary" : ""
              }`}
              onClick={() => handleDocumentClick(doc)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(doc.id)
                      }}
                    >
                      {doc.isStarred ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDocumentClick(doc)
                          }}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Share2 className="mr-2 h-4 w-4" />
                          分享
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDocument(doc)
                            setShowTagDialog(true)
                          }}
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          管理标签
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-col items-center justify-center pt-8 pb-3 px-3">
                    {getDocumentIcon(doc.type)}
                    <Badge className={`mt-2 mb-1 ${researchField.color}`}>{researchField.name}</Badge>
                    <h3 className="text-sm font-medium text-center line-clamp-2 h-10 w-full">{researchTitle}</h3>
                  </div>
                  <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground flex justify-between">
                    <span>{formatFileSize(doc.size)}</span>
                    <span>{formatDate(doc.lastModified)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tag Management Dialog */}
      {selectedDocument && (
        <Dialog
          open={showTagDialog}
          onOpenChange={(open) => {
            if (!open) {
              setShowTagDialog(false)
              setNewTag("")
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>管理标签</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-3">
              <div>
                <Label className="mb-2">系统标签（自动生成）</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedDocument.autoTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {selectedDocument.autoTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无系统标签</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="mb-2">自定义标签</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedDocument.customTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="pr-1.5">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => onRemoveTag(selectedDocument.id, tag)}
                      >
                        <span className="sr-only">Remove</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </Button>
                    </Badge>
                  ))}
                  {selectedDocument.customTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无自定义标签</p>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="new-tag">添加新标签</Label>
                  <Input
                    id="new-tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="输入标签名称..."
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (newTag.trim()) {
                      onAddTag(selectedDocument.id, newTag.trim())
                      setNewTag("")
                    }
                  }}
                  disabled={!newTag.trim()}
                >
                  添加
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowTagDialog(false)}>完成</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 详情抽屉 */}
      <Sheet open={showDetailsDrawer} onOpenChange={setShowDetailsDrawer}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedDocument && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="text-xl flex items-center gap-2">
                  {getDocumentIcon(selectedDocument.type)}
                  {researchPaperTitles[documents.indexOf(selectedDocument) % researchPaperTitles.length]}
                </SheetTitle>
                <SheetDescription>
                  文件类型: {selectedDocument.type} · 大小: {formatFileSize(selectedDocument.size)}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <h3 className="text-sm font-medium mb-2">研究领域</h3>
                  <Badge className={getRandomResearchField(documents.indexOf(selectedDocument)).color}>
                    {getRandomResearchField(documents.indexOf(selectedDocument)).name}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">论文摘要</h3>
                  <p className="text-sm text-muted-foreground">
                    本研究探讨了相关领域的关键问题，通过实验和理论分析，提出了创新性的解决方案。
                    研究结果表明，所提出的方法在多个测试场景中表现出色，相比现有方法有显著提升。
                    这些发现为该领域的未来研究提供了新的思路和方向。
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">文件信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">上传日期</p>
                      <p className="text-lg font-medium">{formatDate(selectedDocument.uploadDate)}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">最后修改</p>
                      <p className="text-lg font-medium">{formatDate(selectedDocument.lastModified)}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">上传者</p>
                      <p className="text-lg font-medium">
                        {selectedDocument.uploadedBy === "current-user" ? "我" : selectedDocument.uploadedBy}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">引用次数</p>
                      <p className="text-lg font-medium">{Math.floor(Math.random() * 50)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRandomResearchField(documents.indexOf(selectedDocument)).color}>
                      {getRandomResearchField(documents.indexOf(selectedDocument)).name}
                    </Badge>
                    {selectedDocument.autoTags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {selectedDocument.customTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowDetailsDrawer(false)}>
                    关闭
                  </Button>
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    下载文件
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

