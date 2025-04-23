"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { 
  CalendarIcon, 
  FileText, 
  Search, 
  Check, 
  Building, 
  Landmark, 
  Info, 
  BookOpen, 
  LayoutGrid, 
  List, 
  Star,
  Filter,
  Calendar as CalendarIcon2,
  ArrowUpDown,
  Download,
  History,
  XCircle,
  SlidersHorizontal,
  FileDown
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// 定义来款信息类型
interface BankInfo {
  id: string;
  summary: string;
  bankName: string;
  bankAccount: string;
  amount: string;
  availableAmount: string;
  date: string;
  reference: string;
  containsManagerName?: boolean;
  containsProjectName?: boolean;
  matchesPartner?: boolean;
  isRecommended?: boolean;
  matchScore?: number;
  isClaimed?: boolean;
  claimedProject?: string;
  claimedDate?: string;
  claimedBy?: string;
}

// 定义筛选条件类型
interface FilterOptions {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  amountRange: {
    min: string;
    max: string;
  };
  sources: string[];
  showClaimed: boolean;
}

// 定义排序选项类型
type SortOption = {
  field: 'date' | 'amount' | 'bankName';
  direction: 'asc' | 'desc';
}

interface StepBankIncomeProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export function StepBankIncome({ formData, updateFormData }: StepBankIncomeProps) {
  // 模拟项目列表数据
  const projectsList = [
    {
      id: "1",
      name: "绿色智能装备论坛",
      manager: "叶文洁",
      type: "纵向",
      category: "国家863高技术项目",
      totalAmount: "1000.0万元 (其中计划外拨10.0万元，已外拨0.0万元)",
      income: "已入账2笔，合计561.0万元，未入账439.0万元",
      department: "天文系",
      partner: "科研经费署"
    },
    {
      id: "2",
      name: "新能源汽车动力电池回收利用技术研究",
      manager: "罗辑",
      type: "横向",
      category: "企业委托项目",
      totalAmount: "500.0万元",
      income: "已入账1笔，合计200.0万元，未入账300.0万元", 
      department: "工程物理系",
      partner: "新能源科技有限公司"
    },
    {
      id: "3",
      name: "高校创新创业教育体系构建研究",
      manager: "史强",
      type: "纵向",
      category: "教育部重点项目",
      totalAmount: "300.0万元",
      income: "已入账0笔，合计0.0万元，未入账300.0万元",
      department: "社会科学系",
      partner: "教育经费处"
    }
  ]

  // 项目搜索状态
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // 当前选中的银行来款ID
  const [selectedBankInfo, setSelectedBankInfo] = useState<string | null>(null)

