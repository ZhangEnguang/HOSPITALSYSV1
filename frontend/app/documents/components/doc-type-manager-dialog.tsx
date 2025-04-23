"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { get, post, put, del } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { CreateDocTypeDialog } from "./create-doctype-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageResult } from "@/lib/types/common"
import { formatDate } from "../utils/date-formatter"

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

// 定义项目文档类型VO接口
interface ProjectDocTypeVO extends Project {
  documentTypes?: DocumentType[];
}

interface DocTypeManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDocTypeUpdated?: () => void
}

export default function DocTypeManagerDialog({ 
  open, 
  onOpenChange,
  onDocTypeUpdated
}: DocTypeManagerDialogProps) {
  // 文档类型管理弹出层相关状态
  const [docTypeProjects, setDocTypeProjects] = useState<ProjectDocTypeVO[]>([])
  const [docTypeSearchQuery, setDocTypeSearchQuery] = useState("")
  const [docTypeLoading, setDocTypeLoading] = useState(true)
  const [docTypeLoadingMore, setDocTypeLoadingMore] = useState(false)
  const [docTypePageNum, setDocTypePageNum] = useState(1)
  const [docTypePageSize, setDocTypePageSize] = useState(10)
  const [hasMoreProjects, setHasMoreProjects] = useState(true)
  const projectsEndRef = useRef(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showCreateDocTypeDialog, setShowCreateDocTypeDialog] = useState(false)
  const [showEditDocTypeDialog, setShowEditDocTypeDialog] = useState(false)
  const [showDeleteDocTypeDialog, setShowDeleteDocTypeDialog] = useState(false)
  const [currentDocType, setCurrentDocType] = useState<DocumentType | null>(null)
  const [docTypeSelectedProject, setDocTypeSelectedProject] = useState<ProjectDocTypeVO | null>(null)
  
  // 记录当前操作的项目ID和滚动位置
  const lastOperatedProjectRef = useRef<string | null>(null);
  const scrollPositionRef = useRef<number>(0);
  
  // 添加搜索防抖定时器引用
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 保存docTypeManager的初始化渲染状态
  const hasInitialized = useRef(false);

  // 滚动到指定项目
  const scrollToProject = (projectId: string) => {
    if (!scrollContainerRef.current) return;
    
    // 查找项目元素
    const projectElement = document.getElementById(`project-${projectId}`);
    if (projectElement) {
      // 计算滚动位置，稍微往上一点，留出视觉空间
      const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
      const projectTop = projectElement.getBoundingClientRect().top;
      const scrollTop = scrollContainerRef.current.scrollTop + (projectTop - containerTop) - 20;
      
      // 平滑滚动到项目位置
      scrollContainerRef.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  };

  // 保存滚动位置
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  };

  // 恢复滚动位置
  const restoreScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  };

  // 获取项目列表 - 用于文档类型管理
  const fetchDocTypeProjects = async (isLoadMore = false, searchKeyword = "") => {
    try {
      if (isLoadMore && docTypeLoadingMore) return; // 防止重复加载
      
      // 保存滚动位置，仅在刷新时保存，加载更多时不需要
      if (!isLoadMore) {
        saveScrollPosition();
      }
      
      if (isLoadMore) {
        setDocTypeLoadingMore(true)
      } else {
        setDocTypeLoading(true)
      }
      
      // 使用新的接口进行项目名称或文档类型名称的模糊查询
      const response = await get<{code: number, message: string, data: PageResult<ProjectDocTypeVO>}>(
        '/api/todos/documents/doctypes/search', 
        {
          params: {
            pageNum: isLoadMore ? docTypePageNum + 1 : 1,
            pageSize: docTypePageSize,
            keyword: searchKeyword || undefined  // 添加关键词参数，为空时不传
          }
        }
      );
      
      if (response.code === 200) {
        // 根据是否加载更多决定如何设置项目列表
        if (isLoadMore) {
          setDocTypeProjects(prevProjects => [
            ...prevProjects,
            ...response.data.records.map(project => ({
              ...project,
              expanded: false, // 强制设置为折叠状态
            }))
          ])
          setDocTypePageNum(prev => prev + 1)
        } else {
          // 设置项目列表，确保全部为折叠状态
          setDocTypeProjects(response.data.records.map(project => ({
            ...project,
            expanded: false, // 强制设置为折叠状态
          })))
          setDocTypePageNum(1)
        }
        
        // 判断是否还有更多数据
        setHasMoreProjects(
          response.data.records.length > 0 && 
          response.data.total > (isLoadMore ? (docTypePageNum + 1) : 1) * docTypePageSize
        )
      }
    } catch (error) {
      console.error("获取项目及文档类型列表失败:", error)
      toast({
        title: "获取项目及文档类型列表失败",
        description: "请刷新页面重试",
        variant: "destructive"
      })
    } finally {
      if (isLoadMore) {
        setDocTypeLoadingMore(false)
      } else {
        setDocTypeLoading(false)
        
        // 在非加载更多情况下，数据加载完成后，根据情况恢复滚动位置或滚动到指定项目
        setTimeout(() => {
          if (lastOperatedProjectRef.current) {
            scrollToProject(lastOperatedProjectRef.current);
            lastOperatedProjectRef.current = null; // 重置，避免影响后续操作
          } else {
            restoreScrollPosition();
          }
        }, 100); // 稍微延迟，确保DOM更新完成
      }
    }
  }

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocTypeSearchQuery(value);
    
    // 清除之前的定时器
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // 设置新的定时器，300ms防抖
    searchTimerRef.current = setTimeout(() => {
      // 重置分页状态
      setDocTypePageNum(1);
      setHasMoreProjects(true);
      
      // 调用搜索接口
      fetchDocTypeProjects(false, value);
    }, 300);
  };

  // 当组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // 当打开文档类型管理弹出层时，加载项目列表
  useEffect(() => {
    if (open && !hasInitialized.current) {
      hasInitialized.current = true;
      // 根据屏幕高度动态设置初始页大小
      const screenHeight = window.innerHeight;
      const estimatedItemHeight = 120; // 每个项目卡片的估计高度
      const visibleItems = 10; // 将固定加载的数据从5改为10
      setDocTypePageSize(visibleItems);
      fetchDocTypeProjects();
    }
    
    // 每次打开管理界面时重置所有项目为折叠状态
    if (open) {
      setDocTypeProjects(prevProjects => 
        prevProjects.map(project => ({
          ...project,
          expanded: false // 强制设置为折叠状态
        }))
      );
    }
  }, [open]);

  // 切换项目展开/折叠状态
  const toggleProjectExpand = async (projectId: string) => {
    // 获取要修改的项目
    const projectToUpdate = docTypeProjects.find(p => p.id === projectId);
    
    // 如果项目存在且当前是折叠状态，并且没有文档类型数据或文档类型数组为空
    if (projectToUpdate && !projectToUpdate.expanded && 
        (!projectToUpdate.documentTypes || projectToUpdate.documentTypes.length === 0)) {
      try {
        // 先切换展开状态，显示加载中
        setDocTypeProjects(prevProjects => prevProjects.map(project => {
          if (project.id === projectId) {
            return { ...project, expanded: true }
          }
          return project
        }));
        
        // 从后端获取该项目的文档类型
        const typeResponse = await get<{code: number, message: string, data: DocumentType[]}>(`/api/todos/documents/doctypes/project/${projectId}`);
        
        if (typeResponse.code === 200) {
          // 更新项目的文档类型
          setDocTypeProjects(prevProjects => {
            return prevProjects.map(project => {
              if (project.id === projectId) {
                return { 
                  ...project, 
                  documentTypes: typeResponse.data,
                  expanded: true // 确保展开
                };
              }
              return project;
            });
          });
        }
      } catch (error) {
        console.error("获取项目文档类型失败:", error);
        toast({
          title: "获取失败",
          description: "获取项目文档类型失败",
          variant: "destructive"
        });
        
        // 出错时仍然切换展开状态
        setDocTypeProjects(prevProjects => prevProjects.map(project => {
          if (project.id === projectId) {
            return { ...project, expanded: !project.expanded }
          }
          return project
        }));
      }
    } else {
      // 如果只是切换折叠状态或者已经有文档类型数据，直接切换
      setDocTypeProjects(prevProjects => prevProjects.map(project => {
        if (project.id === projectId) {
          return { ...project, expanded: !project.expanded }
        }
        return project
      }));
    }
  }

  // 关联文档类型到项目
  const associateDocTypeWithProject = async (docTypeId: string, projectId: string) => {
    try {
      const response = await post<{code: number, message: string, data: string}>('/api/todos/documents/doctypes/project-association', {
        documentTypeId: docTypeId,
        projectId: projectId
      });
      
      if (response.code === 200) {
        toast({
          title: "关联成功",
          description: "文档类型已成功关联到项目"
        });
        
        // 只获取这个项目的最新文档类型，而不是刷新整个列表
        try {
          const typeResponse = await get<{code: number, message: string, data: DocumentType[]}>(`/api/todos/documents/doctypes/project/${projectId}`);
          
          if (typeResponse.code === 200) {
            // 更新单个项目的文档类型，不刷新整个列表
            setDocTypeProjects(prevProjects => {
              return prevProjects.map(project => {
                if (project.id === projectId) {
                  return { 
                    ...project, 
                    documentTypes: typeResponse.data,
                    expanded: true // 确保展开
                  };
                }
                return project;
              });
            });
            
            // 用setTimeout确保DOM已更新，然后滚动到该项目
            setTimeout(() => {
              const projectElement = document.getElementById(`project-${projectId}`);
              if (projectElement && scrollContainerRef.current) {
                // 滚动到中心位置，并留出足够空间
                projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 高亮显示该卡片一小段时间，提高可见性
                projectElement.classList.add('highlight-card');
                setTimeout(() => {
                  projectElement.classList.remove('highlight-card');
                }, 2000);
              }
            }, 100);
          }
        } catch (error) {
          console.error("获取项目文档类型失败:", error);
          // 如果单独获取失败，则退回到刷新整个列表
          fetchDocTypeProjects(false, docTypeSearchQuery);
        }
      }
    } catch (error) {
      console.error("关联文档类型到项目失败:", error);
      toast({
        title: "关联失败",
        description: "文档类型关联到项目失败",
        variant: "destructive"
      });
    }
  }

  // 处理文档类型创建成功
  const handleDocTypeCreated = (docType: DocumentType) => {
    // 如果有选中的项目，则将新文档类型关联到该项目
    if (docTypeSelectedProject) {
      // 关联并展开项目
      associateDocTypeWithProject(docType.id, docTypeSelectedProject.id);
    } else {
      // 如果没有选中项目，或者是直接创建的文档类型，直接刷新列表
      fetchDocTypeProjects(false, docTypeSearchQuery);
    }

    // 调用传入的回调函数通知外部文档类型已更新
    if (onDocTypeUpdated) {
      onDocTypeUpdated();
    }
  }

  // 防止事件冒泡导致项目折叠
  const handleAddDocTypeClick = (e: React.MouseEvent, project: ProjectDocTypeVO) => {
    e.stopPropagation(); // 阻止事件冒泡
    setDocTypeSelectedProject(project);
    setShowCreateDocTypeDialog(true);
  };

  // 打开编辑对话框
  const openEditDialog = (docType: DocumentType) => {
    setCurrentDocType(docType)
    setShowEditDocTypeDialog(true)
  }

  // 打开删除确认对话框
  const openDeleteDialog = (docType: DocumentType) => {
    setCurrentDocType(docType)
    setShowDeleteDocTypeDialog(true)
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
        
        // 先保存当前的展开状态和展开的项目ID列表
        const currentExpandedState = docTypeProjects.reduce((acc, project) => {
          acc[project.id] = !!project.expanded;
          return acc;
        }, {} as Record<string, boolean>);
        
        // 记录当前展开的项目ID列表，用于后续重新获取文档类型
        const expandedProjectIds = docTypeProjects
          .filter(project => project.expanded)
          .map(project => project.id);
        
        // 刷新整个列表
        fetchDocTypeProjects(false, docTypeSearchQuery).then(async () => {
          // 恢复展开状态
          setDocTypeProjects(prevProjects => {
            return prevProjects.map(project => {
              return { 
                ...project, 
                expanded: !!currentExpandedState[project.id]
              };
            });
          });
          
          // 对于之前展开的项目，重新获取它们的文档类型数据
          for (const projectId of expandedProjectIds) {
            try {
              // 异步获取项目的文档类型数据
              const typeResponse = await get<{code: number, message: string, data: DocumentType[]}>(`/api/todos/documents/doctypes/project/${projectId}`);
              
              if (typeResponse.code === 200) {
                // 更新单个项目的文档类型
                setDocTypeProjects(prevProjects => {
                  return prevProjects.map(project => {
                    if (project.id === projectId) {
                      return { 
                        ...project, 
                        documentTypes: typeResponse.data,
                        expanded: true // 确保展开
                      };
                    }
                    return project;
                  });
                });
              }
            } catch (error) {
              console.error(`重新获取项目 ${projectId} 文档类型失败:`, error);
            }
          }
        });
        
        setShowEditDocTypeDialog(false)

        // 调用传入的回调函数通知外部文档类型已更新
        if (onDocTypeUpdated) {
          onDocTypeUpdated();
        }
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
        
        // 先保存当前的展开状态和展开的项目ID列表
        const currentExpandedState = docTypeProjects.reduce((acc, project) => {
          acc[project.id] = !!project.expanded;
          return acc;
        }, {} as Record<string, boolean>);
        
        // 记录当前展开的项目ID列表，用于后续重新获取文档类型
        const expandedProjectIds = docTypeProjects
          .filter(project => project.expanded)
          .map(project => project.id);
        
        // 刷新整个列表
        fetchDocTypeProjects(false, docTypeSearchQuery).then(async () => {
          // 恢复展开状态
          setDocTypeProjects(prevProjects => {
            return prevProjects.map(project => {
              return { 
                ...project, 
                expanded: !!currentExpandedState[project.id]
              };
            });
          });
          
          // 对于之前展开的项目，重新获取它们的文档类型数据
          for (const projectId of expandedProjectIds) {
            try {
              // 异步获取项目的文档类型数据
              const typeResponse = await get<{code: number, message: string, data: DocumentType[]}>(`/api/todos/documents/doctypes/project/${projectId}`);
              
              if (typeResponse.code === 200) {
                // 更新单个项目的文档类型
                setDocTypeProjects(prevProjects => {
                  return prevProjects.map(project => {
                    if (project.id === projectId) {
                      return { 
                        ...project, 
                        documentTypes: typeResponse.data,
                        expanded: true // 确保展开
                      };
                    }
                    return project;
                  });
                });
              }
            } catch (error) {
              console.error(`重新获取项目 ${projectId} 文档类型失败:`, error);
            }
          }
        });
        
        setShowDeleteDocTypeDialog(false)

        // 调用传入的回调函数通知外部文档类型已更新
        if (onDocTypeUpdated) {
          onDocTypeUpdated();
        }
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

  // 过滤项目列表（用于文档类型管理）- 已被后端搜索替代，但保留本地过滤以防后端搜索不可用
  const filteredDocTypeProjects = docTypeProjects;

  // 在CSS部分添加高亮样式
  useEffect(() => {
    // 添加高亮样式
    const style = document.createElement('style');
    style.innerHTML = `
      .highlight-card {
        box-shadow: 0 0 0 6px #3b82f6 !important;
        position: relative !important;
        z-index: 50 !important;
        margin: 12px 8px !important;
        transition: all 0.3s ease !important;
        background-color: #f0f7ff !important;
        border-radius: 8px !important;
      }
      
      /* 确保卡片之间有足够的间距 */
      .project-card {
        margin: 10px 8px !important;
        position: relative !important;
        border-radius: 8px !important;
      }
      
      /* 展开项目时的额外间距 */
      .project-card.expanded {
        margin-bottom: 12px !important;
      }
      
      /* 调整滚动容器的内边距 */
      .projects-scroll-container {
        padding: 8px 12px 0px 12px !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }

      /* 调整对话框内容区域的内边距 */
      .doctype-dialog-content {
        padding-bottom: 0px !important;
      }
    `;
    document.head.appendChild(style);
    
    // 清理函数
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col sm:max-w-4xl max-h-[90vh] doctype-dialog-content">
          <DialogHeader>
            <DialogTitle>文档类型管理</DialogTitle>
            <DialogDescription className="text-sm">
              设置或修改可用的文档类型并关联到项目
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 h-[66vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 ml-1">
                <Search className="absolute left-6 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="搜索项目或文档类型..."
                  value={docTypeSearchQuery}
                  onChange={handleSearchChange}
                  className="pl-14 rounded-md w-full"
                />
              </div>

              <Button 
                onClick={() => {
                  setDocTypeSelectedProject(null)
                  setShowCreateDocTypeDialog(true)
                }} 
                className="gap-1 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                新建文档类型
              </Button>
            </div>

            <div 
              ref={scrollContainerRef}
              className="projects-scroll-container flex-1 pb-2" 
              style={{ maxHeight: "calc(70vh - 120px)" }}
              onScroll={() => {
                if (!scrollContainerRef.current || docTypeLoadingMore || !hasMoreProjects) return;
                
                const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
                const scrollBottom = scrollHeight - scrollTop - clientHeight;
                
                // 当距离底部小于100px时触发加载
                if (scrollBottom < 100) {
                  fetchDocTypeProjects(true, docTypeSearchQuery);
                }
              }}
            >
              {docTypeLoading ? (
                <div className="flex justify-center items-center h-full p-8">
                  <p className="text-muted-foreground">正在加载项目数据...</p>
                </div>
              ) : filteredDocTypeProjects.length === 0 ? (
                <div className="flex justify-center items-center h-full bg-white rounded-md shadow-sm">
                  <p className="text-muted-foreground">未找到项目数据</p>
                </div>
              ) : (
                <>
                  {filteredDocTypeProjects.map(project => (
                    <Card 
                      key={project.id} 
                      id={`project-${project.id}`} 
                      className={`project-card shadow-sm ${project.expanded ? 'expanded' : ''}`}
                    >
                      <CardHeader 
                        className="py-3 cursor-pointer" 
                        onClick={(e) => {
                          // 确保只处理CardHeader上的点击，不包括子元素的点击
                          if (e.currentTarget === e.target || e.target instanceof Element && e.currentTarget.contains(e.target) && 
                              !e.target.closest('button')) {
                            toggleProjectExpand(project.id)
                          }
                        }}
                      >
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
                                `${formatDate(project.startDate)} 至 ${formatDate(project.endDate)}` : 
                                "无日期信息"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {project.expanded && (
                        <CardContent className="py-3">
                          <div className="mb-3 flex justify-between items-center py-1">
                            <h4 className="text-sm font-medium">项目文档类型</h4>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={(e) => {
                                handleAddDocTypeClick(e, project)
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
                                        e.stopPropagation();
                                        openEditDialog(docType);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteDialog(docType);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex justify-center items-center h-full min-h-[100px] text-muted-foreground text-sm">
                              项目暂无文档类型，请点击"添加文档类型"按钮添加
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                  
                  {/* 加载更多指示器 */}
                  {hasMoreProjects && (
                    <div 
                      ref={projectsEndRef} 
                      className="py-0.5 text-center"
                    >
                      <p className="text-xs text-muted-foreground">
                        {docTypeLoadingMore ? "加载更多项目..." : "向下滚动加载更多..."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 创建文档类型对话框 */}
      {showCreateDocTypeDialog && (
        <CreateDocTypeDialog 
          open={showCreateDocTypeDialog} 
          onOpenChange={setShowCreateDocTypeDialog}
          onSuccess={(docType) => {
            handleDocTypeCreated(docType)
            setShowCreateDocTypeDialog(false)
          }}
          projectId={docTypeSelectedProject?.id}
        />
      )}

      {/* 编辑文档类型对话框 */}
      {showEditDocTypeDialog && currentDocType && (
        <Dialog open={showEditDocTypeDialog} onOpenChange={setShowEditDocTypeDialog}>
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
              <Button variant="outline" onClick={() => setShowEditDocTypeDialog(false)}>
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
      {showDeleteDocTypeDialog && (
        <Dialog open={showDeleteDocTypeDialog} onOpenChange={setShowDeleteDocTypeDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>您确定要删除文档类型 "{currentDocType?.name}" 吗？此操作不可撤销。</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDocTypeDialog(false)}>
                取消
              </Button>
              <Button variant="destructive" onClick={handleDeleteDocType}>
                删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 