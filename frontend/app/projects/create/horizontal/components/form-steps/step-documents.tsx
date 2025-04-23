"use client"

import type React from "react"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, File, X, FileText, CheckCircle2, Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { get } from "@/lib/api"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useToast } from "@/components/ui/use-toast"

// 自定义UUID生成函数，替代React.useId
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// 定义校验结果类型
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// 定义组件的ref方法
export interface DocumentsStepRef {
  validate: () => ValidationResult;
  getDocuments: () => {
    documentType: string;
    fileId?: string;
    fileName?: string;
  }[];
}

// 文件类型定义
interface DocumentType {
  id: string
  name: string
  description?: string
  icon: React.ReactNode
  acceptTypes: string // 接受的文件类型
  orderId?: number // 序号字段
}

// 文档类型API响应定义
interface ModuleDocTypeDTO {
  id: string
  code: string
  name: string
  beanId: string
  acceptTypes: string
  orderId?: number // 序号字段
}

// API响应类型
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 定义横向项目需要的文档类型（默认值，会被API结果替换）
const defaultDocumentTypes: DocumentType[] = [
  {
    id: "contract",
    name: "合作协议",
    description: "企业与院校的合作协议文件",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    acceptTypes: ".pdf,.doc,.docx",
    orderId: 1
  },
  {
    id: "technical_plan",
    name: "技术方案",
    description: "项目的技术实施方案文档",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    acceptTypes: ".pdf,.doc,.docx,.ppt,.pptx",
    orderId: 2
  },
  {
    id: "budget",
    name: "预算表",
    description: "项目经费预算明细",
    icon: <FileText className="h-6 w-6 text-orange-500" />,
    acceptTypes: ".xlsx,.xls,.pdf",
    orderId: 3
  },
  {
    id: "schedule",
    name: "项目进度计划",
    description: "项目实施的时间节点安排",
    icon: <FileText className="h-6 w-6 text-purple-500" />,
    acceptTypes: ".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx",
    orderId: 4
  },
  {
    id: "other",
    name: "其他文档",
    description: "其他项目相关的重要文件",
    icon: <File className="h-6 w-6 text-gray-500" />,
    acceptTypes: ".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.jpg,.png,.zip",
    orderId: 5
  },
]

// 获取文档类型对应的图标
const getDocTypeIcon = (code: string): React.ReactNode => {
  switch (code) {
    case "scannedVersionOfContractSeal":
      return <FileText className="h-6 w-6 text-blue-500" />
    case "contractElectronicDocument":
      return <FileText className="h-6 w-6 text-green-500" />
    case "budget":
      return <FileText className="h-6 w-6 text-orange-500" />
    case "schedule":
      return <FileText className="h-6 w-6 text-purple-500" />
    default:
      return <File className="h-6 w-6 text-gray-500" />
  }
}

// 行项目接口
interface DocumentRow {
  id: string
  documentType: string
  file: File | null
  fileId?: string // 上传后的文件ID，目前模拟生成
}

// 可排序行组件
function SortableRow({ row, children, index }: { row: DocumentRow, children: React.ReactNode, index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center p-3 bg-card">
      {/* 拖拽手柄和序号 - 调整宽度匹配标题栏 */}
      <div 
        className="w-[70px] flex items-center cursor-move touch-none" 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
        <span className="ml-1 text-sm text-muted-foreground">{index + 1}</span>
      </div>
      {children}
    </div>
  );
}

