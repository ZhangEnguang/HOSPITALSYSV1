import { Eye, Pencil, Trash2, Download, Share2, ClipboardCheck } from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { SortOption } from "@/components/data-management/data-list-toolbar"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 类型颜色映射
export const typeColors: Record<string, string> = {
  学术论文: "primary",
  学术著作: "secondary",
  成果获奖: "success",
  鉴定成果: "warning",
  专利: "destructive",
}

// 状态颜色映射
export const statusColors: Record<string, string> = {
  已发表: "success",
  已授权: "success",
  已获奖: "success",
  已登记: "success",
  已发布: "success",
  已出版: "success",
  已鉴定: "success",
  审核中: "warning",
  撰写中: "secondary",
  编写中: "secondary",
  申报中: "warning",
  鉴定中: "warning",
  已拒绝: "destructive",
}

// 用户数据
export const users = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("张三")}&background=random&color=fff&size=128`,
    role: "技术总监",
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("李四")}&background=random&color=fff&size=128`,
    role: "产品经理",
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("王五")}&background=random&color=fff&size=128`,
    role: "UI设计师",
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("赵六")}&background=random&color=fff&size=128`,
    role: "前端开发",
  },
  {
    id: 5,
    name: "孙七",
    email: "sunqi@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("孙七")}&background=random&color=fff&size=128`,
    role: "后端开发",
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "type",
    label: "类型",
    value: "all",
    options: [
      { id: "academic-papers", label: "学术论文", value: "学术论文" },
      { id: "academic-works", label: "学术著作", value: "学术著作" },
      { id: "achievement-awards", label: "成果获奖", value: "成果获奖" },
      { id: "evaluated-achievements", label: "鉴定成果", value: "鉴定成果" },
      { id: "patents", label: "专利", value: "专利" },
    ],
  },
  {
    id: "status",
    label: "状态",
    value: "all",
    options: [
      { id: "published", label: "已发表", value: "已发表" },
      { id: "authorized", label: "已授权", value: "已授权" },
      { id: "awarded", label: "已获奖", value: "已获奖" },
      { id: "registered", label: "已登记", value: "已登记" },
      { id: "released", label: "已发布", value: "已发布" },
      { id: "published_book", label: "已出版", value: "已出版" },
      { id: "appraised", label: "已鉴定", value: "已鉴定" },
      { id: "reviewing", label: "审核中", value: "审核中" },
      { id: "writing", label: "撰写中", value: "撰写中" },
      { id: "writing_book", label: "编写中", value: "编写中" },
      { id: "applying", label: "申报中", value: "申报中" },
      { id: "appraising", label: "鉴定中", value: "鉴定中" },
      { id: "rejected", label: "已拒绝", value: "已拒绝" },
    ],
  },
]

