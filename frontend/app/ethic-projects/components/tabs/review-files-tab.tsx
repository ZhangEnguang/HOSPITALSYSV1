"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Download, 
  FileText, 
  Eye,
  File,
  ImageIcon,
  FileSpreadsheetIcon,
  Archive,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"

// 获取文件图标
const getFileIcon = (fileType: string) => {
  switch (fileType?.toLowerCase()) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />
    case "word":
    case "doc":
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "excel":
    case "xls":
    case "xlsx":
      return <FileSpreadsheetIcon className="h-5 w-5 text-green-500" />
    case "jpg":
    case "jpeg":
    case "png":
      return <ImageIcon className="h-5 w-5 text-purple-500" />
    case "zip":
    case "rar":
      return <Archive className="h-5 w-5 text-amber-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

// 文件状态徽章组件
const FileStatusBadge = ({ status }: { status: string }) => {
  let color = ""
  let icon = null
  
  switch (status) {
    case "已通过":
    case "已审核":
      color = "text-green-700 border-green-200"
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />
      break
    case "审核中":
      color = "text-blue-700 border-blue-200"
      icon = <Clock className="h-3.5 w-3.5 mr-1" />
      break
    case "已驳回":
      color = "text-red-700 border-red-200"
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1" />
      break
    default:
      color = "text-gray-700 border-gray-200"
  }
  
  return (
    <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-md inline-flex items-center border ${color}`}>
      {icon}
      {status}
    </span>
  )
}

// 送审文件标签页组件
export default function ReviewFilesTab() {
  // 初始审查送审文件
  const initialSubmission = {
    title: "初始审查",
    date: "2024-06-20",
    files: [
      {
        fileName: "实验动物伦理申请表.pdf",
        fileType: "pdf",
        fileSize: "2.3 MB",
        uploadDate: "2024-06-20",
        status: "已审核",
        reviewType: "伦理审查"
      },
      {
        fileName: "实验方案详细说明.docx",
        fileType: "word", 
        fileSize: "1.5 MB",
        uploadDate: "2024-06-20",
        status: "已审核",
        reviewType: "伦理审查"
      }
    ]
  }
  
  // 复审送审文件
  const reSubmissions = [
    {
      title: "第一次复审",
      date: "2024-06-20",
      files: [
        {
          fileName: "实验方案修订版.docx",
          fileType: "word",
          fileSize: "2.1 MB",
          uploadDate: "2024-06-20",
          status: "已审核",
          reviewType: "伦理复审"
        },
        {
          fileName: "中期实验数据.xlsx",
          fileType: "excel",
          fileSize: "3.6 MB",
          uploadDate: "2024-06-20",
          status: "已审核",
          reviewType: "伦理复审"
        }
      ]
    },
    {
      title: "第二次复审",
      date: "2024-09-10",
      files: [
        {
          fileName: "实验结果分析报告.pdf",
          fileType: "pdf",
          fileSize: "5.2 MB",
          uploadDate: "2024-09-10",
          status: "审核中",
          reviewType: "伦理复审"
        },
        {
          fileName: "动物福利监测记录.xlsx",
          fileType: "excel",
          fileSize: "1.7 MB",
          uploadDate: "2024-09-10",
          status: "审核中",
          reviewType: "伦理复审"
        }
      ]
    }
  ]
  
  // 文件批次组件
  const FileSubmission = ({ title, date, files }: { title: string, date: string, files: any[] }) => {
    const [expanded, setExpanded] = useState(true);
    
    // 统计状态数量
    const statusCounts = {
      reviewed: files.filter(f => f.status === "已审核" || f.status === "已通过").length,
      inProgress: files.filter(f => f.status === "审核中").length,
      rejected: files.filter(f => f.status === "已驳回").length
    };
    
    return (
      <Card className="mb-4 border border-slate-200 rounded-lg shadow-none">
        <CardHeader 
          className="py-3 px-4 bg-white border-b border-slate-200 flex flex-row justify-between items-center cursor-pointer rounded-t-lg"
          onClick={() => setExpanded(!expanded)}
        >
          <CardTitle className="text-base font-medium flex items-center">
            <Calendar className="h-4 w-4 text-slate-500 mr-2" />
            <span className="text-slate-800">{title}</span>
            <span className="ml-2 text-xs text-slate-500 font-normal border-l border-slate-200 pl-2">
              {date}
            </span>
            
            {/* 状态统计 */}
            <div className="ml-4 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs font-normal bg-white text-slate-600 border-slate-200 rounded-md">
                共 {files.length} 项
              </Badge>
              {statusCounts.reviewed > 0 && (
                <Badge variant="outline" className="text-xs font-normal text-green-700 border-green-200 rounded-md">
                  已审核: {statusCounts.reviewed}
                </Badge>
              )}
              {statusCounts.inProgress > 0 && (
                <Badge variant="outline" className="text-xs font-normal text-blue-700 border-blue-200 rounded-md">
                  审核中: {statusCounts.inProgress}
                </Badge>
              )}
            </div>
          </CardTitle>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-slate-500" 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </CardHeader>
        
        <div className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <CardContent className="p-0 rounded-b-lg overflow-hidden">
            <div className="divide-y divide-slate-100">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getFileIcon(file.fileType)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-slate-800">
                          {file.fileName}
                        </h3>
                        <FileStatusBadge status={file.status} />
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-1.5">
                        <span>{file.fileSize}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span>
                          {file.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">预览文件</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-50">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">下载文件</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题部分 */}

      
      {/* 文件组展示区域 */}
      <div className="space-y-5">
        <FileSubmission
          title={initialSubmission.title}
          date={initialSubmission.date}
          files={initialSubmission.files}
        />
        
        {reSubmissions.map((submission, index) => (
          <FileSubmission
            key={index}
            title={submission.title}
            date={submission.date}
            files={submission.files}
          />
        ))}
      </div>
    </div>
  )
}