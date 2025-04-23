"use client"

import { useState, useEffect } from "react"
import React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import ClientOnly from "@/components/client-only"
import {
  quickFilters,
  personnelFilterCategories,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  tableActions,
  createCardActions,
  batchActions,
  statusColors,
} from "./config/project-config"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import StatusExample from "./status-example"
import { FileText, Building2, GraduationCap, Eye, Pencil, Trash2 } from "lucide-react"
import { TemplatesDialog } from "./components/templates-dialog"
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
import { toast } from "@/components/ui/use-toast"
import { getProjectList, ProjectQueryParams, deleteProject, batchDeleteProjects } from "@/lib/api/project"
import { adaptProjectForList } from "@/lib/adapters/project-adapter"
import { get, post, put, del, filterSearchPost } from "@/lib/api"

// 修改 statusVariants 的类型
const adaptedStatusColors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {};
Object.entries(statusColors).forEach(([key, value]) => {
  // 转换字符串类型到需要的联合类型
  if (value === "green" || value === "success") {
    adaptedStatusColors[key] = "default";
  } else if (value === "red" || value === "error") {
    adaptedStatusColors[key] = "destructive";
  } else if (value === "blue" || value === "info") {
    adaptedStatusColors[key] = "secondary";
  } else {
    adaptedStatusColors[key] = "outline";
  }
});

