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
  AlertCircle,
  User,
  Users,
  Plus,
  Settings
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
  hasLatestUpdate?: boolean;
  latestUpdateDate?: string;
  latestUpdateAction?: string;
}

type ReviewCardProps = {
  review: Review;
  type: "progress" | "completed"; 
  getDocumentStatusColor: (status: string) => string;
  index?: number;
}

// 审查流程卡片组件
export const ReviewTimelineCard = ({ 
  review, 
  type = "progress",
  getDocumentStatusColor,
  index = -1
}: ReviewCardProps) => {
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
  const [reminderDate, setReminderDate] = useState<string>("");
  const [reminderNote, setReminderNote] = useState("");
  const [reminderType, setReminderType] = useState<"self" | "others">("self");
  const [reminderRecipients, setReminderRecipients] = useState<string[]>([]);
  const [reminderPriority, setReminderPriority] = useState<"normal" | "high">("normal");
  const [reminderFrequency, setReminderFrequency] = useState<"once" | "daily" | "weekly">("once");
  
  // 催办原因选择状态
  const [selectedUrgeReason, setSelectedUrgeReason] = useState<string>("");
  
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
    // 验证必填字段
    if (!reminderDate) {
      toast({
        title: "请选择提醒时间",
        description: "提醒时间为必填项，请选择一个日期",
        variant: "destructive"
      });
      return;
    }
    
    if (reminderType === "others" && reminderRecipients.length === 0) {
      toast({
        title: "请选择接收人",
        description: "督办通知模式下必须选择至少一个接收人",
        variant: "destructive"
      });
      return;
    }
    
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
    
    // 重置所有状态
    setReminderDate("");
    setReminderNote("");
    setReminderRecipients([]);
    setSelectedUrgeReason("");
    setOperationNote("");
  };
  
  // 处理催办点击
  const handleUrgeClick = () => {
    setSelectedUrgeReason(""); // 重置催办原因选择
    setOperationNote(""); // 重置说明内容
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
      <div className={`bg-white border mt-4 rounded-lg shadow-sm overflow-hidden ${expanded ? 'shadow-md' : 'hover:bg-gray-50'} transition-all duration-300 relative`}>
        {/* 右上角新进展角标 */}
        {(review as any).hasLatestUpdate && (
          <div className="absolute top-2 right-2 z-10">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}
        
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
            <div className="my-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium">当前步骤: <span className={titleColor}>{review.currentStep}</span></span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">进度:</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-16 h-1 bg-gray-100 rounded-full overflow-hidden`}>
                        <div className={`h-full ${type === "progress" ? "bg-blue-500" : "bg-green-500"} rounded-full transition-all duration-300`} 
                          style={{width: `${review.progress}%`}}></div>
                      </div>
                      <span className={`text-xs font-medium ${titleColor}`}>{review.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>已用时间: {elapsedDays}天</span>
                  <span>总计: {totalDays}天</span>
                </div>
              </div>
            </div>
          )}
          


          {/* 收起状态下显示简单时间线和快速操作 */}
          {!expanded && (
            <div className="flex justify-between items-center mt-3">
              {/* 左侧：显示最新进展或占位 */}
              <div className="flex-1">
                {latestHistory && !(review as any).hasLatestUpdate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${type === "progress" ? "bg-blue-500" : "bg-green-500"} mr-2`}></div>
                    <div>最新进展: {latestHistory.action} ({latestHistory.date})</div>
                  </div>
                )}
                {(review as any).hasLatestUpdate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <div>最新进展: {(review as any).latestUpdateAction} ({(review as any).latestUpdateDate})</div>
                  </div>
                )}
              </div>
              
              {/* 右侧：操作按钮 */}
              {type === "progress" && (
                <div className="flex items-center gap-2 ml-4">
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 督办提醒对话框 */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 flex flex-col">
          {/* 固定顶部 */}
          <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              设置督办提醒
            </DialogTitle>
            <DialogDescription>
              根据项目进度和审查要求，设置合理的督办提醒策略
            </DialogDescription>
          </DialogHeader>
          
          {/* 滚动内容区域 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-sm font-medium text-gray-700">
                当前审查环节
              </div>
              <div className="col-span-8 text-sm text-gray-600">
                {review.currentStep}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-sm font-medium text-gray-700">
                预计完成时间
              </div>
              <div className="col-span-8 text-sm text-gray-600">
                {review.expectedCompletionDate}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* 提醒类型选择 */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">提醒类型</Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    reminderType === "self" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setReminderType("self")}
                >
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium text-sm">自我提醒</span>
                  </div>
                  <p className="text-xs text-gray-600">仅向自己发送提醒通知，用于个人工作安排</p>
                </div>
                
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    reminderType === "others" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setReminderType("others")}
                >
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="font-medium text-sm">督办通知</span>
                  </div>
                  <p className="text-xs text-gray-600">向相关人员发送督办通知，推进审查进度</p>
                </div>
              </div>
            </div>

            {/* 提醒时间设置 */}
            <div className="grid grid-cols-12 gap-4">
              <Label className="col-span-4 text-sm font-medium text-gray-700 mt-2">
                提醒时间 <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-8 space-y-3">
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                  max={review.expectedCompletionDate}
                />
                
                {/* 快捷时间选择 */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "明天", days: 1 },
                    { label: "3天后", days: 3 },
                    { label: "1周后", days: 7 },
                    { label: "截止前3天", days: -3, fromEnd: true }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                                             onClick={() => {
                         const date = preset.fromEnd 
                           ? new Date(review.expectedCompletionDate || new Date())
                           : new Date();
                         date.setDate(date.getDate() + preset.days);
                         setReminderDate(date.toISOString().split('T')[0]);
                       }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border text-gray-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 优先级和频率 */}
            <div className="grid grid-cols-12 gap-4">
              <Label className="col-span-4 text-sm font-medium text-gray-700 mt-2">
                提醒设置
              </Label>
              <div className="col-span-8 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">优先级</Label>
                    <select 
                      value={reminderPriority}
                      onChange={(e) => setReminderPriority(e.target.value as any)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="normal">普通</option>
                      <option value="high">紧急</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">提醒频率</Label>
                    <select 
                      value={reminderFrequency}
                      onChange={(e) => setReminderFrequency(e.target.value as any)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="once">单次提醒</option>
                      <option value="daily">每日提醒</option>
                      <option value="weekly">每周提醒</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 接收人选择 - 仅在督办通知模式下显示 */}
            {reminderType === "others" && (
              <div className="space-y-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    督办接收人设置 <span className="text-red-500">*</span>
                  </Label>
                  <button 
                    onClick={() => setIsTeamSelectorOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                  >
                    <Plus className="h-3 w-3" />
                    添加成员
                  </button>
                </div>
                
                {/* 快捷选择 */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">常用接收人：</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "项目负责人", value: "王教授", icon: "👨‍🏫" },
                      { label: "审查委员", value: "赵专家", icon: "👨‍⚕️" },
                      { label: "行政人员", value: "张秘书", icon: "👩‍💼" },
                      { label: "安全专员", value: "刘安全员", icon: "🛡️" }
                    ].map((person) => (
                      <button
                        key={person.value}
                        type="button"
                        onClick={() => {
                          if (!reminderRecipients.includes(person.value)) {
                            setReminderRecipients(prev => [...prev, person.value]);
                          }
                        }}
                        disabled={reminderRecipients.includes(person.value)}
                        className={`flex items-center gap-2 p-2 text-xs rounded border text-left transition-all ${
                          reminderRecipients.includes(person.value)
                            ? "bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed"
                            : "bg-white hover:bg-blue-50 border-gray-200 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <span>{person.icon}</span>
                        <span className="flex-1">{person.label}</span>
                        {reminderRecipients.includes(person.value) && (
                          <CheckCircle className="h-3 w-3 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 已选择的接收人 */}
                {reminderRecipients.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">已选择接收人：</div>
                    <div className="flex flex-wrap gap-2">
                      {reminderRecipients.map((recipient, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <span>{recipient}</span>
                          <button 
                            onClick={() => setReminderRecipients(prev => prev.filter((_, i) => i !== index))}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reminderRecipients.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                    请选择督办通知的接收人
                  </div>
                )}
              </div>
            )}

            {/* 提醒内容 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                {reminderType === "self" ? "个人备注" : "督办内容"}
                {reminderType === "others" && <span className="text-orange-600 ml-1">（推荐填写）</span>}
              </Label>
              
              {/* 模板选择 - 仅在督办通知模式下显示 */}
              {reminderType === "others" && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">快速模板：</div>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      "项目审查进度较慢，请加快处理进度以确保按时完成。",
                      "距离预计完成时间较近，请优先处理此项审查。",
                      "该项目具有一定紧急性，请尽快安排审查时间。"
                    ].map((template, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setReminderNote(template)}
                        className="text-left px-3 py-2 text-xs bg-gray-50 hover:bg-blue-50 rounded border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <Textarea
                placeholder={reminderType === "self" 
                  ? "添加个人提醒备注（可选）" 
                  : "请填写督办理由和具体要求..."
                }
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* 自动规则设置 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Settings className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">智能提醒规则</span>
              </div>
              <div className="space-y-2 text-xs text-blue-700">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  距离截止日期7天时自动发送第一次提醒
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  距离截止日期3天时自动发送紧急提醒
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  超过截止日期时自动标记为逾期并通知上级
                </div>
              </div>
            </div>
            </div>
          </div>
          
          {/* 固定底部 */}
          <DialogFooter className="px-6 py-4 border-t border-gray-200 flex-shrink-0 space-x-2">
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={confirmReminder}
              disabled={!reminderDate || (reminderType === "others" && reminderRecipients.length === 0)}
            >
              {reminderType === "self" ? "设置提醒" : "发送督办"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 催办对话框 */}
      <Dialog open={isUrgeDialogOpen} onOpenChange={setIsUrgeDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] p-0 flex flex-col">
          {/* 固定顶部 */}
          <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              审查催办
            </DialogTitle>
            <DialogDescription>
              向当前负责"{review.currentStep}"的相关人员发送催办通知
            </DialogDescription>
          </DialogHeader>
          
          {/* 滚动内容区域 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-4">
            {/* 当前状态信息 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-orange-700 font-medium">当前环节：</span>
                  <div className="text-orange-600">{review.currentStep}</div>
                </div>
                <div>
                  <span className="text-orange-700 font-medium">已耗时：</span>
                  <div className="text-orange-600">
                    {Math.ceil((new Date().getTime() - new Date(review.submittedDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                  </div>
                </div>
                <div>
                  <span className="text-orange-700 font-medium">预计完成：</span>
                  <div className="text-orange-600">{review.expectedCompletionDate}</div>
                </div>
                <div>
                  <span className="text-orange-700 font-medium">剩余时间：</span>
                  <div className={`font-medium ${
                    review.expectedCompletionDate && new Date(review.expectedCompletionDate) < new Date()
                      ? 'text-red-600' 
                      : 'text-orange-600'
                  }`}>
                    {review.expectedCompletionDate 
                      ? Math.ceil((new Date(review.expectedCompletionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                      : 0
                    } 天
                  </div>
                </div>
              </div>
            </div>

            {/* 催办原因选择 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">催办原因</Label>
              <div className="space-y-2">
                {[
                  { id: "slow", label: "审查进度缓慢", description: "当前审查进度明显低于预期" },
                  { id: "urgent", label: "项目紧急", description: "项目具有紧急性，需要优先处理" },
                  { id: "deadline", label: "临近截止", description: "距离截止日期较近，需要加快进度" },
                  { id: "other", label: "其他原因", description: "其他需要催办的特殊情况" }
                ].map((reason) => {
                  const isSelected = selectedUrgeReason === reason.id;
                  return (
                    <div 
                      key={reason.id} 
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                      onClick={() => {
                        setSelectedUrgeReason(reason.id);
                        const templates = {
                          slow: "当前审查进度较慢，希望能够加快处理速度，确保项目按时推进。",
                          urgent: "该项目具有紧急性，请优先安排审查，尽快完成相关环节。",
                          deadline: "距离预计完成时间较近，请尽快处理以避免延期。",
                          other: ""
                        };
                        setOperationNote(templates[reason.id as keyof typeof templates]);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          isSelected 
                            ? 'border-orange-500 bg-orange-500' 
                            : 'border-orange-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${
                            isSelected ? 'text-orange-900' : 'text-gray-900'
                          }`}>{reason.label}</div>
                          <div className={`text-xs mt-1 ${
                            isSelected ? 'text-orange-700' : 'text-gray-600'
                          }`}>{reason.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 催办说明 */}
            <div className="space-y-2">
              <Label htmlFor="urgeNote" className="text-sm font-medium text-gray-700">
                催办说明
              </Label>
              <Textarea
                id="urgeNote"
                placeholder="请详细说明催办原因和具体要求..."
                value={operationNote}
                onChange={(e) => setOperationNote(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="text-xs text-gray-500">
                详细的催办说明有助于相关人员了解情况并及时处理
              </div>
            </div>

            {/* 催办方式 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">通知方式</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notifySystem" defaultChecked className="rounded" />
                  <Label htmlFor="notifySystem" className="text-sm">系统通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notifyEmail" defaultChecked className="rounded" />
                  <Label htmlFor="notifyEmail" className="text-sm">邮件通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notifySms" className="rounded" />
                  <Label htmlFor="notifySms" className="text-sm">短信通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notifyPhone" className="rounded" />
                  <Label htmlFor="notifyPhone" className="text-sm">电话提醒</Label>
                </div>
              </div>
            </div>

            {/* 智能建议 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Settings className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">智能建议</span>
              </div>
              <div className="space-y-2 text-xs text-blue-700">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  建议同时抄送给项目负责人和部门主管
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  如48小时内无响应，系统将自动升级催办等级
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  催办记录将记入项目进度档案
                </div>
              </div>
            </div>
            </div>
          </div>
          
          {/* 固定底部 */}
          <DialogFooter className="px-6 py-4 border-t border-gray-200 flex-shrink-0 space-x-2">
            <Button variant="outline" onClick={() => setIsUrgeDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmUrge} className="bg-orange-600 hover:bg-orange-700">
              发送催办
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 团队成员选择对话框 */}
      <Dialog open={isTeamSelectorOpen} onOpenChange={setIsTeamSelectorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>选择团队成员</DialogTitle>
            <DialogDescription>
              从项目团队成员中选择接收督办通知的人员
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* 搜索框 */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="搜索团队成员..."
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            {/* 成员列表 */}
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredTeamMembers.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  没有找到匹配的团队成员
                </div>
              )}
              
              {filteredTeamMembers.map(member => {
                const isSelected = reminderRecipients.includes(member.name);
                return (
                  <div
                    key={member.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setReminderRecipients(prev => prev.filter(name => name !== member.name));
                      } else {
                        setReminderRecipients(prev => [...prev, member.name]);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.role} · {member.department}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamSelectorOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsTeamSelectorOpen(false)}>
              确认选择 ({reminderRecipients.length})
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