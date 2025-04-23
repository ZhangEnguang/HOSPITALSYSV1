import { Eye, Pencil, Trash2, Check } from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { SortOption } from "@/components/data-management/data-list-toolbar"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Dict } from "@/components/dict"

// 状态颜色映射
export const statusColors: Record<string, string> = {
  规划中: "secondary",
  进行中: "warning",
  已完成: "success",
  已暂停: "destructive",
  已取消: "destructive",
}

// 审核状态颜色映射
export const auditStatusColors: Record<string, string> = {
  待审核: "warning",
  审核通过: "success",
  审核退回: "destructive",
}

// 优先级颜色映射
export const priorityColors: Record<string, string> = {
  高: "destructive",
  中: "warning",
  低: "success",
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

// 修改表格列配置，正确区分项目状态和审核状态
export const tableColumns: TableColumn[] = [
  {
    id: "projectNumber",
    header: "项目编号",
    cell: (item) => <span className="font-medium">{item.projectNumber}</span>,
  },
  {
    id: "name",
    header: "项目（合同）名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "type",
    header: "项目类型",
    cell: (item) => <Badge variant="outline">{item.type}</Badge>,
  },
  {
    id: "source",
    header: "项目来源",
    cell: (item) => <span>{item.source}</span>,
  },
  {
    id: "status",
    header: "项目状态",
    cell: (item) => {
      const variant = getStatusColorVariant(item.status);
      return <Badge variant={variant}>{item.status}</Badge>;
    },
  },
  {
    id: "auditStatus",
    header: "审核状态",
    cell: (item) => {
      const variant = getAuditStatusColorVariant(item.auditStatus);
      return <Badge variant={variant}>{item.auditStatus}</Badge>;
    },
  },
  {
    id: "leader",
    header: "负责人",
    cell: (item) => (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          {/* <AvatarImage src={item.leader.avatar} alt={item.leader.name} /> */}
          <AvatarFallback>{item.leaderName ? item.leaderName : '?'}</AvatarFallback>
          <AvatarImage alt={item.leaderName} />
          <AvatarFallback>{item.leaderName}</AvatarFallback>
        </Avatar>
        {item.leaderName}
      </div>
    ),
  },
  {
    id: "progress",
    header: "进度",
    cell: (item) => {
      const progress = item.progress
      let barColor = "bg-blue-500"

      if (item.status === "已完成") {
        barColor = "bg-green-500"
      } else if (item.status === "已暂停") {
        barColor = "bg-red-500"
      } else if (progress < 50) {
        barColor = "bg-yellow-500"
      }

      return (
        <div className="w-full">
          <div className="text-sm mb-1">{progress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${barColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )
    },
  },
  {
    id: "budget",
    header: "预算(元)",
    cell: (item) => {
      const budget = item?.budget;
      if (budget == null) return <div className="font-medium">0</div>;
      return <div className="font-medium">{budget.toLocaleString()}</div>;
    },
  },
  {
    id: "dates",
    header: "起止日期",
    cell: (item) => (
      <div className="text-sm">
        <div>{format(new Date(item.startDate), "yyyy-MM-dd")}</div>
        <div className="text-muted-foreground">至</div>
        <div>{format(new Date(item.endDate), "yyyy-MM-dd")}</div>
      </div>
    ),
  },
  // {
  //   id: "members",
  //   header: "项目成员",
  //   cell: (item) => <div>{item.members} 人</div>,
  // },
]

// 修改卡片字段配置，恢复原有字段显示
export const cardFields: CardField[] = [
  {
    id: "leader",
    label: "",
    value: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {/* <AvatarImage src={item.leader.avatar} /> */}
          <AvatarFallback>{item.leaderName ? item.leaderName : '?'}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">{item.leaderName}</span>
          <span className="text-muted-foreground text-xs">项目负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "dates",
    label: "项目周期",
    value: (item) => {
      if (!item?.startDate || !item?.endDate) {
        return <span className="text-muted-foreground text-xs">日期未设置</span>;
      }
      try {
        return (
          <span className="text-muted-foreground text-xs">
            {format(new Date(item.startDate), "yyyy-MM-dd")} - {format(new Date(item.endDate), "yyyy-MM-dd")}
          </span>
        );
      } catch (e) {
        return <span className="text-muted-foreground text-xs">日期格式错误</span>;
      }
    },
  },
  {
    id: "budget",
    label: "项目预算",
    value: (item) => {
      // 确保budget为数字类型且不为null或undefined
      const budget = item?.budget;
      if (budget == null || typeof budget !== 'number') {
        return <span className="text-muted-foreground text-xs">¥0</span>;
      }
      try {
        return <span className="text-muted-foreground text-xs">¥{budget.toLocaleString()}</span>;
      } catch (e) {
        // 捕获可能的toLocaleString错误
        return <span className="text-muted-foreground text-xs">¥{budget}</span>;
      }
    },
  },
]

// 修改快速筛选配置，调整项目类型选项为高校科研项目类型
export const quickFilters = [
  {
    id: "status",
    label: "项目状态",
    value: "all",
    category:"project_status",
    // options: [
    //   { id: "planning", label: "规划中", value: "规划中" },
    //   { id: "active", label: "进行中", value: "进行中" },
    //   { id: "completed", label: "已完成", value: "已完成" },
    //   { id: "paused", label: "已暂停", value: "已暂停" },
    //   { id: "cancelled", label: "已取消", value: "已取消" },
    // ],
  },
  {
    id: "auditStatus",
    label: "审核状态",
    value: "all",
    category:"check_status",
    // options: [
    //   { id: "pending", label: "待审核", value: "待审核" },
    //   { id: "approved", label: "审核通过", value: "审核通过" },
    //   { id: "rejected", label: "审核退回", value: "审核退回" },
    // ],
  },
  // {
  //   id: "type",
  //   label: "项目类型",
  //   value: "all",
  //   options: [
  //     { id: "vertical", label: "纵向项目", value: "纵向项目" },
  //     { id: "horizontal", label: "横向项目", value: "横向项目" },
  //     { id: "school", label: "校级项目", value: "校级项目" },
  //   ],
  // },
  // {
  //   id: "source",
  //   label: "项目来源",
  //   value: "all",
  //   options: [
  //     { id: "nsfc", label: "国家自然科学基金", value: "国家自然科学基金" },
  //     { id: "nssfc", label: "国家社会科学基金", value: "国家社会科学基金" },
  //     { id: "most", label: "国家重点研发计划", value: "国家重点研发计划" },
  //     { id: "moe", label: "教育部人文社科项目", value: "教育部人文社科项目" },
  //     { id: "provincial", label: "省部级科研项目", value: "省部级科研项目" },
  //     { id: "enterprise", label: "企业合作项目", value: "企业合作项目" },
  //     { id: "school", label: "校级科研项目", value: "校级科研项目" },
  //   ],
  // },
]

// 添加审核状态到高级筛选配置
export const advancedFilters: FilterField[] = [
  {
    id: "leader",
    type: "select",
    label: "项目负责人",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
  {
    id: "auditStatus",
    type: "select",
    label: "审核状态",
    options: [
      { id: "pending", label: "待审核", value: "pending" },
      { id: "approved", label: "审核通过", value: "approved" },
      { id: "rejected", label: "审核退回", value: "rejected" },
    ],
  },
  {
    id: "priority",
    type: "select",
    label: "优先级",
    options: [
      { id: "high", label: "高", value: "高" },
      { id: "medium", label: "中", value: "中" },
      { id: "low", label: "低", value: "低" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "日期范围",
  },
  {
    id: "members",
    type: "multiselect",
    label: "项目成员",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
]

// 排序选项配置
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "名称 (Z-A)", field: "name", direction: "desc" },
  { id: "progress_desc", label: "进度（高-低）", field: "progress", direction: "desc" },
  { id: "progress_asc", label: "进度（低-高）", field: "progress", direction: "asc" },
  { id: "priority_desc", label: "优先级（高-低）", field: "priority", direction: "desc" },
  { id: "priority_asc", label: "优先级（低-高）", field: "priority", direction: "asc" },
]

// 表格操作配置
export const tableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => console.log("查看详情", item),
  },
  {
    id: "edit",
    label: "编辑项目",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      console.log("跳转到编辑页面:", item);
      // 根据项目类型确定编辑页面路径
      const projectType = item.type?.includes('校') ? 'school' : 
                        item.type?.includes('纵') ? 'vertical' : 'horizontal';
      let editUrl = '';
      
      if (projectType === 'school') {
        editUrl = `/projects/edit/school/${item.id}`;
      } else if (projectType === 'vertical') {
        editUrl = `/projects/edit/vertical/${item.id}`;
      } else {
        editUrl = `/projects/edit/${item.id}`;
      }
      
      window.location.href = editUrl;
    },
    disabled: (item: any) => item.status === "已完成",
  },
  {
    id: "delete",
    label: "删除项目",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除项目", item),
    variant: "destructive",
  },
]

// 卡片操作配置
export const createCardActions = (onDelete: (item: any) => void) => [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      window.location.href = `/projects/${item.id}`
    },
  },
  {
    id: "edit",
    label: "编辑项目",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      // 根据项目类型确定编辑页面路径
      const projectType = item.type;
      let editUrl = '';
      
      if (projectType === 'school') {
        editUrl = `/projects/edit/school/${item.id}`;
      } else if (projectType === 'vertical') {
        editUrl = `/projects/edit/vertical/${item.id}`;
      } else {
        editUrl = `/projects/edit/${item.id}`;
      }
      
      window.location.href = editUrl;
    },
    disabled: (item: any) => item.status === "已完成",
  },
  {
    id: "delete",
    label: "删除项目",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: "destructive",
  },
]

