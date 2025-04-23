"use client"

import type React from "react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BrainCircuit,
  Check,
  Database,
  Zap,
  UploadCloud,
  Mic,
  X,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  FileSearch,
  FileDigit,
  FileCheck,
  File,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileCode,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { TextRecognitionPanel } from "./text-recognition-panel"
import { VoiceInputPanel } from "./voice-input-panel"
import { AIAnalysisContent } from "./ai-analysis-content"
import { type Dispatch, type SetStateAction, useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface AIPanelContentProps {
  actualIsPanelCollapsed: boolean
  isAIAnalysisMode: boolean
  fillMode: "text" | "voice"
  setFillMode: Dispatch<SetStateAction<"text" | "voice">>
  isFillingAll: boolean
  fillProgress: number
  currentFillingField: string
  currentFillingIndex: number
  handleCancelFilling: () => void
  mockAnalysisResult: Record<string, any>
  hasAnalyzed: boolean
  isAnalyzing: boolean
  confidence: number
  showProjectType: boolean
  showSuggestions: boolean
  showCompletion: boolean
  handleStartAnalysis: () => void
  handleReanalyze: () => void
  filledFields: string[]
  handleFillField: (field: string) => void
  handleFillAll: () => void
  isFillingField: string | null
  fillCompleted: boolean
  handleFillAllWithAnimation: () => void
  handleReupload: () => void
  toggleAIAnalysisMode: () => void
}

// 模拟分析结果数据
const mockExtractedFields = {
  批准号: "HX2025001",
  项目名称: "智能制造工艺优化与自动化系统开发",
  所属单位: "机械工程学院",
  项目分类: "工程技术",
  项目级别: "企业合作",
  申请单位: "智能科技有限公司",
  项目负责人: "李明",
  联系电话: "13812345678",
  电子邮箱: "liming@example.com",
  项目开始日期: "2025-04-01",
  项目结束日期: "2026-03-31",
  项目总预算: "580000",
}

// 分析阶段定义
type AnalysisStage = "uploading" | "scanning" | "extracting" | "analyzing" | "complete" | null

// 获取文件图标函数
const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""

  switch (extension) {
    case "pdf":
      return <FilePdf className="h-8 w-8 text-red-500" />
    case "doc":
    case "docx":
      return <FileText className="h-8 w-8 text-blue-600" />
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
      return <FileImage className="h-8 w-8 text-purple-500" />
    case "txt":
      return <FileText className="h-8 w-8 text-gray-600" />
    case "json":
    case "xml":
    case "html":
    case "js":
    case "ts":
      return <FileCode className="h-8 w-8 text-yellow-600" />
    default:
      return <File className="h-8 w-8 text-gray-500" />
  }
}

