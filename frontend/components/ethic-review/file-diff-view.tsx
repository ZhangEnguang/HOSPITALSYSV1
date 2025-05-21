"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileReviewIssue, renameFile, convertFileFormat } from "@/app/services/ai-file-review"
import { Loader2, Check, X, FileIcon, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FileDiffViewProps {
  issue: FileReviewIssue
  file?: File
  onApplyFix: (issue: FileReviewIssue, newFile?: File) => void
  onCancel: () => void
}

export function FileDiffView({ issue, file, onApplyFix, onCancel }: FileDiffViewProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFix, setSelectedFix] = useState<string>(
    issue.suggestedValue || (issue.fixOptions && issue.fixOptions[0]) || ''
  )
  
  const isVersionIssue = issue.issueType === 'version'
  const isNamingIssue = issue.issueType === 'naming'
  const isFileTypeIssue = issue.issueType === 'fileType'
  
  // 处理应用修复
  const handleApplyFix = async () => {
    if (!file) {
      toast({
        title: "错误",
        description: "未找到文件，无法应用修复",
        variant: "destructive"
      })
      return
    }
    
    setIsProcessing(true)
    
    try {
      if (isVersionIssue || isNamingIssue) {
        // 处理文件重命名
        let newFileName = ""
        
        if (isVersionIssue) {
          // 将版本号替换到原始文件名中
          newFileName = file.name.replace(/(\.[^.]+)$/, `_V${selectedFix}$1`)
          if (file.name === newFileName) {
            // 如果没有改变，尝试另一种替换方式
            newFileName = file.name.replace(/(_[vV][\d.]+)?(\.[^.]+)$/, `_V${selectedFix}$2`)
          }
        } else {
          // 使用选择的命名方案
          newFileName = selectedFix
        }
        
        const result = await renameFile(file, newFileName)
        
        if (result.success && result.file) {
          // 先设置处理状态为false，确保UI状态正确更新
          setIsProcessing(false)
          toast({
            title: "修复成功",
            description: result.message
          })
          // 调用回调函数，传递修复后的信息和文件
          onApplyFix({
            ...issue,
            fixed: true,
            severity: 'info',
            message: `已自动修复: ${issue.message}`
          }, result.file)
          return // 提前返回，避免执行finally块
        } else {
          toast({
            title: "修复失败",
            description: result.message,
            variant: "destructive"
          })
        }
      } else if (isFileTypeIssue) {
        // 处理文件格式转换
        const targetFormat = selectedFix || 'PDF'
        const result = await convertFileFormat(file, targetFormat)
        
        if (result.success && result.file) {
          // 先设置处理状态为false，确保UI状态正确更新
          setIsProcessing(false)
          toast({
            title: "转换成功",
            description: result.message
          })
          // 调用回调函数，传递修复后的信息和文件
          onApplyFix({
            ...issue,
            fixed: true,
            severity: 'info',
            message: `已自动修复: ${issue.message}`
          }, result.file)
          return // 提前返回，避免执行finally块
        } else {
          toast({
            title: "转换失败",
            description: result.message,
            variant: "destructive"
          })
        }
      } else {
        // 先设置处理状态为false，确保UI状态正确更新
        setIsProcessing(false)
        // 其他修复逻辑
        onApplyFix({
          ...issue,
          fixed: true,
          severity: 'info',
          message: `已自动修复: ${issue.message}`
        })
        return // 提前返回，避免执行finally块
      }
    } catch (error) {
      console.error("应用修复失败:", error)
      toast({
        title: "修复失败",
        description: "应用修复时发生错误",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  // 渲染版本号修复选项
  const renderVersionFixOptions = () => {
    if (!issue.fixOptions || issue.fixOptions.length === 0) {
      return null
    }
    
    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium">选择版本号格式:</h4>
        <RadioGroup
          value={selectedFix}
          onValueChange={setSelectedFix}
          className="grid grid-cols-3 gap-4"
        >
          {issue.fixOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm font-medium">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }
  
  // 渲染文件命名修复选项
  const renderNamingFixOptions = () => {
    if (!issue.fixOptions || issue.fixOptions.length === 0) {
      return null
    }
    
    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium">选择文件命名方案:</h4>
        <RadioGroup
          value={selectedFix}
          onValueChange={setSelectedFix}
          className="space-y-3"
        >
          {issue.fixOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 border p-2 rounded-md">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm font-medium">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }
  
  // 渲染文件转换选项
  const renderFileTypeOptions = () => {
    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium">转换为:</h4>
        <RadioGroup
          value={selectedFix || 'PDF'}
          onValueChange={setSelectedFix}
          className="grid grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PDF" id="format-pdf" />
            <Label htmlFor="format-pdf" className="text-sm font-medium">PDF</Label>
          </div>
        </RadioGroup>
        <div className="text-xs text-yellow-600 mt-2">
          注意: 转换过程可能导致部分格式丢失，重要文档请手动转换后上传
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium text-gray-800">修复问题</h2>
        <Badge variant="outline" className="bg-white text-blue-600 border-blue-200 rounded-full px-3 shadow-sm whitespace-nowrap">
          {issue.issueType === 'version' ? '版本号' : 
            issue.issueType === 'naming' ? '命名规范' : 
            issue.issueType === 'fileType' ? '文件类型' : 
            '格式问题'}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-500 mb-5 break-words">
        {issue.message}
      </p>
      
      <div className="border border-gray-100 rounded-lg mb-6 overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 gap-0">
          <div className="p-5 border-r bg-gray-50">
            <h3 className="text-sm font-medium mb-3 text-gray-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              原始文件
            </h3>
            <div className="flex items-center gap-2 p-4 bg-white border border-gray-100 rounded-md shadow-sm">
              <FileIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm truncate text-gray-700 min-w-0" title={file?.name || issue.fileName}>
                {file?.name || issue.originalValue || issue.fileName}
              </span>
            </div>
            {isVersionIssue && (
              <div className="mt-3 px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-md text-xs shadow-sm whitespace-normal">
                缺少版本号或格式不正确
              </div>
            )}
            {isNamingIssue && (
              <div className="mt-3 px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-md text-xs shadow-sm whitespace-normal">
                文件命名不符合规范
              </div>
            )}
            {isFileTypeIssue && (
              <div className="mt-3 px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-md text-xs shadow-sm whitespace-normal">
                文件类型不符合要求
              </div>
            )}
          </div>
          
          <div className="p-5">
            <h3 className="text-sm font-medium mb-3 text-gray-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              修复后预览
            </h3>
            <div className="flex items-center gap-2 p-4 bg-white border border-emerald-100 rounded-md shadow-sm">
              <FileText className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm truncate text-emerald-700 font-medium min-w-0" title={
                isVersionIssue ? file?.name.replace(/(\.[^.]+)$/, `_V${selectedFix}$1`) :
                isNamingIssue ? selectedFix :
                `${file?.name.replace(/\.[^.]+$/, '')}_converted.${selectedFix || 'pdf'}`
              }>
                {isVersionIssue ? file?.name.replace(/(\.[^.]+)$/, `_V${selectedFix}$1`) :
                 isNamingIssue ? selectedFix :
                 `${file?.name.replace(/\.[^.]+$/, '')}_converted.${selectedFix || 'pdf'}`}
              </span>
            </div>
            <div className="mt-3 px-3 py-1.5 bg-white border border-emerald-100 text-emerald-600 rounded-md text-xs shadow-sm whitespace-normal">
              {isVersionIssue ? '添加了标准版本号' : 
               isNamingIssue ? '符合命名规范' : 
               '转换为标准格式'}
            </div>
          </div>
        </div>
      </div>
      
      {/* 修复选项 */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
        {isVersionIssue && renderVersionFixOptions()}
        {isNamingIssue && renderNamingFixOptions()}
        {isFileTypeIssue && renderFileTypeOptions()}
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <X className="mr-2 h-4 w-4" />
          取消
        </Button>
        <Button 
          onClick={handleApplyFix} 
          disabled={isProcessing}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              应用修复
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 