import React, { useState, useEffect } from "react";
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
  AlertTriangle
} from "lucide-react";
import { RatIcon, MouseIcon, RabbitIcon, MonkeyIcon } from "./animal-icons";
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
  progressField?: string;
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
  switch (animalType.toLowerCase()) {
    case "大鼠":
      return <RatIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    case "小鼠":
      return <MouseIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    case "兔子":
      return <RabbitIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    case "猴子":
      return <MonkeyIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    default:
      return <PawPrint className="h-4 w-4 text-blue-500 flex-shrink-0" />;
  }
};

// 修改Dialog组件的样式，使遮罩层更透明
// 添加这个样式到您的全局CSS中（可以在组件中导入或在样式文件中定义）
const dialogOverlayStyles = {
  backgroundColor: "rgba(0, 0, 0, 0.4)" // 调整为更透明的黑色
};

export default function EthicProjectCard({
  item,
  actions = [],
  fields = [],
  titleField,
  descriptionField,
  statusField,
  statusVariants = {},
  progressField,
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

  // 根据项目名称判断，设置合适的动物种类和数量
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
  
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [reviewType, setReviewType] = useState("");
  const [reviewMethod, setReviewMethod] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("normal");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySMS, setNotifySMS] = useState(false);
  
  useEffect(() => {
    if (reviewMethod && urgencyLevel) {
      // 根据审查方式和紧急程度计算预计审查周期
      let duration = "";
      if (reviewMethod === "fast") {
        duration = urgencyLevel === "normal" ? "3-5 天" : "2-3 天";
      } else {
        duration = urgencyLevel === "normal" ? "7-10 天" : "5-7 天";
      }
      setEstimatedDuration(duration);
    }
  }, [reviewMethod, urgencyLevel]);
  
  const getUrgencyBadge = () => {
    switch (urgencyLevel) {
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">紧急</Badge>;
      case "urgent":
        return <Badge className="bg-red-500 hover:bg-red-600">特急</Badge>;
      default:
        return null;
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReviewFile(e.target.files[0]);
    }
  };
  
  const handleCloseReviewDialog = () => {
    setIsCreateReviewOpen(false);
    setReviewType("");
    setReviewMethod("");
    setUrgencyLevel("normal");
    setEstimatedDuration("");
    setReviewDescription("");
    setReviewFile(null);
    setNotifyEmail(false);
    setNotifySMS(false);
  };
  
  const handleSubmitReview = () => {
    // 处理提交审查表单的逻辑
    console.log("提交审查表单");
    handleCloseReviewDialog();
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
          "flex flex-col h-full overflow-hidden shadow-sm border-l-4 cursor-pointer group relative",
          getBorderColor(),
          selected ? "ring-2 ring-primary" : "",
          className
        )}
      >
        <CardHeader className={cn("flex justify-between space-y-0 py-3 px-4", getHeaderBgColor())}>
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
              {description && <p className="text-sm text-muted-foreground truncate mt-1">{description}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-3 flex-grow">
          <div className="grid gap-3">
            <div className="grid grid-cols-1 gap-2">
              {type === "animal" ? (
                // 动物伦理卡片字段
                <>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    {getAnimalIcon(animalType)}
                    <span className="text-gray-600 flex-shrink-0">动物种系:</span>
                    <span className="font-medium truncate">{animalType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">动物数量:</span>
                    <span className="font-medium truncate">{animalCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">伦理委员会:</span>
                    <span className="font-medium truncate">{ethicsCommittee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <BriefcaseMedical className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">动物实施设备单位:</span>
                    <span className="font-medium truncate">{facilityUnit}</span>
                  </div>
                </>
              ) : (
                // 人体伦理卡片字段
                <>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <Tag className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">研究类型:</span>
                    <span className="font-medium truncate">{projectType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <Bookmark className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">项目来源:</span>
                    <span className="font-medium truncate">{projectSource}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">伦理委员会:</span>
                    <span className="font-medium truncate">{ethicsCommittee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <BriefcaseMedical className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 flex-shrink-0">研究单位:</span>
                    <span className="font-medium truncate">{humanFacilityUnit}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-1">
              <div className="flex items-center gap-2 text-sm">
                <ClipboardList className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600">进行中:</span>
                <span className="font-medium text-blue-600">{inProgressCount}</span>
                <span className="text-gray-600 ml-4">已完成:</span>
                <span className="font-medium text-green-600">{completedCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-4 pt-2 gap-2 bg-gray-50/60">
          <Button 
            variant="default" 
            size="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-2.5 shadow-lg transition-all duration-300 hover:shadow-xl rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateReviewOpen(true);
            }}
          >
            <FileText className="h-5 w-5 mr-2" />
            创建审查
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
        
        {/* 更多操作下拉菜单 */}
        <DropdownMenu>
          {/* ... existing code ... */}
        </DropdownMenu>
        
        {/* 创建审查对话框 */}
        <Dialog open={isCreateReviewOpen} onOpenChange={setIsCreateReviewOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>创建审查</DialogTitle>
              <DialogDescription>
                为项目 "{title}" 创建新的审查申请
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* 第一行：审查类型和审查方式 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reviewType">审查类型</Label>
                  <Select
                    value={reviewType}
                    onValueChange={setReviewType}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="请选择审查类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">初次审查</SelectItem>
                      <SelectItem value="amendment">修订审查</SelectItem>
                      <SelectItem value="continuation">延续审查</SelectItem>
                      <SelectItem value="expedited">加急审查</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reviewMethod">审查方式</Label>
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
              
              {/* 第二行：紧急程度和审查通知 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>紧急程度</Label>
                  <RadioGroup
                    value={urgencyLevel}
                    onValueChange={setUrgencyLevel}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="cursor-pointer">常规</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="cursor-pointer text-orange-600 font-medium">紧急</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent" className="cursor-pointer text-red-600 font-medium">特急</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>审查通知</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-notify" 
                        checked={notifyEmail} 
                        onCheckedChange={(checked) => setNotifyEmail(checked as boolean)} 
                      />
                      <Label htmlFor="email-notify" className="cursor-pointer">接收邮件通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sms-notify" 
                        checked={notifySMS} 
                        onCheckedChange={(checked) => setNotifySMS(checked as boolean)} 
                      />
                      <Label htmlFor="sms-notify" className="cursor-pointer">接收短信通知</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 预计审查周期 */}
            {estimatedDuration && (
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4 flex items-start gap-3 border border-blue-200 shadow-sm">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 flex items-center gap-2">
                    预计审查周期
                    {urgencyLevel !== "normal" && <span className="ml-1">{getUrgencyBadge()}</span>}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {reviewMethod === "fast" ? "快速审查" : "会议审查"}：<span className="font-semibold">{estimatedDuration}</span>
                  </p>
                  <p className="text-xs text-blue-600/80 mt-1.5 italic">
                    {urgencyLevel === "normal" 
                      ? "常规审查流程，按标准时间处理" 
                      : urgencyLevel === "high" 
                        ? "紧急申请将优先安排审查" 
                        : "特急申请将立即安排审查"}
                  </p>
                </div>
              </div>
            )}
            
            {/* 第三行：审查说明 */}
            <div>
              <Label htmlFor="reviewDescription">审查说明</Label>
              <Textarea
                id="reviewDescription"
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
                placeholder="请输入审查说明..."
                className="mt-2"
                rows={4}
              />
            </div>
            
            {/* 第四行：说明附件 */}
            <div>
              <Label htmlFor="reviewFile">说明附件</Label>
              <Input
                id="reviewFile"
                type="file"
                onChange={handleFileChange}
                className="mt-2"
              />
              {reviewFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  已选择: {reviewFile.name}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReviewDialog} className="border-gray-300 hover:bg-gray-50">
              取消
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewType || !reviewMethod}
              className={cn(
                "bg-blue-600 hover:bg-blue-700 text-white",
                (!reviewType || !reviewMethod) && "opacity-50 cursor-not-allowed"
              )}
            >
              开始创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 