export const AIPanelContent = ({
  actualIsPanelCollapsed,
  isAIAnalysisMode,
  fillMode,
  setFillMode,
  isFillingAll: propIsFillingAll,
  fillProgress,
  currentFillingField: propCurrentFillingField,
  currentFillingIndex: propCurrentFillingIndex,
  handleCancelFilling,
  mockAnalysisResult,
  hasAnalyzed,
  isAnalyzing,
  confidence,
  showProjectType,
  showSuggestions,
  showCompletion,
  handleStartAnalysis,
  handleReanalyze,
  filledFields,
  handleFillField,
  handleFillAll,
  isFillingField,
  fillCompleted,
  handleFillAllWithAnimation: propHandleFillAllWithAnimation,
  handleReupload: originalHandleReupload,
  toggleAIAnalysisMode,
}: AIPanelContentProps) => {
  // 添加状态控制是否显示上传界面 - 仅用于AI智能填充模式
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  // 添加状态控制文件上传和分析过程
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // 添加悬停状态
  const [isUploadAreaHovered, setIsUploadAreaHovered] = useState(false)

  // 添加分析阶段状态
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>(null)
  const [extractedFields, setExtractedFields] = useState<Record<string, string>>({})
  const [currentAnalyzingField, setCurrentAnalyzingField] = useState<string | null>(null)
  const [analyzedFieldsCount, setAnalyzedFieldsCount] = useState(0)
  const [scanProgress, setScanProgress] = useState(0)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [analysisConfidence, setAnalysisConfidence] = useState(0)

  // 添加分析取消状态
  const [isAnalysisCancelled, setIsAnalysisCancelled] = useState(false)

  // 添加分析间隔引用，用于取消
  const [analysisIntervals, setAnalysisIntervals] = useState<NodeJS.Timeout[]>([])

  // State variables for filling animation
  const [isFillingAll, setIsFillingAll] = useState(propIsFillingAll)
  const [currentFillingField, setCurrentFillingField] = useState(propCurrentFillingField)
  const [currentFillingIndex, setCurrentFillingIndex] = useState(propCurrentFillingIndex)
  const [fillProgressState, setFillProgress] = useState(0)

  // 当模式切换时，重置上传相关状态
  useEffect(() => {
    if (isAIAnalysisMode) {
      // 如果切换到AI分�����模式，重置所有上传相关状态
      setShowUploadPanel(false)
      setIsUploading(false)
      setIsAnalyzingFile(false)
      setUploadProgress(0)
      setSelectedFile(null)
      setAnalysisStage(null)
      setExtractedFields({})
      setCurrentAnalyzingField(null)
      setAnalyzedFieldsCount(0)
      setScanProgress(0)
      setExtractionProgress(0)
    }
  }, [isAIAnalysisMode])

  // 清理分析间隔
  useEffect(() => {
    return () => {
      // 组件卸载时清除所有间隔
      analysisIntervals.forEach((interval) => clearInterval(interval))
    }
  }, [analysisIntervals])

  // 修改重新上传函数 - 仅在AI智能填充模式下使用
  const handleReupload = () => {
    if (!isAIAnalysisMode) {
      // 清空已分析的字段（如果需要）
      // 显示上传区域
      setIsUploading(true)
      setUploadProgress(0)
      setAnalysisStage(null)
      setExtractedFields({})
      setCurrentAnalyzingField(null)
      setAnalyzedFieldsCount(0)
      setScanProgress(0)
      setExtractionProgress(0)
    } else {
      // 在AI分析模式下，调用原始的重新分析函数
      originalHandleReupload()
    }
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // 取消分析过程
  const handleCancelAnalysis = () => {
    setIsAnalysisCancelled(true)

    // 清除所有分析间隔
    analysisIntervals.forEach((interval) => clearInterval(interval))
    setAnalysisIntervals([])

    // 重置分析状态
    setAnalysisStage(null)
    setIsUploading(false)

    toast({
      title: "分析已取消",
      description: "您已取消文件分析过程",
      duration: 2000,
    })
  }

  // 模拟文件扫描过程
  const simulateFileScan = () => {
    setAnalysisStage("scanning")
    setScanProgress(0)
    setIsAnalysisCancelled(false)

    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100 || isAnalysisCancelled) {
          clearInterval(scanInterval)
          if (!isAnalysisCancelled) {
            simulateFieldExtraction()
          }
          return 100
        }
        return prev + 2
      })
    }, 100)

    // 保存间隔引用
    setAnalysisIntervals((prev) => [...prev, scanInterval])
  }

  // 模拟字段提取过程
  const simulateFieldExtraction = () => {
    setAnalysisStage("extracting")
    setExtractionProgress(0)

    const extractionInterval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100 || isAnalysisCancelled) {
          clearInterval(extractionInterval)
          if (!isAnalysisCancelled) {
            simulateFieldAnalysis()
          }
          return 100
        }
        return prev + 4
      })
    }, 150)

    // 保存间隔引用
    setAnalysisIntervals((prev) => [...prev, extractionInterval])
  }

  // 修改 handleFileUpload 函数，使其在分析完成后直接切换到文本识别面板
  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "请选择文件",
        description: "请先选择一个文件再上传",
        variant: "destructive",
      })
      return
    }

    // 开始上传
    setAnalysisStage("uploading")
    setUploadProgress(1) // 设置为1表示开始上传
    setIsAnalysisCancelled(false)

    // 模拟上传进度
    let progress = 1
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100 || isAnalysisCancelled) {
        clearInterval(interval)

        if (!isAnalysisCancelled) {
          // 上传完成后开始分析
          toast({
            title: "文件上传完成",
            description: "开始扫描文件内容...",
            duration: 2000,
          })

          // 模拟快速分析过程
          simulateQuickAnalysis()
        }
      }
    }, 100)

    // 保存间隔引用
    setAnalysisIntervals((prev) => [...prev, interval])
  }

  // 添加一个新的函数，用于快速分析并直接跳转到文本识别面板
  const simulateQuickAnalysis = () => {
    // 显示短暂的分析中状态
    setAnalysisStage("analyzing")

    // 模拟分析过程，但不显示详细步骤
    const analysisTimeout = setTimeout(() => {
      if (!isAnalysisCancelled) {
        toast({
          title: "分析完成",
          description: "已成功识别文档中的项目信息",
          duration: 2000,
        })

        // 分析完成后，直接关闭上传界面，回到文本识别面板
        setIsUploading(false)
        setAnalysisStage(null)
      }
    }, 1500)

    // 保存超时引用
    setAnalysisIntervals((prev) => [...prev, analysisTimeout as unknown as NodeJS.Timeout])
  }

  // 修改 simulateFieldAnalysis 函数，使其在完成后直接切换到文本识别面板
  const simulateFieldAnalysis = () => {
    setAnalysisStage("analyzing")
    setAnalyzedFieldsCount(0)

    const fieldKeys = Object.keys(mockExtractedFields)
    let currentIndex = 0

    const analysisInterval = setInterval(() => {
      if (currentIndex < fieldKeys.length && !isAnalysisCancelled) {
        const field = fieldKeys[currentIndex]
        setCurrentAnalyzingField(field)
        setExtractedFields((prev) => ({
          ...prev,
          [field]: mockExtractedFields[field],
        }))
        setAnalyzedFieldsCount(currentIndex + 1)
        currentIndex++
      } else {
        clearInterval(analysisInterval)

        if (!isAnalysisCancelled) {
          // 分析完成后直接切换到文本识别面板，而不是显示完成状态
          toast({
            title: "分析完成",
            description: `已成功识别 ${fieldKeys.length} 个字段`,
            duration: 3000,
          })

          // 关闭上传界面，回到文本识别面板
          setIsUploading(false)
          setAnalysisStage(null)
        }
      }
    }, 300) // 加快分析速度

    // 保存间隔引用
    setAnalysisIntervals((prev) => [...prev, analysisInterval])
  }

  // 取消上传
  const handleCancelUpload = () => {
    setShowUploadPanel(false)
    setIsUploading(false)
    setIsAnalyzingFile(false)
    setSelectedFile(null)
    setAnalysisStage(null)
  }

  // 渲染分析过程界面
  const renderAnalysisProcess = () => {
    switch (analysisStage) {
      case "uploading":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
              <div className="text-lg font-bold text-primary">{uploadProgress}%</div>
            </div>
            <h3 className="text-lg font-medium mb-2">正在上传文件</h3>
            <p className="text-sm text-muted-foreground mb-4">请耐心等待上传完成...</p>
            <Progress value={uploadProgress} className="w-full max-w-xs h-2" />

            <Button
              variant="outline"
              className="mt-4 border-dashed border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleCancelAnalysis}
            >
              <X className="mr-2 h-4 w-4" />
              取消上传
            </Button>
          </div>
        )

      case "scanning":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 relative">
              <FileSearch className="h-8 w-8 text-blue-600" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium mb-2">扫描文件内容</h3>
            <p className="text-sm text-muted-foreground mb-4">正在识别文档结构和内容...</p>
            <Progress value={scanProgress} className="w-full max-w-xs h-2" />

            <div className="mt-4 w-full max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>文档类型识别</span>
                <span>完成</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>页面布局分析</span>
                <span>{scanProgress > 30 ? "完成" : "进行中..."}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>文本内容提取</span>
                <span>{scanProgress > 60 ? "完成" : "等待中..."}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>表格数据识别</span>
                <span>{scanProgress > 80 ? "完成" : "等待中..."}</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 border-dashed border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleCancelAnalysis}
            >
              <X className="mr-2 h-4 w-4" />
              取消分析
            </Button>
          </div>
        )

      case "extracting":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 relative">
              <FileDigit className="h-8 w-8 text-indigo-600" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium mb-2">提取关键信息</h3>
            <p className="text-sm text-muted-foreground mb-4">正在从文档中提取关键字段...</p>
            <Progress value={extractionProgress} className="w-full max-w-xs h-2" />

            <div className="mt-4 w-full max-w-xs p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <p className="text-xs text-center text-indigo-700 mb-2">AI正在识别以下字段</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="bg-white/80 text-xs">
                  批准号
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  项目名称
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  所属单位
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  项目分类
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  项目级别
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  联系方式
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  项目周期
                </Badge>
                <Badge variant="outline" className="bg-white/80 text-xs">
                  预算金额
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 border-dashed border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleCancelAnalysis}
            >
              <X className="mr-2 h-4 w-4" />
              取消分析
            </Button>
          </div>
        )

      case "analyzing":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 relative">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium mb-2">智能分析</h3>
            <p className="text-sm text-muted-foreground mb-2">正在分析字段: {currentAnalyzingField}</p>
            <p className="text-xs text-muted-foreground mb-4">
              已完成 {analyzedFieldsCount}/{Object.keys(mockExtractedFields).length} 个字段
            </p>

            <Progress
              value={(analyzedFieldsCount / Object.keys(mockExtractedFields).length) * 100}
              className="w-full max-w-xs h-2"
            />

            <div className="mt-4 w-full max-w-xs">
              <div className="space-y-3">
                {Object.entries(extractedFields).map(([field, value]) => (
                  <div
                    key={field}
                    className="flex justify-between items-center p-2 bg-white/80 rounded-md border border-purple-100 shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-medium text-gray-700">{field}</p>
                      <p className="text-sm">{value}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                ))}

                {currentAnalyzingField && !extractedFields[currentAnalyzingField] && (
                  <div className="flex justify-between items-center p-2 bg-white/80 rounded-md border border-purple-100 shadow-sm animate-pulse">
                    <div>
                      <p className="text-xs font-medium text-gray-700">{currentAnalyzingField}</p>
                      <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 border-dashed border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleCancelAnalysis}
            >
              <X className="mr-2 h-4 w-4" />
              取消分析
            </Button>
          </div>
        )

      case "complete":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FileCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">分析完成</h3>
            <div className="flex items-center mb-4">
              <p className="text-sm text-muted-foreground mr-2">识别准确度:</p>
              <Badge className="bg-green-500">{analysisConfidence}%</Badge>
            </div>

            <div className="w-full max-w-xs p-3 bg-green-50 rounded-lg border border-green-100 mb-2">
              <p className="text-xs text-center text-green-700 mb-3">已成功提取以下字段</p>
              <div className="max-h-[200px] overflow-y-auto pr-2">
                <div className="space-y-2">
                  {Object.entries(extractedFields).map(([field, value]) => (
                    <div
                      key={field}
                      className="flex justify-between items-center p-2 bg-white rounded-md border border-green-100 shadow-sm"
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-700">{field}</p>
                        <p className="text-sm">{value}</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs flex space-x-2">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 via-primary to-red-500"
                onClick={() => {
                  // 这里可以添加将提取的字段应用到表单的逻辑
                  toast({
                    title: "已应用到表单",
                    description: "提取的字段已自动填充到表单中",
                    duration: 3000,
                  })
                  setIsUploading(false)
                }}
              >
                应用到表单
              </Button>
              <Button variant="outline" className="flex-shrink-0" onClick={handleReupload}>
                <UploadCloud className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      default:
        return renderUploadInterface()
    }
  }

  // 渲染上传文件界面 - 仅用于AI智能填充模式
  const renderUploadInterface = () => {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-xs mx-auto">
        <div
          className={cn(
            "w-full relative rounded-xl overflow-hidden transition-all duration-300",
            isUploadAreaHovered ? "shadow-lg" : "shadow-md",
          )}
          onMouseEnter={() => setIsUploadAreaHovered(true)}
          onMouseLeave={() => setIsUploadAreaHovered(false)}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />

          {/* 优化后的上传区域 - 将上方的图标和文字提示放入框内 */}
          <div
            className={cn(
              "flex flex-col items-center p-6 rounded-xl border-2 border-dashed transition-all duration-300",
              isUploadAreaHovered ? "border-primary bg-blue-50" : "border-primary/40 bg-white/50",
            )}
          >
            {/* 上传图标 */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Upload
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isUploadAreaHovered ? "text-primary" : "text-blue-500",
                )}
              />
            </div>

            {/* 标题和支持格式提示 */}
            <h3
              className={cn(
                "text-lg font-medium mb-1 transition-all duration-300",
                isUploadAreaHovered ? "text-primary" : "text-foreground",
              )}
            >
              上传文件
            </h3>
            <p className="text-sm text-muted-foreground mb-3">支持PDF、Word、Excel、图片等格式</p>

            {/* 文件信息或提示 */}
            <p className="text-sm font-medium text-center">
              {selectedFile ? selectedFile.name : "点击或拖拽文件到此处"}
            </p>
            {selectedFile && (
              <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            )}
          </div>
        </div>

        {/* 显示已选择的文件 */}
        {selectedFile && (
          <div className="w-full p-3 bg-white rounded-lg border border-muted/30 shadow-sm">
            <div className="flex items-center">
              <div className="mr-3">{getFileIcon(selectedFile.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {new Date().toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-4 p-4 bg-blue-50/70 rounded-lg">
          <h4 className="text-sm font-medium text-primary mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-1.5" />
            使用说明
          </h4>
          <ul className="text-xs space-y-2 text-gray-600">
            <li className="flex items-start">
              <div className="min-w-4 h-4 flex items-center justify-center mr-2 text-primary">1.</div>
              <p>上传文件后，AI将自动识别文件内容并提取关键信息</p>
            </li>
            <li className="flex items-start">
              <div className="min-w-4 h-4 flex items-center justify-center mr-2 text-primary">2.</div>
              <p>识别结果将用于自动填充表单，提高项目创建效率</p>
            </li>
            <li className="flex items-start">
              <div className="min-w-4 h-4 flex items-center justify-center mr-2 text-primary">3.</div>
              <p>您可以随时修改AI识别的内容，确保信息准确无误</p>
            </li>
            <li className="flex items-start">
              <div className="min-w-4 h-4 flex items-center justify-center mr-2 text-primary">4.</div>
              <p>文件大小限制为20MB，上传过程中请勿关闭页面</p>
            </li>
          </ul>
        </div>

        <div className="w-full">
          <Button
            className={cn(
              "w-full transition-all duration-300",
              "bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:shadow-lg hover:scale-[1.02]",
              !selectedFile && "opacity-70 cursor-not-allowed",
            )}
            onClick={handleFileUpload}
            disabled={!selectedFile}
          >
            上传并分析
          </Button>
        </div>
      </div>
    )
  }

  const handleFillAllWithAnimation = () => {
    const fields = Object.keys(mockAnalysisResult)
    setIsFillingAll(true)
    let index = 0

    const interval = setInterval(() => {
      if (index < fields.length) {
        const field = fields[index]
        handleFillField(field)
        setCurrentFillingField(field)
        setCurrentFillingIndex(index + 1)
        setFillProgress(Math.round(((index + 1) / fields.length) * 100))
        index++
      } else {
        clearInterval(interval)
        setIsFillingAll(false)
        setCurrentFillingIndex(-1)
        setFillProgress(100)
        // toast({
        //   title: "填充完成",
        //   description: `已成功填充${fields.length}个字段`,
        //   duration: 3000,
        // })
      }
    }, 200)
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-[var(--header-height)] bottom-0 w-[350px] bg-white border-l border-muted/50 flex flex-col transition-all duration-300 overflow-hidden",
        actualIsPanelCollapsed && "translate-x-full",
      )}
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(236, 242, 255, 0.7), rgba(245, 235, 255, 0.7), rgba(255, 235, 245, 0.7))",
      }}
    >
      {/* 彩色渐变边框 */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-400/60 via-primary/70 to-purple-400/60"></div>

      {/* 弥散的彩色背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 更明显的装饰元素 */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-blue-300/40 blur-2xl"></div>
        <div className="absolute bottom-40 left-10 w-56 h-56 rounded-full bg-purple-300/40 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-pink-300/40 blur-2xl"></div>
        <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-indigo-300/40 blur-2xl"></div>
      </div>

      <CardHeader className="pb-3 border-b border-muted/30 shrink-0 relative z-10 bg-white/70">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-base">
            {isAIAnalysisMode ? (
              <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
            ) : (
              <Database className="h-4 w-4 mr-2 text-primary" />
            )}
            <span className="bg-gradient-to-r from-blue-600 to-red-500 text-transparent bg-clip-text">
              {isAIAnalysisMode ? "AI分析" : "AI智能填充"}
            </span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Label htmlFor="ai-mode" className="text-xs text-muted-foreground">
              {isAIAnalysisMode ? "分析" : "填充"}
            </Label>
            <Switch
              id="ai-mode"
              checked={isAIAnalysisMode}
              onCheckedChange={toggleAIAnalysisMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* 添加填充模式切换Tab - 仅在AI智能填充模式且不在上传状态时显示 */}
        {!isAIAnalysisMode && !isUploading && (
          <div className="flex mt-3 pt-2">
            <div className="w-full flex rounded-md p-1 bg-muted/20">
              <button
                onClick={() => setFillMode("text")}
                className={cn(
                  "flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  fillMode === "text"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                <FileText className={cn("h-3.5 w-3.5 mr-1.5", fillMode === "text" ? "text-white" : "")} />
                文本识别
              </button>
              <button
                onClick={() => setFillMode("voice")}
                className={cn(
                  "flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  fillMode === "voice"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                <Mic className={cn("h-3.5 w-3.5 mr-1.5", fillMode === "voice" ? "text-white" : "")} />
                语音录入
              </button>
            </div>
          </div>
        )}
      </CardHeader>

      {/* 填充进行中的蒙版 - 仅在AI智能填充模式下显示 */}
      {!isAIAnalysisMode && isFillingAll && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            <div className="text-xl font-bold text-primary">{fillProgress}%</div>
          </div>

          <h3 className="text-lg font-medium mb-2">正在填充字段</h3>
          <p className="text-sm text-muted-foreground mb-1">当前: {currentFillingField}</p>
          <p className="text-sm text-muted-foreground mb-6">
            已完成 {currentFillingIndex} / {Object.keys(mockAnalysisResult).length} 个字段
          </p>

          <Progress value={fillProgress} className="w-full h-2 mb-6" />

          <Button
            variant="outline"
            className="border-dashed border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleCancelFilling}
          >
            <X className="mr-2 h-4 w-4" />
            取消填充
          </Button>
        </div>
      )}

      {/* 内容区域 */}
      <CardContent className="space-y-4 overflow-y-auto flex-grow relative z-10 bg-white/70">
        {isAIAnalysisMode ? (
          // AI分析模式内容
          <AIAnalysisContent
            hasAnalyzed={hasAnalyzed}
            isAnalyzing={isAnalyzing}
            confidence={confidence}
            showProjectType={showProjectType}
            showSuggestions={showSuggestions}
            showCompletion={showCompletion}
            handleStartAnalysis={handleStartAnalysis}
            handleReanalyze={handleReanalyze}
          />
        ) : isUploading ? (
          // AI智能填充模式 - 上传文件界面和分析过程
          <div className="flex flex-col items-center justify-center h-full">{renderAnalysisProcess()}</div>
        ) : fillMode === "text" ? (
          // AI智能填充模式 - 文本识别面板
          <TextRecognitionPanel
            mockAnalysisResult={mockAnalysisResult}
            filledFields={filledFields}
            handleFillField={handleFillField}
            isFillingAll={isFillingAll}
            currentFillingIndex={currentFillingIndex}
            isFillingField={isFillingField}
          />
        ) : (
          // AI智能填充模式 - 语音录入面板
          <VoiceInputPanel handleFillAll={handleFillAll} />
        )}
      </CardContent>

      {/* 底部按钮区域 - 仅在AI智能填充模式且不在上传状态下显示 */}
      {!isAIAnalysisMode && !isUploading && fillMode !== "voice" && (
        <div className="border-t border-muted/30 p-4 space-y-3 bg-white/80 shrink-0 relative z-10">
          <>
            {/* 一键填充按钮 */}
            {!fillCompleted && (
              <Button
                className={cn(
                  "w-full relative overflow-hidden transition-all duration-500",
                  filledFields.length === Object.keys(mockAnalysisResult).length
                    ? "bg-primary/90 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:scale-[1.02] active:scale-[0.98]",
                )}
                onClick={handleFillAllWithAnimation}
                disabled={filledFields.length === Object.keys(mockAnalysisResult).length || isFillingField !== null}
              >
                {/* 添加光闪过效果 */}
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer"></div>

                <div className="relative flex items-center justify-center">
                  {filledFields.length === Object.keys(mockAnalysisResult).length ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      已全部填充
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      一键填充所有字段
                    </>
                  )}
                </div>
              </Button>
            )}

            {/* 重新��传按钮 - 始终显示，但��有��别结果时才启用 */}
            <Button
              variant="outline"
              className={cn(
                "w-full border-dashed transition-all",
                Object.keys(mockAnalysisResult).length > 0
                  ? "border-primary/70 text-primary hover:bg-primary/10"
                  : "border-muted text-muted-foreground",
              )}
              onClick={handleReupload}
              disabled={Object.keys(mockAnalysisResult).length === 0}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              重新上传文件
            </Button>
          </>
        </div>
      )}
    </div>
  )
}