  // 添加初始化逻辑，当组件加载或formData变化时进行初始化
  useEffect(() => {
    // 如果formData中有银行来款信息，根据这些信息初始化表单状态
    if (formData.incomeName && formData.incomeDate && formData.amount) {
      console.log("初始化银行来款信息:", formData);
      
      // 尝试在原始银行列表中找到匹配的记录
      const matchingBankInfo = bankInfoListOriginal.find(
        item => item.summary === formData.incomeName && 
               item.date === formData.incomeDate && 
               item.amount === formData.amount
      );
      
      if (matchingBankInfo) {
        // 如果找到匹配记录，则选中该记录
        console.log("找到匹配的银行来款记录:", matchingBankInfo.id);
        setSelectedBankInfo(matchingBankInfo.id);
      } else {
        // 如果没有匹配记录，也要确保表单数据显示正确
        console.log("未找到匹配的银行来款记录，使用已有formData数据");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // 选择项目时的处理函数
  const handleProjectSelect = (project: any) => {
    setSelectedProject(project)
    updateFormData("projectId", project.id)
    updateFormData("projectName", project.name)
    setOpen(false)
  }

  // 模拟已认领的来款记录
  const claimedBankInfoList: BankInfo[] = [
    {
      id: "c1",
      summary: "物理系实验室设备经费",
      bankName: "省科技厅",
      bankAccount: "11111111111",
      amount: "120000",
      availableAmount: "0",
      date: "2023-08-15",
      reference: "20230993300201111",
      isClaimed: true,
      claimedProject: "高校物理实验室设备升级计划",
      claimedDate: "2023-08-18",
      claimedBy: "李明",
      isRecommended: false,
      matchScore: 0
    },
    {
      id: "c2",
      summary: "人工智能实验室建设资金",
      bankName: "国家科研基金会",
      bankAccount: "22222222222",
      amount: "450000",
      availableAmount: "0",
      date: "2023-07-20",
      reference: "20230993300201222",
      isClaimed: true,
      claimedProject: "人工智能教育应用研究",
      claimedDate: "2023-07-25",
      claimedBy: "王丽",
      isRecommended: false,
      matchScore: 0
    }
  ]

  // 模拟来款信息数据
  const bankInfoListOriginal: BankInfo[] = [
    {
      id: "1",
      summary: "绿色智能装备论坛经费",
      bankName: "科研经费署",
      bankAccount: "99999999999",
      amount: "500000",
      availableAmount: "500000",
      date: "2023-09-21",
      reference: "20230993300201999"
    },
    {
      id: "2",
      summary: "教育经费-高校创新创业研究",
      bankName: "教育经费处",
      bankAccount: "88888888888",
      amount: "300000",
      availableAmount: "300000",
      date: "2023-09-18",
      reference: "20230993300201888"
    },
    {
      id: "3",
      summary: "叶文洁课题组研究经费",
      bankName: "研究基金会",
      bankAccount: "77777777777",
      amount: "200000",
      availableAmount: "200000",
      date: "2023-09-15",
      reference: "20230993300201777"
    },
    {
      id: "4",
      summary: "新能源设备研发项目款",
      bankName: "新能源科技有限公司",
      bankAccount: "66666666666",
      amount: "250000",
      availableAmount: "250000",
      date: "2023-09-10",
      reference: "20230993300201666"
    },
    {
      id: "5",
      summary: "装备制造技术经费",
      bankName: "国家科研基金会",
      bankAccount: "55555555555",
      amount: "150000",
      availableAmount: "150000",
      date: "2023-09-05",
      reference: "20230993300201555"
    },
    {
      id: "6",
      summary: "罗辑教授项目款",
      bankName: "新源科技研究院",
      bankAccount: "44444444444",
      amount: "180000",
      availableAmount: "180000",
      date: "2023-09-03",
      reference: "20230993300201444"
    },
    {
      id: "7",
      summary: "公益基金会-教育捐赠",
      bankName: "公益基金会",
      bankAccount: "33333333333",
      amount: "100000",
      availableAmount: "100000",
      date: "2023-08-28",
      reference: "20230993300201333"
    },
    {
      id: "8",
      summary: "科研经费",
      bankName: "财政厅",
      bankAccount: "22222222222",
      amount: "350000",
      availableAmount: "350000",
      date: "2023-08-25",
      reference: "20230993300201222"
    }
  ]

  // 视图类型：卡片或列表
  const [viewType, setViewType] = useState<"card" | "list">("card")

  // 是否只显示推荐项目
  const [showRecommendOnly, setShowRecommendOnly] = useState(false)

  // 处理后的来款信息列表
  const [bankInfoList, setBankInfoList] = useState<BankInfo[]>(bankInfoListOriginal)

  // 当前列表视图标签页（未认领/历史）
  const [currentListTab, setCurrentListTab] = useState<"unclaimed" | "history">("unclaimed")

  // 筛选选项
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: { from: undefined, to: undefined },
    amountRange: { min: "", max: "" },
    sources: [],
    showClaimed: false
  })

  // 是否显示筛选面板
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  // 排序选项
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'date',
    direction: 'desc'
  })

  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState("")

  // 添加状态变量控制展示数量
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [showAllOthers, setShowAllOthers] = useState(false);

  // 选择来款信息
  const handleSelectBankInfo = (bankInfoId: string) => {
    setSelectedBankInfo(bankInfoId)
    const selected = bankInfoList.find(item => item.id === bankInfoId)
    if (selected) {
      updateFormData("incomeName", selected.summary)
      updateFormData("incomeDate", selected.date)
      updateFormData("amount", selected.amount)
      updateFormData("bankAccount", selected.bankAccount)
      updateFormData("reference", selected.reference)
    }
  }

