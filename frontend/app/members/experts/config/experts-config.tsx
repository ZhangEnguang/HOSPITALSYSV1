import { Eye, Pencil, Trash2, UserPlus, Mail, Phone, UserCog, Building, Link, PhoneCall, BookOpen, Award, GraduationCap } from "lucide-react"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 专家级别颜色映射
export const expertLevelColors: Record<string, BadgeProps["variant"]> = {
  "国家级": "destructive",
  "省级": "secondary",
  "市级": "default",
  "校级": "outline",
}

// 专业领域颜色
export const fieldColors: Record<string, BadgeProps["variant"]> = {
  "计算机科学": "default",
  "人工智能": "secondary",
  "电子信息": "outline",
  "机械工程": "destructive",
  "材料科学": "default",
  "环境工程": "secondary",
  "医学": "outline",
}

// 专家表格列配置
export const expertTableColumns = [
  {
    id: "name",
    header: "姓名",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.avatar} />
          <AvatarFallback>{item.name ? item.name[0] : '?'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.email}</span>
        </div>
      </div>
    ),
  },
  {
    id: "account",
    header: "工号",
    cell: (item: any) => <span>{item.account}</span>,
  },
  {
    id: "expertLevel",
    header: "专家级别",
    cell: (item: any) => {
      const variant = expertLevelColors[item.expertLevel] || "default";
      return <Badge variant={variant}>{item.expertLevel}</Badge>;
    },
  },
  {
    id: "specialty",
    header: "专业特长",
    cell: (item: any) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {item.specialty?.slice(0, 3).map((field: string, index: number) => {
          const variant = fieldColors[field] || "default";
          return (
            <Badge key={index} variant={variant} className="whitespace-nowrap">
              {field}
            </Badge>
          );
        })}
        {item.specialty?.length > 3 && (
          <Badge variant="secondary" className="whitespace-nowrap">
            +{item.specialty.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "department",
    header: "所属单位",
    cell: (item: any) => <span>{item.department?.name || item.departmentName || 'N/A'}</span>,
  },
  {
    id: "title",
    header: "职称",
    cell: (item: any) => <span>{item.title}</span>,
  },
  {
    id: "status",
    header: "状态",
    cell: (item: any) => {
      const statusColors: Record<string, BadgeProps["variant"]> = {
        "在职": "outline",
        "退休": "secondary",
        "离职": "destructive",
      };
      const variant = statusColors[item.status] || "default";
      return <Badge variant={variant}>{item.status}</Badge>;
    },
  },
  {
    id: "contact",
    header: "联系方式",
    cell: (item: any) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{item.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{item.phone || item.mobile}</span>
        </div>
      </div>
    ),
  },
]

// 专家卡片字段配置
export const expertCardFields = [
  {
    id: "expertLevel",
    label: "专家级别",
    value: (item) => <Badge variant={expertLevelColors[item.expertLevel] || "default"}>{item.expertLevel}</Badge>,
  },
  {
    id: "specialty",
    label: "专业特长",
    value: (item) => (
      <div className="flex flex-wrap gap-1">
        {item.specialty?.slice(0, 3).map((field: string, index: number) => {
          const variant = fieldColors[field] || "default";
          return (
            <Badge key={index} variant={variant} className="whitespace-nowrap">
              {field}
            </Badge>
          );
        })}
        {item.specialty?.length > 3 && (
          <Badge variant="secondary" className="whitespace-nowrap">
            +{item.specialty.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "education",
    label: "学历学位",
    value: (item) => (
      <div className="flex items-center gap-1">
        <GraduationCap className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{item.education}</span>
      </div>
    ),
  },
  {
    id: "title",
    label: "职称",
    value: (item) => (
      <div className="flex items-center gap-1">
        <Award className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{item.title}</span>
      </div>
    ),
  },
  {
    id: "department",
    label: "所属单位",
    value: (item) => (
      <div className="flex items-center gap-1">
        <Building className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{item.department?.name || item.departmentName || 'N/A'}</span>
      </div>
    ),
  },
  {
    id: "contact",
    label: "联系方式",
    value: (item) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{item.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{item.phone || item.mobile}</span>
        </div>
      </div>
    ),
  },
]

// 专家表格操作配置
export const expertTableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 专家卡片操作配置
export const expertCardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 模拟专家数据
export const mockExperts = [
  {
    id: "exp001",
    name: "张教授",
    email: "zhang@example.edu.cn",
    phone: "13800138001",
    mobile: "13800138001",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "expert",
    roleId: "expert",
    department: { id: "1", name: "计算机科学与技术学院" },
    departmentName: "计算机科学与技术学院",
    unitId: "1",
    status: "在职",
    account: "PR001",
    expertLevel: "国家级",
    specialty: ["人工智能", "机器学习", "深度学习"],
    title: "教授/博导",
    education: "博士/博士后",
    joinDate: "2010-09-01",
    workDate: "2010-09-01",
    bio: "国家杰出青年基金获得者，主要从事人工智能与机器学习研究，发表SCI论文100余篇。",
    intro: "国家杰出青年基金获得者，主要从事人工智能与机器学习研究，发表SCI论文100余篇。",
  },
  {
    id: "exp002",
    name: "李研究员",
    email: "li@example.edu.cn",
    phone: "13900139001",
    mobile: "13900139001",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "expert",
    roleId: "expert",
    department: { id: "2", name: "电子信息工程学院" },
    departmentName: "电子信息工程学院",
    unitId: "2",
    status: "在职",
    account: "PR002",
    expertLevel: "省级",
    specialty: ["电子信息", "信号处理", "通信技术"],
    title: "研究员",
    education: "博士",
    joinDate: "2012-07-15",
    workDate: "2012-07-15",
    bio: "省优秀专家，长期从事信号处理与通信技术研究，拥有多项发明专利。",
    intro: "省优秀专家，长期从事信号处理与通信技术研究，拥有多项发明专利。",
  },
  {
    id: "exp003",
    name: "王副教授",
    email: "wang@example.edu.cn",
    phone: "13700137001",
    mobile: "13700137001", 
    avatar: "/placeholder.svg?height=32&width=32",
    role: "expert",
    roleId: "expert",
    department: { id: "3", name: "机械工程学院" },
    departmentName: "机械工程学院",
    unitId: "3",
    status: "在职",
    account: "PR003",
    expertLevel: "市级",
    specialty: ["机械工程", "智能制造", "机器人技术"],
    title: "副教授/硕导",
    education: "博士",
    joinDate: "2015-03-20",
    workDate: "2015-03-20",
    bio: "市科技新星，研究方向为智能制造与机器人技术，主持多项市级科研项目。",
    intro: "市科技新星，研究方向为智能制造与机器人技术，主持多项市级科研项目。",
  },
  {
    id: "exp004",
    name: "赵研究员",
    email: "zhao@example.edu.cn",
    phone: "13600136001",
    mobile: "13600136001",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "expert",
    roleId: "expert",
    department: { id: "4", name: "材料科学与工程学院" },
    departmentName: "材料科学与工程学院",
    unitId: "4",
    status: "在职",
    account: "PR004",
    expertLevel: "国家级",
    specialty: ["材料科学", "纳米材料", "新能源材料"],
    title: "研究员/博导",
    education: "博士/博士后",
    joinDate: "2008-11-10", 
    workDate: "2008-11-10",
    bio: "国家重点研发计划项目首席科学家，专注于新能源材料研究，取得多项突破性成果。",
    intro: "国家重点研发计划项目首席科学家，专注于新能源材料研究，取得多项突破性成果。",
  },
  {
    id: "exp005",
    name: "钱教授",
    email: "qian@example.edu.cn",
    phone: "13500135001",
    mobile: "13500135001",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "expert",
    roleId: "expert",
    department: { id: "5", name: "环境科学与工程学院" },
    departmentName: "环境科学与工程学院",
    unitId: "5",
    status: "退休",
    account: "PR005",
    expertLevel: "省级",
    specialty: ["环境工程", "水污染控制", "生态修复"],
    title: "教授/博导",
    education: "博士",
    joinDate: "2000-05-18",
    workDate: "2000-05-18",
    bio: "省特聘专家，长期从事水污染控制与生态修复研究，具有丰富的实践经验。",
    intro: "省特聘专家，长期从事水污染控制与生态修复研究，具有丰富的实践经验。",
  },
  {
    id: "exp006",
    name: "孙博士",
    email: "sun@example.edu.cn",
    phone: "13400134001",
    mobile: "13400134001",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "expert",
    roleId: "expert",
    department: { id: "6", name: "医学院" },
    departmentName: "医学院",
    unitId: "6",
    status: "在职",
    account: "PR006",
    expertLevel: "校级",
    specialty: ["医学", "生物医学工程", "临床医学"],
    title: "副研究员",
    education: "博士",
    joinDate: "2018-09-01",
    workDate: "2018-09-01",
    bio: "校青年学者，研究方向为生物医学工程与临床医学交叉领域，取得多项创新成果。",
    intro: "校青年学者，研究方向为生物医学工程与临床医学交叉领域，取得多项创新成果。",
  },
] 