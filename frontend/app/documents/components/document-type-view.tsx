"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  StarOff,
} from "lucide-react"
import type { Document } from "../data/documents-data"

interface DocumentTypeViewProps {
  documents: Document[]
  onToggleStar: (docId: string) => void
  onAddTag: (docId: string, tag: string) => void
  onRemoveTag: (docId: string, tag: string) => void
}

export default function DocumentTypeView({ documents, onToggleStar, onAddTag, onRemoveTag }: DocumentTypeViewProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [newTag, setNewTag] = useState("")

  // Group documents by type
  const documentsByType = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = []
      }
      acc[doc.type].push(doc)
      return acc
    },
    {} as Record<string, Document[]>,
  )

  // Get icon for document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Word":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "Excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "PowerPoint":
        return <FilePenLine className="h-5 w-5 text-orange-500" />
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />
      case "Image":
        return <FileImage className="h-5 w-5 text-purple-500" />
      case "Video":
        return <FileVideo className="h-5 w-5 text-pink-500" />
      case "Audio":
        return <FileAudio className="h-5 w-5 text-cyan-500" />
      case "Archive":
        return <Archive className="h-5 w-5 text-gray-500" />
      default:
        return <File className="h-5 w-5 text-slate-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(documentsByType).map(([type, docs]) => (
        <Card key={type} className="overflow-hidden border-border">
          <CardHeader className="pb-2 pt-5">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              {getDocumentIcon(type)}
              <span>{type} 文档</span>
              <Badge variant="outline" className="ml-auto">
                {docs.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="px-6 pb-4">
                {docs.map((doc, index) => (
                  <div key={doc.id}>
                    <div className="py-2.5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {getDocumentIcon(type)}
                          <div>
                            <div
                              className="font-medium hover:text-primary cursor-pointer text-sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              {doc.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {formatFileSize(doc.size)} • 上传于 {formatDate(doc.uploadDate)}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {doc.autoTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.customTags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleStar(doc.id)}>
                            {doc.isStarred ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>查看详情</DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                下载
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                分享
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocument(doc)
                                  setShowTagDialog(true)
                                }}
                              >
                                <Tag className="mr-2 h-4 w-4" />
                                管理标签
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    {index < docs.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}

      {/* Document Detail Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument && !showTagDialog} onOpenChange={(open) => !open && setSelectedDocument(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getDocumentIcon(selectedDocument.type)}
                {selectedDocument.name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-3">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => onToggleStar(selectedDocument.id)}>
                  {selectedDocument.isStarred ? (
                    <>
                      <StarOff className="h-4 w-4" />
                      取消星标
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      添加星标
                    </>
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    下载
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    分享
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">文件类型</p>
                  <p className="text-sm">{selectedDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">文件大小</p>
                  <p className="text-sm">{formatFileSize(selectedDocument.size)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">上传者</p>
                  <p className="text-sm">
                    {selectedDocument.uploadedBy === "current-user" ? "我" : selectedDocument.uploadedBy}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">上传日期</p>
                  <p className="text-sm">{formatDate(selectedDocument.uploadDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">最后修改</p>
                  <p className="text-sm">{formatDate(selectedDocument.lastModified)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">所属项目</p>
                  <p className="text-sm">{selectedDocument.path.split("/")[1]}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">文件路径</p>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedDocument.path}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">标签</p>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setShowTagDialog(true)}>
                    管理标签
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
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
                  {selectedDocument.autoTags.length === 0 && selectedDocument.customTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无标签</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
    </div>
  )
}

