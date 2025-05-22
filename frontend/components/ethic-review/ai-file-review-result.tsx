"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FileReviewIssue, FileReviewResult, autoFixFileIssues } from "@/app/services/ai-file-review"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2, Zap, RefreshCw, FileText, WandSparkles, ChevronDown, ChevronUp, Upload, Clock } from "lucide-react"
import { CheckCircle2 as FileCheck2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog" 
import { FileDiffView } from "./file-diff-view"
import { Progress } from "@/components/ui/progress"
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
import React from "react"

interface AIFileReviewResultProps {
  result: FileReviewResult
  isLoading?: boolean
  onFixIssues?: (fixedIssues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => void
  files?: Map<number, File[]> // 文件ID到文件列表的映射
  onRefreshReview?: () => void // 添加重新审查回调函数
}

export function AIFileReviewResult({ 
  result, 
  isLoading = false, 
  onFixIssues,
  files,
  onRefreshReview
}: AIFileReviewResultProps) {
  const [isFixing, setIsFixing] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [fixError, setFixError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<FileReviewIssue | null>(null)
  const [showDiffView, setShowDiffView] = useState(false)
  const [showBatchFixAlert, setShowBatchFixAlert] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false) // 添加重新审查状态
  
  // 对问题列表进行排序：未修复的排在前面，已修复的排在后面
  const sortedIssues = React.useMemo(() => {
    if (!result?.issues) return [];
    
    // 复制一份问题列表，避免影响原数据
    return [...result.issues].sort((a, b) => {
      // 首先按照是否已修复排序（未修复的排在前面）
      if (a.fixed !== b.fixed) {
        return a.fixed ? 1 : -1;
      }
      
      // 其次按照严重程度排序（严重的排在前面）
      if (a.severity !== b.severity) {
        if (a.severity === 'error') return -1;
        if (b.severity === 'error') return 1;
        if (a.severity === 'warning') return -1;
        if (b.severity === 'warning') return 1;
      }
      
      // 最后按照问题类型排序
      return 0;
    });
  }, [result?.issues]);
  
  // 文件上传相关状态
  const [uploadingFiles, setUploadingFiles] = useState<{
    issueId: number;
    fileName: string;
    progress: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
  }[]>([])
  const [isFileAnalyzing, setIsFileAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 存储更新后的文件
  const [updatedFiles, setUpdatedFiles] = useState<Map<number, File[]>>(new Map())

  // 存储可修复问题的实际数量（解决修复后数量不更新问题）
  const [fixableIssuesCount, setFixableIssuesCount] = useState(0)

  // 初始化时不展开任何问题项
  useEffect(() => {
    if (result?.issues?.length > 0 && !isLoading) {
      // 所有问题默认收起，不展开任何问题
      setExpandedItems([])
      
      // 初始化可修复问题的数量
      const fixableCount = sortedIssues.filter(issue => issue.autoFixable && !issue.fixed).length
      setFixableIssuesCount(fixableCount)
    }
  }, [result, isLoading, sortedIssues])

  // 处理单个问题的修复
  const handleFixSingleIssue = (issue: FileReviewIssue) => {
    console.log("点击修复按钮, 问题:", issue);
    console.log("可用文件:", files);
    
    // 查找对应的文件
    const fileArray = files?.get(issue.fileId) || []
    
    // 即使没有找到实际文件，也可以创建一个模拟文件来处理某些类型的问题
    if (fileArray.length > 0 || issue.autoFixable) {
      let fileToUse = fileArray.length > 0 ? fileArray[0] : null;
      
      // 如果没有实际文件但问题是可自动修复的，创建一个模拟文件
      if (!fileToUse && issue.fileName) {
        fileToUse = new File(
          ["模拟文件内容"], 
          issue.fileName, 
          { type: "application/octet-stream" }
        );
        console.log("创建模拟文件:", fileToUse);
      }
      
      // 设置当前选中的问题并显示差异对比视图
      setSelectedIssue(issue);
      console.log("设置selectedIssue:", issue);
      
      // 确保在状态更新后再显示对话框
      setTimeout(() => {
        setShowDiffView(true);
        console.log("显示差异对比视图");
      }, 50);
    } else {
      toast({
        title: "无法修复",
        description: "未找到关联的文件",
        variant: "destructive"
      });
    }
  }

  // 处理应用修复后的回调
  const handleApplyFix = (fixedIssue: FileReviewIssue, newFile?: File) => {
    if (!result || !onFixIssues) return
    
    // 确保先关闭差异对比视图，再处理后续逻辑
    setShowDiffView(false)
    
    // 延迟一下处理逻辑，确保对话框关闭动画完成
    setTimeout(() => {
      // 创建修复后的问题列表
      const updatedIssues = result.issues.map(issue => {
        if (issue.fileId === fixedIssue.fileId && issue.issueType === fixedIssue.issueType) {
          return fixedIssue // 使用修复后的问题替换原问题
        }
        return issue
      })
      
      // 如果有新文件，更新文件列表
      if (newFile && fixedIssue.fileId) {
        const currentFiles = new Map(updatedFiles)
        const existingFiles = currentFiles.get(fixedIssue.fileId) || []
        // 找到并替换原始文件
        const updatedFileList = existingFiles.length > 0 
          ? existingFiles.map(f => f.name === newFile.name ? newFile : f)
          : [newFile]
        
        currentFiles.set(fixedIssue.fileId, updatedFileList)
        setUpdatedFiles(currentFiles)
        
        // 调用回调
        onFixIssues(updatedIssues, currentFiles)
      } else {
        // 没有新文件，只更新问题列表
        onFixIssues(updatedIssues)
      }
      
      // 更新可修复问题的数量
      const fixableCount = updatedIssues.filter(issue => issue.autoFixable && !issue.fixed).length
      setFixableIssuesCount(fixableCount)
    }, 100) // 短暂延迟确保UI更新
  }

  // 处理自动修复所有问题
  const handleAutoFixAll = async () => {
    // 先询问用户确认
    setShowBatchFixAlert(true)
  }

  // 用户确认批量修复后的处理
  const confirmBatchFix = async () => {
    if (!onFixIssues) return
    
    // 设置isFixing状态的逻辑已经移到调用此函数的地方
    setFixError(null)
    
    try {
      // 找出所有可自动修复的问题
      const fixableIssues = sortedIssues.filter(issue => issue.autoFixable && !issue.fixed)
      if (fixableIssues.length > 0) {
        console.log("开始批量自动修复问题:", fixableIssues.length)
        const fixedIssues = await autoFixFileIssues(result.issues)
        console.log("批量问题修复完成:", fixedIssues)
        
        // 创建一个新的文件映射
        const batchUpdatedFiles = new Map(updatedFiles)
        
        // TODO: 实际应用中，这里需要为每个被修复的问题生成新文件
        // 这里只做简单模拟
        
        onFixIssues(fixedIssues, batchUpdatedFiles)
        
        // 更新可修复问题数量
        setFixableIssuesCount(0)
        
        toast({
          title: "批量修复完成",
          description: `已成功修复 ${fixableIssues.length} 个问题`,
          variant: "default"
        })
      }
    } catch (error) {
      console.error("批量自动修复失败:", error)
      setFixError("自动修复过程发生错误")
      
      toast({
        title: "修复失败",
        description: "自动修复过程中发生错误，请重试",
        variant: "destructive"
      })
    }
    // finally块中的setIsFixing(false)移除，因为现在是通过setTimeout控制关闭弹窗和状态重置
  }

  // 获取实际的结果对象，确保它是有效的
  const safeResult = result || { hasIssues: false, issues: [], totalFiles: 0, validFiles: 0 }
  
  // 切换展开/收起状态
  const toggleExpanded = (value: string) => {
    if (expandedItems.includes(value)) {
      setExpandedItems(prev => prev.filter(item => item !== value));
    } else {
      setExpandedItems(prev => [...prev, value]);
    }
  }

  // 处理重新审查
  const handleRefreshReview = useCallback(() => {
    if (onRefreshReview) {
      setIsRefreshing(true);
      
      // 显示正在刷新的提示
      toast({
        title: "正在重新审查",
        description: "系统正在重新分析您的文件...",
      });
      
      // 调用父组件提供的重新审查函数
      onRefreshReview();
    }
  }, [onRefreshReview]);
  
  // 当isLoading变为true时，表示正在重新审查，设置isRefreshing为false
  useEffect(() => {
    if (isLoading) {
      setIsRefreshing(false);
    }
  }, [isLoading]);

  // 渲染问题严重性图标
  const renderSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  // 获取问题类型中文名称
  const getIssueTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'quantity': '数量校验',
      'fileType': '文件类型',
      'naming': '命名规范',
      'version': '版本号',
      'format': '格式规范'
    }
    return typeMap[type] || type
  }

  // 处理文件上传
  const handleFileUpload = (issueId: number, fileType: string, issueType: string = '') => {
    if (fileInputRef.current) {
      // 设置上传的文件关联到指定问题
      fileInputRef.current.setAttribute('data-issue-id', issueId.toString());
      fileInputRef.current.setAttribute('data-file-type', fileType);
      fileInputRef.current.setAttribute('data-issue-type', issueType); // 存储问题类型
      fileInputRef.current.click();
    }
  }

  // 处理文件选择后的上传逻辑
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const issueId = parseInt(e.target.getAttribute('data-issue-id') || '0');
    const fileType = e.target.getAttribute('data-file-type') || '';
    const issueType = e.target.getAttribute('data-issue-type') || ''; // 获取问题类型
    
    // 为每个选择的文件创建上传状态
    const newUploadingFiles = Array.from(files).map(file => ({
      issueId,
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    // 模拟文件上传过程
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadIndex = newUploadingFiles.findIndex(f => f.fileName === file.name);
      
      // 模拟上传进度
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadingFiles(prev => {
          const updated = [...prev];
          const index = prev.findIndex(f => f.fileName === file.name && f.issueId === issueId);
          if (index !== -1) {
            updated[index] = { ...updated[index], progress };
          }
          return updated;
        });
      }
      
      // 上传完成后设置为处理中
      setUploadingFiles(prev => {
        const updated = [...prev];
        const index = prev.findIndex(f => f.fileName === file.name && f.issueId === issueId);
        if (index !== -1) {
          updated[index] = { ...updated[index], status: 'processing' };
        }
        return updated;
      });
      
      // 模拟AI处理文件
      setIsFileAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 处理完成后，更新文件状态
      const success = Math.random() > 0.2; // 80%的成功率
      
      setUploadingFiles(prev => {
        const updated = [...prev];
        const index = prev.findIndex(f => f.fileName === file.name && f.issueId === issueId);
        if (index !== -1) {
          updated[index] = { 
            ...updated[index], 
            status: success ? 'complete' : 'error'
          };
        }
        return updated;
      });
      
      if (success) {
        // 如果成功，模拟更新文件列表和问题状态
        const newFile = file;
        const currentFiles = new Map(updatedFiles);
        const existingFiles = currentFiles.get(issueId) || [];
        
        // 添加新文件到文件列表
        currentFiles.set(issueId, [...existingFiles, newFile]);
        setUpdatedFiles(currentFiles);
        
        // 更新问题状态
        if (onFixIssues && result) {
          const updatedIssues = result.issues.map(issue => {
            // 处理quantity类型和fileType类型的问题
            if (issue.fileId === issueId && (issue.issueType === 'quantity' || (issue.issueType === 'fileType' && issueType === 'fileType'))) {
              // 确保返回的对象符合FileReviewIssue类型
              return {
                ...issue,
                fixed: true,
                severity: 'info' as 'error' | 'warning' | 'info',
                message: `已上传: ${file.name}`
              };
            }
            return issue;
          });
          
          onFixIssues(updatedIssues, currentFiles);
          
          // 更新可修复问题数量
          const fixableCount = updatedIssues.filter(issue => issue.autoFixable && !issue.fixed).length;
          setFixableIssuesCount(fixableCount);
          
          // 显示成功提示
          toast({
            title: "文件上传成功",
            description: `${file.name} 已成功上传并通过审查`,
            variant: "default"
          });
        }
      } else {
        // 如果失败，显示错误提示
        toast({
          title: "文件处理失败",
          description: `${file.name} 处理过程中出现错误，请重试`,
          variant: "destructive"
        });
      }
    }
    
    // 所有文件处理完成后
    setIsFileAnalyzing(false);
    
    // 清除上传状态（延迟一段时间后）
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status !== 'complete'));
    }, 5000);
    
    // 重置文件输入框，以便可以再次选择相同的文件
    e.target.value = '';
  }

  // 渲染AI文件审查结果
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* 显示每个问题的列表 */}
        <div className="flex-grow overflow-y-auto p-6">
          {isLoading || isRefreshing ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="relative mb-8">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{isRefreshing ? "正在重新审查文件..." : "正在分析文件内容..."}</h3>
              <p className="text-sm text-gray-500 mb-4">我们正在仔细检查您的文件，这可能需要几秒钟</p>
              
              {/* 处理进度指示器 */}
              <div className="w-64 mt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>文件分析中</span>
                  <span>请稍候...</span>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                    style={{ 
                      width: "70%",
                      animation: "pulse-width 1.5s infinite ease-in-out"
                    }}
                  ></div>
                </div>
              </div>
              
              {/* 自定义CSS动画 */}
              <style jsx>{`
                @keyframes pulse-width {
                  0%, 100% { width: 40%; }
                  50% { width: 70%; }
                }
              `}</style>
            </div>
          ) : sortedIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileCheck2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">太好了！文件格式审查通过</h3>
              <p className="text-gray-500 max-w-md">
                所有文件格式和命名规范符合要求，您可以继续提交送审。
              </p>
              {result.totalFiles > 0 && (
                <div className="flex items-center mt-6 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  已检查 {result.validFiles}/{result.totalFiles} 个文件，全部符合要求
                </div>
              )}
              
              {/* 无问题时的重新审查按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshReview}
                disabled={isRefreshing || isLoading}
                className="mt-4 border-green-100 text-green-700 hover:bg-green-50"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    重新审查中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    重新审查文件
                  </>
                )}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className={`space-y-3 ${isExpanded ? 'pb-14' : ''}`}>
                {/* 结果统计 - 简洁设计 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-3">
                  {/* 内容区域 */}
                  <div className="p-3">
                    {/* 标题行 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-50 mr-2">
                          <AlertCircle className="h-3 w-3 text-blue-500" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">审查结果</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleRefreshReview}
                          disabled={isRefreshing || isLoading}
                          className="h-7 gap-1 text-xs text-gray-600 hover:text-blue-600"
                        >
                          {isRefreshing ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              重新审查中...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              重新审查
                            </>
                          )}
                        </Button>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          共 {result.issues.length} 个问题，已修复 {result.issues.filter(i => i.fixed).length}
                        </span>
                      </div>
                    </div>
                    
                    {/* 统计数字行 - 横向排列 */}
                    <div className="flex items-center justify-between mt-3 px-1">
                      {/* 总计 */}
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-gray-700">{result.issues.length}</span>
                        <span className="text-xs text-gray-500">总计</span>
                      </div>
                      
                      {/* 分隔线 */}
                      <div className="h-8 w-px bg-gray-100"></div>
                      
                      {/* 严重问题 */}
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-red-600">{result.issues.filter(i => i.severity === 'error').length}</span>
                        <span className="text-xs text-red-500">严重</span>
                      </div>
                      
                      {/* 分隔线 */}
                      <div className="h-8 w-px bg-gray-100"></div>
                      
                      {/* 警告问题 */}
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-amber-600">{result.issues.filter(i => i.severity === 'warning').length}</span>
                        <span className="text-xs text-amber-500">警告</span>
                      </div>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>修复进度</span>
                        <span>{Math.round(100 - (result.issues.filter(i => !i.fixed).length / Math.max(result.issues.length, 1) * 100))}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${100 - (result.issues.filter(i => !i.fixed).length / Math.max(result.issues.length, 1) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 问题列表标题 - 更简洁 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-block w-1 h-4 bg-blue-500 rounded-r mr-2"></span>
                    <span className="text-sm font-medium text-gray-700">问题详情</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {sortedIssues.filter(i => !i.fixed).length} 个待处理
                  </span>
                </div>
                
                {/* 问题列表 */}
                {sortedIssues.map((issue, index) => {
                  const isExpanded = expandedItems.includes(`item-${index}`);
                  return (
                    <div
                      key={`issue-${index}`}
                      className={`
                        bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200
                        ${issue.fixed ? 'opacity-70' : 'opacity-100'}
                        ${isExpanded ? 'border-l-4 border-blue-400' : 'border border-gray-100'}
                      `}
                    >
                      {/* 问题标题栏 */}
                      <div 
                        className={`
                          flex justify-between items-center p-3 cursor-pointer 
                          ${issue.fixed ? 'bg-gray-50' : (issue.severity === 'error' ? 'bg-red-50' : 'bg-amber-50')}
                        `}
                        onClick={() => toggleExpanded(`item-${index}`)}
                      >
                        <div className="flex items-center min-w-0">
                          {renderSeverityIcon(issue.severity)}
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 truncate max-w-[350px]">
                                {issue.message}
                              </span>
                              {issue.fixed && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                                  已修复
                                </Badge>
                              )}
                            </div>
                            {issue.fileName && (
                              <span className="text-xs text-gray-500 block truncate max-w-[400px]">
                                文件: {issue.fileName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronDown 
                            className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                          />
                        </div>
                      </div>
                      
                      {/* 问题详情 */}
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-100 bg-white text-sm">
                          <div className="space-y-3">
                            <div className="flex gap-6">
                              <div className="flex-1">
                                <span className="text-xs font-medium text-gray-500 block mb-1">问题类型</span>
                                <span className="text-sm text-gray-800 font-medium">
                                  {getIssueTypeName(issue.issueType)}
                                </span>
                              </div>
                              {issue.expectedValue && (
                                <div className="flex-1">
                                  <span className="text-xs font-medium text-gray-500 block mb-1">期望值</span>
                                  <span className="text-sm text-gray-800 font-medium">
                                    {issue.expectedValue}
                                  </span>
                                </div>
                              )}
                              {issue.actualValue && (
                                <div className="flex-1">
                                  <span className="text-xs font-medium text-gray-500 block mb-1">实际值</span>
                                  <span className="text-sm text-gray-800 font-medium">
                                    {issue.actualValue}
                                  </span>
                                </div>
                              )}
                              {issue.fileId && (
                                <div className="flex-1">
                                  <span className="text-xs font-medium text-gray-500 block mb-1">文件ID</span>
                                  <span className="text-sm text-gray-800 font-medium">
                                    {issue.fileId}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* 问题描述 */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 block mb-1">问题描述</span>
                              <p className="text-sm text-gray-700 whitespace-pre-line">
                                {issue.description || "未提供详细描述"}
                              </p>
                            </div>
                            
                            {/* 解决建议 */}
                            {issue.solution && (
                              <div>
                                <span className="text-xs font-medium text-gray-500 block mb-1">解决建议</span>
                                <p className="text-sm text-gray-700 whitespace-pre-line p-2 bg-blue-50 rounded">
                                  {issue.solution}
                                </p>
                              </div>
                            )}
                            
                            {/* 统一的问题修复区域 */}
                            {!issue.fixed && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {issue.issueType === 'quantity' ? '缺少必需文件' : 
                                     issue.issueType === 'fileType' ? '文件格式不符合要求' : 
                                     '问题需要修复'}
                                  </span>
                                  
                                  {/* 根据问题类型显示不同的修复按钮 */}
                                  {issue.autoFixable ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
                                      onClick={() => handleFixSingleIssue(issue)}
                                      disabled={isFixing}
                                    >
                                      <WandSparkles className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                      查看并修复
                                    </Button>
                                  ) : issue.issueType === 'quantity' || issue.issueType === 'fileType' ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
                                      onClick={() => handleFileUpload(issue.fileId || 0, issue.expectedValue || '', issue.issueType)}
                                    >
                                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                                      上传文件
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">
                                      需手动修复
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* 文件类型提示 */}
                                {(issue.issueType === 'quantity' || issue.issueType === 'fileType') && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    支持的格式: {issue.expectedValue || 'PDF/Word'}
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {/* 上传进度指示器 */}
                            {uploadingFiles.some(file => file.issueId === issue.fileId) && (
                              <div className="mt-2">
                                {uploadingFiles
                                  .filter(file => file.issueId === issue.fileId)
                                  .map((file, idx) => (
                                    <div key={idx} className="mb-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-700">{file.fileName}</span>
                                        <span className="text-xs text-gray-500">
                                          {file.status === 'uploading' ? `${file.progress}%` :
                                           file.status === 'processing' ? '处理中...' :
                                           file.status === 'complete' ? '完成' : '出错'}
                                        </span>
                                      </div>
                                      <Progress value={file.progress} className="h-1" />
                                    </div>
                                  ))}
                              </div>
                            )}
                            
                            {/* 文件上传成功后的反馈 */}
                            {issue.fixed && issue.issueType === 'quantity' && (
                              <div className="mt-4 bg-green-50 border border-green-100 rounded-md p-3 flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-green-800">
                                    文件已成功上传
                                  </p>
                                  <p className="text-xs text-green-600 mt-1">
                                    您上传的文件已通过系统审查，符合伦理审查要求
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex justify-center py-4 border-t border-gray-100 mt-auto sticky bottom-0 bg-white rounded-b-lg">
          {fixableIssuesCount > 0 ? (
            <Button 
              id="smart-fix-button"
              onClick={handleAutoFixAll} 
              disabled={isFixing}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md px-6"
            >
              {isFixing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在修复问题...
                </>
              ) : (
                <>
                  <WandSparkles className="mr-2 h-4 w-4" />
                  智能助手一键修复 ({fixableIssuesCount}个问题)
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {fixError ? (
                <>
                  <span className="text-red-500">{fixError}</span>
                  <Button variant="outline" size="sm" onClick={handleAutoFixAll} className="ml-2 shadow-sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重试修复
                  </Button>
                </>
              ) : (
                <span>
                  {sortedIssues.some(i => i.fixed) ? "太好了！所有可自动修复的问题已处理完毕" : "请逐个解决以上问题，或联系管理员获取帮助"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 差异对比视图对话框 */}
      <Dialog open={showDiffView} onOpenChange={setShowDiffView}>
        <DialogContent className="sm:max-w-[900px] p-0 border border-gray-100 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <h3 className="text-lg font-medium text-gray-800">文件修复预览</h3>
          </div>
          <div className="p-6">
            {selectedIssue && (
              <FileDiffView 
                issue={selectedIssue}
                file={files?.get(selectedIssue.fileId)?.[0]}
                onApplyFix={handleApplyFix}
                onCancel={() => setShowDiffView(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 批量修复确认对话框 */}
      <AlertDialog 
        open={showBatchFixAlert} 
        onOpenChange={(open) => {
          // 如果正在修复中，不允许关闭对话框
          if (isFixing && !open) return;
          
          // 如果是关闭对话框，确保重置修复状态
          if (!open) {
            setIsFixing(false);
            setProgressValue(0);
          }
          
          setShowBatchFixAlert(open);
        }}
      >
        <AlertDialogContent className="bg-white border border-gray-100 rounded-xl shadow-md p-0 overflow-hidden max-w-3xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1">
            <AlertDialogHeader className="p-5 bg-white rounded-t-lg overflow-y-auto max-h-[80vh]">
              <AlertDialogTitle className="text-xl font-medium text-gray-800 flex items-center">
                <WandSparkles className="mr-2 h-5 w-5 text-blue-600" />
                智能批量修复助手
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 mt-3 space-y-3 pr-2">
                {isFixing ? (
                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping opacity-30"></div>
                      <WandSparkles className="absolute inset-0 m-auto h-10 w-10 text-blue-600 animate-pulse" />
                    </div>
                    <p className="text-lg font-medium text-blue-700">正在进行智能修复...</p>
                    <p className="text-sm text-gray-500 mt-2">我们正在调整文件名称和格式，请稍候...</p>
                    <div className="w-full mt-6 px-8">
                      <Progress value={progressValue} className="h-2 bg-blue-100" />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {progressValue < 100 
                          ? `预计剩余时间: ${Math.ceil((100 - progressValue) / 25)} 秒` 
                          : "处理完成，即将更新..."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>
                      您好！我们发现了 <span className="font-medium text-blue-600">{sortedIssues.length}</span> 个问题，
                      其中 <span className="font-medium text-blue-600">{fixableIssuesCount}</span> 个问题可以通过智能助手自动修复。
                    </p>
                    
                    <div className="bg-blue-50 p-3 rounded-md text-sm">
                      <p className="font-medium text-blue-700 mb-1">我们将为您自动修复：</p>
                      <ul className="list-disc pl-5 space-y-1 text-blue-700">
                        {sortedIssues.filter(i => i.autoFixable && !i.fixed).map((issue, index) => (
                          <li key={index}>
                            {issue.issueType === 'version' ? '文件版本号问题' : 
                             issue.issueType === 'naming' ? '文件命名规范问题' : 
                             issue.issueType === 'fileType' ? '文件格式问题' : 
                             '其他可修复问题'}
                             {issue.fileName && ` (${issue.fileName})`}
                          </li>
                        )).slice(0, 3)}
                        {sortedIssues.filter(i => i.autoFixable && !i.fixed).length > 3 && (
                          <li>等其他问题...</li>
                        )}
                      </ul>
                    </div>
                    
                    {sortedIssues.filter(i => !i.autoFixable && !i.fixed).length > 0 && (
                      <div className="bg-amber-50 p-3 rounded-md text-sm">
                        <p className="font-medium text-amber-700 mb-1">需要您手动处理：</p>
                        <ul className="list-disc pl-5 space-y-1 text-amber-700">
                          {sortedIssues.filter(i => !i.autoFixable && !i.fixed).map((issue, index) => (
                            <li key={index}>
                              {issue.issueType === 'quantity' ? '缺少必需文件' : '需手动修改问题'}
                              {issue.fileName && ` (${issue.fileName})`}
                            </li>
                          )).slice(0, 2)}
                          {sortedIssues.filter(i => !i.autoFixable && !i.fixed).length > 2 && (
                            <li>等其他问题...</li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      自动修复将调整文件名称和格式，让它们符合规范要求。修复后的文件将自动替换原文件，您可以在修复后查看并确认效果。
                    </p>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-100">
            <AlertDialogCancel 
              className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md"
              disabled={isFixing}
            >
              暂不修复
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                // 阻止默认行为，防止对话框自动关闭
                e.preventDefault();
                // 先将状态设置为处理中，重置进度
                setIsFixing(true);
                setProgressValue(0);
                
                // 模拟进度条更新
                const progressInterval = setInterval(() => {
                  setProgressValue(prev => {
                    // 当进度达到95%时，等待实际处理完成
                    if (prev >= 95) {
                      clearInterval(progressInterval);
                      return prev;
                    }
                    // 进度增加速度随进度增加而减慢
                    const increment = 100 / (25 - Math.floor(prev / 20));
                    return Math.min(prev + increment, 95);
                  });
                }, 100);
                
                // 模拟处理延迟，然后再进行实际的批量修复操作
                setTimeout(() => {
                  // 执行实际的批量修复操作
                  confirmBatchFix();
                  
                  // 完成修复后，将进度设为100%
                  setProgressValue(100);
                  
                  // 短暂延迟后关闭对话框
                  setTimeout(() => {
                    clearInterval(progressInterval);
                    setShowBatchFixAlert(false);
                    // 重置进度
                    setProgressValue(0);
                  }, 1000);
                }, 2500); // 给用户足够的时间看到动画
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm rounded-md"
              disabled={isFixing}
            >
              {isFixing ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <WandSparkles className="mr-1.5 h-4 w-4" />
              )}
              {isFixing ? "处理中..." : `开始智能修复 (${fixableIssuesCount})`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 隐藏的文件上传输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
} 