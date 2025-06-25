"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, Files, File, FileCheck, ListChecks, FilePlus, MoreVertical, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 为 DataList 组件提供的状态变体
export const dataListStatusVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  "启用": "default",
  "禁用": "destructive",
}

// 状态名称映射函数
export const getStatusName = (item: any) => {
  // 适配通用组件的接口，item可能是状态值或者整个item对象
  const status = typeof item === 'string' ? item : item?.status;
  
  switch (status) {
    case "enabled":
      return "启用"
    case "disabled":
      return "禁用"
    default:
      return status || "未知"
  }
}

// 表格列配置
export const tableColumns = [
  {
    id: "reviewType",
    header: "审查类型",
    accessorKey: "reviewType",
    className: "w-[130px]",
    cell: (item: any) => <div>{item.reviewType || "-"}</div>,
  },
  {
    id: "name",
    header: "配置名称",
    accessorKey: "name",
    className: "w-[200px]",
    cell: (item: any) => <div className="font-medium">{item.name}</div>,
  },
  {
    id: "projectType",
    header: "适用项目类型",
    accessorKey: "projectType",
    className: "w-[120px]",
    cell: (item: any) => <div>{item.projectType || "-"}</div>,
  },
  {
    id: "documentCount",
    header: "文件数量",
    accessorKey: "documentCount",
    className: "w-[100px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Files className="h-4 w-4 text-muted-foreground" />
        <span>{item.documentCount || 0}</span>
      </div>
    ),
  },
  {
    id: "requiredCount",
    header: "必交文件",
    accessorKey: "requiredCount",
    className: "w-[100px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <FileCheck className="h-4 w-4 text-green-600" />
        <span>{item.requiredCount || 0}</span>
      </div>
    ),
  },
  {
    id: "optionalCount",
    header: "选交文件",
    accessorKey: "optionalCount",
    className: "w-[100px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <File className="h-4 w-4 text-blue-600" />
        <span>{item.optionalCount || 0}</span>
      </div>
    ),
  },
  {
    id: "createdBy",
    header: "创建人",
    accessorKey: "createdBy",
    className: "w-[120px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.createdBy?.avatar} alt={item.createdBy?.name} />
          <AvatarFallback>{item.createdBy?.name?.charAt(0) || "-"}</AvatarFallback>
        </Avatar>
        <div>{item.createdBy?.name || "-"}</div>
      </div>
    ),
  },
  {
    id: "createdAt",
    header: "创建时间",
    accessorKey: "createdAt",
    className: "w-[150px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div>{item.createdAt ? new Date(item.createdAt).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }) : "-"}</div>
      </div>
    ),
  },
  {
    id: "updatedAt",
    header: "更新时间",
    accessorKey: "updatedAt",
    className: "w-[150px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div>{item.updatedAt ? new Date(item.updatedAt).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }) : "-"}</div>
      </div>
    ),
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    className: "w-[80px]",
    cell: (item: any) => {
      const status = item.status === "enabled" ? "启用" : "禁用";
      const badgeClass = item.status === "enabled" 
        ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 cursor-pointer" 
        : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200 cursor-pointer";
      
      const handlers = typeof window !== 'undefined' ? (window as any).__dataListHandlers : null;
      const handleToggleStatus = handlers?.handleToggleStatus;
      
      return (
        <Badge 
          variant="outline" 
          className={cn("px-2 py-0.5 border transition-colors", badgeClass)}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus?.(item);
          }}
          title={`点击${item.status === "enabled" ? "禁用" : "启用"}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "操作",
    className: "w-[120px] text-right pr-4",
    cell: (item: any) => {
      // 获取来自于 DataList 组件的动作处理器
      // 添加对服务器端渲染的安全检查
      const handlers = typeof window !== 'undefined' ? (window as any).__dataListHandlers : null;
      const handleViewDetails = handlers?.handleViewDetails;
      const handleEditConfig = handlers?.handleEditConfig;
      const handleDeleteConfig = handlers?.handleDeleteConfig;
      const handleToggleStatus = handlers?.handleToggleStatus;
    
      const isEnabled = item.status === "enabled";
      
      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleViewDetails?.(item)}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>查看详情</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={(event) => {
                  event?.stopPropagation?.();
                  // 直接导航到编辑页面，不依赖handleEditConfig
                  if (typeof window !== 'undefined') {
                    const editUrl = `/ethic-review/document-config/edit/${item.id}`;
                    console.log("从表格按钮直接导航到:", editUrl);
                    window.location.href = editUrl;
                  }
                }}
              >
                <FileEdit className="mr-2 h-4 w-4" />
                <span>编辑配置</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus?.(item);
                }}
              >
                {isEnabled ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>禁用配置</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>启用配置</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => handleDeleteConfig?.(item)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>删除配置</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

// 卡片字段配置
export const cardFields = [
  {
    label: "审查类型",
    value: "reviewType",
    render: (item: any) => (
      <div className="text-sm font-medium text-gray-900">
        {item.reviewType || "-"}
      </div>
    ),
  },
  {
    label: "适用项目类型", 
    value: "projectType",
    render: (item: any) => (
      <div className="text-sm text-gray-600">
        {item.projectType || "-"}
      </div>
    ),
  },
  {
    label: "文件数量",
    value: "documentCount", 
    render: (item: any) => (
      <div className="flex items-center gap-2 text-sm">
        <Files className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{item.documentCount || 0}</span>
        <span className="text-gray-500">个文件</span>
      </div>
    ),
  },
  {
    label: "文件构成",
    value: "documentBreakdown",
    render: (item: any) => (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <FileCheck className="h-4 w-4 text-green-600" />
          <span className="text-green-700 font-medium">{item.requiredCount || 0}</span>
          <span className="text-gray-500">必交</span>
        </div>
        <div className="flex items-center gap-1">
          <File className="h-4 w-4 text-blue-600" />
          <span className="text-blue-700 font-medium">{item.optionalCount || 0}</span>
          <span className="text-gray-500">选交</span>
        </div>
      </div>
    ),
  },
];

// 卡片操作配置
export const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      const handleViewDetails = (window as any).__dataListHandlers?.handleViewDetails;
      if (handleViewDetails) {
        handleViewDetails(item);
      }
    },
  },
  {
    id: "edit",
    label: "编辑配置",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item: any, event?: React.MouseEvent) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      console.log("编辑配置按钮点击", item.id);
      
      // 阻止事件冒泡，确保不会触发行点击事件
      event?.stopPropagation?.();
      
      // 使用硬编码的URL直接导航到编辑页面
      const editUrl = `/ethic-review/document-config/edit/${item.id}`;
      console.log("正在强制导航到:", editUrl);
      
      // 优先使用window.location.href进行导航，这是最可靠的导航方式
      window.location.href = editUrl;
    },
  },
  {
    id: "toggle-status",
    label: (item: any) => item.status === "enabled" ? "禁用配置" : "启用配置",
    icon: (item: any) => item.status === "enabled" 
      ? <XCircle className="h-4 w-4" />
      : <CheckCircle className="h-4 w-4" />,
    onClick: (item: any, event?: React.MouseEvent) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      // 阻止事件冒泡
      event?.stopPropagation?.();
      
      const handleToggleStatus = (window as any).__dataListHandlers?.handleToggleStatus;
      if (handleToggleStatus) {
        handleToggleStatus(item);
      }
    },
  },
  {
    id: "delete",
    label: "删除配置",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
    onClick: (item: any) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      const handleDeleteConfig = (window as any).__dataListHandlers?.handleDeleteConfig;
      if (handleDeleteConfig) {
        handleDeleteConfig(item);
      }
    },
  },
];

// 排序选项
export const sortOptions = [
  {
    id: "createdAt-desc",
    label: "创建时间：最新",
    field: "createdAt",
    direction: "desc" as "desc",
  },
  {
    id: "createdAt-asc",
    label: "创建时间：最早",
    field: "createdAt",
    direction: "asc" as "asc",
  },
  {
    id: "updatedAt-desc",
    label: "更新时间：最新",
    field: "updatedAt",
    direction: "desc" as "desc",
  },
  {
    id: "updatedAt-asc",
    label: "更新时间：最早",
    field: "updatedAt",
    direction: "asc" as "asc",
  },
  {
    id: "documentCount-desc",
    label: "文件数量：从多到少",
    field: "documentCount",
    direction: "desc" as "desc",
  },
  {
    id: "documentCount-asc",
    label: "文件数量：从少到多",
    field: "documentCount",
    direction: "asc" as "asc",
  },
  {
    id: "name-asc",
    label: "配置名称：A-Z",
    field: "name",
    direction: "asc" as "asc",
  },
  {
    id: "name-desc",
    label: "配置名称：Z-A",
    field: "name",
    direction: "desc" as "desc",
  },
];

// 快速筛选选项
export const quickFilters = [
  {
    id: "reviewType",
    label: "审查类型",
    value: "全部类型",
    category: "basic",
    options: [
      { id: "all", label: "全部类型", value: "全部类型" },
      { id: "animalInitial", label: "动物初始审查", value: "动物初始审查" },
      { id: "humanInitial", label: "人体初始审查", value: "人体初始审查" },
      { id: "amendment", label: "修正案审查", value: "修正案审查" },
      { id: "annual", label: "年度/定期审查", value: "年度/定期审查" },
      { id: "safety", label: "安全性审查", value: "安全性审查" },
      { id: "deviation", label: "偏离方案报告", value: "偏离方案报告" },
      { id: "termination", label: "暂停/终止研究报告", value: "暂停/终止研究报告" },
      { id: "completion", label: "研究完成报告", value: "研究完成报告" },
      { id: "collection", label: "人遗采集审批", value: "人遗采集审批" },
      { id: "storage", label: "人遗保藏审批", value: "人遗保藏审批" },
      { id: "international", label: "国际合作科学研究审批", value: "国际合作科学研究审批" },
      { id: "export", label: "材料出境审批", value: "材料出境审批" },
      { id: "clinicalTrial", label: "国际合作临床试验备案", value: "国际合作临床试验备案" },
      { id: "provision", label: "对外提供或开放使用备案", value: "对外提供或开放使用备案" },
      { id: "specialResource", label: "重要遗传家系和特定地区人遗资源", value: "重要遗传家系和特定地区人遗资源" },
    ],
  },
  {
    id: "projectType",
    label: "项目类型",
    value: "全部类型",
    category: "basic",
    options: [
      { id: "all", label: "全部类型", value: "全部类型" },
      { id: "human", label: "人体", value: "人体" },
      { id: "animal", label: "动物", value: "动物" },
    ],
  },
  {
    id: "status",
    label: "状态",
    value: "全部状态",
    category: "basic",
    options: [
      { id: "all", label: "全部状态", value: "全部状态" },
      { id: "enabled", label: "启用", value: "启用" },
      { id: "disabled", label: "禁用", value: "禁用" },
    ],
  },
];

// 高级筛选分类
export const filterCategories = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "配置名称",
        type: "text" as "text",
        placeholder: "请输入配置名称关键词",
      },
      {
        id: "reviewType",
        label: "审查类型",
        type: "select" as "select",
        options: [
          { value: "", label: "全部" },
          { value: "动物初始审查", label: "动物初始审查" },
          { value: "人体初始审查", label: "人体初始审查" },
          { value: "修正案审查", label: "修正案审查" },
          { value: "年度/定期审查", label: "年度/定期审查" },
          { value: "安全性审查", label: "安全性审查" },
          { value: "偏离方案报告", label: "偏离方案报告" },
          { value: "暂停/终止研究报告", label: "暂停/终止研究报告" },
          { value: "研究完成报告", label: "研究完成报告" },
          { value: "人遗采集审批", label: "人遗采集审批" },
          { value: "人遗保藏审批", label: "人遗保藏审批" },
          { value: "国际合作科学研究审批", label: "国际合作科学研究审批" },
          { value: "材料出境审批", label: "材料出境审批" },
          { value: "国际合作临床试验备案", label: "国际合作临床试验备案" },
          { value: "对外提供或开放使用备案", label: "对外提供或开放使用备案" },
          { value: "重要遗传家系和特定地区人遗资源", label: "重要遗传家系和特定地区人遗资源" },
        ],
      },
      {
        id: "projectType",
        label: "项目类型",
        type: "select" as "select",
        options: [
          { value: "", label: "全部" },
          { value: "人体", label: "人体" },
          { value: "动物", label: "动物" },
        ],
      },
      {
        id: "status",
        label: "状态",
        type: "select" as "select",
        options: [
          { value: "", label: "全部" },
          { value: "enabled", label: "启用" },
          { value: "disabled", label: "禁用" },
        ],
      },
    ],
  },
  {
    id: "document",
    title: "文件信息",
    fields: [
      {
        id: "documentCount",
        label: "文件数量",
        type: "number" as "number",
        placeholder: "请输入文件数量",
      },
      {
        id: "requiredCount",
        label: "必交文件数",
        type: "number" as "number",
        placeholder: "请输入必交文件数",
      },
      {
        id: "optionalCount",
        label: "选交文件数",
        type: "number" as "number",
        placeholder: "请输入选交文件数",
      },
    ],
  },
  {
    id: "time",
    title: "时间信息",
    fields: [
      {
        id: "createdAt",
        label: "创建日期",
        type: "date" as "date",
        placeholder: "请选择创建日期",
      },
      {
        id: "updatedAt",
        label: "更新日期",
        type: "date" as "date",
        placeholder: "请选择更新日期",
      },
    ],
  },
];

// 批量操作配置
export const batchActions = [
  {
    id: "batch-enable",
    label: "批量启用",
    icon: <CheckCircle className="h-4 w-4" />,
    variant: "default" as const,
    onClick: (selectedItems: any[]) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      const handleBatchToggleStatus = (window as any).__dataListHandlers?.handleBatchToggleStatus;
      if (handleBatchToggleStatus) {
        handleBatchToggleStatus(selectedItems, "enabled");
      }
    },
  },
  {
    id: "batch-disable", 
    label: "批量禁用",
    icon: <XCircle className="h-4 w-4" />,
    variant: "destructive" as const,
    onClick: (selectedItems: any[]) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      const handleBatchToggleStatus = (window as any).__dataListHandlers?.handleBatchToggleStatus;
      if (handleBatchToggleStatus) {
        handleBatchToggleStatus(selectedItems, "disabled");
      }
    },
  },
  {
    id: "batch-delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive" as const,
    onClick: (selectedItems: any[]) => {
      // 避免服务器端渲染错误
      if (typeof window === 'undefined') return;
      
      const handleBatchDelete = (window as any).__dataListHandlers?.handleBatchDelete;
      if (handleBatchDelete) {
        handleBatchDelete(selectedItems);
      }
    },
  },
]; 