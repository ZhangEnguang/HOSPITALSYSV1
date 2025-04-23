"use client"

import { useState, useEffect, useRef } from "react"
import { Search, List, Star, User, Filter, FolderOpen, Plus, FileType, ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SearchSelect } from "@/components/ui/search-select"
import { mockDocuments, mockProjects, documentTypeColors } from "./data/documents-data"
import DocumentListView from "./components/document-list-view"
import DocumentUploader from "./components/document-uploader"
import TagsInput from "./components/tags-input"
import FolderView from "./components/folder-view"
import FileView from "./components/file-view"
import { get, post, put, del } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CreateDocTypeDialog } from "./components/create-doctype-dialog"
import dynamic from "next/dynamic"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageResult } from "@/lib/types/common"
import { formatDate } from "./utils/date-formatter"

// 使用动态导入避免水合不匹配
const DocTypeManagerDialog = dynamic(() => import('./components/doc-type-manager-dialog'), { ssr: false })

// ClientOnly组件包装器
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  return <>{children}</>;
}

// 定义项目类型接口
interface Project {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  charger?: string;
  documentTypes?: DocumentType[];
  expanded?: boolean;
  [key: string]: any;
}

// 文档类型接口
interface DocumentType {
  id: string
  name: string
  code?: string
  description?: string
  createdTime?: string
  isSystem?: boolean
}

