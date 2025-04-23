"use client"

import { Bot, Sparkles, RefreshCw, Check, X } from "lucide-react"
import type { MutableRefObject } from "react"
import { useState, useEffect, useRef } from "react"

interface AIAssistantProps {
  setCommentText: (text: string) => void
  setIsAiAnalyzing: (isAnalyzing: boolean) => void
  setIsTypingAI: (isTyping: boolean) => void
  setHasAiGenerated: (hasGenerated: boolean) => void
  setShowAIButton: (show: boolean) => void
  setIsAIButtonVisible: (visible: boolean) => void
  setCanScroll: (canScroll: boolean) => void
  typingIntervalRef: MutableRefObject<NodeJS.Timeout | null>
  commentText: string
}

export function AIAssistant({
  setCommentText,
  setIsAiAnalyzing,
  setIsTypingAI,
  setHasAiGenerated,
  setShowAIButton,
  setIsAIButtonVisible,
  setCanScroll,
  typingIntervalRef,
  commentText,
}: AIAssistantProps) {
  const [selectedText, setSelectedText] = useState("")
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null)
  const [showResultButtons, setShowResultButtons] = useState(false)
  const [generatedText, setGeneratedText] = useState("")
  const [originalText, setOriginalText] = useState("")
  const selectionMenuRef = useRef<HTMLDivElement>(null)

  // 监听文本选择事件
  useEffect(() => {
    const checkForSelection = () => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        const selectedStr = selection.toString().trim()
        setSelectedText(selectedStr)
        
        // 获取选中文本的位置
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          
          // 设置提示框位置
          setSelectionPosition({
            top: rect.top - 40, // 在选中文本上方显示
            left: rect.left + (rect.width / 2) - 100 // 水平居中
          })
        }
      } else {
        setSelectedText("")
        setSelectionPosition(null)
      }
    }

    document.addEventListener("mouseup", checkForSelection)
    document.addEventListener("selectionchange", checkForSelection)

    // 点击其他区域时隐藏选择菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectionMenuRef.current && 
        !selectionMenuRef.current.contains(event.target as Node) &&
        selectionPosition
      ) {
        // 给用户一点时间点击菜单
        setTimeout(() => {
          setSelectionPosition(null)
        }, 200)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mouseup", checkForSelection)
      document.removeEventListener("selectionchange", checkForSelection)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectionPosition])

  // AI生成内容
  const typeAIContent = (mode = "generate", text = "") => {
    let aiText = ""
    
    // 保存原始文本，用于取消操作
    if (mode === "generate") {
      setOriginalText(commentText)
    }
    
    // 根据不同模式生成不同内容
    if (mode === "polish") {
      aiText = `${text}（经过润色和优化，表达更加专业）`
    } else if (mode === "rewrite") {
      aiText = `重新撰写的内容：${text}的核心观点已保留，但表述方式完全不同`
    } else {
      aiText =
        "根据项目申请材料分析，该项目整体规划合理，研究方向与申请人专业背景匹配度高。预算部分基本合理，但建议对设备采购明细进一步细化。项目实施计划清晰，时间节点安排合理。建议申请人补充项目风险评估和应对措施，以及明确阶段性成果验收标准。总体而言，该项目具有较高的学术价值和应用前景，建议予以支持。"
    }

    // 隐藏选择菜单
    setSelectionPosition(null)
    
    // 保存生成的文本，用于应用操作
    setGeneratedText(aiText)

    // 先进入分析阶段
    setIsAiAnalyzing(true)
    setIsAIButtonVisible(false) // 使用动画隐藏AI按钮
    setTimeout(() => {
      setShowAIButton(false)
    }, 300) // 等待动画完成后真正隐藏

    // 模拟分析过程，2秒后开始生成内容
    setTimeout(() => {
      setIsAiAnalyzing(false)
      setIsTypingAI(true)
      setHasAiGenerated(true) // 标记AI已经生成过内容
      setCanScroll(false)

      // 逐字插入AI生成的文本
      let i = 0
      let currentText = ""

      // 清除任何现有计时器
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }

      const typing = setInterval(() => {
        if (i < aiText.length) {
          const newChar = aiText.charAt(i)
          currentText += newChar
          
          // 如果是润色或重写模式，需要替换选中的文本
          if (mode === "polish" || mode === "rewrite") {
            const fullText = commentText.replace(selectedText, currentText)
            setCommentText(fullText)
          } else {
            setCommentText(currentText)
          }
          
          i++
        } else {
          clearInterval(typing)
          typingIntervalRef.current = null
          setIsTypingAI(false)
          setCanScroll(true)
          setShowResultButtons(true) // 显示结果操作按钮
        }
      }, 80) // 减慢打字速度

      // 保存interval引用以便能停止
      typingIntervalRef.current = typing
    }, 2000) // 2秒的分析时间
  }

  // 应用AI生成的内容
  const applyGeneratedText = () => {
    setShowResultButtons(false)
  }

  // 重新生成内容
  const regenerateText = () => {
    setShowResultButtons(false)
    typeAIContent()
  }

  // 取消生成的内容
  const cancelGeneration = () => {
    setCommentText(originalText)
    setShowResultButtons(false)
  }

  // 润色选中的文本
  const polishSelectedText = () => {
    typeAIContent("polish", selectedText)
  }

  // 重写选中的文本
  const rewriteSelectedText = () => {
    typeAIContent("rewrite", selectedText)
  }

  return (
    <>
      {/* AI帮我写按钮 */}
      {!selectionPosition && !showResultButtons && (
        <button
          onClick={() => typeAIContent()}
          className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-blue-200"
        >
          <Bot className="h-3.5 w-3.5" />
          AI帮我写
        </button>
      )}

      {/* 选中文本后显示的浮动提示框 */}
      {selectionPosition && (
        <div
          ref={selectionMenuRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-blue-100 p-2 flex items-center gap-2 animate-fadeIn"
          style={{
            top: `${selectionPosition.top}px`,
            left: `${selectionPosition.left}px`,
          }}
        >
          <button
            onClick={polishSelectedText}
            className="flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-purple-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            帮我润色一下
          </button>
          <button
            onClick={rewriteSelectedText}
            className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-indigo-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            重新写
          </button>
        </div>
      )}

      {/* AI生成内容后显示的按钮 */}
      {showResultButtons && (
        <div className="flex items-center gap-2">
          <button
            onClick={applyGeneratedText}
            className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-green-200"
          >
            <Check className="h-3.5 w-3.5" />
            应用
          </button>
          <button
            onClick={regenerateText}
            className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-amber-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            重写
          </button>
          <button
            onClick={cancelGeneration}
            className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-red-200"
          >
            <X className="h-3.5 w-3.5" />
            取消
          </button>
        </div>
      )}
    </>
  )
}
