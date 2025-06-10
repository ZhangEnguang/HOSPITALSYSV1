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
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
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



  // 重新生成AI意见
  const regenerateAISummary = () => {
    setIsGenerating(true);
    // 备份当前文本内容
    const originalText = summaryText;
    // 设置为加载中状态
    setSummaryText("正在分析专家意见并生成AI审查意见...");
    
    setTimeout(() => {
      setSummaryText("该项目整体设计合理，研究目标明确。\n专家建议：完善数据保护方案，明确技术应用边界。\n建议修改后实施。");
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
                {/* 审查要点提示卡片 */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-800">审查要点提示</h3>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-normal text-xs">
              基于{expertOpinions.length}位专家意见
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
              <span className="text-slate-700">
                <span className="font-medium text-green-700">技术可行性:</span> 
                专家对研究方法和技术路线的评价
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <span className="text-slate-700">
                <span className="font-medium text-blue-700">伦理合规性:</span> 
                知情同意、隐私保护等伦理要求
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
              <span className="text-slate-700">
                <span className="font-medium text-amber-700">风险评估:</span> 
                数据安全、受试者权益保护措施
              </span>
            </div>
          </div>
        </div>

        {/* AI审查意见编辑区域 */}
        <div className="mb-4 border rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="p-3 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-blue-50/50 border-b">
            <div className="flex items-center gap-2">
              <PenSquare className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-slate-800">AI审查意见</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className={`text-xs px-2 py-1 h-7 ${isGenerating ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600" : "border-purple-200 text-purple-700 hover:bg-purple-50"}`}
              onClick={regenerateAISummary}
              disabled={isGenerating}
            >
              <RotateCw className={`h-3 w-3 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "生成中" : "智能生成"}
            </Button>
          </div>
          
          <div className="p-3 bg-white relative">
            <Textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className={`min-h-[200px] font-normal text-sm border-slate-200 resize-none focus-visible:ring-purple-500 ${isGenerating ? "bg-slate-50 cursor-wait" : "bg-white"}`}
              placeholder="请填写AI综合审查意见..."
              disabled={isGenerating}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center pointer-events-none rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-600">正在生成审查意见...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 审查结果选择 */}
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-slate-700" />
              <span className="font-medium text-slate-800">审查结果</span>
              {selectedResult ? (
                <Badge className={`text-xs font-medium ${
                  selectedResult === '同意' ? 'bg-green-100 text-green-700 border-green-200' :
                  selectedResult === '修改后同意' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                  已选择: {selectedResult}
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                  必选
                </Badge>
              )}
            </div>
          </div>
          
          <div className="p-3 space-y-2">
            <Button 
              variant="ghost"
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                selectedResult === '同意' 
                  ? 'bg-green-100 border-2 border-green-400 text-green-900 shadow-sm hover:bg-green-100' 
                  : 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 hover:border-green-300'
              }`}
              onClick={() => {
                setSelectedResult('同意');
                toast({
                  title: "✅ 审查结果已设置",
                  description: "项目审查结果：同意",
                });
              }}
            >
              <Check className="h-4 w-4" />
              <span>同意</span>
              {selectedResult === '同意' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-600"></div>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                selectedResult === '修改后同意' 
                  ? 'bg-amber-100 border-2 border-amber-400 text-amber-900 shadow-sm hover:bg-amber-100' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 hover:border-amber-300'
              }`}
              onClick={() => {
                setSelectedResult('修改后同意');
                toast({
                  title: "⚠️ 审查结果已设置",
                  description: "项目审查结果：修改后同意",
                });
              }}
            >
              <FileCheck className="h-4 w-4" />
              <span>修改后同意</span>
              {selectedResult === '修改后同意' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-amber-600"></div>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                selectedResult === '不同意' 
                  ? 'bg-red-100 border-2 border-red-400 text-red-900 shadow-sm hover:bg-red-100' 
                  : 'bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 hover:border-red-300'
              }`}
              onClick={() => {
                setSelectedResult('不同意');
                toast({
                  title: "❌ 审查结果已设置",
                  description: "项目审查结果：不同意",
                });
              }}
            >
              <X className="h-4 w-4" />
              <span>不同意</span>
              {selectedResult === '不同意' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-red-600"></div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 bg-white border-t mt-auto">
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            onClick={() => {
              toast({
                title: "提交成功",
                description: "AI审查意见已提交",
              });
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            提交
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-lg transition-colors"
            onClick={() => {
              toast({
                title: "已关闭",
                description: "AI意见汇总面板已关闭",
              });
            }}
          >
            <X className="h-4 w-4 mr-2" />
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
} 