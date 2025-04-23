import { Eye, Pencil, Trash2, UserPlus, Mail, Phone, UserCog, Building, Link, PhoneCall, SortAsc, SortDesc } from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { SortOption } from "@/components/data-management/data-list-toolbar"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import { Dict } from "@/components/dict";
import { useState } from "react";
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 定义组织数据类型，基于 Unit.java 和前端需求
interface Organization {
  id: string;
  code: string;
  name: string;
  charger: string; // 对应后端 charger
  chargerId: string; // 对应后端 charger
  leader?: string; // 前端可能仍用 leader，需要映射
  unitTypeId: string; // 对应后端 unitTypeId
  orgType?: string; // 前端可能用 orgType，需要映射
  linkMan?: string;
  linkManId?: string;
  tel?: string;
  unitCreateDate?: string; // 对应后端 unitCreateDate (Date string)
  foundDate?: Date; // 前端可能用 Date 对象
  orderId?: number;
  intro?: string;
  standBy1?: string; // 备注
  avatar?: string;
  // 可能需要的旧字段，用于平滑过渡或 drawer/dialog
  leaderInfo?: any;
  contact?: any;
  level?: number;
  parentId?: string | null;
  parentOrg?: string;
  memberCount?: number;
  teamCount?: number;
}

// 成员类型颜色映射
export const memberTypeColors: Record<string, BadgeProps["variant"]> = {
  personnel: "default", // 使用有效的 variant
  team: "secondary",
  organization: "outline", // 使用有效的 variant
}

// 团队类型颜色映射
export const teamTypeColors: Record<string, BadgeProps["variant"]> = {
  research: "default",
  project: "secondary", // 'warning' 不是有效的默认 variant
  lab: "outline", // 'success' 不是有效的默认 variant
  center: "secondary",
  institute: "destructive",
}

// 组织类型选项 (用于 Add/Edit Dialog)
export const orgTypeOptions = [
  { id: "dept", label: "院系单位", value: "DEPT" }, 
  { id: "research", label: "研究机构", value: "RESEARCH" }, 
  { id: "lab", label: "实验室", value: "LAB" },
  { id: "center", label: "研究中心", value: "CENTER" },
  { id: "institute", label: "研究所", value: "INSTITUTE" },
  { id: "other", label: "其他", value: "OTHER" }, 
]

// 组织类型名称映射 (用于显示)
export const orgTypeNames: Record<string, string> = {
  DEPT: "院系单位",
  RESEARCH: "研究机构",
  LAB: "实验室",
  CENTER: "研究中心",
  INSTITUTE: "研究所",
  OTHER: "其他",
}

// 组织类型颜色映射 (使用新的 Keys)
export const organizationTypeColors: Record<string, BadgeProps["variant"]> = {
  DEPT: "default",
  RESEARCH: "secondary",
  LAB: "outline",
  CENTER: "secondary",
  INSTITUTE: "destructive", 
  OTHER: "outline",
}

// 更新角色颜色映射
export const roleColors: Record<string, BadgeProps["variant"]> = {
  研究员: "default",
  学生: "secondary",
  评审专家: "outline", // 'success' 不是有效 variant
  独立顾问: "secondary", // 'warning' 不是有效 variant
  其他: "default", // 'default' 不是有效 variant, 但这里可以用 'default'
}

// 更新状态颜色映射
export const statusColors: Record<string, BadgeProps["variant"]> = {
  在职: "outline", // 'success' 不是有效 variant
  退休: "secondary", // 'warning' 不是有效 variant
  离职: "destructive",
}

// 添加部门数据
export const departments = [
  { id: "1", name: "计算机科学与技术学院" },
  { id: "2", name: "电子信息工程学院" },
  { id: "3", name: "机械工程学院" },
  { id: "4", name: "材料科学与工程学院" },
  { id: "5", name: "经济管理学院" },
]

// 项目数据
export const projects = [
  { id: "1", name: "智慧园区综合管理平台" },
  { id: "2", name: "AI视觉监控系统" },
  { id: "3", name: "智慧能源管理系统" },
  { id: "4", name: "智能访客管理系统" },
  { id: "5", name: "智慧停车管理平台" },
]

// 角色选项 (用于快速筛选)
export const roleOptions = [
  { id: "researcher", label: "研究员", value: "researcher" },
  { id: "student", label: "学生", value: "student" },
  { id: "expert", label: "评审专家", value: "expert" },
  { id: "consultant", label: "独立顾问", value: "consultant" },
  { id: "other", label: "其他", value: "other" },
]



