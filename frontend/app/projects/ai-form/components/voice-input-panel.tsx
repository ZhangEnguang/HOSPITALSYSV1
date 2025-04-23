"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Mic, Square, MessageSquare, Zap, RefreshCw, Volume2, VolumeX, X, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface VoiceInputPanelProps {
  handleFillAll: () => void
}

export const VoiceInputPanel = ({ handleFillAll }: VoiceInputPanelProps) => {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  const [voiceText, setVoiceText] = useState("")
  const [processingVoice, setProcessingVoice] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [showTips, setShowTips] = useState(true)
  const audioLevelTimer = useRef<NodeJS.Timeout | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [realtimeText, setRealtimeText] = useState("")
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [fieldAnalysis, setFieldAnalysis] = useState<Record<string, string>>({})

  // 示例语音提示 - 简化为一个示例
  const voiceExample = "这是一个智慧校园管理系统项目，属于纵向项目，负责人是张教授，预算50万元"

  // 清理计时器
  useEffect(() => {
    return () => {
      if (recordingTimer) clearInterval(recordingTimer)
      if (audioLevelTimer.current) clearInterval(audioLevelTimer.current)
    }
  }, [recordingTimer])

  // 模拟音量变化
  const simulateAudioLevel = () => {
    if (audioLevelTimer.current) clearInterval(audioLevelTimer.current)

    if (isRecording && !isPaused && !isMuted) {
      audioLevelTimer.current = setInterval(() => {
        // 生成0.3到1之间的随机值，模拟音量波动
        const randomLevel = 0.3 + Math.random() * 0.7
        setAudioLevel(randomLevel)
      }, 100)
    } else {
      setAudioLevel(0)
    }
  }

  // 监听录音状态变化
  useEffect(() => {
    simulateAudioLevel()
  }, [isRecording, isPaused, isMuted])

  // 开始录音
  const startRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setRecordingDuration(0)
    setVoiceText("")
    setRealtimeText("")
    setIsMuted(false)
    setIsRecognizing(true)

    // 设置计时器
    const timer = setInterval(() => {
      setRecordingDuration((prev) => prev + 1)
    }, 1000)
    setRecordingTimer(timer)

    toast({
      title: "开始录音",
      description: "请清晰描述项目信息...",
      duration: 2000,
    })

    // 模拟实时语音识别
    startRealtimeRecognition()
  }

  // 模拟实时语音识别
  const startRealtimeRecognition = () => {
    // 模拟语音识别的文本片段
    const textFragments = [
      "这是",
      "这是一个",
      "这是一个基于",
      "这是一个基于人工智能的",
      "这是一个基于人工智能的智慧校园",
      "这是一个基于人工智能的智慧校园管理系统",
      "这是一个基于人工智能的智慧校园管理系统研发项目",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000，预计",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000，预计研发周期",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000，预计研发周期为12个月",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000，预计研发周期为12个月，总预算",
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000，预计研发周期为12个月，总预算约45万元",
    ]

    let index = 0
    const recognitionInterval = setInterval(() => {
      if (index < textFragments.length && isRecording && !isPaused && !isMuted) {
        setRealtimeText(textFragments[index])
        index++
      } else if (!isRecording || isPaused) {
        clearInterval(recognitionInterval)
      }
    }, 700) // 每700毫秒更新一次识别文本

    // 清理函数
    return () => {
      clearInterval(recognitionInterval)
    }
  }

  // 暂停录音
  const pauseRecording = () => {
    setIsPaused(true)
    if (recordingTimer) clearInterval(recordingTimer)

    toast({
      title: "录音已暂停",
      description: "点击继续录音",
      duration: 1500,
    })
  }

  // 继续录音
  const resumeRecording = () => {
    setIsPaused(false)

    // 重新设置计时器
    const timer = setInterval(() => {
      setRecordingDuration((prev) => prev + 1)
    }, 1000)
    setRecordingTimer(timer)

    toast({
      title: "继续录音",
      description: "请继续描述项目信息...",
      duration: 1500,
    })
  }

  // 停止录音
  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setIsRecognizing(false)
    if (recordingTimer) clearInterval(recordingTimer)
    setProcessingVoice(true)

    // 使用最后的实时识别文本作为最终文本
    const finalText =
      realtimeText ||
      "这是一个基于人工智能的智慧校园管理系统研发项目，属于纵向项目，项目负责人是张三，联系电话是13800138000，预计研发周期为12个月，总预算约45万元。"

    // 模拟语音处理和字段分析
    setTimeout(() => {
      if (recordingDuration < 2) {
        // 录音时间太短
        toast({
          title: "录音时间太短",
          description: "请重新录制并说话时间长一些",
          variant: "destructive",
        })
        setProcessingVoice(false)
        return
      }

      setVoiceText(finalText)
      setProcessingVoice(false)

      // 显示字段分析结果
      setTimeout(() => {
        // 模拟字段分析结果
        const analysisResult = {
          项目名称: "基于人工智能的智慧校园管理系统研发",
          项目类型: "纵向",
          项目负责人: "张三",
          联系电话: "13800138000",
          研发周期: "12个月",
          预算: "45万元",
        }

        // 显示分析结果
        setFieldAnalysis(analysisResult)

        toast({
          title: "语音识别与分析完成",
          description: "已成功识别项目信息并分析关键字段",
        })
      }, 1000)
    }, 2000)
  }

  // 切换麦克风静音状态
  const toggleMute = () => {
    if (isRecording) {
      setIsMuted(!isMuted)
      toast({
        title: isMuted ? "麦克风已开启" : "麦克风已静音",
        duration: 1500,
      })
    }
  }

  // 渲染音量指示器
  const renderVolumeIndicators = () => {
    const bars = 12
    return (
      <div className="flex items-center justify-center space-x-0.5 h-16 mb-2">
        {Array.from({ length: bars }).map((_, i) => {
          // 计算每个条的高度，中间最高
          const middleIndex = Math.floor(bars / 2)
          const distanceFromMiddle = Math.abs(i - middleIndex)
          const baseHeight = 100 - distanceFromMiddle * 15

          // 根据音量调整实际高度
          const heightPercentage = isMuted || isPaused ? 10 : baseHeight * audioLevel

          return (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-100",
                isMuted ? "bg-gray-300" : isPaused ? "bg-amber-300" : "bg-primary",
              )}
              style={{
                height: `${Math.max(10, heightPercentage)}%`,
                opacity: isMuted || isPaused ? 0.3 : 0.4 + audioLevel * 0.6,
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between h-full w-full overflow-hidden">
      {showTips && (
        <div className="text-sm text-muted-foreground bg-muted/5 p-3 rounded-lg border border-muted/30 mb-6 w-full relative">
          <button
            className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
            onClick={() => setShowTips(false)}
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <p className="flex items-center mb-1">
            <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
            通过语音描述项目信息，AI将自动识别并填充表单
          </p>
          <p className="text-xs text-muted-foreground">
            点击中央麦克风按钮开始录音，清晰描述项目名称、类型、负责人等信息
          </p>
        </div>
      )}

      <div
        className="w-40 h-40 rounded-full bg-primary/5 border-4 border-primary/20 flex items-center justify-center mb-4 relative hover:bg-primary/10 transition-all cursor-pointer"
        onClick={() => {
          if (!isRecording) {
            startRecording()
          } else if (!isPaused) {
            pauseRecording()
          } else {
            resumeRecording()
          }
        }}
      >
        {isRecording && !isPaused && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
          </div>
        )}

        {/* 录音按钮 */}
        <div
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center transition-all",
            !isRecording
              ? "bg-primary hover:bg-primary/90"
              : isPaused
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-red-500 hover:bg-red-600",
            "shadow-lg hover:shadow-xl active:scale-95",
          )}
        >
          {!isRecording ? (
            <Mic className="h-7 w-7 text-white" />
          ) : isPaused ? (
            <Play className="h-7 w-7 text-white" />
          ) : (
            <Pause className="h-7 w-7 text-white" />
          )}
        </div>

        {/* 录音时间显示 */}
        {isRecording && (
          <div className="absolute bottom-4 text-sm font-medium">
            {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, "0")}
          </div>
        )}

        {/* 静音按钮 */}
        {isRecording && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute()
                  }}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-full transition-all",
                    isMuted
                      ? "bg-red-100 text-red-500 hover:bg-red-200"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "取消静音" : "静音"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* 音量指示器 */}
      {isRecording && renderVolumeIndicators()}

      {/* 录音状态提示 */}
      {isRecording && (
        <div className="text-sm text-center mb-4">
          <span className="font-medium">{isPaused ? "录音已暂停" : "正在录音"}</span>
          {!isPaused && !isMuted && <p className="text-xs text-muted-foreground mt-1">请描述项目信息...</p>}
        </div>
      )}

      {/* 实时语音识别结果 */}
      {isRecording && !isPaused && realtimeText && (
        <div className="w-full bg-muted/10 p-3 rounded-lg border border-muted/30 mb-4 max-h-24 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">实时识别：</span> {realtimeText}
          </p>
        </div>
      )}

      {/* 停止按钮 - 仅在录音时显示 */}
      {isRecording && (
        <Button variant="destructive" size="sm" className="mb-4" onClick={stopRecording}>
          <Square className="h-3.5 w-3.5 mr-1.5" />
          完成录音
        </Button>
      )}

      {/* 处理中状态 */}
      {processingVoice && (
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
            <span className="text-sm">正在处理语音...</span>
          </div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-8 bg-primary/60 rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-8 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1.5 h-8 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <div
              className="w-1.5 h-8 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.6s" }}
            ></div>
            <div
              className="w-1.5 h-8 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.8s" }}
            ></div>
          </div>
        </div>
      )}

      {/* 识别结果和操作按钮 */}
      {voiceText && !processingVoice && (
        <div className="w-full space-y-4">
          <div className="bg-muted/10 p-4 rounded-lg border border-muted/30 w-full">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary" />
              识别结果
            </h4>
            <p className="text-sm text-muted-foreground">{voiceText}</p>
          </div>

          {/* 字段分析结果 */}
          {Object.keys(fieldAnalysis).length > 0 && (
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 w-full">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                字段分析结果
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(fieldAnalysis).map(([field, value]) => (
                  <div key={field} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded border border-muted/30">
                    <span className="text-xs text-muted-foreground">{field}:</span>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-primary hover:opacity-90"
                onClick={() => {
                  toast({
                    title: "开始填充",
                    description: "AI正在根据语音内容填充表单...",
                    duration: 2000,
                  })
                  setTimeout(() => {
                    handleFillAll()
                    router.push("/projects/ai-form/result")
                  }, 500)
                }}
              >
                <Zap className="mr-2 h-4 w-4" />
                填充表单
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsRecording(false)
                  setVoiceText("")
                  setRealtimeText("")
                  setFieldAnalysis({})
                  setRecordingDuration(0)
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重新录入
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

