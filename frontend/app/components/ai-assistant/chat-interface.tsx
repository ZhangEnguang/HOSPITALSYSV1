"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Send, FileUp, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatMessageContent } from "@/app/utils/message-formatter"
import type { Message } from "@/app/types/ai-assistant-types"
import Image from "next/image"

interface ChatInterfaceProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: () => void
  uploadedFiles: File[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>
  isRecording: boolean
  toggleRecording: () => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  handleSendMessage,
  uploadedFiles,
  setUploadedFiles,
  isRecording,
  toggleRecording,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  return (
    <>
      {/* Chat messages with improved styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/80">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className={cn("flex items-start gap-2", message.type === "user" ? "justify-end" : "justify-start")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message.type === "bot" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-blue-500 shadow-sm relative">
                <Image
                  src="/ai-robot-avatar.gif"
                  alt="AI助手"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl p-3 shadow-sm",
                message.type === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-blue-100",
              )}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMessageContent(message.content),
                }}
                className="message-content"
              />
            </div>
            {message.type === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-blue-100 shadow-sm">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                  张
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with modern styling */}
      <div className="p-4 border-t border-blue-100 bg-white">
        {/* Function buttons with improved styling */}
        <div className="flex items-center gap-3 mb-3">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full hover:bg-blue-50 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            深度思考
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full hover:bg-blue-50 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21-4.3-4.3"></path>
            </svg>
            联网搜索
          </button>
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full hover:bg-blue-50 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              提示语模板
            </button>
            {/* Template menu - keep existing functionality */}
            <div className="absolute left-0 bottom-full mb-2 bg-white shadow-lg rounded-xl py-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 border border-blue-100">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setInputValue(`请为指定时间段内的[科研成果/经费使用情况]生成一份简要统计报表，要求如下：
1. 报表类型：[科研成果总结/经费使用概览]
2. 时间范围：从[开始日期]到[结束日期]
3. 内容细节：
   - 若选择科研成果，请包括但不限于以下内容：发表论文数量、专利申请情况、项目完成进度等。
   - 若选择经费使用情况，请详细列出各项费用支出情况，如设备购置费、材料费、差旅费等，并提供总预算对比分析。
4. 输出格式：[PDF/Excel]
5. 额外定制：
   - 是否包含图表或图形化展示数据？[是/否]
   - 是否需要对特定项目或个人进行深入分析？如果是，请提供具体名称或编号。
请确保所有数据准确无误，并以清晰易懂的方式呈现。如果有任何疑问或需要更多信息，请随时告知。`)
                }}
              >
                数据统计与报告生成
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setInputValue("请查询科研人员[姓名/ID]的项目状态，包括进度、经费使用情况和近期里程碑。")
                }}
              >
                快速查询科研人员项目状态
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setInputValue("将【李明、王芳】的权限从【项目申报员】调整为【项目审核员】，生效时间【2025-03-22】。")
                }}
              >
                权限批量调整
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setInputValue(
                    "向【物理系、生物系】发送提醒：请在【2024-08-15 17:00】前完成【国家自然基金申报书提交】，逾期将关闭入口。",
                  )
                }}
              >
                逾期任务提醒
              </button>
            </div>
          </div>
        </div>

        {/* Uploaded files preview */}
        {uploadedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-full px-3 py-1 text-xs flex items-center gap-1 border border-blue-100"
              >
                <Paperclip className="h-3 w-3 text-blue-500" />
                <span className="truncate max-w-[150px] text-gray-700">{file.name}</span>
                <button
                  className="text-gray-400 hover:text-gray-600 ml-1"
                  onClick={() => setUploadedFiles((files) => files.filter((_, i) => i !== index))}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input toolbar with modern styling */}
        <div className="flex items-center relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            {/* Upload button */}
            <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={handleFileUpload}>
              <FileUp className="h-5 w-5" />
            </button>

            {/* Voice input */}
            <button
              className={`text-gray-400 hover:text-blue-500 transition-colors ${isRecording ? "text-red-500" : ""}`}
              onClick={toggleRecording}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
            </button>
          </div>

          <textarea
            placeholder="输入消息..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="w-full resize-none rounded-full border border-blue-200 bg-blue-50/50 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 py-3 px-3 pl-16 pr-12 shadow-sm"
            style={{
              height: (() => {
                // Keep existing height calculation logic
                const lines = inputValue.split("\n")
                const lineCount = lines.length
                const avgCharsPerLine = inputValue.length / lineCount
                const estimatedLines = lines.reduce((total, line) => {
                  const lineWraps = Math.ceil(line.length / 40)
                  return total + Math.max(1, lineWraps)
                }, 0)
                if (estimatedLines > 8) return "200px"
                return `${Math.max(46, estimatedLines * 22)}px`
              })(),
              overflowY: inputValue ? "auto" : "hidden",
              scrollbarWidth: inputValue ? "thin" : "none",
            }}
          />

          {/* Send button with modern styling */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSendMessage}
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} multiple />
      </div>
    </>
  )
}

export default ChatInterface

