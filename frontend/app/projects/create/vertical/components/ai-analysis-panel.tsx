"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Check, Database, Zap, UploadCloud, ChevronRight, ChevronLeft, Mic, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
// Add these imports at the top of the file
import { FileText, Upload, XIcon, FileSearch, FileDigit, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入拆分后的组件
import { TextRecognitionPanel } from "./text-recognition-panel"
import { VoiceInputPanel } from "./voice-input-panel"
import { AIAnalysisContent } from "./ai-analysis-content"

interface AIAnalysisPanelProps {
  mockAnalysisResult?: Record<string, any>
  filledFields?: string[]
  handleFillField?: (field: string) => void
  handleFillAll: () => void
  isPanelCollapsed?: boolean
  setIsPanelCollapsed?: (collapsed: boolean) => void
  defaultAnalysisMode?: boolean
}

export const AIAnalysisPanel = ({
  mockAnalysisResult = {},
  filledFields = [],
  handleFillField = () => {},
  handleFillAll,
  isPanelCollapsed = false,
  setIsPanelCollapsed,
  defaultAnalysisMode = true,
}: AIAnalysisPanelProps) => {
  const router = useRouter()
  const [isFillingAll, setIsFillingAll] = useState(false)
  const [currentFillingIndex, setCurrentFillingIndex] = useState(-1)
  const [currentFillingField, setCurrentFillingField] = useState("")
  const [fillProgress, setFillProgress] = useState(0)
  const [fillCompleted, setFillCompleted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  // 使用ref存储取消状态，确保在异步回调中能获取最新值
  const isCancelledRef = useRef(false)
  // 使用数组存储所有定时器ID
  const timeoutIdsRef = useRef<number[]>([])

  // Add these state variables inside the AIAnalysisPanel component
  const [showUploadInterface, setShowUploadInterface] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState<"uploading" | "scanning" | "extracting" | "analyzing" | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [analyzedFieldsCount, setAnalyzedFieldsCount] = useState(0)
  const [currentAnalyzingField, setCurrentAnalyzingField] = useState<string | null>(null)
  const [isUploadAreaHovered, setIsUploadAreaHovered] = useState(false)

  // 面板折叠状态控制
  const [internalIsPanelCollapsed, setInternalIsPanelCollapsed] = useState(false)
  const actualIsPanelCollapsed = isPanelCollapsed !== undefined ? isPanelCollapsed : internalIsPanelCollapsed
  const toggleCollapsed = (value: boolean) => {
    if (setIsPanelCollapsed) {
      setIsPanelCollapsed(value)
    } else {
      setInternalIsPanelCollapsed(value)
    }
  }

  // 模式和状态控制
  // 修改初始状态，默认为分析模式
  const [isAIAnalysisMode, setIsAIAnalysisMode] = useState(defaultAnalysisMode)
  const [isFillingField, setIsFillingField] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [confidence, setConfidence] = useState(92)

  // 分析状态
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [showProjectType, setShowProjectType] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  // 填充模式
  const [fillMode, setFillMode] = useState<"text" | "voice">("text")

  const verticalTextStyle = {
    writingMode: "vertical-rl" as const,
    textOrientation: "mixed" as const,
    letterSpacing: "0.05em",
  }

  // Add these functions inside the AIAnalysisPanel component

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle file upload and analysis
  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "请选择文件",
        description: "请先选择一个文件再上传",
        variant: "destructive",
      })
      return
    }

    // Start upload
    setAnalysisStage("uploading")
    setUploadProgress(0)
    setIsFileUploading(true)

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(uploadInterval)
        toast({
          title: "文件上传完成",
          description: "开始扫描文件内容...",
          duration: 2000,
        })
        simulateFileScan()
      }
    }, 100)
  }

  // 在组件卸载时清除所有定时器
  useEffect(() => {
    return () => {
      clearAllTimeouts()
    }
  }, [])

  // Add this effect to reset the upload interface when switching modes
  useEffect(() => {
    if (!isAIAnalysisMode) {
      // Reset to upload interface when switching to AI fill mode
      setShowUploadInterface(true)
      setSelectedFile(null)
      setIsFileUploading(false)
      setUploadProgress(0)
      setAnalysisStage(null)
    }
  }, [isAIAnalysisMode])

  // Simulate file scanning
  const simulateFileScan = () => {
    setAnalysisStage("scanning")
    setScanProgress(0)

    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          simulateFieldExtraction()
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  // Simulate field extraction
  const simulateFieldExtraction = () => {
    setAnalysisStage("extracting")
    setExtractionProgress(0)

    const extractionInterval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(extractionInterval)
          simulateFieldAnalysis()
          return 100
        }
        return prev + 4
      })
    }, 150)
  }

  // Simulate field analysis
  const simulateFieldAnalysis = () => {
    setAnalysisStage("analyzing")
    setAnalyzedFieldsCount(0)

    const fieldKeys = Object.keys(mockAnalysisResult)
    let currentIndex = 0

    const analysisInterval = setInterval(() => {
      if (currentIndex < fieldKeys.length) {
        const field = fieldKeys[currentIndex]
        setCurrentAnalyzingField(field)
        setAnalyzedFieldsCount(currentIndex + 1)
        currentIndex++
      } else {
        clearInterval(analysisInterval)

        // Analysis complete
        toast({
          title: "分析完成",
          description: `已成功识别 ${fieldKeys.length} 个字段`,
          duration: 3000,
        })

        // Show recognized fields
        setShowUploadInterface(false)
        setIsFileUploading(false)
        setAnalysisStage(null)
      }
    }, 300)
  }

  // Cancel upload/analysis
  const handleCancelUpload = () => {
    setIsFileUploading(false)
    setAnalysisStage(null)
    setUploadProgress(0)
  }

  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-500" />
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  // 重新上传功能
  // Modify the handleReupload function
  const handleReupload = () => {
    if (!isAIAnalysisMode) {
      // Reset to upload interface in AI fill mode
      setShowUploadInterface(true)
      setSelectedFile(null)
      setIsFileUploading(false)
      setUploadProgress(0)
      setAnalysisStage(null)
    } else {
      // Original behavior for AI analysis mode
      localStorage.removeItem("analysisResult")
      router.push("/projects/create/vertical")
    }
  }

  // 清除所有定时器的函数
  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutIdsRef.current = []
  }

  // 一键填充动画效果
  const handleFillAllWithAnimation = () => {
    // 重置取消状态
    isCancelledRef.current = false
    // 清除之前可能存在的定时器
    clearAllTimeouts()

    setIsFillingAll(true)
    setCurrentFillingIndex(0)
    setFillProgress(0)
    setFillCompleted(false)

    toast({
      title: "开始填充",
      description: "AI正在填充所有字段，请稍候...",
      duration: 2000,
    })

    // 调用父组件的填充函数
    handleFillAll()

    // 模拟字段填充的动画
    const fields = Object.keys(mockAnalysisResult)
    let index = 0

    const fillNextField = () => {
      // 如果已取消，则不继续执行
      if (isCancelledRef.current) return

      if (index < fields.length) {
        setCurrentFillingIndex(index)
        setCurrentFillingField(fields[index])
        setFillProgress(Math.floor((index / fields.length) * 100))

        // 模拟填充当前字段
        const id1 = window.setTimeout(() => {
          if (isCancelledRef.current) return
          setIsFillingField(fields[index])

          // 模拟填充完成后进入下一个字段
          const id2 = window.setTimeout(() => {
            if (isCancelledRef.current) return
            setIsFillingField(null)
            index++
            fillNextField()
          }, 300)

          timeoutIdsRef.current.push(id2)
        }, 500)

        timeoutIdsRef.current.push(id1)
      } else {
        // 所有字段填充完成
        if (!isCancelledRef.current) {
          setIsFillingAll(false)
          setCurrentFillingIndex(-1)
          setFillProgress(100)
          setFillCompleted(true)

          toast({
            title: "填充完成",
            description: `已成功填充${fields.length}个字段`,
            duration: 3000,
          })
        }
      }
    }

    // 开始填充第一个字段
    fillNextField()
  }

  // 取消填充
  const handleCancelFilling = () => {
    // 设置取消状态
    isCancelledRef.current = true
    // 清除所有定时器
    clearAllTimeouts()

    // 重置所有状态
    setIsFillingAll(false)
    setCurrentFillingIndex(-1)
    setIsFillingField(null)
    setFillProgress(0)

    toast({
      title: "已取消填充",
      description: "填充过程已停止",
      duration: 2000,
    })
  }

  // 切换AI分析模式
  const toggleAIAnalysisMode = () => {
    setIsAIAnalysisMode(!isAIAnalysisMode)

    // 如果切换到分析模式，重置分析状态
    if (!isAIAnalysisMode) {
      setHasAnalyzed(false)
      setShowProjectType(false)
      setShowSuggestions(false)
      setShowCompletion(false)
    }
  }

  // 开始分析项目
  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setHasAnalyzed(false)
    setShowProjectType(false)
    setShowSuggestions(false)
    setShowCompletion(false)

    // 模拟分析过程
    setTimeout(() => {
      setHasAnalyzed(true)

      // 随机生成新的置信度，在85-98之间
      const newConfidence = Math.floor(Math.random() * 14) + 85
      setConfidence(newConfidence)

      // 依次显示各个分析结果
      setTimeout(() => {
        setShowProjectType(true)

        setTimeout(() => {
          setShowSuggestions(true)

          setTimeout(() => {
            setShowCompletion(true)
            setIsAnalyzing(false)

            toast({
              title: "分析完成",
              description: `AI已完成项目分析，置信度: ${newConfidence}%`,
              duration: 3000,
            })
          }, 800)
        }, 800)
      }, 800)
    }, 2000)
  }

  // 重新分析项目
  const handleReanalyze = () => {
    handleStartAnalysis()
  }

  // Add this function to render the upload interface
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

          <div
            className={cn(
              "flex flex-col items-center p-6 rounded-xl border-2 border-dashed transition-all duration-300",
              isUploadAreaHovered ? "border-primary bg-blue-50" : "border-primary/40 bg-white/50",
            )}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Upload
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isUploadAreaHovered ? "text-primary" : "text-blue-500",
                )}
              />
            </div>

            <h3
              className={cn(
                "text-lg font-medium mb-1 transition-all duration-300",
                isUploadAreaHovered ? "text-primary" : "text-foreground",
              )}
            >
              上传文件
            </h3>
            <p className="text-sm text-muted-foreground mb-3">支持PDF、Word、Excel、图片等格式</p>

            <p className="text-sm font-medium text-center">
              {selectedFile ? selectedFile.name : "点击或拖拽文件到此处"}
            </p>
            {selectedFile && (
              <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            )}
          </div>
        </div>

        {/* Display selected file */}
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
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
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
      </div>
    )
  }

  // Add this function to render the analysis process
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
              onClick={handleCancelUpload}
            >
              <XIcon className="mr-2 h-4 w-4" />
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
              onClick={handleCancelUpload}
            >
              <XIcon className="mr-2 h-4 w-4" />
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
              onClick={handleCancelUpload}
            >
              <XIcon className="mr-2 h-4 w-4" />
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
              已完成 {analyzedFieldsCount}/{Object.keys(mockAnalysisResult).length} 个字段
            </p>

            <Progress
              value={(analyzedFieldsCount / Object.keys(mockAnalysisResult).length) * 100}
              className="w-full max-w-xs h-2"
            />

            <Button
              variant="outline"
              className="mt-4 border-dashed border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleCancelUpload}
            >
              <XIcon className="mr-2 h-4 w-4" />
              取消分析
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  useEffect(() => {
    // 添加shine动画到全局样式
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes shine {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      .animate-shine {
        animation: shine 3s linear infinite;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      {/* 收起/展开按钮 */}
      <button
        onClick={() => toggleCollapsed(!actualIsPanelCollapsed)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "fixed z-10 flex flex-col items-center justify-center transition-all",
          actualIsPanelCollapsed
            ? "right-0 top-[calc(var(--header-height)+8rem)] h-32 w-7 text-white rounded-l-md"
            : "right-[350px] top-[calc(var(--header-height)+12rem)] h-16 w-4 text-white rounded-l-md",
          isHovering
            ? "bg-gradient-to-b from-primary/90 to-primary/70"
            : "bg-gray-400/70 hover:bg-gradient-to-b hover:from-primary/90 hover:to-primary/70",
        )}
      >
        {actualIsPanelCollapsed ? (
          <>
            <div className="flex flex-col items-center justify-center h-full w-full">
              <ChevronLeft className="h-5 w-5 mb-2" />
              <div style={verticalTextStyle} className="text-xs font-medium tracking-wider">
                智能填充
              </div>
            </div>
          </>
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* AI分析结果面板 */}
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

          {/* 添加填充模式切换Tab */}
          {!isAIAnalysisMode && (
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

        {/* 填充进行中的蒙版 */}
        {isFillingAll && (
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

        <CardContent className="space-y-4 overflow-y-auto flex-grow relative z-10 bg-white/70 pb-16">
          {isAIAnalysisMode ? (
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
          ) : fillMode === "text" ? (
            isFileUploading ? (
              // Show analysis process when uploading/analyzing
              renderAnalysisProcess()
            ) : showUploadInterface ? (
              // Show upload interface initially
              renderUploadInterface()
            ) : (
              // Show text recognition panel after analysis is complete
              <TextRecognitionPanel
                mockAnalysisResult={mockAnalysisResult}
                filledFields={filledFields}
                handleFillField={handleFillField}
                isFillingAll={isFillingAll}
                currentFillingIndex={currentFillingIndex}
                isFillingField={isFillingField}
              />
            )
          ) : (
            // Voice input panel
            <VoiceInputPanel handleFillAll={handleFillAll} />
          )}
        </CardContent>

        {/* 固定在底部的按钮区域 - 在AI分析模式或语音录入模式下不显示 */}
        {!isAIAnalysisMode && fillMode !== "voice" && !isFileUploading && (
          <div className="border-t border-muted/30 p-4 space-y-3 bg-white/80 shrink-0 relative z-10">
            <>
              {/* 上传并分析按钮 - 只在显示上传界面时显示 */}
              {showUploadInterface && (
                <Button
                  className={cn(
                    "w-full relative overflow-hidden transition-all duration-500",
                    !selectedFile && "opacity-70 cursor-not-allowed",
                    "bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:scale-[1.02] active:scale-[0.98]",
                  )}
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                >
                  {/* 发光效果 */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine"></div>

                  <div className="relative flex items-center justify-center">
                    <Upload className="mr-2 h-4 w-4" />
                    上传并分析
                  </div>
                </Button>
              )}

              {/* 一键填充按钮 - 只在显示识别结果时显示 */}
              {!showUploadInterface && !fillCompleted && (
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
                  {/* 发光效果 */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine"></div>

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

              {/* 重新上传按钮 - 只在显示识别结果时显示 */}
              {!showUploadInterface && (
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
              )}
            </>
          </div>
        )}
      </div>
    </>
  )
}