// 定义不同标签页的高级筛选分类
// 人员高级筛选分类
interface Category {
  id: string;
  title: string;
  fields: Field[];
}
interface Field {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "member"; // Use specific types
  options?: { value: string; label: string }[];
  placeholder?: string;
}
export  const personnelFilterCategories: Category[] = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "项目名称",
        type: "text",
        placeholder: "请输入姓名关键词"
      },
      {
        id: "projectNumber",
        label: "项目编号",
        type: "text",
        placeholder: "请输入工号"
      }
    ]
  },
  {
    id: "position",
    title: "其他信息",
    fields: [
      {
        id: "unitId",
        label: "所属部门",
        type: "text",
        placeholder: "请输入单位"
      }
    ]
  }
];


// 保留向后兼容性
export const cardActions = createCardActions((item) => console.log("删除项目", item))

// 批量操作配置
export const batchActions: BatchAction[] = [
  {
    id: "approve",
    label: "批量审核",
    icon: <Check className="h-4 w-4" />,
    onClick: () => console.log("批量审核"),
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => console.log("批量删除"),
    variant: "destructive",
  },
]

// 添加辅助函数来获取状态对应的样式
export const getStatusColorVariant = (status: string) => {
  switch (status) {
    case "规划中":
      return "secondary";
    case "进行中":
      return "warning";
    case "已完成":
      return "success";
    case "已暂停":
    case "已取消":
      return "destructive";
    default:
      return "default";
  }
}

export const getAuditStatusColorVariant = (status: string) => {
  switch (status) {
    case "待审核":
      return "warning";
    case "审核通过":
      return "success";
    case "审核退回":
      return "destructive";
    default:
      return "default";
  }
}
