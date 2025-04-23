import { useRouter } from "next/navigation"
import { useState, useRef, MouseEvent } from "react"
import { ChevronDown, ChevronRight, Play, Edit, Trash, CheckCircle, Eye, MoreHorizontal, ArrowRight, MoreVertical, Loader2, ChevronLeft, ChevronRightIcon,FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ApplicationItem, ProjectItem } from "../types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface ApplicationCardViewProps {
  items: ApplicationItem[]
  batchProjects: Record<string, ProjectItem[]>
  expandedBatches: Record<string, boolean>
  onToggleBatchExpand: (batchId: string) => void
  onStartStop: (item: ApplicationItem) => void
  onEdit: (item: ApplicationItem) => void
  onDelete: (item: ApplicationItem) => void
  onReview: (item: ProjectItem) => void
  onView: (item: ProjectItem) => void
  onEditProject: (item: ProjectItem) => void
  onDeleteProject: (item: ProjectItem) => void
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

export const ApplicationCardView: React.FC<ApplicationCardViewProps> = ({
  items,
  batchProjects,
  expandedBatches,
  onToggleBatchExpand,
  onStartStop,
  onEdit,
  onDelete,
  onReview,
  onView,
  onEditProject,
  onDeleteProject,
  onTransferToReview
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedApplicationItem, setSelectedApplicationItem] = useState<ApplicationItem | null>(items.length > 0 ? items[0] : null)
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
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [itemToTransfer, setItemToTransfer] = useState<ApplicationItem | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)
  const [mounted, setMounted] = useState(true)

  // 获取当前选中的项目
  const selectedItem = selectedApplicationItem

  const handleSelectItem = (item: ApplicationItem) => {
    if (!isDragging) {
      setSelectedApplicationItem(item)
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
    router.push(`/applications/projects?batch=${item.batchNumber}`)
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

  const handleTransferClick = (item: ApplicationItem) => {
    setItemToTransfer(item)
    setShowTransferDialog(true)
  }

  const handleConfirmTransfer = async () => {
    if (itemToTransfer) {
      setIsTransferring(true)
      try {
        await onTransferToReview(itemToTransfer)
        setShowTransferDialog(false)
        toast({
          title: "转入评审成功",
          description: `已将 "${itemToTransfer.name}" 转入评审阶段`,
        })
      } catch (error) {
        toast({
          title: "转入评审失败",
          description: "操作过程中发生错误，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsTransferring(false)
      }
    }
  }

  const canTransferToReview = (item: ApplicationItem) => {
    const now = new Date()
    const endDate = new Date(item.deadline)
    return now > endDate
  }

 // 处理新建申报书
  const handleCreateForm = (batchId: string) => {
    const batch = items.find(item => item.id === batchId);
    // 保存批次ID，并跳转到创建申报表单页面
    router.push(`/applications/forms/create?batchId=${batchId}${batch?.formGenerationType ? `&formType=${encodeURIComponent(batch.formGenerationType)}` : ''}`);
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
    return <div className="p-8 text-center text-muted-foreground">没有申报批次可显示</div>
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
                        审核进度
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
                    <span>申报期限：</span>
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
                <h3 className="text-lg font-medium">申报批次详情</h3>
              </div>
              <div className="flex items-center space-x-3">
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
                {canTransferToReview(selectedItem) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => { 
                      e.stopPropagation()
                      handleTransferClick(selectedItem)
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    转入评审
                  </Button>
                )}

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
                    <span className="text-muted-foreground block mb-1">项目性质</span>
                    <span className="text-slate-900 font-medium">{selectedItem.type}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">项目分类</span>
                    <span className="text-slate-900 font-medium">{selectedItem.category}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">申报书生成方式</span>
                    <span className="text-slate-900 font-medium">{(selectedItem as any).formGenerationType || "未设置"}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">审核进度</span>
                    <span className="text-slate-900 font-medium">{selectedItem.progress}%</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">申报开始日期</span>
                    <span className="text-slate-900 font-medium">{format(new Date(selectedItem.date), "yyyy/MM/dd")}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">申报截止日期</span>
                    <span className="text-slate-900 font-medium">{format(new Date(selectedItem.deadline), "yyyy/MM/dd")}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-md">
                    <span className="text-muted-foreground block mb-1">申报总金额</span>
                    <span className="text-slate-900 font-medium">{selectedItem.amount.toFixed(2)}万元</span>
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
                  <TableHead className="w-[300px]">项目名称</TableHead>
                  <TableHead>申请人</TableHead>
                  <TableHead>所属部门</TableHead>
                  <TableHead>金额（万元）</TableHead>
                  <TableHead>申请日期</TableHead>
                  <TableHead>项目状态</TableHead>
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
                    <TableCell>{project.manager?.name || "-"}</TableCell>
                    <TableCell>{project.manager?.department || "-"}</TableCell>
                    <TableCell>{project.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{(project as any).applyDate ? format(new Date((project as any).applyDate), "yyyy/MM/dd") : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (project as any).status === "已立项" ? "default" : 
                          (project as any).status === "已退回" ? "destructive" : 
                          (project as any).status === "评审中" ? "outline" : 
                          (project as any).status === "准备中" ? "outline" : 
                          "secondary"
                        }
                      >
                        {(project as any).status || "准备中"}
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
                          <DropdownMenuItem onClick={() => onView(project)}>
                            <Eye className="mr-2 h-4 w-4" />
                            查看申报书
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReview(project)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            审核申报书
                          </DropdownMenuItem>
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

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              你确定要删除申报批次 "{itemToDelete?.name}" 吗？此操作不可撤销。
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
              你确定要删除申报项目 "{projectToDelete?.name}" 吗？此操作不可撤销。
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

      {/* 转入评审确认对话框 */}
      <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认转入评审</AlertDialogTitle>
            <AlertDialogDescription>
              你确定要将申报批次 "{itemToTransfer?.name}" 转入评审阶段吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmTransfer}
            >
              {isTransferring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              确认转入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ApplicationCardView 