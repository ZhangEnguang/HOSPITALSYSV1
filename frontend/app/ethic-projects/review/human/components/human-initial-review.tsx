"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"
import { ProjectInfoCard, ProjectInfoField } from "@/components/ethic-review/project-info-card"
import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { ReviewSubmitDialog } from "@/components/ethic-review/review-submit-dialog"
import { AIFileReviewResult } from "@/components/ethic-review/ai-file-review-result"
import { FileReviewIssue, aiReviewFiles, FileReviewResult } from "@/app/services/ai-file-review"
import { AIFormCheckGuide, shouldShowAIGuide } from "@/components/ethic-review/ai-form-check-guide"
import { AIReviewReminder } from "@/components/ethic-review/ai-review-reminder"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SendHorizontal, FileCheck2, X, Loader2, ArrowLeft, Sparkles } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  
  // 显示提交对话框的状态
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  
  // 存储文件对象的Map
  const [filesMap, setFilesMap] = useState<Map<number, File[]>>(new Map())
  
  // AI审查状态
  const [showAIReview, setShowAIReview] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<FileReviewResult | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewProgress, setReviewProgress] = useState(0)
  
  // 确认对话框状态
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmTitle, setConfirmTitle] = useState("")
  
  // 新增：AI引导和轻量级提醒状态
  const [showAIGuide, setShowAIGuide] = useState(false)
  const [showAIReminder, setShowAIReminder] = useState(false)
  const [hasUsedAIReview, setHasUsedAIReview] = useState(false)
  
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

  // 检查是否需要显示AI引导
  useEffect(() => {
    // 检查是否应该显示AI引导
    if (shouldShowAIGuide()) {
      // 给用户一点时间查看页面后再显示引导
      const timer = setTimeout(() => {
        setShowAIGuide(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  // 项目信息字段定义
  const projectInfoFields: ProjectInfoField[] = [
    { key: "projectTitle", label: "项目名称", value: projectData.projectTitle, disabled: true, span: "half" },
    { key: "projectType", label: "项目类型", value: projectData.projectType, disabled: true, span: "half" },
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

  // 检查是否有必填文件未上传
  const hasMissingRequiredFiles = useCallback(() => {
    const missingFiles = reviewFiles.filter(
      file => file.required && (!file.files || file.files.length === 0)
    )
    return missingFiles.length > 0
  }, [reviewFiles])

  // 处理表单提交前的验证
  const handlePreSubmit = () => {
    // 如果已经使用了AI审查，或已经查看过AI提醒，则直接进入常规提交流程
    if (hasUsedAIReview) {
      // 检查是否有未修复的问题
      if (reviewResult && reviewResult.hasIssues) {
        const hasErrors = reviewResult.issues.some(i => i.severity === 'error');
        const hasWarnings = reviewResult.issues.some(i => i.severity === 'warning');
        
        if (hasErrors || hasWarnings) {
          // 使用自定义对话框，显示确认信息
          setConfirmTitle(hasErrors ? "存在严重问题" : "存在警告问题");
          setConfirmMessage(hasErrors 
            ? "文件中存在严重问题，确定要继续提交吗？" 
            : "文件中存在警告问题，确定要继续提交吗？");
          setShowConfirmDialog(true);
          return;
        }
      }
      
      // 如果没有问题或问题已全部修复，直接显示提交对话框
      setShowSubmitDialog(true);
    } else {
      // 如果没有使用AI审查，显示轻量级提醒
      setShowAIReminder(true);
    }
  }

  // 新增：处理确认对话框
  const handleConfirmSubmit = () => {
    // 关闭确认对话框
    setShowConfirmDialog(false);
    // 显示提交对话框
    setShowSubmitDialog(true);
  }
  
  // 新增：处理AI引导完成
  const handleAIGuideContinue = () => {
    startAIReview();
  }
  
  // 新增：处理轻量级提醒的启动AI审查
  const handleReminderStartAIReview = () => {
    startAIReview();
    setHasUsedAIReview(true);
  }
  
  // 新增：处理轻量级提醒的继续提交
  const handleReminderContinueSubmit = () => {
    setHasUsedAIReview(true); // 标记为已经提示过
    setShowSubmitDialog(true);
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
      toast({
        title: "无法启动审查",
        description: "请先上传至少一个文件再进行AI形式审查",
        variant: "destructive"
      });
      return;
    }
    
    setIsReviewing(true);
    setShowAIReview(true);
    setReviewError(null);
    setReviewProgress(0);
    setHasUsedAIReview(true);
    
    // 构建审查文件列表
    const reviewFileList = [...initialReviewFiles].map(file => {
      const uploadedFiles = filesMap.get(file.id) || [];
      return {
        ...file,
        files: uploadedFiles
      };
    });
    
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
        
        if (result.hasIssues) {
          const errorCount = result.issues.filter(i => i.severity === 'error').length;
          const warningCount = result.issues.filter(i => i.severity === 'warning').length;
          
          toast({
            title: "AI审查完成",
            description: `发现${errorCount > 0 ? `${errorCount}个错误` : ''}${errorCount > 0 && warningCount > 0 ? '和' : ''}${warningCount > 0 ? `${warningCount}个警告` : ''}，请查看详情`,
            variant: errorCount > 0 ? "destructive" : (warningCount > 0 ? "warning" : "default")
          });
        } else {
          toast({
            title: "AI审查完成",
            description: "未发现问题，您的文件符合要求",
            variant: "success"
          });
        }
      }, 500);
      
    } catch (error) {
      console.error("AI审查出错:", error);
      setReviewError("AI审查过程中发生错误，请重试");
      setIsReviewing(false);
      
      toast({
        title: "审查失败",
        description: "AI审查过程中发生错误，请重试",
        variant: "destructive"
      });
    }
  }

  // 关闭AI审查
  const closeAIReview = () => {
    setShowAIReview(false);
  }

  // 更新文件问题
  const handleUpdateFileIssues = (issues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => {
    // 如果提供了新的文件集合，更新filesMap
    if (updatedFiles) {
      setFilesMap(updatedFiles);
    }
    
    // 更新审查结果中的问题
    if (reviewResult) {
      const updatedResult = {
        ...reviewResult,
        issues: issues,
        hasIssues: issues.length > 0
      };
      setReviewResult(updatedResult);
      
      if (issues.length === 0) {
        toast({
          title: "文件已修复",
          description: "所有问题已修复，可以继续提交",
          variant: "success"
        });
      } else {
        const errorCount = issues.filter(i => i.severity === 'error').length;
        const warningCount = issues.filter(i => i.severity === 'warning').length;
        
        toast({
          title: "问题已更新",
          description: `剩余${errorCount > 0 ? `${errorCount}个错误` : ''}${errorCount > 0 && warningCount > 0 ? '和' : ''}${warningCount > 0 ? `${warningCount}个警告` : ''}`,
          variant: errorCount > 0 ? "destructive" : (warningCount > 0 ? "warning" : "default")
        });
      }
    }
  }

  // 处理表单最终提交
  const handleFinalSubmit = () => {
    console.log("提交人体伦理初始审查表单:", { projectData, reviewFiles })
    
    // 关闭对话框
    setShowSubmitDialog(false)
    
    // 模拟API提交
    setTimeout(() => {
      // 显示成功提示
      toast({
        title: "提交成功",
        description: "人体伦理初始审查表单已提交成功，将进入审查流程"
      })
      
      // 根据对话框中选择的操作执行不同的跳转逻辑
      const returnToList = localStorage.getItem('reviewSubmitAction') === 'returnToList';
      setTimeout(() => {
        if (returnToList) {
          // 如果选择了"返回列表"，跳转到项目列表页
          router.push("/ethic-projects/human");
        } else {
          // 如果选择了"继续新增"，重置表单状态并准备新建
          resetForm();
        }
      }, 1500);
    }, 500)
  }
  
  // 新增：重置表单状态
  const resetForm = () => {
    // 重置文件列表
    setReviewFiles(initialReviewFiles);
    setFilesMap(new Map());
    
    // 重置审查状态
    setReviewResult(null);
    setShowAIReview(false);
    
    // 显示成功提示
    toast({
      title: "准备新建",
      description: "已重置表单，您可以开始新的审查申请"
    });
  }

  // 新增：获取审查结果的审查状态
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
          <Button 
            onClick={() => startAIReview()} 
            variant="outline"
            className="border-blue-200 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI形式审查
          </Button>
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
      />
    </ReviewFormBase>
  )

  // 渲染AI审查分栏视图
  const renderAIReviewView = () => (
    <div className="w-full pb-6 px-6">
      {/* 头部 - 标题和返回按钮 */}
      <div className="flex items-center mb-6">
        {/* 返回按钮 */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={closeAIReview}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">新建初始审查</h1>
      </div>
      
      {/* 左右分栏布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧：表单内容 */}
        <div className="space-y-6">
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
          />
        </div>
        
        {/* 右侧：AI审查结果 */}
        <div className="border border-[#e8ecf5] rounded-lg shadow-sm bg-white flex flex-col overflow-hidden" style={{ maxHeight: "800px" }}>
          <div className="border-b border-[#e8ecf5] bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-800">AI形式审查</h2>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-medium">
                  智能审查
                </Badge>
              </div>
              {getReviewStatusBadge() && (
                <div>
                  {getReviewStatusBadge()}
                </div>
              )}
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
          
          <div className="p-6 pb-0 overflow-hidden flex flex-col bg-[#fafbfd]">
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
              <div className="flex flex-col">
                <AIFileReviewResult
                  result={reviewResult || { hasIssues: false, issues: [], totalFiles: 0, validFiles: 0 }}
                  isLoading={isReviewing}
                  onFixIssues={handleUpdateFileIssues}
                  files={filesMap}
                />
              </div>
            )}
          </div>
          
          {/* 底部操作按钮 */}
          <div className="border-t border-[#e8ecf5] p-4 bg-white rounded-b-md flex justify-between items-center mt-auto">
            <div></div>
            <div className="flex gap-3">
              <Button
                onClick={startAIReview}
                variant="outline"
                className={`
                  border-blue-200 text-blue-700 hover:text-blue-800 hover:bg-blue-50 shadow-sm
                  ${isReviewing ? 'min-w-[140px] relative overflow-hidden' : ''}
                `}
                disabled={isReviewing}
              >
                {isReviewing ? (
                  <>
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="mr-1">审查中</span>
                      <span className="text-xs">{reviewProgress}%</span>
                    </div>
                    {/* 进度条背景 */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-100"></div>
                    {/* 实际进度 */}
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-out"
                      style={{ width: `${reviewProgress}%` }}
                    ></div>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="mr-2 h-4 w-4" />
                    重新审查
                  </>
                )}
              </Button>
              <Button 
                onClick={handlePreSubmit} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
                disabled={isReviewing}
              >
                <SendHorizontal className="mr-2 h-4 w-4" />
                提交送审
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 渲染主界面
  return (
    <div className="human-ethics-initial-review-container w-full">
      {showAIReview ? renderAIReviewView() : renderNormalView()}
      
      {/* 提交确认对话框 */}
      <ReviewSubmitDialog
        isOpen={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        fileList={initialReviewFiles}
        onConfirmSubmit={handleFinalSubmit}
        onUpdateFileIssues={handleUpdateFileIssues}
        files={filesMap}
        skipAIReview={hasUsedAIReview} // 如果已经使用过AI审查，则跳过再次审查
        reviewResult={reviewResult}
      />
      
      {/* 问题确认对话框 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>返回修改</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>继续提交</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* AI形式审查引导对话框 */}
      <AIFormCheckGuide
        isOpen={showAIGuide}
        onOpenChange={setShowAIGuide}
        onContinue={handleAIGuideContinue}
      />
      
      {/* AI轻量级提醒对话框 */}
      <AIReviewReminder
        isOpen={showAIReminder}
        onOpenChange={setShowAIReminder}
        onStartAIReview={handleReminderStartAIReview}
        onContinueSubmit={handleReminderContinueSubmit}
      />
    </div>
  )
} 