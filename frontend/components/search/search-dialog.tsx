"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Mic } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { SearchDialogProps, SearchResultItem } from "./search-types"
import SearchResults from "./search-results"

// 添加 SpeechRecognition 类型定义
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

// 全局声明扩展Window接口
declare global {
  interface Window {
    SpeechRecognition?: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new(): SpeechRecognition;
    };
  }
}

// 模拟语音识别结果
const DEMO_SPEECH_RESULTS = [
  "科研项目立项流程",
  "科研项目立项流程是什么",
  "科研项目申报指南在哪里查看",
  "横向项目经费使用规定"
];

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)
  const [defaultSearchTerms] = useState(["科研项目申报流程", "经费使用规定", "成果统计报表", "项目结题要求"])
  const [currentSearchTermIndex, setCurrentSearchTermIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [voiceInputHint, setVoiceInputHint] = useState("")
  
  // 动画相关状态
  const [soundWaves, setSoundWaves] = useState<number[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchDialogRef = useRef<HTMLDivElement>(null)
  const searchTermInterval = useRef<NodeJS.Timeout | null>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const flatResultsRef = useRef<SearchResultItem[]>([])
  // 参考 SpeechRecognition API
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  // 模拟语音识别用的定时器
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 当搜索对话框打开时，聚焦到搜索输入框并开始轮换默认搜索词
  useEffect(() => {
    if (open) {
      if (searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      }

      // 开始轮换默认搜索词
      if (searchTermInterval.current) {
        clearInterval(searchTermInterval.current)
      }

      searchTermInterval.current = setInterval(() => {
        setCurrentSearchTermIndex((prev) => (prev + 1) % defaultSearchTerms.length)
      }, 3000)
    } else {
      // 关闭对话框时清除轮换
      if (searchTermInterval.current) {
        clearInterval(searchTermInterval.current)
      }
      setSearchQuery("")
      setSelectedResultIndex(-1)
    }

    return () => {
      if (searchTermInterval.current) {
        clearInterval(searchTermInterval.current)
      }
    }
  }, [open, defaultSearchTerms])

  // 生成声波动画数据
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        // 生成随机高度的声波，范围在30-100之间，更容易看到效果
        const newWaves = Array.from({ length: 8 }, () => 30 + Math.random() * 70);
        setSoundWaves(newWaves);
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setSoundWaves([]);
    }
  }, [isListening]);

  // 点击对话框外部关闭对话框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && searchDialogRef.current && !searchDialogRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  // 添加键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      // ESC关闭对话框
      if (e.key === "Escape") {
        onOpenChange(false)
      }

      // 上箭头选择上一个结果
      else if (e.key === "ArrowUp") {
        e.preventDefault()
        const flatResults = flatResultsRef.current
        if (flatResults.length > 0) {
          setSelectedResultIndex((prev) => (prev <= 0 ? flatResults.length - 1 : prev - 1))
        }
      }

      // 下箭头选择下一个结果
      else if (e.key === "ArrowDown") {
        e.preventDefault()
        const flatResults = flatResultsRef.current
        if (flatResults.length > 0) {
          setSelectedResultIndex((prev) => (prev >= flatResults.length - 1 ? 0 : prev + 1))
        }
      }

      // Enter确认选择
      else if (e.key === "Enter") {
        e.preventDefault()
        const flatResults = flatResultsRef.current
        if (selectedResultIndex >= 0 && selectedResultIndex < flatResults.length) {
          handleSelectResult(flatResults[selectedResultIndex])
        } else if (searchQuery.trim()) {
          // 如果没有选中项但有搜索词，直接搜索当前输入
          handleSearch(searchQuery)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, searchQuery, selectedResultIndex, onOpenChange])

  // 滚动到选中的搜索结果
  useEffect(() => {
    if (selectedResultIndex >= 0 && searchResultsRef.current) {
      const selectedElement = searchResultsRef.current.querySelector(`[data-result-index="${selectedResultIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [selectedResultIndex])

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setSelectedResultIndex(-1) // 重置选中项
  }

  // 处理选择搜索结果
  const handleSelectResult = (result: SearchResultItem) => {
    console.log(`选择了搜索结果: ${result.text}`)
    // 这里可以添加导航到相应页面的逻辑
    if (result.url) {
      console.log(`导航到: ${result.url}`)
    }
    onOpenChange(false)
  }

  // 处理搜索
  const handleSearch = (query: string) => {
    console.log(`执行搜索: ${query}`)
    // 这里可以添加执行搜索的逻辑
    onOpenChange(false)
  }

  // 处理鼠标悬停在搜索结果上
  const handleHoverResult = (index: number) => {
    setSelectedResultIndex(index)
  }

  // 手动处理上下箭头按钮点击
  const handleArrowUpClick = () => {
    const flatResults = flatResultsRef.current
    if (flatResults.length > 0) {
      setSelectedResultIndex((prev) => (prev <= 0 ? flatResults.length - 1 : prev - 1))
    }
  }

  const handleArrowDownClick = () => {
    const flatResults = flatResultsRef.current
    if (flatResults.length > 0) {
      setSelectedResultIndex((prev) => (prev >= flatResults.length - 1 ? 0 : prev + 1))
    }
  }

  // 处理Enter按钮点击
  const handleEnterClick = () => {
    const flatResults = flatResultsRef.current
    if (selectedResultIndex >= 0 && selectedResultIndex < flatResults.length) {
      handleSelectResult(flatResults[selectedResultIndex])
    } else if (searchQuery.trim()) {
      // 如果没有选中项但有搜索词，直接搜索当前输入
      handleSearch(searchQuery)
    }
  }

  // 清理所有模拟计时器
  const clearAllDemoTimers = () => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    setVoiceInputHint("");
  };

  // 模拟语音识别过程
  const simulateSpeechRecognition = () => {
    // 选择一个随机结果
    const result = DEMO_SPEECH_RESULTS[Math.floor(Math.random() * DEMO_SPEECH_RESULTS.length)];
    const totalDuration = 3000; // 总时长3秒
    
    // 渐进展示识别中的文字
    const chars = result.split('');
    const intervalPerChar = totalDuration / chars.length;
    
    let currentText = "";
    let charIndex = 0;
    
    // 先显示录音提示
    setVoiceInputHint("正在聆听...");
    
    // 300ms后开始显示识别结果
    setTimeout(() => {
      setVoiceInputHint("正在识别...");
      
      const typingInterval = setInterval(() => {
        if (charIndex < chars.length) {
          currentText += chars[charIndex];
          setSearchQuery(currentText);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          
          // 识别完成
          setTimeout(() => {
            setIsListening(false);
            setVoiceInputHint("");
            
            // 聚焦搜索框
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }, 500);
        }
      }, intervalPerChar);
    }, 300);
    
    return setTimeout(() => {
      // 约4秒后自动结束
      setIsListening(false);
      setVoiceInputHint("");
    }, 4000);
  };

  // 处理语音输入功能
  const toggleSpeechRecognition = () => {
    if (isListening) {
      // 停止语音识别
      clearAllDemoTimers();
      setIsListening(false);
    } else {
      setIsListening(true);
      setSearchQuery(""); // 清空当前搜索框
      
      // 使用模拟数据
      const timer = simulateSpeechRecognition();
      
      // 保存定时器引用以便清理
      demoTimerRef.current = timer;
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      clearAllDemoTimers();
    };
  }, []);

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-start justify-center pt-[10vh]">
      <motion.div
        ref={searchDialogRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 flex flex-col gap-4">
          {/* 搜索输入框 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              ref={searchInputRef}
              className="pl-12 pr-16 py-3 w-full rounded-lg border border-gray-200 bg-gray-50 text-base"
              placeholder={isListening ? "正在聆听..." : defaultSearchTerms[currentSearchTermIndex]}
              value={searchQuery}
              onChange={handleSearchInput}
              disabled={isListening}
            />
            
            {/* 搜索框内的识别状态 */}
            {isListening && searchQuery && (
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex items-center">
                {/* 声波效果 */}
                <div className="flex items-center justify-center gap-0.5 h-4 mr-1.5">
                  {soundWaves.slice(0, 3).map((height, index) => (
                    <div 
                      key={index}
                      className="w-0.5 bg-blue-500 rounded-full transform transition-all duration-150 ease-in-out"
                      style={{ height: `${Math.max(3, height / 5)}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* 语音输入按钮 */}
            <button
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                isListening ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-blue-500'
              }`}
              onClick={toggleSpeechRecognition}
              title={isListening ? '停止语音识别' : '语音搜索'}
            >
              <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
            
            {/* 语音识别提示 - 当未有文字时显示 */}
            {isListening && !searchQuery && (
              <div className="absolute left-0 right-0 -bottom-8 flex justify-center">
                <div className="flex items-center">
                  <span className="text-xs text-blue-500 font-medium mr-2">{voiceInputHint || "正在聆听..."}</span>
                  {/* 声波效果 */}
                  <div className="flex items-center justify-center gap-0.5 h-4">
                    {soundWaves.map((height, index) => (
                      <div 
                        key={index}
                        className="w-0.5 bg-blue-500 rounded-full transform transition-all duration-150 ease-in-out"
                        style={{ height: `${Math.max(3, height / 4)}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 搜索结果 */}
          <SearchResults
            query={searchQuery}
            selectedResultIndex={selectedResultIndex}
            onSelectResult={handleSelectResult}
            onHoverResult={handleHoverResult}
            resultsRef={searchResultsRef}
            flatResultsRef={flatResultsRef}
          />

          {/* 分割线 - 更浅的颜色 */}
          <div className="h-px bg-gray-100 w-full"></div>

          {/* 底部按钮区 - 更新按钮功能和样式 */}
          <div className="flex items-center justify-start">
            {/* 键盘快捷键提示 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-500">↑</div>
                <div className="px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-500">↓</div>
                <span className="text-xs text-gray-500">切换</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-500">Enter</div>
                <span className="text-xs text-gray-500">确认</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-500">ESC</div>
                <span className="text-xs text-gray-500">关闭</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

