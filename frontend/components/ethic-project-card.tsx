import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Pencil, 
  ChevronRight,
  FileText, 
  Building2, 
  BriefcaseMedical, 
  ClipboardList,
  PawPrint,
  Tag,
  Bookmark,
  Bell,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Search,
  X,
  Eye,
  CheckCircle2,
  Clock
} from "lucide-react";
import { RatIcon, MouseIcon, RabbitIcon, MonkeyIcon, PigIcon, DogIcon } from "./animal-icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateAnimalReviewDialog } from "./create-animal-review-dialog";
import { CreateHumanReviewDialog } from "./create-human-review-dialog";

export interface EthicCardAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any, e: React.MouseEvent) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: (item: any) => boolean;
  hidden?: (item: any) => boolean;
}

export interface EthicCardField {
  id: string;
  label: string;
  value: (item: any) => React.ReactNode;
  className?: string;
}

interface EthicProjectCardProps {
  item: any;
  actions?: EthicCardAction[];
  fields?: EthicCardField[];
  titleField: string;
  descriptionField?: string;
  statusField?: string;
  statusVariants?: Record<string, string>;
  tasksField?: { completed: string; total: string };
  type: "animal" | "human";
  detailsUrl?: string;
  className?: string;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
}

// 动物种类图标渲染函数
const getAnimalIcon = (animalType: string) => {
  const iconClass = "h-4 w-4 text-gray-400 flex-shrink-0";
  // 统一使用PawPrint图标
  return <PawPrint className={iconClass} />;
};

// 修改Dialog组件的样式，使遮罩层更透明
// 添加这个样式到您的全局CSS中（可以在组件中导入或在样式文件中定义）
const dialogOverlayStyles = {
  backgroundColor: "rgba(0, 0, 0, 0.4)" // 调整为更透明的黑色
};

// 优化的审查类型选择组件
interface ReviewTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  projectType?: "animal" | "human";
}

interface ReviewTypeGroup {
  id: string;
  label: string;
  items: { id: string; label: string }[];
}

