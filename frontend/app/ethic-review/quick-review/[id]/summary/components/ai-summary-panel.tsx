"use client"

import { useState, useEffect } from "react";
import { Zap, User, ClipboardCheck, Calendar, Download, Printer, Check, ChevronDown, ChevronUp, FileText, RotateCw, PenSquare, MessageSquareText, FileCheck, X, Target, Sparkles, CheckCircle2, Upload, Paperclip, Trash2, Users } from "lucide-react";
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
  onSubmit?: () => void; // 提交回调
  onClose?: () => void; // 关闭回调
}

export default function AISummaryPanel({
  projectId,
  expertOpinions = [],
  aiSummary,
  onExport,
  onPrint,
  onSubmit,
  onClose,
}: AISummaryPanelProps) {
  // 处理旧版数据格式转换为新格式
  const defaultAISummaryText = aiSummary ? 
    `${aiSummary.overallOpinion || ''}\n\n${aiSummary.recommendations || ''}` : 
    "AI审查意见将根据专家评审意见自动生成...";
  
  const [summaryText, setSummaryText] = useState<string>(defaultAISummaryText);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
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

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => {
        // 限制文件大小 10MB
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "文件过大",
            description: `文件 ${file.name} 超过10MB限制`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });
      
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "文件上传成功",
        description: `已上传 ${validFiles.length} 个文件`,
      });
    }
  };

  // 删除文件
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "文件已删除",
      description: "附件已从列表中移除",
    });
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* 动态背景特效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-100/30 to-blue-200/40"></div>
      
      {/* 浮动装饰元素 */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-blue-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-indigo-200/20 to-purple-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-200/15 to-indigo-300/15 rounded-full blur-md animate-pulse delay-500"></div>
      
      {/* 标题区域 */}
      <div className="relative z-10 p-5 bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MessageSquareText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">AI意见汇总</h2>
            <p className="text-xs text-slate-500 mt-0.5">专家意见智能汇总与分析</p>
          </div>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="relative z-10 flex-1 overflow-auto min-h-0 bg-gradient-to-b from-white/20 to-white/30 backdrop-blur-sm p-4">
                {/* 审查要点 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
            <h3 className="font-medium text-slate-800">审查要点</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="font-medium text-black text-sm mb-1">技术可行性</div>
              <div className="text-gray-500 text-xs">专家对研究方法和技术路线的评价</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="font-medium text-black text-sm mb-1">伦理合规性</div>
              <div className="text-gray-500 text-xs">知情同意、隐私保护等伦理要求</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="font-medium text-black text-sm mb-1">风险评估</div>
              <div className="text-gray-500 text-xs">数据安全、受试者权益保护措施</div>
            </div>
          </div>
        </div>

        {/* 审查结果选择 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
              <span className="font-medium text-slate-800">审查结果</span>
              {selectedResult ? (
                <Badge className={`text-xs font-medium ${
                  selectedResult === '同意' ? 'bg-green-100 text-green-700 border-green-200' :
                  selectedResult === '必要的修改后同意' ? 'bg-amber-100 text-amber-700 border-amber-200' :
            selectedResult === '转会议' ? 'bg-purple-100 text-purple-700 border-purple-200' :
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
          
          <div className="space-y-2">
            <Button 
              variant="ghost"
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white ${
                selectedResult === '同意' 
                  ? 'border-2 border-green-400 text-green-900 shadow-sm hover:bg-white' 
                  : 'border border-gray-200 hover:bg-white text-gray-800 hover:border-gray-300'
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
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white ${
                selectedResult === '必要的修改后同意' 
                  ? 'border-2 border-amber-400 text-amber-900 shadow-sm hover:bg-white' 
                  : 'border border-gray-200 hover:bg-white text-gray-800 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedResult('必要的修改后同意');
                toast({
                  title: "⚠️ 审查结果已设置",
                  description: "项目审查结果：必要的修改后同意",
                });
              }}
            >
              <FileCheck className="h-4 w-4" />
              <span>必要的修改后同意</span>
              {selectedResult === '必要的修改后同意' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-amber-600"></div>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white ${
                selectedResult === '转会议' 
                  ? 'border-2 border-purple-400 text-purple-900 shadow-sm hover:bg-white' 
                  : 'border border-gray-200 hover:bg-white text-gray-800 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedResult('转会议');
                toast({
                  title: "🏛️ 审查结果已设置",
                  description: "项目审查结果：转会议",
                });
              }}
            >
              <Users className="h-4 w-4" />
              <span>转会议</span>
              {selectedResult === '转会议' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-purple-600"></div>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              className={`w-full font-medium py-2 h-auto rounded-md transition-all flex items-center justify-start gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white ${
                selectedResult === '不同意' 
                  ? 'border-2 border-red-400 text-red-900 shadow-sm hover:bg-white' 
                  : 'border border-gray-200 hover:bg-white text-gray-800 hover:border-gray-300'
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

        {/* AI审查意见编辑区域 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
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
          
          <div className="relative">
            <Textarea
              value={summaryText}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 500) {
                  setSummaryText(value);
                }
              }}
              className={`min-h-[200px] font-normal text-sm border-slate-200 resize-none focus-visible:ring-purple-500 ${isGenerating ? "bg-slate-50 cursor-wait" : "bg-white"}`}
              placeholder="请填写AI综合审查意见..."
              disabled={isGenerating}
              maxLength={500}
            />
            {/* 字数计数 */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
              {summaryText.length}/500
            </div>
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center pointer-events-none rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-600">正在生成审查意见...</span>
                </div>
              </div>
            )}
          </div>

          {/* 文件上传区域 */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                上传附件
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg cursor-pointer transition-all duration-200"
              >
                <Upload className="h-4 w-4" />
                选择文件
              </label>
            </div>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  已上传 {uploadedFiles.length} 个文件
                </div>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 上传提示 */}
            <div className="text-xs text-gray-400">
              支持 PDF、Office文档、图片等格式，单个文件不超过10MB
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-white/40 to-white/30 backdrop-blur-sm mt-auto">
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg"
            onClick={() => {
              if (!selectedResult) {
                toast({
                  title: "请选择审查结果",
                  description: "请先选择一个审查结果",
                  variant: "destructive",
                });
                return;
              }
              
              if (!summaryText.trim()) {
                toast({
                  title: "请填写审查意见",
                  description: "请填写AI审查意见",
                  variant: "destructive",
                });
                return;
              }
              
              // 执行提交操作
              if (onSubmit) {
                onSubmit();
              } else {
                toast({
                  title: "提交成功",
                  description: `AI审查意见已提交，审查结果：${selectedResult}`,
                });
              }
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            提交
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-lg transition-colors"
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                toast({
                  title: "已关闭",
                  description: "返回快速审查模块列表",
                });
              }
            }}
          >
            <X className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </div>
      </div>
    </div>
  );
} 