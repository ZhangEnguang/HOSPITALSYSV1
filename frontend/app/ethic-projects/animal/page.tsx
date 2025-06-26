"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, BriefcaseMedical, Database, FileText, MousePointer2, Eye, Edit, Trash2, ClipboardList, Upload, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import DataList from "@/components/data-management/data-list"
import ClientOnly from "@/components/client-only"
import CustomCardWrapper from "../components/custom-card-wrapper"
import { useLoading } from "@/hooks/use-loading"
import { useToast } from "@/components/ui/use-toast"

// 重新定义伦理状态颜色适配
const adaptedStatusColors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  "进行中": "default",
  "规划中": "secondary", 
  "已完成": "outline",
  "已暂停": "outline",
  "审核通过": "default",
  "审核中": "secondary",
  "待审核": "secondary",
  "审核退回": "destructive"
}

// 动物伦理项目页面组件
export default function AnimalEthicProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoading, startLoading, stopLoading } = useLoading()
  
  // 模板对话框状态
  // const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false)
  
  // 删除确认对话框状态
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [currentDeleteId, setCurrentDeleteId] = useState("")
  
  // 项目数据
  const [projects, setProjects] = useState<any[]>([
    {
      id: "1",
      projectNumber: "AE-2024-0001",
      name: "实验大鼠药物代谢研究",
      description: "研究药物在大鼠体内的代谢过程及其机制",
      status: "进行中",
      animalType: "大鼠", 
      animalCount: "85只",
      ethicsCommittee: "医学院伦理审查委员会",
      facilityUnit: "基础医学实验中心",
      项目归属单位: "药学院",
      leader: "王教授",
      createdAt: "2023-10-12",
      progress: 35,
      tasks: { completed: 3, total: 8 },
      type: "动物伦理",
      members: [
        { name: "王教授", role: "项目负责人", avatar: null },
        { name: "李助理", role: "实验操作", avatar: null },
        { name: "张技术员", role: "数据分析", avatar: null },
        { name: "刘研究员", role: "实验设计", avatar: null }
      ]
    },
    {
      id: "2",
      projectNumber: "AE-2024-0002",
      name: "小鼠造血干细胞分化实验",
      description: "研究小鼠造血干细胞的分化过程与调控机制",
      status: "规划中",
      animalType: "小鼠",
      animalCount: "120只",
      ethicsCommittee: "医学院伦理审查委员会",
      facilityUnit: "免疫学实验中心",
      项目归属单位: "基础医学院",
      leader: "李研究员",
      createdAt: "2023-11-05",
      progress: 15,
      tasks: { completed: 1, total: 7 },
      type: "动物伦理",
      members: [
        { name: "李研究员", role: "项目负责人", avatar: null },
        { name: "陈博士", role: "项目协调", avatar: null },
        { name: "吴老师", role: "实验设计", avatar: null }
      ]
    },
    {
      id: "3",
      projectNumber: "AE-2023-0001",
      name: "兔脊髓损伤修复研究",
      description: "通过神经干细胞移植技术研究兔脊髓损伤的修复机制",
      status: "已完成",
      animalType: "兔子",
      animalCount: "30只",
      ethicsCommittee: "医学院伦理审查委员会",
      facilityUnit: "神经科学实验中心",
      项目归属单位: "临床医学院",
      leader: "张副教授",
      createdAt: "2023-08-20",
      progress: 100,
      tasks: { completed: 6, total: 6 },
      type: "动物伦理",
      members: [
        { name: "张副教授", role: "项目负责人", avatar: null },
        { name: "孙医生", role: "临床指导", avatar: null }
      ]
    },
    {
      id: "4",
      projectNumber: "AE-2024-0003",
      name: "微型猪心脏移植研究",
      description: "探索猪心脏移植到人体的可行性与排斥反应机制研究",
      status: "进行中",
      animalType: "猪",
      animalCount: "8只",
      ethicsCommittee: "医学院伦理审查委员会",
      facilityUnit: "器官移植研究中心",
      项目归属单位: "外科学系",
      leader: "赵教授",
      createdAt: "2023-09-15",
      progress: 45,
      tasks: { completed: 4, total: 9 },
      type: "动物伦理",
      members: [
        { name: "赵教授", role: "项目负责人", avatar: null },
        { name: "马医生", role: "外科手术", avatar: null },
        { name: "刘技师", role: "设备操作", avatar: null },
        { name: "韩研究员", role: "数据统计", avatar: null },
        { name: "胡护师", role: "术后护理", avatar: null }
      ]
    },
    {
      id: "5",
      projectNumber: "AE-2024-0004",
      name: "犬类心脏病模型研究",
      description: "建立和验证犬类心脏病动物模型，用于心脏疾病治疗新药筛选",
      status: "规划中",
      animalType: "犬类",
      animalCount: "15只",
      ethicsCommittee: "医学院伦理审查委员会",
      facilityUnit: "心血管研究中心",
      项目归属单位: "内科学系",
      leader: "钱研究员",
      createdAt: "2023-12-03",
      progress: 10,
      tasks: { completed: 1, total: 10 },
      type: "动物伦理",
      members: [
        { name: "钱研究员", role: "项目负责人", avatar: null },
        { name: "周博士", role: "心脏专家", avatar: null },
        { name: "黄技师", role: "实验操作", avatar: null }
      ]
    },
    {
      id: "6",
      projectNumber: "AE-2024-0005",
      name: "猕猴脑功能区神经连接图谱研究",
      description: "利用先进成像技术绘制猕猴脑功能区神经连接图谱，探索大脑工作机理",
      status: "进行中",
      animalType: "猴子",
      animalCount: "12只",
      ethicsCommittee: "医学院伦理审查委员会",
      facilityUnit: "脑科学中心",
      项目归属单位: "神经科学系",
      leader: "孙教授",
      createdAt: "2023-07-28",
      progress: 60,
      tasks: { completed: 5, total: 8 },
      type: "动物伦理",
      members: [
        { name: "孙教授", role: "项目负责人", avatar: null },
        { name: "邓博士", role: "神经科学专家", avatar: null },
        { name: "郭技师", role: "成像技术", avatar: null },
        { name: "林研究员", role: "数据分析", avatar: null }
      ]
    }
  ])
  
  // 分页数据
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(6)
  
  // 搜索和过滤
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sortOption, setSortOption] = useState<string>("latest")
  
  // 视图模式
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // 表格列可见性 - 修改为符合DataList组件要求的格式
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    "projectNumber": true,
    "name": true, 
    "status": false, 
    "animalType": true, 
    "animalCount": true, 
    "ethicsCommittee": true, 
    "facilityUnit": true, 
    "leader": true, 
    "createdAt": true
  })

  // 处理搜索
  const handleSearch = () => {
    console.log("搜索:", searchTerm)
    // 这里添加搜索逻辑
  }
  
  // 处理AI辅助
  // const handleAIAssist = () => {
  //   // 显示模态框或跳转到AI辅助页面
  //   toast({
  //     title: "AI伦理助手启动中",
  //     description: "正在为您分析伦理项目数据并提供建议..."
  //   })
  // }
  
  // 处理删除项目
  const handleDeleteProject = (id: string) => {
    setCurrentDeleteId(id)
    setDeleteConfirmOpen(true)
  }
  
  // 确认删除项目
  const confirmDelete = () => {
    startLoading()
    
    // 模拟删除操作
    setTimeout(() => {
      setProjects(prev => prev.filter(project => project.id !== currentDeleteId))
      setDeleteConfirmOpen(false)
      stopLoading()
      
      toast({
        title: "删除成功",
        description: "已成功删除该动物伦理项目"
      })
    }, 500)
  }
  
  // 分页项目数据
  const paginatedProjects = projects
  
  // 添加调试日志
  useEffect(() => {
    console.log("当前分页项目数据:", paginatedProjects)
    console.log("视图模式:", viewMode)
    console.log("可见列:", visibleColumns)
  }, [paginatedProjects, viewMode, visibleColumns])
  
  // 快速筛选选项
  const quickFilters = [
    {
      id: "status",
      label: "全部项目状态",
      value: "all",
      category: "status",
      options: [
        { id: "all", label: "全部", value: "all" },
        { id: "inProgress", label: "进行中", value: "进行中" },
        { id: "planning", label: "规划中", value: "规划中" },
        { id: "completed", label: "已完成", value: "已完成" },
        { id: "paused", label: "已暂停", value: "已暂停" }
      ]
    },
    {
      id: "animalType",
      label: "全部动物种系",
      value: "all",
      category: "animalType",
      options: [
        { id: "all", label: "全部", value: "all" },
        { id: "mouse", label: "小鼠", value: "小鼠" },
        { id: "rat", label: "大鼠", value: "大鼠" },
        { id: "rabbit", label: "兔子", value: "兔子" },
        { id: "dog", label: "犬类", value: "犬类" },
        { id: "pig", label: "猪", value: "猪" },
        { id: "monkey", label: "猴", value: "猴" }
      ]
    }
  ]

  // 排序选项
  const sortOptions = [
    { id: "latest", field: "createdAt", direction: "desc" as const, label: "最新创建" },
    { id: "oldest", field: "createdAt", direction: "asc" as const, label: "最早创建" },
    { id: "nameAsc", field: "name", direction: "asc" as const, label: "名称 A-Z" },
    { id: "nameDesc", field: "name", direction: "desc" as const, label: "名称 Z-A" },
    { id: "progressDesc", field: "progress", direction: "desc" as const, label: "进度最高" },
    { id: "progressAsc", field: "progress", direction: "asc" as const, label: "进度最低" }
  ]

  // 高级筛选分类
  const filterCategories = [
    {
      id: "basic",
      title: "基本信息", 
      fields: [
        {
          id: "name",
          label: "项目名称",
          type: "text" as const,
        },
        {
          id: "projectNumber",
          label: "项目编号",
          type: "text" as const,
        },
        {
          id: "source",
          label: "项目来源",
          type: "select" as const,
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
          type: "select" as const,
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
          type: "select" as const,
          options: [
            { label: "全部", value: "all" },
            { label: "待审核", value: "待审核" },
            { label: "审核中", value: "审核中" },
            { label: "审核通过", value: "审核通过" },
            { label: "审核退回", value: "审核退回" },
          ],
        },
      ],
    }
  ]
  
  // 表格列配置
  const tableColumns = [
    {
      id: "projectNumber",
      header: "项目编号",
      accessorKey: "projectNumber" as const,
      cell: (row: any) => row.projectNumber || row.项目编号 || "-",
    },
    {
      id: "name",
      header: "项目名称",
      accessorKey: "name" as const,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.name}</span>
          {row.description && (
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              {row.description}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "animalType",
      header: "动物种系",
      accessorKey: "animalType" as const,
      cell: (row: any) => row.animalType || row.动物种系 || "-",
    },
    {
      id: "animalCount",
      header: "动物数量",
      accessorKey: "animalCount" as const,
      cell: (row: any) => row.animalCount || row.动物数量 || "-",
    },
    {
      id: "ethicsCommittee",
      header: "伦理委员会",
      accessorKey: "ethicsCommittee" as const,
      cell: (row: any) => row.ethicsCommittee || row.伦理委员会 || "医学院伦理审查委员会",
    },
    {
      id: "facilityUnit",
      header: "实验执行单位",
      accessorKey: "facilityUnit" as const,
      cell: (row: any) => row.facilityUnit || row.实验执行单位 || row.动物实施设备单位 || "基础医学实验中心",
    },
    {
      id: "leader",
      header: "负责人",
      accessorKey: "leader" as const,
      cell: (row: any) => row.leader || "-",
    },
    {
      id: "createdAt",
      header: "创建时间",
      accessorKey: "createdAt" as const,
      cell: (row: any) => row.createdAt || "-",
    },
  ]
  
  // 表格行操作
  const customTableActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: any) => router.push(`/ethic-projects/animal/${item.id}`),
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item: any) => router.push(`/ethic-projects/animal/edit/${item.id}`),
    },
    {
      id: "delete",
      label: "删除项目",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: any) => handleDeleteProject(item.id),
      className: "text-red-600 hover:text-red-800",
    },
  ]
  
  // 卡片字段配置
  const cardFields = [
    {
      id: "animalType",
      label: "动物种系",
      value: (item: any) => item.animalType || item.动物种系 || "-",
      className: "",
    },
    {
      id: "animalCount",
      label: "动物数量",
      value: (item: any) => item.animalCount || item.动物数量 || "-",
      className: "",
    },
    {
      id: "ethicsCommittee",
      label: "伦理委员会",
      value: (item: any) => item.ethicsCommittee || item.伦理委员会 || "医学院伦理审查委员会",
      className: "",
    },
    {
      id: "facilityUnit",
      label: "实验执行单位",
      value: (item: any) => item.facilityUnit || item.实验执行单位 || item.动物实施设备单位 || "基础医学实验中心",
      className: "",
    },
  ]
  
  // 卡片操作
  const customCardActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: any) => router.push(`/ethic-projects/animal/${item.id}`),
    },
    {
      id: "upload",
      label: "上传实验数据",
      icon: <Upload className="h-4 w-4" />,
      onClick: (item: any) => {
        router.push(`/ethic-projects/animal/upload/${item.id}`);
      },
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item: any) => router.push(`/ethic-projects/animal/edit/${item.id}`),
    },
    {
      id: "delete",
      label: "删除项目",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: any) => handleDeleteProject(item.id),
      className: "text-red-600 hover:text-red-800",
    },
  ]

  // 处理视图模式变更
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as "grid" | "list");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
        <div
          className="absolute top-0 left-0 right-0 h-[300px] -z-10"
          style={{
            background: "linear-gradient(180deg, rgba(142, 45, 226, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
          }}
        ></div>

        <div>
          <ClientOnly>
            <DataList 
              title="动物伦理"
              data={paginatedProjects}
              onAddNew={() => router.push("/ethic-projects/create/animal")}
              addButtonLabel="新建动物伦理"
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              quickFilters={quickFilters}
              quickFilterValues={filterValues}
              onQuickFilterChange={(filterId: string, value: string) => {
                setFilterValues(prev => ({
                  ...prev,
                  [filterId]: value
                }));
                setCurrentPage(1);
              }}
              sortOptions={sortOptions}
              activeSortOption={sortOption}
              onSortChange={setSortOption}
              defaultViewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              tableColumns={tableColumns}
              tableActions={customTableActions}
              visibleColumns={visibleColumns}
              onVisibleColumnsChange={setVisibleColumns}
              cardFields={cardFields}
              cardActions={customCardActions}
              titleField="name"
              descriptionField="description"
              statusField="status"
              statusVariants={adaptedStatusColors}
              progressField="progress"
              tasksField={{ completed: "tasks.completed", total: "tasks.total" }}
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              categories={filterCategories}
              onItemClick={(item: any) => router.push(`/ethic-projects/animal/${item.id}`)}
              detailsUrlPrefix="/ethic-projects/animal"
              onAdvancedFilter={() => {
                console.log("应用高级筛选")
                setCurrentPage(1)
              }}
              noResultsText="暂无动物伦理项目，您可以点击新建动物伦理按钮创建新的项目，或从模板库中选择"
              customCardRenderer={(item: any, actions: any, isSelected: boolean, onToggleSelect: any) => {
                // 在控制台输出项目信息，确认数据是否正确
                console.log("正在渲染项目:", item);
                
                // 创建包含动物种系、动物数量等数据的项目对象
                const extendedItem = {
                  ...item,
                  动物种系: item.animalType || "大鼠",
                  动物数量: item.animalCount || "45只",
                  伦理委员会: item.ethicsCommittee || "医学院伦理审查委员会",
                  实验执行单位: item.facilityUnit || "基础医学实验中心",
                  进行中: "3",
                  已完成: "1",
                  // 确保成员信息传递
                  members: item.members || []
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
                    type="animal"
                    selected={isSelected}
                    onSelect={onToggleSelect}
                    onClick={() => router.push(`/ethic-projects/animal/${item.id}`)}
                  />
                );
              }}
            />
          </ClientOnly>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除"{currentDeleteId ? projects.find(p => p.id === currentDeleteId)?.name : ''}"吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  删除中...
                </>
              ) : (
                "删除"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 模板库对话框 */}
      {/* <Dialog open={isTemplatesDialogOpen} onOpenChange={setIsTemplatesDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">动物伦理模板库</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-4 hover:border-primary cursor-pointer">
                  <h3 className="font-medium">模板 {i}: 标准动物实验伦理申请</h3>
                  <p className="text-sm text-gray-500 mt-2">适用于常规动物实验研究的伦理审批流程</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  )
} 