// 高级筛选字段配置
export const advancedFilters: FilterField[] = [
  {
    id: "department",
    type: "select",
    label: "所属部门",
    options: departments.map((dept) => ({
      id: dept.id,
      label: dept.name,
      value: dept.id,
    })),
  },
  {
    id: "joinDateRange",
    type: "date",
    label: "入职日期",
  },
  {
    id: "isAdmin",
    type: "select",
    label: "管理员权限",
    options: [
      { id: "yes", label: "是", value: "true" },
      { id: "no", label: "否", value: "false" },
    ],
  },
]

// 排序选项配置 - 更新组织相关排序
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "姓名/名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "姓名/名称 (Z-A)", field: "name", direction: "desc" },
  { id: "joinDate_desc", label: "入职日期（新-旧）", field: "joinDate", direction: "desc" },
  { id: "joinDate_asc", label: "入职日期（旧-新）", field: "joinDate", direction: "asc" },
  { id: "foundDate_desc", label: "成立日期（新-旧）", field: "unitCreateDate", direction: "desc" },
  { id: "foundDate_asc", label: "成立日期（旧-新）", field: "unitCreateDate", direction: "asc" },
  { id: "orderId_asc", label: "排序号（升序）", field: "orderId", direction: "asc" },
  { id: "orderId_desc", label: "排序号（降序）", field: "orderId", direction: "desc" },
]

// 表格列配置 - 人员
export const tableColumns: TableColumn[] = [
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
    id: "role",
    header: "角色",
    cell: (item: any) => {
      // const variant = roleColors[item.role] || "default"
      return <Dict dictCode="roles" displayType="tag" value={item.role} field="field"/>
      // return <Badge variant={variant}>{item.role}</Badge>;
    },
  },
  {
    id: "department",
    header: "所属部门",
    cell: (item: any) => {
      // const variant = roleColors[item.role] || "default"
      return <Dict dictCode="unit" displayType="tag" value={item.department} field="field"/>
      // return <Badge variant={variant}>{item.role}</Badge>;
    },
    // cell: (item: any) => <span>{item.department?.name || 'N/A'}</span>,
  },
  {
    id: "status",
    header: "状态",
    cell: (item: any) => {
      const variant = statusColors[item.status] || "default"
      return <Badge variant={variant}>{item.status}</Badge>;
    },
  },
  {
    id: "joinDate",
    header: "入职日期",
    cell: (item: any) => <span>{item.joinDate}</span>,
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
          <span className="text-xs">{item.phone}</span>
        </div>
      </div>
    ),
  },
]

