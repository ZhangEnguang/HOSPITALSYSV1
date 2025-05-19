"use client"

import { useState, useEffect } from "react";
import { Zap, User, ClipboardCheck, Calendar, Download, Printer, Check, ChevronDown, ChevronUp, FileText, RotateCw, PenSquare, MessageSquareText, FileCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// 专家意见类型
type ExpertOpinion = {
  id: string;
  expertId: string;
  expertName: string;
  department: string;
  title: string;
  date: string;
  opinion: string;
  rating: number;
  result: string;
  category: string;
  key_points: string[];
};

// AI意见类型，简化为单一文本
type AISummary = {
  text: string;
  date: string;
  version: string;
};

interface AISummaryPanelProps {
  projectId: string;
  expertOpinions?: ExpertOpinion[];
  aiSummary?: any; // 兼容旧的格式
  onExport?: (format: "pdf" | "docx" | "excel") => void;
  onPrint?: () => void;
}

export default function AISummaryPanel({
  projectId,
  expertOpinions = [],
  aiSummary,
  onExport,
  onPrint,
}: AISummaryPanelProps) {
  // 处理旧版数据格式转换为新格式
  const defaultAISummaryText = aiSummary ? 
    `${aiSummary.overallOpinion || ''}\n\n${aiSummary.recommendations || ''}` : 
    "AI审查意见将根据专家评审意见自动生成...";
  
  const [summaryText, setSummaryText] = useState<string>(defaultAISummaryText);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // 组件挂载时自动生成AI审查意见
  useEffect(() => {
    // 如果没有现成的AI意见或意见内容为默认值，则自动生成
    if (!aiSummary || summaryText === defaultAISummaryText) {
      regenerateAISummary();
    }
  }, []);  // 空依赖数组确保只在挂载时执行一次

  // 处理导出
  const handleExport = (format: "pdf" | "docx" | "excel") => {
    if (onExport) {
      onExport(format);
    } else {
      toast({
        title: "功能未实现",
        description: "导出功能尚未完全实现",
        variant: "destructive",
      });
    }
  };

  // 处理打印
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      toast({
        title: "功能未实现",
        description: "打印功能尚未完全实现",
        variant: "destructive",
      });
    }
  };

  // 获取结果统计
  const getResultStats = () => {
    const stats = {
      "同意": 0,
      "修改后同意": 0,
      "不同意": 0,
      "其他": 0
    };

    expertOpinions.forEach(opinion => {
      if (stats[opinion.result as keyof typeof stats] !== undefined) {
        stats[opinion.result as keyof typeof stats]++;
      } else {
        stats["其他"]++;
      }
    });

    return stats;
  };

  const resultStats = getResultStats();

  // 获取结果统计的百分比
  const getResultPercentage = (result: string) => {
    const total = expertOpinions.length;
    if (total === 0) return 0;
    return Math.round((resultStats[result as keyof typeof resultStats] / total) * 100);
  };

  // 重新生成AI意见
  const regenerateAISummary = () => {
    setIsGenerating(true);
    // 备份当前文本内容
    const originalText = summaryText;
    // 设置为加载中状态
    setSummaryText("正在分析专家意见并生成AI审查意见...");
    
    setTimeout(() => {
      setSummaryText("基于专家评审意见的分析，该项目整体设计合理，研究目标明确。所有专家一致认同项目的临床应用价值和技术可行性。\n\n主要改进建议包括：完善数据保护方案，特别是针对特殊人群；明确技术应用边界；增强数据匿名化流程；补充知情同意书细节。\n\n建议项目组根据上述意见进行针对性修改后实施。");
      setIsGenerating(false);
      toast({
        title: "已生成审查意见",
        description: "AI审查意见已生成",
      });
    }, 2000); // 延长至2秒以便更明显地看到加载效果
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题区域 */}
      <div className="p-5 border-b bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <MessageSquareText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">AI意见汇总</h2>
            <p className="text-xs text-slate-500 mt-0.5">专家意见智能汇总与分析</p>
          </div>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-auto min-h-0 bg-slate-50/50 p-4">
        {/* 结果统计卡片 */}
        <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-800">审查结果统计</h3>
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-normal">
              {expertOpinions.length}位专家
            </Badge>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700">同意</span>
              <Badge className="bg-green-50 text-green-700 border-green-100">
                {resultStats["同意"]}人 ({getResultPercentage("同意")}%)
              </Badge>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${getResultPercentage("同意")}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700">修改后同意</span>
              <Badge className="bg-amber-50 text-amber-700 border-amber-100">
                {resultStats["修改后同意"]}人 ({getResultPercentage("修改后同意")}%)
              </Badge>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${getResultPercentage("修改后同意")}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700">不同意</span>
              <Badge className="bg-red-50 text-red-700 border-red-100">
                {resultStats["不同意"]}人 ({getResultPercentage("不同意")}%)
              </Badge>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${getResultPercentage("不同意")}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 mt-3 text-center">
            最后更新时间: {aiSummary?.date || "未知"}
          </div>
        </div>

        {/* AI审查意见区域 */}
        <div className="border rounded-lg bg-white overflow-hidden">
          <div className="p-3 flex items-center justify-between bg-gradient-to-r from-white to-slate-50 border-b">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-purple-600 mr-2" />
              <span className="font-medium text-slate-800">AI审查意见</span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={isGenerating ? "default" : "outline"}
                className={`flex items-center gap-1 ${isGenerating ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                onClick={regenerateAISummary}
                disabled={isGenerating}
              >
                <RotateCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin text-white" : ""}`} />
                <span className={isGenerating ? "text-white" : ""}>{isGenerating ? "生成中..." : "重新生成"}</span>
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-white relative">
            <Textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className={`min-h-[240px] font-normal text-sm border-slate-200 resize-none focus-visible:ring-purple-500 ${isGenerating ? "bg-slate-50" : ""}`}
              placeholder="AI审查意见将根据专家评审意见自动生成..."
              disabled={isGenerating}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-100/30 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-purple-600 rounded-full animate-spin"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部操作区域 */}
      <div className="p-4 bg-white border-t mt-auto">
        <div>
          {/* 审查结果选择 */}
          <h3 className="text-sm font-medium text-slate-700 mb-2">审查结果</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium py-2.5 h-auto rounded-md transition-all"
              onClick={() => {
                toast({
                  title: "审查结果已更新",
                  description: "项目审查结果已设置为「同意」",
                });
              }}
            >
              <Check className="h-4 w-4 mr-1.5" />
              同意
            </Button>
            <Button 
              className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium py-2.5 h-auto rounded-md transition-all"
              onClick={() => {
                toast({
                  title: "审查结果已更新",
                  description: "项目审查结果已设置为「修改后同意」",
                });
              }}
            >
              <FileCheck className="h-4 w-4 mr-1.5" />
              修改后同意
            </Button>
            <Button 
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium py-2.5 h-auto rounded-md transition-all"
              onClick={() => {
                toast({
                  title: "审查结果已更新",
                  description: "项目审查结果已设置为「不同意」",
                });
              }}
            >
              <X className="h-4 w-4 mr-1.5" />
              不同意
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 