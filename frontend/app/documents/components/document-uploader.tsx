"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, File, X, Check, AlertCircle, FolderOpen, FileType, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "../data/documents-data"
import { SearchSelect } from "@/components/ui/search-select"
import { get, post, submitForm } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { PageResult } from "@/lib/types/common"

// 文档类型接口
interface DocumentType {
  id: string;
  name: string;
  code?: string;
  description?: string;
  [key: string]: any;
}

interface DocumentUploaderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  onUploadComplete: (document: any) => void
}

export default function DocumentUploader({ open, onOpenChange, projects, onUploadComplete }: DocumentUploaderProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState<{id: string, name: string} | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<{id: string, name: string} | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [dragOver, setDragOver] = useState(false)
  const [documentUrl, setDocumentUrl] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // 搜索项目函数 - 适配SearchSelect组件
  const searchProjects = async (keyword: string, page: number, pageSize: number) => {
    try {
      // 调用后端API进行项目搜索
      const response = await get<{code: number, message: string, data: PageResult<any>}>('/api/project/horizontal/search', {
        params: {
          name: keyword, // 使用name作为项目名称的搜索参数
          pageNum: page,
          pageSize: pageSize
        }
      });
      
      // 处理响应结果
      if (response.code === 200 && response.data) {
        return {
          list: response.data.records,
          total: response.data.total
        };
      } else {
        console.error("项目搜索响应异常:", response);
        // 返回空结果
        return {
          list: [],
          total: 0
        };
      }
    } catch (error) {
      console.error("项目搜索失败:", error);
      toast({
        title: "搜索失败",
        description: "获取项目列表时发生错误",
        variant: "destructive"
      });
      
      // 发生错误时返回空结果
      return {
        list: [],
        total: 0
      };
    }
  };

  // 处理项目选择
  const handleProjectSelect = (id: string, project?: any) => {
    if (project) {
      setSelectedProject({ id, name: project.name });
      // 清空文档类型选择
      setSelectedDocType(null);
    }
  };

  // 搜索文档类型函数 - 基于选中的项目
  const searchDocTypes = async (keyword: string, page: number, pageSize: number) => {
    if (!selectedProject) {
      return {
        list: [],
        total: 0
      };
    }

    try {
      // 调用后端API进行文档类型搜索
      const response = await get<{code: number, message: string, data: PageResult<DocumentType>}>(
        `/api/todos/documents/doctypes/project/${selectedProject.id}/search`, 
        {
          params: {
            keyword: keyword,
            pageNum: page,
            pageSize: pageSize
          }
        }
      );
      
      if (response.code === 200 && response.data) {
        return {
          list: response.data.records,
          total: response.data.total
        };
      } else {
        console.error("文档类型搜索响应异常:", response);
        return {
          list: [],
          total: 0
        };
      }
    } catch (error) {
      console.error("文档类型搜索失败:", error);
      toast({
        title: "搜索失败",
        description: "获取文档类型列表时发生错误",
        variant: "destructive"
      });
      
      return {
        list: [],
        total: 0
      };
    }
  };

  // 处理文档类型选择
  const handleDocTypeSelect = (id: string, docType?: DocumentType) => {
    if (docType) {
      setSelectedDocType({ id, name: docType.name });
    }
  };

  // 使用submitForm方法实现文件上传
  const handleUpload = async () => {
    if (files.length === 0 || !selectedProject) return;

    setUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // 创建模拟上传进度（因为submitForm不提供进度回调）
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // 保持在90%，等待实际上传完成
          }
          return prev + 5;
        });
      }, 200);

      // 创建FormData对象
      const formData = new FormData();

      // 添加文件
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // 创建基础文档信息对象
      const documentBase = {
        projectId: selectedProject.id,
        typeId: selectedDocType?.id || null,
        type: selectedDocType?.name || null,
        description: documentDescription || null,
      };

      // 使用submitForm方法上传文件
      const response = await submitForm(
        '/api/todos/shared-files/documents/multi-upload',
        formData,
        documentBase,
        'documentBase'
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response && response.code === 200) {
        setUploadStatus("success");

        // 处理返回的文档ID列表
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // 如果返回的是文档ID数组，通过ID获取第一个文档的详细信息
          fetchDocumentDetail(response.data[0])
            .then(docDetail => {
              onUploadComplete(docDetail || {
                id: response.data[0],
                name: files[0].name,
                type: selectedDocType?.name || getDocumentType(files[0].name),
                size: files[0].size,
                uploadDate: new Date().toISOString(),
                projectId: selectedProject.id,
                projectName: selectedProject.name
              });
            })
            .catch(err => {
              console.error("获取文档详情失败:", err);
              // 使用基本信息作为回调
              onUploadComplete({
                id: response.data[0],
                name: files[0].name,
                type: selectedDocType?.name || getDocumentType(files[0].name),
                size: files[0].size,
                uploadDate: new Date().toISOString(),
                projectId: selectedProject.id,
                projectName: selectedProject.name
              });
            });
        } else {
          // 创建一个基本的文档对象作为回调
          onUploadComplete({
            id: `doc-${Date.now()}`,
            name: files[0].name,
            type: selectedDocType?.name || getDocumentType(files[0].name),
            size: files[0].size,
            uploadDate: new Date().toISOString(),
            projectId: selectedProject.id,
            projectName: selectedProject.name
          });
        }
      } else {
        setUploadStatus("error");
        toast({
          title: "上传失败",
          description: response?.message || "文件上传失败，请重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("文件上传失败:", error);
      setUploadStatus("error");
      toast({
        title: "上传失败",
        description: "上传过程中发生错误，请重试",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // 获取文档详情
  const fetchDocumentDetail = async (documentId: string) => {
    try {
      const response = await get(`/api/todos/shared-files/documents/${documentId}`)
      if (response.code === 200 && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error("获取文档详情失败:", error)
      return null
    }
  }

  // 从URL添加文档
  const handleUrlUpload = async () => {
    if (!documentUrl || !documentName || !selectedProject) return

    setUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      // 模拟进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90 // 保持在90%直到请求完成
          }
          return prev + 10
        })
      }, 300)

      // 调用后端API添加URL文档
      const response = await post('/api/todos/shared-files/documents/url', {
        url: documentUrl,
        name: documentName,
        projectId: selectedProject.id,
        typeId: selectedDocType?.id,
        description: documentDescription
      })

      clearInterval(progressInterval)

      if (response.code === 200) {
        setUploadProgress(100)
        setUploadStatus("success")

        // 调用完成回调
        onUploadComplete(response.data || {
          id: `doc-${Date.now()}`,
          name: documentName,
          type: selectedDocType ? selectedDocType.name : "URL",
          size: 0,
          uploadDate: new Date().toISOString(),
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          url: documentUrl
        })
      } else {
        setUploadStatus("error")
        toast({
          title: "添加失败",
          description: response.message || "URL文档添加失败，请重试",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("URL文档添加失败:", error)
      setUploadStatus("error")
      toast({
        title: "添加失败",
        description: "添加URL文档时发生错误，请重试",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  // Get document type based on file extension
  const getDocumentType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "doc":
      case "docx":
        return "Word"
      case "xls":
      case "xlsx":
        return "Excel"
      case "ppt":
      case "pptx":
        return "PowerPoint"
      case "pdf":
        return "PDF"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "Image"
      case "mp4":
      case "avi":
      case "mov":
        return "Video"
      case "mp3":
      case "wav":
        return "Audio"
      case "zip":
      case "rar":
        return "Archive"
      default:
        return "Other"
    }
  }

  // Reset the uploader
  const resetUploader = () => {
    setFiles([])
    setUploadProgress(0)
    setUploadStatus("idle")
    setDocumentUrl("")
    setDocumentName("")
    setDocumentDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>上传文档</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">上传文件</TabsTrigger>
            <TabsTrigger value="url">从URL添加</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="py-4">
            {uploadStatus === "idle" && (
              <>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">拖放文件到此处或点击上传</h3>
                    <p className="text-sm text-muted-foreground">支持所有常见文件格式</p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">已选择的文件 ({files.length})</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <File className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-[300px]">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">选择项目</Label>
                    <SearchSelect
                      placeholder="搜索并选择项目"
                      value={selectedProject?.id}
                      displayValue={selectedProject?.name}
                      onSearch={searchProjects}
                      onChange={handleProjectSelect}
                      labelField="name"
                      labelIcon={<FolderOpen className="h-4 w-4 text-blue-600" />}
                      displayFields={[
                        { 
                          field: "startDate", 
                          label: "开始日期", 
                          icon: <Calendar className="h-3.5 w-3.5 text-blue-500" />,
                          renderValue: (value) => value ? new Date(value).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                          }) : '-'
                        },
                        { 
                          field: "endDate", 
                          label: "结束日期", 
                          icon: <Calendar className="h-3.5 w-3.5 text-orange-500" />,
                          renderValue: (value) => value ? new Date(value).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                          }) : '-'
                        },
                        { field: "leaderName", label: "负责人", icon: <User className="h-3.5 w-3.5 text-green-500" /> }
                      ]}
                      allowEmptySearch={true}
                      pageSize={5}
                    />
                  </div>

                  {selectedProject && (
                    <div className="space-y-2">
                      <Label htmlFor="document-type">文档类型</Label>
                      <SearchSelect
                        placeholder="搜索并选择文档类型"
                        value={selectedDocType?.id}
                        displayValue={selectedDocType?.name}
                        onSearch={searchDocTypes}
                        onChange={handleDocTypeSelect}
                        labelField="name"
                        labelIcon={<FileType className="h-4 w-4 text-indigo-600" />}
                        displayFields={[
                          { field: "description", label: "描述" }
                        ]}
                        disabled={!selectedProject}
                        allowEmptySearch={true}
                        pageSize={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {!selectedProject ? "请先选择项目" : "请选择文档类型，如未选择将根据文件扩展名自动判断"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">文档描述</Label>
                    <Input
                      id="description"
                      placeholder="请输入文档描述（可选）"
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {uploadStatus === "uploading" && (
              <div className="py-8 space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">正在上传文件</h3>
                  <p className="text-sm text-muted-foreground">请稍候，文件正在上传中...</p>
                </div>
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-center text-sm">{uploadProgress}%</p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">上传成功</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {files.length > 1
                    ? `${files.length} 个文件已成功上传到 ${selectedProject?.name}`
                    : `文件已成功上传到 ${selectedProject?.name}`
                  }
                </p>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">上传失败</h3>
                <p className="text-sm text-muted-foreground text-center">上传过程中发生错误，请重试。</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">文档URL</Label>
                <Input
                  id="url"
                  placeholder="输入文档URL"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">文档名称</Label>
                <Input
                  id="name"
                  placeholder="输入文档名称"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-url">选择项目</Label>
                <SearchSelect
                  placeholder="搜索并选择项目"
                  onSearch={searchProjects}
                  onChange={handleProjectSelect}
                  labelField="name"
                  labelIcon={<FolderOpen className="h-4 w-4 text-blue-600" />}
                  value={selectedProject?.id}
                  displayValue={selectedProject?.name}
                  allowEmptySearch={true}
                  pageSize={5}
                />
              </div>
              
              {selectedProject && (
                <div className="space-y-2">
                  <Label htmlFor="document-type-url">文档类型</Label>
                  <SearchSelect
                    placeholder="搜索并选择文档类型"
                    value={selectedDocType?.id}
                    displayValue={selectedDocType?.name}
                    onSearch={searchDocTypes}
                    onChange={handleDocTypeSelect}
                    labelField="name"
                    labelIcon={<FileType className="h-4 w-4 text-indigo-600" />}
                    disabled={!selectedProject}
                    allowEmptySearch={true}
                    pageSize={5}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description-url">文档描述</Label>
                <Input
                  id="description-url"
                  placeholder="请输入文档描述（可选）"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {uploadStatus === "idle" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              {activeTab === "upload" ? (
                <Button
                  onClick={handleUpload}
                  disabled={files.length === 0 || !selectedProject || uploading}
                  className="bg-primary hover:bg-primary/90"
                >
                  上传文件{files.length > 1 ? `(${files.length})` : ''}
                </Button>
              ) : (
                <Button
                  onClick={handleUrlUpload}
                  disabled={!documentUrl || !documentName || !selectedProject || uploading}
                  className="bg-primary hover:bg-primary/90"
                >
                  添加URL文档
                </Button>
              )}
            </>
          )}

          {uploadStatus === "uploading" && (
            <Button variant="outline" disabled>
              上传中...
            </Button>
          )}

          {uploadStatus === "success" && (
            <>
              <Button variant="outline" onClick={resetUploader}>
                继续上传
              </Button>
              <Button onClick={() => onOpenChange(false)}>完成</Button>
            </>
          )}

          {uploadStatus === "error" && (
            <>
              <Button variant="outline" onClick={resetUploader}>
                重试
              </Button>
              <Button variant="destructive" onClick={() => onOpenChange(false)}>
                关闭
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

