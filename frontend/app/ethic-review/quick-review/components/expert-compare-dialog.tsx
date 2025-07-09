"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  GitCompare,
  BarChart3,
  BookOpen,
  Target,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  AlertTriangleIcon,
  XCircle,
  FileText,
  Filter,
  Eye,
  EyeOff,
  Info,
  ChevronDown,
  ChevronUp,
  List,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import ReviewResultPieChart from "./review-result-pie-chart"

// 专家意见数据类型定义
export interface ExpertOpinion {
  id: string;
  expertId: string;
  expertName: string;
  department: string;
  title: string;
  date: string;
  opinion: string;
  detailedOpinion?: string;
  rating: number;
  result: "同意" | "必要的修改后同意" | "不同意" | "转会议";
  category: string;
  specialty: string;
  expertise: string[];
  key_points: string[];
  follow_up_questions: string[];
  aiSummary: string;
  // 审查工作表评审结果
  reviewCriteria?: ReviewCriteriaResult[];
}

// 审查工作表评审标准结果
export interface ReviewCriteriaResult {
  criteriaId: string;
  criteriaName: string;
  category: string;
  description: string;
  result: "同意" | "不同意" | "不适用";
  comment?: string;
}

// 组件Props类型定义
export interface ExpertCompareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expertOpinions: ExpertOpinion[];
  onExport?: (data: any) => void; // 可选的导出回调
}

