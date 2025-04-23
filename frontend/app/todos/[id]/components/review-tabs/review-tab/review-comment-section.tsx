"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  CheckCircle,
  XCircle,
  Settings,
  ChevronDown,
  FileText,
  Bot,
  RefreshCw,
  Square,
  HelpCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AIAssistant } from "./ai-assistant"

interface ReviewCommentSectionProps {
  isReviewCompleted: boolean
  finalStatus: string
  commentText: string
  setCommentText: (text: string) => void
  commentError: boolean
  commentErrorMessage: string
  files: File[]
  setFiles: (files: File[]) => void
  customReviews: { id: string; text: string; enabled: boolean }[]
  setCustomReviewsDialogOpen: (isOpen: boolean) => void
  setIsAiHelpDialogOpen: (isOpen: boolean) => void
  setCanScroll: (canScroll: boolean) => void
}

export function ReviewCommentSection({
  isReviewCompleted,
  finalStatus,
  commentText,
  setCommentText,
  commentError,
  commentErrorMessage,
  files,
  setFiles,
  customReviews,
  setCustomReviewsDialogOpen,
  setIsAiHelpDialogOpen,
  setCanScroll,
}: ReviewCommentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState("180px")
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  // AI相关状态
  const [showAIButton, setShowAIButton] = useState(false)
  const [isAIButtonVisible, setIsAIButtonVisible] = useState(false)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const [isTypingAI, setIsTypingAI] = useState(false)
  const [hasAiGenerated, setHasAiGenerated] = useState(false)
  const [loadingDots, setLoadingDots] = useState("")
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 处理常用审核意见点击
  const handleCommonReviewClick = (review: string) => {
    setCommentText((prev) => (prev ? `${prev}\n${review}` : review))
  }

  // 处理文件上传
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  // 更新输入框高度
  const updateTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const newHeight = `${scrollHeight + 5}px`

      if (scrollHeight < 180) {
        textareaRef.current.style.height = "180px"
        setTextareaHeight("180px")
      } else {
        textareaRef.current.style.height = newHeight
        setTextareaHeight(newHeight)
      }
    }
  }

  // 监听文本变化以调整高度
  useEffect(() => {
    updateTextareaHeight()
  }, [commentText])

  // 加载动画
  useEffect(() => {
    if (isTypingAI) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => {
          if (prev.length >= 3) return ""
          return prev + "."
        })
      }, 300)

      return () => clearInterval(interval)
    }
    return () => {}
  }, [isTypingAI])

  // 修改 handleFocus 函数，考虑 hasAiGenerated 状态
  const handleFocus = () => {
    // 只有当输入框为空或AI未生成过内容时才显示AI按钮
    if (commentText.trim() === "" || !hasAiGenerated) {
      setShowAIButton(true)
      setIsAIButtonVisible(true)
    }
  }

  // 修改 handleBlur 函数
  const handleBlur = () => {
    // 延迟隐藏焦点状态，以允许点击AI按钮
    setTimeout(() => {
      // 不要立即隐藏AI按钮，给用户一些时间点击
      setTimeout(() => {
        if (!isTypingAI && !isAiAnalyzing) {
          setIsAIButtonVisible(false)
          setTimeout(() => {
            setShowAIButton(false)
          }, 300) // 等待动画完成后真正隐藏
        }
      }, 200)
    }, 200)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // 为每个文件创建初始进度
      const newProgress: Record<string, number> = {}
      newFiles.forEach((file) => {
        const fileId = `${file.name}-${Date.now()}`
        newProgress[fileId] = 0

        // 模拟上传进度
        simulateFileUpload(file, fileId)
      })

      setUploadProgress((prev) => ({ ...prev, ...newProgress }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const simulateFileUpload = (file: File, fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: Math.min(Math.round(progress), 100),
      }))
    }, 300)
  }

  // 停止AI生成
  const stopAIGeneration = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }

    setIsTypingAI(false)
    setIsAiAnalyzing(false)
    setCanScroll(true)
  }

  return (
    <div className="mb-4 bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-slate-100 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-slate-200">
        <h3 className="text-sm font-medium text-slate-800 flex items-center">
          <div className="w-1 h-4 bg-blue-500 mr-2 rounded-sm"></div>
          {isReviewCompleted ? "审核结果" : "审核意见"}
        </h3>
        {!isReviewCompleted && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-blue-100/50"
                  onClick={() => setIsAiHelpDialogOpen(true)}
                >
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">AI辅助写作帮助</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="p-4">
        {isReviewCompleted ? (
          <div className="space-y-4">
            {/* 审核状态显示 */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-full ${finalStatus === "已通过" ? "bg-green-50" : "bg-amber-50"}`}>
                {finalStatus === "已通过" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-slate-800">审核状态：{finalStatus}</h4>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* 审核意见内容 */}
            {commentText && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h4 className="text-sm font-medium text-slate-700 mb-2">审核意见：</h4>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{commentText}</p>
              </div>
            )}

            {/* 已上传文件列表 */}
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">附件：</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="truncate max-w-[180px] text-slate-700">{file.name}</span>
                        <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 常用回复下拉菜单 */}
            <div className="mb-3 flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-between bg-white border-slate-200 text-slate-700 font-normal text-sm h-10 rounded-lg hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300 group"
                  >
                    <span>常用回复</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100 transition-all duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[320px] p-1 border-slate-200 shadow-lg animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  {customReviews
                    .filter((review) => review.enabled)
                    .map((review) => (
                      <DropdownMenuItem
                        key={review.id}
                        onClick={() => handleCommonReviewClick(review.text)}
                        className="cursor-pointer px-3 py-3 text-sm rounded-md hover:bg-blue-50 focus:bg-blue-50 flex items-center transition-colors duration-200 group"
                      >
                        <div className="flex items-center w-full">
                          <span className="flex-1 truncate pr-2">{review.text}</span>
                          <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            使用
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <Button
                    variant="ghost"
                    className="w-full mt-1 text-blue-600 justify-center rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300"
                    onClick={() => setCustomReviewsDialogOpen(true)}
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    自定义常用回复
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 输入框 */}
            <div className="relative">
              {/* AI状态指示器 - 固定浮动在输入框左上角 */}
              {(isTypingAI || isAiAnalyzing) && (
                <div className="absolute -left-0 -top-0 z-10 animate-fadeIn">
                  <div className="flex items-center h-[30px] bg-blue-50 border border-blue-200 rounded-none rounded-tr-md px-2 shadow-sm">
                    {isAiAnalyzing && (
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin mr-1.5" />
                        <span className="text-xs text-blue-700 font-medium whitespace-nowrap">
                          AI分析中{loadingDots}
                        </span>
                      </div>
                    )}

                    {isTypingAI && (
                      <div className="flex items-center">
                        <Bot className="h-4 w-4 text-blue-600 mr-1.5" />
                        <span className="text-xs text-blue-700 font-medium whitespace-nowrap">
                          AI写作中{loadingDots}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Textarea component */}
              <Textarea
                ref={textareaRef}
                placeholder="请填写审核意见，字数限制500字..."
                className={`resize-none ${commentError ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"} text-slate-700 bg-white px-5 pt-4 leading-relaxed rounded-lg transition-all duration-300 hover:border-blue-200 focus:shadow-sm`}
                style={{ minHeight: "180px", height: textareaHeight }}
                value={commentText}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setCommentText(e.target.value)
                    // 当输入框为空时，重置AI生成状态，允许再次显示按钮
                    if (e.target.value.trim() === "") {
                      setHasAiGenerated(false)
                      setShowAIButton(true)
                      setIsAIButtonVisible(true)
                    } else if (hasAiGenerated) {
                      // 如果AI已经生成过内容且输入框不为空，隐藏按钮
                      setIsAIButtonVisible(false)
                      setTimeout(() => {
                        setShowAIButton(false)
                      }, 300)
                    }
                  }
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                maxLength={500}
              />

              {/* Error message */}
              {commentError && (
                <div className="mt-1 text-red-500 text-xs flex items-center">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  {commentErrorMessage}
                </div>
              )}

              {/* 底部工具栏 */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex justify-between items-center">
                <div className="text-xs text-slate-400">{commentText.length}/500</div>

                {showAIButton && !isTypingAI && !isAiAnalyzing && (
                  <div
                    className={`flex items-center transition-opacity duration-300 ${isAIButtonVisible ? "animate-fadeInUp" : "animate-fadeOutDown"}`}
                  >
                    <AIAssistant
                      setCommentText={setCommentText}
                      setIsAiAnalyzing={setIsAiAnalyzing}
                      setIsTypingAI={setIsTypingAI}
                      setHasAiGenerated={setHasAiGenerated}
                      setShowAIButton={setShowAIButton}
                      setIsAIButtonVisible={setIsAIButtonVisible}
                      setCanScroll={setCanScroll}
                      typingIntervalRef={typingIntervalRef}
                      commentText={commentText}
                    />
                  </div>
                )}

                {/* 当AI正在工作时，按钮区域显示停止按钮 */}
                {(isTypingAI || isAiAnalyzing) && (
                  <div className="flex items-center animate-fadeInUp">
                    <button
                      onClick={stopAIGeneration}
                      className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-red-200"
                    >
                      <Square className="h-3.5 w-3.5" />
                      停止生成
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 附件上传 */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <Button
                variant="outline"
                onClick={handleFileUpload}
                className="bg-white border-slate-200 text-slate-700 font-normal text-sm h-10 rounded-lg hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300"
              >
                <Upload className="h-3.5 w-3.5 mr-2 text-blue-500" />
                上传附件
              </Button>
              <span className="ml-3 text-xs text-slate-400">仅支持PDF,Word格式文件</span>

              {/* 已上传文件列表 */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2.5">
                  {files.map((file, index) => {
                    const fileId = `${file.name}-${Date.now()}-${index}`
                    const progress = uploadProgress[fileId] || 100 // 默认为100%，如果没有进度信息

                    return (
                      <div
                        key={index}
                        className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="truncate max-w-[180px] text-slate-700">{file.name}</span>
                            <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-blue-100 rounded-full transition-colors duration-200"
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          >
                            <XCircle className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </div>

                        {/* 进度条 */}
                        <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-slate-500">
                            {progress < 100 ? `上传中 ${progress}%` : "上传完成"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
