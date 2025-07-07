// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ClientOnly from "@/components/client-only"
import DataList from "@/components/data-management/data-list"
import { Eye, Pencil, Trash2, FileText, User } from "lucide-react"
import { mockEthicProjects } from "../data/ethic-project-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { CustomCardWrapper } from "../components"

// 定义项目的接口类型
interface EthicProject {
  id: string;
  projectNumber: string;
  name: string;
  description: string;
  status: string;
  auditStatus: string;
  priority: string;
  type: string;
  source: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: { completed: number; total: number };
  leader: { id: string; name: string; avatar: string };
  members: { id: string; name: string; role: string; avatar?: string }[] | number;
  budget: number;
  isFavorite: boolean;
  animalCount?: number;
}

export default function HumanEthicProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<EthicProject[]>([])
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
  // const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<EthicProject | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    projectNumber: true,
    name: true,
    source: true,
    ethicsCommittee: true,
    researchUnit: true,
    leader: true,
    createdAt: true,
    type: false,
    status: false,
    auditStatus: false,
    progress: true,
    budget: false,
    dates: false,
    members: true,
  })

  // 加载项目数据
  const fetchProjects = async () => {
    setLoading(true)
    
    try {
      // 这里先使用模拟数据，实际项目中应替换为真实API调用
      const filteredProjects = mockEthicProjects.filter(project => {
        // 只显示人体伦理项目
        if (project.type !== "人体伦理") return false;
        
        // 搜索条件
        if (searchTerm && 
            !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // 普通筛选条件
        for (const key in filterValues) {
          const value = filterValues[key];
          if (value && value !== 'all' && key in project && (project as any)[key] !== value) {
            return false;
          }
        }
        
        // 高级筛选条件
        for (const key in seniorFilterValues) {
          const value = seniorFilterValues[key];
          if (value && value !== 'all' && key in project && (project as any)[key] !== value) {
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
  const handleDeleteProject = (project: EthicProject) => {
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



  // 扩展项目数据函数
  const extendProjectData = (item: EthicProject, index: number) => {
    const projectTypes = ["临床试验", "队列研究", "病例对照研究", "横断面研究", "干预性研究"];
    const projectSources = ["国家自然科学基金", "省科技厅项目", "医院科研基金", "企业委托研究", "国际合作项目"];
    const committees = ["医学院伦理审查委员会", "临床研究伦理委员会", "药物临床试验伦理委员会"];
    const departments = ["临床研究中心", "心血管内科", "肿瘤科", "神经内科", "内分泌科"];
    const leaderDepartments = ["医学院", "临床医学院", "基础医学院", "公共卫生学院", "药学院"];

    const getRandomData = (index: number) => {
      const hash = item.id.charCodeAt(0) + index;
      return {
        projectType: projectTypes[hash % projectTypes.length],
        projectSource: projectSources[(hash + 1) % projectSources.length],
        committee: committees[(hash + 2) % committees.length],
        department: departments[(hash + 3) % departments.length],
        leaderDepartment: leaderDepartments[(hash + 4) % leaderDepartments.length],
        inProgress: Math.floor(Math.random() * 6) + 2,
        completed: Math.floor(Math.random() * 4) + 1
      };
    };
    
    const randomData = getRandomData(parseInt(item.id.slice(-2), 16) || 0);
    
    return {
      ...item,
      研究类型: randomData.projectType,
      项目来源: randomData.projectSource,
      伦理委员会: randomData.committee,
      研究执行单位: randomData.department,
      负责人所属单位: randomData.leaderDepartment,
      进行中: randomData.inProgress.toString(),
      已完成: randomData.completed.toString(),
      伦理审查日期: `2023-${(parseInt(item.id.slice(-2), 16) % 12) + 1}-${(parseInt(item.id.slice(0, 2), 16) % 28) + 1}`,
      委员会审批号: `BJEC-2023-${item.id.slice(-3)}`,
      实验目的: "研究新型药物对肿瘤的抑制作用",
      实验方法: "体外细胞培养与动物模型验证",
      动物福利保障: "符合国家实验动物伦理标准"
    };
  };

  // 获取分页数据并扩展
  const paginatedProjects = projects.slice(0, pageSize).map(extendProjectData)

  // 表格列配置
  const tableColumns = [
    {
      id: "projectNumber",
      header: "项目编号",
      accessorKey: "projectNumber",
      cell: (row: EthicProject) => row.projectNumber,
    },
    {
      id: "name",
      header: "项目名称",
      accessorKey: "name",
      cell: (row: EthicProject) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      id: "source",
      header: "项目来源",
      accessorKey: "source",
      cell: (row: EthicProject) => row.source || "-",
    },
    {
      id: "ethicsCommittee",
      header: "伦理委员会",
      accessorKey: "ethicsCommittee",
      cell: (row: any) => row.伦理委员会 || "医学院伦理审查委员会",
    },
    {
      id: "researchUnit",
      header: "研究执行单位",
      accessorKey: "researchUnit",
      cell: (row: any) => row.研究执行单位 || "临床研究中心",
    },
    {
      id: "leader",
      header: "负责人",
      accessorKey: "leader.name",
      cell: (row: EthicProject) => row.leader?.name || "-",
    },
    {
      id: "createdAt",
      header: "创建时间",
      accessorKey: "createdAt",
      cell: (row: EthicProject) => row.startDate || "-",
    },
    {
      id: "status",
      header: "项目状态",
      accessorKey: "status",
      cell: (row: EthicProject) => row.status,
    },
    {
      id: "auditStatus",
      header: "审核状态",
      accessorKey: "auditStatus",
      cell: (row: EthicProject) => row.auditStatus,
    },
    {
      id: "dates",
      header: "项目周期",
      accessorKey: "startDate",
      cell: (row: EthicProject) => `${row.startDate} ~ ${row.endDate}`,
    },
  ]

  // 卡片字段配置
  const cardFields = [
    {
      id: "projectNumber",
      label: "项目编号",
      value: (row: EthicProject) => row.projectNumber,
    },
    {
      id: "type",
              label: "研究类型",
      value: (row: EthicProject) => row.type,
    },
    {
      id: "status",
      label: "项目状态",
      value: (row: EthicProject) => row.status,
    },
    {
      id: "leader",
      label: "负责人",
      value: (row: EthicProject) => row.leader?.name,
    },
    {
      id: "source",
      label: "项目来源",
      value: (row: EthicProject) => row.source || "-",
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
  ]

  // 批量操作配置
  const batchActions = [
    {
      id: "delete",
      label: "批量删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleBatchDelete,
      type: "destructive",
    },
  ]

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchDelete,
    },
  ]

  // AI辅助函数
  // const handleAIAssist = () => {
  //   router.push("/ethic-projects/ai-form")
  // }

  // 自定义卡片操作
  const customCardActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: EthicProject) => {
        // 确保ID是字符串类型
        const itemId = String(item.id);
        console.log("点击查看详情按钮，项目ID:", itemId, "类型:", typeof itemId, "项目名称:", item.name);
        router.push(`/ethic-projects/human/${itemId}`);
      },
    },
    {
      id: "upload",
      label: "上传实验数据",
      icon: <FileText className="h-4 w-4" />,
      onClick: (item: EthicProject) => {
        // 确保ID是字符串类型
        const itemId = String(item.id);
        router.push(`/ethic-projects/human/upload/${itemId}`);
      },
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: EthicProject) => {
        // 确保ID是字符串类型
        const itemId = String(item.id);
        console.log("点击编辑项目按钮，项目ID:", itemId, "类型:", typeof itemId, "项目名称:", item.name);
        
        // 检查模拟数据中是否存在该ID的项目
        const editPath = `/ethic-projects/edit/human/${itemId}`;
        console.log("准备跳转到路径:", editPath);
        
        router.push(editPath);
      },
      disabled: (item: EthicProject) => item.status === "已完成",
    },
    {
      id: "delete",
      label: "删除项目",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteProject,
      variant: "destructive" as "destructive" | "default" | "outline" | "secondary" | "ghost" | "link",
    },
  ]

  // 自定义表格操作
  const customTableActions = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: EthicProject) => {
        // 确保ID是字符串类型
        const itemId = String(item.id);
        console.log("表格视图点击查看详情，项目ID:", itemId, "类型:", typeof itemId);
        router.push(`/ethic-projects/human/${itemId}`);
      },
    },
    {
      id: "edit",
      label: "编辑项目",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: EthicProject) => {
        router.push(`/ethic-projects/edit/human/${item.id}`);
      },
      disabled: (item: EthicProject) => item.status === "已完成",
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
    "进行中": "purple",
    "规划中": "blue",
    "已完成": "green",
    "审核通过": "green",
    "审核中": "purple",
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
            { label: "医学临床研究", value: "医学临床研究" },
            { label: "心理学研究", value: "心理学研究" },
            { label: "社会科学研究", value: "社会科学研究" },
            { label: "教育研究", value: "教育研究" },
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

  // 为customCardRenderer添加类型注解
  const customCardRenderer = (
    item: EthicProject, 
    actions: any[], 
    isSelected: boolean, 
    onToggleSelect: (selected: boolean) => void
  ) => {
    // 获取随机数据
    const getRandomData = (index: number) => {
      // 根据项目ID或索引生成不同的数据
      const projectTypes = ["临床研究", "社会调查", "干预性研究", "观察性研究", "心理学研究"];
      const projectSources = ["院内立项", "国家自然科学基金", "医学发展基金", "卫健委项目", "产学研合作"];
      const committees = ["北京医学伦理委员会", "医学院伦理审查委员会", "临床医学伦理委员会", "公共卫生伦理委员会"];
      const departments = ["内科学系", "外科学系", "神经内科", "精神科", "妇产科", "儿科学系", "公共卫生学院"];
      const leaderDepartments = ["基础医学院", "临床医学院", "公共卫生学院", "药学院", "护理学院", "医学技术学院", "口腔医学院"];
      
      // 使用项目ID的哈希或索引来选择数据
      const hash = item.id.charCodeAt(0) + 0;
      return {
        projectType: projectTypes[hash % projectTypes.length],
        projectSource: projectSources[(hash + 1) % projectSources.length],
        committee: committees[(hash + 2) % committees.length],
        department: departments[(hash + 3) % departments.length],
        leaderDepartment: leaderDepartments[(hash + 4) % leaderDepartments.length],
        inProgress: Math.floor(Math.random() * 6) + 2,
        completed: Math.floor(Math.random() * 4) + 1
      };
    };
    
    // 根据项目ID生成一致的随机数据
    const randomData = getRandomData(parseInt(item.id.slice(-2), 16) || 0);
    
    // 生成成员数据
    const generateMembers = (projectId: string) => {
      const memberNames = [
        "王建国", "李明华", "张丽娟", "陈志强", "刘晓敏", "赵文杰", "孙美玲", "周建军",
        "吴雪梅", "郑春燕", "马文博", "朱红霞", "黄庆华", "于海洋", "徐丽君", "胡金涛",
        "梁建强", "罗文慧", "高艳萍", "田小军", "魏志明", "冯春丽", "向明远", "邵建华"
      ];
      
      const roles = ["主治医师", "副主任医师", "主任医师", "研究员", "助理研究员", "博士后研究员"];
      
      const hash = projectId.charCodeAt(0) + projectId.charCodeAt(projectId.length - 1);
      const memberCount = (hash % 4) + 2; // 2-5个成员
      
      const members = [];
      for (let i = 0; i < memberCount; i++) {
        const nameIndex = (hash + i * 3) % memberNames.length;
        const roleIndex = (hash + i * 7) % roles.length;
        members.push({
          id: `member-${projectId}-${i}`,
          name: memberNames[nameIndex],
          role: roles[roleIndex]
        });
      }
      
      return members;
    };

    // 扩展item对象添加额外的人体研究相关字段
    const extendedItem = {
      ...item,
      研究类型: randomData.projectType,
      项目来源: randomData.projectSource,
      伦理委员会: randomData.committee,
      研究执行单位: randomData.department,
      负责人所属单位: randomData.leaderDepartment,
      进行中: randomData.inProgress.toString(),
      已完成: randomData.completed.toString(),
      伦理审查日期: `2023-${(parseInt(item.id.slice(-2), 16) % 12) + 1}-${(parseInt(item.id.slice(0, 2), 16) % 28) + 1}`,
      委员会审批号: `BJEC-2023-${item.id.slice(-3)}`,
      实验目的: "研究新型药物对肿瘤的抑制作用",
      实验方法: "体外细胞培养与动物模型验证",
      动物福利保障: "符合国家实验动物伦理标准",
      members: generateMembers(item.id)
    };

    // 输出扩展后的项目对象，方便调试
    console.log(`渲染卡片: 项目ID=${extendedItem.id}, 项目名称=${extendedItem.name}`);
    console.log(`扩展的字段: 研究类型=${extendedItem.研究类型}, 项目来源=${extendedItem.项目来源}`);

    // 确保ID是字符串类型
    const itemId = String(item.id);

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
        detailsUrl={`/ethic-projects/human/${itemId}`}
        className=""
        selected={isSelected}
        onSelect={onToggleSelect}
        onClick={() => {
          console.log("卡片点击: 项目ID=", itemId, "类型:", typeof itemId);
          router.push(`/ethic-projects/human/${itemId}`);
        }}
        type="human"
      />
    );
  };

  // 渲染页面
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
              // @ts-ignore
              title="人体伦理" 
              data={paginatedProjects}
              onAddNew={() => router.push("/ethic-projects/create/human")}
              addButtonLabel="新建人体伦理"
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              quickFilters={quickFilters.map(filter => ({
                ...filter,
                options: filter.options || [],
                value: "all",
                category: filter.id
              }))}
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
              onViewModeChange={setViewMode}
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
              priorityField="priority"
              progressField="progress"
              tasksField={{ completed: "tasks.completed", total: "tasks.total" }}
              teamSizeField="members"
              pageSize={pageSize}
              currentPage={currentPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              batchActions={configuredBatchActions}
              onItemClick={(item: EthicProject) => {
                const itemId = String(item.id);
                console.log("DataList onItemClick: 项目ID=", itemId, "类型:", typeof itemId);
                router.push(`/ethic-projects/human/${itemId}`);
              }}
              detailsUrlPrefix="/ethic-projects/human"
              categories={filterCategories}
              seniorFilterValues={seniorFilterValues}
              onAdvancedFilter={(filterValues: Record<string, any>) => {
                setSeniorFilterValues(prev => ({
                  ...prev,
                  ...filterValues
                }));
                setCurrentPage(1);
              }}
              customCardRenderer={customCardRenderer}
            />
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