// 高级筛选字段配置
export const advancedFilters: FilterField[] = [
  {
    id: "author",
    type: "select",
    label: "第一作者/发明人",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
  {
    id: "project",
    type: "select",
    label: "关联项目",
    options: [
      { id: "1", label: "智慧园区综合管理平台", value: "1" },
      { id: "2", label: "AI视觉监控系统", value: "2" },
      { id: "3", label: "智慧能源管理系统", value: "3" },
      { id: "4", label: "智能访客管理系统", value: "4" },
      { id: "5", label: "智慧停车管理平台", value: "5" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "发表/授权日期",
  },
  {
    id: "level",
    type: "select",
    label: "级别",
    options: [
      { id: "international", label: "国际级", value: "国际级" },
      { id: "national", label: "国家级", value: "国家级" },
      { id: "provincial", label: "省部级", value: "省部级" },
      { id: "municipal", label: "市厅级", value: "市厅级" },
      { id: "school", label: "校级", value: "校级" },
    ],
  },
]

// 排序选项配置
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "名称 (Z-A)", field: "name", direction: "desc" },
  { id: "date_desc", label: "日期（新-旧）", field: "date", direction: "desc" },
  { id: "date_asc", label: "日期（旧-新）", field: "date", direction: "asc" },
  { id: "level_desc", label: "级别（高-低）", field: "level", direction: "desc" },
  { id: "level_asc", label: "级别（低-高）", field: "level", direction: "asc" },
]

// 根据类型获取名称列标题
export const getNameHeaderByType = (type: string): string => {
  switch (type) {
    case "学术论文":
      return "论文名称"
    case "学术著作":
      return "著作名称"
    case "成果获奖":
      return "成果获奖名称"
    case "鉴定成果":
      return "鉴定成果名称"
    case "专利":
      return "专利名称"
    default:
      return "成果名称"
  }
}

// 根据活动标签页获取名称列标题
export const getNameHeaderByTab = (tab: string): string => {
  switch (tab) {
    case "academic-papers":
      return "论文名称"
    case "academic-works":
      return "著作名称"
    case "achievement-awards":
      return "成果获奖名称"
    case "evaluated-achievements":
      return "鉴定成果名称"
    case "patents":
      return "专利名称"
    default:
      return "成果名称"
  }
}

// 获取表格列配置
export const getTableColumns = (activeTab: string): TableColumn[] => {
  const nameHeader = getNameHeaderByTab(activeTab)

  return [
    {
      id: "name",
      header: nameHeader,
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
        </div>
      ),
    },
    {
      id: "type",
      header: "类型",
      cell: (item) => <Badge variant={typeColors[item.type]}>{item.type}</Badge>,
    },
    {
      id: "project",
      header: "关联项目",
      cell: (item) => <span>{item.project.name}</span>,
    },
    {
      id: "author",
      header: "第一作者/发明人",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.author.avatar} />
            <AvatarFallback>{item.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{item.author.name}</span>
        </div>
      ),
    },
    {
      id: "level",
      header: "级别",
      cell: (item) => <span>{item.level}</span>,
    },
    {
      id: "status",
      header: "状态",
      cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
    },
    {
      id: "date",
      header: "发表/授权/获奖日期",
      cell: (item) => (item.date ? format(new Date(item.date), "yyyy/MM/dd") : "-"),
    },
    {
      id: "venue",
      header: "发表/授权/获奖机构",
      cell: (item) => <span>{item.venue}</span>,
    },
    {
      id: "details",
      header: "详细信息",
      cell: (item) => {
        if (item.type === "学术论文") {
          return (
            <div className="text-sm">
              <div>影响因子: {item.impact || "-"}</div>
              <div>引用次数: {item.citations || 0}</div>
            </div>
          )
        } else if (item.type === "学术著作") {
          return (
            <div className="text-sm">
              <div>ISBN: {item.isbn || "-"}</div>
              <div>页数: {item.pages || "-"}</div>
            </div>
          )
        } else if (item.type === "成果获奖") {
          return <div className="text-sm">奖项: {item.awardName || "-"}</div>
        } else if (item.type === "鉴定成果") {
          return (
            <div className="text-sm">
              <div>鉴定号: {item.appraisalNumber || "-"}</div>
              <div>鉴定结果: {item.appraisalResult || "-"}</div>
            </div>
          )
        } else if (item.type === "专利") {
          return <div className="text-sm">专利号: {item.patentNumber || "-"}</div>
        }
        return null
      },
    },
  ]
}

