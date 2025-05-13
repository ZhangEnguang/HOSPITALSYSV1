"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, CircleAlert, FileCheck, Calendar, FilePlus, RotateCcw, ChevronRight, AlertTriangle, ChevronDown, ChevronUp, Check, Bell, AlertCircle, CalendarCheck, Users, MessageSquare, FileText, Clipboard, BarChart3, MessageCircle, CalendarDays, Building, UserRound, Pencil } from "lucide-react"
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
import { ReviewTimelineCard as ReviewCard, AnimationStyles } from "../../../components/tabs/review-progress-card"

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
  // 默认收起状态，但如果是第一个卡片则默认展开
  const [expanded, setExpanded] = useState(index === 0);
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
export default function ReviewProgressTab({ projectId, projectType = "human" }: { projectId?: string; projectType?: "animal" | "human" }) {
  const [activeTab, setActiveTab] = useState("timeline")
  // 添加审查卡片模式视图状态
  const [activeView, setActiveView] = useState("progress")
  const [currentDocumentFilter, setCurrentDocumentFilter] = useState("all")
  // 添加会议筛选状态
  const [currentMeetingFilter, setCurrentMeetingFilter] = useState("all")
  // 添加审查意见筛选状态
  const [currentCommentFilter, setCurrentCommentFilter] = useState("all")
  const [showAddReviewDialog, setShowAddReviewDialog] = useState(false)
  const [reviewNote, setReviewNote] = useState("")
  
  // 模拟正在进行的审查数据
  const inProgressReviews = [
      {
        id: "1",
        type: "人体伦理委员会初步审查",
        submittedDate: "2024-01-20",
        expectedCompletionDate: "2024-02-25",
        currentStep: "临床专家评审",
        progress: 75,
        status: "审核中",
        reviewer: "医学院人体伦理审查委员会",
        submittedBy: "王教授",
        reviewHistory: [
          {
            action: "提交申请",
            date: "2024-01-20",
            operator: "王教授",
            comments: "提交临床研究人体伦理项目初审申请"
          },
          {
            action: "形式审查",
            date: "2024-01-22",
            operator: "李审查员",
            comments: "受试者知情同意书及项目申请资料完整性检查通过"
          },
          {
            action: "指定专家评审",
            date: "2024-01-25",
            operator: "张主任",
            comments: "分配2名伦理学专家和1名临床医学专家进行评审"
          },
          {
            action: "专家评审中",
            date: "2024-02-05",
            operator: "系统",
            comments: "已收到2名专家的评审意见，等待临床医学专家完成评审"
          }
        ],
        documents: [
          {
            name: "人体研究项目申请表.pdf",
            status: "已审核",
            submittedDate: "2024-01-20",
            reviewedDate: "2024-01-22",
            uploadDate: "2024-01-20"
          },
          {
            name: "临床研究方案.pdf",
            status: "审核中",
            submittedDate: "2024-01-20",
            reviewedDate: "",
            uploadDate: "2024-01-20"
          },
          {
            name: "受试者知情同意书.docx",
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
        type: "医学院人体伦理项目备案审核",
        submittedDate: "2023-12-10",
        completedDate: "2023-12-20",
        progress: 100,
        status: "审核通过",
        reviewer: "医学院科研处",
        submittedBy: "王教授",
        result: "符合伦理要求，同意开展研究",
        remarks: "项目应严格遵循知情同意原则，确保受试者权益，研究过程中发生不良事件须及时报告。",
        reviewHistory: [
          {
            action: "提交备案申请",
            date: "2023-12-10",
            operator: "王教授",
            comments: "提交人体伦理研究项目备案申请"
          },
          {
            action: "文件审查",
            date: "2023-12-15",
            operator: "刘助理",
            comments: "受试者招募计划与受试者保护措施审核通过"
          },
          {
            action: "备案批准",
            date: "2023-12-20",
            operator: "周处长",
            comments: "项目备案审核通过，编号：人伦备2023-105"
          }
        ],
        documents: [
          {
            name: "人体研究项目备案表.pdf",
            status: "已通过",
            submittedDate: "2023-12-10",
            reviewedDate: "2023-12-15",
            uploadDate: "2023-12-10"
          },
          {
            name: "研究人员资质证明.pdf",
            status: "已通过",
            submittedDate: "2023-12-10",
            reviewedDate: "2023-12-20",
            uploadDate: "2023-12-10"
          }
        ]
      }
  ]
  
  // 模拟审查记录数据
  const reviewTimeline = [
    {
      id: "1",
      date: "2024-01-05",
      event: "提交初审申请",
      description: "项目负责人提交了人体研究伦理审查申请及相关文件",
      status: "已完成",
      actor: "王教授",
      actorRole: "项目负责人"
    },
    {
      id: "2",
      date: "2024-01-08",
      event: "形式审查",
      description: "伦理办公室对受试者知情同意书等申请材料进行形式审查",
      status: "已完成",
      actor: "伦理办公室",
      actorRole: "审查人员"
    },
    {
      id: "3",
      date: "2024-01-12",
      event: "专家审查",
      description: "3名人体伦理委员会成员进行专家审查",
      status: "已完成",
      actor: "伦理委员会",
      actorRole: "专家组"
    },
    {
      id: "4",
      date: "2024-01-15",
      event: "伦理委员会会议",
      description: "人体伦理委员会召开会议讨论临床研究申请",
      status: "已完成",
      actor: "伦理委员会",
      actorRole: "委员会"
    },
    {
      id: "5",
      date: "2024-01-20",
      event: "批准通过",
      description: "人体伦理委员会批准研究项目，发放批准证书",
      status: "已完成",
      actor: "伦理委员会主席",
      actorRole: "主席"
    },
    {
      id: "6",
      date: "2024-02-10",
      event: "方案修订",
      description: "项目组提交了知情同意书修订版本",
      status: "已完成",
      actor: "王教授",
      actorRole: "项目负责人"
    },
    {
      id: "7",
      date: "2024-02-15",
      event: "修订批准",
      description: "伦理委员会批准了方案修订",
      status: "已完成",
      actor: "伦理委员会",
      actorRole: "快速审查组"
    },
    {
      id: "8",
      date: "2024-08-05",
      event: "进度报告提交",
      description: "项目组将提交受试者招募进展及中期数据分析报告",
      status: "待处理",
      actor: "王教授",
      actorRole: "项目负责人"
    },
    {
      id: "9",
      date: "2025-01-20",
      event: "年度报告",
      description: "项目组需提交受试者安全性跟踪及年度总结报告",
      status: "待处理",
      actor: "王教授",
      actorRole: "项目负责人"
    }
  ]
  
  // 模拟审查会议记录
  const reviewMeetings = [
    {
      id: "1",
      date: "2024-01-15",
      type: "常规会议",
      reviewType: "人体伦理研究审查",
      attendees: "12名人体伦理委员会成员",
      decision: "批准通过",
      comments: "委员会认为项目设计合理，知情同意程序完善，风险与受益平衡，建议加强受试者隐私保护措施。",
      meetingNumber: "EC-2024-01"
    },
    {
      id: "2",
      date: "2023-12-10",
      type: "快速审查会议",
      reviewType: "医学院人体伦理项目备案审核",
      attendees: "5名委员",
      decision: "批准通过",
      comments: "项目备案材料完整，研究风险较低，符合快速审查条件。",
      meetingNumber: "EC-2023-52"
    },
    {
      id: "3",
      date: "2024-02-03",
      type: "临时会议",
      reviewType: "知情同意书修订审查",
      attendees: "8名委员",
      decision: "有条件通过",
      comments: "同意知情同意书的修订，但要求明确说明数据保存期限和受试者退出研究的权益保障。",
      meetingNumber: "EC-2024-05"
    },
    {
      id: "4",
      date: "2024-03-12",
      type: "常规会议",
      reviewType: "不良事件报告审查",
      attendees: "14名委员",
      decision: "批准通过",
      comments: "审阅了安全性报告，未发现严重不良事件，研究可继续进行。建议加强受试者随访。",
      meetingNumber: "EC-2024-11"
    },
    {
      id: "5",
      date: "2024-04-28",
      type: "专题会议",
      reviewType: "临床研究中期进展审查",
      attendees: "10名委员",
      decision: "批准通过",
      comments: "项目进展顺利，受试者招募达标，数据质量良好，可继续开展。请注意做好受试者退出的管理工作。",
      meetingNumber: "EC-2024-17"
    }
  ]
  
  // 模拟审查意见记录
  const reviewComments = [
    {
      id: "1",
      date: "2024-01-13",
      reviewer: "李委员",
      reviewType: "人体伦理研究审查",
      comments: "知情同意书语言应更通俗易懂，建议修改第三部分关于风险描述的内容，并增加受试者可随时退出研究的说明。",
      status: "已修订"
    },
    {
      id: "2",
      date: "2024-01-13",
      reviewer: "张委员",
      reviewType: "人体伦理研究审查",
      comments: "样本量计算依据需要进一步说明，建议补充统计学分析方法和样本量估算公式。",
      status: "已修订"
    },
    {
      id: "3",
      date: "2024-01-14",
      reviewer: "赵委员",
      reviewType: "人体伦理研究审查",
      comments: "数据安全保护措施需进一步加强，建议明确数据保存期限和访问权限控制措施，确保受试者隐私得到充分保障。",
      status: "已修订"
    },
    {
      id: "4",
      date: "2023-12-15",
      reviewer: "刘助理",
      reviewType: "医学院人体伦理项目备案审核",
      comments: "项目预算与工作量匹配性需要优化，建议调整受试者补偿费用分配，并明确研究人员工作量。",
      status: "已修订"
    },
    {
      id: "5",
      date: "2024-02-05",
      reviewer: "王专家",
      reviewType: "知情同意书修订审查",
      comments: "修订后的知情同意书应明确说明更改的内容及理由，建议添加修订说明表，并重点标注修改内容便于受试者理解。",
      status: "待修订"
    },
    {
      id: "6",
      date: "2024-03-15",
      reviewer: "钱委员",
      reviewType: "不良事件报告审查",
      comments: "安全性报告中的轻度不良反应分析不够详细，需补充与试验干预的相关性评估及后续随访记录。",
      status: "已回复"
    },
    {
      id: "7",
      date: "2024-04-30",
      reviewer: "孙主任",
      reviewType: "临床研究中期进展审查",
      comments: "数据收集进度良好，但失访率略高，建议采取措施提高受试者依从性，并补充失访原因分析。",
      status: "已确认"
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

  // 处理添加审查意见
  const handleAddReview = () => {
    if (!reviewNote.trim()) return;
    
    toast({
      title: "审查意见已添加",
      description: "您的审查意见已成功添加到当前审查流程",
    });
    
    setShowAddReviewDialog(false);
    setReviewNote("");
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
  
  // 计算审查进度
  const completedSteps = reviewTimeline.filter(item => item.status === "已完成").length
  const totalSteps = reviewTimeline.length
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="space-y-6">
      {/* 进度概览卡片 - 合并视图切换按钮 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                人体伦理审查进度
              </CardTitle>
              <CardDescription className="text-slate-500">
                已完成 {completedSteps} 项人体伦理审查步骤，共 {totalSteps} 项
              </CardDescription>
          </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className={activeTab !== "cardview" ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : ""} onClick={() => setActiveTab("timeline")}>
                <CalendarDays className="h-4 w-4 mr-2" />
                时间轴视图
              </Button>
              <Button variant="outline" size="sm" className={activeTab === "cardview" ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : ""} onClick={() => setActiveTab("cardview")}>
                <Clipboard className="h-4 w-4 mr-2" />
                卡片视图
              </Button>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">人体伦理审查总体进度</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                已获批准
              </Badge>
              </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>提交申请</span>
              <span>形式审查</span>
              <span>专家评审</span>
              <span>委员会审批</span>
              <span>后续跟踪</span>
              </div>
            </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                  <CalendarCheck className="h-4 w-4" />
                  伦理批准日期
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-semibold">2024-01-20</div>
                <div className="text-xs text-slate-500 mt-1">伦理批准有效期: 1年</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-2 text-purple-600">
                  <Building className="h-4 w-4" />
                  伦理审批单位
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-semibold">医学院人体伦理审查委员会</div>
                <div className="text-xs text-slate-500 mt-1">批号: EC-2024-001</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                  <Calendar className="h-4 w-4" />
                  下次伦理审查
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-semibold">2024-08-05</div>
                <div className="text-xs text-slate-500 mt-1">需提交: 受试者安全性与进度报告</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 时间轴视图 */}
      {activeTab !== "cardview" && (
        <>
          {/* 审查详情标签页 */}
          <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Clock className="h-4 w-4 mr-2" />
                审查时间线
              </TabsTrigger>
              <TabsTrigger value="meetings" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <Users className="h-4 w-4 mr-2" />
                伦理委员会会议
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                伦理审查意见
              </TabsTrigger>
            </TabsList>

            {/* 审查时间线标签内容 */}
            <TabsContent value="timeline" className="mt-0">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    人体伦理审查流程时间线
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l border-slate-200 space-y-6">
                    {reviewTimeline.map((item, index) => (
                      <div key={item.id} className="relative">
                        <div className="absolute -left-[25px] top-0">
                          {item.status === "已完成" ? (
                            <div className="h-4 w-4 rounded-full bg-green-500 ring-4 ring-green-50"></div>
                          ) : item.status === "进行中" ? (
                            <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-slate-300 ring-4 ring-slate-50"></div>
                          )}
        </div>
        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium">{item.event}</h3>
                              <Badge variant="outline" className={`text-xs ${getStatusStyle(item.status)}`}>
                                {item.status === "已完成" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                                {item.status === "进行中" ? <Clock className="h-3 w-3 mr-1" /> : null}
                                {item.status === "待处理" ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                                {item.status}
                              </Badge>
          </div>
                            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              </div>
                          <div className="flex flex-col items-start md:items-end gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <CalendarDays className="h-3.5 w-3.5" />
                              <span>{item.date}</span>
            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <UserRound className="h-3.5 w-3.5" />
                              <span>{item.actor} ({item.actorRole})</span>
              </div>
              </div>
            </div>
          </div>
                    ))}
        </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 审查会议标签内容 */}
            <TabsContent value="meetings" className="mt-0">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      人体伦理委员会会议记录
                    </CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      总计: {reviewMeetings.length}次会议
                    </Badge>
          </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${currentMeetingFilter === "all" ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}`}
                      onClick={() => setCurrentMeetingFilter("all")}
                    >
                      全部会议
                    </Button>
                    {Array.from(new Set(reviewMeetings.map(m => m.reviewType))).map((type) => (
                      <Button 
                        key={type as string} 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${currentMeetingFilter === type ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}`}
                        onClick={() => setCurrentMeetingFilter(type as string)}
                      >
                        {type as string}
                      </Button>
                    ))}
                </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewMeetings
                      .filter(meeting => currentMeetingFilter === "all" || meeting.reviewType === currentMeetingFilter)
                      .map((meeting) => (
                      <Card key={meeting.id} className="bg-slate-50 border-slate-200">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium">{meeting.type}</h3>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {meeting.decision}
                                </Badge>
              </div>
                              <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                                {meeting.reviewType}
                              </Badge>
            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{meeting.date}</span>
                              <span className="text-slate-300">|</span>
                              <span>会议编号: {meeting.meetingNumber}</span>
              </div>
              </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-3">
                            <div className="text-xs text-slate-500 mb-1">与会人员</div>
                            <div className="text-sm">{meeting.attendees}</div>
              </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">会议决议与意见</div>
                            <div className="text-sm">{meeting.comments}</div>
            </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {reviewMeetings
                      .filter(meeting => currentMeetingFilter === "all" || meeting.reviewType === currentMeetingFilter)
                      .length === 0 && (
                      <div className="py-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                          <Users className="h-6 w-6 text-slate-400" />
          </div>
                        <p className="text-sm text-slate-500">暂无会议记录</p>
        </div>
                    )}
      </div>
                </CardContent>
              </Card>
            </TabsContent>
      
            {/* 审查意见标签内容 */}
            <TabsContent value="comments" className="mt-0">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      人体伦理审查意见与反馈
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowAddReviewDialog(true)}>
                      <FilePlus className="h-4 w-4 mr-2" />
                      添加审查意见
                    </Button>
                      </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${currentCommentFilter === "all" ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                      onClick={() => setCurrentCommentFilter("all")}
                    >
                      全部意见
                    </Button>
                    {Array.from(new Set(reviewComments.map(c => c.reviewType))).map((type) => (
                      <Button 
                        key={type as string} 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${currentCommentFilter === type ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                        onClick={() => setCurrentCommentFilter(type as string)}
                      >
                        {type as string}
                      </Button>
                    ))}
                    </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewComments
                      .filter(comment => currentCommentFilter === "all" || comment.reviewType === currentCommentFilter)
                      .map((comment) => (
                      <div key={comment.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-sm border border-slate-200">
                              <UserRound className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-sm font-medium">{comment.reviewer}</h3>
                              <Badge variant="outline" className="w-fit mt-1 bg-slate-50 text-slate-700 border-slate-200 text-[10px]">
                                {comment.reviewType}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{comment.date}</span>
                            </div>
                            <Badge variant="outline" className={`text-xs ${getStatusStyle(comment.status)}`}>
                              {comment.status === "已修订" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                              {comment.status === "待修订" ? <Pencil className="h-3 w-3 mr-1" /> : null}
                              {comment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="pl-10">
                          <p className="text-sm text-slate-700">{comment.comments}</p>
                        </div>
                      </div>
                    ))}
                    
                    {reviewComments
                      .filter(comment => currentCommentFilter === "all" || comment.reviewType === currentCommentFilter)
                      .length === 0 && (
                      <div className="py-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                          <MessageSquare className="h-6 w-6 text-slate-400" />
                      </div>
                        <p className="text-sm text-slate-500">暂无审查意见</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* 卡片视图 */}
      {activeTab === "cardview" && (
        <>
          {/* 审查流程列表 */}
          <Tabs defaultValue="progress" value={activeView} onValueChange={setActiveView} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="progress">
                  <Clock className="h-4 w-4 mr-2" />
                  进行中
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  已完成
                </TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" onClick={() => setShowAddReviewDialog(true)}>
                <FilePlus className="h-4 w-4 mr-2" />
                添加审查意见
              </Button>
                    </div>
                    
        {/* 进行中的审查 */}
            <TabsContent value="progress" className="mt-0">
              {inProgressReviews.length > 0 ? (
                <div className="space-y-4">
                  {inProgressReviews.map((review, index) => (
                    <ReviewTimelineCard 
                  key={review.id} 
                  review={review} 
                  type="progress" 
                  getDocumentStatusColor={getDocumentStatusColor}
                  index={index}
                />
                  ))}
                </div>
              ) : (
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-blue-50 p-3 mb-3">
                      <Clock className="h-6 w-6 text-blue-500" />
              </div>
                    <h3 className="text-lg font-medium mb-1">没有进行中的审查</h3>
                    <p className="text-sm text-slate-500 text-center max-w-md">
                      目前没有正在进行的审查流程。当您提交审查申请后，相关进度将显示在这里。
                    </p>
                  </CardContent>
                </Card>
              )}
        </TabsContent>
        
        {/* 已完成的审查 */}
        <TabsContent value="completed" className="mt-0">
              {completedReviews.length > 0 ? (
                <div className="space-y-4">
                  {completedReviews.map((review, index) => (
                    <ReviewTimelineCard 
                  key={review.id} 
                  review={review} 
                  type="completed" 
                  getDocumentStatusColor={getDocumentStatusColor}
                  index={index}
                />
                  ))}
                </div>
            ) : (
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-green-50 p-3 mb-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
                    <h3 className="text-lg font-medium mb-1">尚无已完成审查</h3>
                    <p className="text-sm text-slate-500 text-center max-w-md">
                      项目尚未完成任何审查流程。审查完成后，相关记录将显示在这里。
                    </p>
                  </CardContent>
                </Card>
              )}
        </TabsContent>
      </Tabs>
          
          {/* 添加审查意见对话框 */}
          <Dialog open={showAddReviewDialog} onOpenChange={setShowAddReviewDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>添加审查意见</DialogTitle>
                <DialogDescription>
                  请填写您对当前审查流程的意见或建议
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="review-note">审查意见</Label>
                  <Textarea
                    id="review-note"
                    placeholder="请输入您的审查意见..."
                    rows={5}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                  />
    </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddReviewDialog(false)}>取消</Button>
                <Button onClick={handleAddReview}>提交意见</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
} 