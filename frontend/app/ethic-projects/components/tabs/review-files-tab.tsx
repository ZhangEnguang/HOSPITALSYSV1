"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatePresence, motion } from "framer-motion"
import { 
  Download, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Calendar,
  AlertCircle,
  Search,
  File,
  ImageIcon,
  FileSpreadsheetIcon,
  Archive,
  CalendarIcon,
  Filter,
  CheckCircle,
  Clock,
  X,
  Info,
  UploadCloud,
  ArrowUpDown,
  Check
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
      color = "bg-green-100 text-green-800 border border-green-200"
      icon = <CheckCircle className="h-3 w-3 mr-1" />
      break
    case "审核中":
      color = "bg-blue-100 text-blue-800 border border-blue-200"
      icon = <Clock className="h-3 w-3 mr-1" />
      break
    case "已驳回":
      color = "bg-red-100 text-red-800 border border-red-200"
      icon = <AlertCircle className="h-3 w-3 mr-1" />
      break
    default:
      color = "bg-gray-100 text-gray-800 border border-gray-200"
  }
  
  return (
    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-md inline-flex items-center ${color}`}>
      {icon}
      {status}
    </span>
  )
}

// 高亮搜索文本
const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span key={index} className="bg-yellow-100 text-yellow-800 px-0.5 rounded">{part}</span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  )
}

// 单个文件行组件
const FileRow = ({ file, searchTerm }: { file: any, searchTerm: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div 
      className="flex items-center justify-between py-3.5 px-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      transition={{ duration: 0.2 }}
      whileHover={{ backgroundColor: "#f9fafb" }}
    >
      <div className="flex items-center">
        {getFileIcon(file.fileType)}
        <div className="ml-3">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-800">
              <HighlightText text={file.fileName} highlight={searchTerm} />
            </h3>
            <FileStatusBadge status={file.status} />
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{file.fileSize}</span>
            <span className="mx-2">·</span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {file.uploadDate}
            </span>
            <span className="mx-2">·</span>
            <span>{file.reviewType}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button 
                className="p-1.5 rounded hover:bg-blue-50 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>预览文件</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button 
                className="p-1.5 rounded hover:bg-blue-50 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>下载文件</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}

// 文件批次组件 - 用于显示同一组送审文件
const FileBatch = ({ title, date, files, searchTerm }: { title: string, date: string, files: any[], searchTerm: string }) => {
  const [expanded, setExpanded] = useState(true)
  
  // 过滤文件
  const filteredFiles = files.filter(file => 
    searchTerm === '' || 
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  if (filteredFiles.length === 0) return null
  
  // 自动计算文件状态统计
  const fileStats = {
    total: filteredFiles.length,
    reviewed: filteredFiles.filter(f => f.status === "已审核" || f.status === "已通过").length,
    inProgress: filteredFiles.filter(f => f.status === "审核中").length,
    rejected: filteredFiles.filter(f => f.status === "已驳回").length
  }
  
  return (
    <div className="mb-4">
      <motion.div 
        className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border shadow-sm"
        whileHover={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center flex-wrap">
          <CalendarIcon className="h-4.5 w-4.5 text-gray-500 mr-2.5" />
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <span className="ml-2 text-xs text-gray-500">{date}</span>
          
          {/* 文件状态统计 */}
          <div className="ml-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-white text-gray-600 border-gray-200">
              总计: {fileStats.total}
            </Badge>
            {fileStats.reviewed > 0 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                已审核: {fileStats.reviewed}
              </Badge>
            )}
            {fileStats.inProgress > 0 && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                审核中: {fileStats.inProgress}
              </Badge>
            )}
            {fileStats.rejected > 0 && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                已驳回: {fileStats.rejected}
              </Badge>
            )}
          </div>
        </div>
        <motion.button 
          onClick={() => setExpanded(prev => !prev)}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={expanded ? "收起详情" : "展开详情"}
        >
          {expanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </motion.button>
      </motion.div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="mt-1 bg-white rounded-lg border overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredFiles.map((file, index) => (
              <FileRow key={index} file={file} searchTerm={searchTerm} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 送审文件页签组件
export default function ReviewFilesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [fileTypeFilter, setFileTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("date-desc") // 默认按上传日期降序排序
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>([])
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([])
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isStatusFilterMenuOpen, setIsStatusFilterMenuOpen] = useState(false)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  
  // 菜单引用
  const fileTypeMenuRef = useRef<HTMLDivElement>(null)
  const statusMenuRef = useRef<HTMLDivElement>(null)
  const sortMenuRef = useRef<HTMLDivElement>(null)
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fileTypeMenuRef.current && 
        !fileTypeMenuRef.current.contains(event.target as Node) && 
        isFilterMenuOpen
      ) {
        setIsFilterMenuOpen(false)
      }
      
      if (
        statusMenuRef.current && 
        !statusMenuRef.current.contains(event.target as Node) && 
        isStatusFilterMenuOpen
      ) {
        setIsStatusFilterMenuOpen(false)
      }
      
      if (
        sortMenuRef.current && 
        !sortMenuRef.current.contains(event.target as Node) && 
        isSortMenuOpen
      ) {
        setIsSortMenuOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterMenuOpen, isStatusFilterMenuOpen, isSortMenuOpen])
  
  // 模拟送审文件数据 - 初始审查
  const initialReviewFiles = {
    title: "初始审查送审文件",
    date: "2024-03-15",
    files: [
      {
        fileName: "实验动物伦理申请表.pdf",
        fileType: "pdf",
        fileSize: "2.3 MB",
        uploadDate: "2024-03-15",
        status: "已审核",
        reviewType: "伦理审查"
      },
      {
        fileName: "实验方案详细说明.docx",
        fileType: "word", 
        fileSize: "1.5 MB",
        uploadDate: "2024-03-15",
        status: "已审核",
        reviewType: "伦理审查"
      },
      {
        fileName: "过往相关研究成果.pdf",
        fileType: "pdf",
        fileSize: "4.7 MB", 
        uploadDate: "2024-03-15",
        status: "已审核",
        reviewType: "伦理审查"
      },
      {
        fileName: "试剂安全数据表.pdf",
        fileType: "pdf",
        fileSize: "1.8 MB",
        uploadDate: "2024-03-20",
        status: "审核中",
        reviewType: "安全审查"
      },
      {
        fileName: "危险物品处理规程.docx",
        fileType: "word",
        fileSize: "0.9 MB",
        uploadDate: "2024-03-20",
        status: "审核中",
        reviewType: "安全审查"
      }
    ]
  }
  
  // 模拟送审文件数据 - 复审
  const reReviewFiles = [
    {
      title: "第一次复审送审文件",
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
      title: "第二次复审送审文件",
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
  
  // 提取所有可用的文件类型和状态
  useEffect(() => {
    const allFiles = [
      ...initialReviewFiles.files,
      ...reReviewFiles.flatMap(batch => batch.files)
    ]
    
    const types = [...new Set(allFiles.map(file => file.fileType))]
    setAvailableFileTypes(types)
    
    const statuses = [...new Set(allFiles.map(file => file.status))]
    setAvailableStatuses(statuses)
  }, [])
  
  // 切换文件类型过滤器
  const toggleFileTypeFilter = (type: string) => {
    setFileTypeFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    )
  }
  
  // 切换状态过滤器
  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    )
  }
  
  // 获取排序文本描述
  const getSortText = (sortValue: string) => {
    switch (sortValue) {
      case "date-desc": return "上传日期(新→旧)"
      case "date-asc": return "上传日期(旧→新)"
      case "name-asc": return "文件名(A→Z)"
      case "name-desc": return "文件名(Z→A)"
      case "status": return "文件状态"
      default: return "上传日期(新→旧)"
    }
  }
  
  // 应用排序
  const applySort = (files: any[]) => {
    const sortedFiles = [...files]
    
    switch (sortBy) {
      case "date-desc":
        return sortedFiles.sort((a, b) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )
      case "date-asc":
        return sortedFiles.sort((a, b) => 
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        )
      case "name-asc":
        return sortedFiles.sort((a, b) => 
          a.fileName.localeCompare(b.fileName, 'zh-CN')
        )
      case "name-desc":
        return sortedFiles.sort((a, b) => 
          b.fileName.localeCompare(a.fileName, 'zh-CN')
        )
      case "status":
        // 按状态优先级排序：审核中 > 已驳回 > 已审核/已通过
        const statusPriority: Record<string, number> = {
          "审核中": 3,
          "已驳回": 2,
          "已审核": 1,
          "已通过": 1
        }
        return sortedFiles.sort((a, b) => 
          (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0)
        )
      default:
        return sortedFiles
    }
  }
  
  // 应用文件类型和状态过滤器
  const applyFilters = (files: any[]) => {
    const filtered = files.filter(file => 
      (searchTerm === '' || file.fileName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (fileTypeFilter.length === 0 || fileTypeFilter.includes(file.fileType)) &&
      (statusFilter.length === 0 || statusFilter.includes(file.status))
    )
    
    return applySort(filtered)
  }
  
  // 获取过滤后的初始审查文件
  const getFilteredInitialFiles = () => {
    return applyFilters(initialReviewFiles.files)
  }
  
  // 获取过滤后的复审文件
  const getFilteredReReviewFiles = () => {
    return reReviewFiles.map(batch => ({
      ...batch,
      files: applyFilters(batch.files)
    })).filter(batch => batch.files.length > 0)
  }

  // 统计数据
  const initialFilesCount = useMemo(() => getFilteredInitialFiles().length, [initialReviewFiles, searchTerm, fileTypeFilter, statusFilter, sortBy])
  const reReviewFilesCount = useMemo(() => getFilteredReReviewFiles().reduce((acc, batch) => acc + batch.files.length, 0), [reReviewFiles, searchTerm, fileTypeFilter, statusFilter, sortBy])
  const totalFilesCount = useMemo(() => initialFilesCount + reReviewFilesCount, [initialFilesCount, reReviewFilesCount])
  
  const hasActiveFilters = searchTerm || fileTypeFilter.length > 0 || statusFilter.length > 0
  
  // 获取活跃的过滤器描述
  const getActiveFilterDescription = () => {
    const filters = []
    if (searchTerm) filters.push(`搜索"${searchTerm}"`)
    if (fileTypeFilter.length > 0) filters.push(`${fileTypeFilter.length}个文件类型`)
    if (statusFilter.length > 0) filters.push(`${statusFilter.length}个状态`)
    if (sortBy !== "date-desc") filters.push(`排序: ${getSortText(sortBy)}`)
    
    if (filters.length === 0) return null
    return (
      <div className="flex items-center text-xs text-gray-500 gap-1 mt-1">
        <Info className="h-3 w-3" />
        <span>当前筛选条件：{filters.join('、')}</span>
        <Button 
          variant="link" 
          size="sm" 
          className="h-5 p-0 text-xs text-blue-600"
          onClick={clearAllFilters}
        >
          清除
        </Button>
      </div>
    )
  }
  
  // 清除所有筛选条件
  const clearAllFilters = () => {
    setSearchTerm("")
    setFileTypeFilter([])
    setStatusFilter([])
    setSortBy("date-desc")
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="initialReview" className="w-full">
        <div className="flex items-center justify-between bg-white border rounded-lg p-2 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <TabsList className="bg-transparent border-0 p-0">
              <TabsTrigger 
                value="initialReview" 
                className="rounded-md py-1.5 px-4 text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none text-gray-700"
              >
                初始审查
                {initialFilesCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 bg-blue-100 text-blue-800 border-none text-xs px-1.5">
                    {initialFilesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="reReview" 
                className="rounded-md py-1.5 px-4 text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none text-gray-700"
              >
                复审
                {reReviewFilesCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 bg-blue-100 text-blue-800 border-none text-xs px-1.5">
                    {reReviewFilesCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="border-l h-6 mx-1"></div>
            
            {/* 文件类型过滤器 */}
            <div className="relative" ref={fileTypeMenuRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1 text-xs bg-white border-gray-200"
                onClick={() => {
                  setIsFilterMenuOpen(!isFilterMenuOpen)
                  if (isStatusFilterMenuOpen) setIsStatusFilterMenuOpen(false)
                  if (isSortMenuOpen) setIsSortMenuOpen(false)
                }}
              >
                <Filter className="h-3.5 w-3.5 text-gray-500" />
                文件类型
                {fileTypeFilter.length > 0 && (
                  <Badge className="ml-1 bg-blue-500 text-white text-xs">{fileTypeFilter.length}</Badge>
                )}
              </Button>
              
              <AnimatePresence>
                {isFilterMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-10 top-full mt-1 left-0 w-48 bg-white border rounded-md shadow-lg"
                  >
                    <div className="p-2">
                      <div className="flex justify-between items-center pb-1 mb-1 border-b">
                        <span className="text-xs font-medium">选择文件类型</span>
                        {fileTypeFilter.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => setFileTypeFilter([])}
                          >
                            清除
                          </Button>
                        )}
                      </div>
                      {availableFileTypes.map(type => (
                        <div key={type} className="flex items-center p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            id={`filter-${type}`}
                            checked={fileTypeFilter.includes(type)}
                            onChange={() => toggleFileTypeFilter(type)}
                            className="mr-2"
                          />
                          <label htmlFor={`filter-${type}`} className="flex items-center cursor-pointer text-sm">
                            {getFileIcon(type)}
                            <span className="ml-2 capitalize">{type}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* 状态过滤器 */}
            <div className="relative" ref={statusMenuRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1 text-xs bg-white border-gray-200"
                onClick={() => {
                  setIsStatusFilterMenuOpen(!isStatusFilterMenuOpen)
                  if (isFilterMenuOpen) setIsFilterMenuOpen(false)
                  if (isSortMenuOpen) setIsSortMenuOpen(false)
                }}
              >
                <CheckCircle className="h-3.5 w-3.5 text-gray-500" />
                状态
                {statusFilter.length > 0 && (
                  <Badge className="ml-1 bg-blue-500 text-white text-xs">{statusFilter.length}</Badge>
                )}
              </Button>
              
              <AnimatePresence>
                {isStatusFilterMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-10 top-full mt-1 left-0 w-48 bg-white border rounded-md shadow-lg"
                  >
                    <div className="p-2">
                      <div className="flex justify-between items-center pb-1 mb-1 border-b">
                        <span className="text-xs font-medium">选择文件状态</span>
                        {statusFilter.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => setStatusFilter([])}
                          >
                            清除
                          </Button>
                        )}
                      </div>
                      {availableStatuses.map(status => (
                        <div key={status} className="flex items-center p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            id={`status-${status}`}
                            checked={statusFilter.includes(status)}
                            onChange={() => toggleStatusFilter(status)}
                            className="mr-2"
                          />
                          <label htmlFor={`status-${status}`} className="flex items-center cursor-pointer text-sm">
                            {status === "已审核" || status === "已通过" ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                            ) : status === "审核中" ? (
                              <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                            ) : status === "已驳回" ? (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-1.5" />
                            ) : null}
                            <span>{status}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* 排序选项 */}
            <div className="relative" ref={sortMenuRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1 text-xs bg-white border-gray-200"
                onClick={() => {
                  setIsSortMenuOpen(!isSortMenuOpen)
                  if (isFilterMenuOpen) setIsFilterMenuOpen(false)
                  if (isStatusFilterMenuOpen) setIsStatusFilterMenuOpen(false)
                }}
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                {getSortText(sortBy)}
              </Button>
              
              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-10 top-full mt-1 left-0 w-48 bg-white border rounded-md shadow-lg"
                  >
                    <div className="p-1">
                      {["date-desc", "date-asc", "name-asc", "name-desc", "status"].map((option) => (
                        <div 
                          key={option} 
                          className={`flex items-center p-1.5 hover:bg-gray-50 rounded cursor-pointer ${sortBy === option ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            setSortBy(option)
                            setIsSortMenuOpen(false)
                          }}
                        >
                          <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            {sortBy === option && <Check className="h-4 w-4 text-blue-500" />}
                          </div>
                          <span className="text-sm">{getSortText(option)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {getActiveFilterDescription()}
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              type="search"
              placeholder="搜索文件名..."
              className="pl-8 h-8 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        
        <TabsContent value="initialReview" className="mt-0 space-y-0">
          {getFilteredInitialFiles().length > 0 ? (
            <FileBatch 
              title={initialReviewFiles.title} 
              date={initialReviewFiles.date} 
              files={getFilteredInitialFiles()} 
              searchTerm={searchTerm}
            />
          ) : (
            <motion.div 
              className="text-center py-10 bg-white border rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {hasActiveFilters ? (
                <>
                  <AlertCircle className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">未找到匹配的初始审查文件</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="mt-2 text-blue-600"
                    onClick={clearAllFilters}
                  >
                    清除所有筛选条件
                  </Button>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-gray-600 font-medium">暂无初始审查文件</p>
                  <p className="text-gray-500 text-sm mt-1">您可以上传新的审查文件</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <UploadCloud className="h-4 w-4 mr-1" />
                    上传文件
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="reReview" className="mt-0 space-y-0">
          {getFilteredReReviewFiles().length > 0 ? (
            getFilteredReReviewFiles().map((batch, index) => (
              <FileBatch 
                key={index} 
                title={batch.title} 
                date={batch.date} 
                files={batch.files} 
                searchTerm={searchTerm}
              />
            ))
          ) : (
            <motion.div 
              className="text-center py-10 bg-white border rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {hasActiveFilters ? (
                <>
                  <AlertCircle className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">未找到匹配的复审文件</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="mt-2 text-blue-600"
                    onClick={clearAllFilters}
                  >
                    清除所有筛选条件
                  </Button>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-gray-600 font-medium">{reReviewFiles.length === 0 ? "暂无复审记录" : "暂无符合条件的复审文件"}</p>
                  <p className="text-gray-500 text-sm mt-1">您可以上传新的复审文件</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <UploadCloud className="h-4 w-4 mr-1" />
                    上传文件
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}