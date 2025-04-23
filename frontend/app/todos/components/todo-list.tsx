"use client"
import { useEffect, useMemo, useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import {
  Calendar,
  User,
  FileText,
  DollarSign,
  Award,
  Users,
  ShoppingCart,
  Presentation,
  GraduationCap,
  BookOpen,
  Shield,
  Globe,
  BarChart,
  PartyPopper,
  BadgeCheck,
  Leaf,
  BookMarked,
  Building,
  Landmark,
  Trophy,
  HardHat,
  School,
  Heart,
  BadgeIcon as Certificate,
  Lightbulb,
  Plane,
  ClipboardList,
  TreePine,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Pin,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import StatusList, {
  type StatusConfig,
  type ActionButton,
  type TagConfig,
  type MetadataField,
} from "@/components/status-list"
import { TodoPagination } from "./todo-pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"

// 定义 TodoItem 类型
interface TodoItem {
  id: number
  title: string
  description: string
  priority: string
  applicant: string
  type: string
  deadline: string
  status: string
  submittedAt: string
  completedAt?: string
  comments?: string
}

// 更新 TodoListProps 接口
interface TodoListProps {
  items: TodoItem[]
  viewMode: "card" | "list"
  onItemHover: (item: TodoItem | null) => void
  selectedItems: number[]
  onSelectItem: (id: number) => void
  onSelectAll: () => void
  allSelected: boolean
  showAiAssistant: boolean
  isLoading: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
}

// 添加自定义CSS样式
const useBreathingLightStyles = () => {
  useEffect(() => {
    // 创建样式元素
    const styleEl = document.createElement("style")
    styleEl.textContent = `
  :root {
    --primary-rgb: 124, 58, 237; /* 紫色的RGB值，与Tailwind的primary色调匹配 */
  }
  
  @keyframes breathe {
    0%, 100% {
      opacity: 0.6;
      box-shadow: 0 0 0 rgba(239, 68, 68, 0);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 5px rgba(239, 68, 68, 0.7);
    }
  }
  .urgent-badge {
    position: relative;
    animation: breathe 1.5s ease-in-out infinite;
  }

  .todo-card {
    transition: all 0.2s ease-in-out;
    position: relative;
    overflow: hidden;
  }

  .todo-card:hover {
    border-color: hsl(var(--primary)) !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .todo-card:hover h3 {
    font-weight: 600;
  }

  /* 添加列表项悬停动画 */
  .status-list-item {
    transition: all 0.2s ease-in-out;
  }

  .status-list-item:hover {
    background-color: hsl(var(--background));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
  }

  .service-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50px;
    min-width: 50px;
    margin-right: 12px;
  }
  
  .service-icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  
  .service-icon-text {
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  
  .card-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
  }
  
  .card-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    flex: 1;
    min-width: 0;
  }

  /* 添加钉住按钮样式 */
  .pin-button {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  
  .todo-card:hover .pin-button,
  .status-list-item:hover .pin-button {
    opacity: 1;
  }
  
  .pin-button.pinned {
    opacity: 1;
  }
`
    document.head.appendChild(styleEl)

    // 清理函数
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])
}

export default function TodoList({
  items,
  viewMode,
  onItemHover,
  selectedItems,
  onSelectItem,
  onSelectAll,
  allSelected,
  showAiAssistant,
  isLoading,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: TodoListProps) {
  const router = useRouter()

  // 使用传入的分页属性，计算总页数
  const totalPages = Math.ceil(items.length / itemsPerPage)

  // 添加钉住状态
  const [pinnedItemId, setPinnedItemId] = useState<number | null>(null)

  // 添加对话框状态
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [selectedItemForAction, setSelectedItemForAction] = useState<TodoItem | null>(null)
  const [approvalComment, setApprovalComment] = useState("")
  const [rejectionComment, setRejectionComment] = useState("")
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false)

  // 计算当前页显示的数据
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    // 确保每页固定显示itemsPerPage数量的项目（8个）
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  // 强制总页数至少为2页，确保显示分页控件
  const forcedTotalPages = Math.max(2, totalPages)

  // 页码变更处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 回到顶部
    window.scrollTo(0, 0)
  }

  // 添加呼吸灯样式
  useBreathingLightStyles()

  // 处理钉住功能
  const handlePinItem = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation() // 阻止事件冒泡

    // 如果点击的是当前已钉住的项目，则取消钉住
    if (pinnedItemId === itemId) {
      setPinnedItemId(null)
    } else {
      // 否则设置为钉住状态
      setPinnedItemId(itemId)
      // 同时触发悬停事件，显示该项目的详情
      const item = items.find((item) => item.id === itemId)
      if (item) {
        onItemHover(item)
      }
    }
  }

  // 修改鼠标悬停处理函数，考虑钉住状态
  const handleItemHover = (item: TodoItem | null) => {
    // 如果有钉住的项目，则不触发悬停事件
    if (pinnedItemId === null) {
      onItemHover(item)
    }
  }

  // 状态配置
  const statusConfigs: StatusConfig[] = [
    {
      value: "待审核",
      label: "待审核",
      color: "amber",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "#f59e0b",
      icon: <Clock className="h-3 w-3" />,
      urgent: false,
    },
    {
      value: "紧急",
      label: "紧急",
      color: "red",
      textColor: "text-white",
      bgColor: "bg-red-500",
      borderColor: "#dc2626",
      icon: <AlertTriangle className="h-3 w-3" />,
      urgent: true,
    },
  ]

  // 将原始类型映射到高校科研项目的相关内容
  const mapTypeToServiceName = (originalType: string): string => {
    switch (originalType) {
      case "项目申请":
      case "项目申报":
        return "科研立项"
      case "经费报销":
        return "经费报销"
      case "成果登记":
        return "成果登记"
      case "人员变更":
        return "人员变更"
      case "设备申购":
        return "设备采购"
      case "会议申请":
        return "学术会议"
      case "奖学金":
        return "奖学金"
      case "出版资助":
        return "出版资助"
      case "安全检查":
        return "实验安全"
      case "国际合作":
        return "国际合作"
      case "财务报告":
        return "财务报告"
      case "活动申请":
        return "学术活动"
      case "职称评审":
        return "职称评审"
      case "环保申请":
        return "环保申请"
      case "资源订阅":
        return "资源订阅"
      case "基础设施":
        return "基础设施"
      case "机构设立":
        return "机构设立"
      case "奖项申报":
        return "奖项申报"
      case "安全设施":
        return "安全设施"
      case "学科建设":
        return "学科建设"
      case "捐赠项目":
        return "捐赠项目"
      case "资质认证":
        return "资质认证"
      case "创新项目":
        return "创新项目"
      case "出国进修":
        return "国际交流"
      case "学术调查":
        return "学术调查"
      case "环境建设":
        return "环境建设"
      case "横向中检":
        return "横向项目"
      default:
        return originalType
    }
  }

  // 获取服务图标
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case "科研立项":
        return <FileText className="h-5 w-5" />
      case "经费报销":
        return <DollarSign className="h-5 w-5" />
      case "成果登记":
        return <Award className="h-5 w-5" />
      case "人员变更":
        return <Users className="h-5 w-5" />
      case "设备采购":
        return <ShoppingCart className="h-5 w-5" />
      case "学术会议":
        return <Presentation className="h-5 w-5" />
      case "奖学金":
        return <GraduationCap className="h-5 w-5" />
      case "出版资助":
        return <BookOpen className="h-5 w-5" />
      case "实验安全":
        return <Shield className="h-5 w-5" />
      case "国际合作":
        return <Globe className="h-5 w-5" />
      case "财务报告":
        return <BarChart className="h-5 w-5" />
      case "学术活动":
        return <PartyPopper className="h-5 w-5" />
      case "职称评审":
        return <BadgeCheck className="h-5 w-5" />
      case "环保申请":
        return <Leaf className="h-5 w-5" />
      case "资源订阅":
        return <BookMarked className="h-5 w-5" />
      case "基础设施":
        return <Building className="h-5 w-5" />
      case "机构设立":
        return <Landmark className="h-5 w-5" />
      case "奖项申报":
        return <Trophy className="h-5 w-5" />
      case "安全设施":
        return <HardHat className="h-5 w-5" />
      case "学科建设":
        return <School className="h-5 w-5" />
      case "捐赠项目":
        return <Heart className="h-5 w-5" />
      case "资质认证":
        return <Certificate className="h-5 w-5" />
      case "创新项目":
        return <Lightbulb className="h-5 w-5" />
      case "国际交流":
        return <Plane className="h-5 w-5" />
      case "学术调查":
        return <ClipboardList className="h-5 w-5" />
      case "环境建设":
        return <TreePine className="h-5 w-5" />
      case "横向项目":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // 获取类型对应的颜色 - 确保所有图标都有彩色
  const getTypeColor = (type: string) => {
    const serviceName = mapTypeToServiceName(type)

    switch (serviceName) {
      case "科研立项":
        return { textColor: "text-blue-600", bgColor: "bg-blue-50" }
      case "经费报销":
        return { textColor: "text-green-600", bgColor: "bg-green-50" }
      case "成果登记":
        return { textColor: "text-purple-600", bgColor: "bg-purple-50" }
      case "人员变更":
        return { textColor: "text-amber-600", bgColor: "bg-amber-50" }
      case "设备采购":
        return { textColor: "text-indigo-600", bgColor: "bg-indigo-50" }
      case "学术会议":
        return { textColor: "text-red-600", bgColor: "bg-red-50" }
      case "奖学金":
        return { textColor: "text-emerald-600", bgColor: "bg-emerald-50" }
      case "出版资助":
        return { textColor: "text-pink-600", bgColor: "bg-pink-50" }
      case "实验安全":
        return { textColor: "text-orange-600", bgColor: "bg-orange-50" }
      case "国际合作":
        return { textColor: "text-sky-600", bgColor: "bg-sky-50" }
      case "财务报告":
        return { textColor: "text-teal-600", bgColor: "bg-teal-50" }
      case "学术活动":
        return { textColor: "text-rose-600", bgColor: "bg-rose-50" }
      case "职称评审":
        return { textColor: "text-violet-600", bgColor: "bg-violet-50" }
      case "环保申请":
        return { textColor: "text-lime-600", bgColor: "bg-lime-50" }
      case "资源订阅":
        return { textColor: "text-fuchsia-600", bgColor: "bg-fuchsia-50" }
      case "基础设施":
        return { textColor: "text-cyan-600", bgColor: "bg-cyan-50" }
      case "机构设立":
        return { textColor: "text-yellow-600", bgColor: "bg-yellow-50" }
      case "奖项申报":
        return { textColor: "text-blue-600", bgColor: "bg-blue-50" }
      case "安全设施":
        return { textColor: "text-red-600", bgColor: "bg-red-50" }
      case "学科建设":
        return { textColor: "text-indigo-600", bgColor: "bg-indigo-50" }
      case "捐赠项目":
        return { textColor: "text-pink-600", bgColor: "bg-pink-50" }
      case "资质认证":
        return { textColor: "text-amber-600", bgColor: "bg-amber-50" }
      case "创新项目":
        return { textColor: "text-purple-600", bgColor: "bg-purple-50" }
      case "国际交流":
        return { textColor: "text-sky-600", bgColor: "bg-sky-50" }
      case "学术调查":
        return { textColor: "text-emerald-600", bgColor: "bg-emerald-50" }
      case "环境建设":
        return { textColor: "text-green-600", bgColor: "bg-green-50" }
      case "横向项目":
        return { textColor: "text-cyan-600", bgColor: "bg-cyan-50" }
      case "结项":
        return { textColor: "text-orange-600", bgColor: "bg-orange-50" }
      default:
        return { textColor: "text-blue-600", bgColor: "bg-blue-50" }
    }
  }

  // 修改标签配置 - 保持图标彩色，文字为默认色
  const tagConfig: TagConfig = {
    field: "type",
    getLabel: (value) => mapTypeToServiceName(value),
    getColor: (value) => getTypeColor(value),
    getIcon: (value) => getServiceIcon(mapTypeToServiceName(value)),
    position: "prefix",
    vertical: true,
    customRender: (value) => (
      <div className="flex flex-col items-center justify-center w-14 min-w-14">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-1 ${getTypeColor(value).bgColor}`}>
          <span className={getTypeColor(value).textColor}>{getServiceIcon(mapTypeToServiceName(value))}</span>
        </div>
        <span className="text-xs font-medium text-center leading-tight text-slate-700">
          {mapTypeToServiceName(value)}
        </span>
      </div>
    ),
  }

  // 元数据字段配置
  const metadataFields: MetadataField[] = [
    {
      key: "applicant",
      icon: <User className="h-3.5 w-3.5 text-muted-foreground" />,
    },
    {
      key: "deadline",
      icon: <Calendar className="h-3.5 w-3.5 text-muted-foreground" />,
    },
  ]

  // 修改操作按钮配置 - 移除直接操作按钮，全部放入下拉菜单
  const actions: ActionButton[] = []

  // 修改下拉菜单操作 - 添加查看详情选项
  const dropdownActions: ActionButton[] = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-4 w-4 text-muted-foreground" />,
      onClick: (item) => router.push(`/todos/${item.id}`),
      condition: () => true,
    },
    {
      id: "approve",
      label: "通过",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      onClick: (item) => handleApprove(item),
      condition: (item) => item.status === "待审核",
    },
    {
      id: "reject",
      label: "退回",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      onClick: (item) => handleReject(item),
      condition: (item) => item.status === "待审核",
    },
  ]

  // 处理优先级
  const processedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      // 如果优先级是"紧急"，则将状态设置为"紧急"以便应用紧急样式
      displayStatus: item.priority === "紧急" ? "紧急" : item.status,
    }))
  }, [items])

  // 处理点击项目，导航到详情页
  const handleItemClick = (id: number) => {
    router.push(`/todos/${id}`)
  }

  // 处理通过操作
  const handleApprove = (item: TodoItem) => {
    setSelectedItemForAction(item);
    setShowApprovalDialog(true);
  };

  // 处理退回操作
  const handleReject = (item: TodoItem) => {
    setSelectedItemForAction(item);
    setShowRejectionDialog(true);
  };

  // 处理确认通过
  const handleConfirmApproval = () => {
    if (!selectedItemForAction) return;
    
    setIsSubmittingApproval(true);
    
    // 模拟API调用
    setTimeout(() => {
      console.log("通过", selectedItemForAction, "审核意见:", approvalComment);
      setShowApprovalDialog(false);
      setSelectedItemForAction(null);
      setApprovalComment("");
      setIsSubmittingApproval(false);
      
      toast({
        title: "审批成功",
        description: "项目已成功通过",
      });
    }, 800);
  };

  // 处理确认退回
  const handleConfirmRejection = () => {
    if (!selectedItemForAction || !rejectionComment.trim()) {
      toast({
        title: "请填写退回原因",
        description: "退回操作需要填写退回原因",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingRejection(true);
    
    // 模拟API调用
    setTimeout(() => {
      console.log("退回", selectedItemForAction, "退回原因:", rejectionComment);
      setShowRejectionDialog(false);
      setSelectedItemForAction(null);
      setRejectionComment("");
      setIsSubmittingRejection(false);
      
      toast({
        title: "退回成功",
        description: "项目已成功退回",
      });
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100">
        <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <div className="text-lg font-medium text-muted-foreground mb-1">没有待审核事项</div>
        <div className="text-sm text-muted-foreground">当前没有符合筛选条件的待办事项</div>
      </div>
    )
  }

  // 修改 renderPriorityBadge 函数，使其在已审核状态下不显示优先级
  const renderPriorityBadge = (priority: string, isCardView = false) => {
    switch (priority) {
      case "紧急":
        return <Badge className="text-white bg-red-500 ml-2 shrink-0 urgent-badge">{priority}</Badge>
      case "一般":
        return isCardView ? null : <Badge className="text-amber-500 bg-amber-50 ml-2 shrink-0">{priority}</Badge>
      case "普通":
        return isCardView ? null : <Badge className="text-green-500 bg-green-50 ml-2 shrink-0">{priority}</Badge>
      default:
        return null
    }
  }

  return (
    <div className={`w-full ${showAiAssistant ? 'content-with-ai-panel' : ''}`}>
      {viewMode === "card" ? (
        <div
          className={`grid grid-cols-1 ${showAiAssistant ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"} gap-4`}
        >
          {paginatedItems.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100">
              <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <div className="text-lg font-medium text-muted-foreground mb-1">没有待审核事项</div>
              <div className="text-sm text-muted-foreground">当前没有符合筛选条件的待办事项</div>
            </div>
          ) : (
            paginatedItems.map((item) => (
              // 移除卡片的外部填充和背景
              <Card
                key={item.id}
                className={`todo-card hover:shadow-md transition-all duration-200 cursor-pointer relative ${
                  item.priority === "紧急" ? "urgent" : ""
                } ${selectedItems.includes(item.id) ? "border-primary bg-primary/5" : "border border-slate-200"} rounded-xl`}
                onMouseEnter={() => handleItemHover(item)}
                onMouseLeave={() => handleItemHover(null)}
                onClick={() => handleItemClick(item.id)}
                style={{ cursor: "pointer" }}
              >
                {/* 卡片内容 */}
                <CardContent className="p-4 pt-5">
                  <div className="flex">
                    {/* 服务类型图标和名称 - 修改为默认色 */}
                    <div className="service-icon">
                      <div className={`service-icon-circle ${getTypeColor(item.type).bgColor}`}>
                        <span className={getTypeColor(item.type).textColor}>
                          {getServiceIcon(mapTypeToServiceName(item.type))}
                        </span>
                      </div>
                      <span className="service-icon-text text-slate-700">{mapTypeToServiceName(item.type)}</span>
                    </div>

                    {/* 卡片内容 */}
                    <div className="card-content">
                      <div className="card-title-row">
                        <h3 className="card-title font-semibold">{item.title}</h3>
                        {renderPriorityBadge(item.priority, true)}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 mb-3 line-clamp-2">{item.description}</p>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate">{item.applicant}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium truncate">{item.deadline}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="truncate">提交于: {item.submittedAt}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* 添加钉住按钮 */}
                          <Button
                            size="sm"
                            variant={pinnedItemId === item.id ? "default" : "outline"}
                            className={`h-8 px-2 transition-all duration-200 pin-button ${pinnedItemId === item.id ? "pinned" : ""}`}
                            onClick={(e) => handlePinItem(e, item.id)}
                          >
                            <Pin
                              className={`h-3.5 w-3.5 ${pinnedItemId === item.id ? "text-white" : "text-muted-foreground"}`}
                            />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 transition-all duration-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/todos/${item.id}`)
                                }}
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApprove(item)
                                }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                通过
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReject(item)
                                }}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                                退回
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div 
          className="p-6" 
          style={{ 
            borderRadius: '0px !important', 
            overflow: 'hidden'
          }}
        >
          <style jsx global>{`
            .status-list-item {
              border-radius: 0 !important;
              background: transparent !important;
            }
            .status-list-item:hover {
              border-radius: 0 !important;
              background: var(--background) !important;
            }
            html, body {
              overflow-x: hidden;
              overflow-y: auto !important;
            }
            #__next, main, .layout-container {
              overflow: hidden !important;
            }
          `}</style>
          <StatusList
            items={paginatedItems}
            statusConfig={statusConfigs}
            tagConfig={tagConfig}
            metadataFields={metadataFields}
            actions={actions}
            dropdownActions={dropdownActions}
            selectedItems={selectedItems}
            onSelectItem={onSelectItem}
            onItemHover={handleItemHover}
            showCheckbox={true}
            allSelected={allSelected}
            onSelectAll={onSelectAll}
            isLoading={isLoading}
            emptyMessage="没有找到符合条件的待办事项"
            className=""
            onItemClick={(item) => handleItemClick(item.id)}
            itemClassName="status-list-item cursor-pointer"
            renderExtraContent={(item) => (
              <Button
                size="sm"
                variant={pinnedItemId === item.id ? "default" : "outline"}
                className={`h-8 px-2 transition-all duration-200 pin-button ${pinnedItemId === item.id ? "pinned" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePinItem(e, item.id)
                }}
                style={{ borderRadius: '0px !important' }}
              >
                <Pin className={`h-3.5 w-3.5 ${pinnedItemId === item.id ? "text-white" : "text-muted-foreground"}`} />
              </Button>
            )}
          />
        </div>
      )}

      {/* 使用新的分页组件 - 强制显示分页，不管是否有数据 */}
      <div className="border-t mt-4 pt-4">
        <TodoPagination 
          currentPage={currentPage}
          totalPages={forcedTotalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {isLoading && (
        <div className="py-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium">加载更多...</span>
          </div>
        </div>
      )}

      {/* 添加审批对话框 */}
      <Dialog 
        open={showApprovalDialog} 
        onOpenChange={(isOpen: boolean) => {
          setShowApprovalDialog(isOpen);
          if (!isOpen) {
            setApprovalComment("");
            setSelectedItemForAction(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              审批通过确认
            </DialogTitle>
            <DialogDescription>
              您正在审批通过 <span className="font-medium text-foreground">{selectedItemForAction?.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* AI 审核建议 */}
            <div className="bg-primary/5 p-4 rounded-md border border-primary/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">AI 审核建议</h4>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const aiSuggestion = "该项目材料完整，预算合理，符合规定要求，建议通过审批。";
                    setApprovalComment(aiSuggestion);
                    toast({
                      title: "已应用AI建议",
                      description: "AI审核建议已应用到审核意见",
                    });
                  }}
                >
                  应用建议
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                该项目材料完整，预算合理，符合规定要求，建议通过审批。
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="approval-comment" className="text-sm font-medium">
                审核意见 (选填)
              </label>
              <Textarea
                id="approval-comment"
                placeholder="请输入审核意见..."
                className="min-h-[100px]"
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)} disabled={isSubmittingApproval}>
              取消
            </Button>
            <Button onClick={handleConfirmApproval} disabled={isSubmittingApproval}>
              {isSubmittingApproval ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin inline-block border-2 border-current border-t-transparent rounded-full"></span>
                  处理中...
                </>
              ) : (
                <>确认通过</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加退回对话框 */}
      <Dialog 
        open={showRejectionDialog} 
        onOpenChange={(isOpen: boolean) => {
          setShowRejectionDialog(isOpen);
          if (!isOpen) {
            setRejectionComment("");
            setSelectedItemForAction(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              退回确认
            </DialogTitle>
            <DialogDescription>
              您正在退回 <span className="font-medium text-foreground">{selectedItemForAction?.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* AI 审核建议 */}
            <div className="bg-primary/5 p-4 rounded-md border border-primary/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">AI 退回建议</h4>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const aiSuggestion = "该项目材料不完整，缺少预算明细和实施计划，预算金额超出部门限额，建议退回修改。";
                    setRejectionComment(aiSuggestion);
                    toast({
                      title: "已应用AI建议",
                      description: "AI退回建议已应用到退回原因",
                    });
                  }}
                >
                  应用建议
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                该项目材料不完整，缺少预算明细和实施计划，预算金额超出部门限额，建议退回修改。
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reject-comment" className="text-sm font-medium">
                退回原因 <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="reject-comment"
                placeholder="请输入退回原因..."
                className="min-h-[100px]"
                required
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)} disabled={isSubmittingRejection}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmRejection} disabled={isSubmittingRejection}>
              {isSubmittingRejection ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin inline-block border-2 border-current border-t-transparent rounded-full"></span>
                  处理中...
                </>
              ) : (
                <>确认退回</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
