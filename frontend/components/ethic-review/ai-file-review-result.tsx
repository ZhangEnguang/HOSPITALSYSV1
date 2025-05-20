"use client"

import { useState, useEffect } from "react"
import { FileReviewIssue, FileReviewResult, autoFixFileIssues } from "@/app/services/ai-file-review"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2, Zap, RefreshCw, FileText, WandSparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog" 
import { FileDiffView } from "./file-diff-view"
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

interface AIFileReviewResultProps {
  result: FileReviewResult
  isLoading?: boolean
  onFixIssues?: (fixedIssues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => void
  files?: Map<number, File[]> // 文件ID到文件列表的映射
}

export function AIFileReviewResult({ 
  result, 
  isLoading = false, 
  onFixIssues,
  files
}: AIFileReviewResultProps) {
  const [isFixing, setIsFixing] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [fixError, setFixError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<FileReviewIssue | null>(null)
  const [showDiffView, setShowDiffView] = useState(false)
  const [showBatchFixAlert, setShowBatchFixAlert] = useState(false)

  // 存储更新后的文件
  const [updatedFiles, setUpdatedFiles] = useState<Map<number, File[]>>(new Map())

  // 初始化时自动展开所有错误项
  useEffect(() => {
    if (result?.issues?.length > 0 && !isLoading) {
      // 找到所有错误级别的问题
      const errorIndices = result.issues
        .map((issue, index) => issue.severity === 'error' ? `item-${index}` : null)
        .filter(Boolean) as string[]
      
      if (errorIndices.length > 0) {
        setExpandedItems(errorIndices)
      }
    }
  }, [result, isLoading])

  // 处理单个问题的修复
  const handleFixSingleIssue = (issue: FileReviewIssue) => {
    // 查找对应的文件
    const fileArray = files?.get(issue.fileId) || []
    if (fileArray.length > 0) {
      // 设置当前选中的问题并显示差异对比视图
      setSelectedIssue(issue)
      setShowDiffView(true)
    } else {
      toast({
        title: "无法修复",
        description: "未找到关联的文件",
        variant: "destructive"
      })
    }
  }

  // 处理应用修复后的回调
  const handleApplyFix = (fixedIssue: FileReviewIssue, newFile?: File) => {
    if (!result || !onFixIssues) return
    
    // 关闭差异对比视图
    setShowDiffView(false)
    
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
  }

  // 处理自动修复所有问题
  const handleAutoFixAll = async () => {
    // 先询问用户确认
    setShowBatchFixAlert(true)
  }

  // 用户确认批量修复后的处理
  const confirmBatchFix = async () => {
    if (!onFixIssues) return
    
    setIsFixing(true)
    setFixError(null)
    
    try {
      // 找出所有可自动修复的问题
      const fixableIssues = result.issues.filter(issue => issue.autoFixable)
      if (fixableIssues.length > 0) {
        console.log("开始批量自动修复问题:", fixableIssues.length)
        const fixedIssues = await autoFixFileIssues(result.issues)
        console.log("批量问题修复完成:", fixedIssues)
        
        // 创建一个新的文件映射
        const batchUpdatedFiles = new Map(updatedFiles)
        
        // TODO: 实际应用中，这里需要为每个被修复的问题生成新文件
        // 这里只做简单模拟
        
        onFixIssues(fixedIssues, batchUpdatedFiles)
        
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
    } finally {
      setIsFixing(false)
    }
  }

  // 获取实际的结果对象，确保它是有效的
  const safeResult = result || { hasIssues: false, issues: [], totalFiles: 0, validFiles: 0 }
  
  // 获取可自动修复问题的数量
  const autoFixableCount = safeResult.issues.filter(issue => issue.autoFixable).length

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

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">AI文件审查</CardTitle>
          <CardDescription>正在进行智能审查，请稍候...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              正在分析文件内容，这可能需要几秒钟...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 如果没有问题
  if (!safeResult.hasIssues) {
    return (
      <Card className="w-full border-green-100">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">AI文件审查</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              全部通过
            </Badge>
          </div>
          <CardDescription>所有文件均符合伦理审查要求</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-6 flex-col gap-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-lg font-medium text-green-700">文件审查通过</p>
            <p className="text-sm text-muted-foreground">
              已成功验证 {safeResult.validFiles}/{safeResult.totalFiles} 个文件
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 渲染问题列表
  return (
    <>
      <Card className={`w-full ${
        safeResult.issues.some(i => i.severity === 'error') 
          ? 'border-red-200' 
          : 'border-yellow-200'
      }`}>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">AI文件审查</CardTitle>
            <Badge variant="outline" className={`
              ${safeResult.issues.some(i => i.severity === 'error') 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }
            `}>
              发现 {safeResult.issues.length} 个问题
            </Badge>
          </div>
          <CardDescription>
            智能审查发现了以下需要注意的问题
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-muted-foreground">
              已验证 {safeResult.validFiles}/{safeResult.totalFiles} 个文件
              {safeResult.issues.some(i => i.severity === 'error') && (
                <span className="text-red-500 ml-2 font-medium">
                  （发现严重问题需要修正）
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                展开全部
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                收起全部
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[320px] pr-4">
            <Accordion
              type="multiple"
              value={expandedItems}
              onValueChange={setExpandedItems}
              className="w-full"
            >
              {safeResult.issues.map((issue, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      {renderSeverityIcon(issue.severity)}
                      <span className={`font-medium ${
                        issue.severity === 'error' 
                          ? 'text-red-600' 
                          : issue.severity === 'warning'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                      }`}>
                        {issue.fileName}: {issue.message}
                      </span>
                      {issue.fixed && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                          已修复
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 pt-2">
                      <Alert className={
                        issue.severity === 'error' 
                          ? 'border-red-200 bg-red-50' 
                          : issue.severity === 'warning'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-blue-200 bg-blue-50'
                      }>
                        <AlertTitle className="flex items-center gap-2">
                          <Badge variant="outline">
                            {getIssueTypeName(issue.issueType)}
                          </Badge>
                          问题建议
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                          <div className="mb-2">{issue.suggestion}</div>
                          
                          <div className="flex justify-end mt-4">
                            {issue.autoFixable && !issue.fixed ? (
                              <Button 
                                variant="outline"
                                size="sm"
                                className="bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                                onClick={() => handleFixSingleIssue(issue)}
                              >
                                <FileText className="mr-1 h-3.5 w-3.5" />
                                查看并修复
                              </Button>
                            ) : issue.fixed ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                问题已修复
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                需手动修复
                              </Badge>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          {autoFixableCount > 0 ? (
            <Button 
              onClick={handleAutoFixAll} 
              disabled={isFixing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isFixing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在修复...
                </>
              ) : (
                <>
                  <WandSparkles className="mr-2 h-4 w-4" />
                  一键修复所有问题 ({autoFixableCount})
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {fixError ? (
                <>
                  <span className="text-red-500">{fixError}</span>
                  <Button variant="outline" size="sm" onClick={handleAutoFixAll} className="ml-2">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重试
                  </Button>
                </>
              ) : (
                <span>请逐个解决以上问题</span>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* 差异对比视图对话框 */}
      <Dialog open={showDiffView} onOpenChange={setShowDiffView}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedIssue && (
            <FileDiffView 
              issue={selectedIssue}
              file={files?.get(selectedIssue.fileId)?.[0]}
              onApplyFix={handleApplyFix}
              onCancel={() => setShowDiffView(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* 批量修复确认对话框 */}
      <AlertDialog open={showBatchFixAlert} onOpenChange={setShowBatchFixAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量修复</AlertDialogTitle>
            <AlertDialogDescription>
              系统将自动修复所有{autoFixableCount}个可修复问题。此操作将修改文件名称和格式，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBatchFix}>确认修复</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
  
  // 展开所有项目
  function expandAll() {
    setExpandedItems(safeResult.issues.map((_, index) => `item-${index}`))
  }

  // 收起所有项目
  function collapseAll() {
    setExpandedItems([])
  }
} 