"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  UserPlus,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Star,
  Clock,
  TrendingUp,
  AlertCircle,
  User,
  FileText,
  GitCompare,
  BarChart3,
  CheckCircle2,
  Target
} from "lucide-react"

// 导入独立的专家对比组件
import ExpertCompareDialog from "./expert-compare-dialog"

// 导入专家意见数据类型
import type { ExpertOpinion } from "./expert-compare-dialog"

// 独立顾问回复数据类型定义
interface AdvisorResponse {
  id: string;
  advisorId: string;
  advisorName: string;
  organization: string;
  title: string;
  date: string;
  responseType: string;
  question: string;
  response: string;
  expertise: string[];
  recommendations: string[];
}

// 组件Props类型定义
interface ExpertReviewTabProps {
  expertOpinions: ExpertOpinion[];
  advisorResponses: AdvisorResponse[];
  className?: string;
  renderSummaryButton?: (stats: any, starredOpinions: Set<string>) => React.ReactNode;
}

// 专家评审页签组件
export function ExpertReviewTab({ 
  expertOpinions = [], 
  advisorResponses = [], 
  className = "",
  renderSummaryButton
}: ExpertReviewTabProps) {
  // 状态管理
  const [expandedExpert, setExpandedExpert] = useState<string | null>(null);
  const [starredOpinions, setStarredOpinions] = useState<Set<string>>(new Set());
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [showConflicts, setShowConflicts] = useState(true);
  
  // 对比功能状态
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedExperts, setSelectedExperts] = useState<Set<string>>(new Set());
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  // 切换展开状态
  const toggleExpert = (expertId: string) => {
    setExpandedExpert(expandedExpert === expertId ? null : expertId);
  };

  // 标记重要
  const toggleStar = (opinionId: string) => {
    const newStarred = new Set(starredOpinions);
    if (newStarred.has(opinionId)) {
      newStarred.delete(opinionId);
    } else {
      newStarred.add(opinionId);
    }
    setStarredOpinions(newStarred);
  };

  // 添加管理员备注
  const addAdminNote = (opinionId: string, note: string) => {
    setAdminNotes({ ...adminNotes, [opinionId]: note });
  };

  // 对比功能相关方法
  const toggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    setSelectedExperts(new Set());
  };

  const toggleExpertSelection = (expertId: string) => {
    const newSelected = new Set(selectedExperts);
    if (newSelected.has(expertId)) {
      newSelected.delete(expertId);
    } else {
      if (newSelected.size < 4) { // 最多选择4个专家对比
        newSelected.add(expertId);
      }
    }
    setSelectedExperts(newSelected);
  };

  const openCompareDialog = () => {
    if (selectedExperts.size >= 2) {
      setCompareDialogOpen(true);
    }
  };

  // 获取选中专家的详细信息
  const getSelectedExpertDetails = () => {
    return expertOpinions.filter(opinion => selectedExperts.has(opinion.id));
  };

  // 意见冲突检测逻辑 - 增强版
  const detectConflicts = (opinions: ExpertOpinion[]) => {
    const conflicts: Record<string, string[]> = {};
    
    // 1. 评审结果冲突检测
    const resultGroups = opinions.reduce((groups, opinion) => {
      if (!groups[opinion.result]) groups[opinion.result] = [];
      groups[opinion.result].push(opinion);
      return groups;
    }, {} as Record<string, ExpertOpinion[]>);
    
    // 如果同时存在"同意"和"不同意"的意见，标记为冲突
    if (resultGroups["同意"] && resultGroups["不同意"]) {
      [...resultGroups["同意"], ...resultGroups["不同意"]].forEach(opinion => {
        if (!conflicts[opinion.id]) conflicts[opinion.id] = [];
        conflicts[opinion.id].push("评审结果存在分歧");
      });
    }
    
    // 2. 评分差异过大检测（评分相差超过2分）
    const ratings = opinions.map(op => op.rating);
    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);
    if (maxRating - minRating >= 2) {
      opinions.forEach(opinion => {
        if (opinion.rating === maxRating || opinion.rating === minRating) {
          if (!conflicts[opinion.id]) conflicts[opinion.id] = [];
          conflicts[opinion.id].push("评分差异较大");
        }
      });
    }
    
    // 3. 关键要点冲突检测
    const keyPointsConflicts = new Set<string>();
    const positiveKeywords = ["同意", "支持", "可行", "合理", "充分", "完善"];
    const negativeKeywords = ["不同意", "反对", "不可行", "不合理", "不足", "缺乏", "问题"];
    
    opinions.forEach(opinion => {
      const opinionText = `${opinion.opinion} ${opinion.detailedOpinion || ""}`.toLowerCase();
      const keyPoints = opinion.key_points.join(" ").toLowerCase();
      
      const hasPositive = positiveKeywords.some(keyword => 
        opinionText.includes(keyword) || keyPoints.includes(keyword)
      );
      const hasNegative = negativeKeywords.some(keyword => 
        opinionText.includes(keyword) || keyPoints.includes(keyword)
      );
      
      if (hasPositive && hasNegative) {
        if (!conflicts[opinion.id]) conflicts[opinion.id] = [];
        conflicts[opinion.id].push("关键要点存在矛盾");
      }
    });
    
    // 4. 专业领域相同但意见不同
    const specialtyGroups = opinions.reduce((groups, opinion) => {
      opinion.expertise.forEach(specialty => {
        if (!groups[specialty]) groups[specialty] = [];
        groups[specialty].push(opinion);
      });
      return groups;
    }, {} as Record<string, ExpertOpinion[]>);
    
    Object.values(specialtyGroups).forEach(group => {
      if (group.length >= 2) {
        const results = new Set(group.map(op => op.result));
        if (results.size > 1) {
          group.forEach(opinion => {
            if (!conflicts[opinion.id]) conflicts[opinion.id] = [];
            conflicts[opinion.id].push("同专业领域专家意见分歧");
          });
        }
      }
    });
    
    return conflicts;
  };

  // 计算统计数据
  const stats = useMemo(() => {
    const total = expertOpinions.length;
    const agree = expertOpinions.filter(op => op.result === "同意").length;
    const modifyAgree = expertOpinions.filter(op => op.result === "必要的修改后同意").length;
    const transferMeeting = expertOpinions.filter(op => op.result === "转会议").length;
    const disagree = expertOpinions.filter(op => op.result === "不同意").length;
    
    const conflicts = detectConflicts(expertOpinions);
    const conflictCount = Object.keys(conflicts).length;
    
    const avgRating = expertOpinions.length > 0 
      ? expertOpinions.reduce((sum, op) => sum + op.rating, 0) / expertOpinions.length 
      : 0;

    return {
      total,
      agree,
      modifyAgree,
      transferMeeting,
      disagree,
      agreePercent: total > 0 ? Math.round((agree / total) * 100) : 0,
      modifyAgreePercent: total > 0 ? Math.round((modifyAgree / total) * 100) : 0,
      transferMeetingPercent: total > 0 ? Math.round((transferMeeting / total) * 100) : 0,
      disagreePercent: total > 0 ? Math.round((disagree / total) * 100) : 0,
      conflicts,
      conflictCount,
      avgRating: Math.round(avgRating * 10) / 10
    };
  }, [expertOpinions]);



  // 在组件外部调用汇总报告按钮渲染器
  React.useEffect(() => {
    if (renderSummaryButton) {
      renderSummaryButton(stats, starredOpinions);
    }
  }, [renderSummaryButton, stats, starredOpinions]);
  
  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* 评审结果统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">同意</p>
                <p className="text-2xl font-bold text-slate-800">{stats.agree}</p>
                <p className="text-xs text-slate-500">{stats.agreePercent}%</p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-violet-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">必要的修改后同意</p>
                <p className="text-2xl font-bold text-slate-800">{stats.modifyAgree}</p>
                <p className="text-xs text-slate-500">{stats.modifyAgreePercent}%</p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl shadow-sm">
                <Clock className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">转会议</p>
                <p className="text-2xl font-bold text-slate-800">{stats.transferMeeting}</p>
                <p className="text-xs text-slate-500">{stats.transferMeetingPercent}%</p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl shadow-sm">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 border-rose-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm text-slate-600 font-medium">不同意</p>
                <p className="text-2xl font-bold text-slate-800">{stats.disagree}</p>
                <p className="text-xs text-slate-500">{stats.disagreePercent}%</p>
                  </div>
              <div className="p-2.5 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl shadow-sm">
                <AlertCircle className="h-8 w-8 text-rose-600" />
                  </div>
                </div>
              </Card>
        </div>

        {/* 专家评审意见列表 - 现代卡片式设计 */}
        <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              专家评审意见 ({expertOpinions.length})
            </div>
              <div className="flex items-center space-x-3">
                {/* 对比模式操作区域 */}
                {isCompareMode ? (
                  /* 简化的对比入口 */
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleCompareMode}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    退出对比
                  </Button>
                ) : (
                  /* 专家对比入口按钮 */
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleCompareMode}
                    className="text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <GitCompare className="h-4 w-4 mr-1.5" />
                    专家对比
                  </Button>
                )}
              </div>
          </CardTitle>
            
            {/* 对比模式提示 */}
            {isCompareMode && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-blue-700">
                    <Target className="h-4 w-4 mr-2" />
                    <span className="font-medium">对比模式已启用</span>
                  </div>
                  
                  {/* 选择状态 */}
                  <div className="flex items-center px-2.5 py-1 bg-blue-100 rounded-full border border-blue-300">
                    <span className="text-xs font-medium text-blue-800">
                      已选择 {selectedExperts.size}/4
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-blue-600 mb-3">
                  您可以勾选2-4位专家后点击"开始对比"，系统将为您分析专家在8项评审标准上的意见差异，自动识别一致认可和存在争议的关键问题，计算专家意见的统一程度，并为您提供针对性的处理建议。
                </p>
                
                {/* 对比操作区域 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* 全选/取消全选 */}
                    <button
                      onClick={() => {
                        if (selectedExperts.size === Math.min(expertOpinions.length, 4)) {
                          // 如果已全选，则取消全选
                          setSelectedExperts(new Set());
                        } else {
                          // 否则全选（最多4个）
                          const allExpertIds = expertOpinions.slice(0, 4).map(op => op.id);
                          setSelectedExperts(new Set(allExpertIds));
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                    >
                      {selectedExperts.size === Math.min(expertOpinions.length, 4) ? "取消全选" : "全选"}
                    </button>
                    
                    {/* 清空选择 */}
                    {selectedExperts.size > 0 && (
                      <button
                        onClick={() => setSelectedExperts(new Set())}
                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                      >
                        清空选择
                      </button>
                    )}
                  </div>
                  
                  {/* 开始对比按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCompareDialog}
                    disabled={selectedExperts.size < 2}
                    className="text-sm border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
                  >
                    <BarChart3 className="h-4 w-4 mr-1.5" />
                    开始对比 ({selectedExperts.size})
                  </Button>
                </div>
              </div>
            )}
        </CardHeader>
          <CardContent className="px-4 pt-0 pb-4">
            <div className="space-y-3">
                {expertOpinions.map((opinion) => {
                  const isConflicted = showConflicts && stats.conflicts[opinion.id];
                  const isStarred = starredOpinions.has(opinion.id);
                  const isExpanded = expandedExpert === opinion.id;
                  
                  return (
                  <div key={opinion.id} className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    {/* 专家信息卡片头部 */}
                    <div className="px-3 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          {/* 对比模式选择框 */}
                          {isCompareMode && (
                        <div className="flex items-center">
                              <Checkbox
                                checked={selectedExperts.has(opinion.id)}
                                onCheckedChange={() => toggleExpertSelection(opinion.id)}
                                disabled={!selectedExperts.has(opinion.id) && selectedExperts.size >= 4}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </div>
                          )}
                          
                          {/* 专家头像 */}
                          <div className="relative">
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-600 font-medium flex items-center justify-center text-sm border ${
                              selectedExperts.has(opinion.id) ? "border-blue-400 ring-2 ring-blue-200" : "border-blue-200"
                            }`}>
                              {opinion.expertName ? opinion.expertName.charAt(0) : 'E'}
                            </div>
                            {isStarred && (
                              <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="h-2 w-2 text-yellow-600 fill-yellow-600" />
                              </div>
                            )}
                            {selectedExperts.has(opinion.id) && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          
                          {/* 专家基本信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-0.5">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{opinion.expertName}</h3>
                              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded whitespace-nowrap">{opinion.title}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="truncate">{opinion.department}</span>
                              <span>•</span>
                              <span className="whitespace-nowrap">{opinion.date}</span>
                          </div>
                          </div>
                        </div>
                        
                        {/* 评审结果和操作按钮 */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 inline-flex text-xs font-medium rounded-full ${
                          opinion.result === "同意" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : opinion.result === "必要的修改后同意" 
                              ? "bg-amber-50 text-amber-700 border border-amber-200" 
                            : opinion.result === "转会议"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {opinion.result}
                        </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpert(opinion.id);
                            }}
                            className="h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-gray-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI总结（包含关键点标签） */}
                    <div className="px-3 pt-0">
                      {opinion.aiSummary && (
                        <div className="p-2.5" style={{ marginLeft: '40px' }}>
                          <div className="flex items-center mb-2">
                            <div className="h-3 w-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm mr-1.5"></div>
                            <span className="text-xs font-medium text-slate-600">AI分析总结</span>
                          </div>
                          
                          {/* 关键点标签 */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {opinion.key_points.slice(0, 4).map((point: string, index: number) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {point}
                              </span>
                            ))}
                            {opinion.key_points.length > 4 && (
                              <span className="text-xs text-gray-500 self-center">+{opinion.key_points.length - 4}个</span>
                            )}
                          </div>
                          
                          {/* AI总结文本 */}
                          <div className="text-xs text-slate-700 leading-relaxed">
                              {opinion.aiSummary}
                            </div>
                        </div>
                          )}
                    </div>
                    
                    {/* 展开的详细内容 */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 rounded-b-lg">
                        <div className="px-3 py-3 space-y-3">
                          {/* 完整评审意见 */}
                          <div className="bg-white px-3 py-3 rounded-md border border-gray-200 shadow-sm" style={{ marginLeft: '40px' }}>
                            <div className="flex items-center mb-2">
                              <div className="h-3 w-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-sm mr-1.5"></div>
                              <h4 className="text-sm font-semibold text-gray-900">完整评审意见</h4>
                            </div>
                            <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                {opinion.opinion}
                              </div>
                            </div>
                            


                            {/* 管理员备注 */}
                            {adminNotes[opinion.id] && (
                            <div className="bg-blue-50 border border-blue-200 px-3 pt-3 rounded-md" style={{ marginLeft: '40px' }}>
                              <div className="text-xs font-medium text-blue-800 mb-1.5">管理员备注</div>
                              <div className="text-xs text-blue-700 whitespace-pre-line">
                                  {adminNotes[opinion.id]}
                                </div>
                              </div>
                            )}
                          </div>
                      </div>
                    )}
                  </div>
                  );
                })}
          </div>
        </CardContent>
      </Card>

      {/* 独立顾问回复 - 现代卡片风格 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
            独立顾问回复 ({advisorResponses.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-0 pb-4">
          <div className="space-y-3">
            {advisorResponses.map((advisor) => (
              <div key={advisor.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                {/* 顾问基本信息 */}
                <div className="flex items-start space-x-3">
                  {/* 头像 */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-50 to-indigo-100 border border-gray-200 text-gray-600 font-medium flex items-center justify-center text-sm flex-shrink-0">
                      {advisor.advisorName ? advisor.advisorName.charAt(0) : 'A'}
                    </div>
                  
                  {/* 顾问信息和内容 */}
                    <div className="flex-1 min-w-0">
                    {/* 顾问基本信息 */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{advisor.advisorName}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                          <span>{advisor.organization}</span>
                          <span>•</span>
                          <span>{advisor.title}</span>
                          <span>•</span>
                          <span>{advisor.date}</span>
                    </div>
                  </div>
                      
                      {/* 展开按钮 */}
                  <Button
                        variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const detailEl = document.getElementById(`advisor-${advisor.id}`);
                      if (detailEl) {
                        const isHidden = detailEl.classList.contains('hidden');
                        detailEl.classList.toggle('hidden', !isHidden);
                        
                        // 同时切换按钮图标
                        const btnEl = e.currentTarget as HTMLButtonElement;
                        const iconEl = btnEl.querySelector('.btn-icon');
                        if (isHidden) {
                          iconEl?.classList.replace('rotate-0', '-rotate-180');
                        } else {
                          iconEl?.classList.replace('-rotate-180', 'rotate-0');
                        }
                      }
                    }}
                        className="h-7 w-7 p-0"
                  >
                        <ChevronDown className="h-4 w-4 btn-icon rotate-0 transition-transform duration-200" />
                  </Button>
                  </div>
                  
                    {/* 问题和回复类型 */}
                    <div className="space-y-2" style={{ marginLeft: '0px' }}>
                      <div className="bg-blue-50 rounded-lg px-3 py-2">
                        <div className="text-xs text-blue-600 font-medium mb-1">{advisor.responseType}</div>
                        <div className="text-sm text-blue-800">{advisor.question}</div>
                  </div>
                </div>
                
                {/* 展开的详细内容 */}
                    <div id={`advisor-${advisor.id}`} className="hidden mt-3 space-y-3" style={{ marginLeft: '0px' }}>
                      {/* 完整回复 */}
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-4 w-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded flex items-center justify-center">
                            <FileText className="h-2.5 w-2.5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-700">完整回复</span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {advisor.response}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 专家对比对话框 */}
      <ExpertCompareDialog
        isOpen={compareDialogOpen}
        onClose={() => setCompareDialogOpen(false)}
        expertOpinions={getSelectedExpertDetails()}
        onExport={(data) => {
          // 自定义导出逻辑，可以根据需要处理导出数据
          console.log("专家对比报告导出:", data);
          // 这里可以添加实际的导出功能，比如下载文件等
        }}
      />
      </div>
    </TooltipProvider>
  );
}

export default ExpertReviewTab;

// 汇总报告生成器组件
export function ExpertReviewSummaryDialog({ 
  stats, 
  starredOpinions,
  trigger 
}: {
  stats: {
    total: number;
    agree: number;
    modifyAgree: number;
    transferMeeting: number;
    disagree: number;
    agreePercent: number;
    modifyAgreePercent: number;
    transferMeetingPercent: number;
    disagreePercent: number;
    conflicts: Record<string, string[]>;
    conflictCount: number;
    avgRating: number;
  } | null;
  starredOpinions: Set<string>;
  trigger: React.ReactNode;
}) {
  // 如果 stats 为空，提供默认值
  const safeStats = stats || {
    total: 0,
    agree: 0,
    modifyAgree: 0,
    disagree: 0,
    agreePercent: 0,
    modifyAgreePercent: 0,
    disagreePercent: 0,
    conflicts: {},
    conflictCount: 0,
    avgRating: 0
  };
  // 计算冲突类型分布
  const getConflictTypeDistribution = () => {
    if (!safeStats.conflicts || typeof safeStats.conflicts !== 'object') {
      return {};
    }
    const allConflicts = Object.values(safeStats.conflicts).flat();
    const distribution: Record<string, number> = {};
    allConflicts.forEach(conflict => {
      distribution[conflict] = (distribution[conflict] || 0) + 1;
    });
    return distribution;
  };

  const conflictDistribution = getConflictTypeDistribution();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>专家评审汇总报告</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">评审统计</h4>
            <p>总计: {safeStats.total} 位专家参与评审</p>
            <p>同意: {safeStats.agree} 位 ({safeStats.agreePercent}%)</p>
            <p>必要的修改后同意: {safeStats.modifyAgree} 位 ({safeStats.modifyAgreePercent}%)</p>
            <p>转会议: {safeStats.transferMeeting} 位 ({safeStats.transferMeetingPercent}%)</p>
            <p>不同意: {safeStats.disagree} 位 ({safeStats.disagreePercent}%)</p>
            <p>意见冲突: {safeStats.conflictCount} 处</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">重要意见标记</h4>
            <p>{starredOpinions.size} 个意见被标记为重要</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">冲突分析</h4>
            {safeStats.conflictCount > 0 ? (
              <div className="space-y-2">
                <p className="text-orange-600">检测到 {safeStats.conflictCount} 处意见冲突</p>
                <div className="text-sm text-gray-600">
                  <p>冲突类型分布：</p>
                  <ul className="list-disc pl-4 mt-1">
                    {Object.entries(conflictDistribution).map(([type, count]) => (
                      <li key={type}>{type}: {count} 处</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-green-600">所有专家意见一致，无明显冲突</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
