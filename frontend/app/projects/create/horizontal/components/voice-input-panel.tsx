"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Play, Square } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VoiceInputPanelProps {
  onVoiceInput?: (text: string) => void
}

export function VoiceInputPanel({ onVoiceInput }: VoiceInputPanelProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcription, setTranscription] = useState("")
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // 模拟录音计时���
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else if (timer) {
      clearInterval(timer)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRecording])

  // 模拟语音识别
  const mockTranscriptions = [
    "项目名称是智能制造工艺优化",
    "项目名称是智能制造工艺优化，开始日期是2025年4月1日",
    "项目名称是智能制造工艺优化，开始日期是2025年4月1日，结束日期是2026年3月31日",
    "项目名称是智能制造工艺优化，开始日期是2025年4月1日，结束日期是2026年3月31日，项目负责人是李明",
  ]

  // 格式化录音时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // 处理开始/停止录音
  const toggleRecording = () => {
    if (isRecording) {
      // 停止录音
      setIsRecording(false)

      // 模拟生成录音文件
      setRecordedAudio("recording.mp3")

      // 模拟语音识别结果
      const randomIndex = Math.floor(Math.random() * mockTranscriptions.length)
      const result = mockTranscriptions[randomIndex]
      setTranscription(result)

      // 回调函数
      if (onVoiceInput) {
        onVoiceInput(result)
      }
    } else {
      // 开始录音
      setIsRecording(true)
      setRecordingTime(0)
      setTranscription("")
      setRecordedAudio(null)
    }
  }

  // 播放录音
  const playRecording = () => {
    if (recordedAudio && !isPlaying) {
      setIsPlaying(true)

      // 模拟播放3秒后结束
      setTimeout(() => {
        setIsPlaying(false)
      }, 3000)
    } else if (isPlaying) {
      setIsPlaying(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-center mb-6">
          <div
            className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
              isRecording ? "bg-red-100 dark:bg-red-900/30 animate-pulse" : "bg-muted"
            }`}
          >
            <Mic className={`h-8 w-8 ${isRecording ? "text-red-500" : "text-muted-foreground"}`} />
          </div>

          <h3 className="text-lg font-medium mb-2">语音输入</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
            {isRecording ? "正在录音，请清晰地说出要填写的内容..." : "点击下方按钮开始录音，支持自然语言识别"}
          </p>
        </div>

        {isRecording && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">录音中</span>
              <span className="text-xs font-medium">{formatTime(recordingTime)}</span>
            </div>
            <Progress value={Math.min((recordingTime / 60) * 100, 100)} className="h-1" />
          </div>
        )}

        {recordedAudio && (
          <div className="mb-6 border rounded-md p-3 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">录音文件</span>
              <span className="text-xs text-muted-foreground">{formatTime(recordingTime)}</span>
            </div>

            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="h-8 w-8 mr-2" onClick={playRecording}>
                {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Progress value={isPlaying ? 50 : 0} className="h-1 flex-1" />
            </div>
          </div>
        )}

        {transcription && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">识别结果</h4>
            <ScrollArea className="h-[100px] border rounded-md p-3 bg-card">
              <p className="text-sm">{transcription}</p>
            </ScrollArea>
          </div>
        )}

        <div className="mt-auto flex justify-center">
          <Button
            variant={isRecording ? "destructive" : "default"}
            className={`rounded-full h-12 w-12 ${isRecording ? "bg-red-500" : ""}`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">示例命令:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"项目名称是智能制造工艺优化"</li>
            <li>"开始日期是2025年4月1日"</li>
            <li>"项目负责人是李明，职称是副教授"</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

