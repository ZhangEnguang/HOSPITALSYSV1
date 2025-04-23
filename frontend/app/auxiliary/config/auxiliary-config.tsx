import {
  BadgePlus,
  BarChart3,
  Check,
  CheckCheck,
  Clock,
  FileEdit,
  FileText,
  Layers,
  Pencil,
  Shield,
  Tag,
  Trash2,
  Wallet
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Dict from "@/components/dict/Dict"
import { useRouter } from "next/navigation"
import Link from "next/link"

// 快速筛选选项
export const quickFilters = [
  {
    id: "status",
    label: "状态",
    value: "all",
    category: "基础",
    options: [
      { id: "all", label: "全部状态", value: "all" },
      { id: "enabled", label: "启用", value: "启用" },
      { id: "disabled", label: "停用", value: "停用" },
    ],
  },
]

// 高级筛选选项
export const advancedFilters = [
  {
    id: "createdAt",
    label: "创建日期",
    type: "date-range" as const,
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "createdAt_desc",
    field: "createdAt",
    direction: "desc" as const,
    label: "创建日期 (降序)",
  },
  {
    id: "createdAt_asc",
    field: "createdAt",
    direction: "asc" as const,
    label: "创建日期 (升序)",
  },
  {
    id: "name_asc",
    field: "name",
    direction: "asc" as const,
    label: "名称 (A-Z)",
  },
  {
    id: "name_desc",
    field: "name",
    direction: "desc" as const,
    label: "名称 (Z-A)",
  },
]

// 通用状态颜色
export const statusColors = {
  "启用": "success" as const,
  "停用": "secondary" as const,
  "草稿": "default" as const,
  "待审核": "warning" as const,
  "已审核": "success" as const,
}

// 通用表格列
export const tableColumns = [
  {
    id: "name",
    header: "名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "code",
    header: "编码",
    accessorKey: "code",
    cell: (row: any) => row.code,
  },
  {
    id: "description",
    header: "描述",
    accessorKey: "description",
    cell: (row: any) => (
      <div className="max-w-[300px] truncate" title={row.description}>
        {row.description}
      </div>
    ),
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建时间",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
]

// 通用卡片字段
export const cardFields = [
  {
    id: "code",
    label: "编码",
    value: (row: any) => row.code,
  },
  {
    id: "description",
    label: "描述",
    value: (row: any) => row.description,
  },
  {
    id: "createdAt",
    label: "创建时间",
    value: (row: any) => row.createdAt,
  },
]

// 通用表格操作
export const tableActions = [
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑", row),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除", row),
  },
]

// 批量操作
export const batchActions = [
  {
    id: "enable",
    label: "启用",
    icon: <Check className="h-4 w-4" />,
    variant: "outline" as const,
    onClick: (rows: any[]) => console.log("批量启用", rows),
  },
  {
    id: "disable",
    label: "停用",
    icon: <Clock className="h-4 w-4" />,
    variant: "outline" as const,
    onClick: (rows: any[]) => console.log("批量停用", rows),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "outline" as const,
    onClick: (rows: any[]) => console.log("批量删除", rows),
  },
]

