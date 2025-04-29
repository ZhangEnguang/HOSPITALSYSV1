import React from "react";
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
  Bookmark
} from "lucide-react";
import { RatIcon, MouseIcon, RabbitIcon, MonkeyIcon } from "./animal-icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  let humanFacilityUnit = item.实施单位 || item.facilityUnit || "内科学系";
  
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
        <CardHeader className={cn("p-4", getHeaderBgColor())}>
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
        <CardContent className="px-4 py-3 pt-0">
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
                    <span className="text-gray-600 flex-shrink-0">项目类型:</span>
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
                    <span className="text-gray-600 flex-shrink-0">实施单位:</span>
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
            size="sm" 
            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              const editAction = actions.find(a => a.id === "edit");
              if (editAction) editAction.onClick(item, e);
            }}
          >
            创建审查
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 