"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { get, post, put, del } from "@/lib/api"
import { CreateDocTypeDialog } from "../documents/components/create-doctype-dialog"
import Link from "next/link"

// 文档类型接口
interface DocumentType {
  id: string
  name: string
  code?: string
  description?: string
  createdTime?: string
  isSystem?: boolean
}

// 项目接口
interface Project {
  id: string
  name: string
  startDate?: string
  endDate?: string
  status?: string
  documentTypes?: DocumentType[]
  expanded?: boolean
}

export default function DocumentTypesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentDocType, setCurrentDocType] = useState<DocumentType | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取项目列表和文档类型列表
  useEffect(() => {
    fetchProjects()
    fetchDocumentTypes()
  }, [])

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      // 初始页码为1，页大小为100
      const response = await get<{code: number, message: string, data: {total: number, list: Project[]}}>('/api/project/horizontal/search?pageNum=1&pageSize=100')
      if (response.code === 200) {
        // 设置项目列表，默认全部折叠
        setProjects(response.data.list.map(project => ({
          ...project,
          expanded: false,
          documentTypes: []
        })))
      }
    } catch (error) {
      console.error("获取项目列表失败:", error)
      toast({
        title: "获取项目列表失败",
        description: "请刷新页面重试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 获取所有文档类型
  const fetchDocumentTypes = async () => {
    try {
      const response = await get<{code: number, message: string, data: DocumentType[]}>('/api/todos/documents/doctypes')
      if (response.code === 200) {
        setDocumentTypes(response.data)
      }
    } catch (error) {
      console.error("获取文档类型列表失败:", error)
      toast({
        title: "获取文档类型列表失败",
        description: "请刷新页面重试",
        variant: "destructive"
      })
    }
  }

  // 切换项目展开/折叠状态
  const toggleProjectExpand = async (projectId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        // 如果是展开操作且该项目没有文档类型数据，则加载该项目的文档类型
        if (!project.expanded && (!project.documentTypes || project.documentTypes.length === 0)) {
          fetchProjectDocTypes(projectId)
        }
        return { ...project, expanded: !project.expanded }
      }
      return project
    })
    setProjects(updatedProjects)
  }

  // 获取项目关联的文档类型
  const fetchProjectDocTypes = async (projectId: string) => {
    try {
      // 假设这个API返回项目关联的文档类型列表
      // 实际中可能需要调整
      const response = await get<{code: number, message: string, data: DocumentType[]}>(`/api/todos/documents/doctypes/project/${projectId}`)
      if (response.code === 200) {
        const updatedProjects = projects.map(project => {
          if (project.id === projectId) {
            return { ...project, documentTypes: response.data }
          }
          return project
        })
        setProjects(updatedProjects)
      }
    } catch (error) {
      console.error(`获取项目(${projectId})文档类型失败:`, error)
      toast({
        title: "获取项目文档类型失败",
        description: "请刷新页面重试",
        variant: "destructive"
      })
    }
  }

  // 处理文档类型创建成功
  const handleDocTypeCreated = (docType: DocumentType) => {
    // 刷新文档类型列表
    fetchDocumentTypes()
    
    // 如果有选中的项目，则将新文档类型关联到该项目
    if (selectedProject) {
      associateDocTypeWithProject(docType.id, selectedProject.id)
    }
  }

  // 关联文档类型到项目
  const associateDocTypeWithProject = async (docTypeId: string, projectId: string) => {
    try {
      const response = await post<{code: number, message: string, data: string}>('/api/todos/documents/doctypes/project-association', {
        documentTypeId: docTypeId,
        projectId: projectId
      })
      
      if (response.code === 200) {
        toast({
          title: "关联成功",
          description: "文档类型已成功关联到项目"
        })
        
        // 刷新项目的文档类型列表
        fetchProjectDocTypes(projectId)
      }
    } catch (error) {
      console.error("关联文档类型到项目失败:", error)
      toast({
        title: "关联失败",
        description: "文档类型关联到项目失败",
        variant: "destructive"
      })
    }
  }

  // 打开编辑对话框
  const openEditDialog = (docType: DocumentType) => {
    setCurrentDocType(docType)
    setShowEditDialog(true)
  }

  // 打开删除确认对话框
  const openDeleteDialog = (docType: DocumentType) => {
    setCurrentDocType(docType)
    setShowDeleteDialog(true)
  }

  // 处理编辑文档类型
  const handleEditDocType = async (editedDocType: DocumentType) => {
    try {
      const response = await put<{code: number, message: string, data: boolean}>(`/api/todos/documents/doctypes/${editedDocType.id}`, editedDocType)
      
      if (response.code === 200 && response.data) {
        toast({
          title: "编辑成功",
          description: "文档类型已成功更新"
        })
        
        // 刷新文档类型列表
        fetchDocumentTypes()
        
        // 如果有展开的项目，刷新项目的文档类型
        const expandedProjects = projects.filter(p => p.expanded)
        expandedProjects.forEach(p => fetchProjectDocTypes(p.id))
        
        setShowEditDialog(false)
      }
    } catch (error) {
      console.error("编辑文档类型失败:", error)
      toast({
        title: "编辑失败",
        description: "文档类型更新失败",
        variant: "destructive"
      })
    }
  }

  // 处理删除文档类型
  const handleDeleteDocType = async () => {
    if (!currentDocType) return
    
    try {
      const response = await del<{code: number, message: string, data: boolean}>(`/api/todos/documents/doctypes/${currentDocType.id}`)
      
      if (response.code === 200 && response.data) {
        toast({
          title: "删除成功",
          description: "文档类型已成功删除"
        })
        
        // 刷新文档类型列表
        fetchDocumentTypes()
        
        // 如果有展开的项目，刷新项目的文档类型
        const expandedProjects = projects.filter(p => p.expanded)
        expandedProjects.forEach(p => fetchProjectDocTypes(p.id))
        
        setShowDeleteDialog(false)
      }
    } catch (error) {
      console.error("删除文档类型失败:", error)
      toast({
        title: "删除失败",
        description: "文档类型删除失败",
        variant: "destructive"
      })
    }
  }

  // 过滤项目列表
  const filteredProjects = searchQuery
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.documentTypes && project.documentTypes.some(dt => 
          dt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (dt.code && dt.code.toLowerCase().includes(searchQuery.toLowerCase()))
        ))
      )
    : projects

  return (
    <div className="h-full w-full bg-[#F5F7FA]">
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">文档类型管理</h1>
            <Button
              variant="link"
              asChild
              className="text-muted-foreground p-0"
            >
              <Link href="/documents">返回文档共享</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                setSelectedProject(null)
                setShowCreateDialog(true)
              }} 
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              新建文档类型
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目或文档类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <p>正在加载项目数据...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-md shadow-sm p-8 text-center">
              <p className="text-muted-foreground">未找到项目数据</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <Card key={project.id} className="shadow-sm">
                <CardHeader className="py-4 cursor-pointer" onClick={() => toggleProjectExpand(project.id)}>
                  <div className="flex items-center">
                    {project.expanded ? (
                      <ChevronDown className="h-5 w-5 mr-2 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <CardDescription>
                        {project.startDate && project.endDate ? 
                          `${project.startDate} 至 ${project.endDate}` : 
                          "无日期信息"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                {project.expanded && (
                  <CardContent>
                    <div className="mb-2 flex justify-between items-center">
                      <h4 className="text-sm font-medium">项目文档类型</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProject(project)
                          setShowCreateDialog(true)
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        添加文档类型
                      </Button>
                    </div>
                    
                    {project.documentTypes && project.documentTypes.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {project.documentTypes.map(docType => (
                          <div 
                            key={docType.id} 
                            className="flex items-center justify-between p-2 rounded-md border bg-background"
                          >
                            <div>
                              <p className="font-medium">{docType.name}</p>
                              {docType.code && (
                                <p className="text-xs text-muted-foreground">编码: {docType.code}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditDialog(docType)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(docType)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        项目暂无文档类型，请点击"添加文档类型"按钮添加
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 创建文档类型对话框 */}
      <CreateDocTypeDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={(docType) => {
          handleDocTypeCreated(docType)
          setShowCreateDialog(false)
        }}
        projectId={selectedProject?.id}
      />

      {/* 编辑文档类型对话框 */}
      {currentDocType && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑文档类型</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  defaultValue={currentDocType.name}
                  onChange={(e) => setCurrentDocType({...currentDocType, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  编码
                </Label>
                <Input
                  id="code"
                  className="col-span-3"
                  defaultValue={currentDocType.code || ''}
                  onChange={(e) => setCurrentDocType({...currentDocType, code: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  描述
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  defaultValue={currentDocType.description || ''}
                  onChange={(e) => setCurrentDocType({...currentDocType, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                取消
              </Button>
              <Button onClick={() => handleEditDocType(currentDocType)}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 删除确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除文档类型 "{currentDocType?.name}" 吗？此操作不可撤销。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocType}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 