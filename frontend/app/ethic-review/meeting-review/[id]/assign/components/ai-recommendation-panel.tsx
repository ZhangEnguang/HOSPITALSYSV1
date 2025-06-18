"use client"

import { useState, useEffect } from "react";
import { Zap, User, ClipboardList, Calendar, Check, UserRoundPlus, ArrowLeft, ArrowRight, LucideCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

type Expert = {
  id: string;
  name: string;
  department: string;
  title: string;
  expertise: string[];
  matchScore: number;
  relatedPapers: number;
  reviewCount: number;
  rating: number;
  availability: boolean;
};

type Worksheet = {
  id: string;
  name: string;
  description: string;
  suitabilityScore: number;
  createdDate: string;
  lastUpdated: string;
  questionCount: number;
  usageCount: number;
};

interface AIRecommendationPanelProps {
  projectId: string;
  experts?: Expert[];
  worksheets?: Worksheet[];
  loading?: boolean;
  onExpertSelect?: (expertId: string) => void;
  onWorksheetSelect?: (worksheetId: string) => void;
  selectedExperts?: string[];
  selectedWorksheet?: string | null;
  onSubmit?: () => void;
  aiSummary?: string;
  riskLevel?: string;
  aiModelName?: string;
  aiModelVersion?: string;
}

export default function AIRecommendationPanel({
  projectId,
  experts = [],
  worksheets = [],
  loading = false,
  onExpertSelect,
  onWorksheetSelect,
  selectedExperts = [],
  selectedWorksheet = null,
  onSubmit,
  aiSummary = "",
  riskLevel = "未评估",
  aiModelName = "EthicGPT 2024",
  aiModelVersion = "v3.1",
}: AIRecommendationPanelProps) {
  // 使用stepIndex代替sidebarTab，表示当前步骤（1: 选择专家，2: 选择工作表）
  const [stepIndex, setStepIndex] = useState(1);
  const { toast } = useToast();

  // 处理专家选择
  const handleExpertSelect = (expertId: string) => {
    if (onExpertSelect) {
      onExpertSelect(expertId);
    }
  };

  // 处理工作表选择
  const handleWorksheetSelect = (worksheetId: string) => {
    if (onWorksheetSelect) {
      onWorksheetSelect(worksheetId);
    }
  };

  // 处理提交
  const handleSubmit = () => {
    if (!selectedExperts || selectedExperts.length === 0) {
      toast({
        title: "请选择专家",
        description: "请至少选择一位专家进行分配",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWorksheet) {
      toast({
        title: "请选择工作表",
        description: "请选择一个审查工作表",
        variant: "destructive",
      });
      return;
    }

    if (onSubmit) {
      onSubmit();
    }
  };

  // 进入下一步
  const goToNextStep = () => {
    if (selectedExperts.length === 0) {
      toast({
        title: "请选择专家",
        description: "请至少选择一位专家后继续",
        variant: "destructive",
      });
      return;
    }
    setStepIndex(2);
  };

  // 返回上一步
  const goToPrevStep = () => {
    setStepIndex(1);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题区域 - 更现代化的标题设计 */}
      <div className="p-5 border-b bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">AI智能推荐</h2>
            <p className="text-xs text-slate-500 mt-0.5">基于项目内容智能匹配合适的专家和工作表</p>
          </div>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center px-4 py-3 bg-white border-b">
        <div className="flex items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            stepIndex === 1 
              ? "bg-blue-600 text-white" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {stepIndex > 1 ? <LucideCheck className="h-4 w-4" /> : "1"}
          </div>
          <div className="ml-2">
            <div className={`text-sm font-medium ${stepIndex === 1 ? "text-blue-600" : "text-slate-700"}`}>选择专家</div>
            <div className="text-xs text-slate-500">推荐{experts.length}位专家</div>
          </div>
        </div>
        
        <div className="w-12 h-0.5 bg-slate-200"></div>
        
        <div className="flex items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            stepIndex === 2 
              ? "bg-blue-600 text-white" 
              : "bg-slate-100 text-slate-400"
          }`}>
            2
          </div>
          <div className="ml-2">
            <div className={`text-sm font-medium ${stepIndex === 2 ? "text-blue-600" : "text-slate-400"}`}>选择工作表</div>
            <div className="text-xs text-slate-500">推荐{worksheets.length}种工作表</div>
          </div>
        </div>
      </div>

      {/* 内容区域 - 确保可滚动并占据剩余空间 */}
      <div className="flex-1 overflow-auto min-h-0 bg-slate-50/50">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
            <p className="text-sm text-slate-500 text-center">AI正在分析项目内容，匹配最合适的{stepIndex === 1 ? "专家" : "工作表"}...</p>
          </div>
        ) : (
          <>
            {/* 专家推荐列表 */}
            {stepIndex === 1 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">智能推荐专家</h3>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-normal">
                    匹配度排序
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {experts.map((expert) => (
                    <div
                      key={expert.id}
                      className={`p-4 rounded-lg transition-all shadow-sm ${
                        selectedExperts.includes(expert.id)
                          ? "border border-blue-200 bg-blue-50/80 shadow-blue-100"
                          : "border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                      }`}
                      onClick={() => handleExpertSelect(expert.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-slate-500 overflow-hidden transition-all ${
                            selectedExperts.includes(expert.id)
                              ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 border-2 border-blue-500"
                              : "bg-gradient-to-br from-slate-100 to-slate-200"
                          }`}>
                            <User className="h-6 w-6 text-slate-600" />
                          </div>
                          {selectedExperts.includes(expert.id) && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="min-w-0">
                              <div className="font-medium text-slate-800 truncate">{expert.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate">
                                {expert.department} · {expert.title}
                              </div>
                            </div>
                            <Badge
                              className={`flex-shrink-0 ${
                                expert.matchScore >= 90
                                  ? "bg-green-50 text-green-700 border-green-100"
                                  : expert.matchScore >= 80
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              } font-normal whitespace-nowrap`}
                            >
                              匹配度 {expert.matchScore}%
                            </Badge>
                          </div>
                          
                          {/* 专业标签 - 只显示前2个，剩余的显示+数量 */}
                          <div className="mt-2 flex space-x-1.5 items-center">
                            {expert.expertise.slice(0, 2).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-normal whitespace-nowrap flex-shrink-0"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {expert.expertise.length > 2 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-normal cursor-pointer flex-shrink-0"
                                    >
                                      +{expert.expertise.length - 2}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="max-w-xs">
                                      <p className="text-sm font-medium mb-1">其他专业领域：</p>
                                      <div className="space-y-1">
                                        {expert.expertise.slice(2).map((skill, index) => (
                                          <p key={index} className="text-xs">{skill}</p>
                                        ))}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>

                          

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 工作表推荐列表 */}
            {stepIndex === 2 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">智能推荐审查工作表</h3>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-normal">
                    匹配度排序
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {worksheets.map((worksheet) => (
                    <div
                      key={worksheet.id}
                      className={`p-4 rounded-lg transition-all shadow-sm ${
                        selectedWorksheet === worksheet.id
                          ? "border border-blue-200 bg-blue-50/80 shadow-blue-100"
                          : "border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                      }`}
                      onClick={() => handleWorksheetSelect(worksheet.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 transition-all ${
                            selectedWorksheet === worksheet.id
                              ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 border-2 border-blue-500"
                              : "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-500"
                          }`}>
                            <ClipboardList className="h-6 w-6" />
                          </div>
                          {selectedWorksheet === worksheet.id && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="font-medium text-slate-800 truncate">{worksheet.name}</div>
                            <Badge
                              className={`flex-shrink-0 ${
                                worksheet.suitabilityScore >= 90
                                  ? "bg-green-50 text-green-700 border-green-100"
                                  : worksheet.suitabilityScore >= 80
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              } font-normal whitespace-nowrap`}
                            >
                              匹配度 {worksheet.suitabilityScore}%
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <div className="flex items-center whitespace-nowrap">
                              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>更新: {worksheet.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部导航与确认区域 - 根据当前步骤显示不同按钮 */}
      <div className="p-4 bg-white border-t mt-auto">
        {stepIndex === 1 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-600 font-medium flex items-center">
                <UserRoundPlus className="h-4 w-4 mr-1.5 text-blue-500" />
                已选专家
              </div>
              <div className="font-medium text-sm bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                {selectedExperts.length}
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 h-auto rounded-md transition-all shadow-sm"
              onClick={goToNextStep}
              disabled={selectedExperts.length === 0}
            >
              下一步: 选择工作表
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-600 font-medium flex items-center">
                  <UserRoundPlus className="h-4 w-4 mr-1.5 text-blue-500" />
                  已选专家
                </div>
                <div className="font-medium text-sm bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                  {selectedExperts.length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-600 font-medium flex items-center">
                  <ClipboardList className="h-4 w-4 mr-1.5 text-blue-500" />
                  已选工作表
                </div>
                <div className="font-medium text-sm bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                  {selectedWorksheet ? 1 : 0}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-white border border-slate-200 text-slate-700 font-medium py-2.5 h-auto rounded-md transition-all hover:bg-slate-50"
                onClick={goToPrevStep}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                返回选择专家
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 h-auto rounded-md transition-all shadow-sm"
                onClick={handleSubmit}
                disabled={!selectedWorksheet}
              >
                确认分配
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 