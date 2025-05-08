"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileTextIcon,
  UploadIcon,
  FileText,
  Trash2,
  X,
  ClipboardList
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// 动物伦理项目初始审查表单组件
export function AnimalInitialReviewForm() {
  const router = useRouter()

  // 表单数据状态
  const [formData, setFormData] = useState({
    // 项目信息 - 使用演示数据
    projectTitle: "实验性鼠药物代谢研究",
    animalType: "小鼠",
    animalCount: "85",
    facilityUnit: "基础医学实验中心",
    leaderName: "张教授",
    department: "基础医学院",
    ethicsCommittee: "医学院伦理审查委员会",
    
    // 送审文件信息
    reviewDescription: "",
    reviewFiles: [] as File[]
  })

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 完成对话框显示状态
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // 预览对话框显示状态
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // 动物伦理初始审查的送审文件清单
  const reviewFileList = [
    {
      id: 1,
      fileName: "动物伦理审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [] as File[],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/animal-ethics-application-form.docx"
    },
    {
      id: 2,
      fileName: "项目研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [] as File[],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/research-protocol-template.docx"
    },
    {
      id: 3,
      fileName: "知情同意书",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "知情同意",
      files: [] as File[],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-template.docx"
    },
    {
      id: 4,
      fileName: "调查问卷",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "调查问卷",
      files: [] as File[],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 5,
      fileName: "其他支持性文件",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "其他",
      files: [] as File[],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ]

  // 管理送审文件清单
  const [fileList, setFileList] = useState(reviewFileList)
  
  // 文件预览状态
  const [previewFile, setPreviewFile] = useState<{url: string, name: string, type: string, extension: string, previewable: boolean} | null>(null)

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理字段失去焦点
  const handleBlur = (field: string) => {
    setFormTouched((prev) => ({
      ...prev,
      [field]: true
    }))
  }

  // 处理文件上传
  const handleFileUpload = (id: number, files: FileList) => {
    if (files.length === 0) return

    setFileList(prevList => {
      return prevList.map(item => {
        if (item.id === id) {
          // 如果数量不限制，可以添加多个文件
          if (item.quantity === "不限制") {
            return {
              ...item,
              files: [...item.files, ...Array.from(files)]
            };
          } else {
            // 否则只保留最新上传的文件
            return {
              ...item,
              files: [files[0]]
            };
          }
        }
        return item;
      });
    });
  }

  // 删除已上传的文件
  const handleDeleteFile = (itemId: number, fileIndex: number) => {
    setFileList(prevList => {
      return prevList.map(item => {
        if (item.id === itemId) {
          const newFiles = [...item.files];
          newFiles.splice(fileIndex, 1);
          return {
            ...item,
            files: newFiles
          };
        }
        return item;
      });
    });
  }

  // 更新版本信息
  const handleVersionChange = (id: number, field: 'versionDate' | 'versionNumber', value: string) => {
    console.log(`正在更新 ID=${id} 的 ${field}，值为: ${value}`);
    setFileList(prevList => {
      return prevList.map(item => {
        if (item.id === id) {
          return {
            ...item,
            [field]: value
          };
        }
        return item;
      });
    });
  }

  // 验证表单
  const validateForm = () => {
    // 只有送审文件相关的字段需要验证，因为项目信息已经自动填充
    // 在这个例子中，我们不设置必填字段，但如果有必要可以在这里添加
    const requiredFields: string[] = []
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${field}`
      }
    })
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({
      ...prev,
      ...newTouched
    }))
    
    if (!isValid) {
      // 滚动到第一个错误字段
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    
    return isValid
  }

  // 保存草稿
  const handleSaveDraft = () => {
    console.log("点击保存草稿按钮")
    toast({
      title: "已保存草稿",
      description: "审查信息已保存为草稿"
    })
  }

  // 提交表单
  const handleSubmit = () => {
    console.log("点击确认按钮，开始验证表单")
    try {
      if (!validateForm()) return
      
      // 显示预览对话框
      setShowPreviewDialog(true)
    } catch (error) {
      console.error("表单提交出错:", error)
      toast({
        title: "提交失败",
        description: "表单提交过程中发生错误",
        variant: "destructive"
      })
    }
  }

  // 确认预览并提交
  const handleConfirmSubmit = () => {
    // 关闭预览对话框
    setShowPreviewDialog(false)
    
    // 添加提交逻辑
    console.log("提交审查表单数据:", formData)
    
    // 显示完成对话框
    setShowCompletionDialog(true)
  }

  // 继续添加
  const handleContinueAdding = () => {
    setShowCompletionDialog(false)
    
    // 重置表单
    setFormData({
      projectTitle: "实验性鼠药物代谢研究",
      animalType: "小鼠",
      animalCount: "85",
      facilityUnit: "基础医学实验中心",
      leaderName: "张教授",
      department: "基础医学院",
      ethicsCommittee: "医学院伦理审查委员会",
      reviewDescription: "",
      reviewFiles: []
    })
    
    // 重置错误和触摸状态
    setFormErrors({})
    setFormTouched({})
    
    toast({
      title: "已清空表单",
      description: "可以继续添加新审查"
    })
  }

  // 返回列表
  const handleReturnToList = () => {
    router.push("/ethic-projects/animal")
  }

  // 自定义表单标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
      </div>
    )
  }
  
  // 错误提示组件
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </div>
    )
  }

  // 必填标记组件 - 现在不需要了，但保留定义以防后续需要
  const RequiredMark = () => (
    <span className="text-red-500 ml-1">*</span>
  )

  // 处理文件预览
  const handlePreviewFile = (file: File) => {
    // 创建文件的预览URL
    const fileUrl = URL.createObjectURL(file);
    
    // 获取文件扩展名
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    // 如果是PDF，直接在新标签页打开
    if (fileExt === 'pdf') {
      window.open(fileUrl, '_blank');
      return;
    }
    
    // 对于其他文件，显示预览对话框
    // 根据文件类型设置可预览标志
    const previewableTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const isPreviewable = previewableTypes.includes(fileExt);
    
    setPreviewFile({
      url: fileUrl,
      name: file.name,
      type: file.type,
      extension: fileExt,
      previewable: isPreviewable
    });
  }

  // 关闭文件预览
  const closePreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  }

  // 下载模板文件
  const downloadTemplate = (templateUrl: string, fileName: string) => {
    // 在实际环境中，这里应该是从服务器下载文件
    // 这里我们只是模拟下载操作
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">新增动物伦理初始审查</h1>
        </div>
      </div>

      {/* 项目基本信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="项目信息" 
          />
          
          {/* 项目信息部分 - 更紧凑的布局 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectTitle" className="text-slate-800">项目名称</Label>
              <Input 
                id="projectTitle" 
                value={formData.projectTitle} 
                onChange={(e) => updateFormData("projectTitle", e.target.value)} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="animalType" className="text-slate-800">动物种类</Label>
              <Input
                id="animalType"
                value={formData.animalType}
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalCount" className="text-slate-800">动物数量</Label>
              <Input 
                id="animalCount" 
                value={formData.animalCount} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facilityUnit" className="text-slate-800">动物实施设备单位</Label>
              <Input 
                id="facilityUnit" 
                value={formData.facilityUnit} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaderName" className="text-slate-800">负责人名称</Label>
              <Input 
                id="leaderName" 
                value={formData.leaderName} 
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-slate-800">所属单位</Label>
              <Input 
                id="department" 
                value={formData.department}
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ethicsCommittee" className="text-slate-800">伦理委员会</Label>
              <Input 
                id="ethicsCommittee" 
                value={formData.ethicsCommittee}
                className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium" 
                disabled
              />
            </div>
            <div className="space-y-2">
              {/* 留空，保持布局对称 */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 送审文件信息 */}
      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6 space-y-6">
          <SectionTitle 
            icon={<FileTextIcon className="h-5 w-5" />} 
            title="送审文件信息" 
          />

          <div className="space-y-4">
            
            {/* 送审文件清单 */}
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              {/* 表格 */}
              <table className="w-full min-w-[1100px] border-collapse text-sm">
                {/* 表头 */}
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left font-medium text-slate-700 border-b border-gray-200 min-w-[200px] w-[20%]">文件名称</th>
                    <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200 w-[10%]">格式</th>
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[8%]">必填</th>
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[8%]">数量</th>
                    <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200 w-[10%]">文件类型</th>
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">模板</th>
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">上传</th>
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[12%]">版本日期</th>
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[12%]">版本号</th>
                  </tr>
                </thead>
                
                {/* 表格内容 */}
                <tbody>
                  {fileList.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-3 px-4 align-top border-b border-gray-200">
                        <div className="font-medium text-slate-800">{item.fileName}</div>
                        {/* 已上传文件列表 - 移到文件名称下方 */}
                        {item.files.length > 0 && (
                          <div className="mt-1.5 space-y-1">
                            {item.files.map((file, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs py-0.5 pl-1 pr-0.5 rounded bg-blue-50 border border-blue-100">
                                <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                <span 
                                  className="truncate flex-1 text-blue-700 cursor-pointer hover:underline"
                                  onClick={() => handlePreviewFile(file)}
                                >
                                  {file.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
                                  onClick={() => handleDeleteFile(item.id, index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 border-b border-gray-200">{item.format}</td>
                      <td className="py-3 px-3 text-center border-b border-gray-200">
                        {item.required ? 
                          <span className="inline-block w-16 h-6 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 whitespace-nowrap leading-6">
                            必填
                          </span> : 
                          <span className="inline-block w-16 h-6 px-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 whitespace-nowrap leading-6">
                            选填
                          </span>
                        }
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 border-b border-gray-200">{item.quantity}</td>
                      <td className="py-3 px-3 text-slate-600 border-b border-gray-200 whitespace-nowrap">{item.fileType}</td>
                      
                      {/* 模板下载 */}
                      <td className="py-3 px-3 text-center border-b border-gray-200">
                        {item.hasTemplate ? (
                          <Button 
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3"
                            onClick={() => downloadTemplate(item.templateUrl, `${item.fileName}_模板.docx`)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            下载
                          </Button>
                        ) : (
                          <span className="text-slate-400 text-xs">无</span>
                        )}
                      </td>
                      
                      {/* 文件上传部分 */}
                      <td className="py-3 px-3 text-center border-b border-gray-200">
                        <Input
                          type="file"
                          id={`file-upload-${item.id}`}
                          className="hidden"
                          onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files)}
                          multiple={item.quantity === "不限制"}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs w-28 bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                        >
                          <UploadIcon className="h-3 w-3 mr-1" />
                          {item.quantity === "不限制" ? "批量上传" : "上传"}
                        </Button>
                      </td>
                      
                      {/* 版本日期 */}
                      <td className="py-3 px-3 text-center border-b border-gray-200">
                        <Input
                          type="date"
                          value={item.versionDate}
                          onChange={(e) => handleVersionChange(item.id, 'versionDate', e.target.value)}
                          className="h-8 text-xs w-full border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                        />
                      </td>
                      
                      {/* 版本号 */}
                      <td className="py-3 px-3 text-center border-b border-gray-200">
                        <Input
                          id={`version-number-${item.id}`}
                          type="text"
                          value={item.versionNumber || ""}
                          onChange={(e) => handleVersionChange(item.id, 'versionNumber', e.target.value)}
                          placeholder="如: V1.0"
                          className="h-8 text-xs w-full border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 底部操作按钮 */}
      <div className="flex justify-between items-center pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSaveDraft} 
          className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        >
          保存草稿
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReturnToList} 
            className="border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
          >
            取消
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
          >
            确认
          </Button>
        </div>
      </div>

      {/* 表单预览对话框 */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-lg border border-[#E9ECF2] p-0">
          <DialogHeader className="px-6 py-4 border-b bg-blue-50/50">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold leading-none tracking-tight text-blue-700">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              审查表单预览
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-1.5">
              请确认以下信息无误，确认后将提交审查申请
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-6">
            {/* 项目信息预览 */}
            <div className="space-y-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                  项目基本信息
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">项目名称</p>
                  <p className="text-sm font-medium text-slate-800">{formData.projectTitle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">动物种类</p>
                  <p className="text-sm font-medium text-slate-800">{formData.animalType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">动物数量</p>
                  <p className="text-sm font-medium text-slate-800">{formData.animalCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">动物实施设备单位</p>
                  <p className="text-sm font-medium text-slate-800">{formData.facilityUnit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">负责人名称</p>
                  <p className="text-sm font-medium text-slate-800">{formData.leaderName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">所属单位</p>
                  <p className="text-sm font-medium text-slate-800">{formData.department}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-slate-500">伦理委员会</p>
                  <p className="text-sm font-medium text-slate-800">{formData.ethicsCommittee}</p>
                </div>
              </div>
            </div>

            {/* 送审文件预览 */}
            <div className="space-y-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                  送审文件信息
                </h3>
              </div>
              
              <div className="px-4 py-3 space-y-4">
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200 w-[25%]">文件名称</th>
                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">必填</th>
                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%] whitespace-nowrap">数量</th>
                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[15%] whitespace-nowrap">文件类型</th>
                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[20%]">已上传</th>
                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[20%]">版本信息</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fileList.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-3 border-b border-gray-200 font-medium">{item.fileName}</td>
                          <td className="py-2 px-3 text-center border-b border-gray-200">
                            {item.required ? 
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">必填</span> : 
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">选填</span>
                            }
                          </td>
                          <td className="py-2 px-3 text-center border-b border-gray-200 whitespace-nowrap">{item.quantity}</td>
                          <td className="py-2 px-3 text-center border-b border-gray-200 whitespace-nowrap">{item.fileType}</td>
                          <td className="py-2 px-3 text-center border-b border-gray-200">
                            {item.files.length > 0 ? 
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {item.files.length}个文件
                              </span> : 
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                未上传
                              </span>
                            }
                          </td>
                          <td className="py-2 px-3 text-center border-b border-gray-200">
                            {item.versionDate || item.versionNumber ? 
                              <div className="text-xs">
                                {item.versionDate && <span className="text-slate-600">{item.versionDate}</span>}
                                {item.versionDate && item.versionNumber && <span className="mx-1">|</span>}
                                {item.versionNumber && <span className="font-medium text-slate-800">{item.versionNumber}</span>}
                              </div> : 
                              <span className="text-gray-400">-</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 已上传文件详情 */}
                <div>
                  <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    已上传文件详情
                  </h4>
                  
                  <div className="border border-gray-200 rounded-md bg-gray-50 divide-y divide-gray-200">
                    {fileList.some(item => item.files.length > 0) ? (
                      fileList.map(item => 
                        item.files.length > 0 && (
                          <div key={item.id} className="px-3 py-2">
                            <div className="font-medium text-xs text-slate-700 mb-1.5">
                              {item.fileName}
                            </div>
                            <div className="space-y-1">
                              {item.files.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs pl-2">
                                  <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span className="text-slate-600 truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-slate-500 ml-auto whitespace-nowrap">
                                    {(file.size / 1024).toFixed(1)}KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="p-4 text-center">
                        <div className="text-xs text-gray-500 flex flex-col items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-400 mb-1" />
                          暂无已上传文件
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 警告信息 */}
            <div className="text-amber-700 bg-amber-50 p-4 rounded-md text-sm flex items-start gap-3 border border-amber-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">请确认以上信息无误</p>
                <p className="text-xs mt-1.5 text-amber-600 leading-relaxed">
                  提交后，伦理委员会将对送审文件进行形式审查，您可能需要根据审查意见进行修改和补充。确认提交代表您同意遵守相关伦理审查规定。
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowPreviewDialog(false)}
              className="border-gray-300 hover:bg-gray-100 text-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回修改
            </Button>
            <Button 
              type="button"
              onClick={handleConfirmSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              确认无误，提交审查
              <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 完成对话框 */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border border-[#E9ECF2]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              审查创建成功
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              动物伦理项目初始审查已成功创建并提交。您可以继续添加新审查或返回项目列表。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              className="sm:mr-auto border-[#E9ECF2] hover:bg-slate-50 rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" 
              type="button"
              onClick={handleReturnToList}
            >
              返回列表
            </Button>
            <Button 
              type="button"
              onClick={handleContinueAdding}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              继续添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 文件预览对话框 */}
      {previewFile && (
        <Dialog open={!!previewFile} onOpenChange={() => closePreview()}>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg font-medium">
                文件预览: {previewFile.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-0 overflow-auto max-h-[calc(80vh-120px)]">
              {previewFile.type.includes('image') ? (
                <div className="flex justify-center p-4">
                  <img 
                    src={previewFile.url} 
                    alt={previewFile.name} 
                    className="max-w-full max-h-[600px] object-contain"
                  />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">无法直接预览此类型的文件</p>
                  <p className="text-sm text-gray-500 mt-2 mb-4">
                    Office文档(Word、Excel等)和其他格式文件需要下载后查看<br />
                    您也可以使用第三方文档预览服务查看此类文件
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = previewFile.url;
                        a.download = previewFile.name;
                        a.click();
                      }}
                    >
                      下载文件
                    </Button>
                    
                    {/* 对于Office文档，提供在线预览选项 */}
                    {['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(previewFile.extension) && (
                      <Button 
                        type="button"
                        variant="default"
                        className="bg-blue-600"
                        onClick={() => {
                          // 这里可以集成在线Office文档预览服务
                          // 例如Microsoft Office在线查看器或Google文档查看器
                          // 下面是Google文档查看器的示例(仅供参考，实际使用时需要完整URL)
                          const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + previewFile.url)}&embedded=true`;
                          window.open(googleViewerUrl, '_blank');
                        }}
                      >
                        在线预览
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="p-4 border-t">
              <Button type="button" onClick={closePreview}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 