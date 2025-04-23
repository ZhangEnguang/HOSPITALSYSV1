"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TreeNode {
  id: string
  parentId: string | null
  children: string[]
  [key: string]: any
}

interface TreeTableProps {
  data: TreeNode[]
  columns: any[]
  actions?: any[]
  selectedRows?: string[]
  onSelect?: (id: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
}

export default function TreeTable({
  data,
  columns,
  actions = [],
  selectedRows = [],
  onSelect,
  onSelectAll,
}: TreeTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [flattenedData, setFlattenedData] = useState<any[]>([])
  const [visibleData, setVisibleData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("createdAt_desc")
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
  const [hoveredParentIds, setHoveredParentIds] = useState<string[]>([])
  const [hoveredChildIds, setHoveredChildIds] = useState<string[]>([])

  // 处理数据变更
  useEffect(() => {
    // 对有子项的父行默认展开
    const initialExpandedState: Record<string, boolean> = {}
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        initialExpandedState[item.id] = true
      }
    })
    setExpandedRows(initialExpandedState)

    // 构建可见数据
    updateVisibleData(data, initialExpandedState)
  }, [data])

  // 当搜索词或排序选项变更时，重新处理数据
  useEffect(() => {
    updateVisibleData(data, expandedRows)
  }, [searchTerm, sortOption])

  // 更新可见数据
  const updateVisibleData = (items: TreeNode[], expandState: Record<string, boolean>) => {
    // 应用搜索过滤
    const filteredItems = searchTerm 
      ? items.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items
    
    // 应用排序
    const sortedItems = [...filteredItems].sort((a, b) => {
      const [field, direction] = sortOption.split("_")
      
      if (field === "name") {
        return direction === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      }
      
      if (field === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }
      
      return 0
    })
    
    // 只展示顶层项目和展开的子项目
    const visible: any[] = []
    
    // 遍历所有顶层节点
    const topLevelItems = sortedItems.filter(item => item.parentId === null)
    
    for (const item of topLevelItems) {
      // 添加顶层节点
      visible.push(processItem(item))
      
      // 如果当前节点被展开并且有子节点，则递归添加子节点
      if (expandState[item.id] && item.children && item.children.length > 0) {
        addExpandedChildren(item, visible, sortedItems, expandState)
      }
    }
    
    setVisibleData(visible)
    setFlattenedData(getAllItems(sortedItems))
  }
  
  // 处理单个节点，添加计算属性
  const processItem = (item: TreeNode) => {
    return {
      ...item,
      level: getNodeLevel(item, data),
      hasChildren: item.children && item.children.length > 0,
    }
  }
  
  // 递归添加展开的子节点
  const addExpandedChildren = (
    parent: TreeNode, 
    result: any[], 
    allItems: TreeNode[], 
    expandState: Record<string, boolean>
  ) => {
    const childIds = parent.children || []
    if (childIds.length === 0) return
    
    const children = allItems.filter(item => childIds.includes(item.id))
    
    for (const child of children) {
      const processedChild = processItem(child)
      result.push(processedChild)
      
      // 如果子节点也被展开且有子节点，继续递归
      if (expandState[child.id] && child.children && child.children.length > 0) {
        addExpandedChildren(child, result, allItems, expandState)
      }
    }
  }
  
  // 获取节点的层级
  const getNodeLevel = (node: TreeNode, allNodes: TreeNode[]): number => {
    if (node.parentId === null) return 0
    
    let level = 0
    let currentId: string | null = node.parentId
    
    while (currentId !== null) {
      level++
      const parent = allNodes.find(item => item.id === currentId)
      if (!parent) break
      currentId = parent.parentId
    }
    
    return level
  }
  
  // 获取所有节点（用于全选功能）
  const getAllItems = (items: TreeNode[]): any[] => {
    return items.map(item => processItem(item))
  }

  // 切换行的展开/折叠状态
  const toggleRowExpand = (id: string) => {
    const newExpandedRows = { 
      ...expandedRows, 
      [id]: !expandedRows[id] 
    }
    setExpandedRows(newExpandedRows)
    
    // 更新可见数据
    updateVisibleData(data, newExpandedRows)
  }

  // 根据层级生成缩进
  const getIndent = (level: number) => {
    return level * 24 // 每级缩进24px
  }

  // 全选/取消全选
  const handleSelectAll = (selected: boolean) => {
    if (onSelectAll) {
      onSelectAll(selected)
    }
  }

  // 获取一个节点的所有父节点ID
  const getParentIds = (nodeId: string): string[] => {
    const parents: string[] = []
    let current = data.find(item => item.id === nodeId)
    
    while (current && current.parentId) {
      parents.push(current.parentId)
      current = data.find(item => item.id === current?.parentId)
    }
    
    return parents
  }
  
  // 获取一个节点的所有直接子节点ID和递归子节点ID
  const getAllChildIds = (nodeId: string): string[] => {
    const result: string[] = []
    const node = data.find(item => item.id === nodeId)
    
    if (!node || !node.children || node.children.length === 0) {
      return result
    }
    
    // 添加直接子节点
    result.push(...node.children)
    
    // 递归添加子节点的子节点
    for (const childId of node.children) {
      result.push(...getAllChildIds(childId))
    }
    
    return result
  }
  
  // 处理行悬停事件
  const handleRowHover = (id: string | null) => {
    setHoveredRowId(id)
    
    if (id) {
      // 设置父节点高亮
      setHoveredParentIds(getParentIds(id))
      
      // 设置子节点高亮
      setHoveredChildIds(getAllChildIds(id))
    } else {
      // 清除高亮
      setHoveredParentIds([])
      setHoveredChildIds([])
    }
  }
  
  // 判断行是否高亮
  const isRowHighlighted = (id: string): boolean => {
    return (
      id === hoveredRowId || 
      hoveredParentIds.includes(id) || 
      hoveredChildIds.includes(id)
    )
  }

  // 排序选项
  const sortOptions = [
    {
      id: "createdAt_desc",
      label: "创建日期 (降序)",
    },
    {
      id: "createdAt_asc",
      label: "创建日期 (升序)",
    },
    {
      id: "name_asc",
      label: "名称 (A-Z)",
    },
    {
      id: "name_desc",
      label: "名称 (Z-A)",
    },
  ]

  return (
    <div className="space-y-4">
      {/* 搜索和排序控件 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索项目分类..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">排序：</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择排序方式" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* 表格内容 */}
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            {/* 选择框列 */}
            {onSelect && (
              <TableHead className="w-[50px] text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.length > 0 && selectedRows.length === flattenedData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4"
                />
              </TableHead>
            )}
            
            {/* 展开/折叠图标列 */}
            <TableHead className="w-[40px]"></TableHead>
            
            {/* 数据列 */}
            {columns.map((column) => (
              <TableHead key={column.id}>
                {column.header}
              </TableHead>
            ))}
            
            {/* 操作列 */}
            {actions.length > 0 && (
              <TableHead className="text-right">操作</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onSelect ? 2 : 1) + (actions.length > 0 ? 1 : 0)}
                className="h-24 text-center"
              >
                {searchTerm ? "没有找到匹配的项目分类" : "暂无数据"}
              </TableCell>
            </TableRow>
          ) : (
            visibleData.map((row) => (
              <TableRow 
                key={row.id}
                className={cn(
                  "transition-colors",
                  isRowHighlighted(row.id) && hoveredRowId !== row.id && "bg-muted/50",
                  hoveredRowId === row.id && "bg-primary/10"
                )}
                onMouseEnter={() => handleRowHover(row.id)}
                onMouseLeave={() => handleRowHover(null)}
              >
                {/* 选择框 */}
                {onSelect && (
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => onSelect(row.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                )}
                
                {/* 展开/折叠图标 */}
                <TableCell className="p-2">
                  <div style={{ paddingLeft: getIndent(row.level) }}>
                    {row.hasChildren ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleRowExpand(row.id)}
                      >
                        {expandedRows[row.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <span className="w-6 inline-block"></span>
                    )}
                  </div>
                </TableCell>
                
                {/* 数据列 */}
                {columns.map((column, index) => (
                  <TableCell key={column.id} className={index === 0 ? "font-medium" : undefined}>
                    {column.cell ? column.cell(row) : row[column.accessorKey]}
                  </TableCell>
                ))}
                
                {/* 操作列 */}
                {actions.length > 0 && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {actions.map((action) => (
                        <Button
                          key={action.id}
                          variant={action.variant || "ghost"}
                          size="sm"
                          onClick={() => action.onClick(row)}
                          className={cn("h-8 px-2", action.className)}
                        >
                          {action.icon}
                          <span className="sr-only">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 