// 科研团队表格列配置
export const teamTableColumns: TableColumn[] = [
  {
    id: "name",
    header: "团队名称",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.avatar} />
          <AvatarFallback>{item.name ? item.name[0] : '?'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.code}</span>
        </div>
      </div>
    ),
  },
  {
    id: "type",
    header: "团队类型",
    cell: (item: any) => {
      const variant = teamTypeColors[item.teamType] || "default";
      const typeName = item.teamType === "research" ? "研究团队"
                     : item.teamType === "project" ? "项目团队"
                     : item.teamType === "lab" ? "实验室"
                     : item.teamType === "institute" ? "研究所"
                     : "研究中心";
      return <Badge variant={variant}>{typeName}</Badge>;
    },
  },
  {
    id: "leader",
    header: "负责人",
    cell: (item: any) => <span>{item.leader}</span>,
  },
  {
    id: "memberCount",
    header: "成员数量",
    cell: (item: any) => <span>{item.memberCount}人</span>,
  },
  {
    id: "researchFields",
    header: "研究方向",
    cell: (item: any) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {item.researchFields?.slice(0, 3).map((field: string, index: number) => (
          <Badge key={index} variant="secondary" className="whitespace-nowrap">
            {field}
          </Badge>
        ))}
        {item.researchFields?.length > 3 && (
          <Badge variant="secondary" className="whitespace-nowrap">
            +{item.researchFields.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "achievements",
    header: "研究成果",
    cell: (item: any) => (
      <div className="flex gap-2">
        <Badge variant="outline">论文 {item.achievements.papers}</Badge>
        <Badge variant="outline">专利 {item.achievements.patents}</Badge>
        <Badge variant="outline">获奖 {item.achievements.awards}</Badge>
      </div>
    ),
  },
  {
    id: "projects",
    header: "在研项目",
    cell: (item: any) => (
      <div className="flex flex-col gap-1">
        {item.projects.map((project: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <Badge variant={project.status === "进行中" ? "outline" : "secondary"} className="text-xs">
              {project.status}
            </Badge>
            <span className="text-sm">{project.name}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "metrics",
    header: "关键指标",
    cell: (item: any) => (
      <div className="flex flex-col gap-1 text-sm">
        <div>影响因子: {item.metrics.publicationImpact}</div>
        <div>总经费: {item.metrics.fundingAmount}万元</div>
        <div>在读研究生: {item.metrics.graduateStudents}人</div>
      </div>
    ),
  },
  {
    id: "contact",
    header: "联系方式",
    cell: (item: any) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{item.contact.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{item.contact.phone}</span>
        </div>
      </div>
    ),
  },
]

// 组织结构表格列配置 - 更新为业务要求字段
export const organizationTableColumns: TableColumn[] = [
  {
    id: "name",
    header: "单位名称",
    cell: (item: Organization) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.avatar} />
          <AvatarFallback>{item.name ? item.name[0] : '?'}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    id: "code",
    header: "单位编号",
    cell: (item: Organization) => <span>{item.code}</span>,
  },
  {
    id: "type",
    header: "单位类型",
    cell: (item: Organization) => {
       const typeName = orgTypeNames[item.unitTypeId] || item.unitTypeId || '未知';
       const variant = organizationTypeColors[item.unitTypeId] || "default";
       return <Badge variant={variant}>{typeName}</Badge>;
    }
  },
  {
    id: "leader",
    header: "负责人",
    cell: (item: Organization) => <span>{item.charger || 'N/A'}</span>,
  },
  {
    id: "linkMan",
    header: "联系人",
    cell: (item: Organization) => <span>{item.linkMan || 'N/A'}</span>,
  },
  {
    id: "tel",
    header: "联系电话",
    cell: (item: Organization) => <span>{item.tel || 'N/A'}</span>,
  },
]

// 卡片字段配置 - 人员
export const cardFields: CardField[] = [
  {
    id: "role",
    label: "角色",
    value: (item) => <Badge variant={roleColors[item.role] || "default"}>{item.role}</Badge>,
  },
  {
    id: "department",
    label: "所属部门",
    value: (item) => <span className="text-muted-foreground text-xs">{item.department?.name || 'N/A'}</span>,
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
          <span className="text-xs text-muted-foreground">{item.phone}</span>
        </div>
      </div>
    ),
  },
]

// 更新科研团队卡片字段配置
export const teamCardFields: CardField[] = [
  {
    id: "type",
    label: "团队类型",
    value: (item: any) => {
      const variant = teamTypeColors[item.teamType] || "default";
      const typeName = item.teamType === "research" ? "研究团队"
                     : item.teamType === "project" ? "项目团队"
                     : item.teamType === "lab" ? "实验室"
                     : item.teamType === "institute" ? "研究所"
                     : "研究中心";
       return <Badge variant={variant}>{typeName}</Badge>;
    },
  },
  {
    id: "leader",
    label: "负责人",
    value: (item: any) => <span className="text-muted-foreground text-sm">{item.leader}</span>,
  },
  {
    id: "memberCount",
    label: "成员数量",
    value: (item: any) => <span className="text-muted-foreground text-sm">{item.memberCount}人</span>,
  },
  {
    id: "researchFields",
    label: "研究方向",
    value: (item: any) => (
      <div className="flex flex-wrap gap-1">
        {item.researchFields?.slice(0, 3).map((field: string, index: number) => (
          <Badge key={index} variant="secondary" className="whitespace-nowrap">
            {field}
          </Badge>
        ))}
        {item.researchFields?.length > 3 && (
          <Badge variant="secondary" className="whitespace-nowrap">
            +{item.researchFields.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "achievements",
    label: "研究成果",
    value: (item: any) => (
      <div className="flex gap-2">
        <Badge variant="outline">论文 {item.achievements.papers}</Badge>
        <Badge variant="outline">专利 {item.achievements.patents}</Badge>
        <Badge variant="outline">获奖 {item.achievements.awards}</Badge>
      </div>
    ),
  },
  {
    id: "projects",
    label: "在研项目",
    value: (item: any) => (
      <div className="flex flex-wrap gap-1">
        {item.projects.map((project: any, index: number) => (
          <Badge key={index} variant="secondary" className="whitespace-nowrap">
            {project.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "metrics",
    label: "年度指标",
    value: (item: any) => (
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>经费: {item.annualBudget}万元</div>
        <div>在读研究生: {item.metrics.graduateStudents}人</div>
      </div>
    ),
  },
  {
    id: "facilities",
    label: "主要设施",
    value: (item: any) => (
      <div className="flex flex-wrap gap-1">
        {item.facilities.map((facility: any, index: number) => (
          <Badge key={index} variant="outline" className="whitespace-nowrap">
            {facility}
          </Badge>
        ))}
      </div>
    ),
  },
]

// 组织结构卡片字段配置 - 更新为业务要求字段
export const organizationCardFields: CardField[] = [
  {
    id: "code",
    label: "单位编号",
    value: (item: Organization) => <span className="text-muted-foreground text-xs">{item.code}</span>,
  },
  {
    id: "type",
    label: "单位类型",
    value: (item: Organization) => {
       const typeName = orgTypeNames[item.unitTypeId] || item.unitTypeId || '未知';
       const variant = organizationTypeColors[item.unitTypeId] || "default";
       return <Badge variant={variant}>{typeName}</Badge>;
    }
  },
  {
    id: "leader",
    label: "负责人",
    value: (item: Organization) => <span className="text-muted-foreground text-xs">{item.charger || 'N/A'}</span>,
  },
  {
    id: "linkMan",
    label: "联系人",
    value: (item: Organization) => <span className="text-muted-foreground text-xs">{item.linkMan || 'N/A'}</span>,
  },
  {
    id: "tel",
    label: "联系电话",
    value: (item: Organization) => (
       <div className="flex items-center gap-1">
          <PhoneCall className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{item.tel || 'N/A'}</span>
        </div>
    ),
  },
]

// 科研人员表格操作配置
export const personnelTableActions = [
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

// 科研团队表格操作配置
export const teamTableActions = [
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
    id: "addMembers",
    label: "添加成员",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 组织结构表格操作配置
export const organizationTableActions = [
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

// 科研人员卡片操作配置
export const personnelCardActions = [
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

// 科研团队卡片操作配置
export const teamCardActions = [
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
    id: "addMember",
    label: "添加成员",
    icon: <UserPlus className="h-4 w-4" />,
  },
]

// 组织结构卡片操作配置
export const organizationCardActions = [
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
]

// 保留原来的 tableActions 和 cardActions 作为默认配置，但不再直接使用
export const tableActions = personnelTableActions
export const cardActions = personnelCardActions

// 批量操作配置 - 移除项目相关操作
export const batchActions: BatchAction[] = [
  {
    id: "batchSetAdmin",
    label: "批量设置管理员",
    icon: <UserCog className="h-4 w-4" />,
    onClick: () => console.log("批量设置管理员"),
  },
  {
    id: "batchDelete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => console.log("批量删除"),
    variant: "destructive" as const,
  },
]

// 专家表格操作配置 (与科研人员相同)
export const expertTableActions = [...personnelTableActions]

// 专家卡片操作配置 (与科研人员相同)
export const expertCardActions = [...personnelCardActions]

//普通查询配置
// 更新快速筛选配置
export const quickFilters = [
  {
    id: "roleId",
    label: "全部角色",
    value: "all",
    category:"roles",
  },
  {
    id: "status",
    label: "状态",
    value: "all",
    options: [
      { id: "active", label: "在职", value: "active" },
      { id: "retired", label: "退休", value: "retired" },
      { id: "left", label: "离职", value: "left" },
    ],
  },
  {
    id: "teamType",
    label: "团队类型",
    value: "all",
    options: orgTypeOptions.map(opt => ({ id: opt.id, label: opt.label, value: opt.value })),
  },
  {
    id: "unitTypeId",
    label: "组织类型",
    value: "all",
    options: orgTypeOptions.map(opt => ({ id: opt.id, label: opt.label, value: opt.value })),
  },
]

//高级查询配置
interface Field {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "member"; // Use specific types
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface Category {
  id: string;
  title: string;
  fields: Field[];
}
// 定义不同标签页的高级筛选分类
// 人员高级筛选分类
export const personnelFilterCategories: Category[] = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "姓名",
        type: "text",
        placeholder: "请输入姓名关键词"
      },
      {
        id: "account",
        label: "工号",
        type: "text",
        placeholder: "请输入工号"
      },
      {
        id: "nameEn",
        label: "英文名",
        type: "text",
        placeholder: "请输入英文名"
      }
    ]
  },
  {
    id: "position",
    title: "职位信息",
    fields: [
      {
        id: "roleId",
        label: "角色类型",
        type: "select",
        options: [
          { value: "researcher", label: "研究员" },
          { value: "student", label: "学生" },
          { value: "expert", label: "评审专家" },
          { value: "consultant", label: "独立顾问" },
          { value: "other", label: "其他" }
        ]
      },
      {
        id: "unitId",
        label: "所属部门",
        type: "select",
        options: departments.map(dept => ({
          value: dept.id,
          label: dept.name
        }))
      },
      {
        id: "status",
        label: "在职状态",
        type: "select",
        options: [
          { value: "active", label: "在职" },
          { value: "retired", label: "退休" },
          { value: "left", label: "离职" }
        ]
      }
    ]
  },
  {
    id: "personal",
    title: "个人信息",
    fields: [
      {
        id: "sexId",
        label: "性别",
        type: "select",
        options: [
          { value: "1", label: "男" },
          { value: "2", label: "女" }
        ]
      },
      {
        id: "workDate",
        label: "入职日期",
        type: "date"
      },
      {
        id: "mobile",
        label: "手机号码",
        type: "text",
        placeholder: "请输入手机号码"
      }
    ]
  }
];

// 专家高级筛选分类
export const expertFilterCategories: Category[] = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "姓名",
        type: "text",
        placeholder: "请输入姓名关键词"
      },
      {
        id: "account",
        label: "工号/编号",
        type: "text",
        placeholder: "请输入编号"
      }
    ]
  },
  {
    id: "expertise",
    title: "专业信息",
    fields: [
      {
        id: "expertLevel",
        label: "专家级别",
        type: "select",
        options: [
          { value: "national", label: "国家级" },
          { value: "provincial", label: "省级" },
          { value: "city", label: "市级" },
          { value: "university", label: "校级" }
        ]
      },
      {
        id: "specialty",
        label: "专业特长",
        type: "text",
        placeholder: "请输入专业特长关键词"
      },
      {
        id: "title",
        label: "职称",
        type: "select",
        options: [
          { value: "professor", label: "教授" },
          { value: "associate", label: "副教授" },
          { value: "lecturer", label: "讲师" },
          { value: "researcher", label: "研究员" },
          { value: "other", label: "其他" }
        ]
      }
    ]
  },
  {
    id: "origin",
    title: "来源信息",
    fields: [
      {
        id: "unitId",
        label: "所属单位",
        type: "select",
        options: departments.map(dept => ({
          value: dept.id,
          label: dept.name
        }))
      },
      {
        id: "isCampus",
        label: "是否校内",
        type: "select",
        options: [
          { value: "true", label: "是" },
          { value: "false", label: "否" }
        ]
      }
    ]
  }
];

// 团队高级筛选分类
export const teamFilterCategories: Category[] = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "团队名称",
        type: "text",
        placeholder: "请输入团队名称关键词"
      },
      {
        id: "code",
        label: "团队代码",
        type: "text",
        placeholder: "请输入团队代码"
      }
    ]
  },
  {
    id: "teamInfo",
    title: "团队信息",
    fields: [
      {
        id: "teamType",
        label: "团队类型",
        type: "select",
        options: [
          { value: "research", label: "研究团队" },
          { value: "lab", label: "实验室" },
          { value: "center", label: "研究中心" },
          { value: "institute", label: "研究所" },
          { value: "project", label: "项目团队" }
        ]
      },
      {
        id: "leader",
        label: "负责人",
        type: "text",
        placeholder: "请输入负责人姓名"
      },
      {
        id: "foundDate",
        label: "成立日期",
        type: "date"
      }
    ]
  },
  {
    id: "research",
    title: "研究方向",
    fields: [
      {
        id: "researchFields",
        label: "研究领域",
        type: "text",
        placeholder: "请输入研究领域关键词"
      },
      {
        id: "memberCount",
        label: "成员数量",
        type: "number",
        placeholder: "请输入最小成员数量"
      }
    ]
  }
];

// 组织机构高级筛选分类
export const organizationFilterCategories: Category[] = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "组织名称",
        type: "text",
        placeholder: "请输入组织名称关键词"
      },
      {
        id: "code",
        label: "组织代码",
        type: "text",
        placeholder: "请输入组织代码"
      }
    ]
  },
  {
    id: "orgInfo",
    title: "组织信息",
    fields: [
      {
        id: "unitTypeId",
        label: "组织类型",
        type: "select",
        options: orgTypeOptions.map(opt => ({  value: opt.value,label: opt.label })),
      },
      {
        id: "charger",
        label: "负责人",
        type: "text",
        placeholder: "请输入负责人姓名"
      },
      {
        id: "unitCreateDate",
        label: "创建日期",
        type: "date"
      }
    ]
  },
  {
    id: "contact",
    title: "联系信息",
    fields: [
      {
        id: "linkMan",
        label: "联系人",
        type: "text",
        placeholder: "请输入联系人姓名"
      },
      {
        id: "tel",
        label: "联系电话",
        type: "text",
        placeholder: "请输入联系电话"
      }
    ]
  }
];