// 修改下拉菜单项的类型定义，与DataListHeader组件一致
type DropdownMenuItemType = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  type?: "header";
  showArrow?: boolean;
};

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = "1" // 模拟当前用户ID，注意这里使用字符串类型

  // 状态管理
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [activeTab, setActiveTab] = useState<"vertical" | "horizontal" | "schoolLevel" | "disbursement">("vertical")
  const [searchTerm, setSearchTerm] = useState("")//混合
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})  //普通
  const [seniorFilterValues, setSeniorFilterValues] = useState<Record<string, any>>({}) //高级
  const [sortOption, setSortOption] = useState("name_asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false)
  // 删除确认对话框状态
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  // 修改 visibleColumns 状态，移除 type 字段
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

  // 从URL查询参数中读取并设置活动标签页
  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam === 'vertical' || tabParam === 'horizontal' ||
        tabParam === 'schoolLevel' || tabParam === 'disbursement') {
      setActiveTab(tabParam as "vertical" | "horizontal" | "schoolLevel" | "disbursement")
    }
  }, [searchParams])

  // 添加监听activeTab变化的effect，更新URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 使用history.pushState更新URL而不触发页面刷新
      const url = new URL(window.location.href);
      url.searchParams.set('tab', activeTab);
      window.history.pushState({}, '', url.toString());
    }
  }, [activeTab]);

  // 加载项目数据
  const fetchProjects = async () => {
    setLoading(true)
    
    try {
      // 构建查询参数
      const params: ProjectQueryParams = {
        current: currentPage,
        size: pageSize,
        name: searchTerm || undefined,
        // 解析filterValues中的值
        type: filterValues.type && filterValues.type !== 'all' ? filterValues.type : undefined,
        status: filterValues.status && filterValues.status !== 'all' ? filterValues.status : undefined,
        auditStatus: filterValues.auditStatus && filterValues.auditStatus !== 'all' ? filterValues.auditStatus : undefined,
        leaderId: filterValues.leader && filterValues.leader !== 'all' ? filterValues.leader : undefined,
        priority: filterValues.priority && filterValues.priority !== 'all' ? filterValues.priority : undefined,
      }
      
      // 排序参数
      if (sortOption) {
        const [field, direction] = sortOption.split('_')
        params.orderBy = field
        params.orderDirection = direction
      }
      let response = await filterSearchPost<any>(
        '/api/project/horizontal/page',
        currentPage,
        pageSize,
        searchTerm,
        "name,projectNumber",
        filterValues,
        seniorFilterValues
      );
      
      if (response.data && response.data.records) {
        setProjects(response.data.records)
        setTotalItems(response.data.total || 0)
      } else {
        setProjects([])
        setTotalItems(0)
      }
    } catch (error) {
      console.error('加载项目列表失败:', error)
      // 加载失败时使用空数组
      setProjects([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  // 当查询条件变化时加载数据
  useEffect(() => {
    fetchProjects()
  }, [currentPage, pageSize, activeTab, sortOption])
  
  // 当筛选条件变化时，重置页码并加载数据
  useEffect(() => {
    setCurrentPage(1)
    fetchProjects()
  }, [searchTerm, filterValues,seniorFilterValues])

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1)
    fetchProjects()
  }

  // 过滤和排序数据
  const filteredProjects = projects
    .filter((project) => {
      // 标签页过滤
      if (activeTab === "vertical" && project.type !== "vertical") {
        return false;
      }
      if (activeTab === "horizontal" && project.type !== "horizontal") {
        return false;
      }
      if (activeTab === "schoolLevel" && project.type !== "schoolLevel") {
        return false;
      }
      if (activeTab === "disbursement" && project.type !== "disbursement") {
        return false;
      }

      // 搜索过滤
      if (
        searchTerm &&
        (!project.name || !project.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!project.description || !project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!project.projectNumber || !project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return false
      }

      // 快速筛选
      if (filterValues.status && filterValues.status !== "all" && project.status !== filterValues.status) {
        return false
      }

      if (
        filterValues.auditStatus &&
        filterValues.auditStatus !== "all" &&
        project.auditStatus !== filterValues.auditStatus
      ) {
        return false
      }

      if (filterValues.type && filterValues.type !== "all" && project.type !== filterValues.type) {
        return false
      }

      // 高级筛选
      if (
        filterValues.leader &&
        filterValues.leader !== "all" &&
        (!project.leader || project.leader.id.toString() !== filterValues.leader)
      ) {
        return false
      }

      if (filterValues.priority && filterValues.priority !== "all" && project.priority !== filterValues.priority) {
        return false
      }

      if (filterValues.dateRange?.from && filterValues.dateRange?.to) {
        const startDate = new Date(project.startDate)
        const endDate = new Date(project.endDate)
        const filterFrom = new Date(filterValues.dateRange.from)
        const filterTo = new Date(filterValues.dateRange.to)

        if (startDate < filterFrom || endDate > filterTo) {
          return false
        }
      }

      if (filterValues.members && !filterValues.members.includes("all")) {
        // 这里需要根据实际数据结构调整成员过滤逻辑
        // 示例仅作演示
        return true
      }

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const [field, direction] = sortOption.split("_")

      if (field === "name") {
        // 添加安全检查
        if (!a || !a.name || !b || !b.name) {
          return 0; // 如果任一对象或其name属性为空，则认为它们相等
        }
        return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      if (field === "progress") {
        // 添加安全检查
        if (!a || !b || typeof a.progress !== 'number' || typeof b.progress !== 'number') {
          return 0; // 如果任一对象或其progress属性无效，则认为它们相等
        }
        return direction === "asc" ? a.progress - b.progress : b.progress - a.progress
      }

      if (field === "priority") {
        // 添加安全检查
        if (!a || !b || !a.priority || !b.priority) {
          return 0; // 如果任一对象或其priority属性为空，则认为它们相等
        }
        const priorityOrder = { 高: 3, 中: 2, 低: 1 }
        // 确保查找的键存在于优先级映射中
        const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return direction === "asc"
          ? priorityA - priorityB
          : priorityB - priorityA
      }

      return 0
    })

  // 分页数据
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchApprove = () => {
    setProjects(
      projects.map((project) =>
        selectedRows.includes(project.id.toString()) ? { ...project, status: "进行中" } : project,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = async () => {
    try {
      // 调用批量删除API
      await batchDeleteProjects(selectedRows);

      // 更新前端状态
      setProjects(projects.filter((project) => !selectedRows.includes(project.id.toString())));

      // 显示操作结果
      toast({
        title: "批量删除完成",
        description: `成功删除 ${selectedRows.length} 个项目`,
        duration: 3000,
      });

      // 清空选择
      setSelectedRows([]);
    } catch (error) {
      console.error('批量删除项目失败:', error);
      toast({
        title: "批量删除失败",
        description: "部分或全部项目删除失败，请稍后再试",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  // 修改处理单个项目删除的函数
  const handleDeleteProject = (project: any) => {
    // 设置要删除的项目并显示确认对话框
    setProjectToDelete(project)
  }

  // 确认删除的处理函数
  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        // 调用后端API删除项目
        await deleteProject(projectToDelete.id);

        // 删除成功后，更新前端状态
        setProjects(projects.filter((p) => p.id !== projectToDelete.id));

        toast({
          title: "删除成功",
          description: `项目 "${projectToDelete.name}" 已被删除`,
          duration: 3000,
        });

        // 关闭对话框
        setProjectToDelete(null);
      } catch (error) {
        console.error('删除项目失败:', error);
        toast({
          title: "删除失败",
          description: "无法删除项目，请稍后再试",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }

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



  // 配置标签页
  const tabs = [
    {
      id: "vertical",
      label: "纵向项目",
      count: projects.filter((project) => project.type === "vertical").length,
    },
    {
      id: "horizontal",
      label: "横向项目",
      count: projects.filter((project) => project.type === "horizontal").length,
    },
    {
      id: "schoolLevel",
      label: "校级项目",
      count: projects.filter((project) => project.type === "schoolLevel").length,
    },
    {
      id: "disbursement",
      label: "出账合同",
      count: projects.filter((project) => project.type === "disbursement").length,
    }
  ]

  // 在其他状态管理代码下方添加
  const handleAIAssist = () => {
    // 直接使用路由导航到AI表单页面
    router.push("/projects/ai-form")
  }

  // 自定义卡片操作
  const customCardActions = createCardActions(handleDeleteProject)

  // 自定义表格操作
  const customTableActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: any) => router.push(`/projects/${item.id}`),
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: any) => {
        // 根据项目类型确定编辑页面路径
        const projectType = item.type?.includes('校') ? 'schoolLevel' :
                          item.type?.includes('纵') ? 'vertical' : 'horizontal';
        let editUrl = '';

        if (projectType === 'schoolLevel') {
          editUrl = `/projects/edit/school/${item.id}`;
        } else if (projectType === 'vertical') {
          editUrl = `/projects/edit/vertical/${item.id}`;
        } else {
          editUrl = `/projects/edit/${item.id}`;
        }

        router.push(editUrl);
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

  // 根据活动标签页获取标题
  const getPageTitle = () => {
    switch (activeTab) {
      case "vertical":
        return "纵向项目";
      case "horizontal":
        return "横向项目";
      case "schoolLevel":
        return "校级项目";
      case "disbursement":
        return "出账合同";
      default:
        return "项目管理";
    }
  }

  // 修改页面标题和按钮标签
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
        <div
          className="absolute top-0 left-0 right-0 h-[300px] -z-10"
          style={{
            background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
          }}
        ></div>

        <Tabs defaultValue="vertical">
          <TabsContent value="vertical">
            <div>
              <ClientOnly>
                {/* 使用强制类型转换，解决TypeScript类型错误 */}
                {React.createElement(DataList as any, {
                  title: getPageTitle(),
                  data: paginatedProjects,
                  tabs: tabs,
                  activeTab: activeTab,
                  onTabChange: (value: string) => setActiveTab(value as "vertical" | "horizontal" | "schoolLevel" | "disbursement"),
                  onAddNew: () => {},
                  addButtonLabel: "新建项目",
                  addButtonDropdownItems: [
                    {
                      label: "选择项目类型",
                      type: "header",
                      onClick: () => {},
                    },
                    {
                      label: "新建纵向项目",
                      icon: <FileText className="h-5 w-5 text-blue-500" />,
                      onClick: () => router.push("/projects/create/vertical"),
                      showArrow: true,
                    },
                    {
                      label: "新建横向项目",
                      icon: <Building2 className="h-5 w-5 text-green-500" />,
                      onClick: () => router.push("/projects/create/horizontal"),
                      showArrow: true,
                    },
                    {
                      label: "新建校级项目",
                      icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
                      onClick: () => router.push("/projects/create/school"),
                      showArrow: true,
                    },
                    {
                      label: "新建出账合同",
                      icon: <FileText className="h-5 w-5 text-purple-500" />,
                      onClick: () => router.push("/projects/create/contract"),
                      showArrow: true,
                    },
                  ],
                  onOpenSettings: () => setIsTemplatesDialogOpen(true),
                  settingsButtonLabel: "模板库",
                  onAIAssist: handleAIAssist,
                  searchValue: searchTerm,
                  onSearchChange: setSearchTerm,
                  onSearch: handleSearch,
                  quickFilters: quickFilters.map(filter => ({
                    ...filter,
                    options: [] // 添加空的options数组以满足类型要求
                  })),
                  quickFilterValues: filterValues,
                  onQuickFilterChange: (filterId: string, value: string) => {
                    console.log('快速过滤条件变更:', filterId, value);
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
                  onItemClick: (item: any) => router.push(`/projects/${item.id}`),
                  detailsUrlPrefix: "/projects",
                  categories: personnelFilterCategories,
                  seniorFilterValues: seniorFilterValues,
                  onAdvancedFilter: (filterValues: Record<string, any>) => {
                    console.log('接收到高级筛选值:', filterValues);
                    setSeniorFilterValues(prev => ({
                      ...prev,
                      ...filterValues
                    }));
                    setCurrentPage(1);
                  }
                })}
              </ClientOnly>
            </div>
          </TabsContent>
          <TabsContent value="horizontal">
            <div>
              <ClientOnly>
                {/* 使用强制类型转换，解决TypeScript类型错误 */}
                {React.createElement(DataList as any, {
                  title: getPageTitle(),
                  data: paginatedProjects,
                  tabs: tabs,
                  activeTab: activeTab,
                  onTabChange: (value: string) => setActiveTab(value as "vertical" | "horizontal" | "schoolLevel" | "disbursement"),
                  onAddNew: () => {},
                  addButtonLabel: "新建项目",
                  addButtonDropdownItems: [
                    {
                      label: "选择项目类型",
                      type: "header",
                      onClick: () => {},
                    },
                    {
                      label: "新建纵向项目",
                      icon: <FileText className="h-5 w-5 text-blue-500" />,
                      onClick: () => router.push("/projects/create/vertical"),
                      showArrow: true,
                    },
                    {
                      label: "新建横向项目",
                      icon: <Building2 className="h-5 w-5 text-green-500" />,
                      onClick: () => router.push("/projects/create/horizontal"),
                      showArrow: true,
                    },
                    {
                      label: "新建校级项目",
                      icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
                      onClick: () => router.push("/projects/create/school"),
                      showArrow: true,
                    },
                    {
                      label: "新建出账合同",
                      icon: <FileText className="h-5 w-5 text-purple-500" />,
                      onClick: () => router.push("/projects/create/contract"),
                      showArrow: true,
                    },
                  ],
                  onOpenSettings: () => setIsTemplatesDialogOpen(true),
                  settingsButtonLabel: "模板库",
                  onAIAssist: handleAIAssist,
                  searchValue: searchTerm,
                  onSearchChange: setSearchTerm,
                  onSearch: handleSearch,
                  quickFilters: quickFilters.map(filter => ({
                    ...filter,
                    options: [] // 添加空的options数组以满足类型要求
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
                  onItemClick: (item: any) => router.push(`/projects/${item.id}`),
                  detailsUrlPrefix: "/projects",
                  categories: personnelFilterCategories,
                  seniorFilterValues: seniorFilterValues,
                  onAdvancedFilter: (filterValues: Record<string, any>) => {
                    setSeniorFilterValues(prev => ({
                      ...prev,
                      ...filterValues
                    }));
                    setCurrentPage(1);
                  }
                })}
              </ClientOnly>
            </div>
          </TabsContent>
          <TabsContent value="schoolLevel">
            <div>
              <ClientOnly>
                {/* 使用强制类型转换，解决TypeScript类型错误 */}
                {React.createElement(DataList as any, {
                  title: getPageTitle(),
                  data: paginatedProjects,
                  tabs: tabs,
                  activeTab: activeTab,
                  onTabChange: (value: string) => setActiveTab(value as "vertical" | "horizontal" | "schoolLevel" | "disbursement"),
                  onAddNew: () => {},
                  addButtonLabel: "新建项目",
                  addButtonDropdownItems: [
                    {
                      label: "选择项目类型",
                      type: "header",
                      onClick: () => {},
                    },
                    {
                      label: "新建纵向项目",
                      icon: <FileText className="h-5 w-5 text-blue-500" />,
                      onClick: () => router.push("/projects/create/vertical"),
                      showArrow: true,
                    },
                    {
                      label: "新建横向项目",
                      icon: <Building2 className="h-5 w-5 text-green-500" />,
                      onClick: () => router.push("/projects/create/horizontal"),
                      showArrow: true,
                    },
                    {
                      label: "新建校级项目",
                      icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
                      onClick: () => router.push("/projects/create/school"),
                      showArrow: true,
                    },
                    {
                      label: "新建出账合同",
                      icon: <FileText className="h-5 w-5 text-purple-500" />,
                      onClick: () => router.push("/projects/create/contract"),
                      showArrow: true,
                    },
                  ],
                  onOpenSettings: () => setIsTemplatesDialogOpen(true),
                  settingsButtonLabel: "模板库",
                  onAIAssist: handleAIAssist,
                  searchValue: searchTerm,
                  onSearchChange: setSearchTerm,
                  onSearch: handleSearch,
                  quickFilters: quickFilters.map(filter => ({
                    ...filter,
                    options: [] // 添加空的options数组以满足类型要求
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
                  onItemClick: (item: any) => router.push(`/projects/${item.id}`),
                  detailsUrlPrefix: "/projects",
                  categories: personnelFilterCategories,
                  seniorFilterValues: seniorFilterValues,
                  onAdvancedFilter: (filterValues: Record<string, any>) => {
                    setSeniorFilterValues(prev => ({
                      ...prev,
                      ...filterValues
                    }));
                    setCurrentPage(1);
                  }
                })}
              </ClientOnly>
            </div>
          </TabsContent>
          <TabsContent value="disbursement">
            <div>
              <ClientOnly>
                {/* 使用强制类型转换，解决TypeScript类型错误 */}
                {React.createElement(DataList as any, {
                  title: getPageTitle(),
                  data: paginatedProjects,
                  tabs: tabs,
                  activeTab: activeTab,
                  onTabChange: (value: string) => setActiveTab(value as "vertical" | "horizontal" | "schoolLevel" | "disbursement"),
                  onAddNew: () => {},
                  addButtonLabel: "新建项目",
                  addButtonDropdownItems: [
                    {
                      label: "选择项目类型",
                      type: "header",
                      onClick: () => {},
                    },
                    {
                      label: "新建纵向项目",
                      icon: <FileText className="h-5 w-5 text-blue-500" />,
                      onClick: () => router.push("/projects/create/vertical"),
                      showArrow: true,
                    },
                    {
                      label: "新建横向项目",
                      icon: <Building2 className="h-5 w-5 text-green-500" />,
                      onClick: () => router.push("/projects/create/horizontal"),
                      showArrow: true,
                    },
                    {
                      label: "新建校级项目",
                      icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
                      onClick: () => router.push("/projects/create/school"),
                      showArrow: true,
                    },
                    {
                      label: "新建出账合同",
                      icon: <FileText className="h-5 w-5 text-purple-500" />,
                      onClick: () => router.push("/projects/create/contract"),
                      showArrow: true,
                    },
                  ],
                  onOpenSettings: () => setIsTemplatesDialogOpen(true),
                  settingsButtonLabel: "模板库",
                  onAIAssist: handleAIAssist,
                  searchValue: searchTerm,
                  onSearchChange: setSearchTerm,
                  onSearch: handleSearch,
                  quickFilters: quickFilters.map(filter => ({
                    ...filter,
                    options: [] // 添加空的options数组以满足类型要求
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
                  onItemClick: (item: any) => router.push(`/projects/${item.id}`),
                  detailsUrlPrefix: "/projects",
                  categories: personnelFilterCategories,
                  seniorFilterValues: seniorFilterValues,
                  onAdvancedFilter: (filterValues: Record<string, any>) => {
                    setSeniorFilterValues(prev => ({
                      ...prev,
                      ...filterValues
                    }));
                    setCurrentPage(1);
                  }
                })}
              </ClientOnly>
            </div>
          </TabsContent>
          <TabsContent value="status-example">
            <StatusExample />
          </TabsContent>
        </Tabs>

        <TemplatesDialog open={isTemplatesDialogOpen} onOpenChange={setIsTemplatesDialogOpen} />

        {/* 删除确认对话框 */}
        <AlertDialog open={projectToDelete !== null} onOpenChange={(open) => {
          if (!open) setProjectToDelete(null)
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除项目</AlertDialogTitle>
              <AlertDialogDescription>
                {projectToDelete ? `您确定要删除项目 "${projectToDelete.name}" 吗？此操作不可逆，删除后数据将无法恢复。` : ''}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

