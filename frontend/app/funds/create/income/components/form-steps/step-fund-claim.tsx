"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  DollarSign, 
  PieChart, 
  BarChart4,
  Calculator,
  Info,
  FileText,
  Building,
  Calendar,
  Trash2,
  Copy,
  AlertCircle,
  Check,
  ChevronsUpDown,
  User,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  CircleDollarSign,
  RefreshCw,
  Upload,
  Download,
  CircleOff,
  ArrowUpCircle,
  Settings
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 定义管理费类型
type FeeItem = {
  total: string;
  current: string;
};

type ManagementFeeData = {
  performanceFee: FeeItem;
  bonusFee: FeeItem;
  institutionFee: FeeItem;
};

interface StepFundClaimProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export function StepFundClaim({ formData, updateFormData }: StepFundClaimProps) {
  // 模拟项目数据
  const projects = [
    { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    { id: "4", name: "高校创新创业教育体系构建研究" },
    { id: "5", name: "智慧校园综合管理平台开发" },
  ]

  // 项目团队成员列表
  const teamMembers = [
    { id: "001", name: "罗辑", title: "主研", dept: "天文系" },
    { id: "002", name: "汪淼", title: "项目主任", dept: "物理系" },
    { id: "003", name: "叶文洁", title: "首席科学家", dept: "射电天文学实验室" },
    { id: "004", name: "史强", title: "科研助理", dept: "社会科学系" },
    { id: "005", name: "丁仪", title: "理论物理学家", dept: "物理系" },
    { id: "006", name: "章北海", title: "技术专家", dept: "工程物理系" },
    { id: "007", name: "艾AA", title: "研究员", dept: "计算机科学系" },
    { id: "008", name: "魏成", title: "实验员", dept: "化学系" },
    { id: "009", name: "林云", title: "项目协调员", dept: "生物系" }
  ]

  // 经费入账类别
  const categories = ["纵向项目经费", "横向项目经费", "学校配套经费", "活动经费"]

  // 经费来源
  const sources = ["国家自然科学基金委员会", "省科技厅", "教育部", "某企业", "学校科研基金"]

  // 管理费分配方式
  const managementFeeOptions = ["862纵向项目经费分配", "863横向项目经费分配", "学校项目经费分配"]

  // 单位列表
  const departmentOptions = ["天文系", "工程物理系", "社会科学系", "计算机科学系", "化学系", "生物系"]

  // 额度拆分信息
  const [budgetAllocations, setBudgetAllocations] = useState([
    {
      id: "1",
      cardHolderId: "001",
      cardHolder: "罗辑 (001)",
      department: "天文系",
      budgetNumber: "Z2022009",
      schoolFunding: "0.0",
      externalFunding: "0.0",
      receivedAmount: "7.0",
      originalBudget: "80.0"
    }
  ])

  // 管理费科目
  const managementFeeItems = [
    { id: 1, name: "绩效", total: "1.4", current: "0" },
    { id: 2, name: "奖金", total: "1.4", current: "0" },
    { id: 3, name: "院管理费", total: "1.4", current: "0" }
  ]

  // 获取第一步选择的银行来款信息
  const selectedBankInfo = {
    summary: formData.incomeName || "绿色智能装备论坛经费",
    bankName: formData.bankName || "科研经费署",
    amount: formData.amount || "500000",
    date: formData.incomeDate || "2023-09-21",
    reference: formData.reference || "20230993300201999"
  }

  // 管理费信息，为每个经费卡负责人初始化管理费数据
  const [managementFees, setManagementFees] = useState<Record<string, ManagementFeeData>>({
    "001": {
      performanceFee: { total: "1.4", current: "0" },
      bonusFee: { total: "1.4", current: "0" },
      institutionFee: { total: "1.4", current: "0" }
    },
    "002": {
      performanceFee: { total: "3.6", current: "0" },
      bonusFee: { total: "3.6", current: "0" },
      institutionFee: { total: "2.4", current: "0" }
    }
  });

  // 存储哪些卡片是展开的
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // 添加加载状态
  const [isCalculating, setIsCalculating] = useState(false);

  // 切换卡片展开/折叠状态
  const toggleCardExpand = (cardHolderId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardHolderId]: !prev[cardHolderId]
    }));
  };

  // 检查卡片是否展开
  const isCardExpanded = (cardHolderId: string) => {
    return expandedCards[cardHolderId] !== false; // 默认展开
  };

  // 计算总金额
  const calculateTotals = () => {
    let schoolFundingTotal = 0;
    let externalFundingTotal = 0;
    let receivedAmountTotal = 0;
    let originalBudgetTotal = 0;

    budgetAllocations.forEach(item => {
      schoolFundingTotal += parseFloat(item.schoolFunding) || 0;
      externalFundingTotal += parseFloat(item.externalFunding) || 0;
      receivedAmountTotal += parseFloat(item.receivedAmount) || 0;
      originalBudgetTotal += parseFloat(item.originalBudget) || 0;
    });

    return {
      schoolFundingTotal: schoolFundingTotal.toFixed(1),
      externalFundingTotal: externalFundingTotal.toFixed(1),
      receivedAmountTotal: receivedAmountTotal.toFixed(1),
      originalBudgetTotal: originalBudgetTotal.toFixed(1)
    };
  }

  const totals = calculateTotals();

  // 添加经费负责人
  const addBudgetHolder = () => {
    const newId = Date.now().toString();
    setBudgetAllocations([
      ...budgetAllocations,
      {
        id: newId,
        cardHolderId: "",
        cardHolder: "",
        department: "天文系",
        budgetNumber: "",
        schoolFunding: "0.0",
        externalFunding: "0.0",
        receivedAmount: "0.0",
        originalBudget: "0.0"
      }
    ]);
  };

  // 删除经费负责人
  const removeBudgetHolder = (id: string) => {
    if (budgetAllocations.length <= 1) {
      return; // 保持至少一行
    }
    
    // 查找要删除的行
    const itemToRemove = budgetAllocations.find(item => item.id === id);
    if (itemToRemove && itemToRemove.cardHolderId) {
      // 从管理费数据中移除该负责人的数据
      const newManagementFees = { ...managementFees };
      delete newManagementFees[itemToRemove.cardHolderId];
      setManagementFees(newManagementFees);
    }
    
    setBudgetAllocations(budgetAllocations.filter(item => item.id !== id));
  };

  // 复制行
  const duplicateBudgetHolder = (id: string) => {
    const itemToDuplicate = budgetAllocations.find(item => item.id === id);
    if (itemToDuplicate) {
      setBudgetAllocations([
        ...budgetAllocations,
        {
          ...itemToDuplicate,
          id: Date.now().toString(),
        }
      ]);
    }
  };

  // 更新额度拆分信息
  const updateBudgetAllocation = (id: string, field: string, value: string) => {
    setBudgetAllocations(
      budgetAllocations.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 更新经费卡负责人
  const updateCardHolder = (id: string, teamMemberId: string) => {
    const member = teamMembers.find(m => m.id === teamMemberId);
    if (member) {
      // 找到要更新的行
      const itemToUpdate = budgetAllocations.find(item => item.id === id);
      const oldCardHolderId = itemToUpdate?.cardHolderId;
      
      // 更新经费负责人信息
      setBudgetAllocations(
        budgetAllocations.map(item => 
          item.id === id ? { 
            ...item, 
            cardHolderId: member.id,
            cardHolder: `${member.name} (${member.id})`,
            department: member.dept
          } : item
        )
      );
      
      // 确保为所有负责人初始化管理费数据
      if (member.id && !managementFees[member.id]) {
        // 初始化管理费数据，使用原负责人的数据或默认值
        let initialFees: ManagementFeeData = {
          performanceFee: { total: "1.4", current: "0" },
          bonusFee: { total: "1.4", current: "0" },
          institutionFee: { total: "1.4", current: "0" }
        };
        
        // 如果是替换负责人，可以保留原负责人的管理费数据
        if (oldCardHolderId && managementFees[oldCardHolderId]) {
          initialFees = { ...managementFees[oldCardHolderId] };
          
          // 如果不需要保留旧数据，就删除旧负责人的数据
          const newManagementFees = { ...managementFees };
          delete newManagementFees[oldCardHolderId as string];
          setManagementFees({
            ...newManagementFees,
            [member.id]: initialFees
          });
        } else {
          // 如果是新增的负责人，添加默认管理费数据
          setManagementFees({
            ...managementFees,
            [member.id]: initialFees
          });
        }
      }
      
      // 计算该负责人的管理费
      calculateManagementFee(member.id);
    }
  };

  // 更新管理费信息
  const updateManagementFee = (cardHolderId: string, feeType: keyof ManagementFeeData, field: keyof FeeItem, value: string) => {
    if (managementFees[cardHolderId]) {
      setManagementFees({
        ...managementFees,
        [cardHolderId]: {
          ...managementFees[cardHolderId],
          [feeType]: {
            ...managementFees[cardHolderId][feeType],
            [field]: value
          }
        }
      });
    }
  };

  // 初始化新负责人的管理费数据
  const initializeManagementFee = (cardHolderId: string) => {
    if (!managementFees[cardHolderId]) {
      setManagementFees({
        ...managementFees,
        [cardHolderId]: {
          performanceFee: { total: "0.0", current: "0" },
          bonusFee: { total: "0.0", current: "0" },
          institutionFee: { total: "0.0", current: "0" }
        }
      });
    }
  };

  // 根据分配方案自动计算管理费
  const calculateManagementFee = (cardHolderId: string) => {
    const allocation = budgetAllocations.find(item => item.cardHolderId === cardHolderId);
    if (!allocation) return;

    // 确保管理费数据存在
    if (!managementFees[cardHolderId]) {
      initializeManagementFee(cardHolderId);
    }

    // 根据不同分配方案计算管理费
    const fundingAmount = parseFloat(allocation.schoolFunding) + parseFloat(allocation.externalFunding);
    let performanceRate = 0.03;
    let bonusRate = 0.03;
    let institutionRate = 0.02;

    // 根据管理费提取方案调整比例
    if (formData.managementFeeMethod?.includes("862")) {
      performanceRate = 0.04;
      bonusRate = 0.03;
      institutionRate = 0.03;
    } else if (formData.managementFeeMethod?.includes("863")) {
      performanceRate = 0.03;
      bonusRate = 0.03;
      institutionRate = 0.02;
    } else if (formData.managementFeeMethod?.includes("学校")) {
      performanceRate = 0.02;
      bonusRate = 0.02;
      institutionRate = 0.04;
    }

    const calculatedFees = {
      performanceFee: {
        total: (fundingAmount * performanceRate).toFixed(1),
        current: managementFees[cardHolderId]?.performanceFee.current || "0"
      },
      bonusFee: {
        total: (fundingAmount * bonusRate).toFixed(1),
        current: managementFees[cardHolderId]?.bonusFee.current || "0"
      },
      institutionFee: {
        total: (fundingAmount * institutionRate).toFixed(1),
        current: managementFees[cardHolderId]?.institutionFee.current || "0"
      }
    };

    setManagementFees({
      ...managementFees,
      [cardHolderId]: calculatedFees
    });
  };

  // 批量重新计算所有管理费
  const recalculateAllManagementFees = async () => {
    setIsCalculating(true);
    
    try {
      // 添加延迟使动画效果更明显
      await new Promise(resolve => setTimeout(resolve, 500));
      
      budgetAllocations.forEach(item => {
        if (item.cardHolderId) {
          calculateManagementFee(item.cardHolderId);
        }
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // 重新计算单个经费卡负责人的管理费
  const recalculateSingleManagementFee = async (cardHolderId: string) => {
    setIsCalculating(true);
    
    try {
      // 添加延迟使动画效果更明显
      await new Promise(resolve => setTimeout(resolve, 300));
      calculateManagementFee(cardHolderId);
    } finally {
      setIsCalculating(false);
    }
  };

  // 一键清零所有管理费
  const resetAllManagementFees = () => {
    const newManagementFees = { ...managementFees };
    
    Object.keys(newManagementFees).forEach(cardHolderId => {
      if (newManagementFees[cardHolderId]) {
        newManagementFees[cardHolderId] = {
          ...newManagementFees[cardHolderId],
          performanceFee: { 
            ...newManagementFees[cardHolderId].performanceFee, 
            current: "0" 
          },
          bonusFee: { 
            ...newManagementFees[cardHolderId].bonusFee, 
            current: "0" 
          },
          institutionFee: { 
            ...newManagementFees[cardHolderId].institutionFee, 
            current: "0" 
          }
        };
      }
    });
    
    setManagementFees(newManagementFees);
  };

  // 清零单个经费卡负责人的管理费
  const resetSingleManagementFee = (cardHolderId: string) => {
    const newManagementFees = { ...managementFees };
    if (newManagementFees[cardHolderId]) {
      newManagementFees[cardHolderId] = {
        ...newManagementFees[cardHolderId],
        performanceFee: { 
          ...newManagementFees[cardHolderId].performanceFee, 
          current: "0" 
        },
        bonusFee: { 
          ...newManagementFees[cardHolderId].bonusFee, 
          current: "0" 
        },
        institutionFee: { 
          ...newManagementFees[cardHolderId].institutionFee, 
          current: "0" 
        }
      };
      setManagementFees(newManagementFees);
    }
  };

  // 搜索筛选团队成员
  const filterTeamMembers = (value: string) => {
    return teamMembers.filter((member) => {
      return member.name.toLowerCase().includes(value.toLowerCase()) || 
             member.id.toLowerCase().includes(value.toLowerCase()) ||
             member.dept.toLowerCase().includes(value.toLowerCase());
    });
  };

  // 计算所有管理费总计
  const calculateTotalManagementFees = () => {
    let totalCurrent = 0;
    let totalAccumulated = 0;

    Object.keys(managementFees).forEach(cardHolderId => {
      if (managementFees[cardHolderId]) {
        // 当前扣除总额
        totalCurrent += parseFloat(managementFees[cardHolderId].performanceFee.current || "0");
        totalCurrent += parseFloat(managementFees[cardHolderId].bonusFee.current || "0");
        totalCurrent += parseFloat(managementFees[cardHolderId].institutionFee.current || "0");
        
        // 累计扣除总额
        totalAccumulated += parseFloat(managementFees[cardHolderId].performanceFee.total || "0");
        totalAccumulated += parseFloat(managementFees[cardHolderId].bonusFee.total || "0");
        totalAccumulated += parseFloat(managementFees[cardHolderId].institutionFee.total || "0");
      }
    });

    return {
      totalCurrent: totalCurrent.toFixed(1),
      totalAccumulated: totalAccumulated.toFixed(1)
    };
  };

  // 设置所有管理费为累计金额
  const setAllFeesToTotal = () => {
    const newManagementFees = { ...managementFees };
    
    Object.keys(newManagementFees).forEach(cardHolderId => {
      if (newManagementFees[cardHolderId]) {
        newManagementFees[cardHolderId] = {
          ...newManagementFees[cardHolderId],
          performanceFee: { 
            ...newManagementFees[cardHolderId].performanceFee, 
            current: newManagementFees[cardHolderId].performanceFee.total
          },
          bonusFee: { 
            ...newManagementFees[cardHolderId].bonusFee, 
            current: newManagementFees[cardHolderId].bonusFee.total
          },
          institutionFee: { 
            ...newManagementFees[cardHolderId].institutionFee, 
            current: newManagementFees[cardHolderId].institutionFee.total
          }
        };
      }
    });
    
    setManagementFees(newManagementFees);
  };

  // 导出管理费数据
  const exportManagementFees = () => {
    const exportData = {
      managementFees,
      projectName: formData.incomeName || "未命名项目",
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `管理费数据_${formData.incomeName || "项目"}_${new Date().toLocaleDateString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 导入管理费数据
  const importManagementFees = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData && importedData.managementFees) {
          // 确保只导入当前存在的卡片持有人数据
          const newManagementFees = { ...managementFees };
          
          Object.keys(newManagementFees).forEach(cardHolderId => {
            if (importedData.managementFees[cardHolderId]) {
              newManagementFees[cardHolderId] = importedData.managementFees[cardHolderId];
            }
          });
          
          setManagementFees(newManagementFees);
        }
      } catch (error) {
        console.error("导入管理费数据失败:", error);
      }
    };
    reader.readAsText(file);
    
    // 清除input的value，以便可以重复选择同一个文件
    event.target.value = '';
  };

  // 展开/折叠所有卡片
  const toggleAllCards = (expand: boolean) => {
    const newExpandedCards: Record<string, boolean> = {};
    
    budgetAllocations
      .filter(item => item.cardHolderId)
      .forEach(item => {
        if (item.cardHolderId) {
          newExpandedCards[item.cardHolderId] = expand;
        }
      });
    
    setExpandedCards(newExpandedCards);
  };

  const totalFees = calculateTotalManagementFees();

  // 初始化表单数据
  useEffect(() => {
    console.log("StepFundClaim 初始化表单数据:", formData);
    
    // 如果已经有表单数据，恢复相关字段的状态
    if (formData.claimer) {
      // 这里可以添加更多字段的状态恢复
      console.log("恢复经费认领表单数据");
    }

    // 如果formData中有budgetAllocation数据，可以在这里恢复额度拆分信息
    if (formData.budgetAllocation && typeof formData.budgetAllocation === 'string' && !formData._budgetAllocationsRestored) {
      try {
        const parsedData = JSON.parse(formData.budgetAllocation);
        if (Array.isArray(parsedData)) {
          // 添加一个标记，防止重复恢复
          updateFormData("_budgetAllocationsRestored", true);
          setBudgetAllocations(parsedData);
          
          // 恢复管理费信息
          if (formData.managementFees) {
            try {
              const parsedFees = JSON.parse(formData.managementFees);
              setManagementFees(parsedFees);
            } catch (e) {
              console.error("恢复管理费数据出错", e);
            }
          }
        }
      } catch (e) {
        console.error("解析预算分配数据出错", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.budgetAllocation]);

  // 当额度拆分信息或管理费信息变化时，更新formData (使用防抖机制)
  const [shouldUpdateForm, setShouldUpdateForm] = useState(false);
  
  useEffect(() => {
    if (!formData._budgetAllocationsRestored) return; // 避免初始加载时更新
    
    // 标记需要更新
    setShouldUpdateForm(true);
    
    // 设置定时器，防抖处理
    const timer = setTimeout(() => {
      if (shouldUpdateForm) {
        // 将预算分配信息保存到formData
        updateFormData("budgetAllocation", JSON.stringify(budgetAllocations));
        
        // 将管理费信息保存到formData
        updateFormData("managementFees", JSON.stringify(managementFees));
        
        setShouldUpdateForm(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetAllocations, managementFees, shouldUpdateForm]);

  return (
    <div className="space-y-6">
      {/* 经费认领部分 */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <DollarSign className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">认领经费</h3>
        </div>

        {/* 添加银行来款信息卡片 */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-700">已选银行来款信息</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-muted-foreground min-w-[80px]">来款摘要:</span>
              <span className="font-medium">{selectedBankInfo.summary}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-muted-foreground min-w-[80px]">来款单位:</span>
              <span className="font-medium">{selectedBankInfo.bankName}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-muted-foreground min-w-[80px]">金额:</span>
              <Badge variant="outline" className="font-medium">
                ¥{parseInt(selectedBankInfo.amount).toLocaleString()}
              </Badge>
            </div>
            
            <div className="flex items-center">
              <span className="text-muted-foreground min-w-[80px]">日期:</span>
              <span className="font-medium">{selectedBankInfo.date}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-muted-foreground min-w-[80px]">对冲号:</span>
              <span className="font-medium text-xs text-muted-foreground">{selectedBankInfo.reference}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-muted-foreground min-w-[80px]">可认领金额:</span>
              <Badge variant="secondary" className="font-medium bg-green-50 text-green-700 border-green-200">
                {formData.amount ? (parseInt(formData.amount) / 10000).toFixed(2) : "50.00"} 万元
              </Badge>
            </div>
          </div>
        </div>

        {/* 表单字段部分 - 使用网格布局 */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 border border-input rounded-md p-6">
          <div className="flex items-center">
            <Label htmlFor="claimAmount" className="min-w-[100px] text-right">认领金额</Label>
            <div className="flex items-center ml-4">
              <Input
                id="claimAmount"
                type="number"
                className="w-[180px]"
                placeholder="0"
                value={formData.claimAmount || ""}
                onChange={(e) => updateFormData("claimAmount", e.target.value)}
              />
              <span className="ml-2">万元</span>
            </div>
          </div>

          <div className="flex items-center">
            <Label htmlFor="fundSource" className="min-w-[100px] text-right">来款类型</Label>
            <RadioGroup
              value={formData.fundSource || "directFund"}
              className="flex items-center gap-3 ml-4"
              onValueChange={(value) => updateFormData("fundSource", value)}
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="directFund" id="directFund" />
                <Label htmlFor="directFund" className="cursor-pointer">直接经费</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="indirectFund" id="indirectFund" />
                <Label htmlFor="indirectFund" className="cursor-pointer">间接经费</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="activityFund" id="activityFund" />
                <Label htmlFor="activityFund" className="cursor-pointer">活动经费</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center">
            <Label htmlFor="hasExternalFunding" className="min-w-[100px] text-right">是否有外拨</Label>
            <RadioGroup
              value={formData.hasExternalFunding || "no"}
              className="flex items-center gap-4 ml-4"
              onValueChange={(value) => updateFormData("hasExternalFunding", value)}
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="yes" id="hasExternalFundingYes" />
                <Label htmlFor="hasExternalFundingYes" className="cursor-pointer">是</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="no" id="hasExternalFundingNo" />
                <Label htmlFor="hasExternalFundingNo" className="cursor-pointer">否</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center">
            <Label htmlFor="needBankCard" className="min-w-[100px] text-right">是否需要建新卡</Label>
            <RadioGroup
              value={formData.needBankCard || "no"}
              className="flex items-center gap-4 ml-4"
              onValueChange={(value) => updateFormData("needBankCard", value)}
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="yes" id="needBankCardYes" />
                <Label htmlFor="needBankCardYes" className="cursor-pointer">是</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="no" id="needBankCardNo" />
                <Label htmlFor="needBankCardNo" className="cursor-pointer">否</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center">
            <Label htmlFor="claimer" className="min-w-[100px] text-right">经办人</Label>
            <Input
              id="claimer"
              placeholder="请输入经办人姓名"
              value={formData.claimer || ""}
              onChange={(e) => updateFormData("claimer", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          <div className="flex items-center">
            <Label htmlFor="claimerPhone" className="min-w-[100px] text-right">经办人手机号</Label>
            <Input
              id="claimerPhone"
              placeholder="请输入经办人手机号"
              value={formData.claimerPhone || ""}
              onChange={(e) => updateFormData("claimerPhone", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          <div className="flex items-center">
            <Label htmlFor="managementFeeMethod" className="min-w-[100px] text-right">管理费提取方案</Label>
            <Select
              value={formData.managementFeeMethod || ""}
              onValueChange={(value) => updateFormData("managementFeeMethod", value)}
            >
              <SelectTrigger id="managementFeeMethod" className="w-[300px] ml-4">
                <SelectValue placeholder="请选择管理费提取方案" />
              </SelectTrigger>
              <SelectContent>
                {managementFeeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 额度拆分部分 */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md flex-1">
            <div className="text-blue-500">
              <PieChart className="h-5 w-5" />
            </div>
            <h3 className="text-base font-medium">额度拆分信息</h3>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 gap-1 ml-2" onClick={addBudgetHolder}>
                    <Plus className="h-4 w-4" />
                    增加经费负责人
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>添加新的经费负责人行</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">经费卡负责人</TableHead>
                <TableHead className="w-[180px]">所属单位</TableHead>
                <TableHead className="w-[140px]">经费卡号</TableHead>
                <TableHead className="text-right">留校金额(万元)</TableHead>
                <TableHead className="text-right">外拨金额(万元)</TableHead>
                <TableHead className="text-right">已到账金额(万元)</TableHead>
                <TableHead className="text-right">原校预算(万元)</TableHead>
                <TableHead className="w-[100px] text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {allocation.cardHolder ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{allocation.cardHolder}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">请选择负责人</span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="搜索项目团队成员..." />
                          <CommandEmpty>未找到团队成员</CommandEmpty>
                          <CommandGroup heading="项目团队成员" className="max-h-[200px] overflow-y-auto">
                            {teamMembers.map((member) => (
                              <CommandItem
                                key={member.id}
                                value={member.id}
                                onSelect={() => {
                                  updateCardHolder(allocation.id, member.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    allocation.cardHolderId === member.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{member.name} ({member.id})</span>
                                  <span className="text-xs text-muted-foreground">{member.title} - {member.dept}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
            <Select
                      value={allocation.department}
                      onValueChange={(value) => updateBudgetAllocation(allocation.id, 'department', value)}
            >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择单位" />
              </SelectTrigger>
              <SelectContent>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={allocation.budgetNumber}
                      placeholder="请输入卡号"
                      onChange={(e) => updateBudgetAllocation(allocation.id, 'budgetNumber', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number"
                      value={allocation.schoolFunding}
                      className="text-right w-24 ml-auto"
                      onChange={(e) => updateBudgetAllocation(allocation.id, 'schoolFunding', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number"
                      value={allocation.externalFunding}
                      className="text-right w-24 ml-auto"
                      onChange={(e) => updateBudgetAllocation(allocation.id, 'externalFunding', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number"
                      value={allocation.receivedAmount}
                      className="text-right w-24 ml-auto"
                      onChange={(e) => updateBudgetAllocation(allocation.id, 'receivedAmount', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number"
                      value={allocation.originalBudget}
                      className="text-right w-24 ml-auto"
                      onChange={(e) => updateBudgetAllocation(allocation.id, 'originalBudget', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => duplicateBudgetHolder(allocation.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>复制此行</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => removeBudgetHolder(allocation.id)}
                              disabled={budgetAllocations.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除此行</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* 汇总行 */}
              <TableRow className="bg-muted/20">
                <TableCell colSpan={3} className="font-medium text-right">
                  合计:
                </TableCell>
                <TableCell className="text-right font-medium">{totals.schoolFundingTotal}</TableCell>
                <TableCell className="text-right font-medium">{totals.externalFundingTotal}</TableCell>
                <TableCell className="text-right font-medium">{totals.receivedAmountTotal}</TableCell>
                <TableCell className="text-right font-medium">{totals.originalBudgetTotal}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {(formData.claimAmount && parseFloat(formData.claimAmount) > 0) && 
            <div className="p-3 flex items-center gap-2 bg-amber-50 text-amber-800 text-sm border-t">
              <AlertCircle className="h-4 w-4" />
              <span>认领金额与额度拆分总额应保持一致。当前认领金额: {formData.claimAmount} 万元，额度拆分总额: {(parseFloat(totals.schoolFundingTotal) + parseFloat(totals.externalFundingTotal)).toFixed(1)} 万元</span>
            </div>
          }
        </div>
      </div>

      {/* 管理费部分 */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md flex-1">
            <div className="text-blue-500">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="text-base font-medium">管理费信息</h3>
            <span className="text-sm font-normal text-muted-foreground ml-2">
              该项将根据项目分类自动计算管理费用
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 gap-1"
                  disabled={isCalculating}
                >
                  <Settings className="h-4 w-4" />
                  批量操作
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <div className="p-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left font-normal px-2 mb-1"
                    onClick={() => toggleAllCards(true)}
                  >
                    <ChevronDown className="h-4 w-4 mr-2" /> 
                    展开所有卡片
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left font-normal px-2 mb-1"
                    onClick={() => toggleAllCards(false)}
                  >
                    <ChevronUp className="h-4 w-4 mr-2" /> 
                    折叠所有卡片
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left font-normal px-2 mb-1"
                    onClick={resetAllManagementFees}
                  >
                    <CircleOff className="h-4 w-4 mr-2" /> 
                    一键清零
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left font-normal px-2 mb-1"
                    onClick={setAllFeesToTotal}
                  >
                    <ArrowUpCircle className="h-4 w-4 mr-2" /> 
                    设为全部累计金额
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left font-normal px-2 mb-1"
                    onClick={exportManagementFees}
                  >
                    <Download className="h-4 w-4 mr-2" /> 
                    导出管理费数据
                  </Button>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-left font-normal px-2"
                    >
                      <Upload className="h-4 w-4 mr-2" /> 
                      导入管理费数据
                    </Button>
                    <input 
                      type="file" 
                      accept=".json" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={importManagementFees}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 gap-1"
              disabled={isCalculating}
              onClick={recalculateAllManagementFees}
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  计算中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重新计算管理费
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 管理费总计信息卡片 */}
        <div className="border rounded-md p-4 bg-slate-50/60">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-blue-500" />
              <span className="font-medium">管理费总计</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm text-muted-foreground mr-2">本次扣除总额:</span>
                <Badge variant="secondary" className="font-medium text-blue-700 bg-blue-50 border-blue-100">
                  {totalFees.totalCurrent} 万元
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground mr-2">累计扣除总额:</span>
                <Badge variant="outline" className="font-medium">
                  {totalFees.totalAccumulated} 万元
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {budgetAllocations.filter(item => item.cardHolderId).length === 0 ? (
          <div className="border rounded-md p-6 text-center text-muted-foreground">
            请先在额度拆分信息中选择经费卡负责人
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetAllocations
              .filter(item => item.cardHolderId && item.cardHolderId.trim() !== "")
              .sort((a, b) => {
                // 保持显示顺序与额度拆分表格一致
                return budgetAllocations.findIndex(item => item.id === a.id) - 
                       budgetAllocations.findIndex(item => item.id === b.id);
              })
              .map((allocation) => {
                const cardHolder = teamMembers.find(m => m.id === allocation.cardHolderId);
                const holderFees = managementFees[allocation.cardHolderId];

                // 如果没有找到管理费数据，立即初始化
                if (allocation.cardHolderId && !holderFees) {
                  initializeManagementFee(allocation.cardHolderId);
                  return null; // 初始化后下次渲染时会显示
                }

                if (!cardHolder || !holderFees) return null;

                const fundingAmount = parseFloat(allocation.schoolFunding) + parseFloat(allocation.externalFunding);
                const expanded = isCardExpanded(allocation.cardHolderId);
                
                // 计算本次扣除管理费总额
                const currentFeeTotal = parseFloat(holderFees.performanceFee.current || "0") + 
                                        parseFloat(holderFees.bonusFee.current || "0") + 
                                        parseFloat(holderFees.institutionFee.current || "0");

                // 单个卡片的操作菜单
                const cardOperations = (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full"
                        disabled={isCalculating}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => {
                        // 为此卡片持有人重新计算管理费
                        recalculateSingleManagementFee(allocation.cardHolderId);
                      }}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        <span>重新计算</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        // 清零此卡片持有人的管理费
                        resetSingleManagementFee(allocation.cardHolderId);
                      }}>
                        <CircleOff className="h-4 w-4 mr-2" />
                        <span>清零当前值</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        // 将此卡片持有人的管理费设为累计金额
                        const newManagementFees = { ...managementFees };
                        if (newManagementFees[allocation.cardHolderId]) {
                          newManagementFees[allocation.cardHolderId] = {
                            ...newManagementFees[allocation.cardHolderId],
                            performanceFee: { 
                              ...newManagementFees[allocation.cardHolderId].performanceFee, 
                              current: newManagementFees[allocation.cardHolderId].performanceFee.total 
                            },
                            bonusFee: { 
                              ...newManagementFees[allocation.cardHolderId].bonusFee, 
                              current: newManagementFees[allocation.cardHolderId].bonusFee.total 
                            },
                            institutionFee: { 
                              ...newManagementFees[allocation.cardHolderId].institutionFee, 
                              current: newManagementFees[allocation.cardHolderId].institutionFee.total 
                            }
                          };
                          setManagementFees(newManagementFees);
                        }
                      }}>
                        <ArrowUpCircle className="h-4 w-4 mr-2" />
                        <span>设为累计金额</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );

                return (
                  <div key={allocation.id} className="border rounded-lg shadow-sm overflow-hidden">
                    <div 
                      className="bg-blue-50 p-3 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCardExpand(allocation.cardHolderId)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{cardHolder.name} ({cardHolder.id})</span>
                        <span className="text-sm text-muted-foreground">{cardHolder.dept}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-medium bg-white">
                          分配额度: {fundingAmount.toFixed(1)} 万元
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                          本次: {currentFeeTotal.toFixed(1)} 万元
                        </Badge>
                        {cardOperations}
                        {expanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {expanded && (
                      <div className={`p-3 ${isCalculating ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex flex-col space-y-3 mb-4">
                          <div className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CircleDollarSign className="h-4 w-4" />
                              <span className="text-sm font-medium">本次扣除总额: {currentFeeTotal.toFixed(1)} 万元</span>
                            </div>
                            <div className="text-sm text-right">
                              <span className="text-muted-foreground">卡号: </span>
                              <span className="font-medium">{allocation.budgetNumber || "未设置"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium w-20">绩效</span>
                              <span className="text-sm text-muted-foreground">累计: {holderFees.performanceFee.total} 万元</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">本次扣除:</span>
                              <Input
                                type="number"
                                placeholder="0"
                                value={holderFees.performanceFee.current}
                                className="w-24"
                                onChange={(e) => updateManagementFee(
                                  allocation.cardHolderId,
                                  'performanceFee',
                                  'current',
                                  e.target.value
                                )}
                                disabled={isCalculating}
                              />
                              <span className="text-sm">万元</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium w-20">奖金</span>
                              <span className="text-sm text-muted-foreground">累计: {holderFees.bonusFee.total} 万元</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">本次扣除:</span>
                              <Input
                                type="number"
                                placeholder="0"
                                value={holderFees.bonusFee.current}
                                className="w-24"
                                onChange={(e) => updateManagementFee(
                                  allocation.cardHolderId,
                                  'bonusFee',
                                  'current',
                                  e.target.value
                                )}
                                disabled={isCalculating}
                              />
                              <span className="text-sm">万元</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium w-20">院管理费</span>
                              <span className="text-sm text-muted-foreground">累计: {holderFees.institutionFee.total} 万元</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">本次扣除:</span>
                              <Input
                                type="number"
                                placeholder="0"
                                value={holderFees.institutionFee.current}
                                className="w-24"
                                onChange={(e) => updateManagementFee(
                                  allocation.cardHolderId,
                                  'institutionFee',
                                  'current',
                                  e.target.value
                                )}
                                disabled={isCalculating}
                              />
                              <span className="text-sm">万元</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 其他说明 */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <div className="text-blue-500">
            <Info className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">认领说明</h3>
        </div>

        <textarea
          id="claimRemark"
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="请输入经费认领说明"
          value={formData.claimRemark || ""}
          onChange={(e) => updateFormData("claimRemark", e.target.value)}
        />
      </div>
    </div>
  )

  // 添加调试日志以跟踪组件渲染
  console.log("StepFundClaim 组件已渲染，当前值:", {
    budgetAllocations,
    totalFees: calculateTotalManagementFees(),
    formData
  });
} 