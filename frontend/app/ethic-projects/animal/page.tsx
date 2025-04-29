"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ClientOnly from "@/components/client-only"
import DataList from "@/components/data-management/data-list"
import { Eye, Pencil, Trash2, FileText, Microscope } from "lucide-react"
import { mockEthicProjects } from "../data/ethic-project-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { CustomCardWrapper } from "../components"

export default function AnimalEthicProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [seniorFilterValues, setSeniorFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("name_asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    projectNumber: true,
    name: true,
    type: false,
    status: true,
    auditStatus: true,
    leader: true,
    progress: true,
    budget: true,
    dates: true,
    members: true,
  })

  // 加载项目数据
  const fetchProjects = async () => {
    setLoading(true)
    
    try {
      // 这里先使用模拟数据，实际项目中应替换为真实API调用
      const filteredProjects = mockEthicProjects.filter(project => {
        // 只显示动物伦理项目
        if (project.type !== "动物伦理") return false;
        
        // 搜索条件
        if (searchTerm && 
            !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // 普通筛选条件
        for (const key in filterValues) {
          if (filterValues[key] && filterValues[key] !== 'all' && project[key] !== filterValues[key]) {
            return false;
          }
        }
        
        // 高级筛选条件
        for (const key in seniorFilterValues) {
          if (seniorFilterValues[key] && seniorFilterValues[key] !== 'all' && project[key] !== seniorFilterValues[key]) {
            return false;
          }
        }
        
        return true;
      });
      
      // 分页
      const start = (currentPage - 1) * pageSize;
      const paginatedProjects = filteredProjects.slice(start, start + pageSize);
      
      setProjects(paginatedProjects);
      setTotalItems(filteredProjects.length);
    } catch (error) {
      console.error("获取伦理项目数据失败:", error)
      toast({
        title: "获取数据失败",
        description: "无法获取伦理项目数据，请稍后再试",
        variant: "destructive",
      })
      setProjects([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和依赖项变化时获取数据
  useEffect(() => {
    fetchProjects()
  }, [searchTerm, filterValues, seniorFilterValues, currentPage, pageSize, sortOption])

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1)
    fetchProjects()
  }

  // 筛选、排序和删除处理函数
  const handleDeleteProject = (project: any) => {
    setProjectToDelete(project)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      // 模拟删除操作，实际项目中应替换为真实API调用
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete.id))
      setTotalItems(prev => prev - 1)
      
      toast({
        title: "删除成功",
        description: "伦理项目已成功删除",
      })
    } catch (error) {
      console.error("删除伦理项目失败:", error)
      toast({
        title: "删除失败",
        description: "无法删除伦理项目，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setProjectToDelete(null)
    }
  }

  // 批量操作函数
  const handleBatchDelete = async () => {
    try {
      // 模拟批量删除，实际项目中应替换为真实API调用
      setProjects(prevProjects => prevProjects.filter(p => !selectedRows.includes(p.id)))
      setTotalItems(prev => prev - selectedRows.length)
      
      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedRows.length} 个伦理项目`,
      })
      setSelectedRows([])
    } catch (error) {
      console.error("批量删除失败:", error)
      toast({
        title: "批量删除失败",
        description: "操作未能完成，请稍后再试",
        variant: "destructive",
      })
    }
  }

  const handleBatchApprove = () => {
    toast({
      title: "批量审批",
      description: `已选择 ${selectedRows.length} 个伦理项目进行审批`,
    })
  }

  // 获取分页数据
  const paginatedProjects = projects.slice(0, pageSize)

  // 表格列配置
  const tableColumns = [
    {
      id: "projectNumber",
      header: "项目编号",
      accessorKey: "projectNumber",
      cell: (row: any) => row.projectNumber,
    },
    {
      id: "name",
      header: "项目名称",
      accessorKey: "name",
      cell: (row: any) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: "status",
      header: "项目状态",
      accessorKey: "status",
      cell: (row: any) => row.status,
    },
    {
      id: "auditStatus",
      header: "审核状态",
      accessorKey: "auditStatus",
      cell: (row: any) => row.auditStatus,
    },
    {
      id: "leader",
      header: "负责人",
      accessorKey: "leader.name",
      cell: (row: any) => row.leader?.name || "-",
    },
    {
      id: "dates",
      header: "项目周期",
      accessorKey: "startDate",
      cell: (row: any) => `${row.startDate} ~ ${row.endDate}`,
    },
    {
      id: "budget",
      header: "预算金额",
      accessorKey: "budget",
      cell: (row: any) => `¥${row.budget.toLocaleString()}`,
    },
  ]

  // 卡片字段配置
  const cardFields = [
    {
      id: "projectNumber",
      label: "项目编号",
      value: (row: any) => row.projectNumber,
    },
    {
      id: "type",
      label: "项目类型",
      value: (row: any) => row.type,
    },
    {
      id: "status",
      label: "项目状态",
      value: (row: any) => row.status,
    },
    {
      id: "leader",
      label: "负责人",
      value: (row: any) => row.leader?.name,
    },
    {
      id: "budget",
      label: "预算金额",
      value: (row: any) => `¥${row.budget.toLocaleString()}`,
    },
  ]

  // 快速筛选配置
  const quickFilters = [
    {
      id: "status",
      label: "项目状态",
      options: [
        { label: "全部", value: "all" },
        { label: "进行中", value: "进行中" },
        { label: "规划中", value: "规划中" },
        { label: "已完成", value: "已完成" },
      ],
    },
    {
      id: "auditStatus",
      label: "审核状态",
      options: [
        { label: "全部", value: "all" },
        { label: "待审核", value: "待审核" },
        { label: "审核中", value: "审核中" },
        { label: "审核通过", value: "审核通过" },
        { label: "审核退回", value: "审核退回" },
      ],
    },
  ]

  // 排序选项
  const sortOptions = [
    { label: "项目名称 (升序)", value: "name_asc" },
    { label: "项目名称 (降序)", value: "name_desc" },
    { label: "创建日期 (新→旧)", value: "createTime_desc" },
    { label: "创建日期 (旧→新)", value: "createTime_asc" },
    { label: "预算金额 (高→低)", value: "budget_desc" },
    { label: "预算金额 (低→高)", value: "budget_asc" },
  ]

  // 批量操作配置
  const batchActions = [
    {
      id: "approve",
      label: "批量审批",
      onClick: handleBatchApprove,
    },
    {
      id: "delete",
      label: "批量删除",
      onClick: handleBatchDelete,
      type: "destructive",
    },
  ]

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchApprove,
    },
    {
      ...batchActions[1],
      onClick: handleBatchDelete,
    },
  ]

  // AI辅助函数
  const handleAIAssist = () => {
    router.push("/ethic-projects/ai-form")
  }

  // 自定义卡片操作
  const customCardActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: any) => {
        router.push(`/ethic-projects/${item.id}`)
      },
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: any) => {
        router.push(`/ethic-projects/edit/animal/${item.id}`);
      },
      disabled: (item: any) => item.status === "已完成",
    },
    {
      id: "delete",
      label: "删除项目",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteProject,
      variant: "destructive",
    },
  ]

  // 自定义表格操作
  const customTableActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: any) => router.push(`/ethic-projects/${item.id}`),
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: any) => {
        router.push(`/ethic-projects/edit/animal/${item.id}`);
      },
      disabled: (item: any) => item.status === "已完成",
    },
    {
      id: "delete",
      label: "删除项目",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteProject,
      variant: "destructive",
    },
  ];

  // 状态颜色映射
  const statusColors = {
    "进行中": "yellow",
    "规划中": "blue",
    "已完成": "green",
    "审核通过": "green",
    "审核中": "yellow",
    "待审核": "blue",
    "审核退回": "red",
  }

  // 适配状态颜色
  const adaptedStatusColors = Object.fromEntries(
    Object.entries(statusColors).map(([key, value]) => [key, value])
  )

  // 高级筛选分类
  const filterCategories = [
    {
      id: "basic",
      title: "基本信息", 
      fields: [
        {
          id: "name",
          label: "项目名称",
          type: "text",
        },
        {
          id: "projectNumber",
          label: "项目编号",
          type: "text",
        },
        {
          id: "source",
          label: "项目来源",
          type: "select",
          options: [
            { label: "全部", value: "all" },
            { label: "国家自然科学基金", value: "国家自然科学基金" },
            { label: "国家社会科学基金", value: "国家社会科学基金" },
            { label: "省级科研基金", value: "省级科研基金" },
            { label: "校级研究项目", value: "校级研究项目" },
          ],
        },
      ],
    },
    {
      id: "status",
      title: "状态信息",
      fields: [
        {
          id: "status",
          label: "项目状态",
          type: "select",
          options: [
            { label: "全部", value: "all" },
            { label: "进行中", value: "进行中" },
            { label: "规划中", value: "规划中" },
            { label: "已完成", value: "已完成" },
          ],
        },
        {
          id: "auditStatus",
          label: "审核状态",
          type: "select",
          options: [
            { label: "全部", value: "all" },
            { label: "待审核", value: "待审核" },
            { label: "审核中", value: "审核中" },
            { label: "审核通过", value: "审核通过" },
            { label: "审核退回", value: "审核退回" },
          ],
        },
      ],
    },
  ]

  // 渲染页面
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
        <div
          className="absolute top-0 left-0 right-0 h-[300px] -z-10"
          style={{
            background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
          }}
        ></div>

        <div>
          <ClientOnly>
            {React.createElement(DataList as any, {
              title: "动物伦理",
              data: paginatedProjects,
              onAddNew: () => router.push("/ethic-projects/create/animal"),
              addButtonLabel: "新建项目",
              onOpenSettings: () => setIsTemplatesDialogOpen(true),
              settingsButtonLabel: "模板库",
              onAIAssist: handleAIAssist,
              searchValue: searchTerm,
              onSearchChange: setSearchTerm,
              onSearch: handleSearch,
              quickFilters: quickFilters.map(filter => ({
                ...filter,
                options: filter.options || [] 
              })),
              quickFilterValues: filterValues,
              onQuickFilterChange: (filterId: string, value: string) => {
                setFilterValues(prev => ({
                  ...prev,
                  [filterId]: value
                }));
                setCurrentPage(1);
              },
              sortOptions: sortOptions,
              activeSortOption: sortOption,
              onSortChange: setSortOption,
              defaultViewMode: viewMode,
              onViewModeChange: setViewMode,
              tableColumns: tableColumns,
              tableActions: customTableActions,
              visibleColumns: visibleColumns,
              onVisibleColumnsChange: setVisibleColumns,
              cardFields: cardFields,
              cardActions: customCardActions,
              titleField: "name",
              descriptionField: "description",
              statusField: "status",
              statusVariants: adaptedStatusColors,
              priorityField: "priority",
              progressField: "progress",
              tasksField: { completed: "tasks.completed", total: "tasks.total" },
              teamSizeField: "members",
              pageSize: pageSize,
              currentPage: currentPage,
              totalItems: totalItems,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
              selectedRows: selectedRows,
              onSelectedRowsChange: setSelectedRows,
              batchActions: configuredBatchActions,
              onItemClick: (item: any) => router.push(`/ethic-projects/${item.id}`),
              detailsUrlPrefix: "/ethic-projects",
              categories: filterCategories,
              seniorFilterValues: seniorFilterValues,
              onAdvancedFilter: (filterValues: Record<string, any>) => {
                setSeniorFilterValues(prev => ({
                  ...prev,
                  ...filterValues
                }));
                setCurrentPage(1);
              },
              customCardRenderer: (item, actions, isSelected, onToggleSelect) => {
                // 创建包含动物种系、动物数量等数据的项目对象
                const extendedItem = {
                  ...item,
                  动物种系: item.type === "动物伦理" ? "大鼠" : "小鼠",
                  动物数量: item.animalCount || "245只",
                  伦理委员会: "医学院伦理审查委员会",
                  动物实施设备单位: "基础医学实验中心",
                  进行中: "3",
                  已完成: "1",
                };
                
                return (
                  <CustomCardWrapper
                    item={extendedItem}
                    actions={actions}
                    fields={cardFields}
                    titleField="name"
                    descriptionField="description"
                    statusField="status"
                    statusVariants={adaptedStatusColors}
                    progressField="progress"
                    tasksField={{ completed: "tasks.completed", total: "tasks.total" }}
                    detailsUrl={`/ethic-projects/${item.id}`}
                    className=""
                    selected={isSelected}
                    onSelect={onToggleSelect}
                    onClick={() => router.push(`/ethic-projects/${item.id}`)}
                  />
                );
              }
            })}
          </ClientOnly>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除项目 "{projectToDelete?.name}" 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProject}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 