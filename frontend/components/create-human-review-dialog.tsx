"use client"

import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, ChevronDown, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateHumanReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  projectEthicsCommittee: string;
  onSubmit: () => void;
}

// 审查类型组和选项
interface ReviewTypeGroup {
  id: string;
  label: string;
  items: { id: string; label: string }[];
}

// 完整的审查类型选择组件
interface ReviewTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

// 必填标记组件
const RequiredMark = () => (
  <span className="text-red-500 ml-1">*</span>
);

const ReviewTypeSelect: React.FC<ReviewTypeSelectProps> = ({ value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "tracking": false,
    "human_genetic": false,
    "human_genetic_filing": false
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // 审查类型分组定义
  const reviewTypes: ReviewTypeGroup[] = [
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
  };

  // 外部点击处理
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 聚焦搜索框
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  // 高亮匹配文本
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? <span key={i} className="bg-yellow-100 font-medium">{part}</span> : part
        )}
      </>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`mt-2 flex items-center justify-between px-3 py-2 h-10 text-sm border rounded-md cursor-pointer transition-colors ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block truncate ${!value ? 'text-muted-foreground' : 'text-foreground'}`}>
          {getSelectedLabel()}
        </span>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-auto">
          {/* 搜索框 */}
          <div className="sticky top-0 z-10 p-2 bg-white border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="搜索审查类型..."
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="p-1">
            {getFilteredOptions().map((group) => (
              <div key={group.id} className="mb-1">
                {/* 组标题 */}
                {group.id === "initial" ? (
                  <div 
                    className={`flex items-center px-3 py-2 text-sm cursor-pointer transition-colors rounded-md ${value === group.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
                    onClick={() => handleSelect(group.id)}
                  >
                    {highlightMatch(group.label, searchQuery)}
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex items-center justify-between px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-50 rounded-md"
                      onClick={(e) => toggleGroup(group.id, e)}
                    >
                      <span>{highlightMatch(group.label, searchQuery)}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups[group.id] ? 'transform rotate-180' : ''}`} />
                    </div>
                    
                    {/* 组内选项 */}
                    {expandedGroups[group.id] && group.items.length > 0 && (
                      <div className="pl-4 space-y-0.5 mt-0.5">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center px-3 py-1.5 text-sm cursor-pointer transition-colors rounded-md ${value === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
                            onClick={() => handleSelect(item.id)}
                          >
                            {highlightMatch(item.label, searchQuery)}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function CreateHumanReviewDialog({
  isOpen,
  onOpenChange,
  projectTitle,
  projectEthicsCommittee,
  onSubmit,
}: CreateHumanReviewDialogProps) {
  const router = useRouter();
  const [reviewType, setReviewType] = useState("");
  const [reviewMethod, setReviewMethod] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [ethicsCommittee, setEthicsCommittee] = useState(projectEthicsCommittee);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReviewFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setReviewType("");
    setReviewMethod("");
    setReviewDescription("");
    setReviewFile(null);
    setEthicsCommittee(projectEthicsCommittee);
    onOpenChange(false);
  };
  
  const handleSubmit = () => {
    // 准备项目信息参数
    const projectParams = `projectId=${encodeURIComponent(projectTitle)}`;
    
    // 如果有伦理委员会信息，添加到参数中
    const ethicsCommitteeParam = ethicsCommittee ? `&ethicsCommittee=${encodeURIComponent(ethicsCommittee)}` : '';
    
    // 添加更多可能的项目参数
    // 注意：在实际应用中，这些参数可能需要从项目详情API中获取
    const projectDetails = {
      projectSource: "院内立项",
      researchUnit: "医学研究院",
      projectType: "临床研究",
      leaderName: "李教授",
      department: "医学研究院"
    };
    
    // 构建完整的参数字符串
    const fullParams = `${projectParams}${ethicsCommitteeParam}` + 
      `&projectSource=${encodeURIComponent(projectDetails.projectSource)}` +
      `&researchUnit=${encodeURIComponent(projectDetails.researchUnit)}` +
      `&projectType=${encodeURIComponent(projectDetails.projectType)}` +
      `&leaderName=${encodeURIComponent(projectDetails.leaderName)}` +
      `&department=${encodeURIComponent(projectDetails.department)}`;
    
    // 如果选择了初始审查类型，导航到新增人体伦理初始审查页面
    if (reviewType === "initial") {
      console.log("导航到人体伦理初始审查页面");
      router.push(`/ethic-projects/review/human?${projectParams}${ethicsCommitteeParam}`);
      handleClose();
    } 
    // 如果选择了修正案审查，导航到新增人体伦理修正案审查页面
    else if (reviewType === "amendment") {
      console.log("导航到人体伦理修正案审查页面");
      router.push(`/ethic-projects/review/human/amendment?${projectParams}${ethicsCommitteeParam}`);
      handleClose();
    }
    // 如果选择了年度/定期审查，导航到新增人体伦理年度/定期审查页面
    else if (reviewType === "annual") {
      console.log("导航到人体伦理年度/定期审查页面");
      router.push(`/ethic-projects/review/human/annual?${projectParams}${ethicsCommitteeParam}`);
      handleClose();
    }
    // 如果选择了安全性审查，导航到新增人体伦理安全性审查页面
    else if (reviewType === "safety") {
      console.log("导航到人体伦理安全性审查页面");
      router.push(`/ethic-projects/review/human/safety?${projectParams}${ethicsCommitteeParam}`);
      handleClose();
    }
    // 添加偏离方案审查的路由跳转
    else if (reviewType === "deviation") {
      console.log("导航到人体伦理偏离方案审查页面");
      router.push(`/ethic-projects/review/human/deviation?${fullParams}`);
      handleClose();
    }
    // 添加暂停/终止研究审查的路由跳转
    else if (reviewType === "suspension") {
      console.log("导航到人体伦理暂停/终止研究审查页面");
      router.push(`/ethic-projects/review/human/suspension?${fullParams}`);
      handleClose();
    }
    // 添加研究完成审查的路由跳转
    else if (reviewType === "completion") {
      console.log("导航到人体伦理研究完成审查页面");
      router.push(`/ethic-projects/review/human/completion?${fullParams}`);
      handleClose();
    }
    // 添加人遗采集审批的路由跳转
    else if (reviewType === "collection") {
      console.log("导航到人体伦理人遗采集审批页面");
      // 为人遗采集审批定制项目类型
      const geneticParams = `${projectParams}${ethicsCommitteeParam}` + 
        `&projectSource=${encodeURIComponent(projectDetails.projectSource)}` +
        `&researchUnit=${encodeURIComponent(projectDetails.researchUnit)}` +
        `&projectType=${encodeURIComponent("人类遗传资源采集研究")}` +
        `&leaderName=${encodeURIComponent(projectDetails.leaderName)}` +
        `&department=${encodeURIComponent("遗传学研究所")}`;
      
      router.push(`/ethic-projects/review/human/genetic/collection?${geneticParams}`);
      handleClose();
    }
    // 添加人遗保藏审批的路由跳转
    else if (reviewType === "preservation") {
      console.log("导航到人体伦理人遗保藏审批页面");
      // 为人遗保藏审批定制项目类型
      const geneticParams = `${projectParams}${ethicsCommitteeParam}` + 
        `&projectSource=${encodeURIComponent(projectDetails.projectSource)}` +
        `&researchUnit=${encodeURIComponent(projectDetails.researchUnit)}` +
        `&projectType=${encodeURIComponent("人类遗传资源保藏研究")}` +
        `&leaderName=${encodeURIComponent(projectDetails.leaderName)}` +
        `&department=${encodeURIComponent("遗传学研究所")}`;
      
      router.push(`/ethic-projects/review/human/genetic/preservation?${geneticParams}`);
      handleClose();
    }
    // 添加国际合作科学研究审批的路由跳转
    else if (reviewType === "international_research") {
      console.log("导航到人体伦理国际合作科学研究审批页面");
      // 为国际合作科学研究审批定制项目类型
      const geneticParams = `${projectParams}${ethicsCommitteeParam}` + 
        `&projectSource=${encodeURIComponent(projectDetails.projectSource)}` +
        `&researchUnit=${encodeURIComponent(projectDetails.researchUnit)}` +
        `&projectType=${encodeURIComponent("人类遗传资源国际合作科学研究")}` +
        `&leaderName=${encodeURIComponent(projectDetails.leaderName)}` +
        `&department=${encodeURIComponent("遗传学研究所")}`;
      
      router.push(`/ethic-projects/review/human/genetic/international-research?${geneticParams}`);
      handleClose();
    }
    // 添加材料出境审批的路由跳转
    else if (reviewType === "export") {
      console.log("导航到人体伦理材料出境审批页面");
      // 为材料出境审批定制项目类型
      const geneticParams = `${projectParams}${ethicsCommitteeParam}` + 
        `&projectSource=${encodeURIComponent(projectDetails.projectSource)}` +
        `&researchUnit=${encodeURIComponent(projectDetails.researchUnit)}` +
        `&projectType=${encodeURIComponent("人类遗传资源材料出境研究")}` +
        `&leaderName=${encodeURIComponent(projectDetails.leaderName)}` +
        `&department=${encodeURIComponent("遗传学研究所")}`;
      
      router.push(`/ethic-projects/review/human/genetic/export?${geneticParams}`);
      handleClose();
    }
    // 添加国际合作临床试验备案的路由跳转
    else if (reviewType === "international_clinical") {
      console.log("导航到人体伦理国际合作临床试验备案页面");
      // 为国际合作临床试验备案定制项目类型
      const clinicalParams = `${projectParams}${ethicsCommitteeParam}` + 
        `&projectSource=${encodeURIComponent("国际合作项目")}` +
        `&researchUnit=${encodeURIComponent("临床医学研究中心")}` +
        `&projectType=${encodeURIComponent("人体国际合作临床试验")}` +
        `&leaderName=${encodeURIComponent(projectDetails.leaderName)}` +
        `&department=${encodeURIComponent("临床医学院")}`;
      
      router.push(`/ethic-projects/review/human/genetic/international-clinical?${clinicalParams}`);
      handleClose();
    }
    else {
      // 处理其他类型审查表单的逻辑
      console.log("提交人体伦理审查表单");
      onSubmit();
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>创建审查</DialogTitle>
          <DialogDescription>
            为项目 "{projectTitle}" 创建新的审查申请
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* 第一行：审查类型和审查方式 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviewType">
                审查类型
                <RequiredMark />
              </Label>
              <ReviewTypeSelect value={reviewType} onValueChange={setReviewType} />
            </div>
            
            <div>
              <Label htmlFor="reviewMethod">审查方式（选填）</Label>
              <Select
                value={reviewMethod}
                onValueChange={setReviewMethod}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="请选择审查方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">快速审查</SelectItem>
                  <SelectItem value="meeting">会议审查</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 伦理委员会 */}
          <div>
            <Label htmlFor="ethicsCommittee">伦理委员会（选填）</Label>
            <Select
              value={ethicsCommittee}
              onValueChange={(value) => setEthicsCommittee(value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="请选择伦理委员会" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="北京医学伦理委员会">北京医学伦理委员会</SelectItem>
                <SelectItem value="医学院伦理审查委员会">医学院伦理审查委员会</SelectItem>
                <SelectItem value="临床医学伦理委员会">临床医学伦理委员会</SelectItem>
                <SelectItem value="公共卫生伦理委员会">公共卫生伦理委员会</SelectItem>
                <SelectItem value="神经科学伦理委员会">神经科学伦理委员会</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 第二行：审查说明 */}
          <div>
            <Label htmlFor="reviewDescription">审查说明（选填）</Label>
            <Textarea
              id="reviewDescription"
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              placeholder="请输入审查说明..."
              className="mt-2"
              rows={4}
            />
          </div>
          
          {/* 第三行：说明附件 */}
          <div>
            <Label htmlFor="reviewFile">说明附件（选填）</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all hover:border-blue-400 bg-gray-50/50">
              <div className="flex flex-col items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="text-sm text-center">
                  <p className="font-medium text-gray-700">点击或拖拽文件到此区域</p>
                  <p className="text-gray-500 text-xs mt-1">支持PDF、Word、Excel等格式文件</p>
                </div>
                <Input
                  id="reviewFile"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => document.getElementById('reviewFile')?.click()}
                >
                  选择文件
                </Button>
              </div>
              {reviewFile && (
                <div className="mt-3 p-2 bg-blue-50 rounded-md flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700 truncate">{reviewFile.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto h-6 w-6 p-0" 
                    onClick={() => setReviewFile(null)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-gray-300 hover:bg-gray-50">
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reviewType}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white",
              !reviewType && "opacity-50 cursor-not-allowed"
            )}
          >
            开始创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 