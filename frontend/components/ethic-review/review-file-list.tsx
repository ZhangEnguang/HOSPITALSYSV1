"use client"

import { useState } from "react"
import { FileTextIcon, UploadIcon, FileText, Trash2, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

// 送审文件字段类型
export type ReviewFileItem = {
  id: number;
  fileName: string;
  format: string;
  required: boolean;
  quantity: string;
  fileType: string;
  files: File[];
  versionDate: string;
  versionNumber: string;
  hasTemplate: boolean;
  templateUrl: string;
  aiModified?: boolean; // 是否经过AI修复
}

// 文件预览类型
type FilePreview = {
  url: string;
  name: string;
  type: string;
  extension: string;
  previewable: boolean;
} | null;

// 自定义标题组件
const SectionTitle = ({ 
  icon, 
  title, 
  rightElement 
}: { 
  icon: React.ReactNode, 
  title: string,
  rightElement?: React.ReactNode 
}) => {
  return (
    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md mb-4">
      <div className="flex items-center gap-2">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
      </div>
      {rightElement && (
        <div>
          {rightElement}
        </div>
      )}
    </div>
  )
}

// 送审文件列表组件
export function ReviewFileList({
  title = "送审文件信息",
  fileList,
  onChange,
  onAIReview,
  relatedProject,
  onDownloadOriginal
}: {
  title?: string;
  fileList: ReviewFileItem[];
  onChange?: (newFileList: ReviewFileItem[]) => void;
  onAIReview?: () => void;
  relatedProject?: any;
  onDownloadOriginal?: (fileName: string) => void;
}) {
  // 文件预览状态
  const [previewFile, setPreviewFile] = useState<FilePreview>(null);

  // 检查文件列表中是否有已上传的文件
  const hasUploadedFiles = (): boolean => {
    return fileList.some(item => item.files && item.files.length > 0);
  };

  // AI形式审查按钮点击处理
  const handleAIReviewClick = () => {
    if (!hasUploadedFiles()) {
      // 如果没有上传文件，显示提示
      toast({
        title: "无法启动审查",
        description: "请先上传至少一个文件才能使用AI形式审查功能",
        variant: "destructive"
      });
      return;
    }
    
    // 有文件时，直接调用回调函数，不显示toast提示
    if (onAIReview) {
      onAIReview();
    }
  };

  // AI形式审查按钮
  const aiReviewButton = onAIReview && (
    <Button 
      onClick={handleAIReviewClick} 
      variant="outline"
      className="border-blue-300 text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all duration-300"
      size="sm"
    >
      <svg 
        viewBox="0 0 24 24" 
        width="16" 
        height="16" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mr-1.5"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        <path d="M13.5 1.5 12 3l1.5 1.5"></path>
        <path d="M21 14v3a2 2 0 0 1-2 2h-1"></path>
        <path d="M12 17v3a2 2 0 0 0 2 2h1"></path>
      </svg>
      AI形式审查
    </Button>
  );

  // 处理文件上传
  const handleFileUpload = (id: number, files: FileList) => {
    if (files.length === 0) return

    const newFileList = fileList.map(item => {
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
    
    if (onChange) {
      onChange(newFileList);
    }
  }

  // 删除已上传的文件
  const handleDeleteFile = (itemId: number, fileIndex: number) => {
    const newFileList = fileList.map(item => {
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
    
    if (onChange) {
      onChange(newFileList);
    }
  }

  // 更新版本信息
  const handleVersionChange = (id: number, field: 'versionDate' | 'versionNumber', value: string) => {
    const newFileList = fileList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    
    if (onChange) {
      onChange(newFileList);
    }
  }

  // 下载模板文件
  const downloadTemplate = (templateUrl: string, fileName: string) => {
    // 在实际环境中，这里应该是从服务器下载文件
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

  return (
    <Card className="border-[#E9ECF2] shadow-sm">
      <style jsx>{`
        .file-table-container::-webkit-scrollbar {
          height: 8px;
        }
        .file-table-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .file-table-container::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        .file-table-container::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
      <CardContent className="p-6 space-y-6">
        <SectionTitle 
          icon={<FileTextIcon className="h-5 w-5" />} 
          title={title}
          rightElement={aiReviewButton}
        />

        <div className="space-y-4">
          {/* 送审文件清单 */}
          <div className="file-table-container overflow-x-auto border border-gray-200 rounded-md" style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
          }}>
            {/* 表格 */}
            <table className="w-full min-w-[1100px] border-collapse text-sm">
              {/* 表头 */}
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left font-medium text-slate-700 border-b border-gray-200 min-w-[200px] w-[18%]">文件名称</th>
                  <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200 w-[8%]">格式</th>
                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[6%]">必填</th>
                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[6%]">数量</th>
                  <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200 w-[8%]">文件类型</th>
                  {relatedProject && (
                    <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[12%]">原文件</th>
                  )}
                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[8%]">模板</th>
                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">上传</th>
                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">版本日期</th>
                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">版本号</th>
                </tr>
              </thead>
              
              {/* 表格内容 */}
              <tbody>
                {fileList.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors ${
                      item.aiModified ? 'border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <td className="py-3 px-4 align-top border-b border-gray-200">
                      <div className="font-medium text-slate-800">
                        {item.fileName}
                      </div>
                      {/* 已上传文件列表 - 移到文件名称下方 */}
                      {item.files.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {item.files.map((file, index) => (
                            <div key={index} className={`flex items-center gap-1 text-xs py-0.5 pl-1 pr-0.5 rounded ${
                              item.aiModified ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-100'
                            }`}>
                              <FileText className={`h-3 w-3 ${item.aiModified ? 'text-green-500' : 'text-blue-500'} flex-shrink-0`} />
                              <span 
                                className={`truncate flex-1 ${
                                  item.aiModified ? 'text-green-700' : 'text-blue-700'
                                } cursor-pointer hover:underline`}
                                onClick={() => handlePreviewFile(file)}
                              >
                                {file.name}
                                {item.aiModified && (
                                  <span className="ml-1 inline-flex items-center rounded-full text-xs font-medium text-green-700">
                                    (已修复)
                                  </span>
                                )}
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
                    
                    {/* 原文件信息 - 仅在复审时显示 */}
                    {relatedProject && (
                      <td className="py-3 px-3 text-center border-b border-gray-200">
                        {(() => {
                          const originalFile = relatedProject.originalFiles?.find((orig: any) => orig.id === item.id);
                          if (originalFile) {
                            return (
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600">
                                  {originalFile.versionNumber}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-2"
                                  onClick={() => onDownloadOriginal && onDownloadOriginal(originalFile.fileName)}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  下载
                                </Button>
                              </div>
                            );
                          }
                          return (
                            <span className="text-slate-400 text-xs">无原文件</span>
                          );
                        })()}
                      </td>
                    )}
                    
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
    </Card>
  )
}

// 送审文件预览组件，用于预览对话框中显示
export function ReviewFilePreview({
  title = "送审文件信息",
  fileList
}: {
  title?: string;
  fileList: ReviewFileItem[];
}) {
  return (
    <div className="space-y-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <FileTextIcon className="h-4 w-4 text-blue-500" />
          {title}
        </h3>
      </div>
      
      <div className="px-4 py-3 space-y-4">
        {/* 送审文件表格 */}
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
                        <FileText className="h-3 w-3 mr-1" />
                        {item.files.length}个文件
                      </span> : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                        <FileText className="h-3 w-3 mr-1" />
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
  )
} 