import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, MouseEvent } from "react"
import { ChevronDown, ChevronRight, Play, Edit, Trash, CheckCircle, Eye, MoreHorizontal, FileText, Users, ChevronLeft, ChevronRightIcon, MoreVertical, Loader2, FilePlus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ApplicationItem, ProjectItem } from "../types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

interface CardViewProps {
  items: ApplicationItem[]
  batchProjects: Record<string, ProjectItem[]>
  expandedBatches: Record<string, boolean>
  activeTab: "application" | "review"
  onToggleBatchExpand: (batchId: string) => void
  onStartStop: (item: ApplicationItem) => void
  onEdit: (item: ApplicationItem) => void
  onDelete: (item: ApplicationItem) => void
  onReview: (item: ProjectItem) => void
  onAssignExperts: (item: ProjectItem) => void
  onOpinionSummary: (item: ProjectItem) => void
  onView: (item: ProjectItem) => void
  onEditProject: (item: ProjectItem) => void
  onDeleteProject: (item: ProjectItem) => void
  onSelectAll?: (checked: boolean) => void
  onSelectProject?: (projectId: string, checked: boolean) => void
  onTransferToReview: (item: ApplicationItem) => Promise<void>
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

// 用于卡片上的下拉菜单组件
interface CardActionMenuProps {
  item: ApplicationItem;
  onStartStop: (item: ApplicationItem) => void;
  onEdit: (item: ApplicationItem) => void;
  handleDeleteClick: (item: ApplicationItem) => void;
  onTransferToReview: (item: ApplicationItem) => void;
}

const CardActionMenu = ({ item, onStartStop, onEdit, handleDeleteClick, onTransferToReview }: CardActionMenuProps) => {
  const { toast } = useToast();
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  
  // 获取批次状态
  const now = new Date();
  const startDate = new Date(item.date);
  const endDate = new Date(item.deadline);
  
  let status = "未开始";
  let actionText = "启动批次";
  
  if (now > endDate) {
    status = "已结束";
    actionText = "启动批次";
  } else if (now >= startDate) {
    status = "进行中";
    actionText = "停止批次";
  }
  
  return (
    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/20 focus:bg-white/20">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStartStop(item)}>
            {actionText === "启动批次" ? (
              <Play className="mr-2 h-4 w-4" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            )}
            {actionText}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          {status === "已结束" && item.batch === "申报批次" && (
            <DropdownMenuItem onClick={() => setShowTransferDialog(true)}>
              <ArrowRight className="mr-2 h-4 w-4" />
              转入评审
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 转入评审确认对话框 */}
      <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认转入评审</AlertDialogTitle>
            <AlertDialogDescription>
              确定要将"{item.name}"转入评审阶段吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowTransferDialog(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onTransferToReview(item)}>
              确认转入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const CardView: React.FC<CardViewProps> = ({
  items,
  batchProjects,
  expandedBatches,
  activeTab,
  onToggleBatchExpand,
  onStartStop,
  onEdit,
  onDelete,
  onReview,
  onAssignExperts,
  onOpinionSummary,
  onView,
  onEditProject,
  onDeleteProject,
  onSelectAll,
  onSelectProject,
  onTransferToReview
}) => {
  const router = useRouter()
  const [selectedApplicationItem, setSelectedApplicationItem] = useState<ApplicationItem | null>(null)
  const [selectedReviewItem, setSelectedReviewItem] = useState<ApplicationItem | null>(null)
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
  const [showEndedDialog, setShowEndedDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast();
  const [showTransferDialog, setShowTransferDialog] = useState(false)

  useEffect(() => {
    const applicationItems = items.filter(item => item.batch === "申报批次")
    const reviewItems = items.filter(item => item.batch === "评审批次")
    
    if (activeTab === "application" && applicationItems.length > 0 && !selectedApplicationItem) {
      setSelectedApplicationItem(applicationItems[0])
    } else if (activeTab === "review" && reviewItems.length > 0 && !selectedReviewItem) {
      setSelectedReviewItem(reviewItems[0])
    }
    
    // 添加入场动画延迟
    setMounted(false)
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [items, activeTab])

  // 获取当前选中的项目
  const selectedItem = activeTab === "application" ? selectedApplicationItem : selectedReviewItem

  // 更新选中项目的处理函数
  const handleSelectItem = (item: ApplicationItem) => {
    if (!isDragging) {
      if (activeTab === "application") {
        setSelectedApplicationItem(item)
      } else {
        setSelectedReviewItem(item)
      }
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
    if (item.batch === "评审批次") {
      router.push(`/applications/review-projects?batch=${item.batchNumber}`)
    } else {
      router.push(`/applications/projects?batch=${item.batchNumber}`)
    }
  }

  const getStatusBadge = (item: ApplicationItem) => {
    const now = new Date()
    const startDate = new Date(item.date)
    const endDate = new Date(item.deadline)

    let status = "未开始"
    if (now > endDate) {
      status = "已结束"
    } else if (now >= startDate) {
      status = "进行中"
    }

    return (
      <Badge
        variant={getStatusVariant(status as StatusType)}
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
    if (checked === true) {
      const allProjectIds = Object.values(batchProjects).flat().map(project => project.id)
      setSelectedProjects(new Set(allProjectIds))
      setAllSelected(true)
    } else {
      setSelectedProjects(new Set())
      setAllSelected(false)
    }
  }

  const handleSelectProject = (projectId: string, checked: CheckedState) => {
    const newSelected = new Set(selectedProjects)
    if (checked === true) {
      newSelected.add(projectId)
    } else {
      newSelected.delete(projectId)
    }
    setSelectedProjects(newSelected)
    
    // Update allSelected state
    const allProjectIds = Object.values(batchProjects).flat().map(project => project.id)
    setAllSelected(allProjectIds.every(id => newSelected.has(id)))
  }

  // 处理批次删除
  const handleDeleteClick = (item: ApplicationItem) => {
    setItemToDelete(item)
    setShowDeleteDialog(true)
  }

  // 确认删除批次
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setIsDeleting(true)
      try {
        await onDelete(itemToDelete)
        toast({
          title: "删除成功",
          description: "已成功删除该批次及其相关数据",
        })
      } finally {
        setIsDeleting(false)
        setShowDeleteDialog(false)
        setItemToDelete(null)
      }
    }
  }

  // 处理项目删除
  const handleProjectDeleteClick = (project: ProjectItem) => {
    setProjectToDelete(project)
    setShowProjectDeleteDialog(true)
  }

  // 确认删除项目
  const handleConfirmProjectDelete = async () => {
    if (projectToDelete) {
      setIsDeletingProject(true)
      try {
        await onDeleteProject(projectToDelete)
        toast({
          title: "删除成功",
          description: "已成功删除该项目",
        })
      } finally {
        setIsDeletingProject(false)
        setShowProjectDeleteDialog(false)
        setProjectToDelete(null)
      }
    }
  }

  // 处理启动/停止操作
  const handleStartStop = (item: ApplicationItem) => {
    // 直接调用父组件传入的onStartStop函数
    onStartStop(item)
  }

  // 处理新建申报书
  const handleCreateForm = (batchId: string) => {
    router.push(`/applications/forms/create?batchId=${batchId}`)
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

  // 在CardView组件内添加一个辅助函数，用于下拉菜单项的显示
  const getStartStopMenuItem = (item: ApplicationItem) => {
    const { status, actionText } = getBatchStatusAndAction(item)
    
    return (
      <DropdownMenuItem onClick={() => onStartStop(item)}>
        {actionText === "启动批次" ? (
          <Play className="mr-2 h-4 w-4" />
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2 h-4 w-4"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        )}
        <span>{actionText}</span>
      </DropdownMenuItem>
    )
  }

  // 修改转入评审的处理函数
  const handleTransferToReview = async (item: ApplicationItem) => {
    setShowTransferDialog(true)
  }

  // 添加确认转入评审的处理函数
  const handleConfirmTransfer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    try {
      // 更新批次状态
      const updatedBatch = {
        ...selectedItem,
        batch: "评审批次",
        status: "待评审"
      };



      // 提示成功
      toast({
        title: "转入评审成功",
        description: `批次"${selectedItem.name}"已成功转入评审阶段`,
        variant: "default"
      });

      // 关闭确认对话框
      setShowTransferDialog(false);

    } catch (error) {
      console.error('转入评审失败:', error);
      toast({
        title: "转入评审失败",
        description: "操作过程中发生错误，请稍后重试",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-4 transition-all duration-500 ease-out ${
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
                        {item.batch === "评审批次" ? "评审进度" : "申报进度"}
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
                    <span>创建时间：</span>
                    <span className={selectedItem?.id === item.id ? "text-primary-foreground" : "text-slate-900"}>
                      {item.date}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 下方详情展示 */}
      {selectedItem && (
        <div className={`space-y-4 transition-all duration-500 ease-out ${
          mounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4"
        }`}>
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
                <h3 className="text-lg font-medium">
                  {activeTab === "application" ? "申报批次详情" : "评审批次详情"}
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                {activeTab === "application" && (
                  <Button 
                    variant="default"
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={(e) => { 
                      e.stopPropagation()
                      handleCreateForm(selectedItem.id)
                    }}
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    新建申报书
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => { 
                    e.stopPropagation()
                    handleStartStop(selectedItem)
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
                        {actionText === "启动批次" ? "启动批次" : "停止批次"}
                      </>
                    )
                  })()}
                </Button>
                {(() => {
                  const { status } = getBatchStatusAndAction(selectedItem);
                  return status === "已结束" && selectedItem.batch === "申报批次" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => { 
                        e.stopPropagation()
                        handleTransferToReview(selectedItem)
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      转入评审
                    </Button>
                  );
                })()}
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
                    <span className="text-muted-foreground block mb-1">类别</span>
                    <span className="text-slate-900 font-medium">{selectedItem.category}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">金额</span>
                    <span className="text-slate-900 font-medium">{selectedItem.amount.toFixed(2)}万元</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">{selectedItem.batch === "评审批次" ? "评审进度" : "申报进度"}</span>
                    <span className="text-slate-900 font-medium">{selectedItem.progress}%</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">申报日期</span>
                    <span className="text-slate-900 font-medium">{selectedItem.date}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">截止日期</span>
                    <span className="text-slate-900 font-medium">{selectedItem.deadline}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">批次编号</span>
                    <span className="text-slate-900 font-medium">{selectedItem.batchNumber}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">项目数量</span>
                    <span className="text-slate-900 font-medium">{selectedItem.projectCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 项目列表 */}
          <div className="bg-white rounded-lg p-5">
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
                  <TableHead className="w-[300px]">项目</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead className="w-[100px]">项目状态</TableHead>
                  <TableHead className="w-[100px]">审核状态</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>进度</TableHead>
                  <TableHead className="text-right pr-6">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchProjects[selectedItem?.id || ""]?.map((project, index) => (
                  <TableRow key={project.id} className="hover:bg-slate-50">
                    <TableCell className="pl-6">
                      <Checkbox 
                        checked={selectedProjects.has(project.id)}
                        onCheckedChange={(checked) => handleSelectProject(project.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-slate-900">{project.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{project.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{project.manager?.department || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(project.status as StatusType)} className="inline-flex items-center whitespace-nowrap min-w-fit px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="inline-flex items-center whitespace-nowrap min-w-fit px-2 py-0.5 bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200">
                        待审核
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-2">
                          {project.manager?.name?.[0] || "?"}
                        </div>
                        <span>{project.manager?.name || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-full h-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-progress"
                            style={{ 
                              width: `${project.progress || 0}%`,
                              animationDelay: `${index * 100 + 500}ms`
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 whitespace-nowrap">{project.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(project)}>
                            <Eye className="mr-2 h-4 w-4" />
                            查看申报书
                          </DropdownMenuItem>
                          {activeTab === "application" ? (
                            <>
                              <DropdownMenuItem onClick={() => onReview(project)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                审核申报书
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => onAssignExperts(project)}>
                                <Users className="mr-2 h-4 w-4" />
                                分派专家
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onOpinionSummary(project)}>
                                <FileText className="mr-2 h-4 w-4" />
                                意见汇总
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => onEditProject(project)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑申报书
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleProjectDeleteClick(project)} 
                            className="text-destructive focus:bg-destructive/10"
                          >
                            {isDeletingProject ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="mr-2 h-4 w-4" />
                            )}
                            删除申报书
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 删除批次确认弹框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除"{itemToDelete?.name}"吗？此操作无法撤销，相关的所有数据都将被永久删除。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  删除中...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  删除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除项目确认弹框 */}
      <Dialog open={showProjectDeleteDialog} onOpenChange={setShowProjectDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除"{projectToDelete?.name}"吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDeleteDialog(false)} disabled={isDeletingProject}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmProjectDelete} disabled={isDeletingProject}>
              {isDeletingProject ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  删除中...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  删除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 已结束提示弹框 */}
      <Dialog open={showEndedDialog} onOpenChange={setShowEndedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>操作提示</DialogTitle>
            <DialogDescription>
              该批次已结束，无法进行启动或停止操作。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => setShowEndedDialog(false)}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 转入评审确认对话框 */}
      <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认转入评审</AlertDialogTitle>
            <AlertDialogDescription>
              确定要将"{selectedItem?.name}"转入评审阶段吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowTransferDialog(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              确认转入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 