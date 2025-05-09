"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, CircleAlert, FileCheck, Calendar, FilePlus, RotateCcw, ChevronRight, AlertTriangle, ChevronDown, ChevronUp, Check, Bell, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// 导入新的自定义组件
import { ReviewTimelineCard as ReviewCard, AnimationStyles } from "./review-progress-card"

// 简化版审查流程卡片组件 - 模拟截图中的样式
const ReviewTimelineCard = ({ 
  review, 
  type = "progress",
  getDocumentStatusColor 
}: { 
  review: any, 
  type?: "progress" | "completed",
  getDocumentStatusColor: (status: string) => string 
}) => {
  // 默认收起状态
  const [expanded, setExpanded] = useState(false);
  // 督办提醒状态
  const [hasReminder, setHasReminder] = useState(false);
  // 催办对话框状态
  const [isUrgeDialogOpen, setIsUrgeDialogOpen] = useState(false);
  // 督办提醒对话框状态
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  // 催办/督办备注
  const [operationNote, setOperationNote] = useState("");
  // 督办提醒日期
  const [reminderDate, setReminderDate] = useState<string>(
    // 默认为预计完成日期前3天
    (() => {
      if (type === "progress") {
        const date = new Date(review.expectedCompletionDate);
        date.setDate(date.getDate() - 3);
        return date.toISOString().split('T')[0];
      }
      return "";
    })()
  );
  
  const toggleExpand = () => setExpanded(prev => !prev);
  
  // 处理督办提醒
  const handleReminder = () => {
    setIsReminderDialogOpen(true);
  };
  
  // 确认设置督办提醒
  const confirmReminder = () => {
    setHasReminder(true);
    setIsReminderDialogOpen(false);
    
    // 模拟提交督办提醒请求
    toast({
      title: "督办提醒已设置",
      description: `已为"${review.type}"设置督办提醒，提醒日期: ${reminderDate}`,
      variant: "default"
    });
  };
  
  // 取消督办提醒
  const cancelReminder = () => {
    if (hasReminder) {
      setHasReminder(false);
      toast({
        title: "督办提醒已取消",
        description: `已取消"${review.type}"的督办提醒`,
        variant: "default"
      });
    } else {
      setIsReminderDialogOpen(false);
    }
  };
  
  // 处理催办
  const handleUrge = () => {
    setIsUrgeDialogOpen(true);
  };
  
  // 确认催办
  const confirmUrge = () => {
    setIsUrgeDialogOpen(false);
    
    // 模拟提交催办请求
    toast({
      title: "催办已发送",
      description: `已向"${review.currentStep}"相关人员发送催办，备注: ${operationNote || '无'}`,
      variant: "default"
    });
    
    // 重置备注
    setOperationNote("");
  };
  
  const borderColor = type === "progress" ? "border-blue-500" : "border-green-500";
  const badgeColor = type === "progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700";
  const titleColor = type === "progress" ? "text-blue-700" : "text-green-700";
  
  // 获取最新的审查历史记录（仅在收起状态下显示）
  const latestHistory = review.reviewHistory.length > 0 
    ? review.reviewHistory[review.reviewHistory.length - 1] 
    : null;

  // 计算审查流程的时间跨度
  const startDate = new Date(review.submittedDate);
  const endDate = type === "progress" 
    ? new Date(review.expectedCompletionDate)
    : new Date(review.completedDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = type === "progress"
    ? Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : totalDays;
  
  return (
    <>
      <div className={`bg-white border mt-4 rounded-lg shadow-sm overflow-hidden ${expanded ? 'shadow-md' : 'hover:bg-gray-50'} transition-all duration-300`}>
        <div className={`border-l-4 ${borderColor} p-4`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-base font-medium text-gray-800">{review.type}</h3>
              <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded ${badgeColor}`}>
                {type === "progress" ? "审核中" : "已通过"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">提交日期: {review.submittedDate}</span>
                {type === "progress" ? (
                  <span>预计完成: {review.expectedCompletionDate}</span>
                ) : (
                  <span>完成日期: {review.completedDate}</span>
                )}
              </div>
              <button 
                onClick={toggleExpand}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={expanded ? "收起详情" : "展开详情"}
              >
                {expanded ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
            </div>
          </div>
          
          {type === "progress" && (
            <div className="my-3">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium">当前步骤: <span className={titleColor}>{review.currentStep}</span></span>
                <span className={titleColor}>{review.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <div className={`h-full ${type === "progress" ? "bg-blue-500" : "bg-green-500"} rounded-full animate-pulse-slow`} 
                  style={{width: `${review.progress}%`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent animate-shimmer"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>已用时间: {elapsedDays} 天</span>
                <span>总计: {totalDays} 天</span>
              </div>
            </div>
          )}
          
          {/* 收起状态下显示简单时间线和快速操作 */}
          {!expanded && (
            <div className="flex justify-between items-center mt-3">
              {latestHistory && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${type === "progress" ? "bg-blue-500" : "bg-green-500"} mr-2`}></div>
                  <div>最新进展: {latestHistory.action} ({latestHistory.date})</div>
                </div>
              )}
              
              {type === "progress" && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={hasReminder ? cancelReminder : handleReminder}
                    className={`flex items-center text-xs px-2 py-1 rounded border transition-colors ${
                      hasReminder 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {hasReminder ? (
                      <>
                        <Bell className="h-3.5 w-3.5 mr-1" />
                        已设置提醒
                      </>
                    ) : (
                      <>
                        <Bell className="h-3.5 w-3.5 mr-1" />
                        督办提醒
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleUrge}
                    className="flex items-center text-xs px-2 py-1 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    催办
                  </button>
                </div>
              )}
            </div>
          )}
          
          {expanded && (
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <Clock className={`h-4 w-4 mr-2 ${type === "progress" ? "text-blue-600" : "text-green-600"}`} />
                <h4 className="text-sm font-medium text-gray-700">审查进程时间线</h4>
              </div>
              
              <div className="relative ml-3">
                {/* 垂直连接线 */}
                <div className={`absolute left-[7px] top-0 bottom-0 w-0.5 ${type === "progress" ? "bg-blue-200" : "bg-green-200"}`}></div>
                
                {/* 流程步骤 */}
                {review.reviewHistory.map((history: any, idx: number) => (
                  <div key={idx} className="flex mb-6 relative">
                    <div className={`rounded-full w-3.5 h-3.5 ${type === "progress" ? "bg-blue-500" : "bg-green-500"} z-10 mt-1 flex-shrink-0`}></div>
                    <div className="ml-4 w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{history.action}</span>
                        <span className="text-xs text-gray-500">{history.date}</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">操作人: {history.operator}</div>
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                        {history.comments}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 预计下一步 */}
                {type === "progress" && (
                  <div className="flex mb-6 relative">
                    <div className="rounded-full w-3.5 h-3.5 border-2 border-dashed border-blue-300 bg-white z-10 mt-1 flex-shrink-0"></div>
                    <div className="ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">预计下一步: 委员会审核</span>
                        <span className="text-xs text-gray-500">预计时间: 2024-04-10</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 完成标记 */}
                {type === "completed" && (
                  <div className="flex relative">
                    <div className="rounded-full w-3.5 h-3.5 bg-green-500 z-10 mt-1 flex-shrink-0 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-green-600">审查完成</span>
                        <span className="text-xs text-gray-500">{review.completedDate}</span>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        审查结果: {review.result}
                      </div>
                      {review.remarks && (
                        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm border border-green-100">
                          <p className="font-medium mb-1 text-green-800">审查意见:</p>
                          <p className="text-gray-700">{review.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 文档列表 */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <FilePlus className={`h-4 w-4 mr-2 ${type === "progress" ? "text-blue-600" : "text-green-600"}`} />
                  审查文档 ({review.documents.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {review.documents.map((doc: any, idx: number) => (
                    <div key={idx} className="text-sm flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center">
                        <FileCheck className="h-4 w-4 text-gray-400 mr-2 group-hover:text-blue-500 transition-colors" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={getDocumentStatusColor(doc.status)}>{doc.status}</span>
                        <button className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all">
                          <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">提交人: <span className="font-medium">{review.submittedBy}</span></div>
                <div className="flex items-center gap-2">
                  {/* 导出记录按钮 */}
                  <button className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded border border-gray-200 transition-colors flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    导出记录
                  </button>
                  <button className={`text-xs ${type === "progress" ? "text-blue-600 hover:text-blue-700" : "text-green-600 hover:text-green-700"} flex items-center`}>
                    {type === "progress" ? "查看详情" : "查看审查报告"} <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 督办提醒对话框 */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>设置督办提醒</DialogTitle>
            <DialogDescription>
              设置提醒日期，系统将在指定日期发送督办提醒通知
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderDate" className="text-right">
                提醒日期
              </Label>
              <input
                id="reminderDate"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="col-span-3 p-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
                max={review.expectedCompletionDate}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderNote" className="text-right">
                提醒备注
              </Label>
              <Textarea
                id="reminderNote"
                placeholder="添加督办提醒备注（可选）"
                value={operationNote}
                onChange={(e) => setOperationNote(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelReminder}>
              取消
            </Button>
            <Button onClick={confirmReminder}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 催办对话框 */}
      <Dialog open={isUrgeDialogOpen} onOpenChange={setIsUrgeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>审查催办</DialogTitle>
            <DialogDescription>
              向当前负责"{ review.currentStep }"的相关人员发送催办通知
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urgeNote" className="text-right">
                催办说明
              </Label>
              <Textarea
                id="urgeNote"
                placeholder="请填写催办原因（可选）"
                value={operationNote}
                onChange={(e) => setOperationNote(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUrgeDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmUrge}>确认催办</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 审查进度标签页组件
export default function ReviewProgressTab() {
  // 扩展的审查数据模拟
  const reviewData = {
    inProgress: [
      {
        id: "1",
        type: "伦理初审",
        status: "审核中",
        submittedDate: "2024-03-15",
        expectedCompletionDate: "2024-04-15",
        submittedBy: "王教授",
        currentStep: "专家评审",
        progress: 40,
        reviewHistory: [
          { date: "2024-03-15", action: "提交申请", operator: "王教授", comments: "提交动物实验伦理审查申请" },
          { date: "2024-03-18", action: "形式审查", operator: "张秘书", comments: "材料齐全，符合形式要求" },
          { date: "2024-03-25", action: "专家分配", operator: "李主任", comments: "已分配3位专家进行评审" },
          { date: "2024-04-02", action: "专家评审", operator: "系统", comments: "2/3专家已提交评审意见" }
        ],
        documents: [
          { name: "伦理审查申请表", uploadDate: "2024-03-15", status: "已审阅" },
          { name: "实验方案详细说明", uploadDate: "2024-03-15", status: "已审阅" },
          { name: "动物来源证明", uploadDate: "2024-03-15", status: "待审阅" }
        ]
      },
      {
        id: "2",
        type: "安全审查",
        status: "审核中",
        submittedDate: "2024-03-20",
        expectedCompletionDate: "2024-04-10",
        submittedBy: "李助理",
        currentStep: "初步审核",
        progress: 25,
        reviewHistory: [
          { date: "2024-03-20", action: "提交申请", operator: "李助理", comments: "提交动物实验安全审查申请" },
          { date: "2024-03-22", action: "材料接收", operator: "安全部门", comments: "材料已接收，等待审核" },
          { date: "2024-03-28", action: "初步审核", operator: "刘安全员", comments: "初步审核中，已完成材料检查" }
        ],
        documents: [
          { name: "实验室安全评估表", uploadDate: "2024-03-20", status: "审核中" },
          { name: "危险品使用申报", uploadDate: "2024-03-20", status: "待审核" }
        ]
      }
    ],
    completed: [
      {
        id: "3",
        type: "实验前评估",
        status: "已通过",
        submittedDate: "2024-02-10",
        completedDate: "2024-02-25",
        submittedBy: "王教授",
        result: "批准",
        remarks: "符合实验标准，建议严格遵循3R原则",
        reviewHistory: [
          { date: "2024-02-10", action: "提交申请", operator: "王教授", comments: "提交实验前评估申请" },
          { date: "2024-02-12", action: "形式审查", operator: "技术部门", comments: "资料完整，符合要求" },
          { date: "2024-02-18", action: "专家评审", operator: "赵专家", comments: "符合动物福利要求" },
          { date: "2024-02-25", action: "评审完成", operator: "委员会", comments: "全体专家一致通过" }
        ],
        documents: [
          { name: "实验设计方案", uploadDate: "2024-02-10", status: "已通过" },
          { name: "3R原则执行计划", uploadDate: "2024-02-10", status: "已通过" }
        ]
      },
      {
        id: "4",
        type: "设施条件审查",
        status: "已通过",
        submittedDate: "2024-01-20",
        completedDate: "2024-02-05",
        submittedBy: "张技术员",
        result: "批准",
        remarks: "实验设施符合动物实验标准",
        reviewHistory: [
          { date: "2024-01-20", action: "提交申请", operator: "张技术员", comments: "提交设施条件审查申请" },
          { date: "2024-01-25", action: "实地考察", operator: "考察小组", comments: "已完成设施实地考察" },
          { date: "2024-02-05", action: "审核通过", operator: "主任", comments: "设施条件符合标准要求" }
        ],
        documents: [
          { name: "设施平面图", uploadDate: "2024-01-20", status: "已通过" },
          { name: "环境监测报告", uploadDate: "2024-01-20", status: "已通过" }
        ]
      }
    ]
  }

  // 按审查类型统计
  const reviewTypeStats = {
    initialReview: {
      total: 2,
      completed: 1,
      inProgress: 1
    },
    followupReview: {
      total: 2,
      completed: 1,
      inProgress: 1
    }
  }

  // 统计信息
  const totalReviews = reviewData.inProgress.length + reviewData.completed.length
  const progressPercentage = (reviewData.completed.length / totalReviews) * 100

  // 状态颜色映射
  const getStatusColor = (status: string) => {
    switch(status) {
      case "审核中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "已通过":
        return "bg-green-50 text-green-700 border-green-200"
      case "已驳回":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // 文档状态颜色映射
  const getDocumentStatusColor = (status: string) => {
    switch(status) {
      case "已通过":
      case "已审阅":
        return "text-green-600"
      case "审核中":
        return "text-blue-600"
      case "待审核":
        return "text-amber-600"
      case "需修改":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // 处理审查卡片上的"督办提醒"按钮
  const handleReminderButtonClick = (reviewId: string) => {
    toast({
      title: "督办提醒",
      description: `已设置对审查ID: ${reviewId} 的督办提醒`,
      variant: "default"
    });
  };
  
  // 处理审查卡片上的"催办"按钮
  const handleUrgeButtonClick = (reviewId: string) => {
    toast({
      title: "催办成功",
      description: `已向审查ID: ${reviewId} 的处理人员发送催办通知`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <AnimationStyles />
      {/* 审查统计卡片 */}
      <div className="flex gap-6 mb-6">
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 w-full h-full">
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-blue-500/5"></div>
          <div className="p-4 z-10 relative">
            <div className="flex items-center mb-2">
              <div className="rounded-full p-1.5 bg-blue-100 mr-2 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-800">进行中审查</h3>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-blue-600 mr-3 group-hover:scale-105 origin-left transition-transform duration-300">{reviewData.inProgress.length}</span>
                <span className="text-xs text-gray-500">
                  初审：{reviewTypeStats.initialReview.inProgress} · 复审：{reviewTypeStats.followupReview.inProgress}
                </span>
              </div>
              <div className="text-xs mt-1 text-gray-500">
                当前正在进行的审查流程
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-gradient-to-br from-green-50 to-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 w-full h-full">
              <path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-green-500/5"></div>
          <div className="p-4 z-10 relative">
            <div className="flex items-center mb-2">
              <div className="rounded-full p-1.5 bg-green-100 mr-2 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-800">已完成审查</h3>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-green-600 mr-3 group-hover:scale-105 origin-left transition-transform duration-300">{reviewData.completed.length}</span>
                <span className="text-xs text-gray-500">
                  初审：{reviewTypeStats.initialReview.completed} · 复审：{reviewTypeStats.followupReview.completed}
                </span>
              </div>
              <div className="text-xs mt-1 text-gray-500">
                已完成的审查流程
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-600 w-full h-full">
              <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-amber-500/5"></div>
          <div className="p-4 z-10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="rounded-full p-1.5 bg-amber-100 mr-2 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v8m-8-4h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-800">审查总数</h3>
              </div>
              <div className="text-sm font-semibold text-amber-600">{progressPercentage.toFixed(0)}%</div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline mb-2">
                <span className="text-2xl font-bold text-amber-600 mr-3 group-hover:scale-105 origin-left transition-transform duration-300">{totalReviews}</span>
                <span className="text-xs text-gray-500">
                  初审：{reviewTypeStats.initialReview.total} · 复审：{reviewTypeStats.followupReview.total}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1 relative">
                <div className="h-full bg-amber-500 rounded-full animate-pulse-slow" style={{width: `${progressPercentage}%`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent animate-shimmer"></div>
              </div>
              <div className="text-xs text-gray-500">
                已完成 {reviewData.completed.length}/{totalReviews} 项审查
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 审查详情标签页 */}
      <Tabs defaultValue="inProgress" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="p-1 bg-gray-100 rounded-lg">
            <TabsTrigger value="inProgress" className="rounded-md py-1.5 px-4">
              进行中 ({reviewData.inProgress.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-md py-1.5 px-4">
              已完成 ({reviewData.completed.length})
            </TabsTrigger>
        </TabsList>
        
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-lg flex p-1 text-sm">
                <button className="px-3 py-1 rounded-md bg-white shadow-sm font-medium text-gray-800">全部</button>
                <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50">初始审查</button>
                <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50">复审</button>
                      </div>
                    </div>
                    
            <select className="text-xs h-8 border rounded-md px-2 bg-white text-gray-600">
              <option>全部时间</option>
              <option>最近一周</option>
              <option>最近一月</option>
              <option>最近三月</option>
            </select>
                      </div>
                    </div>
                    
        {/* 进行中的审查 */}
        <TabsContent value="inProgress" className="mt-0">
          <div>
            {reviewData.inProgress.length > 0 ? (
              reviewData.inProgress.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  type="progress" 
                  getDocumentStatusColor={getDocumentStatusColor}
                />
                ))
              ) : (
              <div className="text-center py-12 bg-white border rounded-lg flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-amber-400 mb-2" />
                <p className="text-gray-600">暂无进行中的审查</p>
              </div>
              )}
          </div>
        </TabsContent>
        
        {/* 已完成的审查 */}
        <TabsContent value="completed" className="mt-0">
          <div>
              {reviewData.completed.length > 0 ? (
                reviewData.completed.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  type="completed" 
                  getDocumentStatusColor={getDocumentStatusColor}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white border rounded-lg flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-amber-400 mb-2" />
                <p className="text-gray-600">暂无已完成的审查</p>
                      </div>
                    )}
                  </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 