// 表格列配置（保留原始配置作为备用）
export const tableColumns: TableColumn[] = [
  {
    id: "name",
    header: "成果名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "type",
    header: "类型",
    cell: (item) => <Badge variant={typeColors[item.type]}>{item.type}</Badge>,
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "author",
    header: "第一作者/发明人",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.author.avatar} />
          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.author.name}</span>
      </div>
    ),
  },
  {
    id: "level",
    header: "级别",
    cell: (item) => <span>{item.level}</span>,
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "date",
    header: "发表/授权/获奖日期",
    cell: (item) => (item.date ? format(new Date(item.date), "yyyy/MM/dd") : "-"),
  },
  {
    id: "venue",
    header: "发表/授权/获奖机构",
    cell: (item) => <span>{item.venue}</span>,
  },
  {
    id: "details",
    header: "详细信息",
    cell: (item) => {
      if (item.type === "学术论文") {
        return (
          <div className="text-sm">
            <div>影响因子: {item.impact || "-"}</div>
            <div>引用次数: {item.citations || 0}</div>
          </div>
        )
      } else if (item.type === "学术著作") {
        return (
          <div className="text-sm">
            <div>ISBN: {item.isbn || "-"}</div>
            <div>页数: {item.pages || "-"}</div>
          </div>
        )
      } else if (item.type === "成果获奖") {
        return <div className="text-sm">奖项: {item.awardName || "-"}</div>
      } else if (item.type === "鉴定成果") {
        return (
          <div className="text-sm">
            <div>鉴定号: {item.appraisalNumber || "-"}</div>
            <div>鉴定结果: {item.appraisalResult || "-"}</div>
          </div>
        )
      } else if (item.type === "专利") {
        return <div className="text-sm">专利号: {item.patentNumber || "-"}</div>
      }
      return null
    },
  },
]

// 卡片字段配置
export const cardFields: CardField[] = [
  {
    id: "project",
    label: "关联项目",
    value: (item) => <span className="text-muted-foreground text-xs">{item.project.name}</span>,
  },
  {
    id: "author",
    label: "",
    value: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.author.avatar} />
          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">{item.author.name}</span>
          <span className="text-muted-foreground text-xs">第一作者/发明人</span>
        </div>
      </div>
    ),
  },
  {
    id: "level",
    label: "级别",
    value: (item) => <span className="text-muted-foreground text-xs">{item.level}</span>,
  },
  {
    id: "date",
    label: "日期",
    value: (item) => (
      <span className="text-muted-foreground text-xs">
        {item.date ? format(new Date(item.date), "yyyy/MM/dd") : "-"}
      </span>
    ),
  },
  {
    id: "details",
    label: "详细信息",
    value: (item) => {
      if (item.type === "学术论文") {
        return (
          <div className="text-muted-foreground text-xs">
            <div>影响因子: {item.impact || "-"}</div>
            <div>引用次数: {item.citations || 0}</div>
          </div>
        )
      } else if (item.type === "学术著作") {
        return (
          <div className="text-muted-foreground text-xs">
            <div>ISBN: {item.isbn || "-"}</div>
            <div>页数: {item.pages || "-"}</div>
          </div>
        )
      } else if (item.type === "成果获奖") {
        return <div className="text-muted-foreground text-xs">奖项: {item.awardName || "-"}</div>
      } else if (item.type === "鉴定成果") {
        return (
          <div className="text-muted-foreground text-xs">
            <div>鉴定号: {item.appraisalNumber || "-"}</div>
            <div>鉴定结果: {item.appraisalResult || "-"}</div>
          </div>
        )
      } else if (item.type === "专利") {
        return <div className="text-muted-foreground text-xs">专利号: {item.patentNumber || "-"}</div>
      }
      return null
    },
  },
]

