"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Users,
  UserPlus,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Star,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react"

// 专家意见数据类型定义
interface ExpertOpinion {
  id: string;
  expertId: string;
  expertName: string;
  department: string;
  title: string;
  date: string;
  opinion: string;
  detailedOpinion?: string;
  rating: number;
  result: "同意" | "修改后同意" | "不同意";
  category: string;
  specialty: string;
  expertise: string[];
  key_points: string[];
  follow_up_questions: string[];
  aiSummary: string;
}

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
    const modifyAgree = expertOpinions.filter(op => op.result === "修改后同意").length;
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
      disagree,
      agreePercent: total > 0 ? Math.round((agree / total) * 100) : 0,
      modifyAgreePercent: total > 0 ? Math.round((modifyAgree / total) * 100) : 0,
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
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">同意</p>
                <p className="text-2xl font-bold text-green-600">{stats.agree}</p>
                <p className="text-xs text-gray-500">{stats.agreePercent}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">修改后同意</p>
                <p className="text-2xl font-bold text-amber-600">{stats.modifyAgree}</p>
                <p className="text-xs text-gray-500">{stats.modifyAgreePercent}%</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">不同意</p>
                <p className="text-2xl font-bold text-red-600">{stats.disagree}</p>
                <p className="text-xs text-gray-500">{stats.disagreePercent}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className={`p-4 cursor-pointer transition-colors ${stats.conflictCount > 0 ? 'hover:bg-orange-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">意见冲突</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.conflictCount}</p>
                    <p className="text-xs text-gray-500">
                      {stats.conflictCount > 0 ? "需关注" : "无冲突"}
                    </p>
                  </div>
                  <div className="relative">
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                    {stats.conflictCount > 0 && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                {stats.conflictCount > 0 ? (
                  <div>
                    <p className="font-semibold">检测到 {stats.conflictCount} 处意见冲突</p>
                    <p className="text-xs mt-1">包括评审结果分歧、评分差异、关键要点矛盾等</p>
                  </div>
                ) : (
                  <p>所有专家意见一致，无明显冲突</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 专家评审意见列表 - 集成工具栏 */}
        <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              专家评审意见 ({expertOpinions.length})
            </div>

          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/5">专家信息</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/6">评审结果</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-700">AI总结评审意见</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-16">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expertOpinions.map((opinion) => {
                  const isConflicted = showConflicts && stats.conflicts[opinion.id];
                  const isStarred = starredOpinions.has(opinion.id);
                  const isExpanded = expandedExpert === opinion.id;
                  
                  return (
                  <React.Fragment key={opinion.id}>
                    <tr className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''} ${isConflicted ? 'border-l-4 border-orange-400' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center text-xs">
                              {opinion.expertName ? opinion.expertName.charAt(0) : 'E'}
                            </div>
                            {isConflicted && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>意见存在冲突</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {isStarred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{opinion.expertName}</div>
                            <div className="text-xs text-gray-500">{opinion.department}</div>
                            <div className="text-xs text-gray-500">{opinion.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                          opinion.result === "同意" 
                            ? "bg-green-50 text-green-700" 
                            : opinion.result === "修改后同意" 
                            ? "bg-amber-50 text-amber-700" 
                            : "bg-red-50 text-red-700"
                        }`}>
                          {opinion.result}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          {/* 关键点标签 */}
                          <div className="flex flex-wrap gap-1">
                            {opinion.key_points.slice(0, 3).map((point: string, index: number) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {point}
                              </span>
                            ))}
                            {opinion.key_points.length > 3 && (
                              <span className="text-xs text-gray-500">+{opinion.key_points.length - 3}个</span>
                            )}
                          </div>
                          {/* AI总结 */}
                          {opinion.aiSummary && (
                            <div className="text-xs text-gray-600 line-clamp-2">
                              {opinion.aiSummary}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpert(opinion.id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                          )}
                        </Button>
                      </td>
                    </tr>
                    
                    {/* 展开的详细内容 */}
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-4 py-4">
                          <div className="space-y-3">
                            {/* 主要评审意见 - 重点突出 */}
                            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                              <div className="text-base font-semibold text-gray-900 mb-2">专家评审意见</div>
                              <div className="text-sm text-gray-700 leading-relaxed">
                                {opinion.opinion}
                              </div>
                            </div>
                            
                            {/* 详细评审意见 */}
                            {opinion.detailedOpinion && (
                              <div className="bg-white p-4 rounded border">
                                <div className="text-sm font-medium text-gray-700 mb-2">详细评审意见</div>
                                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                  {opinion.detailedOpinion}
                                </div>
                              </div>
                            )}

                            {/* 冲突警告 */}
                            {isConflicted && (
                              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                                  <div className="text-sm font-medium text-orange-800">意见冲突提醒</div>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-sm text-orange-700">
                                    检测到以下类型的意见冲突：
                                  </div>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {stats.conflicts[opinion.id]?.map((conflict, index) => (
                                      <li key={index} className="text-sm text-orange-700">
                                        {conflict}
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="text-xs text-orange-600 mt-2 p-2 bg-orange-100 rounded">
                                    💡 建议：请重点关注此意见并考虑与其他专家进一步协调沟通。
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 管理员备注 */}
                            {adminNotes[opinion.id] && (
                              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <div className="text-sm font-medium text-blue-800 mb-2">管理员备注</div>
                                <div className="text-sm text-blue-700 whitespace-pre-line">
                                  {adminNotes[opinion.id]}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 独立顾问回复 - 紧凑卡片风格 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
            独立顾问回复 ({advisorResponses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advisorResponses.map((advisor) => (
              <div key={advisor.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                {/* 顾问基本信息 - 紧凑布局 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center text-xs flex-shrink-0">
                      {advisor.advisorName ? advisor.advisorName.charAt(0) : 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{advisor.advisorName}</h4>
                      <p className="text-xs text-gray-500 truncate">{advisor.organization}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
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
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronDown className="h-3 w-3 btn-icon rotate-0 transition-transform duration-200" />
                  </Button>
                </div>

                {/* 简要信息 */}
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{advisor.responseType}</div>
                    <div className="text-xs text-gray-700 line-clamp-2 bg-indigo-50 p-2 rounded">
                      {advisor.question}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">主要建议:</div>
                    <div className="text-xs text-gray-800">
                      {advisor.recommendations[0]}
                    </div>
                    {advisor.recommendations.length > 1 && (
                      <div className="text-xs text-gray-500">
                        (+{advisor.recommendations.length - 1}条)
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 展开的详细内容 */}
                <div id={`advisor-${advisor.id}`} className="hidden mt-3 pt-3 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">完整回复</div>
                      <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded whitespace-pre-line">
                        {advisor.response}
                      </div>
                    </div>
                    
                    {/* 所有建议 */}
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">所有建议</div>
                      <ul className="list-disc pl-3 text-xs text-green-800 space-y-1 p-2 bg-green-50 rounded">
                        {advisor.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
    disagree: number;
    agreePercent: number;
    modifyAgreePercent: number;
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
            <p>修改后同意: {safeStats.modifyAgree} 位 ({safeStats.modifyAgreePercent}%)</p>
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
