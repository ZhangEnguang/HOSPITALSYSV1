"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { SubmitSuccessDialog } from "@/components/ethic-review/submit-success-dialog"
import { AIFileReviewResult } from "@/components/ethic-review/ai-file-review-result"
import { FileReviewIssue, aiReviewFiles, FileReviewResult } from "@/app/services/ai-file-review"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  SendHorizontal, 
  FileCheck2, 
  X, 
  Loader2, 
  ArrowLeft, 
  PanelRight,
  PanelLeftClose,
  Minimize2
} from "lucide-react"

// 默认项目数据
const DEFAULT_PROJECT_DATA = {
  projectTitle: "多人种样本基因测序与健康风险预测",
  projectType: "心理学研究",
  projectSource: "院内立项",
  researchUnit: "外科学系",
  leaderName: "刘教授",
  department: "内分泌科",
  ethicsCommittee: "北京医学伦理委员会"
}

// 为上传文件定义类型
interface FileWithData {
  name: string;
  size: number;
  type: string;
  file: File;
}

// 扩展文件类型，使其兼容可能的情况
type FileWithAttributes = File | FileWithData;

// 人体伦理初始审查表单组件
export function HumanInitialReview({
  projectData: initialProjectData = DEFAULT_PROJECT_DATA
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 用于管理项目数据的状态
  const [projectData, setProjectData] = useState(initialProjectData)
  
  // 显示提交成功对话框的状态
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  
  // 存储文件对象的Map
  const [filesMap, setFilesMap] = useState<Map<number, File[]>>(new Map())
  
  // AI审查状态
  const [showAIReview, setShowAIReview] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<FileReviewResult | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewProgress, setReviewProgress] = useState(0)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false) // 面板是否折叠
  
  // 从URL参数中获取项目ID和其他信息，并更新项目数据
  useEffect(() => {
    if (searchParams) {
      const projectId = searchParams.get('projectId')
      if (projectId) {
        // 实际应用中，这里应该是一个API调用来获取项目详细信息
        // 简化起见，我们这里仅使用projectId作为项目标题
        setProjectData({
          ...projectData, 
          projectTitle: decodeURIComponent(projectId)
        })
      }
    }
  }, [searchParams])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "half" },
    { key: "projectType", label: "研究类型", value: projectData.projectType, disabled: true, span: "half" },
    { key: "projectSource", label: "项目来源", value: projectData.projectSource, disabled: true, span: "half" },
    { key: "researchUnit", label: "研究单位", value: projectData.researchUnit, disabled: true, span: "half" },
    { key: "leaderName", label: "负责人名称", value: projectData.leaderName, disabled: true, span: "half" },
    { key: "department", label: "所属单位", value: projectData.department, disabled: true, span: "half" },
    { key: "ethicsCommittee", label: "伦理委员会", value: projectData.ethicsCommittee, disabled: true, span: "half" }
  ]

  // 人体伦理初始审查的送审文件清单
  const initialReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "人体伦理审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-ethics-application-form.docx"
    },
    {
      id: 2,
      fileName: "项目研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/research-protocol-template.docx"
    },
    {
      id: 3,
      fileName: "知情同意书",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "知情同意",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-template.docx"
    },
    {
      id: 4,
      fileName: "研究者手册",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/investigator-brochure.docx"
    },
    {
      id: 5,
      fileName: "受试者招募材料",
      format: "PDF/Word/JPG",
      required: false,
      quantity: "不限制",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 6,
      fileName: "病例报告表",
      format: "PDF/Word/Excel",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/case-report-form.docx"
    },
    {
      id: 7,
      fileName: "研究者资质证明",
      format: "PDF/JPG",
      required: true,
      quantity: "不限制",
      fileType: "资质证明",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 8,
      fileName: "其他支持性文件",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "其他",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ]

  // 管理送审文件清单状态
  const [reviewFiles, setReviewFiles] = useState<ReviewFileItem[]>(initialReviewFiles)
  
  // 更新文件列表，并维护文件对象Map
  const handleFilesChange = useCallback((newFiles: ReviewFileItem[]) => {
    console.log("文件列表已更新:", newFiles)
    
    // 更新文件状态
    setReviewFiles(newFiles)
    
    // 更新文件对象Map
    const newFilesMap = new Map<number, File[]>()
    
    newFiles.forEach(item => {
      if (item.files && item.files.length > 0) {
        // 为每个文件项保存实际的File对象
        const fileObjects: File[] = []
        
        // 处理不同类型的文件对象
        item.files.forEach((fileInfo: any) => {
          if (fileInfo instanceof File) {
            // 如果已经是File对象
            fileObjects.push(fileInfo)
          } else if (fileInfo && typeof fileInfo === 'object' && 'file' in fileInfo && fileInfo.file instanceof File) {
            // 如果有file属性且是File对象
            fileObjects.push(fileInfo.file)
          } else {
            // 创建一个模拟的File对象
            const mockFile = new File(
              ["mock content"], 
              (fileInfo && typeof fileInfo === 'object' && 'name' in fileInfo) ? (fileInfo.name as string) || "未命名文件" : "未命名文件", 
              { 
                type: (fileInfo && typeof fileInfo === 'object' && 'type' in fileInfo) ? 
                  (fileInfo.type as string) || "application/octet-stream" : 
                  "application/octet-stream" 
              }
            )
            fileObjects.push(mockFile)
          }
        })
        
        if (fileObjects.length > 0) {
          newFilesMap.set(item.id, fileObjects)
        }
      }
    })
    
    setFilesMap(newFilesMap)
  }, [])

  // 处理表单提交前的验证
  const handlePreSubmit = () => {
    // 直接显示提交成功对话框
    setShowSuccessDialog(true);
  }
  
  // 启动AI审查
  const startAIReview = async () => {
    // 检查是否有文件可供审查
    let hasFiles = false;
    for (const [_, files] of filesMap.entries()) {
      if (files && files.length > 0) {
        hasFiles = true;
        break;
      }
    }
    
    if (!hasFiles) {
      // 使用toast提示
      toast({
        title: "无法启动审查",
        description: "请先上传至少一个文件才能使用AI形式审查功能",
        variant: "destructive"
      });
      return;
    }
    
    setIsReviewing(true);
    setShowAIReview(true);
    setReviewError(null);
    setReviewProgress(0);
    
    // 构建审查文件列表
    const reviewFileList = [...initialReviewFiles].map(file => {
      const uploadedFiles = filesMap.get(file.id) || [];
      return {
        ...file,
        files: uploadedFiles
      };
    });
    
    // 执行审查逻辑
    executeAIReview(reviewFileList);
  }

  // 关闭AI审查
  const closeAIReview = () => {
    setShowAIReview(false);
    setIsPanelCollapsed(false); // 重置折叠状态
  }

  // 切换面板折叠状态
  const togglePanelCollapse = () => {
    setIsPanelCollapsed(prev => !prev);
  }

  // 返回按钮的工具提示文本
  const getCloseButtonTooltip = () => {
    return "收起审查面板，返回单栏视图";
  }

  // 切换按钮的工具提示文本
  const getToggleButtonTooltip = () => {
    return isPanelCollapsed ? "展开审查面板" : "收起审查面板";
  }

  // 处理重新审查
  const handleRefreshReview = () => {
    // 重新审查时不进行文件校验，直接启动审查
    setIsReviewing(true);
    setReviewError(null);
    setReviewProgress(0);
    
    // 构建审查文件列表
    const reviewFileList = [...initialReviewFiles].map(file => {
      const uploadedFiles = filesMap.get(file.id) || [];
      return {
        ...file,
        files: uploadedFiles
      };
    });
    
    // 执行审查逻辑
    executeAIReview(reviewFileList);
  }

  // 抽取的审查执行逻辑
  const executeAIReview = async (reviewFileList: any[]) => {
    try {
      // 模拟进度增长
      const progressInterval = setInterval(() => {
        setReviewProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.floor(Math.random() * 8) + 1;
        });
      }, 300);
      
      const result = await aiReviewFiles(reviewFileList);
      
      // 清除进度条定时器
      clearInterval(progressInterval);
      setReviewProgress(100);
      
      // 设置短暂延迟显示100%，然后显示结果
      setTimeout(() => {
        setReviewResult(result);
        setIsReviewing(false);
      }, 500);
      
    } catch (error) {
      console.error("AI审查出错:", error);
      setReviewError("AI审查过程中发生错误，请重试");
      setIsReviewing(false);
    }
  }

  // 更新文件问题
  const handleUpdateFileIssues = (issues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => {
    // 如果提供了新的文件集合，更新filesMap
    if (updatedFiles) {
      setFilesMap(updatedFiles);
      
      // 找出已修复的文件
      const fixedIssues = issues.filter(issue => issue.fixed);
      
      // 如果有已修复的问题，更新相应文件的aiModified状态
      if (fixedIssues.length > 0) {
        const updatedReviewFiles = reviewFiles.map(file => {
          // 检查此文件是否有对应的已修复问题
          const hasFixedIssue = fixedIssues.some(issue => issue.fileId === file.id);
          // 如果有已修复问题，标记文件为已修复
          if (hasFixedIssue) {
            return {
              ...file,
              aiModified: true
            };
          }
          return file;
        });
        
        // 更新文件列表状态
        setReviewFiles(updatedReviewFiles);
      }
    }
    
    // 更新审查结果中的问题
    if (reviewResult) {
      const updatedResult = {
        ...reviewResult,
        issues: issues,
        hasIssues: issues.length > 0
      };
      setReviewResult(updatedResult);
    }
  }
  
  // 保存草稿
  const handleSaveDraft = () => {
    console.log("保存草稿:", { projectData, reviewFiles })
    
    // 模拟API保存
    toast({
      title: "草稿已保存",
      description: "您可以稍后继续编辑"
    })
  }
  
  // 重置表单状态
  const resetForm = () => {
    // 重置文件列表
    setReviewFiles(initialReviewFiles);
    setFilesMap(new Map());
    
    // 重置审查状态
    setReviewResult(null);
    setShowAIReview(false);
    
    // 关闭成功对话框
    setShowSuccessDialog(false);
  }

  // 获取审查结果的审查状态
  const getReviewStatusBadge = () => {
    if (isReviewing) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          审查中 {reviewProgress > 0 && `(${reviewProgress}%)`}
        </Badge>
      )
    }
    
    if (!reviewResult) return null
    
    if (!reviewResult.hasIssues) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          全部通过
        </Badge>
      )
    }
    
    if (reviewResult.issues.some((i: FileReviewIssue) => i.severity === 'error')) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          有严重问题
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
        有警告问题
      </Badge>
    )
  }

  // 渲染常规表单视图
  const renderNormalView = () => (
    <ReviewFormBase
      title="新建初始审查"
      returnPath="/ethic-projects/human"
      projectInfo={projectData}
      fileList={reviewFiles}
      customSubmitButton={
        <div className="flex items-center gap-3">
          <Button onClick={handlePreSubmit} className="bg-primary">
            <SendHorizontal className="mr-2 h-4 w-4" />
            提交送审
          </Button>
        </div>
      }
    >
      {/* 项目信息卡片 */}
      <ProjectInfoCard 
        title="项目信息"
        fields={projectInfoFields}
      />

      {/* 送审文件列表 */}
      <ReviewFileList
        title="送审文件信息"
        fileList={reviewFiles}
        onChange={handleFilesChange}
        onAIReview={startAIReview}
      />
    </ReviewFormBase>
  )

  // 渲染AI审查分栏视图
  const renderAIReviewView = () => (
    <div className="w-full pb-6 px-6">
      {/* 头部 - 标题和返回按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {/* 返回按钮 */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeAIReview}
            className="mr-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
            title={getCloseButtonTooltip()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新建初始审查</h1>
          {isPanelCollapsed && (
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-100 flex items-center gap-1">
              <PanelLeftClose className="h-3 w-3" />
              <span>已收起AI面板</span>
            </Badge>
          )}
        </div>
        
        {/* 分栏模式标签 - 只在面板展开时显示 */}
        {!isPanelCollapsed && (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
            分栏模式
          </Badge>
        )}
      </div>
      
      {/* 左右分栏布局 */}
      <div className={`grid grid-cols-1 ${isPanelCollapsed ? 'md:grid-cols-1' : 'md:grid-cols-[1fr_480px]'} gap-6 relative transition-all duration-300`}>
        {/* 左侧：表单内容 */}
        <div className={`space-y-6 ${isPanelCollapsed ? 'w-full' : 'w-full overflow-hidden'}`}>
          {/* 项目信息卡片 */}
          <ProjectInfoCard 
            title="项目信息"
            fields={projectInfoFields}
          />

          {/* 送审文件列表 */}
          <ReviewFileList
            title="送审文件信息"
            fileList={reviewFiles}
            onChange={handleFilesChange}
            onAIReview={startAIReview}
          />
          
          {/* 添加底部操作栏 */}
          <div className="flex justify-between items-center pt-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveDraft} 
              className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              保存草稿
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeAIReview} 
                className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              >
                取消
              </Button>
              <Button 
                type="button" 
                onClick={handlePreSubmit} 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
              >
                提交送审
              </Button>
            </div>
          </div>
        </div>
        
        {/* 右侧折叠按钮 - 当面板折叠时显示 */}
        {isPanelCollapsed && (
          <Button
            variant="outline"
            size="icon"
            onClick={togglePanelCollapse}
            className="fixed right-6 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white shadow-md border-blue-100 text-blue-600 hover:text-blue-700 hover:bg-blue-50 z-10 rounded-full flex items-center justify-center"
            title={getToggleButtonTooltip()}
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        )}
        
        {/* 右侧：AI审查结果 - 动态高度根据内容调整 */}
        {!isPanelCollapsed && (
          <div className="border border-[#e8ecf5] rounded-xl shadow-sm bg-white flex flex-col h-fit">
            <div className="border-b border-[#e8ecf5] bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-gray-800">AI形式审查</h2>
                  {getReviewStatusBadge() && getReviewStatusBadge()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200"
                    onClick={togglePanelCollapse}
                    title={getToggleButtonTooltip()}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* 审查进度条 - 仅在审查过程中显示 */}
              {isReviewing && (
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 ease-out"
                      style={{ width: `${reviewProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>审查文件中</span>
                    <span>
                      {reviewProgress < 100 
                        ? `预计剩余时间: ${Math.ceil((100 - reviewProgress) / 20)} 秒` 
                        : "处理完成"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* 内容区域 - 动态高度根据内容调整 */}
            <div className="bg-white">
              {isReviewing ? (
                <div className="flex flex-col items-center py-16">
                  <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">正在分析文件内容</h3>
                    <p className="text-sm text-gray-500">这可能需要几秒钟...</p>
                  </div>
                  
                  {/* 文件审查动画效果 */}
                  <div className="relative w-64 h-48 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    {/* 文档扫描线动画 */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1 bg-blue-400 opacity-70"
                      style={{
                        animation: "scanLine 1.5s ease-in-out infinite",
                        boxShadow: "0 0 8px 1px rgba(59, 130, 246, 0.5)"
                      }}
                    ></div>
                    
                    {/* 模拟文档内容 */}
                    <div className="px-4 py-3">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="h-2 bg-gray-200 rounded-full mb-2 animate-pulse"
                          style={{ 
                            width: `${Math.floor(Math.random() * 40) + 60}%`,
                            animationDelay: `${i * 0.1}s`,
                            opacity: isReviewing ? 1 : 0.5
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* 审查文件提示 */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-50 to-transparent p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                        <div className="text-xs text-blue-700 whitespace-nowrap overflow-hidden">
                          <span 
                            className="inline-block"
                            style={{
                              animation: "textScroll 8s linear infinite",
                              animationDelay: "0.5s"
                            }}
                          >
                            检查文件格式 → 验证内容完整性 → 分析文件结构 → 检查版本一致性 → 验证数据有效性
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 自定义CSS动画 */}
                  <style jsx>{`
                    @keyframes scanLine {
                      0% { top: 4%; }
                      50% { top: 92%; }
                      100% { top: 4%; }
                    }
                    
                    @keyframes textScroll {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                    }
                  `}</style>
                </div>
              ) : (
                <div>
                  <AIFileReviewResult
                    result={reviewResult || { hasIssues: false, issues: [], totalFiles: 0, validFiles: 0 }}
                    isLoading={isReviewing}
                    onFixIssues={handleUpdateFileIssues}
                    files={filesMap}
                    onRefreshReview={handleRefreshReview}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // 渲染主界面
  return (
    <div className="human-ethics-initial-review-container w-full">
      <div className="transition-all duration-300 ease-in-out">
        {showAIReview ? renderAIReviewView() : renderNormalView()}
      </div>
      
      {/* 提交成功对话框 */}
      <SubmitSuccessDialog
        isOpen={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onReturnToList={() => router.push("/ethic-projects/human")}
        onContinueAdd={resetForm}
      />
    </div>
  )
} 