// 专家对比对话框组件
export default function ExpertCompareDialog({ 
  isOpen, 
  onClose, 
  expertOpinions,
  onExport
}: ExpertCompareDialogProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "detailed">("overview");
  const [filterType, setFilterType] = useState<"all" | "unanimous" | "conflict" | "agree" | "disagree" | "notApplicable">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [consensusExpanded, setConsensusExpanded] = useState<boolean>(false);
  const [conflictExpanded, setConflictExpanded] = useState<boolean>(false);

  // 模拟审查工作表数据
  const reviewCriteriaTemplate: ReviewCriteriaResult[] = [
    {
      criteriaId: "1",
      criteriaName: "研究目的明确性",
      category: "研究设计",
      description: "研究目的是否明确、具体，符合伦理审查要求",
      result: "同意",
      comment: ""
    },
    {
      criteriaId: "2", 
      criteriaName: "研究方法科学性",
      category: "研究设计",
      description: "研究方法是否科学合理，能够达到研究目的",
      result: "同意",
      comment: ""
    },
    {
      criteriaId: "3",
      criteriaName: "受试者招募程序",
      category: "受试者保护",
      description: "受试者招募程序是否公平、透明",
      result: "同意", 
      comment: ""
    },
    {
      criteriaId: "4",
      criteriaName: "知情同意书完整性",
      category: "受试者保护", 
      description: "知情同意书内容是否完整、易懂",
      result: "不同意",
      comment: ""
    },
    {
      criteriaId: "5",
      criteriaName: "风险效益评估",
      category: "风险管理",
      description: "研究风险与效益比例是否合理",
      result: "同意",
      comment: ""
    },
    {
      criteriaId: "6",
      criteriaName: "数据安全保护",
      category: "数据管理",
      description: "数据收集、存储、使用的安全性措施",
      result: "不适用",
      comment: ""
    },
    {
      criteriaId: "7",
      criteriaName: "隐私保护措施",
      category: "数据管理", 
      description: "受试者隐私保护措施是否充分",
      result: "同意",
      comment: ""
    },
    {
      criteriaId: "8",
      criteriaName: "不良事件处理",
      category: "风险管理",
      description: "不良事件的预防和处理机制",
      result: "不同意",
      comment: ""
    }
  ];

  // 为每个专家生成审查工作表数据（模拟不同的评审结果）
  const getExpertReviewCriteria = (expertId: string): ReviewCriteriaResult[] => {
    return reviewCriteriaTemplate.map(criteria => {
      // 根据专家ID模拟不同的评审结果
      let result: "同意" | "不同意" | "不适用" = criteria.result;
      
      if (expertId === "expert1") {
        // 第一个专家：大部分同意
        if (criteria.criteriaId === "4") result = "不同意";
        if (criteria.criteriaId === "8") result = "不同意";
      } else if (expertId === "expert2") {
        // 第二个专家：有不同意见
        if (criteria.criteriaId === "2") result = "不同意";
        if (criteria.criteriaId === "4") result = "同意";
        if (criteria.criteriaId === "6") result = "同意";
        if (criteria.criteriaId === "8") result = "同意";
      }
      
      return {
        ...criteria,
        result,
        comment: result === "不同意" ? "需要进一步完善相关内容" : ""
      };
    });
  };

  // 将审查工作表数据添加到专家意见中
  const expertsWithCriteria = expertOpinions.map((expert, index) => ({
    ...expert,
    reviewCriteria: getExpertReviewCriteria(`expert${index + 1}`)
  }));

  // 获取所有评审标准
  const allCriteria = reviewCriteriaTemplate;
  
  // 获取所有分类
  const allCategories = [...new Set(allCriteria.map(c => c.category))];

  // 分析每个标准的专家意见分布
  const getCriteriaAnalysis = () => {
    return allCriteria.map(criteria => {
      const expertResults = expertsWithCriteria.map(expert => {
        const expertCriteria = expert.reviewCriteria?.find(c => c.criteriaId === criteria.criteriaId);
        return {
          expertId: expert.id,
          expertName: expert.expertName,
          result: expertCriteria?.result || "同意",
          comment: expertCriteria?.comment || ""
        };
      });

      // 统计结果分布
      const resultCounts = expertResults.reduce((acc, er) => {
        acc[er.result] = (acc[er.result] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // 判断是否有冲突
      const hasConflict = Object.keys(resultCounts).length > 1;
      
      // 判断是否一致
      const isUnanimous = Object.keys(resultCounts).length === 1;

      return {
        ...criteria,
        expertResults,
        resultCounts,
        hasConflict,
        isUnanimous
      };
    });
  };

  const criteriaAnalysis = getCriteriaAnalysis();

  // 过滤数据
  const getFilteredCriteria = () => {
    let filtered = criteriaAnalysis;

    // 按分类过滤
    if (selectedCategory !== "all") {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // 按结果类型过滤
    if (filterType !== "all") {
      switch (filterType) {
        case "unanimous":
          filtered = filtered.filter(c => c.isUnanimous);
          break;
        case "conflict":
          filtered = filtered.filter(c => c.hasConflict);
          break;
        case "agree":
          filtered = filtered.filter(c => c.isUnanimous && c.expertResults[0].result === "同意");
          break;
        case "disagree":
          filtered = filtered.filter(c => c.isUnanimous && c.expertResults[0].result === "不同意");
          break;
        case "notApplicable":
          filtered = filtered.filter(c => c.isUnanimous && c.expertResults[0].result === "不适用");
          break;
      }
    }

         return filtered;
   };

  // 计算对比数据
  const compareData = useMemo(() => {
    if (expertOpinions.length < 2) return null;

    // 评审结果统计
    const results = expertOpinions.reduce((acc, opinion) => {
      acc[opinion.result] = (acc[opinion.result] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 评分分析
    const ratings = expertOpinions.map(op => op.rating);
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);
    const ratingDiff = maxRating - minRating;

    // 专业领域分布
    const allExpertise = expertOpinions.flatMap(op => op.expertise);
    const expertiseCount = allExpertise.reduce((acc, exp) => {
      acc[exp] = (acc[exp] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 关键点词云数据
    const allKeyPoints = expertOpinions.flatMap(op => op.key_points);
    const keyPointsCount = allKeyPoints.reduce((acc, point) => {
      acc[point] = (acc[point] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 一致性分析（基于评审结果）
    const consensusLevel = Object.keys(results).length === 1 ? "完全一致" :
                          Object.keys(results).length === 2 && results["必要的修改后同意"] ? "基本一致" : 
                          "存在分歧";

    return {
      results,
      ratings: { avg: avgRating, max: maxRating, min: minRating, diff: ratingDiff },
      expertise: expertiseCount,
      keyPoints: keyPointsCount,
      consensus: consensusLevel
    };
  }, [expertOpinions]);

  // 处理导出功能
  const handleExport = () => {
    if (onExport && compareData) {
      const exportData = {
        expertOpinions,
        compareData,
        timestamp: new Date().toISOString(),
        totalExperts: expertOpinions.length
      };
      onExport(exportData);
    } else {
      // 默认导出逻辑（可以是下载JSON文件等）
      console.log("导出对比报告", { expertOpinions, compareData });
    }
  };

  if (!compareData) return null;

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center">
            <GitCompare className="h-5 w-5 mr-2 text-blue-600" />
            专家评价对比分析 ({expertOpinions.length}位专家)
          </DialogTitle>
        </DialogHeader>

        {/* 标签页导航 */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-4 flex-shrink-0">
          <button
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "overview" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="h-4 w-4 inline mr-1.5" />
            总览对比
          </button>
          <button
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "detailed" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("detailed")}
          >
            <BookOpen className="h-4 w-4 inline mr-1.5" />
            详细对比
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 评审结果分布与评审标准一致性分布 */}
              <Card>
                                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        <span style={{fontSize: '18px'}}>专家评价对比分析</span>
                      </div>
                    <div className="text-xs text-gray-500">
                      共 {expertOpinions.length} 位专家参与评审 • {allCriteria.length} 项评审标准
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* 两个统计图在同一行 */}
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    {/* 左侧：评审结果分布 */}
                    <div>
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                        <h3 className="font-medium text-gray-900">评审结果分布</h3>
                      </div>
                      <ReviewResultPieChart 
                        data={Object.entries(compareData.results).map(([result, count]) => ({
                          name: result,
                          value: count,
                          color: result === "同意" ? "#10b981" :
                                 result === "必要的修改后同意" ? "#f59e0b" :
                                 result === "转会议" ? "#8b5cf6" : "#ef4444"
                        }))}
                        height={240}
                      />
                    </div>
                    
                    {/* 右侧：评审标准一致性分布 */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2 text-blue-600" />
                          <h3 className="font-medium text-gray-900">评审标准一致性分布</h3>
                        </div>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              aria-label="查看计算说明"
                              title={undefined}
                            >
                              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="left" 
                            align="start" 
                            className="max-w-md p-3 z-50 bg-white border border-gray-200 shadow-lg rounded-md"
                            sideOffset={5}
                          >
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>决策依据一致性计算：</strong>
                                <br />
                                一致标准数 ÷ 总标准数 × 100%
                              </div>
                              <div className="text-xs text-gray-600 border-t pt-2">
                                * 80%以上为高度一致，60-80%为基本一致，60%以下需重点关注
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        共 {allCriteria.length} 项标准
                      </div>
                      
                      {/* 统计条形图 */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-16 text-sm text-gray-600">共识项</div>
                          <div className="flex-1 mx-3">
                            <div className="bg-gray-200 rounded-full h-3 relative">
                              <div 
                                className="bg-green-500 h-3 rounded-full flex items-center justify-end pr-1.5"
                                style={{
                                  width: `${(criteriaAnalysis.filter(c => c.isUnanimous).length / allCriteria.length) * 100}%`
                                }}
                              >
                                <span className="text-white text-xs font-medium">
                                  {criteriaAnalysis.filter(c => c.isUnanimous).length}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-12 text-right text-sm font-medium text-green-600">
                            {criteriaAnalysis.filter(c => c.isUnanimous).length}项
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-16 text-sm text-gray-600">分歧点</div>
                          <div className="flex-1 mx-3">
                            <div className="bg-gray-200 rounded-full h-3 relative">
                              <div 
                                className="bg-orange-500 h-3 rounded-full flex items-center justify-end pr-1.5"
                                style={{
                                  width: `${(criteriaAnalysis.filter(c => c.hasConflict).length / allCriteria.length) * 100}%`
                                }}
                              >
                                <span className="text-white text-xs font-medium">
                                  {criteriaAnalysis.filter(c => c.hasConflict).length}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-12 text-right text-sm font-medium text-orange-600">
                            {criteriaAnalysis.filter(c => c.hasConflict).length}项
                          </div>
                        </div>
                      </div>
                      
                      {/* 详细统计数据 */}
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {/* 决策一致性数值 */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">决策一致性</span>
                          <span className={`text-lg font-bold ${
                            (criteriaAnalysis.filter(c => c.isUnanimous).length / allCriteria.length) >= 0.8 ? "text-green-600" :
                            (criteriaAnalysis.filter(c => c.isUnanimous).length / allCriteria.length) >= 0.6 ? "text-amber-600" : "text-red-600"
                          }`}>
                            {Math.round((criteriaAnalysis.filter(c => c.isUnanimous).length / allCriteria.length) * 100)}%
                          </span>
                        </div>
                        
                        {/* 分类统计 */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs font-medium text-gray-700 mb-2">分类统计</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {allCategories.map((category, index) => {
                              const categoryCount = allCriteria.filter(c => c.category === category).length;
                              const categoryConsensus = criteriaAnalysis.filter(c => 
                                c.category === category && c.isUnanimous
                              ).length;
                              const consensusRate = Math.round((categoryConsensus / categoryCount) * 100);
                              
                              return (
                                <div key={category} className="flex justify-between">
                                  <span className="text-gray-600 truncate">{category}</span>
                                  <span className={`font-medium ${
                                    consensusRate >= 80 ? "text-green-600" :
                                    consensusRate >= 60 ? "text-amber-600" : "text-red-600"
                                  }`}>
                                    {consensusRate}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 下方：AI智能解读 */}
                  <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                      </div>
                      <span className="font-medium text-blue-900" style={{fontSize: '16px'}}>AI智能解读</span>
                      <div className="ml-auto">
                        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">智能分析</span>
                      </div>
                    </div>
                                         <div className="text-sm text-blue-800 leading-relaxed">
                       {(() => {
                         const agreeCount = compareData.results["同意"] || 0;
                         const modifyCount = compareData.results["必要的修改后同意"] || 0;
                         const transferCount = compareData.results["转会议"] || 0;
                         const disagreeCount = compareData.results["不同意"] || 0;
                         const total = expertOpinions.length;
                         const consensusRate = criteriaAnalysis.filter(c => c.isUnanimous).length / allCriteria.length;
                         const conflictCount = criteriaAnalysis.filter(c => c.hasConflict).length;
                         const consensusCount = criteriaAnalysis.filter(c => c.isUnanimous).length;
                         
                         const supportRate = (agreeCount + modifyCount) / total;
                         const agreeRate = agreeCount / total;
                         const agreePercent = Math.round(agreeRate * 100);
                         const supportPercent = Math.round(supportRate * 100);
                         const consensusPercent = Math.round(consensusRate * 100);
                         
                         return (
                           <div>
                             通过对{total}位专家评审意见的智能分析，项目整体获得{supportPercent}%的专家支持。具体而言，{agreeCount}位专家({agreePercent}%)完全同意项目实施，{modifyCount}位专家建议必要修改后同意，{transferCount}位专家建议转会议审查，{disagreeCount}位专家表示不同意。在评审标准一致性方面，专家在{consensusCount}项标准({consensusPercent}%)上达成共识，但在{conflictCount}项标准上存在分歧。
                             {agreeRate >= 0.8 ? 
                               `项目获得专家高度认可，研究设计科学合理，技术路线可行，伦理风险可控。建议项目组根据专家意见进行微调后实施。` :
                             supportRate >= 0.7 ?
                               `项目整体获得积极评价，主要关注点集中在数据保护和技术应用边界。建议项目组重点完善数据安全措施，明确技术应用范围，修改后可实施。` :
                             transferCount > 0 ?
                               `项目涉及复杂的技术和伦理问题，CRISPR技术在儿童群体中的应用需要多学科专家的深入评估。建议提交伦理委员会会议进行全面讨论，制定更详细的实施方案和风险控制措施。` :
                               `项目存在较大争议，专家主要担忧技术风险和伦理合规性。建议项目组全面审视研究方案，加强风险评估和伦理保护措施，必要时重新设计研究方案。`
                             }
                             {consensusRate >= 0.8 ? 
                               `专家在评审标准上高度一致，决策依据充分可靠，建议优先处理专家一致认可的${consensusCount}项标准要求。` :
                             consensusRate >= 0.6 ?
                               `专家在多数标准上达成共识，但需重点关注${conflictCount}项存在分歧的标准，通过进一步沟通达成更广泛共识。` :
                               `专家意见分歧较大，建议深入分析${conflictCount}项分歧标准的具体原因，必要时组织专家会议进行深入讨论和协商。`
                             }
                           </div>
                         );
                       })()}
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* 关注点的广度分析 - 独立卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-purple-600" />
                      <span style={{fontSize: '18px'}}>关注点的广度分析</span>
                    </div>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                          aria-label="查看广度分析说明"
                          title={undefined}
                        >
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="left" 
                        align="start" 
                        className="max-w-md p-3 z-50 bg-white border border-gray-200 shadow-lg rounded-md"
                        sideOffset={5}
                      >
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>广度分析数据解读：</strong>
                            <br />
                            • <strong>评审分类关注度：</strong>基于{allCriteria.length}项评审标准的分类统计
                            <br />
                            • <strong>专家关注重点：</strong>基于{expertOpinions.length}位专家在不同标准上的"不同意"意见分布
                          </div>
                          <div>
                            <strong>统计指标说明：</strong>
                            <br />
                            • <strong>评审分类：</strong>共{allCategories.length}个分类，涵盖评审的各个维度
                            <br />
                            • <strong>参与专家：</strong>共{expertOpinions.length}位专家参与对比分析
                            <br />
                            • <strong>争议比例：</strong>{Math.round((criteriaAnalysis.filter(c => c.hasConflict).length / allCriteria.length) * 100)}%的标准存在专家意见分歧
                          </div>
                          <div className="text-xs text-gray-600 border-t pt-2">
                            * 广度分析帮助识别专家关注的不同层面，确保评审的全面性
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 顶部统计概览 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">{allCategories.length}</div>
                        <div className="text-xs text-gray-600">评审分类</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-purple-600">{expertOpinions.length}</div>
                        <div className="text-xs text-gray-600">参与专家</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-orange-600">
                          {Math.round((criteriaAnalysis.filter(c => c.hasConflict).length / allCriteria.length) * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">争议比例</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 分类关注度统计 - 雷达图 */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-800 mb-3 flex items-center" style={{fontSize: '16px'}}>
                          <div className="w-1 h-4 bg-purple-500 rounded-full mr-2"></div>
                          评审分类关注度
                        </h5>
                        <div className="relative w-full h-56 flex items-center justify-center">
                          {(() => {
                            // 使用更丰富的演示数据
                            const radarData = [
                              { category: '研究设计', value: 0.85, count: '3/4' },
                              { category: '受试者保护', value: 0.92, count: '4/4' },
                              { category: '数据管理', value: 0.45, count: '2/4' },
                              { category: '风险管理', value: 0.78, count: '3/4' },
                              { category: '伦理审查', value: 0.65, count: '3/4' },
                              { category: '知情同意', value: 0.35, count: '1/4' }
                            ];
                            
                            const centerX = 100;
                            const centerY = 100;
                            const radius = 70;
                            const angleStep = (2 * Math.PI) / radarData.length;
                            
                            return (
                              <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                                {/* 背景网格 */}
                                {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
                                  <polygon
                                    key={i}
                                    points={radarData.map((_, index) => {
                                      const angle = index * angleStep - Math.PI / 2;
                                      const x = centerX + Math.cos(angle) * radius * scale;
                                      const y = centerY + Math.sin(angle) * radius * scale;
                                      return `${x},${y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke={i === 4 ? "#d1d5db" : "#f3f4f6"}
                                    strokeWidth={i === 4 ? "1.5" : "1"}
                                  />
                                ))}
                                
                                {/* 轴线 */}
                                {radarData.map((_, index) => {
                                  const angle = index * angleStep - Math.PI / 2;
                                  const x = centerX + Math.cos(angle) * radius;
                                  const y = centerY + Math.sin(angle) * radius;
                                  return (
                                    <line
                                      key={index}
                                      x1={centerX}
                                      y1={centerY}
                                      x2={x}
                                      y2={y}
                                      stroke="#e5e7eb"
                                      strokeWidth="1"
                                    />
                                  );
                                })}
                                
                                {/* 数据区域 */}
                                <polygon
                                  points={radarData.map((item, index) => {
                                    const angle = index * angleStep - Math.PI / 2;
                                    const x = centerX + Math.cos(angle) * radius * item.value;
                                    const y = centerY + Math.sin(angle) * radius * item.value;
                                    return `${x},${y}`;
                                  }).join(' ')}
                                  fill="rgba(147, 51, 234, 0.15)"
                                  stroke="#9333ea"
                                  strokeWidth="2"
                                />
                                
                                {/* 数据点 */}
                                {radarData.map((item, index) => {
                                  const angle = index * angleStep - Math.PI / 2;
                                  const x = centerX + Math.cos(angle) * radius * item.value;
                                  const y = centerY + Math.sin(angle) * radius * item.value;
                                  return (
                                    <circle
                                      key={index}
                                      cx={x}
                                      cy={y}
                                      r="3"
                                      fill="#9333ea"
                                      stroke="white"
                                      strokeWidth="1"
                                    />
                                  );
                                })}
                                
                                {/* 分类标签 */}
                                {radarData.map((item, index) => {
                                  const angle = index * angleStep - Math.PI / 2;
                                  const labelRadius = radius + 25;
                                  const x = centerX + Math.cos(angle) * labelRadius;
                                  const y = centerY + Math.sin(angle) * labelRadius;
                                  
                                  // 根据角度调整文本对齐方式
                                  let textAnchor = "middle";
                                  if (Math.cos(angle) > 0.5) textAnchor = "start";
                                  else if (Math.cos(angle) < -0.5) textAnchor = "end";
                                  
                                  return (
                                    <g key={index}>
                                      <text
                                        x={x}
                                        y={y - 3}
                                        textAnchor={textAnchor}
                                        className="text-xs font-medium fill-gray-700"
                                      >
                                        {item.category}
                                      </text>
                                      <text
                                        x={x}
                                        y={y + 10}
                                        textAnchor={textAnchor}
                                        className="text-xs fill-gray-500"
                                      >
                                        {item.count}
                                      </text>
                                    </g>
                                  );
                                })}
                                
                                {/* 中心点 */}
                                <circle
                                  cx={centerX}
                                  cy={centerY}
                                  r="2"
                                  fill="#9333ea"
                                  opacity="0.6"
                                />
                              </svg>
                            );
                          })()}
                        </div>
                      </div>

                      {/* 专家关注重点 */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-800 mb-3 flex items-center" style={{fontSize: '16px'}}>
                          <div className="w-1 h-4 bg-purple-500 rounded-full mr-2"></div>
                          专家关注重点
                        </h5>
                        <div className="space-y-3">
                          {expertOpinions.map((expert, idx) => {
                            const expertConcerns = criteriaAnalysis.filter(c => 
                              c.expertResults.find(r => r.expertId === expert.id)?.result === "不同意"
                            );
                            const concernCategories = [...new Set(expertConcerns.map(c => c.category))];
                            return (
                              <div key={expert.id} className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-sm font-medium text-gray-700">{expert.expertName}</div>
                                  <div className="text-xs text-gray-500">
                                    {concernCategories.length}/{allCategories.length} 分类
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {concernCategories.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {concernCategories.map((category, catIdx) => (
                                        <span 
                                          key={catIdx}
                                          className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                                        >
                                          {category}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-green-600">对所有标准都表示认可</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 底部关注度分析 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-3 flex items-center" style={{fontSize: '16px'}}>
                        <div className="w-1 h-4 bg-purple-500 rounded-full mr-2"></div>
                        关注度分析
                      </h6>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">高关注度分类</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-700">受试者保护</span>
                              <span className="text-purple-600 font-medium">92%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">研究设计</span>
                              <span className="text-purple-600 font-medium">85%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">需要加强关注</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-700">数据管理</span>
                              <span className="text-orange-600 font-medium">45%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">知情同意</span>
                              <span className="text-orange-600 font-medium">35%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "detailed" && (
            <div className="space-y-4">
              {/* 审查工作表标题信息 */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">伦理审查工作表对比分析</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      参与评审专家：{expertOpinions.length} 位 • 评审标准：{allCriteria.length} 项
                    </p>
                  </div>
                  
                  {/* 筛选功能 */}
                  <div className="flex space-x-0.5 bg-gray-100 p-0.5 rounded-md">
                    <Button
                      variant={filterType === "all" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilterType("all")}
                      className="text-xs px-2 py-1 h-7"
                    >
                      <List className="h-3 w-3 mr-1" />
                      全部
                    </Button>
                    <Button
                      variant={filterType === "unanimous" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilterType("unanimous")}
                      className="text-xs px-2 py-1 h-7"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      一致
                    </Button>
                    <Button
                      variant={filterType === "conflict" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilterType("conflict")}
                      className="text-xs px-2 py-1 h-7"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      分歧
                    </Button>
                  </div>
                </div>
              </div>

              {/* 评审标准对比表格 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 w-1/3">
                          评审标准明细
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 w-1/6">
                          评审分类
                        </th>
                        {expertsWithCriteria.map((expert, index) => (
                          <th key={expert.id} className="text-center py-3 px-4 font-medium text-gray-900 min-w-[120px]">
                            {expert.expertName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredCriteria().map((criteria, index) => (
                        <tr 
                          key={criteria.criteriaId} 
                          className={`hover:bg-gray-50 ${
                            criteria.hasConflict ? "bg-orange-50/30" : 
                            criteria.isUnanimous ? "bg-green-50/20" : ""
                          }`}
                        >
                                                     {/* 评审标准明细 */}
                           <td className="py-4 px-4 align-top">
                             <div>
                               <h4 className="font-medium text-gray-900 text-sm mb-1">
                                 {criteria.criteriaName}
                               </h4>
                               <p className="text-xs text-gray-600 leading-relaxed">
                                 {criteria.description}
                               </p>
                             </div>
                           </td>

                           {/* 评审分类 */}
                           <td className="py-4 px-4 align-top">
                             <span className="text-sm text-gray-700">
                               {criteria.category}
                             </span>
                           </td>
                          
                                                     {/* 各专家的评审结果 */}
                           {criteria.expertResults.map((expertResult) => (
                             <td key={expertResult.expertId} className="py-4 px-4 text-center align-top">
                               <Badge className={`${
                                 expertResult.result === "同意" ? "bg-green-100 text-green-700 border-green-300" :
                                 expertResult.result === "不同意" ? "bg-red-100 text-red-700 border-red-300" :
                                 "bg-gray-100 text-gray-700 border-gray-300"
                               }`}>
                                 {expertResult.result}
                               </Badge>
                             </td>
                           ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span>显示 {getFilteredCriteria().length} / {allCriteria.length} 项评审标准</span>
                  <span>•</span>
                  <span>存在分歧: {criteriaAnalysis.filter(c => c.hasConflict).length} 项</span>
                  <span>•</span>
                  <span>意见一致: {criteriaAnalysis.filter(c => c.isUnanimous).length} 项</span>
                </div>
                {filterType === "conflict" && (
                  <span className="text-orange-600 font-medium">
                    <AlertTriangleIcon className="h-4 w-4 inline mr-1" />
                    已筛选显示存在分歧的标准
                  </span>
                )}
                {filterType === "unanimous" && (
                  <span className="text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    已筛选显示意见一致的标准
                  </span>
                )}
              </div>

              {/* 无结果提示 */}
              {getFilteredCriteria().length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的评审标准</h3>
                  <p className="text-gray-600 mb-4">当前筛选条件下没有符合条件的评审标准</p>
                  <Button
                    variant="outline"
                    onClick={() => setFilterType("all")}
                    className="text-sm"
                  >
                    显示全部标准
                  </Button>
                </div>
              )}
            </div>
          )}


        </div>

        {/* 对话框底部操作 */}
        <div className="flex justify-end space-x-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  );
} 