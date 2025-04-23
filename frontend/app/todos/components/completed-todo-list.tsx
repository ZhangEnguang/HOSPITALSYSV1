"use client"

import { useEffect, useState, useMemo } from "react"
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
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import StatusList, {
  type StatusConfig,
  type ActionButton,
  type TagConfig,
  type MetadataField,
} from "@/components/status-list"
import { TodoPagination } from "./todo-pagination"

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

// 在 CompletedTodoListProps 接口中添加分页相关属性
interface CompletedTodoListProps {
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

// 修复可能的语法问题
const useCustomStyles = () => {
  useEffect(() => {
    // 创建样式元素
    const styleEl = document.createElement("style")
    styleEl.textContent = `
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
    
    .audit-step {
      position: relative;
    }
    
    .audit-step:not(:last-child)::before {
      content: '';
      position: absolute;
      top: 24px;
      bottom: -8px;
      left: 12px;
      width: 2px;
      background-color: #e5e7eb;
      z-index: 0;
    }
    
    .audit-step.completed:not(:last-child)::before {
      background-color: #10b981;
    }
    
    .audit-step.rejected:not(:last-child)::before {
      background-color: #ef4444;
    }
    
    .audit-step.current:not(:last-child)::before {
      background: linear-gradient(to bottom, #10b981 0%, #e5e7eb 100%);
    }
    
    .audit-badge {
      position: relative;
      z-index: 10;
      transition: all 0.2s ease;
    }
    
    .audit-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  `
    document.head.appendChild(styleEl)

    // 清理函数
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])
}

// 在 CompletedTodoList 组件内部，在 return 语句前添加分页逻辑
export default function CompletedTodoList({
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
}: CompletedTodoListProps) {
  const router = useRouter()

  // 使用传入的分页属性，计算总页数
  const totalPages = Math.ceil(items.length / itemsPerPage)
  
  // 强制总页数至少为2页，确保显示分页控件
  const forcedTotalPages = Math.max(2, totalPages)

  // 计算当前页显示的数据
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    // 确保返回的数组长度不超过 itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  // 页码变更处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 回到顶部
    window.scrollTo(0, 0)
  }

  // 添加自定义样式
  useCustomStyles()

