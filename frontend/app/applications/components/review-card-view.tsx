import { useRouter } from "next/navigation"
import { useState, useRef, MouseEvent, useEffect } from "react"
import { ChevronDown, ChevronRight, Play, Edit, Trash, Eye, MoreHorizontal, FileText, Users, MoreVertical, Loader2, ChevronLeft, ChevronRightIcon, Bell, UserPlus, Search, X, ThumbsUp, ThumbsDown, CircleCheck, AlertCircle, Clock, BarChart, PieChart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ApplicationItem, ProjectItem, ExpertInfo } from "../types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 扩展专家信息接口，添加专业字段
interface ExtendedExpertInfo extends ExpertInfo {
  specialty?: string;
  source?: string;
  workplace?: string;
  title?: string;
  highestDegree?: string;
  primaryDiscipline?: string;
  reviewProgress?: number;
  reviewedCount?: number;
  assignedCount?: number;
  email?: string;
  phone?: string;
  reviewStatus?: "未开始" | "进行中" | "已完成";
}

// 扩展应用项目接口，添加新字段
interface ExtendedApplicationItem extends ApplicationItem {
  expertCount?: number;
  approvedCount?: number;
  experts?: ExtendedExpertInfo[];
}

// 扩展项目接口，添加批准状态字段
interface ExtendedProjectItem extends ProjectItem {
  approvalStatus?: "已立项" | "未立项" | string;
  experts?: ExtendedExpertInfo[];
  reviewStatus?: "未开始" | "进行中" | "已完成";
  reviewResult?: "推荐" | "不推荐" | "待定" | "";
  reviewDate?: string;
  reviewScore?: number;
  comments?: string;
}

// 专家评审记录接口
interface ExpertReviewRecord {
  id: string;
  projectId: string;
  projectName: string;
  reviewStatus: "未开始" | "进行中" | "已完成";
  reviewResult?: "推荐" | "不推荐" | "待定" | "";
  reviewDate?: string;
  reviewScore?: number;
  comments?: string;
}

interface ReviewCardViewProps {
  items: ApplicationItem[]
  batchProjects: Record<string, ProjectItem[]>
  expandedBatches: Record<string, boolean>
  onToggleBatchExpand: (batchId: string) => void
  onStartStop: (item: ApplicationItem) => void
  onEdit: (item: ApplicationItem) => void
  onDelete: (item: ApplicationItem) => void
  onView: (item: ProjectItem) => void
  onAssignExperts: (item: ProjectItem) => void
  onOpinionSummary: (item: ProjectItem) => void
  onDeleteProject: (item: ProjectItem) => void
}

type StatusType = "未开始" | "进行中" | "已结束";
type VariantType = "default" | "secondary" | "destructive" | "outline";

const getStatusVariant = (status: StatusType): VariantType => {
  const variantMap: Record<StatusType, VariantType> = {
    "未开始": "secondary",
    "进行中": "default",
    "已结束": "outline"
  };
  return variantMap[status];
};

