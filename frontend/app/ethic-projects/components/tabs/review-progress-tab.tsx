"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Clock, CheckCircle, ChevronDown, ChevronUp, Bell, AlertCircle, Check, FileCheck, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// 导入新的自定义组件
import { ReviewTimelineCard as ReviewCard, AnimationStyles } from "./review-progress-card"

// 简化版审查流程卡片组件 - 模拟截图中的样式
const ReviewTimelineCard = ({ 
  review, 
  type = "progress",
  getDocumentStatusColor,
  index = 0
}: { 
  review: any, 
  type?: "progress" | "completed",
  getDocumentStatusColor: (status: string) => string,
  index?: number
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
                  <FileCheck className={`h-4 w-4 mr-2 ${type === "progress" ? "text-blue-600" : "text-green-600"}`} />
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
export default function ReviewProgressTab({ projectId, projectType = "animal" }: { projectId?: string; projectType?: "animal" | "human" }) {
  
  // 模拟正在进行的审查数据
  const inProgressReviews = [
      {
        id: "1",
      type: projectType === "human" ? "伦理委员会初步审查" : "动物实验伦理审查",
      submittedDate: "2024-01-20",
      expectedCompletionDate: "2024-02-25",
      currentStep: "专家评审",
      progress: 75,
        status: "审核中",
      reviewer: "医学院伦理审查委员会",
        submittedBy: "王教授",
        reviewHistory: [
        {
          action: "提交申请",
          date: "2024-01-20",
          operator: "王教授",
          comments: projectType === "human" ? "提交人体伦理项目初审申请" : "提交动物实验伦理项目初审申请"
        },
        {
          action: "形式审查",
          date: "2024-01-22",
          operator: "李审查员",
          comments: "项目申请资料完整性检查通过"
        },
        {
          action: "指定专家评审",
          date: "2024-01-25",
          operator: "张主任",
          comments: projectType === "human" 
            ? "分配2名伦理学专家和1名临床专家进行评审"
            : "分配2名动物福利专家和1名实验设计专家进行评审"
        },
        {
          action: "专家评审中",
          date: "2024-02-05",
          operator: "系统",
          comments: "已收到2名专家的评审意见，等待1名专家完成评审"
        }
        ],
        documents: [
        {
          name: projectType === "human" ? "项目申请表.pdf" : "动物实验申请表.pdf",
          status: "已审核",
          submittedDate: "2024-01-20",
          reviewedDate: "2024-01-22",
          uploadDate: "2024-01-20"
      },
      {
          name: projectType === "human" ? "研究方案.pdf" : "实验方案.pdf",
        status: "审核中",
          submittedDate: "2024-01-20",
          reviewedDate: "",
          uploadDate: "2024-01-20"
        },
        {
          name: projectType === "human" ? "知情同意书.docx" : "动物福利保障措施.docx",
          status: "审核中",
          submittedDate: "2024-01-20",
          reviewedDate: "",
          uploadDate: "2024-01-20"
        }
        ]
      }
  ]
  
  // 模拟已完成的审查数据
  const completedReviews = [
      {
      id: "2",
      type: "科研处项目备案审核",
      submittedDate: "2023-12-10",
      completedDate: "2023-12-20",
      progress: 100,
      status: "审核通过",
      reviewer: "科研处",
        submittedBy: "王教授",
        reviewHistory: [
        {
          action: "提交备案申请",
          date: "2023-12-10",
          operator: "王教授",
          comments: projectType === "human" ? "提交人体伦理研究项目备案申请" : "提交动物实验伦理项目备案申请"
        },
        {
          action: "文件审查",
          date: "2023-12-15",
          operator: "刘助理",
          comments: "项目基本信息与研究计划审核"
        },
        {
          action: "备案批准",
          date: "2023-12-20",
          operator: "周处长",
          comments: projectType === "human" ? "项目备案审核通过，编号：人伦备2023-105" : "项目备案审核通过，编号：动伦备2023-089"
        }
        ],
        documents: [
        {
          name: "项目备案表.pdf",
          status: "已通过",
          submittedDate: "2023-12-10",
          reviewedDate: "2023-12-15",
          uploadDate: "2023-12-10"
      },
      {
          name: projectType === "human" ? "研究人员资质证明.pdf" : "实验操作人员资质证明.pdf",
        status: "已通过",
          submittedDate: "2023-12-10",
          reviewedDate: "2023-12-20",
          uploadDate: "2023-12-10"
        }
      ]
    }
  ]
  

  
  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800 border-green-200"
      case "进行中":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "待处理":
        return "bg-slate-100 text-slate-800 border-slate-200"
      case "已修订":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // 获取文档状态样式
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "已审核":
      case "已通过":
        return "bg-green-100 text-green-700 border-green-200";
      case "审核中":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "需修订":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "已拒绝":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };


  
  // 获取审核进度摘要数据
  const getProgressSummary = () => {
    const total = inProgressReviews.length + completedReviews.length;
    return {
      total,
      completed: completedReviews.length,
      pending: inProgressReviews.length,
      percentage: Math.round((completedReviews.length / total) * 100)
    };
  };
  
  const progressSummary = getProgressSummary();
  
  // 合并所有审查数据并排序：进行中的在前，已完成的在后，每个分类内按时间倒序
  const allReviews = [
    ...inProgressReviews.map(review => ({ ...review, isCompleted: false })),
    ...completedReviews.map(review => ({ ...review, isCompleted: true }))
  ].sort((a, b) => {
    // 首先按完成状态排序：进行中(false)排在前面
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    
    // 在同一状态内，按提交日期倒序排序（最新的在前）
    const dateA = new Date(a.submittedDate || (a as any).completedDate);
    const dateB = new Date(b.submittedDate || (b as any).completedDate);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">


      
      {/* 审查流程列表 */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-slate-800">审查流程</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            总计: {allReviews.length} 项
          </Badge>
        </div>
                
        {/* 所有审查流程 */}
        {allReviews.length > 0 ? (
          <div className="space-y-4">
            {allReviews.map((review, index) => (
              <ReviewTimelineCard 
                key={review.id} 
                review={review} 
                type={review.status === "审核中" ? "progress" : "completed"} 
                getDocumentStatusColor={getDocumentStatusColor}
                index={index}
              />
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-slate-50 p-3 mb-3">
                <FileCheck className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium mb-1">暂无审查记录</h3>
              <p className="text-sm text-slate-500 text-center max-w-md">
                目前没有审查流程记录。当您提交审查申请后，相关进度将显示在这里。
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 