// 项目分类表格列
export const projectCategoryColumns = [
  {
    id: "code",
    header: "分类编号",
    accessorKey: "code",
    cell: (row: any) => row.code,
  },
  {
    id: "name",
    header: "项目分类名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "level",
    header: "项目级别",
    accessorKey: "level",
    cell: (row: any) => row.level || "未设置",
  },
  {
    id: "projectCount",
    header: "项目数",
    accessorKey: "projectCount",
    cell: (row: any) => row.projectCount || 0,
  },
  {
    id: "accountingType",
    header: "建卡形式",
    accessorKey: "accountingType",
    cell: (row: any) => row.accountingType || "未设置",
  },
  {
    id: "fundingForm",
    header: "预算拆分方式",
    accessorKey: "fundingForm",
    cell: (row: any) => row.fundingForm || "未设置",
  },
  {
    id: "undergradCardRequirement",
    header: "项目编号规则",
    accessorKey: "undergradCardRequirement",
    cell: (row: any) => row.undergradCardRequirement || "未设置",
  },
  {
    id: "masterCardRequirement",
    header: "经费卡号规则",
    accessorKey: "masterCardRequirement",
    cell: (row: any) => row.masterCardRequirement || "未设置",
  },
  {
    id: "phdCardRequirement",
    header: "结题卡号规则",
    accessorKey: "phdCardRequirement",
    cell: (row: any) => row.phdCardRequirement || "未设置",
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
]

// 项目分类操作
export const getProjectCategoryActions = (
  handleToggle: (row: any) => void, 
  handleView?: (row: any) => void, 
  handleAddSubCategory?: (row: any) => void, 
  handleEdit?: (row: any) => void,
  handleDelete?: (row: any) => void
) => [
  {
    id: "view",
    label: "查看分类",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleView ? handleView(row) : console.log("查看项目分类", row),
  },
  {
    id: "addSub",
    label: "新增子分类",
    icon: <BadgePlus className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleAddSubCategory ? handleAddSubCategory(row) : console.log("新增子项目分类", row),
  },
  {
    id: "edit",
    label: "编辑分类",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleEdit ? handleEdit(row) : console.log("编辑项目分类", row),
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: <Clock className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleToggle,
  },
  {
    id: "delete",
    label: "删除分类",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleDelete ? handleDelete(row) : console.log("删除项目分类", row),
  },
];

// 为了向后兼容，保留原来的操作
export const projectCategoryActions = [
  {
    id: "view",
    label: "查看分类",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("查看项目分类", row),
  },
  {
    id: "addSub",
    label: "新增子项目分类",
    icon: <BadgePlus className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("新增子项目分类", row),
  },
  {
    id: "edit",
    label: "编辑分类",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑项目分类", row),
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: <Clock className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("切换状态", row),
  },
  {
    id: "delete",
    label: "删除分类",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除项目分类", row),
  },
];

// 项目分类卡片字段
export const projectCategoryCardFields = [
  {
    id: "code",
    label: "分类编码",
    value: (row: any) => (
      <div className="flex items-center">
        <span className="font-semibold">{row.code}</span>
      </div>
    ),
    className: "flex-1"
  },
  {
    id: "level",
    label: "项目级别",
    value: (row: any) => (
      <div className="flex items-center">
        <Dict dictCode="project_level" value={row.projectLevel}  displayType="tag"  />
      </div>
    ),
    className: "flex-1"
  },
  {
    id: "projectCount",
    label: "项目数量",
    value: (row: any) => (
      <div className="flex items-center">
        <span className="text-base font-medium">{row.projectCount || 0}</span>
        <span className="text-xs text-muted-foreground ml-1">个</span>
      </div>
    ),
    className: "flex-1"
  },
  {
    id: "fundingStandard",
    label: "预算标准",
    value: (row: any) => (
      <div className="truncate max-w-[120px]" title={row.fundingStandard || "未设置"}>
        {row.fundingStandard || "未设置"}
      </div>
    ),
    className: "hidden md:block flex-1"
  },
  {
    id: "accountingType",
    label: "建卡形式",
    value: (row: any) => (
      <div>
        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
          {row.accountingType || "未设置"}
        </Badge>
      </div>
    ),
    className: "hidden lg:block flex-1"
  }
]

// 预算标准表格列
export const budgetStandardColumns = [
  {
    id: "name",
    header: "标准名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "code",
    header: "编码",
    accessorKey: "code",
    cell: (row: any) => row.code,
  },
  {
    id: "projectType",
    header: "适用项目类型",
    accessorKey: "projectType",
    cell: (row: any) => <Dict dictCode="project_type" displayType="tag" value={row.projectType} />,
  },
  {
    id: "limitAmount",
    header: "限额",
    accessorKey: "limitAmount",
    cell: (row: any) => row.limitAmount ? `¥${row.limitAmount.toLocaleString()}` : "-",
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建时间",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
]

// 预算标准操作
export const getBudgetStandardActions = (
  handleToggle: (row: any) => void, 
  handleView?: (row: any) => void,
  handleEdit?: (row: any) => void,
  handleDelete?: (row: any) => void
) => [
  {
    id: "view",
    label: "查看标准",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleView ? handleView(row) : console.log("查看预算标准", row),
  },
  {
    id: "edit",
    label: "编辑标准",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => {
      // 停止所有传播
      try {
        if (window.event) {
          const e = window.event as Event;
          e.stopPropagation?.();
          e.preventDefault?.();
          e.cancelBubble = true; // IE兼容性
        }
      } catch (error) {}
      
      // 创建新的a标签方式跳转
      const link = document.createElement('a');
      link.href = `/auxiliary/edit/budget-standard/${row.id}`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);
      
      return false; // 阻止默认行为
    }
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: <Clock className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleToggle,
  },
  {
    id: "delete",
    label: "删除标准",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleDelete ? handleDelete(row) : console.log("删除预算标准", row),
  },
];

// 为了向后兼容，保留原来的操作
export const budgetStandardActions = [
  {
    id: "view",
    label: "查看标准",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("查看预算标准", row),
  },
  {
    id: "edit",
    label: "编辑标准",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑预算标准", row),
  },
  {
    id: "delete",
    label: "删除标准",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除预算标准", row),
  },
];

// 预算标准卡片字段
export const budgetStandardCardFields = [
  {
    id: "code",
    label: "编码",
    value: (row: any) => row.code,
  },
  {
    id: "projectType",
    label: "适用项目类型",
    value: (row: any) => <Dict dictCode="project_type" displayType="tag" value={row.projectType} />,
  },
  {
    id: "limitAmount",
    label: "限额",
    value: (row: any) => row.limitAmount ? `¥${row.limitAmount.toLocaleString()}` : "-",
  },
  {
    id: "status",
    label: "状态",
    value: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    label: "创建时间",
    value: (row: any) => row.createdAt,
  },
]

// 评审工作表表格列
export const reviewWorksheetColumns = [
  {
    id: "name",
    header: "评审表名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "code",
    header: "编码",
    accessorKey: "code",
    cell: (row: any) => row.code,
  },
  {
    id: "projectType",
    header: "适用项目类型",
    accessorKey: "projectType",
    cell: (row: any) => <Dict dictCode="project_type" displayType="text" value={row.projectType} />,
  },
  {
    id: "description",
    header: "描述",
    accessorKey: "description",
    cell: (row: any) => (
      <div className="max-w-[300px] truncate" title={row.description}>
        {row.description}
      </div>
    ),
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建时间",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
]

// 评审工作表操作
export const getReviewWorksheetActions = (
  handleToggle: (row: any) => void, 
  handleView?: (row: any) => void,
  handleEdit?: (row: any) => void,
  handleDelete?: (row: any) => void
) => [
  {
    id: "view",
    label: "查看评审表",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleView || ((row: any) => console.log("查看评审工作表", row)),
  },
  {
    id: "edit",
    label: "编辑评审表",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleEdit ? handleEdit(row) : console.log("编辑评审工作表", row),
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: <Clock className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleToggle,
  },
  {
    id: "delete",
    label: "删除评审表",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleDelete ? handleDelete(row) : console.log("删除评审工作表", row),
  },
];

// 为了向后兼容，保留原来的操作
export const reviewWorksheetActions = [
  {
    id: "view",
    label: "查看评审表",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("查看评审工作表", row),
  },
  {
    id: "edit",
    label: "编辑评审表",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑评审工作表", row),
  },
  {
    id: "delete",
    label: "删除评审表",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除评审工作表", row),
  },
];

// 评审工作表卡片字段
export const reviewWorksheetCardFields = [
  {
    id: "code",
    label: "编码",
    value: (row: any) => row.code,
  },
  {
    id: "projectType",
    label: "适用项目类型",
    value: (row: any) => <Dict dictCode="project_type" displayType="text" value={row.projectType} />,
  },
  {
    id: "description",
    label: "描述",
    value: (row: any) => row.description,
  },
  {
    id: "status",
    label: "状态",
    value: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    label: "创建时间",
    value: (row: any) => row.createdAt,
  },
]

// 管理费提取方案表格列
export const managementFeeSchemeColumns = [
  {
    id: "name",
    header: "方案名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "applicableProjectCategory",
    header: "适用项目分类",
    accessorKey: "applicableProjectCategory",
    cell: (row: any) => row.applicableProjectCategory,
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建日期",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
  {
    id: "description",
    header: "描述",
    accessorKey: "description",
    cell: (row: any) => (
      <div className="max-w-[300px] truncate" title={row.description}>
        {row.description}
      </div>
    ),
  },
]

// 刊物级别表格列
export const journalLevelColumns = [
  {
    id: "code",
    header: "级别编号",
    accessorKey: "code",
    cell: (row: any) => row.code,
  },
  {
    id: "name",
    header: "级别名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "paperType",
    header: "论文类型",
    accessorKey: "paperType",
    cell: (row: any) => row.paperType,
  },
  {
    id: "applicableJournalSource",
    header: "适用期刊源",
    accessorKey: "applicableJournalSource",
    cell: (row: any) => row.applicableJournalSource,
  },
  {
    id: "isIndexed",
    header: "是否为收录",
    accessorKey: "isIndexed",
    cell: (row: any) => (
      <Badge variant={row.isIndexed ? "outline" : "secondary"}>
        {row.isIndexed ? "是" : "否"}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建日期",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
]

// 用章类型表格列
export const sealTypeColumns = [
  {
    id: "businessCategory",
    header: "用章业务分类",
    accessorKey: "businessCategory",
    cell: (row: any) => row.businessCategory,
  },
  {
    id: "businessType",
    header: "用章业务类型",
    accessorKey: "businessType",
    cell: (row: any) => row.businessType,
  },
  {
    id: "sealType",
    header: "用章类型",
    accessorKey: "sealType",
    cell: (row: any) => <span className="font-medium">{row.sealType}</span>,
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建日期",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
  {
    id: "description",
    header: "描述",
    accessorKey: "description",
    cell: (row: any) => (
      <div className="max-w-[300px] truncate" title={row.description}>
        {row.description}
      </div>
    ),
  },
]

// 管理费提取方案卡片字段
export const managementFeeSchemeCardFields = [
  {
    id: "applicableProjectCategory",
    label: "适用项目分类",
    value: (row: any) => row.applicableProjectCategory,
  },
  {
    id: "description",
    label: "描述",
    value: (row: any) => row.description,
  },
  {
    id: "createdAt",
    label: "创建日期",
    value: (row: any) => row.createdAt,
  },
]

// 刊物级别卡片字段
export const journalLevelCardFields = [
  {
    id: "code",
    label: "级别编号",
    value: (row: any) => row.code,
  },
  {
    id: "paperType",
    label: "论文类型",
    value: (row: any) => row.paperType,
  },
  {
    id: "applicableJournalSource",
    label: "适用期刊源",
    value: (row: any) => row.applicableJournalSource,
  },
  {
    id: "isIndexed",
    label: "是否为收录",
    value: (row: any) => (row.isIndexed ? "是" : "否"),
  },
  {
    id: "createdAt",
    label: "创建日期",
    value: (row: any) => row.createdAt,
  },
]

// 用章类型卡片字段
export const sealTypeCardFields = [
  {
    id: "businessCategory",
    label: "用章业务分类",
    value: (row: any) => row.businessCategory,
  },
  {
    id: "businessType",
    label: "用章业务类型",
    value: (row: any) => row.businessType,
  },
  {
    id: "description",
    label: "描述",
    value: (row: any) => row.description,
  },
  {
    id: "createdAt",
    label: "创建日期",
    value: (row: any) => row.createdAt,
  },
]

// 管理费提取方案操作
export const getManagementFeeSchemeActions = (
  handleToggle: (row: any) => void, 
  handleView?: (row: any) => void,
  handleEdit?: (row: any) => void,
  handleDelete?: (row: any) => void
) => [
  {
    id: "view",
    label: "查看方案",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleView ? handleView(row) : console.log("查看管理费提取方案", row),
  },
  {
    id: "edit",
    label: "编辑方案",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleEdit ? handleEdit(row) : console.log("编辑", row),
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: (row: any) => row.status === "启用" ? <Clock className="h-4 w-4" /> : <Check className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleToggle,
  },
  {
    id: "delete",
    label: "删除方案",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleDelete ? handleDelete(row) : console.log("删除", row),
  },
]

// 刊物级别操作
export const getJournalLevelActions = (
  handleToggle: (row: any) => void, 
  handleView?: (row: any) => void,
  handleEdit?: (row: any) => void,
  handleDelete?: (row: any) => void
) => [
  {
    id: "view",
    label: "查看级别",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleView ? handleView(row) : console.log("查看刊物级别", row),
  },
  {
    id: "edit",
    label: "编辑级别",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleEdit ? handleEdit(row) : console.log("编辑刊物级别", row),
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: <Clock className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleToggle,
  },
  {
    id: "delete",
    label: "删除级别",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleDelete ? handleDelete(row) : console.log("删除刊物级别", row),
  },
];

// 用章类型操作
export const getSealTypeActions = (
  handleToggle: (row: any) => void, 
  handleView?: (row: any) => void,
  handleEdit?: (row: any) => void,
  handleDelete?: (row: any) => void
) => [
  {
    id: "view",
    label: "查看用章类型",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleView ? handleView(row) : console.log("查看用章类型", row),
  },
  {
    id: "edit",
    label: "编辑用章类型",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleEdit ? handleEdit(row) : console.log("编辑用章类型", row),
  },
  {
    id: "toggle",
    label: "切换状态",
    icon: <Clock className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: handleToggle,
  },
  {
    id: "delete",
    label: "删除用章类型",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => handleDelete ? handleDelete(row) : console.log("删除用章类型", row),
  },
];

// 管理费提取方案操作
export const managementFeeSchemeActions = [
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑", row),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除", row),
  },
]

// 刊物级别操作
export const journalLevelActions = [
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑", row),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除", row),
  },
]

// 用章类型操作
export const sealTypeActions = [
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("编辑", row),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    onClick: (row: any) => console.log("删除", row),
  },
] 