// 表格操作配置
export const tableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      if (item.type === "学术论文") {
        window.location.href = `/achievements/academic-papers/${item.id}`
      } else if (item.type === "学术著作") {
        window.location.href = `/achievements/academic-books/${item.id}`
      } else if (item.type === "成果获奖") {
        window.location.href = `/achievements/achievement-awards/${item.id}`
      } else if (item.type === "鉴定成果") {
        window.location.href = `/achievements/evaluated-achievements/${item.id}`
      } else if (item.type === "专利") {
        window.location.href = `/achievements/patents/${item.id}`
      }
    },
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => {
      if (item.type === "学术论文") {
        window.location.href = `/achievements/academic-papers/edit/${item.id}`
      } else if (item.type === "学术著作") {
        window.location.href = `/achievements/academic-books/edit/${item.id}`
      } else if (item.type === "成果获奖") {
        window.location.href = `/achievements/achievement-awards/edit/${item.id}`
      } else if (item.type === "鉴定成果") {
        window.location.href = `/achievements/evaluated-achievements/edit/${item.id}`
      } else if (item.type === "专利") {
        window.location.href = `/achievements/patents/edit/${item.id}`
      }
    },
    disabled: (item) =>
      item.status === "已发表" ||
      item.status === "已授权" ||
      item.status === "已获奖" ||
      item.status === "已登记" ||
      item.status === "已发布",
  },
  {
    id: "download",
    label: "下载附件",
    icon: <Download className="h-4 w-4" />,
    onClick: (item) => console.log("下载附件", item),
  },
  {
    id: "audit",
    label: "审核",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => {
      if (item.type === "学术论文") {
        window.location.href = `/achievements/academic-papers/${item.id}/audit`
      } else if (item.type === "学术著作") {
        window.location.href = `/achievements/academic-books/${item.id}/audit`
      } else if (item.type === "鉴定成果") {
        window.location.href = `/achievements/evaluated-achievements/${item.id}/audit`
      } else if (item.type === "成果获奖") {
        window.location.href = `/achievements/achievement-awards/${item.id}/audit`
      } else if (item.type === "专利") {
        window.location.href = `/achievements/patents/${item.id}/audit`
      }
    },
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 学术论文操作配置
export const academicPapersTableActions = [
  {
    id: "view",
    label: "查看论文",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-papers/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑论文",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-papers/edit/${item.id}`,
    disabled: (item) => item.status === "已发表",
  },
  {
    id: "audit",
    label: "审核论文",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-papers/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除论文",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 学术著作操作配置
export const academicWorksTableActions = [
  {
    id: "view",
    label: "查看著作",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-books/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑著作",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-books/edit/${item.id}`,
    disabled: (item) => item.status === "已出版",
  },
  {
    id: "audit",
    label: "审核著作",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-books/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除著作",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 鉴定成果操作配置
export const evaluatedAchievementsTableActions = [
  {
    id: "view",
    label: "查看鉴定",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/evaluated-achievements/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑鉴定",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/evaluated-achievements/edit/${item.id}`,
    disabled: (item) => item.status === "已鉴定",
  },
  {
    id: "audit",
    label: "审核鉴定",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/evaluated-achievements/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除鉴定",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 成果获奖操作配置
export const achievementAwardsTableActions = [
  {
    id: "view",
    label: "查看获奖",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/achievement-awards/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑获奖",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/achievement-awards/edit/${item.id}`,
  },
  {
    id: "audit",
    label: "审核获奖",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/achievement-awards/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除获奖",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 专利操作配置
export const patentsTableActions = [
  {
    id: "view",
    label: "查看专利",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/patents/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑专利",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/patents/edit/${item.id}`,
  },
  {
    id: "audit",
    label: "审核专利",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/patents/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除专利",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 卡片操作配置
export const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      if (item.type === "学术论文") {
        window.location.href = `/achievements/academic-papers/${item.id}`
      } else if (item.type === "学术著作") {
        window.location.href = `/achievements/academic-books/${item.id}`
      } else if (item.type === "成果获奖") {
        window.location.href = `/achievements/achievement-awards/${item.id}`
      } else if (item.type === "鉴定成果") {
        window.location.href = `/achievements/evaluated-achievements/${item.id}`
      } else if (item.type === "专利") {
        window.location.href = `/achievements/patents/${item.id}`
      }
    },
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => {
      if (item.type === "学术论文") {
        window.location.href = `/achievements/academic-papers/edit/${item.id}`
      } else if (item.type === "学术著作") {
        window.location.href = `/achievements/academic-books/edit/${item.id}`
      } else if (item.type === "成果获奖") {
        window.location.href = `/achievements/achievement-awards/edit/${item.id}`
      } else if (item.type === "鉴定成果") {
        window.location.href = `/achievements/evaluated-achievements/edit/${item.id}`
      } else if (item.type === "专利") {
        window.location.href = `/achievements/patents/edit/${item.id}`
      }
    },
    disabled: (item) =>
      item.status === "已发表" ||
      item.status === "已授权" ||
      item.status === "已获奖" ||
      item.status === "已登记" ||
      item.status === "已发布",
  },
  {
    id: "download",
    label: "下载附件",
    icon: <Download className="h-4 w-4" />,
    onClick: (item) => console.log("下载附件", item),
  },
]

// 学术论文卡片操作配置
export const academicPapersCardActions = [
  {
    id: "view",
    label: "查看论文",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-papers/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑论文",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("编辑", item),
    disabled: (item) => item.status === "已发表",
  },
  {
    id: "audit",
    label: "审核论文",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-papers/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除论文",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 学术著作卡片操作配置
export const academicWorksCardActions = [
  {
    id: "view",
    label: "查看著作",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-books/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑著作",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("编辑", item),
    disabled: (item) => item.status === "已出版",
  },
  {
    id: "audit",
    label: "审核著作",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/academic-books/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除著作",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 鉴定成果卡片操作配置
export const evaluatedAchievementsCardActions = [
  {
    id: "view",
    label: "查看鉴定",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/evaluated-achievements/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑鉴定",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/evaluated-achievements/edit/${item.id}`,
    disabled: (item) => item.status === "已鉴定",
  },
  {
    id: "audit",
    label: "审核鉴定",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/evaluated-achievements/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除鉴定",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 成果获奖卡片操作配置
export const achievementAwardsCardActions = [
  {
    id: "view",
    label: "查看获奖",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/achievement-awards/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑获奖",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/achievement-awards/edit/${item.id}`,
  },
  {
    id: "audit",
    label: "审核获奖",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/achievement-awards/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除获奖",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 专利卡片操作配置
export const patentsCardActions = [
  {
    id: "view",
    label: "查看专利",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/patents/${item.id}`,
  },
  {
    id: "edit",
    label: "编辑专利",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/patents/edit/${item.id}`,
  },
  {
    id: "audit",
    label: "审核专利",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => window.location.href = `/achievements/patents/${item.id}/audit`,
  },
  {
    id: "delete",
    label: "删除专利",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 批量操作配置
export const batchActions: BatchAction[] = [
  {
    id: "batchDownload",
    label: "批量下载",
    icon: <Download className="h-4 w-4" />,
    onClick: () => console.log("批量下载"),
  },
  {
    id: "batchShare",
    label: "批量分享",
    icon: <Share2 className="h-4 w-4" />,
    onClick: () => console.log("批量分享"),
  },
  {
    id: "batchDelete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => console.log("批量删除"),
    variant: "destructive",
  },
]

// 根据成果类型选择对应的表格操作配置
export const getTableActionsByType = (type: string) => {
  switch (type) {
    case "学术论文":
      return academicPapersTableActions
    case "学术著作":
      return academicWorksTableActions
    case "鉴定成果":
      return evaluatedAchievementsTableActions
    case "成果获奖":
      return achievementAwardsTableActions
    case "专利":
      return patentsTableActions
    default:
      return tableActions
  }
}

// 根据成果类型选择对应的卡片操作配置
export const getCardActionsByType = (type: string) => {
  switch (type) {
    case "学术论文":
      return academicPapersCardActions
    case "学术著作":
      return academicWorksCardActions
    case "鉴定成果":
      return evaluatedAchievementsCardActions
    case "成果获奖":
      return achievementAwardsCardActions
    case "专利":
      return patentsCardActions
    default:
      return cardActions
  }
}