export default function DocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "folder">("folder")
  const [documents, setDocuments] = useState(mockDocuments)
  const [filteredDocuments, setFilteredDocuments] = useState(mockDocuments)
  const [activeTab, setActiveTab] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<Array<{id: string, name: string}>>([])
  const [selectedProject, setSelectedProject] = useState<{id: string, name: string} | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string; type: "root" | "project" | "folder" }[]>([
    { id: "root", name: "文档共享", type: "root" },
  ])
  const [documentTypesData, setDocumentTypesData] = useState<{id: string, name: string}[]>([])
  
  // 文档类型管理弹出层相关状态
  const [showDocTypeManager, setShowDocTypeManager] = useState(false)

  // Get all unique tags from documents
  const allTags = Array.from(new Set(documents.flatMap((doc) => [
    ...(Array.isArray(doc.autoTags) ? doc.autoTags : []), 
    ...(Array.isArray(doc.customTags) ? doc.customTags : [])
  ])))

  // Get all unique document types
  const documentTypes = Array.from(new Set(documents.map((doc) => doc.type)))

  // 加载文档类型列表
  const fetchDocTypes = async () => {
    try {
      const response = await get<{code: number, message: string, data: any[]}>('/api/todos/documents/doctypes/list');
      if (response.code === 200) {
        setDocumentTypesData(response.data);
      }
    } catch (error) {
      console.error("获取文档类型列表失败:", error);
      toast({
        title: "获取文档类型失败",
        description: "请刷新页面重试",
        variant: "destructive"
      });
    }
  }

  // 页面加载时获取文档类型列表
  useEffect(() => {
    fetchDocTypes();
  }, []);

  // Filter documents based on search query, selected tags, and active tab
  useEffect(() => {
    let filtered = [...documents]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          (Array.isArray(doc.autoTags) ? doc.autoTags.some(tag => tag && tag.toLowerCase().includes(query)) : false) ||
          (Array.isArray(doc.customTags) ? doc.customTags.some(tag => tag && tag.toLowerCase().includes(query)) : false)
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedTags.some((tag) => 
          (Array.isArray(doc.autoTags) ? doc.autoTags.includes(tag) : false) || 
          (Array.isArray(doc.customTags) ? doc.customTags.includes(tag) : false)
        )
      )
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((doc) => selectedTypes.includes(doc.type))
    }

    // Filter by selected projects
    if (selectedProjects.length > 0) {
      filtered = filtered.filter((doc) => selectedProjects.some(p => p.id === doc.projectId))
    }

    // Filter by tab
    switch (activeTab) {
      case "starred":
        filtered = filtered.filter((doc) => doc.isStarred)
        break
      case "uploaded":
        filtered = filtered.filter((doc) => doc.uploadedBy === "current-user")
        break
    }

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, activeTab, selectedTags, selectedTypes, selectedProjects])

  // Toggle star status of a document
  const toggleStar = (docId: string) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc)))
  }

  // Add a custom tag to a document
  const addCustomTag = (docId: string, tag: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId && !doc.customTags.includes(tag) ? { ...doc, customTags: [...doc.customTags, tag] } : doc,
      ),
    )
  }

  // Remove a custom tag from a document
  const removeCustomTag = (docId: string, tag: string) => {
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === docId ? { ...doc, customTags: doc.customTags.filter((t) => t !== tag) } : doc)),
    )
  }

  const handleFolderClick = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId)
    if (!project) return

    setSelectedProject({ id: projectId, name: project.name })
    setBreadcrumbs([
      { id: "root", name: "文档共享", type: "root" },
      { id: projectId, name: project.name, type: "project" },
    ])
  }

  // Handle breadcrumb click
  const handleBreadcrumbClick = (item: { id: string; name: string; type: "root" | "project" | "folder" }) => {
    if (item.type === "root") {
      setSelectedProject(null)
      setBreadcrumbs([{ id: "root", name: "文档共享", type: "root" }])
    } else if (item.type === "project") {
      const project = mockProjects.find((p) => p.id === item.id)
      if (!project) return

      setSelectedProject({ id: item.id, name: project.name })
      setBreadcrumbs([
        { id: "root", name: "文档共享", type: "root" },
        { id: item.id, name: project.name, type: "project" },
      ])
    }
  }

  // 获取当前视图内容
  const getCurrentView = () => {
    if (viewMode === "folder") {
      if (selectedProject) {
        // 显示所选项目中的文件
        const projectFiles = filteredDocuments.filter((doc) => doc.projectId === selectedProject.id)
        return (
          <FileView
            documents={projectFiles}
            onToggleStar={toggleStar}
            onAddTag={addCustomTag}
            onRemoveTag={removeCustomTag}
          />
        )
      } else {
        // 显示所有项目文件夹
        return <FolderView projects={mockProjects} documents={filteredDocuments} onFolderClick={handleFolderClick} />
      }
    } else {
      // 如果选择了特定项目，只显示该项目的文档
      if (selectedProject) {
        const projectFiles = filteredDocuments.filter((doc) => doc.projectId === selectedProject.id)
        return (
          <DocumentListView
            documents={projectFiles}
            projects={mockProjects}
            onToggleStar={toggleStar}
            onAddTag={addCustomTag}
            onRemoveTag={removeCustomTag}
          />
        )
      } else {
        // 显示所有文档（不限于某个项目）
        return (
          <DocumentListView
            documents={filteredDocuments}
            projects={mockProjects}
            onToggleStar={toggleStar}
            onAddTag={addCustomTag}
            onRemoveTag={removeCustomTag}
          />
        )
      }
    }
  }

  // 配置标签页
  const tabs = [
    {
      id: "all",
      label: "全部文档",
      count: documents.length,
    },
    {
      id: "starred",
      label: "星标文档",
      count: documents.filter((doc) => doc.isStarred).length,
    },
    {
      id: "uploaded",
      label: "我上传的",
      count: documents.filter((doc) => doc.uploadedBy === "current-user").length,
    },
  ]

  return (
    <div className="h-full w-full bg-[#F5F7FA]" suppressHydrationWarning>
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold mr-6">文档共享</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} suppressHydrationWarning>
              <TabsList className="grid grid-cols-3 w-[400px]">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} suppressHydrationWarning>
                    {tab.id === "starred" && <Star className="h-4 w-4 mr-1" />}
                    {tab.id === "uploaded" && <User className="h-4 w-4 mr-1" />}
                    {tab.label} {tab.count > 0 && `(${tab.count})`}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowDocTypeManager(true)}
              className="gap-1"
              type="button"
              suppressHydrationWarning
            >
              <FileType className="h-4 w-4" />
              管理文档类型
            </Button>
            <Button 
              onClick={() => setShowUploadDialog(true)} 
              className="gap-1"
              type="button"
              suppressHydrationWarning
            >
              <Plus className="h-4 w-4" />
              上传文档
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            {viewMode === "folder" && (
              <div className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((item, index) => (
                  <div key={item.id} className="flex items-center">
                    {index > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                    <button
                      className={`hover:text-primary ${
                        index === breadcrumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                      onClick={() => handleBreadcrumbClick(item)}
                    >
                      {item.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文档..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[280px]"
                />
              </div>

              <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilterDialog(true)} suppressHydrationWarning>
                <Filter className="h-4 w-4" />
                筛选
              </Button>

              <div className="flex items-center rounded-md border">
                <Button
                  variant={viewMode === "folder" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-md rounded-r-none"
                  onClick={() => setViewMode("folder")}
                  title="文件夹视图"
                  suppressHydrationWarning
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-md rounded-l-none"
                  onClick={() => setViewMode("list")}
                  title="列表视图"
                  suppressHydrationWarning
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white">{getCurrentView()}</div>
        </div>
      </div>

      {/* Upload Dialog */}
      <DocumentUploader
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        projects={mockProjects}
        onUploadComplete={(newDoc) => {
          setDocuments((prev) => [...prev, newDoc])
          setShowUploadDialog(false)
        }}
      />

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>筛选文档</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>按标签筛选</Label>
              <TagsInput
                availableTags={Array.from(new Set(documents.flatMap((doc) => [
                  ...(Array.isArray(doc.autoTags) ? doc.autoTags : []), 
                  ...(Array.isArray(doc.customTags) ? doc.customTags : [])
                ])))}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                placeholder="选择标签..."
              />
            </div>

            <div className="space-y-2">
              <Label>按文档类型筛选</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(new Set(documents.map((doc) => doc.type))).map((type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTypes.includes(type)) {
                        setSelectedTypes(selectedTypes.filter((t) => t !== type))
                      } else {
                        setSelectedTypes([...selectedTypes, type])
                      }
                    }}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>按项目筛选</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {mockProjects.map((project) => (
                  <Badge
                    key={project.id}
                    variant={selectedProjects.some(p => p.id === project.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedProjects.some(p => p.id === project.id)) {
                        setSelectedProjects(selectedProjects.filter(p => p.id !== project.id))
                      } else {
                        setSelectedProjects([...selectedProjects, {id: project.id, name: project.name}])
                      }
                    }}
                  >
                    {project.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTags([])
                setSelectedTypes([])
                setSelectedProjects([])
              }}
              suppressHydrationWarning
            >
              重置
            </Button>
            <Button onClick={() => setShowFilterDialog(false)} suppressHydrationWarning>应用筛选</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 文档类型管理弹出层 - 使用客户端渲染避免hydration不匹配 */}
      <ClientOnly>
        {showDocTypeManager && (
          <DocTypeManagerDialog 
            open={showDocTypeManager} 
            onOpenChange={setShowDocTypeManager}
            onDocTypeUpdated={fetchDocTypes}
          />
        )}
      </ClientOnly>
    </div>
  )
}

