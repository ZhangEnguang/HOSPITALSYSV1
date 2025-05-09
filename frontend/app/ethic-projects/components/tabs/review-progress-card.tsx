"use client"

import React, { useState } from "react"
import { 
  Clock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  FileCheck, 
  Bell, 
  ChevronRight, 
  AlertCircle 
} from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"

type ReviewHistoryItem = {
  date: string;
  action: string;
  operator: string;
  comments: string;
}

type ReviewDocument = {
  name: string;
  uploadDate: string;
  status: string;
}

type Review = {
  id: string;
  type: string;
  status: string;
  submittedDate: string;
  expectedCompletionDate?: string;
  completedDate?: string;
  submittedBy: string;
  currentStep?: string;
  progress?: number;
  reviewHistory: ReviewHistoryItem[];
  documents: ReviewDocument[];
  result?: string;
  remarks?: string;
}

type ReviewCardProps = {
  review: Review;
  type: "progress" | "completed"; 
  getDocumentStatusColor: (status: string) => string;
}

// 审查流程卡片组件
export const ReviewTimelineCard = ({ 
  review, 
  type = "progress",
  getDocumentStatusColor 
}: ReviewCardProps) => {
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
  const [reminderDate, setReminderDate] = useState<string>(() => {
    if (type === "progress" && review.expectedCompletionDate) {
      const date = new Date(review.expectedCompletionDate);
      date.setDate(date.getDate() - 3);
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  const [reminderNote, setReminderNote] = useState("");
  const [reminderType, setReminderType] = useState<"self" | "others">("self");
  const [reminderRecipients, setReminderRecipients] = useState<string[]>([]);
  const [reminderPriority, setReminderPriority] = useState<"normal" | "high">("normal");
  const [reminderFrequency, setReminderFrequency] = useState<"once" | "daily" | "weekly">("once");
  
  // 添加项目团队成员列表
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "王教授", role: "负责人", department: "基础医学院" },
    { id: "2", name: "李助理", role: "研究助理", department: "基础医学院" },
    { id: "3", name: "张秘书", role: "行政人员", department: "伦理委员会" },
    { id: "4", name: "赵专家", role: "评审专家", department: "药学院" },
    { id: "5", name: "刘安全员", role: "安全专员", department: "实验动物中心" }
  ]);

  // 是否显示团队成员选择对话框
  const [isTeamSelectorOpen, setIsTeamSelectorOpen] = useState(false);

  // 团队成员选择的搜索关键词
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // 过滤后的团队成员
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.includes(teamSearchQuery) || 
    member.role.includes(teamSearchQuery) || 
    member.department.includes(teamSearchQuery)
  );
  
  const toggleExpand = () => setExpanded(prev => !prev);
  
  // 处理督办提醒
  const handleReminderClick = () => {
    if (hasReminder) {
      // 如果已经设置了提醒，点击则取消
      setHasReminder(false);
      toast({
        title: "督办提醒已取消",
        description: `已取消"${review.type}"的督办提醒`,
        variant: "default"
      });
    } else {
      // 打开设置提醒对话框
      setIsReminderDialogOpen(true);
    }
  };
  
  // 确认设置督办提醒
  const confirmReminder = () => {
    setHasReminder(true);
    setIsReminderDialogOpen(false);
    
    // 构建提醒消息
    let reminderMsg = `已为"${review.type}"设置督办提醒，提醒日期: ${reminderDate}`;
    
    if (reminderType === "others" && reminderRecipients.length > 0) {
      reminderMsg += `，接收人: ${reminderRecipients.join(", ")}`;
    }
    
    if (reminderFrequency !== "once") {
      const frequencyText = reminderFrequency === "daily" ? "每日" : "每周";
      reminderMsg += `，${frequencyText}提醒`;
    }
    
    if (reminderPriority === "high") {
      reminderMsg += "，紧急优先级";
    }
    
    // 模拟提交督办提醒请求
    toast({
      title: "督办提醒已设置",
      description: reminderMsg,
      variant: "default"
    });
    
    // 重置备注
    setOperationNote("");
  };
  
  // 处理催办点击
  const handleUrgeClick = () => {
    setIsUrgeDialogOpen(true);
  };
  
  // 确认催办
  const confirmUrge = () => {
    setIsUrgeDialogOpen(false);
    
    // 模拟提交催办请求
    toast({
      title: "催办已发送",
      description: `已向"${review.currentStep}"相关人员发送催办${operationNote ? `，备注: ${operationNote}` : ''}`,
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
  const endDate = type === "progress" && review.expectedCompletionDate
    ? new Date(review.expectedCompletionDate)
    : review.completedDate 
      ? new Date(review.completedDate)
      : new Date();
      
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
                {review.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">提交日期: {review.submittedDate}</span>
                {type === "progress" && review.expectedCompletionDate ? (
                  <span>预计完成: {review.expectedCompletionDate}</span>
                ) : review.completedDate ? (
                  <span>完成日期: {review.completedDate}</span>
                ) : null}
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
          
          {type === "progress" && review.progress !== undefined && (
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
                    onClick={handleReminderClick}
                    className={`flex items-center text-xs px-2 py-1 rounded border transition-colors ${
                      hasReminder 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5 mr-1" />
                    {hasReminder ? "已设置提醒" : "督办提醒"}
                  </button>
                  <button 
                    onClick={handleUrgeClick}
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
                {review.reviewHistory.map((history, idx) => (
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
                        <span className="text-xs text-gray-500">预计时间: {review.expectedCompletionDate}</span>
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
              {review.documents.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <FileCheck className={`h-4 w-4 mr-2 ${type === "progress" ? "text-blue-600" : "text-green-600"}`} />
                    审查文档 ({review.documents.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {review.documents.map((doc, idx) => (
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
              )}
              
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>设置督办提醒</DialogTitle>
            <DialogDescription>
              设置提醒日期，系统将在指定日期发送督办提醒通知
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderDate" className="text-right">
                提醒日期 <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 relative">
                <input
                  id="reminderDate"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full p-2 border rounded-md pr-8"
                  min={new Date().toISOString().split('T')[0]}
                  max={review.expectedCompletionDate}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <rect x="6" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                    <rect x="10.5" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                    <rect x="15" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="reminderType" className="text-right mt-2">
                提醒类型
              </Label>
              <div className="col-span-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="reminderTypeSelf" 
                    checked={reminderType === "self"} 
                    onChange={() => setReminderType("self")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Label htmlFor="reminderTypeSelf" className="font-normal">
                    自我提醒（仅提醒自己）
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="reminderTypeOthers" 
                    checked={reminderType === "others"} 
                    onChange={() => setReminderType("others")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Label htmlFor="reminderTypeOthers" className="font-normal">
                    督办通知（通知相关人员）
                  </Label>
                </div>
              </div>
            </div>
            
            {reminderType === "others" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="reminderRecipients" className="text-right mt-2">
                  接收人 <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <div className="p-2 border rounded-md min-h-[80px] bg-gray-50 flex flex-wrap gap-2">
                    {reminderRecipients.length > 0 ? (
                      reminderRecipients.map((recipient, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                          <span>{recipient}</span>
                          <button 
                            onClick={() => setReminderRecipients(prev => prev.filter((_, i) => i !== index))}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">点击下方"添加接收人"按钮选择接收督办通知的项目团队成员</div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsTeamSelectorOpen(true)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-1" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    添加接收人
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderPriority" className="text-right">
                提醒优先级
              </Label>
              <div className="col-span-3">
                <select 
                  id="reminderPriority"
                  value={reminderPriority}
                  onChange={(e) => setReminderPriority(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="normal">普通</option>
                  <option value="high">紧急</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderFrequency" className="text-right">
                提醒频率
              </Label>
              <div className="col-span-3">
                <select 
                  id="reminderFrequency"
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="once">单次提醒</option>
                  <option value="daily">每日提醒</option>
                  <option value="weekly">每周提醒</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="reminderNote" className="text-right mt-2">
                提醒备注
              </Label>
              <Textarea
                id="reminderNote"
                placeholder="添加督办提醒备注（可选）"
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                className="col-span-3 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
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

      {/* 团队成员选择对话框 */}
      <Dialog open={isTeamSelectorOpen} onOpenChange={setIsTeamSelectorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>选择接收人</DialogTitle>
            <DialogDescription>
              从项目团队成员中选择接收督办通知的人员
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="搜索成员（姓名、角色或部门）"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="w-full p-2 pl-8 border rounded-md"
              />
              <svg 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider">选择</th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider">姓名</th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider">角色</th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider">部门</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTeamMembers.map(member => {
                    const isSelected = reminderRecipients.includes(member.name);
                    return (
                      <tr 
                        key={member.id}
                        className={`${isSelected ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}
                        onClick={() => {
                          if (isSelected) {
                            setReminderRecipients(prev => prev.filter(name => name !== member.name));
                          } else {
                            setReminderRecipients(prev => [...prev, member.name]);
                          }
                        }}
                      >
                        <td className="p-2">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {}} // 点击行时就会触发更改，这里只是为了展示复选框状态
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </td>
                        <td className="p-2 text-sm">{member.name}</td>
                        <td className="p-2 text-sm">{member.role}</td>
                        <td className="p-2 text-sm">{member.department}</td>
                      </tr>
                    );
                  })}
                  {filteredTeamMembers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        未找到匹配的成员
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              已选择 {reminderRecipients.length} 名成员
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamSelectorOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsTeamSelectorOpen(false)}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 定义动画样式
export const AnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes pulse-slow {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.85;
        }
      }

      .animate-shimmer {
        animation: shimmer 2s infinite;
      }

      .animate-pulse-slow {
        animation: pulse-slow 3s infinite;
      }
    `}</style>
  );
}; 