  // 计算推荐分数
  const calculateMatchScore = (bankInfo: BankInfo, project: any): number => {
    if (!project) return 0;
    
    let score = 0;
    
    // 完全匹配项目名称 (最高优先级)
    if (bankInfo.summary.includes(project.name)) {
      score += 100;
    }
    // 包含项目名称前几个字符
    else if (project.name && bankInfo.summary.includes(project.name.substring(0, 5))) {
      score += 70;
    }
    
    // 包含负责人姓名
    if (project.manager && bankInfo.summary.includes(project.manager)) {
      score += 80;
    }
    
    // 来款单位与项目合作方匹配
    if (project.partner && bankInfo.bankName.includes(project.partner)) {
      score += 90;
    }
    
    // 日期近期性 (最近30天内的加分)
    const currentDate = new Date();
    const bankDate = new Date(bankInfo.date);
    const daysDiff = Math.floor((currentDate.getTime() - bankDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 30) {
      score += Math.max(0, 30 - daysDiff) / 2; // 最高加15分
    }
    
    return score;
  };

  // 当项目选择变化时，更新推荐
  useEffect(() => {
    if (selectedProject) {
      // 处理每个来款信息，判断是否推荐
      const processedList = bankInfoListOriginal.map(info => {
        // 计算匹配因素
        const containsManagerName = selectedProject.manager && 
          info.summary.includes(selectedProject.manager);
        
        const containsProjectName = selectedProject.name && 
          (info.summary.includes(selectedProject.name) || 
           info.summary.includes(selectedProject.name.substring(0, 5))); // 使用项目名称完整匹配或前5个字符匹配
        
        const matchesPartner = selectedProject.partner && 
          info.bankName.includes(selectedProject.partner);
        
        // 计算匹配分数
        const matchScore = calculateMatchScore(info, selectedProject);
        
        // 根据分数确定是否推荐 (设置一个阈值，例如30分)
        const isRecommended = matchScore > 30;
        
        // 返回带有匹配信息的对象
        return {
          ...info,
          containsManagerName,
          containsProjectName,
          matchesPartner,
          isRecommended,
          matchScore
        };
      });
      
      // 根据匹配分数排序（推荐的排在前面）
      processedList.sort((a, b) => {
        // 如果两者都推荐或都不推荐，按分数排序
        if ((a.isRecommended && b.isRecommended) || (!a.isRecommended && !b.isRecommended)) {
          return (b.matchScore || 0) - (a.matchScore || 0);
        }
        // 推荐的排在前面
        return a.isRecommended ? -1 : 1;
      });
      
      setBankInfoList(processedList);
    } else {
      setBankInfoList(bankInfoListOriginal);
    }
  }, [selectedProject]);

  // 应用筛选和排序
  const applyFiltersAndSort = (list: BankInfo[]): BankInfo[] => {
    // 先应用筛选
    let result = [...list];
    
    // 关键词搜索筛选
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter(item => 
        item.summary.toLowerCase().includes(keyword) || 
        item.bankName.toLowerCase().includes(keyword) || 
        item.reference.toLowerCase().includes(keyword)
      );
    }
    
    // 日期范围筛选
    if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        const fromCondition = filterOptions.dateRange.from 
          ? itemDate >= filterOptions.dateRange.from 
          : true;
        const toCondition = filterOptions.dateRange.to 
          ? itemDate <= filterOptions.dateRange.to 
          : true;
        return fromCondition && toCondition;
      });
    }
    
    // 金额范围筛选
    if (filterOptions.amountRange.min || filterOptions.amountRange.max) {
      result = result.filter(item => {
        const amount = parseFloat(item.amount);
        const minCondition = filterOptions.amountRange.min 
          ? amount >= parseFloat(filterOptions.amountRange.min) 
          : true;
        const maxCondition = filterOptions.amountRange.max 
          ? amount <= parseFloat(filterOptions.amountRange.max) 
          : true;
        return minCondition && maxCondition;
      });
    }
    
    // 来源筛选
    if (filterOptions.sources.length > 0) {
      result = result.filter(item => filterOptions.sources.includes(item.bankName));
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortOption.field === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOption.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } 
      else if (sortOption.field === 'amount') {
        const amountA = parseFloat(a.amount);
        const amountB = parseFloat(b.amount);
        return sortOption.direction === 'asc' ? amountA - amountB : amountB - amountA;
      }
      else if (sortOption.field === 'bankName') {
        return sortOption.direction === 'asc' 
          ? a.bankName.localeCompare(b.bankName) 
          : b.bankName.localeCompare(a.bankName);
      }
      return 0;
    });
    
    return result;
  };

  // 获取所有的来款单位列表（用于筛选）
  const getBankSources = (): string[] => {
    const sources = new Set<string>();
    bankInfoListOriginal.forEach(item => sources.add(item.bankName));
    return Array.from(sources);
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilterOptions({
      dateRange: { from: undefined, to: undefined },
      amountRange: { min: "", max: "" },
      sources: [],
      showClaimed: false
    });
    setSearchKeyword("");
  };

  // 导出为Excel
  const exportToExcel = () => {
    // 实际项目中，这里会调用后端API或使用前端库导出Excel
    // 在这个演示中，我们只显示一个消息
    alert("已将筛选后的" + (currentListTab === "unclaimed" ? "未认领" : "历史") + "来款记录导出为Excel文件");
  };

  // 导出为PDF
  const exportToPDF = () => {
    // 实际项目中，这里会调用后端API或使用前端库导出PDF
    // 在这个演示中，我们只显示一个消息
    alert("已将筛选后的" + (currentListTab === "unclaimed" ? "未认领" : "历史") + "来款记录导出为PDF文件");
  };

  // 切换标签页
  const handleTabChange = (value: string) => {
    setCurrentListTab(value as "unclaimed" | "history");
    setSelectedBankInfo(null);
  };

  // 获取当前显示的列表（未认领或历史）
  const getCurrentList = () => {
    return currentListTab === "unclaimed" ? bankInfoList : claimedBankInfoList;
  };

  // 过滤后的列表
  const filteredBankInfoList = (() => {
    let list = getCurrentList();
    
    // 只显示推荐项
    if (currentListTab === "unclaimed" && showRecommendOnly) {
      list = list.filter(info => info.isRecommended === true);
    }
    
    // 应用高级筛选和排序
    return applyFiltersAndSort(list);
  })();

  // 检查是否为推荐项
  const isRecommended = (bankInfo: BankInfo) => {
    return bankInfo.isRecommended === true;
  };

  // 获取推荐理由
  const getRecommendReason = (bankInfo: BankInfo) => {
    if (!selectedProject) return null;
    
    const reasons = [];
    if (bankInfo.containsManagerName) {
      reasons.push(`摘要中包含负责人"${selectedProject.manager}"`);
    }
    if (bankInfo.containsProjectName) {
      if (bankInfo.summary.includes(selectedProject.name)) {
        reasons.push(`摘要中包含完整项目名称"${selectedProject.name}"`);
      } else {
        reasons.push(`摘要中包含项目关键字"${selectedProject.name.substring(0, 5)}"`);
      }
    }
    if (bankInfo.matchesPartner) {
      reasons.push(`来款单位与项目合作方"${selectedProject.partner}"匹配`);
    }
    
    return reasons.length > 0 ? reasons.join('、') : null;
  };

  // 获取推荐匹配度
  const getMatchPercentage = (bankInfo: BankInfo) => {
    const score = bankInfo.matchScore || 0;
    // 最高分为100+90+80+15=285，转换为百分比
    return Math.min(100, Math.round(score / 2.85));
  };

  // 根据匹配度获取颜色
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-amber-500";
    return "text-blue-500";
  };

  // 方法：判断卡片是否被选中
  const isBankInfoSelected = (bankInfoId: string): boolean => {
    return selectedBankInfo === bankInfoId;
  }

  // 方法：获取选中的样式类
  const getSelectedCardClass = (bankInfoId: string): string => {
    return isBankInfoSelected(bankInfoId) 
      ? "border-primary shadow-sm" // 修改为单个边框，移除重复样式
      : "border-border hover:border-primary/50";
  }
  
  // 方法：获取选中的行样式类
  const getSelectedRowClass = (bankInfoId: string): string => {
    return isBankInfoSelected(bankInfoId) 
      ? "bg-blue-50" 
      : "";
  }
  
  // 方法：获取选中的图标样式类
  const getSelectedIconClass = (bankInfoId: string): string => {
    return isBankInfoSelected(bankInfoId) 
      ? "text-primary" 
      : "text-muted-foreground";
  }
  
  // 方法：获取选中的徽章变体
  const getSelectedBadgeVariant = (bankInfoId: string): "default" | "outline" | "secondary" | "destructive" => {
    return isBankInfoSelected(bankInfoId) 
      ? "default" 
      : "outline";
  }

  return (
    <div className="space-y-6">
      {/* 项目信息部分 */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">项目信息</h3>
        </div>

        <div className="px-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectSearch">
              项目名称 <span className="text-destructive">*</span>
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                  {selectedProject ? (
                    <span>{selectedProject.name}</span>
                  ) : (
                    <span className="text-muted-foreground">请搜索并选择项目</span>
                  )}
                  <Search className="ml-auto h-4 w-4 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="搜索项目..." />
                  <CommandList>
                    <CommandEmpty>未找到相关项目</CommandEmpty>
                    <CommandGroup>
                      {projectsList.map((project) => (
                        <CommandItem
                          key={project.id}
                          onSelect={() => handleProjectSelect(project)}
                        >
                          <div className="flex-1 text-sm">
                            {project.name}
                            <p className="text-xs text-muted-foreground">
                              负责人: {project.manager} | 所属: {project.department}
                            </p>
                          </div>
                          {selectedProject?.id === project.id && (
                            <Check className="h-4 w-4 text-primary ml-2" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedProject && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">负责人：</span>
                <span className="text-sm font-medium">{selectedProject.manager}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">所属单位：</span>
                <span className="text-sm font-medium">{selectedProject.department}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">项目性质：</span>
                <span className="text-sm font-medium">{selectedProject.type}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">项目分类：</span>
                <span className="text-sm font-medium">{selectedProject.category}</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">合同金额：</span>
                <span className="text-sm font-medium">{selectedProject.totalAmount}</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">入账信息：</span>
                <span className="text-sm font-medium">{selectedProject.income}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 银行来款信息部分 */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <Landmark className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">银行来款信息</h3>
        </div>

        <div className="px-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tabs value={currentListTab} onValueChange={handleTabChange} className="w-64">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="unclaimed">未认领来款</TabsTrigger>
                  <TabsTrigger value="history">历史记录</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative ml-2">
                <Input
                  placeholder="搜索来款信息..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="h-9 w-64 pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                {searchKeyword && (
                  <button 
                    className="absolute right-2 top-2.5"
                    onClick={() => setSearchKeyword("")}
                  >
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as "card" | "list")}>
                <ToggleGroupItem value="card" aria-label="卡片视图">
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  卡片
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="列表视图">
                  <List className="h-4 w-4 mr-1" />
                  列表
                </ToggleGroupItem>
              </ToggleGroup>

              {/* 高级筛选按钮 */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <SlidersHorizontal className="h-4 w-4" />
                    高级筛选
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>高级筛选</DialogTitle>
                    <DialogDescription>
                      根据各种条件筛选银行来款信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {/* 日期范围筛选 */}
                    <div className="space-y-2">
                      <Label>日期范围</Label>
                      <div className="flex gap-4">
                        <div className="grid gap-2 w-full">
                          <Label htmlFor="dateFrom" className="text-xs">从</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left text-sm h-9 font-normal"
                              >
                                {filterOptions.dateRange.from ? (
                                  format(filterOptions.dateRange.from, "yyyy-MM-dd")
                                ) : (
                                  <span className="text-muted-foreground">选择日期</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={filterOptions.dateRange.from}
                                onSelect={(date) => setFilterOptions({
                                  ...filterOptions,
                                  dateRange: { ...filterOptions.dateRange, from: date || undefined }
                                })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2 w-full">
                          <Label htmlFor="dateTo" className="text-xs">至</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left text-sm h-9 font-normal"
                              >
                                {filterOptions.dateRange.to ? (
                                  format(filterOptions.dateRange.to, "yyyy-MM-dd")
                                ) : (
                                  <span className="text-muted-foreground">选择日期</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={filterOptions.dateRange.to}
                                onSelect={(date) => setFilterOptions({
                                  ...filterOptions,
                                  dateRange: { ...filterOptions.dateRange, to: date || undefined }
                                })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    {/* 金额范围筛选 */}
                    <div className="space-y-2">
                      <Label>金额范围</Label>
                      <div className="flex gap-4">
                        <div className="grid gap-2 w-full">
                          <Label htmlFor="amountMin" className="text-xs">最小金额</Label>
                          <Input
                            id="amountMin"
                            placeholder="¥ 最小金额"
                            value={filterOptions.amountRange.min}
                            onChange={(e) => setFilterOptions({
                              ...filterOptions,
                              amountRange: { ...filterOptions.amountRange, min: e.target.value }
                            })}
                            className="h-9"
                          />
                        </div>
                        <div className="grid gap-2 w-full">
                          <Label htmlFor="amountMax" className="text-xs">最大金额</Label>
                          <Input
                            id="amountMax"
                            placeholder="¥ 最大金额"
                            value={filterOptions.amountRange.max}
                            onChange={(e) => setFilterOptions({
                              ...filterOptions,
                              amountRange: { ...filterOptions.amountRange, max: e.target.value }
                            })}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 来款单位筛选 */}
                    <div className="space-y-2">
                      <Label>来款单位</Label>
                      <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                        {getBankSources().map((source) => (
                          <div key={source} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`source-${source}`}
                              checked={filterOptions.sources.includes(source)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterOptions({
                                    ...filterOptions,
                                    sources: [...filterOptions.sources, source]
                                  });
                                } else {
                                  setFilterOptions({
                                    ...filterOptions,
                                    sources: filterOptions.sources.filter(s => s !== source)
                                  });
                                }
                              }}
                            />
                            <label htmlFor={`source-${source}`} className="text-sm cursor-pointer">
                              {source}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={resetFilters}>重置筛选</Button>
                    <DialogClose asChild>
                      <Button type="submit">应用筛选</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* 排序按钮 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ArrowUpDown className="h-4 w-4" />
                    排序
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setSortOption({ field: 'date', direction: 'desc' })}
                    className={cn("gap-2", sortOption.field === 'date' && sortOption.direction === 'desc' && "font-semibold")}
                  >
                    <CalendarIcon2 className="h-4 w-4" />
                    <span>日期（新到旧）</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption({ field: 'date', direction: 'asc' })}
                    className={cn("gap-2", sortOption.field === 'date' && sortOption.direction === 'asc' && "font-semibold")}
                  >
                    <CalendarIcon2 className="h-4 w-4" />
                    <span>日期（旧到新）</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption({ field: 'amount', direction: 'desc' })}
                    className={cn("gap-2", sortOption.field === 'amount' && sortOption.direction === 'desc' && "font-semibold")}
                  >
                    <span>金额（从高到低）</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption({ field: 'amount', direction: 'asc' })}
                    className={cn("gap-2", sortOption.field === 'amount' && sortOption.direction === 'asc' && "font-semibold")}
                  >
                    <span>金额（从低到高）</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption({ field: 'bankName', direction: 'asc' })}
                    className={cn("gap-2", sortOption.field === 'bankName' && sortOption.direction === 'asc' && "font-semibold")}
                  >
                    <Building className="h-4 w-4" />
                    <span>单位（A-Z）</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption({ field: 'bankName', direction: 'desc' })}
                    className={cn("gap-2", sortOption.field === 'bankName' && sortOption.direction === 'desc' && "font-semibold")}
                  >
                    <Building className="h-4 w-4" />
                    <span>单位（Z-A）</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 导出按钮 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileDown className="h-4 w-4" />
                    导出
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={exportToExcel} className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF} className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {currentListTab === "unclaimed" && (
                <Button 
                  variant={showRecommendOnly ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setShowRecommendOnly(!showRecommendOnly)}
                  className="gap-1"
                >
                  <Star className={cn("h-4 w-4", showRecommendOnly ? "text-white" : "text-amber-500")} />
                  {showRecommendOnly ? "显示全部" : "仅显示推荐"}
                </Button>
              )}
            </div>
          </div>

          {/* 筛选条件显示 */}
          {(filterOptions.dateRange.from || 
            filterOptions.dateRange.to || 
            filterOptions.amountRange.min || 
            filterOptions.amountRange.max || 
            filterOptions.sources.length > 0) && (
            <div className="flex flex-wrap gap-2 bg-muted/30 p-2 rounded-md">
              <div className="text-sm text-muted-foreground mr-1">当前筛选:</div>
              
              {filterOptions.dateRange.from && (
                <Badge variant="outline" className="gap-1">
                  <span>从: {format(filterOptions.dateRange.from, "yyyy-MM-dd")}</span>
                  <button onClick={() => setFilterOptions({
                    ...filterOptions,
                    dateRange: { ...filterOptions.dateRange, from: undefined }
                  })}>
                    <XCircle className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {filterOptions.dateRange.to && (
                <Badge variant="outline" className="gap-1">
                  <span>至: {format(filterOptions.dateRange.to, "yyyy-MM-dd")}</span>
                  <button onClick={() => setFilterOptions({
                    ...filterOptions,
                    dateRange: { ...filterOptions.dateRange, to: undefined }
                  })}>
                    <XCircle className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {filterOptions.amountRange.min && (
                <Badge variant="outline" className="gap-1">
                  <span>最小金额: ¥{parseInt(filterOptions.amountRange.min).toLocaleString()}</span>
                  <button onClick={() => setFilterOptions({
                    ...filterOptions,
                    amountRange: { ...filterOptions.amountRange, min: "" }
                  })}>
                    <XCircle className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {filterOptions.amountRange.max && (
                <Badge variant="outline" className="gap-1">
                  <span>最大金额: ¥{parseInt(filterOptions.amountRange.max).toLocaleString()}</span>
                  <button onClick={() => setFilterOptions({
                    ...filterOptions,
                    amountRange: { ...filterOptions.amountRange, max: "" }
                  })}>
                    <XCircle className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {filterOptions.sources.map(source => (
                <Badge key={source} variant="outline" className="gap-1">
                  <span>{source}</span>
                  <button onClick={() => setFilterOptions({
                    ...filterOptions,
                    sources: filterOptions.sources.filter(s => s !== source)
                  })}>
                    <XCircle className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))}
              
              <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto text-xs h-6">
                清除全部
              </Button>
            </div>
          )}

          {/* 排序和记录数量显示 */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              当前排序: {
                sortOption.field === 'date' 
                  ? `日期 (${sortOption.direction === 'asc' ? '旧到新' : '新到旧'})` 
                  : sortOption.field === 'amount'
                    ? `金额 (${sortOption.direction === 'asc' ? '从低到高' : '从高到低'})`
                    : `单位 (${sortOption.direction === 'asc' ? 'A-Z' : 'Z-A'})`
              }
            </div>
            <div>
              共{filteredBankInfoList.length}条记录
            </div>
          </div>

          {/* 卡片视图 */}
          {viewType === "card" && (
            <div>
              {filteredBankInfoList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  没有找到匹配的{currentListTab === "unclaimed" ? "未认领" : "历史"}来款信息
                </div>
              ) : (
                <>
                  {/* 推荐项目横向展示 - 限制显示数量 */}
                  {currentListTab === "unclaimed" && filteredBankInfoList.some(info => isRecommended(info)) && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-amber-600">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">推荐来款</span>
                        </div>
                        
                        {filteredBankInfoList.filter(info => isRecommended(info)).length > 2 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllRecommended(!showAllRecommended)}
                            className="text-xs"
                          >
                            {showAllRecommended ? "收起" : "查看更多"}
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredBankInfoList.filter(info => isRecommended(info))
                          .slice(0, showAllRecommended ? undefined : 2) // 限制显示前2个
                          .map((bankInfo) => (
                            <div 
                              key={bankInfo.id}
                              onClick={() => handleSelectBankInfo(bankInfo.id)}
                              className="cursor-pointer transition-colors"
                            >
                              <Card className={`border h-full ${getSelectedCardClass(bankInfo.id)} ${isBankInfoSelected(bankInfo.id) ? 'bg-blue-50/50' : ''}`}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <FileText className={`h-5 w-5 ${getSelectedIconClass(bankInfo.id)}`} />
                                      <span className="font-medium truncate max-w-[180px]" title={bankInfo.summary}>{bankInfo.summary}</span>
                                      {bankInfo.matchScore && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Badge variant={getSelectedBadgeVariant(bankInfo.id)} className={`ml-1 ${getMatchColor(getMatchPercentage(bankInfo))}`}>
                                                {getMatchPercentage(bankInfo)}%
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs">匹配度: {getMatchPercentage(bankInfo)}%</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                    <Star className="h-4 w-4 text-amber-500 shrink-0" />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">来款单位:</span>
                                      </div>
                                      <span className="font-medium truncate max-w-[180px]" title={bankInfo.bankName}>{bankInfo.bankName}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">金额:</span>
                                      </div>
                                      <Badge variant={getSelectedBadgeVariant(bankInfo.id)} className="font-medium">
                                        ¥{parseInt(bankInfo.amount).toLocaleString()}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">日期:</span>
                                      </div>
                                      <span className="font-medium">{bankInfo.date}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">对冲号:</span>
                                      </div>
                                      <span className="font-medium text-xs text-muted-foreground">{bankInfo.reference}</span>
                                    </div>
                                  </div>
                                  
                                  {getRecommendReason(bankInfo) && (
                                    <div className="mt-3 text-xs bg-amber-50 p-2 rounded border border-amber-200 text-amber-800">
                                      <div className="flex items-start gap-1">
                                        <Info className="h-3 w-3 mt-0.5 text-amber-500" />
                                        <span><span className="font-medium">推荐理由:</span> {getRecommendReason(bankInfo)}</span>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 其他项目网格展示 - 限制显示数量 */}
                  <div className={`${currentListTab === "unclaimed" && filteredBankInfoList.some(info => isRecommended(info)) ? "mt-6" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-blue-600">
                        <FileText className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{currentListTab === "unclaimed" ? "其他来款" : "历史来款"}</span>
                      </div>
                      
                      {currentListTab === "unclaimed" && filteredBankInfoList.filter(info => !isRecommended(info)).length > 2 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowAllOthers(!showAllOthers)}
                          className="text-xs"
                        >
                          {showAllOthers ? "收起" : "查看更多"}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentListTab === "unclaimed" 
                        ? filteredBankInfoList.filter(info => !isRecommended(info))
                          .slice(0, showAllOthers ? undefined : 2) // 限制显示前2个
                          .map((bankInfo) => (
                            <div 
                              key={bankInfo.id}
                              onClick={() => handleSelectBankInfo(bankInfo.id)}
                              className="cursor-pointer transition-colors"
                            >
                              <Card className={`border h-full ${getSelectedCardClass(bankInfo.id)} ${isBankInfoSelected(bankInfo.id) ? 'bg-blue-50/50' : ''}`}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <FileText className={`h-5 w-5 ${getSelectedIconClass(bankInfo.id)}`} />
                                      <span className="font-medium truncate max-w-[180px]" title={bankInfo.summary}>{bankInfo.summary}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">来款单位:</span>
                                      </div>
                                      <span className="font-medium truncate max-w-[180px]" title={bankInfo.bankName}>{bankInfo.bankName}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">金额:</span>
                                      </div>
                                      <Badge variant={getSelectedBadgeVariant(bankInfo.id)} className="font-medium">
                                        ¥{parseInt(bankInfo.amount).toLocaleString()}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">日期:</span>
                                      </div>
                                      <span className="font-medium">{bankInfo.date}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">对冲号:</span>
                                      </div>
                                      <span className="font-medium text-xs text-muted-foreground">{bankInfo.reference}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))
                        : filteredBankInfoList
                          .slice(0, showAllOthers ? undefined : 2) // 限制显示前2个
                          .map((bankInfo) => (
                            <div 
                              key={bankInfo.id}
                              className="cursor-pointer"
                            >
                              <Card className="border h-full border-blue-200 bg-blue-50/30">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <History className="h-5 w-5 text-blue-600" />
                                      <span className="font-medium truncate max-w-[180px]" title={bankInfo.summary}>{bankInfo.summary}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">来款单位:</span>
                                      </div>
                                      <span className="font-medium truncate max-w-[180px]" title={bankInfo.bankName}>{bankInfo.bankName}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">金额:</span>
                                      </div>
                                      <Badge variant="outline" className="font-medium">
                                        ¥{parseInt(bankInfo.amount).toLocaleString()}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">日期:</span>
                                      </div>
                                      <span className="font-medium">{bankInfo.date}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">对冲号:</span>
                                      </div>
                                      <span className="font-medium text-xs text-muted-foreground">{bankInfo.reference}</span>
                                    </div>

                                    <div className="border-t my-1"></div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                                        <span className="text-muted-foreground">认领项目:</span>
                                      </div>
                                      <span className="font-medium text-blue-600">{bankInfo.claimedProject}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">认领日期:</span>
                                      </div>
                                      <span className="font-medium">{bankInfo.claimedDate}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">认领人:</span>
                                      </div>
                                      <span className="font-medium">{bankInfo.claimedBy}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))
                      }
                    </div>
                    
                    {/* 历史记录也添加查看更多按钮 */}
                    {currentListTab === "history" && filteredBankInfoList.length > 2 && !showAllOthers && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowAllOthers(true)}
                        >
                          查看更多历史记录
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* 列表视图 */}
          {viewType === "list" && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>来款摘要</TableHead>
                    <TableHead>来款单位</TableHead>
                    <TableHead className="text-right">来款金额</TableHead>
                    <TableHead>来款日期</TableHead>
                    <TableHead>对冲号</TableHead>
                    {currentListTab === "unclaimed" && selectedProject && <TableHead className="w-[80px] text-center">匹配度</TableHead>}
                    {currentListTab === "history" && (
                      <>
                        <TableHead>认领项目</TableHead>
                        <TableHead>认领日期</TableHead>
                        <TableHead>认领人</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBankInfoList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={currentListTab === "unclaimed" ? (selectedProject ? 7 : 6) : 9} className="text-center py-4 text-muted-foreground">
                        没有找到匹配的{currentListTab === "unclaimed" ? "未认领" : "历史"}来款信息
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBankInfoList.map((bankInfo) => (
                      <TableRow 
                        key={bankInfo.id}
                        onClick={() => currentListTab === "unclaimed" ? handleSelectBankInfo(bankInfo.id) : null}
                        className={`${currentListTab === "unclaimed" ? "cursor-pointer" : ""} ${getSelectedRowClass(bankInfo.id)}`}
                      >
                        <TableCell>
                          {currentListTab === "unclaimed" && selectedBankInfo === bankInfo.id && <Check className="h-4 w-4 text-primary" />}
                          {currentListTab === "unclaimed" && isRecommended(bankInfo) && selectedBankInfo !== bankInfo.id && <Star className="h-4 w-4 text-amber-500" />}
                          {currentListTab === "history" && <History className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {bankInfo.summary}
                            {currentListTab === "unclaimed" && isRecommended(bankInfo) && getRecommendReason(bankInfo) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-amber-500 ml-1" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">推荐理由: {getRecommendReason(bankInfo)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{bankInfo.bankName}</TableCell>
                        <TableCell className="text-right font-medium">¥{parseInt(bankInfo.amount).toLocaleString()}</TableCell>
                        <TableCell>{bankInfo.date}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{bankInfo.reference}</TableCell>
                        {currentListTab === "unclaimed" && selectedProject && (
                          <TableCell className="text-center">
                            {bankInfo.matchScore && bankInfo.matchScore > 0 ? (
                              <Badge variant={getSelectedBadgeVariant(bankInfo.id)} className={getMatchColor(getMatchPercentage(bankInfo))}>
                                {getMatchPercentage(bankInfo)}%
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )}
                        {currentListTab === "history" && (
                          <>
                            <TableCell>
                              <span className="font-medium text-sm text-blue-600">
                                {bankInfo.claimedProject}
                              </span>
                            </TableCell>
                            <TableCell>{bankInfo.claimedDate}</TableCell>
                            <TableCell>{bankInfo.claimedBy}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 