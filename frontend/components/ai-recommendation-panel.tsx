"use client"

import { useState, useEffect } from "react";
import { Zap, User, ClipboardList, Calendar, CheckCircle2, BookOpen, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: AIRecommendationPanelProps) {
  const [sidebarTab, setSidebarTab] = useState<"experts" | "worksheets">("experts");
  const { toast } = useToast();

  // 保存用户的选项卡状态到本地存储
  useEffect(() => {
    if (sidebarTab !== "experts" && sidebarTab !== "worksheets") {
      setSidebarTab("experts");
    }
    
    const savedTab = localStorage.getItem("assignReviewersSidebarTab");
    if (savedTab === "experts" || savedTab === "worksheets") {
      setSidebarTab(savedTab as "experts" | "worksheets");
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("assignReviewersSidebarTab", sidebarTab);
  }, [sidebarTab]);

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

  return (
    <div className="w-[360px] flex-shrink-0 bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* 标题区域 */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">AI智能推荐</h2>
        </div>
        <p className="text-xs text-slate-500">基于项目内容智能匹配合适的专家和审查工作表</p>
      </div>

      {/* 标签切换 */}
      <div className="flex border-b">
        <button
          key="experts-tab"
          type="button"
          className={`flex-1 py-2 px-4 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            sidebarTab === "experts"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-600 border-b-2 border-transparent hover:text-blue-500"
          }`}
          onClick={() => setSidebarTab("experts")}
        >
          <User className="h-4 w-4 mr-2" />
          推荐专家
        </button>
        <button
          key="worksheets-tab"
          type="button"
          className={`flex-1 py-2 px-4 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            sidebarTab === "worksheets"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-600 border-b-2 border-transparent hover:text-blue-500"
          }`}
          onClick={() => setSidebarTab("worksheets")}
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          推荐工作表
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-slate-500 text-center">AI正在分析项目内容，匹配最合适的{sidebarTab === "experts" ? "专家" : "工作表"}...</p>
          </div>
        ) : (
          <>
            {/* 专家推荐列表 */}
            {sidebarTab === "experts" && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-700">智能推荐专家</h3>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    匹配度排序
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {experts.map((expert) => (
                    <div
                      key={expert.id}
                      className={`p-3 border rounded-lg transition-all ${
                        selectedExperts.includes(expert.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                      onClick={() => handleExpertSelect(expert.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                            <User className="h-5 w-5" />
                          </div>
                          {expert.availability ? (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          ) : (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-slate-800">{expert.name}</div>
                            <Badge
                              className={`${
                                expert.matchScore >= 90
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : expert.matchScore >= 80
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              匹配度 {expert.matchScore}%
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {expert.department} · {expert.title}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {expert.expertise.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                <span>相关论文: {expert.relatedPapers}</span>
                              </div>
                              <div className="flex items-center">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>已审核: {expert.reviewCount}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(expert.rating)
                                      ? "text-amber-500"
                                      : i < expert.rating
                                      ? "text-amber-300"
                                      : "text-slate-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1">{expert.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 工作表推荐列表 */}
            {sidebarTab === "worksheets" && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-700">智能推荐审查工作表</h3>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    匹配度排序
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {worksheets.map((worksheet) => (
                    <div
                      key={worksheet.id}
                      className={`p-3 border rounded-lg transition-all ${
                        selectedWorksheet === worksheet.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                      onClick={() => handleWorksheetSelect(worksheet.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                          <ClipboardList className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-slate-800">{worksheet.name}</div>
                            <Badge
                              className={`${
                                worksheet.suitabilityScore >= 90
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : worksheet.suitabilityScore >= 80
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              匹配度 {worksheet.suitabilityScore}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>更新: {worksheet.lastUpdated}</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              <span>问题: {worksheet.questionCount}个</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-slate-600 line-clamp-2">
                            {worksheet.description}
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

      {/* 底部统计与确认区域 */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between mb-3">
          <div className="text-sm text-slate-500">已选专家</div>
          <div className="text-sm font-medium">{selectedExperts.length}</div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-sm text-slate-500">已选工作表</div>
          <div className="text-sm font-medium">{selectedWorksheet ? 1 : 0}</div>
        </div>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={selectedExperts.length === 0 || !selectedWorksheet}
        >
          确认分配
        </Button>
      </div>
    </div>
  );
} 