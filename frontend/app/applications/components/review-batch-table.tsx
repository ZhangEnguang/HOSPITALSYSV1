import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Play,
  Edit,
  Trash,
  Users,
  FileText,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationItem } from '../types';

// 使用类型定义颜色映射
const applicationTypeColors: Record<string, 'default' | 'secondary' | 'outline'> = {
  '科研': 'default',
  '教学': 'secondary',
  '其他': 'outline'
};

const applicationStatusColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  '待审核': 'secondary',
  '审核中': 'default',
  '已通过': 'outline',
  '已拒绝': 'destructive',
  '未开始': 'secondary',
  '进行中': 'default',
  '已结束': 'outline',
};

interface ReviewBatchTableProps {
  items: ApplicationItem[];
  batchProjects: Record<string, any[]>;
  expandedBatches: Record<string, boolean>;
  onToggleBatchExpand: (batchId: string, e?: React.MouseEvent) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  onStartStop: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAssignExperts: (item: any) => void;
  onOpinionSummary: (item: any) => void;
  onView: (item: any) => void;
  onDeleteProject: (item: any) => void;
}

export const ReviewBatchTable: React.FC<ReviewBatchTableProps> = ({
  items,
  batchProjects,
  expandedBatches,
  onToggleBatchExpand,
  selectedRows,
  setSelectedRows,
  onStartStop,
  onEdit,
  onDelete,
  onAssignExperts,
  onOpinionSummary,
  onView,
  onDeleteProject,
}) => {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedRows.length === items.length && items.length > 0}
                    ref={(input) => {
                      if (input) {
                        (input as any).indeterminate = selectedRows.length > 0 && selectedRows.length < items.length;
                      }
                    }}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRows(items.map((item) => item.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    aria-label="全选"
                  />
                </TableHead>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-medium">评审批次名称</TableHead>
                <TableHead className="font-medium">评审类型</TableHead>
                <TableHead className="font-medium">评审方案</TableHead>
                <TableHead className="font-medium">评审状态</TableHead>
                <TableHead className="font-medium">进度</TableHead>
                <TableHead className="font-medium">评审开始日期</TableHead>
                <TableHead className="font-medium">评审结束日期</TableHead>
                <TableHead className="font-medium">评审数量</TableHead>
                <TableHead className="text-right font-medium">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="group hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRows([...selectedRows, item.id]);
                          } else {
                            setSelectedRows(selectedRows.filter((id) => id !== item.id));
                          }
                        }}
                        aria-label={`选择 ${item.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => onToggleBatchExpand(item.id, e)}
                      >
                        {expandedBatches[item.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={applicationTypeColors[item.type]}>{item.type}</Badge>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {(() => {
                        const now = new Date();
                        const startDate = new Date(item.date);
                        const endDate = new Date(item.deadline);
                        
                        let status = "未开始";
                        if (now > endDate) {
                          status = "已结束";
                        } else if (now >= startDate) {
                          status = "进行中";
                        }
                        
                        return <Badge variant={applicationStatusColors[status]}>{status}</Badge>;
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="w-[160px] space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">进度</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(item.date), "yyyy/MM/dd")}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{format(new Date(item.deadline), "yyyy/MM/dd")}</span>
                        {(() => {
                          const deadline = new Date(item.deadline);
                          const now = new Date();
                          const daysLeft = Math.ceil(
                            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                          );
                          
                          return daysLeft > 0 ? (
                            <span className={`text-xs ${daysLeft <= 7 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                              剩余 {daysLeft} 天
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/applications/review-projects?batch=${item.batchNumber}`);
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        {item.projectCount || 0}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onStartStop(item)}>
                            {(() => {
                              const now = new Date();
                              const startDate = new Date(item.date);
                              const endDate = new Date(item.deadline);
                              
                              let actionText = "启动批次";
                              if (now >= startDate && now <= endDate) {
                                actionText = "停止批次";
                              }
                              
                              return (
                                <>
                                  {actionText === "启动批次" ? (
                                    <Play className="mr-2 h-4 w-4" />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-2 h-4 w-4"
                                    >
                                      <rect x="6" y="4" width="4" height="16"></rect>
                                      <rect x="14" y="4" width="4" height="16"></rect>
                                    </svg>
                                  )}
                                  {actionText}
                                </>
                              );
                            })()}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑批次
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="text-destructive focus:bg-destructive/10"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            删除批次
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {/* 子项目列表 */}
                  {expandedBatches[item.id] && batchProjects[item.id] && (
                    <TableRow>
                      <TableCell colSpan={12} className="p-0">
                        <div className="p-4 bg-muted/30">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[300px]">项目名称</TableHead>
                                <TableHead>负责人</TableHead>
                                <TableHead>所属部门</TableHead>
                                <TableHead>金额（万元）</TableHead>
                                <TableHead>评审专家</TableHead>
                                <TableHead>评审进度</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {batchProjects[item.id]?.map((project) => (
                                <TableRow key={project.id}>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{project.name}</span>
                                      <span className="text-sm text-muted-foreground line-clamp-1">
                                        {project.description}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{project.manager.name}</TableCell>
                                  <TableCell>{project.manager.department}</TableCell>
                                  <TableCell>{project.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</TableCell>
                                  <TableCell>
                                    {project.experts && project.experts.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {project.experts.map((expert: any, index: number) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {expert.name}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground text-sm">待分配专家</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="w-[160px] space-y-2">
                                      <Progress value={project.progress} className="h-2" />
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">进度</span>
                                        <span>{project.progress}%</span>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onAssignExperts(project)}>
                                          <Users className="mr-2 h-4 w-4" />
                                          分派专家
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onOpinionSummary(project)}>
                                          <FileText className="mr-2 h-4 w-4" />
                                          意见汇总
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onView(project)}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          查看项目
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDeleteProject(project)} className="text-destructive focus:bg-destructive/10">
                                          <Trash className="mr-2 h-4 w-4" />
                                          删除项目
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewBatchTable; 