const ReviewTypeSelect: React.FC<ReviewTypeSelectProps> = ({ value, onValueChange, projectType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "tracking": false,
    "human_genetic": false,
    "human_genetic_filing": false
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allReviewTypes: ReviewTypeGroup[] = [
    {
      id: "initial",
      label: "初始审查",
      items: []
    },
    {
      id: "tracking",
      label: "跟踪审查",
      items: [
        { id: "amendment", label: "修正案审查" },
        { id: "annual", label: "年度/定期审查" },
        { id: "safety", label: "安全性审查" },
        { id: "deviation", label: "偏离方案审查" },
        { id: "suspension", label: "暂停/终止研究审查" },
        { id: "completion", label: "研究完成审查" }
      ]
    },
    {
      id: "human_genetic",
      label: "人遗审查",
      items: [
        { id: "collection", label: "人遗采集审批" },
        { id: "preservation", label: "人遗保藏审批" },
        { id: "international_research", label: "国际合作科学研究审批" },
        { id: "export", label: "材料出境审批" }
      ]
    },
    {
      id: "human_genetic_filing",
      label: "人遗备案",
      items: [
        { id: "international_clinical", label: "国际合作临床试验备案" },
        { id: "external_use", label: "对外提供或开放使用备案" },
        { id: "important_resource", label: "重要遗传家系和特定地区人遗资源" }
      ]
    }
  ];

  // 根据项目类型过滤审查类型选项
  const reviewTypes = useMemo(() => {
    if (projectType === "animal") {
      // 动物伦理项目只显示初始审查选项
      return [allReviewTypes[0]];
    }
    // 人体伦理项目显示所有选项
    return allReviewTypes;
  }, [projectType]);

  // 获取当前选中项的标签
  const getSelectedLabel = () => {
    // 检查是否是主选项
    const mainType = reviewTypes.find(type => type.id === value);
    if (mainType && mainType.items.length === 0) {
      return mainType.label;
    }
    
    // 检查子选项
    for (const group of reviewTypes) {
      const item = group.items.find(item => item.id === value);
      if (item) {
        return item.label;
      }
    }
    
    return "请选择审查类型";
  };

  // 过滤选项
  const getFilteredOptions = () => {
    if (!searchQuery) return reviewTypes;
    
    return reviewTypes.map(group => {
      // 过滤子项
      const filteredItems = group.items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // 如果组标题匹配或有匹配的子项，返回组
      if (group.label.toLowerCase().includes(searchQuery.toLowerCase()) || filteredItems.length > 0) {
        return {
          ...group,
          items: filteredItems
        };
      }
      
      // 返回空项目数组表示无匹配
      return {
        ...group,
        items: []
      };
    }).filter(group => 
      // 保留有匹配子项的组或标题匹配的组
      group.label.toLowerCase().includes(searchQuery.toLowerCase()) || group.items.length > 0
    );
  };

  // 切换分组展开状态
  const toggleGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // 选择选项
  const handleSelect = (id: string) => {
    onValueChange(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 打开下拉框时聚焦搜索框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // 移除默认自动聚焦，让用户主动点击搜索框
      // setTimeout(() => {
      //   searchInputRef.current?.focus();
      // }, 10);
    }
  }, [isOpen]);

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  // 高亮搜索匹配文本
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      const parts = text.split(regex);
      
      return (
        <>
          {parts.map((part, i) => 
            regex.test(part) ? <span key={i} className="bg-yellow-100 text-blue-700 font-medium">{part}</span> : part
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  const filteredOptions = getFilteredOptions();
  
  // 智能提示 - 根据搜索内容找出最可能想要选择的选项
  const topSuggestion = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return null;
    
    // 尝试找到完全匹配的选项
    for (const group of filteredOptions) {
      // 检查组标题是否匹配
      if (group.label.toLowerCase() === searchQuery.toLowerCase()) {
        return { id: group.id, label: group.label, isGroup: true };
      }
      
      // 检查子项是否匹配
      for (const item of group.items) {
        if (item.label.toLowerCase() === searchQuery.toLowerCase()) {
          return { id: item.id, label: item.label, isGroup: false, groupId: group.id };
        }
      }
    }
    
    // 尝试找到包含搜索词的选项
    for (const group of filteredOptions) {
      // 检查组标题是否包含搜索词
      if (group.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        return { id: group.id, label: group.label, isGroup: true };
      }
      
      // 检查子项是否包含搜索词
      for (const item of group.items) {
        if (item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
          return { id: item.id, label: item.label, isGroup: false, groupId: group.id };
        }
      }
    }
    
    return null;
  }, [searchQuery, filteredOptions]);

  return (
    <div className="relative mt-2" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => projectType === "animal" ? null : setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          projectType === "animal" && "cursor-not-allowed opacity-90",
          !value && "text-gray-500"
        )}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-500"}>
          {getSelectedLabel()}
        </span>
        {projectType !== "animal" && <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "transform rotate-180")} />}
      </button>
      
      {isOpen && projectType !== "animal" && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          {/* 搜索框 */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/70">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="搜索审查类型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={cn(
                  "w-full pl-9 pr-8 py-2 text-sm rounded-md transition-all duration-150",
                  "border border-gray-200 outline-none bg-white",
                  searchFocused 
                    ? "ring-2 ring-blue-400 border-blue-400" 
                    : "ring-0 hover:border-gray-300"
                )}
              />
              {searchQuery && (
                <button 
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* 智能提示 */}
            {searchQuery && topSuggestion && (
              <div className="mt-1.5 text-xs text-gray-600 flex items-center justify-between px-1">
                <div className="flex items-center gap-1">
                  <span>按Enter选择:</span>
                  <span className="font-medium text-blue-600">{topSuggestion.label}</span>
                </div>
                <button 
                  className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                  onClick={() => handleSelect(topSuggestion.id)}
                >
                  选择
                </button>
              </div>
            )}
          </div>
          
          {/* 选项列表 */}
          <div className="py-1 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <span>未找到匹配的审查类型</span>
              </div>
            ) : (
              filteredOptions.map(group => (
                <div key={group.id} className="mb-1 transition-all duration-200">
                  {group.items.length === 0 ? (
                    // 没有子项的选项直接显示
                    <div
                      className={cn(
                        "px-3 py-2.5 text-sm cursor-pointer hover:bg-blue-50/60 transition-colors flex items-center gap-2",
                        value === group.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      )}
                      onClick={() => handleSelect(group.id)}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        value === group.id ? "bg-blue-500" : "bg-gray-300"
                      )}></div>
                      {searchQuery ? highlightMatch(group.label, searchQuery) : group.label}
                    </div>
                  ) : (
                    // 有子项的选项显示为可展开的组
                    <>
                      <div
                        className={cn(
                          "px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between font-medium transition-colors border-l-2",
                          expandedGroups[group.id] ? "border-l-blue-500 bg-gray-50/80" : "border-l-transparent",
                          searchQuery ? "text-blue-700" : "text-gray-700"
                        )}
                        onClick={(e) => toggleGroup(group.id, e)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            expandedGroups[group.id] ? "bg-blue-500" : "bg-gray-400"
                          )}></div>
                          <span>
                            {searchQuery ? highlightMatch(group.label, searchQuery) : group.label}
                          </span>
                          {searchQuery && group.items.some(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())) && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs border-blue-200 ml-2">
                              {group.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).length}
                            </Badge>
                          )}
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200 text-gray-500",
                            expandedGroups[group.id] && "transform rotate-180"
                          )}
                        />
                      </div>
                      {(expandedGroups[group.id] || searchQuery) && group.items.length > 0 && (
                        <motion.div 
                          initial={searchQuery ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-l-2 border-blue-100 ml-5 my-1"
                        >
                          {group.items.map(item => (
                            <div
                              key={item.id}
                              className={cn(
                                "pl-4 pr-3 py-2 text-sm cursor-pointer hover:bg-blue-50/60 flex items-center gap-2 transition-colors",
                                value === item.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600"
                              )}
                              onClick={() => handleSelect(item.id)}
                            >
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full", 
                                value === item.id ? "bg-blue-500" : "bg-gray-300"
                              )}></div>
                              <span className={cn(
                                searchQuery && item.label.toLowerCase().includes(searchQuery.toLowerCase()) 
                                ? "decoration-blue-300 decoration-dotted underline-offset-4" 
                                : ""
                              )}>
                                {searchQuery ? highlightMatch(item.label, searchQuery) : item.label}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function EthicProjectCard({
  item,
  actions = [],
  fields = [],
  titleField,
  descriptionField,
  statusField,
  statusVariants = {},
  tasksField,
  type,
  detailsUrl,
  className,
  selected = false,
  onSelect,
  onClick,
}: EthicProjectCardProps) {
  const title = item[titleField] || "";
  const description = descriptionField ? item[descriptionField] : undefined;

  const getBorderColor = () => {
    return "border-gray-200";
  };

  const getHeaderBgColor = () => {
    return "bg-white";
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  // 动物种类和数量处理
  let animalType = "";
  let animalCount = "";
  let ethicsCommittee = item.伦理委员会 || item.ethicsCommittee || "医学院伦理审查委员会";
  let facilityUnit = item.动物实施设备单位 || item.facilityUnit || "基础医学实验中心";
  
  // 人体伦理项目相关字段
  let projectType = item.项目类型 || item.projectType || "临床研究";
  let projectSource = item.项目来源 || item.projectSource || "院内立项";
  let humanFacilityUnit = item.研究单位 || item.facilityUnit || "内科学系";
  
  // 处理动物类型和数量
  if (type === "animal") {
    if (title && title.includes("小鼠")) {
      animalType = "小鼠";
      animalCount = "120只";
    } else if (title && title.includes("大鼠")) {
      animalType = "大鼠";
      animalCount = "85只";
    } else if (title && (title.includes("猴") || title.includes("灵长类"))) {
      animalType = "猴子";
      animalCount = "12只";
    } else if (title && title.includes("兔")) {
      animalType = "兔子";
      animalCount = "30只";
    } else if (title && (title.includes("猪") || title.includes("心脏"))) {
      animalType = "猪";
      animalCount = "8只";
    } else if (title && (title.includes("狗") || title.includes("犬"))) {
      animalType = "犬类";
      animalCount = "15只";
    } else {
      animalType = item.动物种系 || item.animalType || "大鼠";
      animalCount = item.动物数量 || item.animalCount || "45只";
    }
  } else {
    // 对于人体伦理项目，设置默认值
    animalType = "无";
    animalCount = "0";
  }
  
  // 进行中和已完成的任务数量
  const inProgressCount = item.进行中 || Math.floor(Math.random() * 5) + 2;
  const completedCount = item.已完成 || Math.floor(Math.random() * 3) + 1;
  
  // 创建审查弹框状态
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  
  // 提交审查表单
  const handleSubmitReview = () => {
    // 处理提交审查表单的逻辑
    console.log("提交审查表单");
    setIsCreateReviewOpen(false);
  };
  
  // 打开创建审查弹框
  const openCreateReviewDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreateReviewOpen(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md rounded-lg bg-white overflow-hidden",
          getBorderColor(),
          selected && "ring-2 ring-primary",
          className
        )}
        onClick={handleClick}
      >
        <CardHeader className={cn(
          // 伦理项目统一样式：仅保留上方和左右padding
          (type === "animal" || type === "human") ? "px-6 pt-4 pb-0" : "px-6 py-4", 
          getHeaderBgColor()
        )}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg transition-colors duration-300 group-hover:text-blue-600 truncate flex-1">
                  {title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    {actions
                      .filter((action) => !action.hidden || !action.hidden(item))
                      .map((action) => (
                        <DropdownMenuItem
                          key={action.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`点击${action.label}按钮, 项目ID=${item.id}, action=${action.id}`);
                            console.log("传递给action.onClick的item:", item);
                            action.onClick(item, e);
                          }}
                          disabled={action.disabled ? action.disabled(item) : false}
                          className={cn(
                            "flex items-center gap-2 py-1.5 px-2 text-sm cursor-pointer",
                            action.id === "delete" ? "text-destructive hover:text-destructive" : ""
                          )}
                        >
                          {action.icon && <span className="h-4 w-4">{action.icon}</span>}
                          <span>{action.label}</span>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {description && <p className={cn(
                "text-sm text-muted-foreground truncate",
                // 伦理项目统一样式：副标题无下边距
                (type === "animal" || type === "human") ? "mt-1 mb-0" : "mt-1"
              )}>{description}</p>}
            </div>
          </div>
        </CardHeader>
        {/* 标题与内容之间的高端分割线 */}
        <div className={cn(
          "mx-6",
          // 伦理项目统一样式：增加分割线的margin-bottom
          (type === "animal" || type === "human") ? "mb-4 mt-3" : "mb-2"
        )}>
          <div className="h-[1px] bg-gradient-to-r from-blue-50 via-blue-200/40 to-blue-50"></div>
        </div>
        <CardContent className="px-6 py-3 pt-0">
          <div className="flex flex-col gap-4">
            {/* 项目信息区 */}
            <div className="grid grid-cols-1 gap-2">
              {type === "animal" ? (
                // 动物伦理卡片字段
                <>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getAnimalIcon(animalType)}
                      <span className="text-gray-600 flex-shrink-0">动物种系:</span>
                    </div>
                    <span className="font-medium truncate">{animalType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">动物数量:</span>
                    </div>
                    <span className="font-medium truncate">{animalCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">伦理委员会:</span>
                    </div>
                    <span className="font-medium truncate">{ethicsCommittee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <BriefcaseMedical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">动物实施设备单位:</span>
                    </div>
                    <span className="font-medium truncate">{facilityUnit}</span>
                  </div>
                </>
              ) : (
                // 人体伦理卡片字段
                <>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">研究类型:</span>
                    </div>
                    <span className="font-medium truncate">{projectType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">项目来源:</span>
                    </div>
                    <span className="font-medium truncate">{projectSource}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">伦理委员会:</span>
                    </div>
                    <span className="font-medium truncate">{ethicsCommittee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <BriefcaseMedical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 flex-shrink-0">研究单位:</span>
                    </div>
                    <span className="font-medium truncate">{humanFacilityUnit}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center px-6 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-50/40">
          <div className="flex items-center gap-1">
            <div className="flex items-center px-2 py-0.5 bg-green-50 rounded-full border border-green-100">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
              <span className="text-xs text-green-700 font-medium">{completedCount} 已批准</span>
            </div>
            <div className="flex items-center px-2 py-0.5 bg-amber-50 rounded-full border border-amber-100">
              <Clock className="h-3.5 w-3.5 text-amber-500 mr-1" />
              <span className="text-xs text-amber-700 font-medium">{inProgressCount} 审批中</span>
            </div>
          </div>
          <div>
            {/* 创建审查按钮 */}
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1.5 h-8 border-blue-200 bg-blue-50/50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm"
              onClick={openCreateReviewDialog}
            >
              <FileText className="h-3.5 w-3.5" />
              创建审查
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* 使用对应的审查弹框组件 */}
      {type === "animal" ? (
        <CreateAnimalReviewDialog
          isOpen={isCreateReviewOpen}
          onOpenChange={setIsCreateReviewOpen}
          projectTitle={title}
          projectEthicsCommittee={ethicsCommittee}
          onSubmit={handleSubmitReview}
        />
      ) : (
        <CreateHumanReviewDialog
          isOpen={isCreateReviewOpen}
          onOpenChange={setIsCreateReviewOpen}
          projectTitle={title}
          projectEthicsCommittee={ethicsCommittee}
          onSubmit={handleSubmitReview}
        />
      )}
    </motion.div>
  );
} 