export const StepDocuments = forwardRef<DocumentsStepRef, {}>((props, ref) => {
  // 使用行模式存储文档
  const [rows, setRows] = useState<DocumentRow[]>([
    { id: generateId(), documentType: "", file: null, fileId: undefined }
  ])
  
  // 文档类型状态
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(defaultDocumentTypes)
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()
  
  // 暴露验证方法给父组件
  useImperativeHandle(ref, () => ({
    // 验证所有需要的文档是否已上传
    validate: () => {
      console.log("验证文档 - 当前文档行:", rows);
      
      // 过滤掉空行（没有选择文档类型的）
      const validRows = rows.filter(row => row.documentType);
      console.log("验证文档 - 有效文档行:", validRows);
      
      // 如果没有文档，提示至少上传一个
      if (validRows.length === 0) {
        return {
          valid: false,
          message: "请至少上传一个项目文档"
        };
      }
      
      // 检查是否有未上传完成的文档
      const incompleteRows = validRows.filter(row => !row.file);
      console.log("验证文档 - 未完成的文档行:", incompleteRows);
      
      if (incompleteRows.length > 0) {
        // 找出第一个未完成的文档类型名称
        const firstIncompleteType = incompleteRows[0].documentType;
        const typeName = documentTypes.find(t => t.id === firstIncompleteType)?.name || "文档";
        
        return {
          valid: false,
          message: `请完成"${typeName}"的上传, 或移除该行`
        };
      }
      
      // 所有检查通过
      return { valid: true };
    },
    
    // 获取已上传的文档列表 (用于表单提交)
    getDocuments: () => {
      return rows
        .filter(row => row.documentType && row.file && row.fileId)
        .map(row => ({
          documentType: row.documentType,
          fileId: row.fileId,
          fileName: row.file?.name
        }));
    }
  }));
  
  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // 处理拖拽结束
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        // 创建新数组并重新排序
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        return newItems;
      });
    }
  };
  
  // 获取文档类型数据
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true)
        // 获取横向项目文档类型 - 使用beanId为horizontal_project
        const response = await get<ModuleDocTypeDTO[]>('/api/todos/module-doc-types/by-bean-id/horizontalProject')
        
        if (response && Array.isArray(response)) {
          // 将响应数据转换为DocumentType格式
          const fetchedTypes: DocumentType[] = response.map(item => ({
            id: item.code,
            name: item.name,
            icon: getDocTypeIcon(item.code),
            acceptTypes: item.acceptTypes || '.pdf,.doc,.docx',
            orderId: item.orderId || 0,
          }))
          
          // 按orderId排序
          fetchedTypes.sort((a, b) => (a.orderId || 0) - (b.orderId || 0));
          
          if (fetchedTypes.length > 0) {
            setDocumentTypes(fetchedTypes)
          }
        }
      } catch (error) {
        console.error('获取文档类型失败:', error)
        // 保留默认文档类型
      } finally {
        setLoading(false)
      }
    }
    
    fetchDocumentTypes()
  }, [])

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // 生成模拟的文件ID
      const fileId = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      
      setRows(prevRows => prevRows.map(row => {
        if (row.id === rowId) {
          // 直接设置文件和fileId，不再模拟上传
          return { 
            ...row, 
            file: file,
            fileId: fileId
          }
        }
        return row
      }))
      
      // 显示成功提示
      toast({
        title: "上传成功",
        description: `文件 ${file.name} 已成功上传`,
        variant: "default"
      })
    }
  }

  // 添加新行
  const addRow = () => {
    setRows(prevRows => [
      ...prevRows, 
      { id: generateId(), documentType: "", file: null, fileId: undefined }
    ])
  }

  // 删除行
  const removeRow = (rowId: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId))
  }

  // 设置行的文档类型
  const setRowDocumentType = (rowId: string, documentType: string) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        return { ...row, documentType }
      }
      return row
    }))
  }
  
  // 清除行文件
  const clearRowFile = (rowId: string) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        return { ...row, file: null, fileId: undefined }
      }
      return row
    }))
  }

  // 获取文件图标
  const getFileIcon = (fileName: string | undefined) => {
    if (!fileName) return <File className="h-6 w-6 text-gray-500" />
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-500" />
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  // 获取文件大小显示
  const getFileSizeDisplay = (size: number) => {
    if (size < 1024) {
      return `${size} B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    } else {
      return `${(size / 1024 / 1024).toFixed(2)} MB`
    }
  }

  // 获取可用的文档类型（排除已选择的类型）
  const getAvailableDocumentTypes = (currentRowId: string) => {
    const usedTypes = rows
      .filter(row => row.id !== currentRowId && row.documentType)
      .map(row => row.documentType)
    
    return documentTypes.filter(type => !usedTypes.includes(type.id))
  }

  // 计算已上传的文件数量
  const getUploadedFileCount = () => {
    return rows.filter(row => row.file !== null).length
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-medium">横向项目文档</Label>

        {/* 文件列表 */}
        <div className="border rounded-lg overflow-hidden">
          {/* 标头 */}
          <div className="bg-muted px-4 py-2 flex font-medium text-sm items-center">
            <div className="w-[70px]">序号</div>
            <div className="w-1/3">文档类型</div>
            <div className="w-2/3">文件</div>
          </div>
          
          {/* 行列表 - 使用DndContext包装 */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rows.map(row => row.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y">
                {rows.map((row, index) => (
                  <SortableRow key={row.id} row={row} index={index}>
                    {/* 文档类型选择 */}
                    <div className="w-1/3 pr-4">
                      <Select value={row.documentType} onValueChange={(value) => setRowDocumentType(row.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择文档类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableDocumentTypes(row.id).map(type => (
                            <SelectItem key={`${row.id}-${type.id}`} value={type.id}>
                              <div className="flex items-center">
                                {type.icon}
                                <span className="ml-2">
                                  {type.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {row.documentType && (
                        <p className="text-xs text-muted-foreground mt-1 ml-1">
                          {documentTypes.find(t => t.id === row.documentType)?.description}
                        </p>
                      )}
                    </div>
                    
                    {/* 文件上传/显示 */}
                    <div className="w-2/3 flex flex-col">
                      {!row.file ? (
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            disabled={!row.documentType}
                            onClick={() => document.getElementById(`file-upload-${row.id}`)?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            上传文件
                          </Button>
                          <input 
                            id={`file-upload-${row.id}`} 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(e, row.id)}
                            accept={documentTypes.find(t => t.id === row.documentType)?.acceptTypes}
                            disabled={!row.documentType}
                          />
                          <p className="text-xs text-muted-foreground ml-3">
                            {row.documentType 
                              ? `支持 ${documentTypes.find(t => t.id === row.documentType)?.acceptTypes} 格式` 
                              : "请先选择文档类型"}
                          </p>
                          
                          {/* 行操作按钮 */}
                          <div className="ml-auto">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="flex items-center flex-1 mr-3">
                            <div className="mr-3">
                              {getFileIcon(row.file.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{row.file.name}</p>
                              <p className="text-xs text-muted-foreground">{getFileSizeDisplay(row.file.size)}</p>
                            </div>
                          </div>
                          
                          {/* 上传状态 */}
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            
                            {/* 操作按钮 */}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => clearRowFile(row.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </SortableRow>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {/* 添加行按钮 */}
          <div className="p-3 flex justify-center bg-muted/30">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={addRow}
            >
              <Plus className="mr-2 h-4 w-4" />
              添加文档
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          已上传 {getUploadedFileCount()} 个文档。请上传与横向合作项目相关的各类文档，如合作协议、技术方案、预算表等。这些文档将作为项目评审的重要参考依据。
        </p>
      </div>
    </div>
  )
})

StepDocuments.displayName = "StepDocuments" 