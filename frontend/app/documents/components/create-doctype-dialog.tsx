"use client"

import { useState, useEffect } from "react"
import { FolderOpen, User, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SearchSelect } from "@/components/ui/search-select"
import { post, get } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { PageResult } from "@/lib/types/common"

// 定义项目类型接口
interface Project {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  leaderName?: string;
  [key: string]: any;
}

// 组件属性类型
interface CreateDocTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (docType: any) => void;
  projectId?: string;
}

export function CreateDocTypeDialog({ open, onOpenChange, onSuccess, projectId }: CreateDocTypeDialogProps) {
  const [isCreatingDocType, setIsCreatingDocType] = useState(false)
  const [newDocType, setNewDocType] = useState({
    name: "",
    code: "",
    description: "",
    sortOrder: 0
  })
  const [selectedProject, setSelectedProject] = useState<{id: string, name: string} | null>(null)
  const [projectError, setProjectError] = useState<string>("")

  // 当传入projectId变化时，加载项目信息
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo(projectId);
    }
  }, [projectId]);

  // 获取项目信息
  const fetchProjectInfo = async (id: string) => {
    if (!id) return;
    
    try {
      const response = await get<{code: number, message: string, data: Project}>(`/api/project/horizontal/${id}`);
      if (response.code === 200 && response.data) {
        setSelectedProject({ id: response.data.id, name: response.data.name });
      }
    } catch (error) {
      console.error("获取项目信息失败:", error);
      // 不显示错误提示，静默失败
    }
  };

  // 重置表单
  const resetForm = () => {
    setNewDocType({ name: "", code: "", description: "", sortOrder: 0 })
    // 只有在没有传入projectId时才清空所选项目
    if (!projectId) {
      setSelectedProject(null)
    }
    setProjectError("")
  }
  
  // 搜索项目函数 - 适配SearchSelect组件
  const searchProjects = async (keyword: string, page: number, pageSize: number) => {
    try {
      // 调用后端API进行项目搜索
      const response = await get<{code: number, message: string, data: PageResult<Project>}>('/api/project/horizontal/search', {
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
  const handleProjectSelect = (id: string, project?: Project) => {
    if (project) {
      setSelectedProject({ id, name: project.name });
      // 清除错误
      setProjectError("");
    }
  };

  // 创建文档类型
  const handleCreateDocType = async () => {
    // 基本验证
    if (!newDocType.name.trim()) {
      toast({
        title: "创建失败",
        description: "文档类型名称不能为空",
        variant: "destructive"
      });
      return;
    }

    if (!newDocType.code.trim()) {
      toast({
        title: "创建失败",
        description: "文档类型编码不能为空",
        variant: "destructive"
      });
      return;
    }
    
    // 验证项目选择 - 如果指定了projectId则跳过验证
    if (!projectId && !selectedProject) {
      setProjectError("请选择关联项目");
      toast({
        title: "创建失败",
        description: "请选择关联项目",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingDocType(true);
    try {
      // 1. 创建文档类型
      const response = await post<{code: number, message: string, data: any}>('/api/todos/documents/doctypes/create', {
        name: newDocType.name,
        code: newDocType.code,
        description: newDocType.description,
        sortOrder: newDocType.sortOrder
      });

      if (response.code === 200) {
        const createdDocType = {
          id: response.data.id,
          name: response.data.name
        };
        
        // 2. 如果选择了项目或提供了projectId，创建项目-文档类型关联
        const projectToAssociate = projectId ? 
          (selectedProject || { id: projectId, name: '' }) : 
          selectedProject;
        
        if (projectToAssociate) {
          try {
            await post('/api/todos/documents/doctypes/project-association', {
              documentTypeId: createdDocType.id,
              projectId: projectToAssociate.id
            });
            
            toast({
              title: "关联成功",
              description: `文档类型已成功关联到项目${projectToAssociate.name ? `"${projectToAssociate.name}"` : ''}`
            });
          } catch (associationError) {
            console.error("创建项目关联失败:", associationError);
            toast({
              title: "关联警告",
              description: "文档类型创建成功，但项目关联失败",
              variant: "destructive"
            });
            // 继续处理，不影响主流程
          }
        }
        
        // 调用成功回调
        if (onSuccess) {
          onSuccess(createdDocType);
        }
        
        // 关闭对话框并重置表单
        onOpenChange(false);
        resetForm();
        
        toast({
          title: "创建成功",
          description: `文档类型"${createdDocType.name}"已创建`
        });
      } else {
        throw new Error(response.message || "创建文档类型失败");
      }
    } catch (error) {
      console.error("创建文档类型失败:", error);
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "创建文档类型时发生错误",
        variant: "destructive"
      });
    } finally {
      setIsCreatingDocType(false);
    }
  }

  // 处理对话框关闭时重置表单
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新建文档类型</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="doctype-name">类型名称 <span className="text-red-500">*</span></Label>
            <Input
              id="doctype-name"
              placeholder="请输入类型名称，如：Word、PDF、规划文件等"
              value={newDocType.name}
              onChange={(e) => setNewDocType(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctype-code">类型编码 <span className="text-red-500">*</span></Label>
            <Input
              id="doctype-code"
              placeholder="请输入唯一的类型编码，如：DOC_WORD、DOC_PDF等"
              value={newDocType.code}
              onChange={(e) => setNewDocType(prev => ({ ...prev, code: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctype-description">类型描述</Label>
            <Textarea
              id="doctype-description"
              placeholder="请输入类型描述（选填）"
              value={newDocType.description}
              onChange={(e) => setNewDocType(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {!projectId && (
            <div className="space-y-2">
              <Label htmlFor="doctype-projects">关联项目 <span className="text-red-500">*</span></Label>
              <SearchSelect<Project>
                placeholder="搜索并选择要关联的项目"
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
                error={!!projectError}
                errorMessage={projectError}
              />
              
              <p className="text-xs text-muted-foreground mt-1">
                请选择一个项目进行关联
              </p>
            </div>
          )}
          
          {projectId && selectedProject && (
            <div className="space-y-2">
              <Label>关联项目</Label>
              <div className="p-2 rounded-md border bg-muted flex items-center">
                <FolderOpen className="h-4 w-4 text-blue-600 mr-2" />
                <span>{selectedProject.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                文档类型将自动关联到此项目
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreatingDocType}
          >
            取消
          </Button>
          <Button 
            onClick={handleCreateDocType}
            disabled={isCreatingDocType || !newDocType.name.trim() || !newDocType.code.trim() || (!projectId && !selectedProject)}
          >
            {isCreatingDocType ? "创建中..." : "创建文档类型"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}