  // 状态配置
  const statusConfigs: StatusConfig[] = [
    {
      value: "已通过",
      label: "已通过",
      color: "green",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "#10b981",
      icon: <CheckCircle className="h-3 w-3" />,
      urgent: false,
    },
    {
      value: "已退回",
      label: "已退回",
      color: "red",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "#ef4444",
      icon: <XCircle className="h-3 w-3" />,
      urgent: false,
    },
    {
      value: "已完结",
      label: "已完结",
      color: "slate",
      textColor: "text-slate-700",
      bgColor: "bg-slate-50",
      borderColor: "#64748b",
      urgent: false,
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

  // 根据事项类型获取颜色
  const getTypeColor = (type: string): { textColor: string; bgColor: string } => {
    switch (type) {
      case "报销申请":
        return { textColor: "text-violet-600", bgColor: "bg-violet-50" }
      case "休假申请":
        return { textColor: "text-sky-600", bgColor: "bg-sky-50" }
      case "采购申请":
        return { textColor: "text-amber-600", bgColor: "bg-amber-50" }
      case "出差申请":
        return { textColor: "text-emerald-600", bgColor: "bg-emerald-50" }
      case "请示报告":
        return { textColor: "text-rose-600", bgColor: "bg-rose-50" }
      case "会议室预订":
        return { textColor: "text-blue-600", bgColor: "bg-blue-50" }
      case "合同审批":
        return { textColor: "text-orange-600", bgColor: "bg-orange-50" }
      case "财务审批":
        return { textColor: "text-indigo-600", bgColor: "bg-indigo-50" }
      case "人事调动":
        return { textColor: "text-red-600", bgColor: "bg-red-50" }
      case "资产移交":
        return { textColor: "text-lime-600", bgColor: "bg-lime-50" }
      case "IT服务":
        return { textColor: "text-teal-600", bgColor: "bg-teal-50" }
      case "档案查阅":
        return { textColor: "text-fuchsia-600", bgColor: "bg-fuchsia-50" }
      case "项目申报":
        return { textColor: "text-cyan-600", bgColor: "bg-cyan-50" }
      case "学术科研":
        return { textColor: "text-purple-600", bgColor: "bg-purple-50" }
      case "国际交流":
        return { textColor: "text-sky-600", bgColor: "bg-sky-50" }
      case "学术调查":
        return { textColor: "text-emerald-600", bgColor: "bg-emerald-50" }
      case "环境建设":
        return { textColor: "text-green-600", bgColor: "bg-green-50" }
      default:
        return { textColor: "text-gray-600", bgColor: "bg-gray-50" }
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

  // 直接操作按钮
  const actions: ActionButton[] = [
    {
      id: "view",
      label: "查看详情",
      icon: <Eye className="h-3.5 w-3.5" />,
      onClick: (item) => router.push(`/todos/${item.id}?from=completed`),
      variant: "outline",
      condition: () => true,
    },
  ]

  // 处理点击项目，导航到详情页
  const handleItemClick = (id: number) => {
    router.push(`/todos/${id}?from=completed`)
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100">
        <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <div className="text-lg font-medium text-muted-foreground mb-1">没有已审核事项</div>
        <div className="text-sm text-muted-foreground">当前没有符合筛选条件的已审核事项</div>
      </div>
    )
  }

  // 渲染审核状态标签
  const renderStatusBadge = (item: TodoItem) => {
    const isApproved = item.status === "已通过"

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
          isApproved ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        {isApproved ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
        {isApproved ? "已通过" : "已退回"}
      </div>
    )
  }

  // 处理全选/取消全选
  const handleSelectAll = () => {
    const currentPageIds = paginatedItems.map((item) => item.id)
    const allCurrentPageSelected = currentPageIds.every((id) => selectedItems.includes(id))

    if (allCurrentPageSelected) {
      // 如果当前页全部已选，则取消选择当前页的所有项目
      const newSelectedItems = selectedItems.filter((id) => !currentPageIds.includes(id))
      // 直接设置新的选中项数组，而不是一个一个切换
      onSelectItem(-1) // 传递一个无效ID，触发父组件的状态更新
      setTimeout(() => {
        // 使用setTimeout确保状态更新完成后再设置新的选中项
        const event = new CustomEvent("updateSelectedItems", { detail: newSelectedItems })
        window.dispatchEvent(event)
      }, 0)
    } else {
      // 否则选择当前页的所有项目
      const newSelectedItems = [...new Set([...selectedItems, ...currentPageIds])]
      onSelectItem(-1) // 传递一个无效ID，触发父组件的状态更新
      setTimeout(() => {
        const event = new CustomEvent("updateSelectedItems", { detail: newSelectedItems })
        window.dispatchEvent(event)
      }, 0)
    }
  }

  // 渲染标签
  const renderTags = (item: TodoItem): string => {
    if (item.type) {
      const { textColor, bgColor } = getTypeColor(item.type)
      return `${textColor} ${bgColor}`
    }
    return "text-gray-600 bg-gray-50"
  }

  // 修改 return 语句，使用 paginatedItems 替代 items
  // 在 return 语句的最后添加分页器组件
  return (
    <div>
      {viewMode === "card" ? (
        <div
          className={`grid grid-cols-1 ${showAiAssistant ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"} gap-4`}
        >
          {paginatedItems.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100">
              <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <div className="text-lg font-medium text-muted-foreground mb-1">没有已审核事项</div>
              <div className="text-sm text-muted-foreground">当前没有符合筛选条件的已审核事项</div>
            </div>
          ) : (
            paginatedItems.map((item) => (
              // 移除已审核卡片模式下的选择框
              // 修改卡片渲染部分，移除选择框
              <Card
                key={item.id}
                className={`todo-card hover:shadow-md transition-all duration-200 cursor-pointer border ${
                  selectedItems.includes(item.id) ? "border-primary bg-primary/5" : "border-slate-200"
                } rounded-xl overflow-hidden`}
                onMouseEnter={() => onItemHover(item)}
                onMouseLeave={() => onItemHover(null)}
                onClick={() => handleItemClick(item.id)}
              >
                {/* 移除选择框 */}
                <CardContent className="p-4">
                  <div className="flex">
                    {/* 修改卡片渲染部分，保持图标彩色，文字为默认色 */}
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
                        <div className="ml-2 shrink-0">{renderStatusBadge(item)}</div>
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
                          <span className="truncate">审核于: {item.completedAt}</span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/todos/${item.id}?from=completed`)
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <StatusList
          items={paginatedItems}
          statusConfig={statusConfigs}
          tagConfig={tagConfig}
          metadataFields={metadataFields}
          actions={actions}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onItemHover={onItemHover}
          showCheckbox={true}
          allSelected={paginatedItems.length > 0 && paginatedItems.every((item) => selectedItems.includes(item.id))}
          onSelectAll={handleSelectAll}
          isLoading={isLoading}
          emptyMessage="没有找到符合条件的已审核事项"
          className="space-y-3"
          onItemClick={(item) => handleItemClick(item.id)}
          itemClassName="status-list-item"
        />
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
    </div>
  )
}

