"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ProjectCategoryViewDrawer } from "./project-category-view-drawer"
import { get, put, del } from "@/lib/api"

// 添加明显的控制台日志
console.log("===== 项目分类组件开始加载 =====");

// 先查看一下DataList组件的可用属性
interface DataListProps {
  // 基础属性
  title: string;
  data: any[];
  // ...其他属性
}

export function ProjectCategoryTab() {
  // 添加明显的控制台日志
  console.log("===== 项目分类组件函数执行 =====");
  
  const router = useRouter()
  
  // 状态管理
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("createdAt_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "启用"
  })
  
  // 查看抽屉状态
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [viewingCategory, setViewingCategory] = useState<any>(null)
  
  // 初始化加载数据
  useEffect(() => {
    console.log("===== 项目分类组件useEffect执行 =====");
    console.log("组件已挂载，开始初始加载...");
    loadData();
  }, []) 
  
  // 分页参数变化时重新加载
  useEffect(() => {
    if (currentPage > 1 || pageSize !== 10) { // 避免与初始加载重复
      console.log("分页参数变化，重新加载数据...", {currentPage, pageSize})
      loadData()
    }
  }, [currentPage, pageSize])
  
  // 当搜索条件或排序变化时重新加载数据
  useEffect(() => {
    // 只有当这些值真正变化且不是首次渲染时才重新加载
    if (Object.keys(filterValues).length > 0 || searchTerm || sortOption !== "createdAt_desc") {
      console.log("过滤或排序条件变化，重新加载数据...", {filterValues, searchTerm, sortOption})
      loadData()
    }
  }, [filterValues, searchTerm, sortOption])
  
  // 加载项目分类数据
  const loadData = async () => {
    console.log("===== 开始加载项目分类数据 =====");
    setLoading(true);
    
    try {
      // 使用对象字面量创建参数对象，避免TypeScript错误
      const queryParams: Record<string, any> = {
        page: currentPage,
        pageSize: pageSize
      }
      
      // 添加搜索关键词
      if (searchTerm) {
        queryParams.keyword = searchTerm
      }
      
      // 添加筛选条件
      if (Object.keys(filterValues).length > 0) {
        Object.entries(filterValues).forEach(([key, value]) => {
          if (value !== 'all') {
            queryParams[key] = value
          }
        })
      }
      
      // 添加排序参数
      if (sortOption) {
        const [field, direction] = sortOption.split('_')
        queryParams.orderBy = field
        queryParams.orderDirection = direction
      }
      
      console.log("请求参数:", queryParams);
      
      // 输出完整请求URL
      console.log("完整API请求URL:", `/api/project/projectType/list?page=${currentPage}&pageSize=${pageSize}`);
      
      // 调用API获取数据
      console.log("开始发送API请求...");
      
      // 尝试直接使用fetch发送请求
      const directResponse = await fetch(`/api/project/projectType/list?page=${currentPage}&pageSize=${pageSize}`);
      console.log("原生fetch响应状态:", directResponse.status);
      
      // 使用API模块获取数据
      const response = await get('/api/project/projectType/list', {
        params: queryParams
      });
      
      console.log("API响应:", response);
      
      if (response && response.code === 200 && response.data) {
        console.log("API请求成功，开始处理数据...");
        // 将后端数据转换为前端所需格式
        const formattedData = response.data.records.map((item: any) => ({
          id: item.id,
          categoryCode: item.code,
          name: item.name,
          code: item.code,
          level: item.level || "一级",
          projectCount: item.projectCount || 0,
          fundingStandard: item.budgetStandards?.map((std: any) => std.standard)?.join(", ") || "-",
          accountingType: item.accountingType || "-",
          fundingForm: item.fundingForm || "-",
          managementMethod: item.managementMethod || "-",
          undergradCardRequirement: item.undergradCardRequirement || "-",
          masterCardRequirement: item.masterCardRequirement || "-", 
          phdCardRequirement: item.phdCardRequirement || "-",
          description: item.note || "",
          status: item.isUsed ? "启用" : "停用",
          enabled: item.isUsed,
          createdAt: item.createTime || "-",
        }));
        
        console.log("处理后的数据:", formattedData);
        setData(formattedData);
        setTotalItems(response.data.total || formattedData.length);
      } else {
        console.error("API返回格式不符合预期:", response);
        toast("获取项目分类列表失败");
        // 如果API调用失败，设置为空数组而不是保留旧数据
        setData([]);
      }
    } catch (error) {
      console.error("加载项目分类列表失败", error);
      toast("网络错误，请稍后重试");
      setData([]);
    } finally {
      setLoading(false);
      console.log("===== 项目分类数据加载完成 =====");
    }
  }
  
  // 处理搜索 - 修复类型兼容性问题
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }
  
  // 修复调用参数类型
  const handleQuickFilterChange = (filterId: string, value: string) => {
    setFilterValues(prev => {
      const updated = { ...prev }
      if (value === 'all') {
        delete updated[filterId]
      } else {
        updated[filterId] = value
      }
      return updated
    })
    setCurrentPage(1)
  }
  
  // 处理排序变更
  const handleSortChange = (sortId: string) => {
    setSortOption(sortId)
    setCurrentPage(1)
  }
  
  // 处理分页变更
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  // 处理每页条数变更
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }
  
  // 处理查看
  const handleView = (category: any) => {
    setViewingCategory(category)
    setViewDrawerOpen(true)
  }
  
  // 处理添加
  const handleAdd = () => {
    // 使用新增分类页面，而不是对话框
    router.push("/auxiliary/create/projectCategory")
  }
  
  // 处理编辑
  const handleEdit = (category: any) => {
    // 跳转到编辑页面
    router.push(`/auxiliary/create/projectCategory?edit=true&id=${category.id}`)
  }
  
  // 处理删除
  const handleDelete = async (category: any) => {
    if (confirm(`确定要删除"${category.name}"吗？`)) {
      try {
        const response = await del(`/api/project/projectType/delete/${category.id}`)
        
        if (response && response.code === 200) {
          setData(data.filter(item => item.id !== category.id))
          toast.success("删除成功")
        } else {
          toast.error("删除失败: " + (response?.message || "未知错误"))
        }
      } catch (error) {
        console.error("删除项目分类失败", error)
        toast.error("网络错误，请稍后重试")
      }
    }
  }
  
  // 批量启用
  const handleBatchEnable = async () => {
    try {
      let success = 0
      
      for (const id of selectedRows) {
        const response = await put('/api/project/projectType/update', {
          id,
          isUsed: true
        })
        
        if (response && response.code === 200) {
          success++
        }
      }
      
      if (success > 0) {
        // 重新加载数据而不是直接修改本地状态
        loadData()
        setSelectedRows([])
        toast.success(`成功启用 ${success} 项`)
      } else {
        toast.error("批量启用失败")
      }
    } catch (error) {
      console.error("批量启用失败", error)
      toast.error("网络错误，请稍后重试")
    }
  }
  
  // 批量停用
  const handleBatchDisable = async () => {
    try {
      let success = 0
      
      for (const id of selectedRows) {
        const response = await put('/api/project/projectType/update', {
          id,
          isUsed: false
        })
        
        if (response && response.code === 200) {
          success++
        }
      }
      
      if (success > 0) {
        // 重新加载数据而不是直接修改本地状态
        loadData()
        setSelectedRows([])
        toast.success(`成功停用 ${success} 项`)
      } else {
        toast.error("批量停用失败")
      }
    } catch (error) {
      console.error("批量停用失败", error)
      toast.error("网络错误，请稍后重试")
    }
  }
  
  // 批量删除
  const handleBatchDelete = async () => {
    if (confirm(`确定要删除选中的 ${selectedRows.length} 项吗？`)) {
      try {
        let success = 0
        
        for (const id of selectedRows) {
          const response = await del(`/api/project/projectType/delete/${id}`)
          
          if (response && response.code === 200) {
            success++
          }
        }
        
        if (success > 0) {
          // 重新加载数据而不是直接修改本地状态
          loadData()
          setSelectedRows([])
          toast.success(`成功删除 ${success} 项`)
        } else {
          toast.error("批量删除失败")
        }
      } catch (error) {
        console.error("批量删除失败", error)
        toast.error("网络错误，请稍后重试")
      }
    }
  }
  
  // 状态切换
  const handleToggleStatus = async (id: string | number, newStatus: boolean) => {
    try {
      // 调用API更新状态
      const response = await put('/api/project/projectType/update', {
        id,
        isUsed: newStatus
      })
      
      if (response && response.code === 200) {
        // 更新本地状态
        setData(prevData => 
          prevData.map(item => 
            item.id === id 
              ? { 
                  ...item, 
                  enabled: newStatus,
                  status: newStatus ? "启用" : "停用" 
                } 
              : item
          )
        )
        toast.success(`已${newStatus ? '启用' : '禁用'}项目分类`)
      } else {
        toast.error("操作失败: " + (response?.message || "未知错误"))
      }
    } catch (error) {
      console.error("更新状态失败", error)
      toast.error("网络错误，请稍后重试")
    }
  }
  
  // 使用条件渲染处理加载状态
  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>数据加载中...</p>
        </div>
      </div>
    )
  }
  
  // 提供刷新按钮作为自定义动作
  const customActions = (
    <Button variant="outline" onClick={loadData} className="ml-2">
      <RefreshCw className="h-4 w-4 mr-2" />
      刷新
    </Button>
  );
  
  return (
    <div>
      <DataList
        title="项目分类管理"
        data={data}
        searchPlaceholder="搜索项目分类..."
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        onSearch={() => loadData()}
        quickFilters={[
    {
      id: "status",
      label: "状态",
            value: filterValues.status || "all",
      category: "基础",
      options: [
        { id: "all", label: "全部状态", value: "all" },
        { id: "enable", label: "启用", value: "启用" },
        { id: "disable", label: "停用", value: "停用" },
      ]
    }
        ]}
        onQuickFilterChange={handleQuickFilterChange}
        sortOptions={[
    {
      id: "createdAt_desc",
      field: "createdAt",
      direction: "desc" as const,
      label: "创建时间 (降序)"
    },
    {
      id: "createdAt_asc",
      field: "createdAt",
      direction: "asc" as const,
      label: "创建时间 (升序)"
    },
    {
      id: "name_asc",
      field: "name",
      direction: "asc" as const,
      label: "名称 (A-Z)"
    },
    {
      id: "name_desc",
      field: "name",
      direction: "desc" as const,
      label: "名称 (Z-A)"
    }
        ]}
        activeSortOption={sortOption}
        onSortChange={handleSortChange}
        defaultViewMode={viewMode}
        tableColumns={[
    {
      id: "categoryCode",
      header: "分类编号",
      accessorKey: "categoryCode",
      cell: (row: any) => row.categoryCode,
    },
    {
      id: "name",
      header: "分类名称",
      accessorKey: "name",
      cell: (row: any) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: "level",
      header: "项目级别",
      accessorKey: "level",
      cell: (row: any) => row.level,
    },
    {
      id: "projectCount",
      header: "项目数",
      accessorKey: "projectCount",
      cell: (row: any) => row.projectCount,
    },
    {
      id: "fundingStandard",
      header: "预算标准",
      accessorKey: "fundingStandard",
      cell: (row: any) => row.fundingStandard,
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      cell: (row: any) => (
        <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "创建时间",
      accessorKey: "createdAt",
      cell: (row: any) => row.createdAt,
    },
        ]}
        tableActions={[
    {
      id: "view",
      label: "查看",
      icon: <Eye className="h-4 w-4" />,
      variant: "ghost" as const,
      onClick: (row: any) => handleView(row),
    },
    {
      id: "edit",
      label: "编辑",
      icon: <Edit className="h-4 w-4" />,
      variant: "ghost" as const,
      onClick: (row: any) => handleEdit(row),
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "ghost" as const,
      onClick: (row: any) => handleDelete(row),
    },
        ]}
        cardFields={[
    {
      id: "categoryCode",
      label: "分类编号",
      value: (row: any) => row.categoryCode,
    },
    {
      id: "level",
      label: "项目级别",
      value: (row: any) => row.level,
    },
    {
      id: "status",
      label: "状态",
      value: (row: any) => (
        <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      label: "创建时间",
      value: (row: any) => row.createdAt,
    },
        ]}
        titleField="name"
        descriptionField="description"
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={[
    {
      id: "enable",
      label: "启用",
      icon: <Eye className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => handleBatchEnable(),
    },
    {
      id: "disable",
      label: "停用",
      icon: <Eye className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => handleBatchDisable(),
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => handleBatchDelete(),
    },
        ]}
        onItemClick={(item) => handleView(item)}
        addButtonLabel="新增项目分类"
        onAddNew={handleAdd}
        customActions={customActions}
      />
      
      {/* 项目分类查看抽屉 */}
      <ProjectCategoryViewDrawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        category={viewingCategory}
      />
    </div>
  )
} 