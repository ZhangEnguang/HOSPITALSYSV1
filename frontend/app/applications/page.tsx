"use client"

import React, { useCallback, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { ClipboardList, Download, ExternalLink, FilePlus, FileUp, Filter, Link, MoreHorizontal, MoreVertical, RefreshCcw, Table2, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  batchActions,
  statusColors,
} from "./config/applications-config"
import { extendedApplicationItems } from "./data/applications-data"
import {
  ChevronDown,
  ChevronRight,
  Play,
  Edit,
  Trash,
  CheckCircle,
  Eye,
  Search,
  SlidersHorizontal,
  ArrowRight,
  CheckSquare,
  X,
  Info,
  FileCheck,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataListPagination from "@/components/data-management/data-list-pagination"
import DataListBatchActions from "@/components/data-management/data-list-batch-actions"
import DataListHeader from "@/components/data-management/data-list-header"
import DataListFilters from "@/components/data-management/data-list-filters"
import { ProjectReviewDrawer } from "@/components/project-review-drawer"
import { ExpertAssignmentDrawer } from "@/components/expert-assignment-drawer"
import { TemplatesDialog } from "./components/templates-dialog"
import { ApplicationCardView } from "./components/application-card-view"
import { ReviewCardView } from "./components/review-card-view"
import { BatchEditDialog } from "./components/batch-edit-dialog"
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
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { ApplicationItem, ProjectItem, ProjectManager } from './types'
import { ReviewBatchTable } from "./components/review-batch-table"
import { ApplicationBatchTable } from "./components/application-batch-table"

// 使用 Record 类型定义颜色映射
const applicationTypeColors: Record<ApplicationItem['type'], 'default' | 'secondary' | 'outline'> = {
  '科研': 'default',
  '教学': 'secondary',
  '其他': 'outline'
}

const applicationStatusColors: Record<ApplicationItem['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  '待审核': 'secondary',
  '审核中': 'default',
  '已通过': 'outline',
  '已拒绝': 'destructive'
}

// 高校科研相关的项目名称和描述生成函数
const generateResearchProjectData = (batchName: string, batchType: string, batchCategory: string) => {
  // 根据批次类型和类别生成相关的项目名称
  const projectNamesByCategory: Record<string, string[]> = {
    自然科学: [
      "基于量子计算的密码学安全性研究",
      "新型二维材料的电子结构与物理性质研究",
      "复杂系统的非线性动力学行为研究",
      "高温超导体的微观机理探索",
      "宇宙暗物质探测新方法研究",
      "拓扑绝缘体的量子输运特性研究",
      "量子纠缠与量子信息处理技术研究",
      "引力波探测技术与数据分析方法研究",
    ],
    工程技术: [
      "新一代人工智能芯片架构设计与优化",
      "高效太阳能电池关键材料与器件研究",
      "智能电网安全与稳定控制技术研究",
      "新型储能材料与系统集成技术研究",
      "智能制造系统关键技术与应用研究",
      "高性能计算与大数据处理技术研究",
      "新型传感器网络与物联网技术研究",
      "先进轨道交通装备与系统技术研究",
    ],
    农业科学: [
      "作物抗逆性分子机制与品种改良研究",
      "农业生态系统碳循环与碳汇增强技术研究",
      "农作物病虫害绿色防控技术研究",
      "农业废弃物资源化利用技术研究",
      "智慧农业关键技术与装备研发",
      "农产品质量安全控制与溯源技术研究",
      "耕地质量提升与土壤修复技术研究",
      "农业水资源高效利用技术研究",
    ],
    医药科学: [
      "新型冠状病毒变异机制与疫苗研发",
      "肿瘤免疫治疗新靶点与新策略研究",
      "神经退行性疾病发病机制与干预研究",
      "新型抗生素研发与耐药机制研究",
      "精准医疗关键技术与临床应用研究",
      "中药现代化与创新药物研发",
      "生物医学影像新技术与临床应用研究",
      "再生医学与组织工程技术研究",
    ],
    人文社科: [
      "数字经济发展与社会变迁研究",
      "中国传统文化创新传承与国际传播研究",
      "区域协调发展与乡村振兴战略研究",
      "高等教育改革与人才培养模式创新研究",
      "全球治理变革与中国参与研究",
      "数字化时代教育变革与创新研究",
      "社会治理现代化与公共服务创新研究",
      "文化遗产保护与文化产业发展研究",
    ],
    教育科学: [
      "智能时代教育教学模式创新研究",
      "高校思政教育创新与实践研究",
      "教育公平与优质教育资源均衡配置研究",
      "学科交叉融合与创新人才培养研究",
      "在线教育与混合式教学模式研究",
      "教育评价改革与质量保障体系研究",
      "产教融合与应用型人才培养模式研究",
      "国际教育合作与人才培养研究",
    ],
    其他: [
      "跨学科交叉研究方法与应用",
      "科技伦理与科研诚信建设研究",
      "科技成果转化与产学研协同创新研究",
      "科研评价体系改革与创新研究",
      "学术期刊建设与国际影响力提升研究",
      "科研团队建设与人才培养研究",
      "科研管理信息化与智能化研究",
      "科技创新政策与制度研究",
    ],
  }

  const projectDescriptionsByCategory: Record<string, string[]> = {
    自然科学: [
      "探索量子计算对现有密码体系的影响，研究后量子密码学的发展方向。",
      "研究新型二维材料的电子结构特性，探索其在电子器件中的应用潜力。",
      "研究复杂系统中的非线性动力学行为，建立预测和控制模型。",
      "探索高温超导体的微观机理，寻找室温超导的可能性。",
      "开发新型暗物质探测方法，提高探测灵敏度和准确性。",
      "研究拓扑绝缘体的量子输运特性，探索其在量子计算中的应用。",
      "研究量子纠缠现象及其在量子信息处理中的应用技术。",
      "研发引力波探测新技术，优化数据分析方法提高探测精度。",
    ],
    工程技术: [
      "设计新一代人工智能专用芯片架构，提高计算效率和能效比。",
      "研发高效太阳能电池材料与器件，提高光电转换效率。",
      "研究智能电网安全防护技术，提高电网稳定性和可靠性。",
      "开发新型储能材料与系统，提高能量密度和循环寿命。",
      "研究智能制造关键技术，推动制造业数字化转型。",
      "研发高性能计算架构与大数据处理算法，提高数据处理效率。",
      "开发新型传感器网络技术，推动物联网应用发展。",
      "研究先进轨道交通装备与系统，提高运行效率和安全性。",
    ],
    农业科学: [
      "研究作物抗逆性的分子机制，培育抗逆性强的新品种。",
      "研究农业生态系统碳循环规律，开发碳汇增强技术。",
      "开发农作物病虫害绿色防控技术，减少化学农药使用。",
      "研究农业废弃物高值化利用技术，促进循环农业发展。",
      "开发智慧农业技术与装备，提高农业生产效率。",
      "研究农产品质量安全控制技术，建立全程溯源体系。",
      "开发耕地质量提升与土壤修复技术，保障粮食安全。",
      "研究农业水资源高效利用技术，提高水资源利用效率。",
    ],
    医药科学: [
      "研究新冠病毒变异规律，开发针对变异株的新型疫苗。",
      "探索肿瘤免疫治疗新靶点，开发新型免疫治疗策略。",
      "研究神经退行性疾病发病机制，探索早期干预方法。",
      "开发新型抗生素，研究细菌耐药机制与防控策略。",
      "研发精准医疗关键技术，推动个体化治疗方案应用。",
      "研究中药现代化技术，开发创新中药制剂。",
      "开发生物医学影像新技术，提高疾病诊断精准度。",
      "研究再生医学与组织工程技术，促进损伤组织修复。",
    ],
    人文社科: [
      "研究数字经济发展对社会结构和生活方式的影响。",
      "探索中国传统文化创新传承路径与国际传播策略。",
      "研究区域协调发展政策与乡村振兴实施路径。",
      "探索高等教育改革方向与创新人才培养模式。",
      "研究全球治理体系变革趋势与中国参与策略。",
      "探索数字化时代教育变革路径与创新模式。",
      "研究社会治理现代化路径与公共服务创新方式。",
      "探索文化遗产保护方法与文化产业发展策略。",
    ],
    教育科学: [
      "研究智能技术在教育教学中的应用与创新模式。",
      "探索高校思政教育创新路径与实践方法。",
      "研究教育资源均衡配置策略，促进教育公平。",
      "探索学科交叉融合教育模式，培养创新型人才。",
      "研究在线教育与混合式教学的效果与优化策略。",
      "探索教育评价改革路径，构建质量保障体系。",
      "研究产教融合模式，培养应用型人才。",
      "探索国际教育合作新模式，培养国际化人才。",
    ],
    其他: [
      "探索跨学科研究方法论，促进学科交叉融合。",
      "研究科技伦理规范与科研诚信建设策略。",
      "探索科技成果转化机制，促进产学研协同创新。",
      "研究科研评价体系改革路径，激发创新活力。",
      "探索学术期刊建设策略，提升国际影响力。",
      "研究科研团队建设与人才培养机制。",
      "探索科研管理信息化与智能化路径。",
      "研究科技创新政策与制度优化策略。",
    ],
  }

  // 根据批次名称提取关键词，用于生成更相关的项目名称
  let keywords: string[] = []
  if (batchName.includes("自然科学基金")) {
    keywords = ["基础研究", "前沿探索", "原创性", "科学发现"]
  } else if (batchName.includes("重点研发计划")) {
    keywords = ["关键技术", "重大突破", "系统集成", "示范应用"]
  } else if (batchName.includes("青年")) {
    keywords = ["创新思维", "探索性", "人才培养", "学术新秀"]
  } else if (batchName.includes("社会科学") || batchName.includes("人文社科")) {
    keywords = ["社会发展", "文化传承", "理论创新", "实践探索"]
  } else {
    keywords = ["科技创新", "应用研究", "成果转化", "产学研合作"]
  }

  // 随机选择一个项目名称和描述
  const categoryNames = projectNamesByCategory[batchCategory] || projectNamesByCategory["其他"]
  const categoryDescriptions = projectDescriptionsByCategory[batchCategory] || projectDescriptionsByCategory["其他"]
  const randomIndex = Math.floor(Math.random() * categoryNames.length)
  const projectName = categoryNames[randomIndex]
  const projectDescription = categoryDescriptions[randomIndex]

  // 添加批次关键词，增强关联性
  const keyword = keywords[Math.floor(Math.random() * keywords.length)]
  const enhancedDescription = `${projectDescription} 本项目属于${batchName}支持的${keyword}方向。`

  return {
    name: projectName,
    description: enhancedDescription,
  }
}

// 高校科研相关的部门和职称
const academicDepartments = [
  "物理学院",
  "化学学院",
  "生命科学学院",
  "材料科学与工程学院",
  "电子信息学院",
  "计算机科学与技术学院",
  "机械工程学院",
  "土木工程学院",
  "环境科学与工程学院",
  "医学院",
  "药学院",
  "公共卫生学院",
  "经济管理学院",
  "人文学院",
  "社会科学学院",
  "法学院",
  "教育学院",
  "外国语学院",
  "艺术学院",
  "体育学院",
]

const academicTitles = ["教授", "副教授", "讲师", "助理教授", "特聘教授", "杰出教授", "青年研究员", "研究员"]

// 生成研究人员姓名
const generateResearcher = () => {
  const surnames = [
    "张",
    "李",
    "王",
    "赵",
    "陈",
    "刘",
    "杨",
    "黄",
    "周",
    "吴",
    "郑",
    "孙",
    "马",
    "朱",
    "胡",
    "林",
    "郭",
    "何",
    "高",
    "罗",
  ]
  const names = [
    "明",
    "华",
    "强",
    "伟",
    "勇",
    "芳",
    "娜",
    "静",
    "秀英",
    "建国",
    "建华",
    "文",
    "军",
    "杰",
    "涛",
    "磊",
    "刚",
    "丽",
    "洁",
    "艳",
  ]

  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]

  return surname + name
}

export default function ApplicationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [applicationItems, setApplicationItems] = useState(extendedApplicationItems)
  const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({})
  const [batchProjects, setBatchProjects] = useState<Record<string, any[]>>({})
  const [activeTab, setActiveTab] = useState<"application" | "review" | "result">("application")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("deadline_asc")
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    type: true,
    category: true,
    status: true,
    amount: true,
    progress: true,
    date: true,
    deadline: true,
    projectCount: true,
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  // 审核抽屉状态
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // 专家分派抽屉状态
  const [expertAssignmentDrawerOpen, setExpertAssignmentDrawerOpen] = useState(false)
  const [selectedProjectForExperts, setSelectedProjectForExperts] = useState<any>(null)
  // 在ApplicationsPage组件内，在专家分派抽屉状态之后添加意见汇总抽屉状态
  const [opinionSummaryDrawerOpen, setOpinionSummaryDrawerOpen] = useState(false)
  const [selectedProjectForOpinions, setSelectedProjectForOpinions] = useState<any>(null)

  // 添加模板库对话框状态
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false)

  // 添加状态控制编辑对话框
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)

  // 添加确认对话框状态
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmTitle, setConfirmTitle] = useState("")
  const [confirmDescription, setConfirmDescription] = useState("")
  const [confirmActionText, setConfirmActionText] = useState("确定")
  
  // 添加提示对话框状态
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertTitle, setAlertTitle] = useState("")
  const [alertDescription, setAlertDescription] = useState("")
  
  // 显示确认对话框的函数
  const showConfirmDialog = (title: string, description: string, actionText: string, action: () => void) => {
    setConfirmTitle(title)
    setConfirmDescription(description)
    setConfirmActionText(actionText)
    setConfirmAction(() => action)
    setConfirmDialogOpen(true)
  }
  
  // 显示提示对话框的函数
  const showAlertDialog = (title: string, description: string) => {
    setAlertTitle(title)
    setAlertDescription(description)
    setAlertDialogOpen(true)
  }
  
  // 从URL查询参数中读取并设置活动标签页
  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam === 'application' || tabParam === 'review' || tabParam === 'result') {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // 模拟获取批次下的项目数据
  useEffect(() => {
    // 为每个批次生成模拟项目数据
    const mockBatchProjects: Record<string, any[]> = {}

    applicationItems.forEach((batch) => {
      const projectCount = batch.projectCount || 0
      const projects = []

      for (let i = 0; i < projectCount; i++) {
        // 生成与批次相关的科研项目数据
        const projectData = generateResearchProjectData(batch.name, batch.type, batch.category)

        // 生成研究人员信息
        const researcherName = generateResearcher()
        const department = academicDepartments[Math.floor(Math.random() * academicDepartments.length)]
        const title = academicTitles[Math.floor(Math.random() * academicTitles.length)]

        // 计算项目金额，使其更合理
        const baseAmount = batch.amount / projectCount // 基础金额
        const variationFactor = 0.5 + Math.random() // 变化因子，0.5-1.5之间
        const projectAmount = Number((baseAmount * variationFactor).toFixed(2))

        // 生成项目状态，使其分布更合理
        let projectStatus
        const statusRandom = Math.random()
        if (batch.batch === "申报批次") {
          if (statusRandom < 0.2) {
            projectStatus = "准备中"
          } else if (statusRandom < 0.4) {
            projectStatus = "待审核"
          } else if (statusRandom < 0.6) {
            projectStatus = "已通过"
          } else if (statusRandom < 0.75) {
            projectStatus = "已退回"
          } else if (statusRandom < 0.9) {
            projectStatus = "评审中"
          } else {
            projectStatus = "已立项"
          }
        } else {
          // 评审批次的项目状态
          if (statusRandom < 0.3) {
            projectStatus = "待审核"
          } else if (statusRandom < 0.5) {
            projectStatus = "评审中"
          } else if (statusRandom < 0.8) {
            projectStatus = "已通过"
          } else if (statusRandom < 0.9) {
            projectStatus = "已退回"
          } else {
            projectStatus = "已立项"
          }
        }

        // 生成项目进度，与状态相关联
        let progress = 0
        if (projectStatus === "准备中") {
          progress = Math.floor(Math.random() * 30)
        } else if (projectStatus === "待审核" || projectStatus === "评审中") {
          progress = 30 + Math.floor(Math.random() * 40)
        } else if (projectStatus === "已通过" || projectStatus === "已退回") {
          progress = 70 + Math.floor(Math.random() * 20)
        } else if (projectStatus === "已立项") {
          progress = 90 + Math.floor(Math.random() * 10)
        }

        // 生成申请日期（在批次开始日期附近，但不早于开始日期）
        const batchStartDate = new Date(batch.date);
        const randomDaysOffset = Math.floor(Math.random() * 14); // 0-14天的随机偏移
        const applyDate = new Date(batchStartDate);
        applyDate.setDate(batchStartDate.getDate() + randomDaysOffset);
        
        projects.push({
          id: `${batch.id}-project-${i + 1}`,
          name: projectData.name,
          description: projectData.description,
          type: batch.type,
          category: batch.category,
          amount: projectAmount,
          progress: progress,
          date: batch.date,
          deadline: batch.deadline,
          batchNumber: batch.batchNumber,
          status: projectStatus,
          batch: batch.batch, // 添加批次类型，用于区分申报批次和评审批次
          applyDate: applyDate.toISOString().split('T')[0], // 添加申请日期
          manager: {
            id: Math.floor(Math.random() * 100) + 1,
            name: researcherName,
            department: department,
            title: title,
          },
          expertCount: batch.batch === "评审批次" ? Math.floor(Math.random() * 3) + 1 : 0, // 评审批次才有专家数量
        })
      }

      mockBatchProjects[batch.id] = projects
    })

    setBatchProjects(mockBatchProjects)
  }, [applicationItems])

  // 切换批次展开/折叠状态
  const toggleBatchExpand = (batchId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setExpandedBatches((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))
  }

  // 过滤和排序数据 - 将原来的代码拆分为两个分别针对申报批次和评审批次的过滤方法
  const filteredApplicationBatches = applicationItems
    .filter((item) => {
      // 只筛选申报批次
      if (item.batch !== "申报批次") return false;

      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // 快速筛选
      if (filterValues.status && filterValues.status !== "all") {
        const now = new Date();
        const startDate = new Date(item.date);
        const endDate = new Date(item.deadline);
        
        let currentStatus = "未开始";
        if (now > endDate) {
          currentStatus = "已结束";
        } else if (now >= startDate) {
          currentStatus = "进行中";
        }
        
        if (filterValues.status !== currentStatus) {
          return false;
        }
      }

      if (filterValues.type && filterValues.type !== "all" && item.type !== filterValues.type) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 首先根据状态排序：进行中 > 未开始 > 已结束
      const now = new Date();
      
      const aStartDate = new Date(a.date);
      const aEndDate = new Date(a.deadline);
      let aStatus = 0; // 默认未开始
      if (now > aEndDate) {
        aStatus = 2; // 已结束
      } else if (now >= aStartDate) {
        aStatus = -1; // 进行中（最高优先级）
      }
      
      const bStartDate = new Date(b.date);
      const bEndDate = new Date(b.deadline);
      let bStatus = 0; // 默认未开始
      if (now > bEndDate) {
        bStatus = 2; // 已结束
      } else if (now >= bStartDate) {
        bStatus = -1; // 进行中（最高优先级）
      }
      
      // 如果状态不同，按状态排序
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }
      
      // 状态相同时，再按照选择的排序选项排序
      switch (sortOption) {
        case "deadline_asc":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "deadline_desc":
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount_asc":
          return a.amount - b.amount;
        case "amount_desc":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  // 过滤评审批次数据
  const filteredReviewBatches = applicationItems
    .filter((item) => {
      // 只筛选评审批次
      if (item.batch !== "评审批次") return false;
      
      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // 快速筛选
      if (filterValues.status && filterValues.status !== "all") {
        const now = new Date();
        const startDate = new Date(item.date);
        const endDate = new Date(item.deadline);
        
        let currentStatus = "未开始";
        if (now > endDate) {
          currentStatus = "已结束";
        } else if (now >= startDate) {
          currentStatus = "进行中";
        }
        
        if (filterValues.status !== currentStatus) {
          return false;
        }
      }

      if (filterValues.type && filterValues.type !== "all" && item.type !== filterValues.type) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 首先根据状态排序：进行中 > 未开始 > 已结束
      const now = new Date();
      
      const aStartDate = new Date(a.date);
      const aEndDate = new Date(a.deadline);
      let aStatus = 0; // 默认未开始
      if (now > aEndDate) {
        aStatus = 2; // 已结束
      } else if (now >= aStartDate) {
        aStatus = -1; // 进行中（最高优先级）
      }
      
      const bStartDate = new Date(b.date);
      const bEndDate = new Date(b.deadline);
      let bStatus = 0; // 默认未开始
      if (now > bEndDate) {
        bStatus = 2; // 已结束
      } else if (now >= bStartDate) {
        bStatus = -1; // 进行中（最高优先级）
      }
      
      // 如果状态不同，按状态排序
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }
      
      // 状态相同时，再按照选择的排序选项排序
      switch (sortOption) {
        case "deadline_asc":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "deadline_desc":
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount_asc":
          return a.amount - b.amount;
        case "amount_desc":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  // 分页数据 - 根据当前活动的标签页选择对应的数据源
  const paginatedItems = activeTab === "application" 
    ? filteredApplicationBatches.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredReviewBatches.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 处理批量操作
  const handleBatchSubmit = () => {
    setApplicationItems(
      applicationItems.map((item) =>
        selectedRows.includes(item.id) && (item.status === "准备中" || item.status === "修改中")
          ? {
              ...item,
              status: "已提交",
              progress: 80,
              submissionDate: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchApprove = () => {
    setApplicationItems(
      applicationItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "已提交"
          ? {
              ...item,
              status: "已通过",
              progress: 100,
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchReject = () => {
    setApplicationItems(
      applicationItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "已提交"
          ? {
              ...item,
              status: "已拒绝",
              progress: 100,
              approvalDate: new Date().toISOString().split("T")[0],
              rejectionReason: "批量操作：不符合申报要求",
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setApplicationItems(applicationItems.filter((item) => !selectedRows.includes(item.id)))
    setSelectedRows([])
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchSubmit,
      disabled: !selectedRows.some((id) => {
        const item = applicationItems.find((item) => item.id === id)
        return item && (item.status === "准备中" || item.status === "修改中")
      }),
    },
    {
      ...batchActions[1],
      onClick: handleBatchApprove,
      disabled: !selectedRows.some((id) => {
        const item = applicationItems.find((item) => item.id === id)
        return item && item.status === "已提交"
      }),
    },
    {
      ...batchActions[2],
      onClick: handleBatchReject,
      disabled: !selectedRows.some((id) => {
        const item = applicationItems.find((item) => item.id === id)
        return item && item.status === "已提交"
      }),
    },
    {
      ...batchActions[3],
      onClick: handleBatchDelete,
    },
  ]

  // 配置标签页
  const tabs = [
    {
      id: "application",
      label: "申报批次",
      count: applicationItems.filter((item) => item.batch === "申报批次").length,
    },
    {
      id: "review",
      label: "评审批次",
      count: applicationItems.filter((item) => item.batch === "评审批次").length,
    },
  ]

  // 处理标签页切换，并更新URL
  const handleTabChange = (value: string) => {
    const newTab = value as "application" | "review" | "result"
    setActiveTab(newTab)
    
    // 更新URL查询参数，保持当前路径不变
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', newTab)
    router.push(`${pathname}?${params.toString()}`)
    
    // 重置页面状态
    setCurrentPage(1) // 切换标签页时重置到第一页
    setSelectedRows([]) // 清空选中的行
    setExpandedBatches({}) // 重置展开状态
  }

  // 处理项目数量点击
  const handleProjectCountClick = (item: any) => {
    // 根据批次类型决定导航到哪个页面
    if (item.batch === "评审批次") {
      router.push(`/applications/review-projects?batch=${item.batchNumber}`)
    } else {
      router.push(`/applications/projects?batch=${item.batchNumber}`)
    }
  }

  // 父级操作
  const handleStartStop = (item: any) => {
    console.log("启动/停止批次:", item.id)

    // 获取当前状态
    const now = new Date()
    const startDate = new Date(item.date)
    const endDate = new Date(item.deadline)

    let currentStatus = "未开始"
    if (now > endDate) {
      currentStatus = "已结束"
    } else if (now >= startDate) {
      currentStatus = "进行中"
    }

    // 根据当前状态决定操作
    if (currentStatus === "未开始" || currentStatus === "已结束") {
      // 如果当前是"未开始"或"已结束"，则启动项目（将开始日期设为当前日期，结束日期设为未来某一天）
      // 弹出确认框
      const actionText = currentStatus === "未开始" ? "启动" : "重新启动";
      
      showConfirmDialog(
        "确定启动批次",
        `确定要${actionText}"${item.name}"批次吗？${actionText}后开始日期将设为今天，状态将变为"进行中"。`,
        actionText,
        () => {
          // 设置结束日期为今天往后30天
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          
          setApplicationItems(
            applicationItems.map((batch) =>
              batch.id === item.id
                ? {
                    ...batch,
                    date: new Date().toISOString().split("T")[0], // 将开始日期设为今天
                    deadline: futureDate.toISOString().split("T")[0], // 将截止日期设为30天后
                  }
                : batch,
            ),
          )
          // 显示成功消息
          showAlertDialog("操作成功", `批次已${actionText}，状态已更新为"进行中"`)
        }
      )
    } else {
      // 如果当前是"进行中"，则停止项目（将截止日期设为当前日期）
      // 弹出确认框
      showConfirmDialog(
        "确定停止批次",
        `确定要停止"${item.name}"批次吗？停止后截止日期将设为今天，状态将变为"已结束"。`,
        "停止",
        () => {
          setApplicationItems(
            applicationItems.map((batch) =>
              batch.id === item.id
                ? {
                    ...batch,
                    deadline: new Date().toISOString().split("T")[0], // 将截止日期设为今天
                  }
                : batch,
            ),
          )
          // 显示成功消息
          showAlertDialog("操作成功", '批次已停止，状态已更新为"已结束"')
        }
      )
    }
  }

  const handleEdit = (item: any) => {
    console.log("编辑批次:", item.id)
    
    // 根据批次类型跳转到不同的表单页面
    if (item.batch === "评审批次") {
      // 评审批次使用review-form页面
      router.push(`/applications/batches/review-form?id=${item.id}`)
    } else {
      // 申报批次使用form页面
      router.push(`/applications/batches/form?id=${item.id}`)
    }
  }

  const handleDelete = (item: any) => {
    console.log("删除批次:", item.id)
  }

  // 子级操作
  // 审核项目
  const handleReview = (item: any) => {
    // 只有申报批次的项目才能审核
    if (item.batch === "申报批次") {
      router.push(`/applications/review/${item.id}`)
    }
  }

  // 分派专家
  const handleAssignExperts = (item: any) => {
    // 只有评审批次的项目才能分派专家
    if (item.batch === "评审批次") {
      router.push(`/applications/assign-reviewers/${item.id}`)
    }
  }

  // 在handleAssignExperts函数后添加处理意见汇总的函数
  const handleOpinionSummary = (item: any) => {
    // 只有评审批次的项目才能查看意见汇总
    if (item.batch === "评审批次") {
      router.push(`/applications/opinion-summary/${item.id}`)
    }
  }

  // 处理审核提交
  const handleSubmitReview = (reviewData: any) => {
    console.log("Review submitted:", reviewData)

    // Update the project status based on the review
    if (reviewData.projectId) {
      // Find which batch this project belongs to
      const updatedBatchProjects = { ...batchProjects }

      Object.keys(updatedBatchProjects).forEach((batchId) => {
        updatedBatchProjects[batchId] = updatedBatchProjects[batchId].map((project) => {
          if (project.id === reviewData.projectId) {
            const newStatus =
              reviewData.status === "approved"
                ? "已通过"
                : reviewData.status === "rejected"
                  ? "已拒绝"
                  : reviewData.status === "revision"
                    ? "修改中"
                    : project.status

            return {
              ...project,
              status: newStatus,
              reviewScore: Math.round(
                reviewData.technicalScore * 0.3 +
                  reviewData.innovationScore * 0.2 +
                  reviewData.feasibilityScore * 0.2 +
                  reviewData.budgetScore * 0.15 +
                  reviewData.teamScore * 0.15,
              ),
              reviewComments: reviewData.comments,
              reviewDate: reviewData.reviewDate,
            }
          }
          return project
        })
      })

      setBatchProjects(updatedBatchProjects)
    }

    // 关闭审核抽屉
    setReviewDrawerOpen(false)
    // 延迟清除选中的项目，保抽屉完全关闭后再清除
    setTimeout(() => {
      setSelectedProject(null)
    }, 300)
  }

  // 添加保存意见汇总的处理函数
  const handleSaveSummary = (projectId: string, summaryData: any) => {
    console.log("Summary saved:", projectId, summaryData)

    // 更新项目的意见汇总信息
    const updatedBatchProjects = { ...batchProjects }

    Object.keys(updatedBatchProjects).forEach((batchId) => {
      updatedBatchProjects[batchId] = updatedBatchProjects[batchId].map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            summary: summaryData.summary,
            conclusion: summaryData.conclusion,
            recommendation: summaryData.recommendation,
            averageScore: summaryData.averageScores.overall,
            lastSummaryUpdate: summaryData.lastUpdated,
          }
        }
        return project
      })
    })

    setBatchProjects(updatedBatchProjects)

    // 关闭意见汇总抽屉
    setOpinionSummaryDrawerOpen(false)
    // 延迟清除选中的项目，确保抽屉完全关闭后再清除
    setTimeout(() => {
      setSelectedProjectForOpinions(null)
    }, 300)
  }

  const handleSubmitExpertAssignment = (projectId: string, experts: any[]) => {
    console.log("Experts assigned:", projectId, experts)

    // 更新项目的专家分派信息
    const updatedBatchProjects = { ...batchProjects }

    Object.keys(updatedBatchProjects).forEach((batchId) => {
      updatedBatchProjects[batchId] = updatedBatchProjects[batchId].map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            expertCount: experts.length,
            experts: experts,
            lastAssignmentDate: new Date().toISOString().split("T")[0],
          }
        }
        return project
      })
    })

    setBatchProjects(updatedBatchProjects)

    // 关闭专家分派抽屉
    setExpertAssignmentDrawerOpen(false)
    // 延迟清除选中的项目，确保抽屉完全关闭后再清除
    setTimeout(() => {
      setSelectedProjectForExperts(null)
    }, 300)
  }

  const handleView = (item: any) => {
    console.log("查看项目:", item.id)
    router.push(`/applications/detail/${item.id}`)
  }

  const handleDeleteProject = (item: any) => {
    console.log("删除项目:", item.id)
  }

  const handleEditProject = (item: any) => {
    console.log("编辑申报书:", item.id)
    router.push(`/applications/forms/edit?batchId=${item.id}`)
  }

  // 添加处理编辑提交的函数
  const handleEditSubmit = (batchData: any) => {
    console.log("提交编辑的批次数据:", batchData)
    
    // 在这里处理批次更新逻辑
    // 更新applicationItems状态
    setApplicationItems(
      applicationItems.map((batch) =>
        batch.id === selectedBatch?.id
          ? {
              ...batch,
              name: batchData["批次名称"],
              description: batchData["描述"] || batch.description,
              category: batchData["类别"] || batch.category,
              amount: parseFloat(batchData["金额"] || batch.amount),
              // 更新其他需要的字段
            }
          : batch,
      ),
    )
    
    // 关闭编辑对话框
    setEditDialogOpen(false)
    // 提示更新成功
    showAlertDialog("操作成功", "批次信息更新成功")
  }

  // 更新表格列配置，使用路由导航
  const updatedTableColumns = tableColumns.map((column) => {
    if (column.id === "projectCount") {
      return {
        ...column,
        header: typeof column.header === "function" ? column.header(activeTab) : column.header,
        cell: (item: any) => (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleProjectCountClick(item)
            }}
            className="text-primary hover:underline font-medium"
          >
            {item.projectCount || 0}
          </button>
        ),
      }
    }
    return {
      ...column,
      header: typeof column.header === "function" ? column.header(activeTab) : column.header,
    }
  })

  // 更新卡片字段配置，使用路由导航
  const updatedCardFields = cardFields.map((field) => {
    if (field.id === "projectCount") {
      return {
        ...field,
        label: activeTab === "review" ? "评审数量" : "申报数量",
        value: (item: any) => (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleProjectCountClick(item)
            }}
            className="text-primary hover:underline font-medium"
          >
            {item.projectCount || 0} 项
          </button>
        ),
      }
    }
    return field
  })

  // 修改自定义表格渲染函数，优化批次与子项目的视觉层次
  const CustomTable = () => null; // 不再使用此组件，被分开的两个表格组件替代

  // 添加函数处理批次转入评审的逻辑
  const handleTransferToReview = async (item: ApplicationItem) => {
    try {
      // 更新批次状态
      setApplicationItems(prevItems => 
        prevItems.map((batch) =>
          batch.id === item.id
            ? {
                ...batch,
                batch: "评审批次", // 将批次类型改为评审批次
                status: "待评审", // 更新状态
              }
            : batch
        )
      );

      // 关闭确认对话框
      setConfirmDialogOpen(false);

      // 显示成功提示
      showAlertDialog("操作成功", `批次"${item.name}"已成功转入评审阶段`);

      // 重置当前页面到第一页
      setCurrentPage(1);
      
      // 切换到评审批次标签页
      setActiveTab("review");

    } catch (error) {
      console.error('转入评审失败:', error);
      // 显示错误提示
      showAlertDialog("操作失败", "转入评审过程中发生错误，请稍后重试");
    }
  };

  return (
    <div className="space-y-4">
      {/* 头部：标题、标签页和操作按钮 */}
      <DataListHeader
        title={activeTab === "application" ? "申报批次" : 
              activeTab === "review" ? "评审批次" : 
              activeTab === "result" ? "评审结果" : "申报管理"}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddNew={activeTab === "application" ? () => router.push("/applications/batches/form") : undefined}
        addButtonLabel={activeTab === "application" ? "新建申报批次" : undefined}
        onOpenSettings={activeTab === "application" ? 
          () => setIsTemplatesDialogOpen(true) 
          : undefined
        }
        settingsButtonLabel={activeTab === "application" ? "模板库" : undefined}
        customActions={activeTab === "review" ? (
          <Button
            className="gap-2"
            onClick={() => {
              // 跳转到评审批次表单页面
              router.push("/applications/batches/review-form")
            }}
          >
            <FilePlus className="h-4 w-4" />
            新建评审批次
          </Button>
        ) : undefined}
      />

      <Card className="border shadow-sm">
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {/* 快速筛选下拉菜单 */}
          {quickFilters.map((filterGroup) => (
            <Select
              key={filterGroup.id}
              value={filterValues[filterGroup.id] || "all"}
              onValueChange={(value) => {
                setFilterValues({
                  ...filterValues,
                  [filterGroup.id]: value,
                })
              }}
            >
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder={`全部${filterGroup.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部{filterGroup.label}</SelectItem>
                {filterGroup.options.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* 高级筛选按钮 */}
          <Button variant="outline" size="sm" className="h-10" onClick={() => setShowAdvancedFilters(true)}>
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            高级筛选
          </Button>

          {/* 排序和视图切换 */}
          <div className="ml-auto flex items-center">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[100px] h-10">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.field + "_" + option.direction}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border rounded-md ml-2">
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-none ${viewMode === "grid" ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-transparent"}`}
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-none ${viewMode === "list" ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-transparent"}`}
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 高级筛选面板 */}
      {showAdvancedFilters && (
        <DataListFilters
          open={showAdvancedFilters}
          onOpenChange={setShowAdvancedFilters}
          fields={advancedFilters}
          values={filterValues}
          onValuesChange={setFilterValues}
          onReset={() => setFilterValues({})}
          onApply={() => setShowAdvancedFilters(false)}
        />
      )}

      {/* 项目列表视图 */}
      {activeTab === "application" ? (
        /* 申报批次视图 */
        <>
      {viewMode === "list" ? (
            <ApplicationBatchTable 
              items={paginatedItems}
              batchProjects={batchProjects}
              expandedBatches={expandedBatches}
              onToggleBatchExpand={toggleBatchExpand}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              onStartStop={handleStartStop}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReview={handleReview}
              onView={handleView}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              onTransferToReview={handleTransferToReview}
            />
          ) : (
            <ApplicationCardView
          items={paginatedItems}
          batchProjects={batchProjects}
          expandedBatches={expandedBatches}
          onToggleBatchExpand={(batchId) => toggleBatchExpand(batchId)}
          onStartStop={handleStartStop}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReview={handleReview}
          onView={handleView}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onTransferToReview={handleTransferToReview}
        />
          )}
        </>
      ) : (
        /* 评审批次视图 */
        <>
          {viewMode === "list" ? (
            <ReviewBatchTable 
              items={paginatedItems}
              batchProjects={batchProjects}
              expandedBatches={expandedBatches}
              onToggleBatchExpand={toggleBatchExpand}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              onStartStop={handleStartStop}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssignExperts={handleAssignExperts}
              onOpinionSummary={handleOpinionSummary}
              onView={handleView}
              onDeleteProject={handleDeleteProject}
            />
          ) : (
            <ReviewCardView
              items={paginatedItems}
              batchProjects={batchProjects}
              expandedBatches={expandedBatches}
              onToggleBatchExpand={(batchId) => toggleBatchExpand(batchId)}
              onStartStop={handleStartStop}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onAssignExperts={handleAssignExperts}
              onOpinionSummary={handleOpinionSummary}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </>
      )}

      {/* 分页 - 根据活动的标签页计算总数 */}
      <DataListPagination
        currentPage={currentPage}
        totalPages={Math.ceil(
          (activeTab === "application" 
            ? filteredApplicationBatches.length 
            : filteredReviewBatches.length) / pageSize
        )}
        pageSize={pageSize}
        totalItems={activeTab === "application" 
          ? filteredApplicationBatches.length 
          : filteredReviewBatches.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* 批量操作栏 */}
      <DataListBatchActions
        show={selectedRows.length > 0}
        selectedCount={selectedRows.length}
        actions={configuredBatchActions}
        onClearSelection={() => setSelectedRows([])}
      />

      {/* 审核抽屉 - 用于申报批次子项目 */}
      <ProjectReviewDrawer
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        project={selectedProject}
        onSubmitReview={handleSubmitReview}
      />

      {/* 专家分派抽屉 - 用于评审批次子项目 */}
      <ExpertAssignmentDrawer
        isOpen={expertAssignmentDrawerOpen}
        onClose={() => setExpertAssignmentDrawerOpen(false)}
        project={selectedProjectForExperts}
        onAssignExperts={handleSubmitExpertAssignment}
      />

      {/* 添加模板库对话框 */}
      <TemplatesDialog open={isTemplatesDialogOpen} onOpenChange={setIsTemplatesDialogOpen} />
      
      {/* 添加批次编辑对话框 */}
      <BatchEditDialog
        batch={selectedBatch}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditSubmit}
      />

      {/* 添加确认对话框 */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (confirmAction) confirmAction()
              setConfirmDialogOpen(false)
            }}>
              {confirmActionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 添加提示对话框 */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertDialogOpen(false)}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
