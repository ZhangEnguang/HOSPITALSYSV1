"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileReviewIssue, renameFile, convertFileFormat } from "@/app/services/ai-file-review"
import { Loader2, Check, X, RefreshCw, FileIcon, FileText } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState("compare")
  
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
          toast({
            title: "修复成功",
            description: result.message
          })
          onApplyFix({
            ...issue,
            fixed: true,
            severity: 'info',
            message: `已自动修复: ${issue.message}`
          }, result.file)
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
          toast({
            title: "转换成功",
            description: result.message
          })
          onApplyFix({
            ...issue,
            fixed: true,
            severity: 'info',
            message: `已自动修复: ${issue.message}`
          }, result.file)
        } else {
          toast({
            title: "转换失败",
            description: result.message,
            variant: "destructive"
          })
        }
      } else {
        // 其他修复逻辑
        onApplyFix({
          ...issue,
          fixed: true,
          severity: 'info',
          message: `已自动修复: ${issue.message}`
        })
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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">修复问题</CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {issue.issueType === 'version' ? '版本号' : 
              issue.issueType === 'naming' ? '命名规范' : 
              issue.issueType === 'fileType' ? '文件类型' : 
              '格式问题'}
          </Badge>
        </div>
        <CardDescription>
          {issue.message}
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compare">对比视图</TabsTrigger>
          <TabsTrigger value="preview">预览效果</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compare" className="p-0">
          <div className="grid grid-cols-2 gap-0 border-t">
            <div className="p-4 border-r bg-gray-50">
              <div className="text-sm font-medium mb-2 text-slate-500">原始文件</div>
              <div className="flex items-center gap-2 p-3 bg-white border rounded-md">
                <FileIcon className="h-5 w-5 text-slate-400" />
                <span className="text-sm truncate" title={file?.name || issue.fileName}>
                  {file?.name || issue.originalValue || issue.fileName}
                </span>
              </div>
              {isVersionIssue && (
                <div className="mt-2 px-3 py-1 bg-red-50 text-red-700 rounded text-xs inline-block">
                  缺少版本号或格式不正确
                </div>
              )}
              {isNamingIssue && (
                <div className="mt-2 px-3 py-1 bg-red-50 text-red-700 rounded text-xs inline-block">
                  文件命名不符合规范
                </div>
              )}
              {isFileTypeIssue && (
                <div className="mt-2 px-3 py-1 bg-red-50 text-red-700 rounded text-xs inline-block">
                  文件类型不符合要求
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="text-sm font-medium mb-2 text-slate-500">修复后</div>
              <div className="flex items-center gap-2 p-3 bg-white border border-green-200 rounded-md">
                <FileText className="h-5 w-5 text-green-500" />
                <span className="text-sm truncate text-green-700 font-medium" title={
                  isVersionIssue ? file?.name.replace(/(\.[^.]+)$/, `_V${selectedFix}$1`) :
                  isNamingIssue ? selectedFix :
                  `${file?.name.replace(/\.[^.]+$/, '')}_converted.${selectedFix || 'pdf'}`
                }>
                  {isVersionIssue ? file?.name.replace(/(\.[^.]+)$/, `_V${selectedFix}$1`) :
                   isNamingIssue ? selectedFix :
                   `${file?.name.replace(/\.[^.]+$/, '')}_converted.${selectedFix || 'pdf'}`}
                </span>
              </div>
              <div className="mt-2 px-3 py-1 bg-green-50 text-green-700 rounded text-xs inline-block">
                {isVersionIssue ? '添加了标准版本号' : 
                 isNamingIssue ? '符合命名规范' : 
                 '转换为标准格式'}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="border-t p-4">
          <div className="text-sm font-medium mb-3">应用该修复后:</div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {isVersionIssue ? '文件将添加标准版本号' : 
               isNamingIssue ? '文件将符合命名规范' : 
               '文件将转换为合规格式'}
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              原始文件{isFileTypeIssue ? '将保留作为备份' : '不会被修改'}
            </li>
            {isFileTypeIssue && (
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                文档内容和格式将保持不变
              </li>
            )}
          </ul>
        </TabsContent>
      </Tabs>
      
      {/* 修复选项 */}
      <CardContent className="pt-2 pb-0">
        {isVersionIssue && renderVersionFixOptions()}
        {isNamingIssue && renderNamingFixOptions()}
        {isFileTypeIssue && renderFileTypeOptions()}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 pb-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          <X className="mr-2 h-4 w-4" />
          取消
        </Button>
        <Button 
          onClick={handleApplyFix} 
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
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
      </CardFooter>
    </Card>
  )
} 