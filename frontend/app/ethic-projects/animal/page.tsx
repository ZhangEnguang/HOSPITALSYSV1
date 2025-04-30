"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, BriefcaseMedical, Database, FileText, MousePointer2 } from "lucide-react"

import DataList from "@/components/data-management/data-list"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ClientOnly from "@/components/client-only"
import CustomCardWrapper from "@/components/ethic-project-card"
import { adaptedStatusColors } from "@/app/ethic-projects/config/status-colors"
import { useLoading } from "@/hooks/use-loading"
import { useToast } from "@/components/ui/use-toast"

// 动物伦理项目页面组件
export default function AnimalEthicProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoading, startLoading, stopLoading } = useLoading()
  
  // 模板对话框状态
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false)
  
  // 删除确认对话框状态
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [currentDeleteId, setCurrentDeleteId] = useState("")
  
  // 项目数据
  const [projects, setProjects] = useState<any[]>([
    {
      id: "1",
      name: "转基因小鼠模型对阿尔茨海默病的研究",
      description: "利用转基因小鼠模型研究新型抗阿尔茨海默病脑部病理改变的临床疗效效果",
      status: "进行中",
      progress: 65,
      type: "动物伦理",
      tasks: { completed: 2, total: 5 },
      animalType: "小鼠",
      animalCount: "120",
      leader: "张教授",
      department: "神经科学系",
      createdAt: "2023-10-15"
    },
    {
      id: "2",
      name: "狗肾脏器官移植研究动物伦理评价",
      description: "研究大型哺乳动物器官移植手术方案及术后护理标准，评估动物伦理合规性",
      status: "进行中",
      progress: 45,
      type: "动物伦理",
      tasks: { completed: 3, total: 8 },
      animalType: "犬类",
      animalCount: "15",
      leader: "李主任",
      department: "器官移植研究中心",
      createdAt: "2023-09-20"
    },
    {
      id: "3",
      name: "猪心脏移植术后神经系统变化研究",
      description: "研究猪心脏脏移植术后神经系统变化规律，分析相关生理发症机制",
      status: "进行中",
      progress: 30,
      type: "动物伦理",
      tasks: { completed: 1, total: 4 },
      animalType: "猪",
      animalCount: "8",
      leader: "王研究员",
      department: "心血管研究所",
      createdAt: "2023-11-05"
    },
    {
      id: "4",
      name: "犬眼科药物治疗方案动物伦理评价",
      description: "研究大型哺乳动物眼科新药治疗方案，制定动物伦理标准并制定保障措施",
      status: "已完成",
      progress: 100,
      type: "动物伦理",
      tasks: { completed: 5, total: 5 },
      animalType: "犬类", 
      animalCount: "25",
      leader: "刘研究员",
      department: "药理学教研室",
      createdAt: "2023-08-10"
    },
    {
      id: "5",
      name: "兔耳神经损伤修复实验方案伦理审查",
      description: "研究兔耳神经损伤修复的实验方案，制定相关伦理标准并动物福利保障",
      status: "规划中",
      progress: 10,
      type: "动物伦理",
      tasks: { completed: 0, total: 3 },
      animalType: "兔子",
      animalCount: "30",
      leader: "孙博士",
      department: "神经外科研究所",
      createdAt: "2023-12-01"
    },
    {
      id: "6",
      name: "啮齿类动物神经影像学实验标准制定",
      description: "研究啮齿类动物神经影像学实验的标准流程，评估伦理风险与动物福利",
      status: "已完成",
      progress: 100,
      type: "动物伦理",
      tasks: { completed: 7, total: 7 },
      animalType: "大鼠",
      animalCount: "245",
      leader: "陈教授",
      department: "影像医学中心",
      createdAt: "2023-07-15"
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
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  
  // 表格列可见性
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name", "status", "animalType", "animalCount", "leader", "department", "createdAt"
  ])
  
  // 处理搜索
  const handleSearch = () => {
    console.log("搜索:", searchTerm)
    // 这里添加搜索逻辑
  }
  
  // 处理AI辅助
  const handleAIAssist = () => {
    // 显示模态框或跳转到AI辅助页面
    toast({
      title: "AI伦理助手启动中",
      description: "正在为您分析伦理项目数据并提供建议..."
    })
  }
  
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
  
  // 快速筛选选项
  const quickFilters = [
    {
      id: "status",
      label: "全部项目状态",
      options: [
        { label: "全部", value: "all" },
        { label: "进行中", value: "进行中" },
        { label: "规划中", value: "规划中" },
        { label: "已完成", value: "已完成" },
        { label: "已暂停", value: "已暂停" }
      ]
    },
    {
      id: "animalType",
      label: "全部动物种类",
      options: [
        { label: "全部", value: "all" },
        { label: "小鼠", value: "小鼠" },
        { label: "大鼠", value: "大鼠" },
        { label: "兔子", value: "兔子" },
        { label: "犬类", value: "犬类" },
        { label: "猪", value: "猪" },
        { label: "猴", value: "猴" }
      ]
    }
  ]
  
  // 排序选项
  const sortOptions = [
    { label: "最新创建", value: "latest" },
    { label: "最早创建", value: "oldest" },
    { label: "名称 A-Z", value: "nameAsc" },
    { label: "名称 Z-A", value: "nameDesc" },
    { label: "进度最高", value: "progressDesc" },
    { label: "进度最低", value: "progressAsc" }
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
    }
  ]
  
  // 表格列配置
  const tableColumns = [
    {
      id: "name",
      label: "项目名称",
      renderCell: (item: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.name}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      label: "状态",
      renderCell: (item: any) => (
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-block ${
          adaptedStatusColors[item.status] || "bg-gray-100 text-gray-800"
        }`}>
          {item.status}
        </div>
      ),
    },
    {
      id: "animalType",
      label: "动物种类",
      renderCell: (item: any) => (
        <div className="flex items-center">
          <MousePointer2 className="h-4 w-4 text-blue-500 mr-2" />
          <span>{item.animalType}</span>
        </div>
      ),
    },
    {
      id: "animalCount",
      label: "动物数量",
      renderCell: (item: any) => (
        <div className="flex items-center">
          <Database className="h-4 w-4 text-blue-500 mr-2" />
          <span>{item.animalCount}只</span>
        </div>
      ),
    },
    {
      id: "leader",
      label: "负责人",
      renderCell: (item: any) => item.leader,
    },
    {
      id: "department",
      label: "所属部门",
      renderCell: (item: any) => (
        <div className="flex items-center">
          <Building2 className="h-4 w-4 text-blue-500 mr-2" />
          <span>{item.department}</span>
        </div>
      ),
    },
    {
      id: "createdAt",
      label: "创建时间",
      renderCell: (item: any) => item.createdAt,
    },
  ]
  
  // 表格行操作
  const customTableActions = [
    {
      label: "查看详情",
      onClick: (item: any) => router.push(`/ethic-projects/${item.id}`),
    },
    {
      label: "创建审查",
      onClick: (item: any) => router.push(`/ethic-projects/${item.id}/review/new`),
    },
    {
      label: "删除",
      onClick: (item: any) => handleDeleteProject(item.id),
      className: "text-red-600 hover:text-red-800",
    },
  ]
  
  // 卡片字段配置
  const cardFields = [
    {
      id: "animalType",
      label: "动物种类",
      icon: <MousePointer2 className="h-4 w-4 text-blue-500" />,
      displayValue: (item: any) => item.animalType,
    },
    {
      id: "animalCount",
      label: "动物数量",
      icon: <FileText className="h-4 w-4 text-blue-500" />,
      displayValue: (item: any) => `${item.animalCount}只`,
    },
    {
      id: "department",
      label: "所属部门",
      icon: <Building2 className="h-4 w-4 text-blue-500" />,
      displayValue: (item: any) => item.department,
    },
    {
      id: "facilityUnit",
      label: "实施单位",
      icon: <BriefcaseMedical className="h-4 w-4 text-blue-500" />,
      displayValue: (item: any) => "基础医学实验中心",
    },
  ]
  
  // 卡片操作
  const customCardActions = [
    {
      label: "查看详情",
      onClick: (item: any) => router.push(`/ethic-projects/${item.id}`),
    },
    {
      label: "创建审查",
      onClick: (item: any) => router.push(`/ethic-projects/${item.id}/review/new`),
    },
    {
      label: "删除",
      onClick: (item: any) => handleDeleteProject(item.id),
      className: "text-red-600 hover:text-red-800",
    },
  ]

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
            {React.createElement(DataList as any, {
              title: "动物伦理", 
              data: paginatedProjects,
              onAddNew: () => router.push("/ethic-projects/create/animal"),
              addButtonLabel: "新建动物伦理",
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
              progressField: "progress",
              tasksField: { completed: "tasks.completed", total: "tasks.total" },
              pagination: {
                currentPage: currentPage,
                pageSize: pageSize,
                totalItems: totalItems,
                onPageChange: setCurrentPage,
                onPageSizeChange: setPageSize
              },
              advancedFilters: {
                categories: filterCategories,
                onApply: () => {
                  console.log("应用高级筛选")
                  setCurrentPage(1)
                }
              },
              emptyState: {
                title: "暂无动物伦理项目",
                description: "您可以创建新的动物伦理项目或从模板库中选择",
                icon: <FileText className="h-10 w-10 text-muted-foreground" />,
              },
              type: "animal",
              customCardRenderer: (item, actions, isSelected, onToggleSelect) => {
                // 创建包含动物种系、动物数量等数据的项目对象
                const extendedItem = {
                  ...item,
                  动物种系: item.animalType || "大鼠",
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
                    type="animal"
                  />
                );
              }
            })}
          </ClientOnly>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium">确认删除</h3>
            <p className="text-sm text-gray-500">
              您确定要删除此动物伦理项目吗？此操作无法撤销。
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 模板库对话框 */}
      <Dialog open={isTemplatesDialogOpen} onOpenChange={setIsTemplatesDialogOpen}>
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
      </Dialog>
    </div>
  )
} 