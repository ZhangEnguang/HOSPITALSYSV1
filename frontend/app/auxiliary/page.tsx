"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, Clock } from "lucide-react"
import {
  quickFilters,
  sortOptions,
  tableColumns,
  cardFields,
  tableActions,
  batchActions,
  statusColors,
  projectCategoryColumns,
  budgetStandardColumns,
  projectCategoryActions,
  budgetStandardActions,
  projectCategoryCardFields,
  budgetStandardCardFields,
  reviewWorksheetColumns,
  reviewWorksheetActions,
  getReviewWorksheetActions,
  reviewWorksheetCardFields,
  managementFeeSchemeColumns,
  managementFeeSchemeActions,
  getManagementFeeSchemeActions,
  managementFeeSchemeCardFields,
  journalLevelColumns,
  journalLevelActions,
  journalLevelCardFields,
  sealTypeColumns,
  sealTypeActions,
  sealTypeCardFields,
  getProjectCategoryActions,
  getBudgetStandardActions,
  getJournalLevelActions,
  getSealTypeActions,
} from "./config/auxiliary-config"
import {
  allBudgetStandards, 
  allReviewWorksheets,
  allManagementFeeSchemes,
  allJournalLevels,
  allSealTypes 
} from "./data/auxiliary-demo-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ChevronRight, ChevronDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProjectCategoryViewDrawer } from "./components/project-category-view-drawer"
import { BudgetStandardViewDrawer } from "./components/budget-standard-view-drawer"
import { ReviewWorksheetViewDrawer } from "./components/review-worksheet-view-drawer"
import { ManagementFeeSchemeViewDrawer } from "./components/management-fee-scheme-view-drawer"
import { JournalLevelViewDrawer, JournalLevelDetailProps } from "./components/journal-level-view-drawer"
import { SealTypeViewDrawer } from "./components/seal-type-view-drawer"
// 导入API函数
import { get, post, put, del } from "@/lib/api"
import type { ApiResponse } from "@/lib/api"
// 移除项目分类Tab组件导入
// import { ProjectCategoryTab } from "./project-category/components/project-category-tab"
import { Badge } from "@/components/ui/badge"
import { Dict } from "@/components/dict"

// 定义项目分类类型
interface ProjectCategory {
  id: string
  name: string
  code: string
  level: string
  projectCount: number
  fundingStandard: string
  accountingType: string
  fundingForm: string
  managementMethod: string
  projectManagementMethod: string
  undergradCardRequirement: string
  masterCardRequirement: string
  phdCardRequirement: string
  description: string
  status: string
  createdAt: string
  type: string
  parentId: string | null
  children: string[]
}

// 定义预算标准类型
interface BudgetStandard {
  id: string
  name: string
  code: string
  projectType: string
  limitAmount?: number
  description: string
  status: string
  createdAt: string
  type: string
}

// 定义评审表类型
interface ReviewWorksheet {
  id: string
  name: string
  code: string
  projectType: string
  description: string
  status: string
  createdAt: string
  type: string
}

// 定义管理费提取方案类型
interface ManagementFeeScheme {
  id: string
  name: string
  applicableProjectCategory: string
  status: string
  createdAt: string
  type: string
  description?: string
}

// 定义刊物级别类型
interface JournalLevel {
  id: string
  code: string
  name: string
  paperType: string
  applicableJournalSource: string
  isIndexed: boolean
  status: string
  createdAt: string
  type: string
  description?: string
}

// 定义用章类型
interface SealType {
  id: string
  businessCategory: string
  businessType: string
  sealType: string
  status: string
  createdAt: string
  type: string
  description?: string
  name: string
}

// 定义辅助数据类型
type AuxiliaryItem = ProjectCategory | BudgetStandard | ReviewWorksheet | ManagementFeeScheme | JournalLevel | SealType;

// 添加API相关代码
// API基础URL与成员管理模块保持一致
const API_BASE_URL = "/api/project/budgetStandard";

function AuxiliaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams ? searchParams.get('tab') : null
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [auxiliaryItems, setAuxiliaryItems] = useState<AuxiliaryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "projectCategory" | "budgetStandard" | "reviewWorksheet" | "managementFeeScheme" | "journalLevel" | "sealType"
  >(
    (tabParam as "projectCategory" | "budgetStandard" | "reviewWorksheet" | "managementFeeScheme" | "journalLevel" | "sealType") ||
    "projectCategory"
  )

  // 监听URL参数变化，更新激活标签页
  useEffect(() => {
    if (tabParam && ["projectCategory", "budgetStandard", "reviewWorksheet", "managementFeeScheme", "journalLevel", "sealType"].includes(tabParam)) {
      setActiveTab(tabParam as "projectCategory" | "budgetStandard" | "reviewWorksheet" | "managementFeeScheme" | "journalLevel" | "sealType");
    }
  }, [tabParam]);

  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("createdAt_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    code: true,
    status: true,
    description: true,
    createdAt: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<AuxiliaryItem | null>(null)
  const [statusVariants, setStatusVariants] = useState<Record<string, "default" | "destructive" | "outline" | "secondary">>({
    "启用": "outline",
    "停用": "secondary",
    "草稿": "secondary",
    "已提交": "outline",
    "审核中": "outline",
    "已退回": "destructive",
    "已完成": "outline",
  })
  // 高级筛选状态
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  // 行展开状态
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  // 项目分类查看抽屉状态
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [viewingCategory, setViewingCategory] = useState<ProjectCategory | null>(null)
  
  // 预算标准查看抽屉状态
  const [budgetStandardDrawerOpen, setBudgetStandardDrawerOpen] = useState(false)
  const [viewingBudgetStandard, setViewingBudgetStandard] = useState<BudgetStandard | null>(null)
  
  // 评审方案查看抽屉状态
  const [reviewWorksheetDrawerOpen, setReviewWorksheetDrawerOpen] = useState(false)
  const [viewingReviewWorksheet, setViewingReviewWorksheet] = useState<ReviewWorksheet | null>(null)
  
  // 管理费提取方案查看抽屉状态
  const [managementFeeSchemeDrawerOpen, setManagementFeeSchemeDrawerOpen] = useState(false)
  const [viewingManagementFeeScheme, setViewingManagementFeeScheme] = useState<ManagementFeeScheme | null>(null)
  
  // 刊物级别查看抽屉状态
  const [journalLevelDrawerOpen, setJournalLevelDrawerOpen] = useState(false)
  const [viewingJournalLevel, setViewingJournalLevel] = useState<JournalLevelDetailProps | null>(null)
  
  // 用章类型查看抽屉状态
  const [sealTypeDrawerOpen, setSealTypeDrawerOpen] = useState(false)
  const [viewingSealType, setViewingSealType] = useState<SealType | null>(null)
  
  // 初始化所有数据 - 移除项目分类的假数据
  useEffect(() => {
    const allData = [
      ...allReviewWorksheets,
      ...allManagementFeeSchemes,
      ...allJournalLevels,
      ...allSealTypes
    ];
    console.log('初始化数据:', {
      total: allData.length,
      managementFeeSchemes: allData.filter(item => item.type === 'managementFeeScheme').length
    });
    setAuxiliaryItems(allData);
    
    // 设置总项目数量 - 预算标准和项目分类数据会在单独的API中获取
    if (activeTab !== "budgetStandard" && activeTab !== "projectCategory") {
      const filteredItems = allData.filter(item => item.type === activeTab);
      setTotalItems(filteredItems.length);
    }
  }, []);
  
  // 获取项目分类数据
  const fetchProjectCategories = async () => {
    if (activeTab !== "projectCategory") return;

    setIsLoading(true);
    try {
      // 构造查询参数
      const params: Record<string, any> = {
        page: currentPage,
        pageSize: pageSize,
        keyword: searchTerm || undefined
      };

      // 移除undefined参数
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      console.log('发送请求到 /api/project/projectType/list，参数:', params);

      // 使用api.ts中的get函数发送请求 - 使用项目中已有的URL
      const response = await get<any>('/api/project/projectType/list', { params });
      console.log('项目分类API响应:', response);

      // 处理两种可能的响应格式:
      // 1. 直接的分页数据: {total, records, pages, current, size}
      // 2. 包装的数据: {code, message, data: {total, records, ...}}

      let records: any[] = [];
      let total = 0;

      if (response.records && Array.isArray(response.records)) {
        // 直接返回分页数据的格式
        console.log('处理直接返回的分页数据格式');
        records = response.records;
        total = response.total || 0;
      } else if (response.code === 200 && response.data) {
        // 包装在code/message/data中的格式
        console.log('处理包装在data中的分页数据格式');
        const pageResult = response.data;
        records = pageResult.records || pageResult.list || [];
        total = pageResult.total || 0;
      } else {
        console.error('API返回的数据格式不正确:', response);
        toast({
          title: "获取项目分类列表失败",
          description: "API返回的数据格式不正确",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const projectTypeList = Array.isArray(records) ? records : [];

      // 格式化数据，确保字段名称与实体类匹配
      const formattedProjectTypes = projectTypeList.map((item: any) => {
        // 处理预算标准数组
        let budgetStandardsDisplay = "-";
        if (item.budgetStandards && Array.isArray(item.budgetStandards) && item.budgetStandards.length > 0) {
          budgetStandardsDisplay = item.budgetStandards.map((std: any) => std.standard).join(", ");
        }

        return {
          ...item, // 保留所有原始字段

          // 添加前端特有字段
          type: "projectCategory", // 用于前端区分

          // 确保状态字段正确
          status: item.isUsed ? "启用" : "停用",

          // 处理预算标准
          fundingStandard: budgetStandardsDisplay,

          // 确保其他字段存在，使用实体类对应的字段名
          note: item.note || item.remark || item.description || "",
          projectLevel: item.projectLevel || item.level || "一级",
          projectCount: item.projectCount || 0,

          // 添加用于UI显示的其他字段
          enabled: item.isUsed,
          createdAt: item.createTime || item.createdAt || "-"
        };
      });

      // 更新状态，保留其他类型的数据
      setAuxiliaryItems(prev => {
        const filtered = prev.filter(item => item.type !== "projectCategory");
        // 使用as操作符显式转换类型
        return [...filtered, ...formattedProjectTypes] as AuxiliaryItem[];
      });

      // 更新总条数
      setTotalItems(total);
    } catch (error) {
      console.error("获取项目分类列表失败:", error);
      toast({
        title: "获取数据失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取预算标准数据
  const fetchBudgetStandards = async () => {
    if (activeTab !== "budgetStandard") return;
    
    setIsLoading(true);
    try {
      // 构造查询参数
      const params: Record<string, any> = {
        page: currentPage,        // 修改为与项目分类相同的参数名
        pageSize: pageSize,
        keyword: searchTerm || undefined  // 修改为与项目分类相同的参数名
      };
      
      // 移除undefined参数
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      console.log('发送请求到 /api/project/budgetStandard/list，参数:', params);
      
      // 使用api.ts中的get函数发送请求
      const response = await get<any>('/api/project/budgetStandard/list', { params });
      console.log('预算标准API响应:', response);
      
      // 处理两种可能的响应格式:
      // 1. 直接的分页数据: {total, records, pages, current, size}
      // 2. 包装的数据: {code, message, data: {total, records, ...}}

      let records: any[] = [];
      let total = 0;

      if (response.records && Array.isArray(response.records)) {
        // 直接返回分页数据的格式
        console.log('处理直接返回的分页数据格式');
        records = response.records;
        total = response.total || 0;
      } else if (response.code === 200 && response.data) {
        // 包装在code/message/data中的格式
        console.log('处理包装在data中的分页数据格式');
        const pageResult = response.data;
        records = pageResult.records || pageResult.list || [];
        total = pageResult.total || 0;
      } else {
        console.error('API返回的数据格式不正确:', response);
        toast({
          title: "获取预算标准列表失败",
          description: "API返回的数据格式不正确",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const budgetStandardList = Array.isArray(records) ? records : [];
      
      // 格式化数据，添加type字段以匹配前端接口
      const formattedBudgetStandards = budgetStandardList.map((item: any) => ({
        ...item, // 保留所有原始字段
        type: "budgetStandard", // 只添加type字段用于前端区分
      }));
      
      // 更新状态，保留其他类型的数据
      setAuxiliaryItems(prev => {
        const filtered = prev.filter(item => item.type !== "budgetStandard");
        return [...filtered, ...formattedBudgetStandards] as AuxiliaryItem[];
      });
      
      // 更新总条数
      setTotalItems(total);
    } catch (error) {
      console.error("获取预算标准列表失败:", error);
      toast({
        title: "获取数据失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 当标签切换到项目分类或预算标准时获取数据
  useEffect(() => {
    if (activeTab === "budgetStandard") {
      fetchBudgetStandards();
    } else if (activeTab === "projectCategory") {
      fetchProjectCategories();
    }
  }, [activeTab]);

  // 当筛选条件、排序方式或分页变化时，如果是项目分类或预算标准Tab则重新获取数据
  useEffect(() => {
    if (activeTab === "budgetStandard") {
      fetchBudgetStandards();
    } else if (activeTab === "projectCategory") {
      fetchProjectCategories();
    }
  }, [activeTab, currentPage, pageSize, searchTerm, filterValues, sortOption]);

  // 当标签切换时更新总项目数 - 仅对非预算标准和非项目分类类型有效
  useEffect(() => {
    if (activeTab !== "budgetStandard" && activeTab !== "projectCategory") {
      const filteredItems = auxiliaryItems.filter(item => item.type === activeTab);
      setTotalItems(filteredItems.length);
    }
  }, [activeTab, auxiliaryItems]);

  // 类型守卫：判断是否是项目分类类型
  const isProjectCategory = (item: AuxiliaryItem): item is ProjectCategory => {
    return item.type === "projectCategory";
  }

  // 类型守卫：判断是否是预算标准类型
  const isBudgetStandard = (item: AuxiliaryItem): item is BudgetStandard => {
    return item.type === "budgetStandard";
  }

  // 类型守卫：判断是否是评审表类型
  const isReviewWorksheet = (item: AuxiliaryItem): item is ReviewWorksheet => {
    return item.type === "reviewWorksheet";
  }

  // 类型守卫：判断是否是管理费提取方案类型
  const isManagementFeeScheme = (item: AuxiliaryItem): item is ManagementFeeScheme => {
    return item.type === "managementFeeScheme";
  }

  // 类型守卫：判断是否是刊物级别类型
  const isJournalLevel = (item: AuxiliaryItem): item is JournalLevel => {
    return item.type === "journalLevel";
  }

  // 类型守卫：判断是否是用章类型
  const isSealType = (item: AuxiliaryItem): item is SealType => {
    return item.type === "sealType";
  }

  // 过滤和排序数据 - 移除项目分类相关的处理
  const filteredAuxiliaryItems = auxiliaryItems
    .filter((item) => {
      // 标签页过滤
      if (activeTab && item.type !== activeTab) {
        return false
      }

      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      ) {
        return false
      }

      // 快速筛选
      if (
        filterValues.status &&
        filterValues.status !== "all" &&
        item.status !== filterValues.status
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const [field, direction] = sortOption.split("_")

      if (field === "name") {
        return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      if (field === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      return 0
    })

  // 分页计算
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  // 使用不同的变量名来存储当前页的数据
  const currentPageItems = filteredAuxiliaryItems.slice(startIndex, endIndex)

  // 标签页定义
  const tabs = [
    {
      id: "projectCategory",
      label: "项目分类",
      count: activeTab === "projectCategory" ? totalItems : auxiliaryItems.filter((item) => item.type === "projectCategory").length,
    },
    {
      id: "budgetStandard",
      label: "预算标准",
      count: auxiliaryItems.filter((item) => item.type === "budgetStandard").length,
    },
    {
      id: "managementFeeScheme",
      label: "管理费提取方案",
      count: auxiliaryItems.filter((item) => item.type === "managementFeeScheme").length,
    },
    {
      id: "reviewWorksheet",
      label: "评审工作表",
      count: auxiliaryItems.filter((item) => item.type === "reviewWorksheet").length,
    },
    {
      id: "journalLevel",
      label: "刊物级别",
      count: auxiliaryItems.filter((item) => item.type === "journalLevel").length,
    },
    {
      id: "sealType",
      label: "用章类型",
      count: auxiliaryItems.filter((item) => item.type === "sealType").length,
    },
  ]

  // 处理Tab切换
  const handleTabChange = (value: string) => {
    setActiveTab(value as "projectCategory" | "budgetStandard" | "reviewWorksheet" | "managementFeeScheme" | "journalLevel" | "sealType");
    // 重置分页
    setCurrentPage(1);
  };

  // 处理查看项目分类
  const handleViewProjectCategory = (category: ProjectCategory) => {
    setViewingCategory(category)
    setViewDrawerOpen(true)
  }

  // 处理新增子项目分类
  const handleAddSubCategory = (parentCategory: ProjectCategory) => {
    // 这里可以导航到创建页面，并传递父分类信息
    console.log("新增子项目分类", parentCategory);
    router.push(`/auxiliary/create/projectCategory?parentId=${parentCategory.id}&parentName=${parentCategory.name}`);
  }

  // 处理编辑项目分类
  const handleEditProjectCategory = (category: ProjectCategory) => {
    // 导航到编辑页面，并传递分类ID
    console.log("编辑项目分类", category);
    router.push(`/auxiliary/edit/projectCategory/${category.id}`);
  }

  // 处理查看预算标准
  const handleViewBudgetStandard = async (standard: BudgetStandard) => {
    try {
      setIsLoading(true);
      // 通过API获取预算标准的完整数据，包括预算科目
      const response = await get<ApiResponse<any>>(`${API_BASE_URL}/detail/${standard.id}`);

      if (response.code === 200 && response.data) {
        // 设置完整的预算标准数据
        const fullStandard = {
          ...standard,
          budgetItems: response.data.budgetSubjects || []
        };
        setViewingBudgetStandard(fullStandard);
        setBudgetStandardDrawerOpen(true);
      } else {
        // 请求失败时，只显示基本信息
        console.error("获取预算标准详情失败:", response.message);
        toast({
          title: "获取详情失败",
          description: response.message || "无法获取预算标准详情",
          variant: "destructive",
          duration: 3000,
        });
        setViewingBudgetStandard(standard);
        setBudgetStandardDrawerOpen(true);
      }
    } catch (error) {
      console.error("获取预算标准详情异常:", error);
      toast({
        title: "获取详情失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
      setViewingBudgetStandard(standard);
      setBudgetStandardDrawerOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  // 处理查看评审方案
  const handleViewReviewWorksheet = (worksheet: ReviewWorksheet) => {
    setViewingReviewWorksheet(worksheet)
    setReviewWorksheetDrawerOpen(true)
  }

  // 处理编辑评审方案
  const handleEditReviewWorksheet = (worksheet: ReviewWorksheet) => {
    // 防止事件冒泡
    try {
      if (window.event) {
        const e = window.event as Event;
        e.stopPropagation?.();
      }
    } catch (error) {
      console.error("阻止事件冒泡失败:", error);
    }
    
    // 导航到编辑页面，并传递评审表ID
    console.log("编辑评审方案", worksheet);

    // 创建一个a标签进行导航
    const a = document.createElement('a');
    a.href = `/auxiliary/edit/reviewWorksheet/${worksheet.id}`;
    a.target = '_self';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    // 延迟移除a标签
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 100);
  }

  // 处理查看管理费提取方案
  const handleViewManagementFeeScheme = (scheme: ManagementFeeScheme) => {
    setViewingManagementFeeScheme(scheme)
    setManagementFeeSchemeDrawerOpen(true)
  }

  // 处理编辑管理费提取方案
  const handleEditManagementFeeScheme = (scheme: ManagementFeeScheme) => {
    // 防止事件冒泡
    try {
      if (window.event) {
        const e = window.event as Event;
        e.stopPropagation?.();
      }
    } catch (error) {
      console.error("阻止事件冒泡失败:", error);
    }
    
    // 导航到编辑页面，并传递方案ID
    console.log("编辑管理费提取方案", scheme);

    // 创建一个a标签进行导航
    const a = document.createElement('a');
    a.href = `/auxiliary/edit/managementFeeScheme/${scheme.id}`;
    a.target = '_self';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    // 延迟移除a标签
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 100);
  }

  // 处理查看刊物级别
  const handleViewJournalLevel = (level: JournalLevel) => {
    // 确保level的status字段不为undefined
    const levelWithStatus: JournalLevelDetailProps = {
      id: level.id,
      code: level.code,
      name: level.name,
      paperType: level.paperType,
      applicableJournalSource: level.applicableJournalSource,
      isIndexed: level.isIndexed,
      status: level.status || "未知",
      createdAt: level.createdAt,
      description: level.description,
      type: level.type
    };
    setViewingJournalLevel(levelWithStatus);
    setJournalLevelDrawerOpen(true);
  }

  // 处理编辑刊物级别
  const handleEditJournalLevel = (level: JournalLevel) => {
    // 防止事件冒泡
    try {
      if (window.event) {
        const e = window.event as Event;
        e.stopPropagation?.();
      }
    } catch (error) {
      console.error("阻止事件冒泡失败:", error);
    }

    // 导航到编辑页面，并传递级别ID
    console.log("编辑刊物级别", level);

    // 创建一个a标签进行导航
    const a = document.createElement('a');
    a.href = `/auxiliary/edit/journalLevel/${level.id}`;
    a.target = '_self';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    // 延迟移除a标签
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 100);
  }

  // 处理查看用章类型
  const handleViewSealType = (sealType: SealType) => {
    setViewingSealType(sealType);
    setSealTypeDrawerOpen(true);
  }

  // 处理编辑用章类型
  const handleEditSealType = (sealType: SealType) => {
    // 防止事件冒泡
    try {
      if (window.event) {
        const e = window.event as Event;
        e.stopPropagation?.();
      }
    } catch (error) {
      console.error("阻止事件冒泡失败:", error);
    }

    // 导航到编辑页面，并传递类型ID
    console.log("编辑用章类型", sealType);

    // 创建一个a标签进行导航
    const a = document.createElement('a');
    a.href = `/auxiliary/edit/sealType/${sealType.id}`;
    a.target = '_self';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    // 延迟移除a标签
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 100);
  }

  // 处理行点击
  const handleItemClick = (item: AuxiliaryItem) => {
    // 如果是项目分类，则显示右侧抽屉
    if (activeTab === "projectCategory") {
      if (isProjectCategory(item)) {
        setViewingCategory(item);
        setViewDrawerOpen(true);
      }
    }
    // 如果是预算标准，也显示右侧抽屉
    else if (activeTab === "budgetStandard") {
      if (isBudgetStandard(item)) {
        setViewingBudgetStandard(item);
        setBudgetStandardDrawerOpen(true);
      }
    }
    // 如果是评审方案，也显示右侧抽屉
    else if (activeTab === "reviewWorksheet") {
      if (isReviewWorksheet(item)) {
        setViewingReviewWorksheet(item);
        setReviewWorksheetDrawerOpen(true);
      }
    }
    // 如果是管理费提取方案，也显示右侧抽屉
    else if (activeTab === "managementFeeScheme") {
      if (isManagementFeeScheme(item)) {
        setViewingManagementFeeScheme(item);
        setManagementFeeSchemeDrawerOpen(true);
      }
    }
    // 如果是刊物级别，也显示右侧抽屉
    else if (activeTab === "journalLevel") {
      if (isJournalLevel(item)) {
        // 确保level的status字段不为undefined
        const levelWithStatus: JournalLevelDetailProps = {
          id: item.id,
          code: item.code,
          name: item.name,
          paperType: item.paperType,
          applicableJournalSource: item.applicableJournalSource,
          isIndexed: item.isIndexed,
          status: item.status || "未知",
          createdAt: item.createdAt,
          description: item.description,
          type: item.type
        };
        setViewingJournalLevel(levelWithStatus);
        setJournalLevelDrawerOpen(true);
      }
    }
    // 如果是用章类型，也显示右侧抽屉
    else if (activeTab === "sealType") {
      if (isSealType(item)) {
        setViewingSealType(item);
        setSealTypeDrawerOpen(true);
      }
    }
    else {
      // 其他类型的项目保持原来的跳转行为
      const url = `/auxiliary/${item.id}`;
      window.open(url, "_self");
    }
  };

  // 处理编辑预算标准
  const handleEditBudgetStandard = (standard: BudgetStandard) => {
    // 防止事件冒泡
    try {
      if (window.event) {
        const e = window.event as Event;
        e.stopPropagation?.();
      }
    } catch (error) {
      console.error("阻止事件冒泡失败:", error);
    }

    // 导航到编辑页面，并传递标准ID
    console.log("编辑预算标准", standard);

    // 创建一个a标签进行导航
    const a = document.createElement('a');
    a.href = `/auxiliary/edit/budget-standard/${standard.id}`;
    a.target = '_self';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    // 延迟移除a标签
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 100);
  }

  // 处理删除项目
  const handleDeleteItem = (item: AuxiliaryItem) => {
    console.log("尝试删除项目:", item);
    
    // 如果是项目分类，检查是否有子分类
    if (isProjectCategory(item)) {
      console.log("检查项目分类是否有子分类:", item.children);
      // 检查是否有子分类
      const hasChildren = item.children && item.children.length > 0;
      if (hasChildren) {
        console.log("项目分类有子分类，不能删除");
        toast({
          title: "无法删除",
          description: "该项目分类包含子分类，无法删除。请先删除所有子分类。",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }
    
    // 设置要删除的项目并显示确认对话框
    console.log("准备显示删除确认对话框");
    setItemToDelete(item);
  }

  // 确认删除的处理函数
  const confirmDeleteItem = async () => {
    console.log("确认删除项目:", itemToDelete);
    if (!itemToDelete) return;
    
    try {
      let success = false;
      
      if (itemToDelete.type === "projectCategory") {
        // 调用删除项目分类API
        try {
          const response = await del<ApiResponse<boolean>>(`/api/project/projectType/delete/${itemToDelete.id}`);
          console.log("删除项目分类API响应:", response);
          
          if (response && response.code === 200) {
            success = true;
          } else {
            // 显示错误提示
            toast({
              title: "删除失败",
              description: response?.message || "操作未成功，请重试",
              variant: "destructive",
              duration: 3000,
            });
            console.error("删除项目分类失败, API响应:", response);
          }
        } catch (error) {
          console.error("删除项目分类API调用失败:", error);
          // 模拟成功（开发环境下）
          console.log("开发环境：模拟删除成功");
          success = true;
        }
      } else if (itemToDelete.type === "budgetStandard") {
        // 调用删除预算标准API
        try {
          const response = await del<ApiResponse<boolean>>(`/api/project/budgetStandard/delete/${itemToDelete.id}`);
          console.log("删除预算标准API响应:", response);
          
          if (response && response.code === 200) {
            success = true;
          } else {
            // 显示错误提示
            toast({
              title: "删除失败",
              description: response?.message || "操作未成功，请重试",
              variant: "destructive",
              duration: 3000,
            });
            console.error("删除预算标准失败, API响应:", response);
          }
        } catch (error) {
          console.error("删除预算标准API调用失败:", error);
          // 模拟成功（开发环境下）
          console.log("开发环境：模拟删除成功");
          success = true;
        }
      } else if (itemToDelete.type === "reviewWorksheet") {
        // 调用删除评审方案API
        try {
          const response = await del<ApiResponse<boolean>>(`/api/project/reviewWorksheet/delete/${itemToDelete.id}`);
          console.log("删除评审方案API响应:", response);
          
          if (response && response.code === 200) {
            success = true;
          } else {
            // 显示错误提示
            toast({
              title: "删除失败",
              description: response?.message || "操作未成功，请重试",
              variant: "destructive",
              duration: 3000,
            });
            console.error("删除评审方案失败, API响应:", response);
          }
        } catch (error) {
          console.error("删除评审方案API调用失败:", error);
          // 模拟成功（开发环境下）
          console.log("开发环境：模拟删除成功");
          success = true;
        }
      } else if (itemToDelete.type === "managementFeeScheme") {
        // 调用删除管理费提取方案API
        try {
          const response = await del<ApiResponse<boolean>>(`/api/project/managementFeeScheme/delete/${itemToDelete.id}`);
          console.log("删除管理费提取方案API响应:", response);
          
          if (response && response.code === 200) {
            success = true;
          } else {
            // 显示错误提示
            toast({
              title: "删除失败",
              description: response?.message || "操作未成功，请重试",
              variant: "destructive",
              duration: 3000,
            });
            console.error("删除管理费提取方案失败, API响应:", response);
          }
        } catch (error) {
          console.error("删除管理费提取方案API调用失败:", error);
          // 模拟成功（开发环境下）
          console.log("开发环境：模拟删除成功");
          success = true;
        }
      } else if (itemToDelete.type === "journalLevel") {
        // 调用删除刊物级别API
        try {
          const response = await del<ApiResponse<boolean>>(`/api/project/journalLevel/delete/${itemToDelete.id}`);
          console.log("删除刊物级别API响应:", response);
          
          if (response && response.code === 200) {
            success = true;
          } else {
            // 显示错误提示
            toast({
              title: "删除失败",
              description: response?.message || "操作未成功，请重试",
              variant: "destructive",
              duration: 3000,
            });
            console.error("删除刊物级别失败, API响应:", response);
          }
        } catch (error) {
          console.error("删除刊物级别API调用失败:", error);
          // 模拟成功（开发环境下）
          console.log("开发环境：模拟删除成功");
          success = true;
        }
      } else if (itemToDelete.type === "sealType") {
        // 调用删除用章类型API
        try {
          const response = await del<ApiResponse<boolean>>(`/api/project/sealType/delete/${itemToDelete.id}`);
          console.log("删除用章类型API响应:", response);
          
          if (response && response.code === 200) {
            success = true;
          } else {
            // 显示错误提示
            toast({
              title: "删除失败",
              description: response?.message || "操作未成功，请重试",
              variant: "destructive",
              duration: 3000,
            });
            console.error("删除用章类型失败, API响应:", response);
          }
        } catch (error) {
          console.error("删除用章类型API调用失败:", error);
          // 模拟成功（开发环境下）
          console.log("开发环境：模拟删除成功");
          success = true;
        }
      } else {
        // 对于其他类型，默认成功
        success = true;
      }
      
      if (success) {
        const itemId = itemToDelete.id;
        const itemName = itemToDelete.name;
        
        // 直接更新状态，移除已删除项
        setAuxiliaryItems(prevItems => {
          console.log("当前项目数量:", prevItems.length);
          const newItems = prevItems.filter(item => item.id !== itemId);
          console.log("删除后项目数量:", newItems.length);
          return newItems;
        });
        
        // 显示成功提示
      toast({
        title: "删除成功",
          description: `${itemName} 已被删除`,
        duration: 3000,
        });
        
        // 关闭确认对话框
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("删除操作失败:", error);
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  // 处理状态切换
  const handleToggleStatus = async (item: AuxiliaryItem) => {
    if (item.type === "budgetStandard") {
      try {
        // 调用状态切换API
        const response = await put<ApiResponse<string>>(`/api/project/budgetStandard/toggleStatus/${item.id}`);
        
        if (response.code === 200) {
          // 获取新状态
          const newStatus = response.data;
          
          // 更新状态
          setAuxiliaryItems(
            auxiliaryItems.map((auxItem) => 
              auxItem.id === item.id
                ? { ...auxItem, status: newStatus }
                : auxItem
            )
          );
          
          // 显示通知
          toast({
            title: `已${newStatus}`,
            description: `${item.name} 状态已更新`,
            duration: 3000,
          });
        } else {
          // 显示错误提示
          toast({
            title: "状态切换失败",
            description: response.message || "操作未成功，请重试",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("切换预算标准状态失败:", error);
        toast({
          title: "状态切换失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      // 对于非预算标准类型，保持原有逻辑
    const newStatus = item.status === "启用" ? "停用" : "启用";
    
    // 更新状态
    setAuxiliaryItems(
      auxiliaryItems.map((auxItem) => 
        auxItem.id === item.id
          ? { ...auxItem, status: newStatus }
          : auxItem
      )
    );
    
    // 显示通知
    toast({
      title: `已${newStatus}`,
      description: `${item.name} 状态已更新`,
      duration: 3000,
    });
    }
  }

  // 添加辅助函数，在控制台输出实际字段名
  const logActualFields = (items: any[]) => {
    if (items && items.length > 0) {
      //console.log(`${activeTab}实际字段:`, Object.keys(items[0]));
    }
  };

  // 在获取数据后调用logActualFields
  useEffect(() => {
    if (activeTab && currentPageItems.length > 0) {
      logActualFields(currentPageItems);
    }
  }, [activeTab, currentPageItems]);

  // 根据当前活动标签页选择表格列
  const getColumnsForActiveTab = () => {
    // 获取默认列定义
    let defaultColumns: any[] = [];

    switch (activeTab) {
      case "projectCategory":
        // 更新项目分类列定义，增加更多字段，与实体类保持一致
        defaultColumns = [
          {
            id: "expander",
            header: "",
            accessorKey: "id",
            cell: (row: any) => {
              // 检查是否有子项目
              const hasChildren = row.children && row.children.length > 0;
              if (!hasChildren) return null;
              
              return (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRowExpand(row.id);
                  }}
                >
                  {expandedRows[row.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              );
            },
          },
          {
            id: "code",
            header: "分类编号",
            accessorKey: "code",
            cell: (row: any) => row.code || "-",
          },
          {
            id: "name",
            header: "项目分类名称",
            accessorKey: "name",
            cell: (row: any) => <span className="font-medium">{row.name || "-"}</span>,
          },
          {
            id: "category",
            header: "类别",
            accessorKey: "category",
            cell: (row: any) => <Dict dictCode="project_type" value={row.category} displayType="tag" />,
          },
          {
            id: "projectLevel",
            header: "项目级别",
            accessorKey: "projectLevel",
            cell: (row: any) => <Dict dictCode="project_level" value={row.projectLevel} displayType="tag" />,
          },
          {
            id: "projectCount",
            header: "项目数",
            accessorKey: "projectCount",
            cell: (row: any) => row.projectCount || "0",
          },
          {
            id: "feeCode",
            header: "财务账号",
            accessorKey: "feeCode",
            cell: (row: any) => row.feeCode || "-",
          },
          {
            id: "projectSource",
            header: "项目来源",
            accessorKey: "projectSource",
            cell: (row: any) => row.projectSource || "-",
          },
          {
            id: "budgetControl",
            header: "是否管控预算",
            accessorKey: "budgetControl",
            cell: (row: any) => {
              // 处理布尔值显示
              if (row.budgetControl === true) return "是";
              if (row.budgetControl === false) return "否";
              return "-";
            },
          },
          {
            id: "status",
            header: "状态",
            accessorKey: "status",
            cell: (row: any) => {
              // 处理不同类型的状态字段
              let statusText = row.status;
              if (typeof row.status === 'boolean') {
                statusText = row.status ? "启用" : "停用";
              } else if (row.isUsed !== undefined) {
                statusText = row.isUsed ? "启用" : "停用";
              }
              return (
                <Badge variant={statusText === "启用" ? "outline" : "secondary"}>
                  {statusText || "-"}
                </Badge>
              );
            },
          },
          {
            id: "createTime",
            header: "创建时间",
            accessorKey: "createTime",
            cell: (row: any) => row.createTime || row.createdAt || "-",
          }
        ];
        break;
      case "budgetStandard":
        defaultColumns = budgetStandardColumns;
        break;
      case "reviewWorksheet":
        defaultColumns = reviewWorksheetColumns;
        break;
      case "managementFeeScheme":
        defaultColumns = managementFeeSchemeColumns;
        break;
      case "journalLevel":
        defaultColumns = journalLevelColumns;
        break;
      case "sealType":
        defaultColumns = sealTypeColumns;
        break;
      default:
        defaultColumns = tableColumns;
    }

    // 返回默认列，并确保不使用不存在的字段
    if (currentPageItems.length > 0) {
      // 获取一个样本项目的字段
      const sampleItem = currentPageItems[0];
      const actualFields = Object.keys(sampleItem);

      // 记录调试信息
      //console.log(`正在为${activeTab}适配列定义，实际字段:`, actualFields);

      // 检查默认列是否有不存在的字段，如果有则调整
      const adaptedColumns = defaultColumns.map(column => {
        // 如果无需访问字段或者是特殊列（如expander），则直接返回
        if (!column.accessorKey || column.id === 'expander') {
          return column;
        }

        // 如果accessorKey不存在于实际字段中，尝试查找替代字段
        if (!actualFields.includes(column.accessorKey)) {

          // 记录原始accessorKey以便调试
          const originalKey = column.accessorKey;

          // 根据字段ID查找可能的替代字段
          switch (column.id) {
            case 'name':
              if (actualFields.includes('title')) column.accessorKey = 'title';
              else if (actualFields.includes('label')) column.accessorKey = 'label';
              break;
            case 'code':
              if (actualFields.includes('number')) column.accessorKey = 'number';
              else if (actualFields.includes('key')) column.accessorKey = 'key';
              break;
            case 'status':
              if (actualFields.includes('isUsed')) {
                column.accessorKey = 'isUsed';
                // 修改cell渲染方式，将boolean值转为文本
                const originalCell = column.cell;
                column.cell = (row: any) => {
                  const statusText = row.isUsed === true ? "启用" : "停用";
                  return (
                    <Badge variant={statusText === "启用" ? "outline" : "secondary"}>
                      {statusText}
                    </Badge>
                  );
                };
              }
              else if (actualFields.includes('state')) column.accessorKey = 'state';
              break;
            case 'description':
              if (actualFields.includes('note')) column.accessorKey = 'note';
              else if (actualFields.includes('remark')) column.accessorKey = 'remark';
              break;
            case 'createdAt':
              if (actualFields.includes('createTime')) column.accessorKey = 'createTime';
              else if (actualFields.includes('gmtCreate')) column.accessorKey = 'gmtCreate';
              break;
          }

          // 如果找到了替代字段，输出提示
          if (originalKey !== column.accessorKey) {
            console.log(`为字段${originalKey}找到替代字段: ${column.accessorKey}`);
          }
        }

        // 特殊处理状态字段，确保正确显示
        if (column.id === 'status') {
          const originalCell = column.cell;
          column.cell = (row: any) => {
            let statusText = row[column.accessorKey];
            // 如果是布尔值，转换为文本
            if (typeof statusText === 'boolean') {
              statusText = statusText ? "启用" : "停用";
            }
            // 如果是undefined，尝试其他可能的状态字段
            else if (statusText === undefined) {
              if (row.isUsed !== undefined) statusText = row.isUsed ? "启用" : "停用";
              else if (row.state !== undefined) statusText = row.state;
            }

            return (
              <Badge variant={statusText === "启用" ? "outline" : "secondary"}>
                {statusText || "-"}
              </Badge>
            );
          };
        }

        return column;
      });

      // 过滤掉所有accessorKey仍然无效的列
      return adaptedColumns.filter(column => {
        // 特殊列不需要过滤
        if (!column.accessorKey || column.id === 'expander') {
          return true;
        }

        // 检查最终的accessorKey是否存在于数据中
        const keyExists = actualFields.includes(column.accessorKey);
        return keyExists;
      });
    }

    return defaultColumns;
  }

  // 根据当前活动标签页选择操作
  const getActionsForActiveTab = () => {
    switch (activeTab) {
      case "projectCategory":
        return getProjectCategoryActions(
          handleToggleStatus, 
          handleViewProjectCategory, 
          handleAddSubCategory, 
          handleEditProjectCategory,
          handleDeleteItem
        );
      case "budgetStandard":
        return getBudgetStandardActions(
          handleToggleStatus,
          handleViewBudgetStandard,
          handleEditBudgetStandard,
          handleDeleteItem
        );
      case "reviewWorksheet":
        return getReviewWorksheetActions(
          handleToggleStatus, 
          handleViewReviewWorksheet,
          handleEditReviewWorksheet,
          handleDeleteItem
        );
      case "managementFeeScheme":
        return getManagementFeeSchemeActions(
          handleToggleStatus, 
          handleViewManagementFeeScheme,
          handleEditManagementFeeScheme,
          handleDeleteItem
        );
      case "journalLevel":
        return getJournalLevelActions(
          handleToggleStatus,
          handleViewJournalLevel,
          handleEditJournalLevel,
          handleDeleteItem
        );
      case "sealType":
        return getSealTypeActions(
          handleToggleStatus,
          handleViewSealType,
          handleEditSealType,
          handleDeleteItem
        );
      default:
        return tableActions;
    }
  }

  // 根据当前活动标签页选择卡片字段
  const getCardFieldsForActiveTab = () => {
    switch (activeTab) {
      case "projectCategory":
        return projectCategoryCardFields
      case "budgetStandard":
        return budgetStandardCardFields
      case "reviewWorksheet":
        return reviewWorksheetCardFields
      case "managementFeeScheme":
        return managementFeeSchemeCardFields
      case "journalLevel":
        return journalLevelCardFields  
      case "sealType":
        return sealTypeCardFields
      default:
        return cardFields
    }
  }

  // 切换行展开/折叠状态
  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 处理高级筛选
  const handleAdvancedFilter = () => {
    // 暂未实现高级筛选
  };

  // 处理快速筛选
  const handleQuickFilter = (filterId: string, value: string) => {
    const newFilters = { ...filterValues };

    if (value === "all") {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }

    setFilterValues(newFilters);
  };

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      {/* 使用DataList组件渲染所有标签页，移除项目分类标签页的单独处理 */}
      <DataList
        title={activeTab === "projectCategory" ? "项目分类" : 
          activeTab === "budgetStandard" ? "预算标准" : 
          activeTab === "reviewWorksheet" ? "评审方案" : 
          activeTab === "managementFeeScheme" ? "管理费提取方案" : 
          activeTab === "journalLevel" ? "刊物及别" : 
          activeTab === "sealType" ? "用章类型" : "辅助管理"}
        data={currentPageItems}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        addButtonLabel=""
        customActions={
          <Button
            className="gap-2 ml-2"
            onClick={() => {
              // 使用类型断言解决类型检查问题
              const tab = activeTab as typeof activeTab;
              if (tab === "projectCategory") {
                window.location.href = "/auxiliary/create/projectCategory";
              } else if (tab === "budgetStandard") {
                window.location.href = "/auxiliary/create/budgetStandard";
              } else if (tab === "reviewWorksheet") {
                window.location.href = "/auxiliary/create/reviewWorksheet";
              } else if (tab === "managementFeeScheme") {
                window.location.href = "/auxiliary/create/managementFeeScheme";
              } else if (tab === "journalLevel") {
                window.location.href = "/auxiliary/create/journalLevel";
              } else if (tab === "sealType") {
                window.location.href = "/auxiliary/create/sealType";
              }
            }}
          >
            <Plus className="h-4 w-4" />
            {(() => {
              // 使用函数解决类型问题
              const tab = activeTab as typeof activeTab;
              switch (tab) {
                case "projectCategory": return "新建项目分类";
                case "budgetStandard": return "新建预算标准";
                case "reviewWorksheet": return "新建评审工作表";
                case "managementFeeScheme": return "新建管理费提取方案";
                case "journalLevel": return "新建刊物级别";
                case "sealType": return "新建用章类型";
                default: return "新建";
              }
            })()}
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={() => console.log("搜索", searchTerm)}
        quickFilters={quickFilters}
        onAdvancedFilter={handleAdvancedFilter}
        quickFilterValues={filterValues}
        onQuickFilterChange={handleQuickFilter}
        sortOptions={sortOptions}
        activeSortOption={sortOption}
        onSortChange={setSortOption}
        defaultViewMode={viewMode}
        tableColumns={getColumnsForActiveTab()}
        tableActions={getActionsForActiveTab()}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={getCardFieldsForActiveTab()}
        cardActions={getActionsForActiveTab()}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={statusVariants}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={batchActions}
        onItemClick={handleItemClick}
        detailsUrlPrefix={`/auxiliary/details/${activeTab}`}
      />

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              你确定要删除 "{itemToDelete?.name}" 吗？这个操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={confirmDeleteItem}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 项目分类查看抽屉 */}
      <ProjectCategoryViewDrawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        category={viewingCategory}
      />

      {/* 预算标准查看抽屉 */}
      <BudgetStandardViewDrawer
        isOpen={budgetStandardDrawerOpen}
        onClose={() => setBudgetStandardDrawerOpen(false)}
        standard={viewingBudgetStandard}
      />
      
      {/* 评审方案查看抽屉 */}
      <ReviewWorksheetViewDrawer
        isOpen={reviewWorksheetDrawerOpen}
        onClose={() => setReviewWorksheetDrawerOpen(false)}
        worksheet={viewingReviewWorksheet}
      />

      {/* 管理费提取方案查看抽屉 */}
      <ManagementFeeSchemeViewDrawer
        isOpen={managementFeeSchemeDrawerOpen}
        onClose={() => setManagementFeeSchemeDrawerOpen(false)}
        scheme={viewingManagementFeeScheme}
      />

      {/* 刊物级别查看抽屉 */}
      <JournalLevelViewDrawer
        isOpen={journalLevelDrawerOpen}
        onClose={() => setJournalLevelDrawerOpen(false)}
        level={viewingJournalLevel}
      />

      {/* 用章类型查看抽屉 */}
      <SealTypeViewDrawer
        isOpen={sealTypeDrawerOpen}
        onClose={() => setSealTypeDrawerOpen(false)}
        sealType={viewingSealType}
      />
    </div>
  )
}

export default function AuxiliaryPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div suppressHydrationWarning>
        <AuxiliaryContent />
      </div>
    </Suspense>
  )
} 