export const ReviewCardView: React.FC<ReviewCardViewProps> = ({
  items,
  batchProjects,
  expandedBatches,
  onToggleBatchExpand,
  onStartStop,
  onEdit,
  onDelete,
  onView,
  onAssignExperts,
  onOpinionSummary,
  onDeleteProject
}) => {
  const router = useRouter()
  const [selectedReviewItem, setSelectedReviewItem] = useState<ExtendedApplicationItem | null>(items.length > 0 ? items[0] as ExtendedApplicationItem : null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true)
  const [allSelected, setAllSelected] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showProjectDeleteDialog, setShowProjectDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ApplicationItem | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [enhancedProjects, setEnhancedProjects] = useState<Record<string, ExtendedProjectItem[]>>({})
  // 添加视图切换状态
  const [activeView, setActiveView] = useState<"projects" | "experts">("projects")
  const [selectedExperts, setSelectedExperts] = useState<Set<string>>(new Set())
  const [allExpertsSelected, setAllExpertsSelected] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState<ExtendedExpertInfo | null>(null)
  const [isExpertProjectsDrawerOpen, setIsExpertProjectsDrawerOpen] = useState(false)
  const [expertReviews, setExpertReviews] = useState<ExpertReviewRecord[]>([])

  // 获取当前选中的项目
  const selectedItem = selectedReviewItem

  // 添加模拟数据的 effect
  useEffect(() => {
    // 为每个批次项目添加专家和立项状态
    const enhancedProjectsData: Record<string, ExtendedProjectItem[]> = {};
    
    // 为 ApplicationItem 添加扩展字段
    const enhancedItems = items.map(item => {
      const extendedItem = item as ExtendedApplicationItem;
      const expertCount = Math.floor(Math.random() * 8) + 7; // 2-10 位专家
      extendedItem.expertCount = expertCount;
      extendedItem.approvedCount = Math.floor(Math.random() * extendedItem.projectCount);
      
      // 为每个批次生成专家列表
      extendedItem.experts = Array.from({ length: expertCount }).map((_, i) => {
        const expertSources = ['校内专家', '校外专家', '企业专家', '其他单位'];
        const workplaces = ['北京大学', '清华大学', '中国科学院', '华为技术有限公司', '腾讯科技', '阿里巴巴集团'];
        const titles = ['教授', '副教授', '高级工程师', '研究员', '首席科学家'];
        const degrees = ['博士', '硕士', '学士'];
        const disciplines = ['计算机科学与技术', '人工智能', '数据科学', '信息安全', '软件工程', '通信工程', '电子科学与技术'];
        
        // 为每个专家分配2-5个项目
        const assignedCount = Math.floor(Math.random() * 4) + 2;
        const reviewedCount = Math.floor(Math.random() * assignedCount);
        const reviewProgress = assignedCount > 0 ? Math.floor((reviewedCount / assignedCount) * 100) : 0;
        
        return {
          id: `expert-${item.id}-${i}`,
          name: `专家${i + 1}`,
          specialty: ['计算机科学', '人工智能', '数据分析', '软件工程', '网络安全'][Math.floor(Math.random() * 5)],
          source: expertSources[Math.floor(Math.random() * expertSources.length)],
          workplace: workplaces[Math.floor(Math.random() * workplaces.length)],
          title: titles[Math.floor(Math.random() * titles.length)],
          highestDegree: degrees[Math.floor(Math.random() * degrees.length)],
          primaryDiscipline: disciplines[Math.floor(Math.random() * disciplines.length)],
          reviewProgress: reviewProgress,
          reviewedCount: reviewedCount,
          assignedCount: assignedCount
        } as ExtendedExpertInfo;
      });
      
      return extendedItem;
    });
    
    // 如果有选中的项目，更新它
    if (selectedReviewItem) {
      const updatedItem = enhancedItems.find(item => item.id === selectedReviewItem.id);
      if (updatedItem) {
        setSelectedReviewItem(updatedItem);
      }
    }

    // 处理项目数据
    Object.entries(batchProjects).forEach(([batchId, projects]) => {
      enhancedProjectsData[batchId] = projects.map(project => {
        const extendedProject = { ...project } as ExtendedProjectItem;
        
        // 随机生成专家列表（如果没有）
        if (!extendedProject.experts || extendedProject.experts.length === 0) {
          const expertCount = Math.floor(Math.random() * 5) + 1; // 1-3 个专家
          extendedProject.experts = Array.from({ length: expertCount }).map((_, i) => ({
            id: `expert-${extendedProject.id}-${i}`,
            name: `专家${i + 1}`,
            specialty: ['计算机科学', '人工智能', '数据分析', '软件工程', '网络安全'][Math.floor(Math.random() * 5)]
          } as ExtendedExpertInfo));
        }
        
        // 随机生成立项状态
        const statuses = ["已立项", "未立项", "待定"];
        extendedProject.approvalStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        return extendedProject;
      });
    });
    
    setEnhancedProjects(enhancedProjectsData);
  }, [items, batchProjects]);
  
  // 使用增强后的项目数据
  const projectsToRender = (batchId: string) => {
    return enhancedProjects[batchId] || [];
  };

  const handleSelectItem = (item: ApplicationItem) => {
    if (!isDragging) {
      setSelectedReviewItem(item as ExtendedApplicationItem)
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return
    
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    
    // 添加鼠标样式
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing'
      scrollContainerRef.current.style.userSelect = 'none'
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    
    // 恢复鼠标样式
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = ''
    }
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return

    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // 滚动速度系数
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = ''
    }
  }

  const handleProjectCountClick = (item: ApplicationItem) => {
    router.push(`/applications/review-projects?batch=${item.batchNumber}`)
  }

  const getStatusBadge = (item: ApplicationItem) => {
    const now = new Date()
    const startDate = new Date(item.date)
    const endDate = new Date(item.deadline)
    
    let status: StatusType = "未开始"
    if (now > endDate) {
      status = "已结束"
    } else if (now >= startDate) {
      status = "进行中"
    }
    
    return (
      <Badge
        variant={getStatusVariant(status)}
        className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 min-w-fit ${
          selectedItem?.id === item.id 
            ? "border-white/20 bg-white/20 text-white"
            : ""
        }`}
      >
        {status}
      </Badge>
    )
  }

  const handleSelectAll = (checked: CheckedState) => {
    if (checked && selectedItem && batchProjects[selectedItem.id]) {
      const newSelected = new Set(batchProjects[selectedItem.id].map(p => p.id))
      setSelectedProjects(newSelected)
      setAllSelected(true)
    } else {
      setSelectedProjects(new Set())
      setAllSelected(false)
    }
  }

  const handleSelectProject = (projectId: string, checked: CheckedState) => {
    const newSelected = new Set(selectedProjects)
    if (checked) {
      newSelected.add(projectId)
    } else {
      newSelected.delete(projectId)
    }
    setSelectedProjects(newSelected)
    
    if (selectedItem && batchProjects[selectedItem.id]) {
      setAllSelected(newSelected.size === batchProjects[selectedItem.id].length)
    }
  }

  const handleDeleteClick = (item: ApplicationItem) => {
    setItemToDelete(item)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setIsDeleting(true)
      try {
        await onDelete(itemToDelete)
        setShowDeleteDialog(false)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleProjectDeleteClick = (project: ProjectItem) => {
    setProjectToDelete(project)
    setShowProjectDeleteDialog(true)
  }

  const handleConfirmProjectDelete = async () => {
    if (projectToDelete) {
      setIsDeletingProject(true)
      try {
        await onDeleteProject(projectToDelete)
        setShowProjectDeleteDialog(false)
      } finally {
        setIsDeletingProject(false)
      }
    }
  }

  // 添加专家选择处理函数
  const handleSelectAllExperts = (checked: CheckedState) => {
    if (checked && selectedItem && selectedItem.experts) {
      const newSelected = new Set(selectedItem.experts.map(p => p.id))
      setSelectedExperts(newSelected)
      setAllExpertsSelected(true)
    } else {
      setSelectedExperts(new Set())
      setAllExpertsSelected(false)
    }
  }

  const handleSelectExpert = (expertId: string, checked: CheckedState) => {
    const newSelected = new Set(selectedExperts)
    if (checked) {
      newSelected.add(expertId)
    } else {
      newSelected.delete(expertId)
    }
    setSelectedExperts(newSelected)
    
    if (selectedItem && selectedItem.experts) {
      setAllExpertsSelected(newSelected.size === selectedItem.experts.length)
    }
  }

  // 查看专家评审项目
  const handleViewExpertProjects = (expert: ExtendedExpertInfo) => {
    setSelectedExpert(expert)
    
    // 生成专家的评审项目数据
    const mockReviewRecords: ExpertReviewRecord[] = []
    if (selectedItem) {
      const projects = projectsToRender(selectedItem.id)
      // 选择随机数量的项目，但不超过专家的assignedCount
      const assignedCount = expert.assignedCount || 0
      const projectsToAssign = projects.slice(0, assignedCount)
      
      projectsToAssign.forEach(project => {
        // 随机生成评审状态
        const statuses: ("未开始" | "进行中" | "已完成")[] = ["未开始", "进行中", "已完成"]
        const reviewStatus = statuses[Math.floor(Math.random() * statuses.length)]
        
        // 根据评审状态设置其他数据
        let reviewResult: "推荐" | "不推荐" | "待定" | "" = ""
        let reviewDate: string | undefined = undefined
        let reviewScore: number | undefined = undefined
        let comments: string | undefined = undefined
        
        if (reviewStatus === "已完成") {
          const results: ("推荐" | "不推荐" | "待定")[] = ["推荐", "不推荐", "待定"]
          reviewResult = results[Math.floor(Math.random() * results.length)]
          reviewDate = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString() // 过去7天内随机时间
          reviewScore = Math.floor(Math.random() * 40) + 60 // 60-100分
          comments = ["项目具有显著创新性，建议支持", "项目应用前景广阔，推荐立项", "项目可行性有待论证，需进一步完善", "项目预算偏高，建议调整后再审", "项目目标明确，实施方案完善"][Math.floor(Math.random() * 5)]
        } else if (reviewStatus === "进行中") {
          reviewDate = new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString() // 过去3天内随机时间
        }
        
        mockReviewRecords.push({
          id: `review-${expert.id}-${project.id}`,
          projectId: project.id,
          projectName: project.name,
          reviewStatus,
          reviewResult,
          reviewDate,
          reviewScore,
          comments
        })
      })
    }
    
    setExpertReviews(mockReviewRecords)
    setIsExpertProjectsDrawerOpen(true)
  }

  // 发送通知给专家
  const handleSendNotification = (expert: ExtendedExpertInfo) => {
    // 将专家ID存入sessionStorage
    sessionStorage.setItem('selectedExperts', JSON.stringify([expert.id]))
    
    // 如果有批次ID，同时也传递批次ID
    if (selectedItem) {
      sessionStorage.setItem('batchId', selectedItem.id)
    }
    
    // 打开新页签
    router.push('/applications/send-notifications')
  }

  // 批量分配专家
  const handleBatchAssignExperts = () => {
    // 检查是否有项目被选中
    if (selectedProjects.size === 0) return
    
    // 将选中的项目ID存入sessionStorage以便在新页面中获取
    sessionStorage.setItem('selectedProjects', JSON.stringify(Array.from(selectedProjects)))
    
    // 如果有批次ID，同时也传递批次ID
    if (selectedItem?.id) {
      sessionStorage.setItem('batchId', selectedItem.id)
    }
    
    // 打开新页签
    router.push('/applications/assign-experts')
  }

  // 处理打开综合看板
  const handleOpenDashboard = () => {
    if (selectedItem) {
      // 将批次ID和名称存入sessionStorage以便在新页面中获取
      sessionStorage.setItem('reviewBatchId', selectedItem.id)
      sessionStorage.setItem('reviewBatchName', selectedItem.name)
      
      // 添加更多评审统计数据
      const projectsData = projectsToRender(selectedItem.id);
      const approvedCount = projectsData.filter(p => p.approvalStatus === "已立项").length;
      const pendingCount = projectsData.filter(p => p.approvalStatus === "待定").length;
      const rejectedCount = projectsData.filter(p => p.approvalStatus === "未立项").length;
      
      // 计算评审进度和评分
      const totalReviews = projectsData.reduce((sum, project) => {
        return sum + (project.experts?.length || 0);
      }, 0);
      
      const completedReviews = projectsData.reduce((sum, project) => {
        const experts = project.experts || [];
        return sum + experts.filter(e => e.reviewStatus === "已完成").length;
      }, 0);
      
      // 存储统计数据
      sessionStorage.setItem('reviewStats', JSON.stringify({
        totalProjects: projectsData.length,
        approvedProjects: approvedCount,
        rejectedProjects: rejectedCount,
        pendingProjects: pendingCount,
        totalExperts: selectedItem.experts?.length || 0,
        completedReviews: completedReviews,
        totalReviews: totalReviews,
        reviewProgress: totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0
      }));
      
      // 打开新页签
      router.push('/applications/review-dashboard')
    }
  }

  // 添加一个辅助函数，用于获取批次的状态和对应的操作文本
  const getBatchStatusAndAction = (item: ApplicationItem) => {
    const now = new Date()
    const startDate = new Date(item.date)
    const endDate = new Date(item.deadline)

    let status = "未开始"
    let actionText = "启动批次"
    
    if (now > endDate) {
      status = "已结束"
      actionText = "启动批次" // 已结束的批次应显示为"启动批次"
    } else if (now >= startDate) {
      status = "进行中"
      actionText = "停止批次"
    }

    return { status, actionText }
  }

  if (!selectedItem) {
    return <div className="p-8 text-center text-muted-foreground">没有评审批次可显示</div>
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ease-out ${
      mounted 
        ? "opacity-100 translate-y-0" 
        : "opacity-0 translate-y-4"
    }`}>
      <style jsx global>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInSlideUp {
          animation: fadeInSlideUp 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes progressAnimation {
          from {
            width: 0%;
          }
        }
        
        .animate-progress {
          animation: progressAnimation 1s ease-out forwards;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 上方卡片轮播 */}
      <div className="relative group">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleScroll('right')}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto cursor-grab select-none pl-0"
          style={{ 
            scrollBehavior: 'smooth',
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none', // Firefox
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, index) => (
            <Card 
              key={item.id}
              className={`flex-shrink-0 w-[300px] cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden group ${
                selectedItem?.id === item.id 
                  ? "bg-transparent text-primary-foreground shadow-[0_0_15px_rgba(0,0,0,0.1)]" 
                  : "bg-background shadow-[0_0_10px_rgba(0,0,0,0.05)] hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:bg-slate-50/50"
              } ${mounted ? "animate-fadeInSlideUp" : ""}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => handleSelectItem(item)}
            >
              <CardContent 
                className={`p-4 transition-all duration-300 ease-in-out relative ${
                  selectedItem?.id === item.id 
                    ? "bg-gradient-to-b from-primary to-primary/90 after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] after:rounded-[inherit]" 
                    : ""
                }`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`text-base font-medium line-clamp-1 transition-colors duration-300 ${
                      selectedItem?.id === item.id 
                        ? "text-primary-foreground" 
                        : "text-slate-900 group-hover:text-primary"
                    }`}>
                      {item.name}
                    </div>
                    {getStatusBadge(item)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`transition-colors duration-300 ${
                        selectedItem?.id === item.id 
                          ? "text-primary-foreground/70" 
                          : "text-slate-500"
                      }`}>
                        评审进度
                      </span>
                      <span className={selectedItem?.id === item.id ? "text-primary-foreground" : "text-slate-900"}>
                        {item.progress}/100
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full transition-colors duration-300 ${
                      selectedItem?.id === item.id 
                        ? "bg-primary-foreground/20" 
                        : "bg-slate-100"
                    }`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 animate-progress ${
                          selectedItem?.id === item.id 
                            ? "bg-white" 
                            : "bg-primary"
                        }`}
                        style={{ 
                          width: `${item.progress}%`,
                          animationDelay: `${index * 100 + 300}ms`
                        }}
                      />
                    </div>
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    selectedItem?.id === item.id 
                      ? "text-primary-foreground/70" 
                      : "text-slate-500"
                  }`}>
                    <span>评审期限：</span>
                    <span className={selectedItem?.id === item.id ? "text-primary-foreground" : "text-slate-900"}>
                      {format(new Date(item.date), "yyyy/MM/dd")} - {format(new Date(item.deadline), "yyyy/MM/dd")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 详情区域 */}
      {selectedItem && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors rounded-lg"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            >
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent">
                  {isDetailsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <h3 className="text-lg font-medium">评审批次详情</h3>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => { 
                    e.stopPropagation() 
                    onStartStop(selectedItem)
                  }}
                >
                  {(() => {
                    const { actionText } = getBatchStatusAndAction(selectedItem)
                    return (
                      <>
                        {actionText === "启动批次" ? (
                          <Play className="mr-2 h-4 w-4" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                          </svg>
                        )}
                        {actionText}
                      </>
                    )
                  })()}
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenDashboard(); }}>
                  <BarChart className="h-4 w-4 mr-2" />
                  综合看板
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(selectedItem); }}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑批次
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteClick(selectedItem); }}>
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  删除批次
                </Button>
              </div>
            </div>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isDetailsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 border-t space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedItem.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">类型</span>
                    <span className="text-slate-900 font-medium">{selectedItem.type}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">评审方案</span>
                    <span className="text-slate-900 font-medium">{selectedItem.category}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">评审开始日期</span>
                    <span className="text-slate-900 font-medium">{format(new Date(selectedItem.date), "yyyy/MM/dd")}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">评审结束日期</span>
                    <span className="text-slate-900 font-medium">{format(new Date(selectedItem.deadline), "yyyy/MM/dd")}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">评审进度</span>
                    <span className="text-slate-900 font-medium">{selectedItem.progress}%</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">评审项目数</span>
                    <span className="text-slate-900 font-medium">{selectedItem.projectCount}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">评审专家数</span>
                    <span className="text-slate-900 font-medium">{selectedItem.expertCount || 0}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">批准立项数</span>
                    <span className="text-slate-900 font-medium">{selectedItem.approvedCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 视图切换和列表区域 */}
          <div className="bg-white rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between mb-5">
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "projects" | "experts")} className="w-auto">
                <TabsList className="bg-slate-100 p-1">
                  <TabsTrigger value="projects" className="px-6 py-1.5 text-sm font-medium data-[state=active]:bg-white">
                    <FileText className="mr-2 h-4 w-4" />
                    评审项目
                  </TabsTrigger>
                  <TabsTrigger value="experts" className="px-6 py-1.5 text-sm font-medium data-[state=active]:bg-white">
                    <Users className="mr-2 h-4 w-4" />
                    评审专家
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* 根据当前视图显示不同的批量操作按钮 */}
              <div className="flex space-x-2">
                {activeView === "projects" ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={selectedProjects.size === 0}
                      onClick={handleBatchAssignExperts}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      批量分配专家
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={selectedExperts.size === 0}
                      onClick={() => {
                        if (selectedExperts.size > 0 && selectedItem) {
                          // 将选中的专家ID存入sessionStorage以便在新页面中获取
                          sessionStorage.setItem('selectedExperts', JSON.stringify(Array.from(selectedExperts)))
                          
                          // 如果有批次ID，同时也传递批次ID
                          sessionStorage.setItem('batchId', selectedItem.id)
                          
                          // 打开新页签
                          router.push('/applications/send-notifications')
                        }
                      }}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      批量发送通知
                    </Button>
                    <Button variant="outline" size="sm" disabled={selectedExperts.size === 0}>
                      <FileText className="mr-2 h-4 w-4" />
                      导出专家信息
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {activeView === "projects" ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="w-[40px] pl-6 bg-slate-50/80">
                      <div className="flex items-center">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </div>
                    </TableHead>
                    <TableHead className="w-[300px]">项目名称</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>所属部门</TableHead>
                    <TableHead>金额（万元）</TableHead>
                    <TableHead>评审专家</TableHead>
                    <TableHead>评审进度</TableHead>
                    <TableHead>立项状态</TableHead>
                    <TableHead className="text-right pr-6">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selectedItem?.id ? projectsToRender(selectedItem.id) : []).map((extendedProject, index) => (
                    <TableRow key={extendedProject.id} className="hover:bg-slate-50">
                      <TableCell className="pl-6">
                        <Checkbox 
                          checked={selectedProjects.has(extendedProject.id)}
                          onCheckedChange={(checked) => handleSelectProject(extendedProject.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900">{extendedProject.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{extendedProject.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{extendedProject.manager?.name || "-"}</TableCell>
                      <TableCell>{extendedProject.manager?.department || "-"}</TableCell>
                      <TableCell>{extendedProject.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        {extendedProject.experts && extendedProject.experts.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden">
                            {(extendedProject.experts as ExtendedExpertInfo[]).map((expert, index) => (
                              <div 
                                key={index}
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border-2 border-white" 
                                title={`${expert.name}${expert.specialty ? ` (${expert.specialty})` : ''}`}
                              >
                                {expert.name[0]}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">待分配专家</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full h-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-progress"
                              style={{ 
                                width: `${extendedProject.progress || 0}%`,
                                animationDelay: `${index * 100 + 500}ms`
                              }}
                            />
                          </div>
                          <span className="text-sm text-slate-600 whitespace-nowrap">{extendedProject.progress || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {extendedProject.approvalStatus ? (
                          <Badge variant="outline" className={`
                            ${extendedProject.approvalStatus === "已立项" 
                              ? "text-green-600 border-green-200" 
                              : extendedProject.approvalStatus === "未立项" 
                                ? "text-amber-600 border-amber-200" 
                                : "text-slate-500 border-slate-200"
                            }
                          `}>
                            {extendedProject.approvalStatus}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500 border-slate-200">
                            待定
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(extendedProject)}>
                              <Eye className="mr-2 h-4 w-4" />
                              查看项目
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAssignExperts(extendedProject)}>
                              <Users className="mr-2 h-4 w-4" />
                              分派专家
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onOpinionSummary(extendedProject)}>
                              <FileText className="mr-2 h-4 w-4" />
                              意见汇总
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleProjectDeleteClick(extendedProject)} 
                              className="text-destructive focus:bg-destructive/10"
                            >
                              {isDeletingProject ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash className="mr-2 h-4 w-4" />
                              )}
                              删除项目
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <>
                {selectedItem.experts && selectedItem.experts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-0">
                        <TableHead className="w-[40px] pl-6 bg-slate-50/80">
                          <div className="flex items-center">
                            <Checkbox
                              checked={allExpertsSelected}
                              onCheckedChange={handleSelectAllExperts}
                              aria-label="Select all experts"
                            />
                          </div>
                        </TableHead>
                        <TableHead className="w-[120px]">姓名</TableHead>
                        <TableHead>专家来源</TableHead>
                        <TableHead>工作单位</TableHead>
                        <TableHead>职称</TableHead>
                        <TableHead>最后学位</TableHead>
                        <TableHead>一级学科</TableHead>
                        <TableHead>评审进度</TableHead>
                        <TableHead>评审数/分配数</TableHead>
                        <TableHead className="text-right pr-6">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItem.experts?.map((expert, index) => (
                        <TableRow key={expert.id} className="hover:bg-slate-50">
                          <TableCell className="pl-6">
                            <Checkbox 
                              checked={selectedExperts.has(expert.id)}
                              onCheckedChange={(checked) => handleSelectExpert(expert.id, checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{expert.name}</TableCell>
                          <TableCell>{expert.source || "-"}</TableCell>
                          <TableCell>{expert.workplace || "-"}</TableCell>
                          <TableCell>{expert.title || "-"}</TableCell>
                          <TableCell>{expert.highestDegree || "-"}</TableCell>
                          <TableCell>{expert.primaryDiscipline || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-full h-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full animate-progress"
                                  style={{ 
                                    width: `${expert.reviewProgress || 0}%`,
                                    animationDelay: `${index * 100 + 500}ms`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-slate-600 whitespace-nowrap">{expert.reviewProgress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={expert.reviewedCount === expert.assignedCount ? "default" : "outline"} className="font-medium">
                              {expert.reviewedCount || 0}/{expert.assignedCount || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewExpertProjects(expert)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  查看评审项目
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendNotification(expert)}>
                                  <Bell className="mr-2 h-4 w-4" />
                                  发送通知
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无评审专家</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md">
                      该评审批次尚未分配专家。您可以为评审批次内的项目分配专家，专家将自动添加到此列表中。
                    </p>
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      分配评审专家
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              你确定要删除评审批次 "{itemToDelete?.name}" 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white" 
              onClick={handleConfirmDelete}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 项目删除确认对话框 */}
      <AlertDialog open={showProjectDeleteDialog} onOpenChange={setShowProjectDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              你确定要删除评审项目 "{projectToDelete?.name}" 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white" 
              onClick={handleConfirmProjectDelete}
            >
              {isDeletingProject ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 专家评审项目抽屉 */}
      {selectedExpert && (
        <Sheet open={isExpertProjectsDrawerOpen} onOpenChange={setIsExpertProjectsDrawerOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto" side="right">
            <SheetHeader className="mb-6">
              <SheetTitle>专家评审项目</SheetTitle>
              <SheetDescription>
                查看专家评审的项目列表和进度状态
              </SheetDescription>
            </SheetHeader>
            
            {/* 专家信息卡片 */}
            <Card className="mb-6 border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedExpert.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{selectedExpert.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      {selectedExpert.title} · {selectedExpert.workplace}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">专家来源：</span>
                    <span className="font-medium">{selectedExpert.source || '未设置'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">最高学位：</span>
                    <span className="font-medium">{selectedExpert.highestDegree || '未设置'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">一级学科：</span>
                    <span className="font-medium">{selectedExpert.primaryDiscipline || '未设置'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">研究方向：</span>
                    <span className="font-medium">{selectedExpert.specialty || '未设置'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 flex justify-between py-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-white">
                    <span>分配 <span className="font-bold">{selectedExpert.assignedCount || 0}</span> 个项目</span>
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    <span>已评审 <span className="font-bold">{selectedExpert.reviewedCount || 0}</span> 个项目</span>
                  </Badge>
                </div>
                <div className="flex items-center text-sm">
                  <div className="mr-2">评审进度：</div>
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${selectedExpert.reviewProgress || 0}%` }} />
                  </div>
                  <div className="ml-2 text-xs">{selectedExpert.reviewProgress || 0}%</div>
                </div>
              </CardFooter>
            </Card>
            
            {/* 评审项目列表 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">评审项目列表</h3>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="筛选状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="incomplete">未完成</SelectItem>
                      <SelectItem value="complete">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8">
                    <Search className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">搜索</span>
                  </Button>
                </div>
              </div>
              
              {expertReviews.length > 0 ? (
                <div className="space-y-4">
                  {expertReviews.map((review) => {
                    // 评审状态对应的颜色和图标
                    let statusColor = "text-gray-500"
                    let StatusIcon = Clock
                    
                    if (review.reviewStatus === "已完成") {
                      statusColor = "text-green-600"
                      StatusIcon = CircleCheck
                    } else if (review.reviewStatus === "进行中") {
                      statusColor = "text-blue-600"
                      StatusIcon = Eye
                    }
                    
                    // 评审结果对应的图标
                    let ResultIcon = null
                    let resultColor = ""
                    
                    if (review.reviewResult === "推荐") {
                      ResultIcon = ThumbsUp
                      resultColor = "text-green-600"
                    } else if (review.reviewResult === "不推荐") {
                      ResultIcon = ThumbsDown
                      resultColor = "text-red-600"
                    } else if (review.reviewResult === "待定") {
                      ResultIcon = AlertCircle
                      resultColor = "text-amber-600"
                    }
                    
                    return (
                      <Card key={review.id} className="overflow-hidden border shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-base">{review.projectName}</CardTitle>
                              <CardDescription className="flex items-center">
                                项目编号: PRJ-{review.projectId.slice(-6)}
                              </CardDescription>
                            </div>
                            <Badge className={`${review.reviewStatus === "已完成" ? "bg-green-50 text-green-700 border-green-200" : 
                                             review.reviewStatus === "进行中" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                                             "bg-gray-50 text-gray-700 border-gray-200"}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {review.reviewStatus}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          {review.reviewStatus === "已完成" ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-sm text-muted-foreground mr-2">评审结果：</span>
                                  <Badge variant="outline" className={`${resultColor} border-current/30 bg-current/5`}>
                                    {ResultIcon && <ResultIcon className="h-3 w-3 mr-1" />}
                                    {review.reviewResult}
                                  </Badge>
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground mr-1">评分：</span>
                                  <span className="font-medium">{review.reviewScore}</span>
                                </div>
                              </div>
                              {review.comments && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground block mb-1">评审意见：</span>
                                  <p className="bg-slate-50 p-2 rounded text-slate-900">{review.comments}</p>
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">
                                评审日期：{review.reviewDate ? format(new Date(review.reviewDate), "yyyy-MM-dd HH:mm") : "未记录"}
                              </div>
                            </div>
                          ) : review.reviewStatus === "进行中" ? (
                            <div className="py-2 flex justify-between items-center">
                              <span className="text-sm text-blue-600">专家正在评审此项目</span>
                              <span className="text-xs text-muted-foreground">
                                开始时间：{review.reviewDate ? format(new Date(review.reviewDate), "yyyy-MM-dd HH:mm") : "未记录"}
                              </span>
                            </div>
                          ) : (
                            <div className="py-2 flex justify-center">
                              <span className="text-sm text-muted-foreground">专家尚未开始评审</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="bg-slate-50 py-2">
                          <div className="flex justify-end space-x-2 w-full">
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              查看项目
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              <Bell className="h-3.5 w-3.5 mr-1" />
                              发送提醒
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg bg-slate-50">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">无评审项目</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md">
                    该专家尚未分配任何评审项目或所有项目已被过滤。
                  </p>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    分配评审项目
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default ReviewCardView 