"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  Send,
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Wand2,
  Sparkles,
  RefreshCw,
  X,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

export interface AIFieldSuggestion {
  field: string
  value: any
  confidence: number // 0-1
  description?: string
}

export interface AIAssistantPanelProps {
  // 模块类型
  moduleType: string
  // 当前表单数据
  formData: Record<string, any>
  // AI建议数据
  suggestions?: AIFieldSuggestion[]
  // 是否已填充的字段
  filledFields?: string[]
  // 字段填充事件
  onFillField?: (field: string, value: any) => void
  // 全部填充事件
  onFillAll?: () => void
  // 面板状态变更
  onPanelStateChange?: (collapsed: boolean) => void
  // 重新分析事件
  onReanalyze?: () => void
  // 首次渲染是否折叠
  defaultCollapsed?: boolean
  // 模拟的建议数据(用于演示)
  mockSuggestions?: AIFieldSuggestion[]
}

export function AIAssistantPanel({
  moduleType,
  formData,
  suggestions = [],
  filledFields = [],
  onFillField,
  onFillAll,
  onPanelStateChange,
  onReanalyze,
  defaultCollapsed = false,
  mockSuggestions,
}: AIAssistantPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [activeSuggestions, setActiveSuggestions] = useState<AIFieldSuggestion[]>([])
  const [question, setQuestion] = useState("")
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<"suggestions" | "chat">("suggestions")

  // 使用模拟数据或提供的建议
  useEffect(() => {
    if (mockSuggestions && mockSuggestions.length > 0) {
      setActiveSuggestions(mockSuggestions)
    } else if (suggestions.length > 0) {
      setActiveSuggestions(suggestions)
    }
  }, [suggestions, mockSuggestions])

  // 通知父组件面板状态变更
  useEffect(() => {
    if (onPanelStateChange) {
      onPanelStateChange(isCollapsed)
    }
  }, [isCollapsed, onPanelStateChange])

  // 处理面板折叠/展开
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // 处理字段填充
  const handleFillField = (field: string, value: any) => {
    if (onFillField) {
      onFillField(field, value)
    }
  }

  // 处理全部填充
  const handleFillAll = () => {
    if (onFillAll) {
      onFillAll()
    }
  }

  // 处理重新分析
  const handleReanalyze = () => {
    if (onReanalyze) {
      onReanalyze()
    }
  }

  // 提交问题
  const submitQuestion = async () => {
    if (!question.trim()) return

    // 添加用户问题到对话
    const userMessage = { role: "user", content: question }
    setConversation([...conversation, userMessage])
    
    // 清空输入
    setQuestion("")
    
    // 模拟AI思考
    setIsTyping(true)
    
    // 模拟AI回复（实际项目中这里应该调用AI API）
    setTimeout(() => {
      // 根据模块类型提供不同的模拟回复
      let aiResponse = "我理解您的问题，但目前我没有足够的上下文来提供准确的回答。"
      
      // 模块类型相关的通用回复
      if (moduleType === "成员") {
        if (question.includes("联系方式") || question.includes("电话") || question.includes("邮箱")) {
          aiResponse = "成员联系方式应填写工作用的联系方式，确保邮箱格式正确，电话号码为11位。这些信息将用于项目通知和联系。"
        } else if (question.includes("权限") || question.includes("角色")) {
          aiResponse = "系统中的权限分为创建项目、审核项目、预算管理和导出报表四种基本权限，您可以根据成员的实际工作需要进行分配。"
        }
      } else if (moduleType === "项目") {
        if (question.includes("预算") || question.includes("经费")) {
          aiResponse = "项目预算应根据实际需求填写，可包括设备费、材料费、差旅费等。横向项目和纵向项目的预算管理规则可能有所不同。"
        } else if (question.includes("周期") || question.includes("日期") || question.includes("时间")) {
          aiResponse = "项目周期应设置合理的开始和结束日期，一般横向项目为1-2年，纵向项目根据项目类型可能为3-5年。"
        }
      }
      
      const aiMessage = { role: "assistant", content: aiResponse }
      setConversation([...conversation, userMessage, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  // 获取可信度标签样式
  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 0.8) {
      return "bg-green-100 text-green-800 border-green-200"
    } else if (confidence >= 0.5) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 面板头部 */}
      <div className="p-4 border-b flex justify-between items-center bg-muted/10">
        <div className="flex items-center">
          <Bot className="mr-2 h-5 w-5 text-primary" />
          <h3 className="font-medium">AI助手</h3>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 标签页切换 */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === "suggestions" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("suggestions")}
            >
              <div className="flex items-center justify-center">
                <Wand2 className="mr-1 h-4 w-4" />
                <span>智能建议</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === "chat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("chat")}
            >
              <div className="flex items-center justify-center">
                <Bot className="mr-1 h-4 w-4" />
                <span>对话助手</span>
              </div>
            </button>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 overflow-auto">
            {activeTab === "suggestions" && (
              <div className="p-4 space-y-4">
                {/* 建议标题 */}
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">智能识别结果</h3>
                  <Button variant="ghost" size="sm" onClick={handleReanalyze} className="h-7 px-2">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    <span className="text-xs">重新分析</span>
                  </Button>
                </div>

                {/* 一键填充按钮 */}
                {activeSuggestions.length > 0 && (
                  <Button
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary p-2 h-auto flex items-center justify-center text-sm"
                    variant="ghost"
                    onClick={handleFillAll}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>一键填充全部字段</span>
                  </Button>
                )}

                {/* 建议列表 */}
                <div className="space-y-3">
                  {activeSuggestions.map((suggestion, index) => {
                    const isFieldFilled = filledFields.includes(suggestion.field)
                    return (
                      <div
                        key={`${suggestion.field}-${index}`}
                        className={`p-3 rounded-md border ${isFieldFilled ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-accent/5"}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{suggestion.field}</span>
                            <span
                              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full border ${getConfidenceStyle(suggestion.confidence)}`}
                            >
                              {Math.round(suggestion.confidence * 100)}%
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleFillField(suggestion.field, suggestion.value)}
                            className={isFieldFilled ? "invisible" : "h-6 px-2"}
                          >
                            <span className="text-xs">填充</span>
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground break-words">
                          {suggestion.value?.toString() || ""}
                        </div>
                        {isFieldFilled && (
                          <div className="mt-1 flex items-center text-xs text-primary">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            <span>已填充</span>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {activeSuggestions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">暂无可用的智能建议</p>
                      <p className="text-xs text-muted-foreground mt-1">您可以尝试重新分析或手动填写表单</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "chat" && (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 overflow-auto space-y-4">
                  {/* 默认欢迎消息 */}
                  {conversation.length === 0 && (
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1.5 rounded-md mr-2">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            您好！我是AI助手，可以帮您解答关于{moduleType}的问题。请问有什么可以帮到您的？
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 对话消息 */}
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary/10 ml-8" : "bg-muted/30 mr-8"}`}
                    >
                      <div className="flex items-start">
                        {message.role === "assistant" && (
                          <div className="bg-primary/20 p-1.5 rounded-md mr-2">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex space-x-1 ml-2 mt-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* 正在输入指示器 */}
                  {isTyping && (
                    <div className="bg-muted/30 p-3 rounded-lg mr-8">
                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1.5 rounded-md mr-2">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 输入区域 */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="输入您的问题..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          submitQuestion()
                        }
                      }}
                    />
                    <Button onClick={submitQuestion} disabled={!question.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    提示: 您可以询问关于{moduleType}的具体问题，如「{moduleType === "成员" ? "如何设置成员权限" : "如何填写项目预算"}」
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
