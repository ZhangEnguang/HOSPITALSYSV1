"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Edit, Upload, Info, Trash2, Loader2, FileUp, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface DocumentsTabProps {
  todo?: any
}

export default function DocumentsTab({ todo }: DocumentsTabProps) {
  // 状态管理
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "项目立项书.docx",
      type: "Word",
      size: "2.5MB",
      date: "2024-01-15",
      uploader: "张教授",
      description: "包含项目基本信息、研究目标、预期成果等内容",
      version: "1.2",
      lastModified: "2024-01-20",
      url: "#", // 模拟文档URL
      status: "completed", // 文档状态：completed, uploading
    },
    {
      id: 2,
      name: "技术方案.pdf",
      type: "PDF",
      size: "4.8MB",
      date: "2024-02-10",
      uploader: "李研究员",
      description: "详细的技术实现方案和架构设计",
      version: "2.0",
      lastModified: "2024-02-15",
      url: "#", // 模拟文档URL
      status: "completed",
    },
    {
      id: 3,
      name: "预算规划.xlsx",
      type: "Excel",
      size: "1.2MB",
      date: "2024-02-15",
      uploader: "王助理",
      description: "项目经费预算和使用计划",
      version: "1.5",
      lastModified: "2024-03-01",
      url: "#", // 模拟文档URL
      status: "completed",
    },
    {
      id: 4,
      name: "进度报告.pptx",
      type: "PowerPoint",
      size: "3.7MB",
      date: "2024-03-20",
      uploader: "赵主任",
      description: "项目阶段性进展和成果展示",
      version: "1.0",
      lastModified: "2024-03-20",
      url: "#", // 模拟文档URL
      status: "completed",
    },
  ])

  const [editingDoc, setEditingDoc] = useState(null)
  const [editErrors, setEditErrors] = useState({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState(null)
  const [downloadingDocs, setDownloadingDocs] = useState<number[]>([])
  const [uploadFiles, setUploadFiles] = useState([])
  const [newDocuments, setNewDocuments] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // 使用ref保存关闭对话框的函数
  const closeDialogRef = useRef(null)
  const closeEditDialogRef = useRef(null)

  // 获取文档图标
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Word":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "PDF":
        return <FileText className="h-6 w-6 text-red-500" />
      case "Excel":
        return <FileText className="h-6 w-6 text-green-500" />
      case "PowerPoint":
        return <FileText className="h-6 w-6 text-orange-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  // 处理文档删除
  const handleDeleteDocument = () => {
    if (!docToDelete) return
    setDocuments(documents.filter((d) => d.id !== docToDelete.id))
    setDocToDelete(null)
    setDeleteConfirmOpen(false)
  }

  // 打开删除确认对话框
  const openDeleteConfirm = (doc, e) => {
    if (e) e.stopPropagation()
    setDocToDelete(doc)
    setDeleteConfirmOpen(true)
  }

  // 处理文档编辑
  const handleEditDocument = (doc, e) => {
    if (e) e.stopPropagation() // 阻止事件冒泡
    setEditingDoc({ ...doc })
    setEditErrors({}) // 清空错误状态
  }

  // 验证编辑表单
  const validateEditForm = () => {
    const errors = {}

    if (!editingDoc.name || editingDoc.name.trim() === "") {
      errors["name"] = "文件名不能为空"
    }

    setEditErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 保存编辑的文档
  const saveEditedDocument = () => {
    if (!editingDoc) return

    // 验证表单
    if (!validateEditForm()) {
      return // 如果验证失败，不继续执行
    }

    setDocuments(documents.map((doc) => (doc.id === editingDoc.id ? editingDoc : doc)))
    setEditingDoc(null)

    // 关闭编辑对话框
    if (closeEditDialogRef.current) {
      closeEditDialogRef.current.click()
    }
  }

  // 打开文档
  const openDocument = (url, e) => {
    e.stopPropagation() // 阻止事件冒泡
    window.open(url, "_blank")
  }

  // 下载文档
  const downloadDocument = (doc, e) => {
    e.stopPropagation() // 阻止事件冒泡

    // 如果已经在下载中，则不重复下载
    if (downloadingDocs.includes(doc.id)) return

    // 设置下载状态
    setDownloadingDocs((prev) => [...prev, doc.id])

    // 模拟下载延迟
    setTimeout(() => {
      // 创建一个模拟的文件内容
      const content = `这是${doc.name}的模拟内容。\n包含项目信息和相关数据。`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      // 创建一个临时的a标签来触发下载
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()

      // 清理
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // 下载完成，移除下载状态
      setDownloadingDocs((prev) => prev.filter((id) => id !== doc.id))
    }, 1500) // 模拟1.5秒的下载时间
  }

  // 检查文档是否正在下载
  const isDownloading = (docId) => {
    return downloadingDocs.includes(docId)
  }

  // 修改文件上传处理逻辑，允许添加多个文件而不是替换
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // 创建新文档对象
    const newDocs = files.map((file) => {
      // 获取文件类型
      let type = "其他"
      const extension = file.name.split(".").pop().toLowerCase()
      if (["doc", "docx"].includes(extension)) type = "Word"
      else if (["xls", "xlsx"].includes(extension)) type = "Excel"
      else if (["ppt", "pptx"].includes(extension)) type = "PowerPoint"
      else if (extension === "pdf") type = "PDF"

      // 格式化文件大小
      const size =
        file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)}KB` : `${(file.size / (1024 * 1024)).toFixed(1)}MB`

      const id = Date.now() + Math.random()

      return {
        id,
        name: file.name,
        type,
        size,
        date: new Date().toISOString().split("T")[0],
        uploader: "当前用户",
        description: "",
        version: "1.0",
        lastModified: new Date().toISOString().split("T")[0],
        url: "#",
        file,
      }
    })

    // 添加到现有列表而不是替换
    setNewDocuments((prev) => [...prev, ...newDocs])
    setUploadFiles((prev) => [...prev, ...files])
  }

  // 修改上传文档函数，关闭弹框后在主界面显示上传进度
  const uploadDocument = () => {
    if (newDocuments.length === 0) {
      alert("请选择文件")
      return
    }

    // 准备上传文档
    const maxId = Math.max(0, ...documents.map((d) => d.id))
    const docsToUpload = newDocuments.map((doc, index) => ({
      ...doc,
      id: maxId + index + 1,
      status: "uploading", // 标记为上传中
    }))

    // 初始化每个文件的上传进度
    const initialProgress = {}
    docsToUpload.forEach((doc) => {
      initialProgress[doc.id] = 5 // 初始进度5%
    })
    setUploadProgress(initialProgress)

    // 将上传中的文档添加到文档列表顶部
    setDocuments((prev) => [...docsToUpload, ...prev])

    // 关闭对话框
    if (closeDialogRef.current) {
      closeDialogRef.current.click()
    }
    setDialogOpen(false)

    // 清空待上传列表
    setNewDocuments([])
    setUploadFiles([])

    // 模拟上传进度
    const progressIntervals = {}

    docsToUpload.forEach((doc) => {
      progressIntervals[doc.id] = setInterval(
        () => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            if (newProgress[doc.id] < 95) {
              newProgress[doc.id] += Math.floor(Math.random() * 5) + 1
              if (newProgress[doc.id] > 95) newProgress[doc.id] = 95
            }
            return newProgress
          })
        },
        200 + Math.random() * 300,
      )
    })

    // 模拟上传延迟
    setTimeout(() => {
      // 清除所有定时器
      Object.values(progressIntervals).forEach((interval) => clearInterval(interval))

      // 设置所有文件为100%完成
      setUploadProgress((prev) => {
        const newProgress = { ...prev }
        docsToUpload.forEach((doc) => {
          newProgress[doc.id] = 100
        })
        return newProgress
      })

      // 更新文档状态为已完成
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((doc) =>
            docsToUpload.some((uploadDoc) => uploadDoc.id === doc.id) ? { ...doc, status: "completed" } : doc,
          ),
        )

        // 延迟后清除进度信息
        setTimeout(() => {
          setUploadProgress({})
        }, 500)
      }, 500)
    }, 3000)
  }

  // 添加移除单个文件的函数
  const removeFile = (docId) => {
    setNewDocuments((prev) => prev.filter((doc) => doc.id !== docId))
    setUploadFiles((prev) => {
      const docToRemove = newDocuments.find((doc) => doc.id === docId)
      if (!docToRemove) return prev
      return prev.filter((file) => file !== docToRemove.file)
    })
  }

  // 取消上传中的文档
  const cancelUpload = (docId, e) => {
    if (e) e.stopPropagation()
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[docId]
      return newProgress
    })
  }

  return (
    <div>
      {/* 删除确认对话框 */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              {docToDelete
                ? `您确定要删除文档 "${docToDelete.name}" 吗？此操作无法撤销。`
                : "确定要删除此文档吗？此操作无法撤销。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteDocument}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">
          项目文档 ({documents.filter((d) => d.status === "completed").length}份)
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              上传文档
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上传新文档</DialogTitle>
            </DialogHeader>
            {/* 修改对话框内容部分 */}
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                  multiple
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">点击或拖拽文件到此处上传</p>
                    <p className="text-xs text-muted-foreground">支持 DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF</p>
                  </div>
                </label>
              </div>

              {newDocuments.length > 0 && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">待上传文件 ({newDocuments.length})</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewDocuments([])
                        setUploadFiles([])
                      }}
                    >
                      清空
                    </Button>
                  </div>

                  {newDocuments.map((doc, index) => (
                    <div key={doc.id} className="space-y-2 border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center mr-3 border">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => removeFile(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`upload-description-${index}`}>文档描述</Label>
                        <Textarea
                          id={`upload-description-${index}`}
                          value={doc.description}
                          onChange={(e) => {
                            const updatedDocs = [...newDocuments]
                            updatedDocs[index].description = e.target.value
                            setNewDocuments(updatedDocs)
                          }}
                          className="min-h-[80px]"
                          placeholder="请输入文档描述..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 修改对话框底部按钮 */}
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadFiles([])
                    setNewDocuments([])
                  }}
                  ref={closeDialogRef}
                >
                  取消
                </Button>
              </DialogClose>
              <Button onClick={uploadDocument} disabled={newDocuments.length === 0}>
                <Upload className="h-4 w-4 mr-2" />
                确认上传
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg">
        {documents.map((doc, index) => (
          <div key={doc.id} className="relative group">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`py-4 ${index !== 0 ? "pt-5" : ""} flex items-center justify-between hover:bg-slate-50 transition-colors rounded-md px-2 cursor-pointer ${
                    doc.status === "uploading" ? "bg-slate-50" : ""
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center mr-3`}>
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium">{doc.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span className="mx-2">•</span>
                        <span>{doc.size}</span>
                        <span className="mx-2">•</span>
                        <span>上传人: {doc.uploader}</span>
                      </div>

                      {/* 上传进度条 - 仅在上传过程中显示 */}
                      {doc.status === "uploading" && uploadProgress[doc.id] && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">上传进度</span>
                            <span>{uploadProgress[doc.id]}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress[doc.id]}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 上传中的取消按钮 */}
                  {doc.status === "uploading" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={(e) => cancelUpload(doc.id, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </PopoverTrigger>

              {doc.status === "completed" && (
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                      文档详细信息
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">文件名</p>
                        <p>{doc.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">类型</p>
                        <p>{doc.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">大小</p>
                        <p>{doc.size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">上传日期</p>
                        <p>{doc.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">上传人</p>
                        <p>{doc.uploader}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">版本</p>
                        <p>{doc.version}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">最后修改</p>
                        <p>{doc.lastModified}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">描述</p>
                        <p>{doc.description}</p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              )}
            </Popover>

            {doc.status === "completed" && (
              <div className="absolute right-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openDocument(doc.url, e)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => downloadDocument(doc, e)}
                  disabled={isDownloading(doc.id)}
                >
                  {isDownloading(doc.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
                <Dialog
                  open={editDialogOpen && editingDoc?.id === doc.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setEditingDoc(null)
                      setEditErrors({})
                    }
                    setEditDialogOpen(open)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditDocument(doc, e)
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>编辑文档信息</DialogTitle>
                    </DialogHeader>
                    {editingDoc && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name" className="flex items-center">
                            文件名 <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="edit-name"
                            value={editingDoc.name}
                            onChange={(e) => {
                              setEditingDoc({ ...editingDoc, name: e.target.value })
                              // 实时验证
                              if (e.target.value.trim() === "") {
                                setEditErrors({ ...editErrors, name: "文件名不能为空" })
                              } else {
                                const newErrors = { ...editErrors }
                                delete newErrors.name
                                setEditErrors(newErrors)
                              }
                            }}
                            className={editErrors.name ? "border-red-500" : ""}
                          />
                          {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-type">文件类型</Label>
                            <Input id="edit-type" value={editingDoc.type} disabled className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-size">文件大小</Label>
                            <Input id="edit-size" value={editingDoc.size} disabled className="bg-muted" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-uploader">上传人</Label>
                            <Input id="edit-uploader" value={editingDoc.uploader} disabled className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-date">上传日期</Label>
                            <Input id="edit-date" value={editingDoc.date} disabled className="bg-muted" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">文档描述</Label>
                          <Textarea
                            id="edit-description"
                            value={editingDoc.description}
                            onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                            className="min-h-[100px]"
                            placeholder="请输入文档描述..."
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingDoc(null)
                            setEditErrors({})
                          }}
                          ref={closeEditDialogRef}
                        >
                          取消
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={saveEditedDocument}
                        disabled={Object.keys(editErrors).length > 0 || (editingDoc && !editingDoc.name)}
                      >
                        保存
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    openDeleteConfirm(doc, e)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

