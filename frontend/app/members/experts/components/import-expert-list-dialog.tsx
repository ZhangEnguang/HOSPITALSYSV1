"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  FileUp, 
  Download, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  X,
  Info
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { expertLevelColors } from "../config/experts-config"

interface ImportExpertListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportSuccess: (experts: any[]) => Promise<void>
}

export function ImportExpertListDialog({ 
  open, 
  onOpenChange, 
  onImportSuccess 
}: ImportExpertListDialogProps) {
  // 文件上传相关状态
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // 预览数据相关状态
  const [previewData, setPreviewData] = useState<any[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})
  const [importReady, setImportReady] = useState(false)

  // 处理重置状态
  const resetState = () => {
    setSelectedFile(null)
    setIsUploading(false)
    setUploadProgress(0)
    setPreviewData([])
    setValidationErrors({})
    setImportReady(false)
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 当对话框关闭时重置状态
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetState()
    }
    onOpenChange(open)
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && 
          file.type !== "application/vnd.ms-excel" && 
          file.type !== "text/csv") {
        toast({
          title: "文件格式不支持",
          description: "请上传Excel文件(.xlsx/.xls)或CSV文件",
          variant: "destructive",
        })
        return
      }
      
      setSelectedFile(file)
      
      // 模拟文件解析（实际应该使用xlsx库或其他库解析Excel/CSV）
      setTimeout(() => {
        const mockData = generateMockData(file.name.includes("error") ? true : false)
        setPreviewData(mockData.data)
        setValidationErrors(mockData.errors)
        setImportReady(Object.keys(mockData.errors).length === 0)
      }, 1000)
    }
  }

  // 模拟上传进度
  const simulateUploadProgress = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // 处理文件上传并导入
  const handleImport = async () => {
    if (!importReady || !selectedFile) return
    
    simulateUploadProgress()
    
    try {
      // 这里应该是真实的后端API调用
      // 在此示例中，我们只是模拟API调用
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 模拟导入成功
      await onImportSuccess(previewData)
      
      toast({
        title: "导入成功",
        description: `成功导入 ${previewData.length} 位专家数据`,
      })
      
      handleOpenChange(false)
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  // 下载导入模板
  const handleDownloadTemplate = () => {
    // 实际应该提供一个下载链接或触发文件下载
    toast({
      title: "模板下载",
      description: "专家导入模板已开始下载",
    })
  }

  // 模拟生成预览数据
  const generateMockData = (withErrors: boolean = false) => {
    const mockData = [
      {
        id: "import_1",
        name: "王建国",
        expertLevel: "国家级",
        title: "教授/博导",
        education: "博士/博士后",
        department: { name: "计算机科学与技术学院" },
        status: "在职",
        email: "wangjg@example.edu.cn",
        mobile: "13888888888",
        specialty: ["人工智能", "机器学习"],
      },
      {
        id: "import_2",
        name: "李明",
        expertLevel: "省级",
        title: "副教授/硕导",
        education: "博士",
        department: { name: "电子信息工程学院" },
        status: "在职",
        email: "liming@example.edu.cn",
        mobile: "13777777777",
        specialty: ["电子信息", "信号处理"],
      },
      {
        id: "import_3",
        name: "张华",
        expertLevel: "市级",
        title: "研究员",
        education: "博士",
        department: { name: "材料科学与工程学院" },
        status: "在职",
        email: "zhanghua@example.edu.cn",
        mobile: "13666666666",
        specialty: ["材料科学", "新能源材料"],
      },
      {
        id: "import_4",
        name: "刘芳",
        expertLevel: "校级",
        title: "副研究员",
        education: "博士",
        department: { name: "环境科学与工程学院" },
        status: "在职",
        email: "liufang@example.edu.cn",
        mobile: "13555555555",
        specialty: ["环境工程", "水污染控制"],
      },
      {
        id: "import_5",
        name: "陈学者",
        expertLevel: "国家级",
        title: "教授/博导",
        education: "博士/博士后",
        department: { name: "医学院" },
        status: "在职",
        email: "chenxuezhe@example.edu.cn",
        mobile: "13444444444",
        specialty: ["医学", "生物医学工程"],
      }
    ]
    
    const errors: Record<number, string[]> = {}
    
    if (withErrors) {
      errors[1] = ["邮箱格式不正确"]
      errors[3] = ["手机号格式不正确", "专家级别值不在允许范围内"]
    }
    
    return {
      data: mockData,
      errors,
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileUp className="h-5 w-5 text-primary" />
            导入专家清单
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* 上传区域 */}
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-3">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">选择Excel文件或拖拽文件到此处</p>
              <p className="text-sm text-muted-foreground">支持 .xlsx, .xls, .csv 格式</p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <div className="flex gap-3 mt-2">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <FileUp className="h-4 w-4 mr-2" />
                选择文件
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                下载导入模板
              </Button>
            </div>
            {selectedFile && (
              <Badge variant="outline" className="mt-2">
                已选择: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </Badge>
            )}
          </div>

          {/* 上传进度条 */}
          {isUploading && (
            <div className="w-full mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>上传中...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 数据预览和验证 */}
          {previewData.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">数据预览 ({previewData.length} 条记录)</div>
                {Object.keys(validationErrors).length > 0 && (
                  <Badge variant="destructive" className="px-2 py-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    存在 {Object.keys(validationErrors).length} 行数据错误
                  </Badge>
                )}
                {importReady && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    数据验证通过
                  </Badge>
                )}
              </div>
              
              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">序号</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>专家级别</TableHead>
                      <TableHead>职称</TableHead>
                      <TableHead>所属单位</TableHead>
                      <TableHead>联系方式</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((expert, index) => {
                      const rowErrors = validationErrors[index] || []
                      const hasError = rowErrors.length > 0
                      
                      return (
                        <TableRow 
                          key={expert.id || index}
                          className={hasError ? "bg-red-50" : ""}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {index + 1}
                              {hasError && (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{expert.name}</TableCell>
                          <TableCell>
                            <Badge variant={expertLevelColors[expert.expertLevel] || "default"}>
                              {expert.expertLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>{expert.title}</TableCell>
                          <TableCell>{expert.department?.name}</TableCell>
                          <TableCell className="text-xs">
                            <div>{expert.email}</div>
                            <div>{expert.mobile}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {expert.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              {/* 错误提示 */}
              {Object.keys(validationErrors).length > 0 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>数据验证错误</AlertTitle>
                  <AlertDescription>
                    <ScrollArea className="h-[100px]">
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {Object.entries(validationErrors).map(([rowIndex, errors]) => (
                          <li key={rowIndex}>
                            第 {Number(rowIndex) + 1} 行: 
                            <ul className="list-circle pl-5">
                              {errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* 导入提示 */}
              {importReady && (
                <Alert className="mt-2 border-green-200 bg-green-50 text-green-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>数据检验成功</AlertTitle>
                  <AlertDescription>
                    专家数据验证通过，点击下方的"导入"按钮开始导入数据。
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>
            取消
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!importReady || isUploading}
            className={importReady ? "" : "opacity-50 cursor-not-allowed"}
          >
            {isUploading ? "导入中..." : "导入数据"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 