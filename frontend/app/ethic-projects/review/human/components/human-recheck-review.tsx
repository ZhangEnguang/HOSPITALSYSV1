"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { ReviewFormBase } from "@/components/ethic-review/review-form-base"

import { ReviewFileList, ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Input } from "@/components/ui/input"
import { FileCheck2, FileText, Download, Eye, AlertTriangle } from "lucide-react"

// 审查记录数据类型
interface ReviewRecord {
  id: string
  projectTitle: string // 项目名称（固定不变）
  reviewType: string // 审查类型（初始审查、复审等）
  reviewResult: 'conditional' | 'negative' | 'approved' | 'pending'
  reviewResultText: string
  reviewComments: string
  submitDate: string
  decisionDate: string
  originalFiles: ReviewFileItem[]
}

// 验证结果类型
interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// 默认项目数据
const DEFAULT_PROJECT_DATA = {
  projectTitle: "多人群样本基因调制与健康风险预测",
  studyType: "前瞻性随机对照试验",
  participantCount: "200",
  facilityUnit: "临床研究中心",
  leaderName: "李教授",
  department: "心内科",
  ethicsCommittee: "北京医学伦理审查委员会"
}

// 模拟该项目的历史审查记录（可用于复审的记录）
const getMockReviewRecords = (projectTitle: string): ReviewRecord[] => [
  {
    id: "review-001",
    projectTitle: projectTitle, // 项目名称动态获取
    reviewType: "偏离方案审查",
    reviewResult: "conditional",
    reviewResultText: "必要的修改后同意",
    reviewComments: "研究中发现的方案偏离情况需要进一步说明和纠正措施。偏离的合理性论证不充分，需要补充详细的偏离原因分析和对研究结果的影响评估。建议建立更严格的质量控制流程以避免类似偏离。",
    submitDate: "2024-01-15",
    decisionDate: "2024-01-25",
    originalFiles: [
      {
        id: 1,
        fileName: "偏离方案报告表",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "偏离报告",
        files: [],
        versionDate: "2024-01-15",
        versionNumber: "V1.0",
        hasTemplate: true,
        templateUrl: "/templates/protocol-deviation-report.docx"
      },
      {
        id: 2,
        fileName: "偏离原因说明",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "说明文件",
        files: [],
        versionDate: "2024-01-15",
        versionNumber: "V1.0",
        hasTemplate: false,
        templateUrl: ""
      }
    ]
  },
  {
    id: "review-002",
    projectTitle: projectTitle, // 项目名称动态获取
    reviewType: "修正案审查",
    reviewResult: "negative",
    reviewResultText: "不同意",
    reviewComments: "提交的修正案内容不符合伦理审查要求，修改内容涉及重大风险增加但未提供充分的科学依据和安全性保障。建议重新评估修正案的必要性和可行性，并提供更详细的风险控制措施。",
    submitDate: "2024-01-08",
    decisionDate: "2024-01-18",
    originalFiles: [
      {
        id: 1,
        fileName: "修正案申请表",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "申请表",
        files: [],
        versionDate: "2024-01-08",
        versionNumber: "V1.0",
        hasTemplate: true,
        templateUrl: "/templates/amendment-application-form.docx"
      },
      {
        id: 2,
        fileName: "修正案说明书",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "说明文件",
        files: [],
        versionDate: "2024-01-08",
        versionNumber: "V1.0",
        hasTemplate: false,
        templateUrl: ""
      }
    ]
  },
  {
    id: "review-003",
    projectTitle: projectTitle, // 项目名称动态获取
    reviewType: "修正案审查",
    reviewResult: "conditional",
    reviewResultText: "必要的修改后同意",
    reviewComments: "方案修正案中的受试者剂量调整需要进一步论证，建议提供更多安全性数据支持。知情同意书的修订版本需要突出新增风险的说明。",
    submitDate: "2024-02-10",
    decisionDate: "2024-02-20",
    originalFiles: [
      {
        id: 1,
        fileName: "修正案申请表",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "申请表",
        files: [],
        versionDate: "2024-02-10",
        versionNumber: "V1.0",
        hasTemplate: true,
        templateUrl: "/templates/amendment-application-form.docx"
      },
      {
        id: 2,
        fileName: "修订研究方案",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "研究方案",
        files: [],
        versionDate: "2024-02-10",
        versionNumber: "V2.0",
        hasTemplate: false,
        templateUrl: ""
      }
    ]
  },
  {
    id: "review-004",
    projectTitle: projectTitle, // 项目名称动态获取
    reviewType: "年度/定期审查",
    reviewResult: "negative",
    reviewResultText: "不同意",
    reviewComments: "年度审查发现研究执行过程中存在严重偏离方案的情况，受试者入组标准执行不严格，数据完整性存在问题。建议暂停研究并完善质量控制措施。",
    submitDate: "2024-03-05",
    decisionDate: "2024-03-15",
    originalFiles: [
      {
        id: 1,
        fileName: "年度报告",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "年度报告",
        files: [],
        versionDate: "2024-03-05",
        versionNumber: "V1.0",
        hasTemplate: true,
        templateUrl: "/templates/annual-report-template.docx"
      }
    ]
  },
  {
    id: "review-005",
    projectTitle: projectTitle, // 项目名称动态获取
    reviewType: "安全性审查",
    reviewResult: "conditional",
    reviewResultText: "必要的修改后同意",
    reviewComments: "安全性数据分析显示需要调整受试者监护频率，建议增加心电图监测频次。同时需要更新研究者手册中的安全性信息，并重新培训研究团队。",
    submitDate: "2024-03-20",
    decisionDate: "2024-03-28",
    originalFiles: [
      {
        id: 1,
        fileName: "安全性报告",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "安全性报告",
        files: [],
        versionDate: "2024-03-20",
        versionNumber: "V1.0",
        hasTemplate: true,
        templateUrl: "/templates/safety-report-template.docx"
      }
    ]
  },
  {
    id: "review-006",
    projectTitle: projectTitle, // 项目名称动态获取
    reviewType: "严重不良事件报告",
    reviewResult: "conditional",
    reviewResultText: "必要的修改后同意",
    reviewComments: "严重不良事件报告完整，但需要进一步分析事件与研究药物的因果关系。建议补充详细的时间轴分析和既往类似事件的文献回顾。",
    submitDate: "2024-04-02",
    decisionDate: "2024-04-08",
    originalFiles: [
      {
        id: 1,
        fileName: "严重不良事件报告表",
        format: "PDF/Word",
        required: true,
        quantity: "1",
        fileType: "不良事件报告",
        files: [],
        versionDate: "2024-04-02",
        versionNumber: "V1.0",
        hasTemplate: true,
        templateUrl: "/templates/sae-report-template.docx"
      }
    ]
  }
]

// 人体伦理复审表单组件
export function HumanRecheckReview({
  projectData: initialProjectData = DEFAULT_PROJECT_DATA
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 用于管理项目数据的状态
  const [projectData, setProjectData] = useState(initialProjectData)
  
  // 复审相关状态
  const [relatedReviewId, setRelatedReviewId] = useState<string | null>(null)
  const [relatedReview, setRelatedReview] = useState<ReviewRecord | null>(null)
  const [reviewRecords, setReviewRecords] = useState<ReviewRecord[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)
  const [filters, setFilters] = useState({
    resultType: 'all', // all, conditional, negative
    timeRange: 'all', // all, recent, lastMonth, lastYear
  })
  
  // 初始化审查记录列表
  useEffect(() => {
    // 模拟获取该项目的历史审查记录
    setReviewRecords(getMockReviewRecords(projectData.projectTitle))
  }, [projectData.projectTitle])

  // 点击外部关闭高级筛选
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAdvancedFilter && !(event.target as Element).closest('.advanced-filter-container')) {
        setShowAdvancedFilter(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showAdvancedFilter])

  // 从URL参数中获取项目ID和其他信息，并更新项目数据
  useEffect(() => {
    if (searchParams) {
      const projectId = searchParams.get('projectId')
      const studyType = searchParams.get('studyType')
      const participantCount = searchParams.get('participantCount')
      const facilityUnit = searchParams.get('facilityUnit')
      const ethicsCommittee = searchParams.get('ethicsCommittee')
      
      if (projectId) {
        // 更新项目数据
        setProjectData(prev => ({
          ...prev,
          projectTitle: decodeURIComponent(projectId),
          // 如果有其他参数则更新，否则保持默认值
          ...(studyType && { studyType: decodeURIComponent(studyType) }),
          ...(participantCount && { participantCount: decodeURIComponent(participantCount) }),
          ...(facilityUnit && { facilityUnit: decodeURIComponent(facilityUnit) }),
          ...(ethicsCommittee && { ethicsCommittee: decodeURIComponent(ethicsCommittee) }),
        }))
      }
    }
  }, [searchParams])

  // 重置分页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, filters.resultType, filters.timeRange])

  // 处理审查记录选择
  const handleReviewSelect = (reviewId: string) => {
    const review = reviewRecords.find(r => r.id === reviewId)
    if (review) {
      setRelatedReviewId(reviewId)
      setRelatedReview(review)
      
      // 项目信息保持不变（因为是同一个项目的不同审查记录）
      // 不需要更新projectData，因为项目基本信息是固定的
    }
  }

  // 下载原文件
  const handleDownloadOriginalFile = (fileName: string) => {
    // 模拟文件下载
    toast({
      title: "下载开始",
      description: `正在下载文件：${fileName}`
    })
  }

  // 验证提交条件
  const validateSubmission = (): ValidationResult => {
    const errors: string[] = []
    
    // 1. 验证是否关联了审查记录
    if (!relatedReviewId) {
      errors.push('请选择要复审的审查记录')
    }
    
    // 2. 验证关联审查记录的审查结果
    if (relatedReview && !['conditional', 'negative'].includes(relatedReview.reviewResult)) {
      errors.push('所选审查记录的审查结果不符合复审条件')
    }
    
    // 3. 验证必填文件
    const requiredFiles = reviewFiles.filter(f => f.required)
    for (const file of requiredFiles) {
      if (!file.files || file.files.length === 0) {
        errors.push(`请上传必填文件：${file.fileName}`)
      }
    }
    
    // 4. 如果是条件性决定，验证是否上传了修改后的文件
    if (relatedReview?.reviewResult === 'conditional') {
      const hasModifiedFiles = reviewFiles.some(file => 
        file.files && file.files.length > 0 && 
        relatedReview.originalFiles.some((orig: ReviewFileItem) => orig.id === file.id)
      )
      if (!hasModifiedFiles) {
        errors.push('条件性决定的审查记录必须上传修改后的文件')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // 人体伦理复审的送审文件清单
  const recheckReviewFiles: ReviewFileItem[] = [
    {
      id: 1,
      fileName: "人体伦理复审申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-ethics-recheck-form.docx"
    },
    {
      id: 2,
      fileName: "原始审查决定书",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "审查决定",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 3,
      fileName: "复审说明报告",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "复审报告",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/recheck-report-template.docx"
    },
    {
      id: 4,
      fileName: "项目进展报告",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "进展报告",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/progress-report-template.docx"
    },
    {
      id: 5,
      fileName: "修订的研究方案（如有）",
      format: "PDF/Word",
      required: false,
      quantity: "不限制",
      fileType: "研究方案",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 6,
      fileName: "修订的知情同意书（如有）",
      format: "PDF/Word",
      required: false,
      quantity: "不限制",
      fileType: "知情同意书",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-template.docx"
    },
    {
      id: 7,
      fileName: "其他支持性文件",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "其他",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ]

  // 管理送审文件清单状态
  const [reviewFiles, setReviewFiles] = useState(recheckReviewFiles)

  // 处理表单提交
  const handleSubmit = async (data: any) => {
    // 验证提交条件
    const validation = validateSubmission()
    
    if (!validation.isValid) {
      toast({
        title: "提交失败",
        description: validation.errors.join('\n'),
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 构建提交数据
      const submitData = {
        relatedReviewId,
        projectData,
        reviewFiles,
        submitDate: new Date().toISOString().split('T')[0]
      }
      
      console.log("提交人体伦理复审表单:", submitData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "提交成功",
        description: "人体伦理复审申请已提交，等待审查"
      })
      
      // 跳转回列表页面
      router.push("/ethic-projects/human")
      
    } catch (error) {
      toast({
        title: "提交失败",
        description: "网络错误，请重试",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 搜索历史记录管理
  const addSearchHistory = (query: string) => {
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]) // 保留最近5条
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
    if (value && value !== searchText) {
      addSearchHistory(value)
    }
  }

  // 文本高亮函数
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery) return text
    const regex = new RegExp(`(${searchQuery})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    )
  }

  // 关联审查记录选择器组件
  const RelatedReviewSelector = () => {
    // 高级过滤逻辑
    const applyFilters = (records: ReviewRecord[]) => {
      return records.filter(record => {
        // 结果类型筛选
        if (filters.resultType !== 'all') {
          if (filters.resultType === 'conditional' && record.reviewResult !== 'conditional') return false
          if (filters.resultType === 'negative' && record.reviewResult !== 'negative') return false
        }
        
        // 时间范围筛选
        if (filters.timeRange !== 'all') {
          const recordDate = new Date(record.decisionDate)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (filters.timeRange === 'recent' && diffDays > 30) return false
          if (filters.timeRange === 'lastMonth' && diffDays > 60) return false
          if (filters.timeRange === 'lastYear' && diffDays > 365) return false
        }
        
        return true
      })
    }

    // 过滤符合条件的审查记录
    const baseFilteredRecords = reviewRecords.filter(record => 
      ['conditional', 'negative'].includes(record.reviewResult)
    )
    
    const advancedFilteredRecords = applyFilters(baseFilteredRecords)
    
    const filteredRecords = advancedFilteredRecords.filter(record =>
      searchText === "" || 
      record.projectTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      record.reviewType.toLowerCase().includes(searchText.toLowerCase()) ||
      record.reviewResultText.toLowerCase().includes(searchText.toLowerCase())
    )

    // 分页逻辑
    const totalRecords = filteredRecords.length
    const totalPages = Math.ceil(totalRecords / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentPageRecords = filteredRecords.slice(startIndex, endIndex)

    // 获取审查结果的显示样式
    const getResultBadge = (result: string, resultText: string, highlightQuery = "") => {
      const content = result === 'conditional' ? '必要的修改后同意' : 
                     result === 'negative' ? '不同意' : resultText
      
      if (result === 'conditional') {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">
            {highlightText(content, highlightQuery)}
          </Badge>
        )
      } else if (result === 'negative') {
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">
            {highlightText(content, highlightQuery)}
          </Badge>
        )
      }
      return <span className="text-gray-600">{highlightText(resultText, highlightQuery)}</span>
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              关联审查记录
              <span className="text-red-500 ml-1">*</span>
            </h3>
            {relatedReviewId && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                已选中
              </Badge>
            )}
          </div>
          
          {/* 搜索框 */}
          <div className="relative">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索项目名称、审查类型或审查结果..."
                  className={`
                    px-3 py-2.5 pl-8 pr-10 border border-gray-300 rounded-l-md text-sm 
                    transition-all duration-300 ease-in-out h-10
                    ${searchText ? 'w-72' : 'w-52 focus:w-72'} 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  `}
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* 搜索历史下拉 */}
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                    <div className="py-1">
                      <div className="px-3 py-1 text-xs text-gray-500 border-b">搜索历史</div>
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchText(item)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                        >
                          <svg className="h-3 w-3 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 高级筛选按钮 */}
              <button
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className={`
                  px-3 py-2.5 border border-l-0 border-gray-300 rounded-r-md text-sm h-10
                  transition-colors duration-200 flex items-center justify-center
                  ${showAdvancedFilter ? 'bg-blue-50 text-blue-600 border-blue-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                `}
                title="高级筛选"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
              </button>
            </div>
            
            {/* 高级筛选面板 */}
            {showAdvancedFilter && (
              <div className="advanced-filter-container absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 p-4 min-w-80">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">高级筛选</h4>
                  <button
                    onClick={() => setFilters({ resultType: 'all', timeRange: 'all' })}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    清除筛选
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">审查结果</label>
                    <select
                      value={filters.resultType}
                      onChange={(e) => setFilters(prev => ({ ...prev, resultType: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="all">全部结果</option>
                      <option value="conditional">必要的修改后同意</option>
                      <option value="negative">不同意</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">时间范围</label>
                    <select
                      value={filters.timeRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="all">全部时间</option>
                      <option value="recent">最近30天</option>
                      <option value="lastMonth">最近60天</option>
                      <option value="lastYear">最近一年</option>
                    </select>
                  </div>
                </div>
                
                {/* 筛选结果统计 */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    找到 {filteredRecords.length} 条符合条件的记录
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 操作提示 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
            </svg>
            <span>请点击下方表格中的任意一行来选择需要复审的审查记录</span>
          </div>
          {!relatedReviewId && (
            <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>未选择</span>
            </div>
          )}
        </div>

        {/* 表格容器 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{width: '40%'}}>
                  项目名称
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{width: '15%'}}>
                  审查类型
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{width: '25%'}}>
                  审查结果
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{width: '20%'}}>
                  审查时间
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageRecords.length > 0 ? (
                currentPageRecords.map((record, index) => (
                  <tr 
                    key={record.id}
                    onClick={() => handleReviewSelect(record.id)}
                    className={`
                      border-b border-gray-100 cursor-pointer transition-all duration-200 group
                      ${relatedReviewId === record.id 
                        ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm' 
                        : 'hover:bg-blue-50 hover:shadow-md hover:border-l-2 hover:border-l-blue-300'
                      }
                      ${index === currentPageRecords.length - 1 ? 'border-b-0' : ''}
                    `}
                    role="button"
                    tabIndex={0}
                    title="点击选择此审查记录进行复审"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleReviewSelect(record.id)
                      }
                    }}
                  >
                    <td className="py-3 px-4 text-gray-900 font-medium" style={{width: '40%'}}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {relatedReviewId === record.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                          )}
                          <span className="truncate">{highlightText(record.projectTitle, searchText)}</span>
                        </div>
                        <div className="flex items-center ml-2">
                          {relatedReviewId === record.id ? (
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700" style={{width: '15%'}}>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                        {highlightText(record.reviewType, searchText)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4" style={{width: '25%'}}>
                      {getResultBadge(record.reviewResult, record.reviewResultText, searchText)}
                    </td>
                    <td className="py-3 px-4 text-gray-600" style={{width: '20%'}}>
                      <span className="text-sm">{record.decisionDate}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>暂无符合条件的审查记录</p>
                      {searchText && (
                        <button 
                          onClick={() => setSearchText("")}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          清除搜索条件
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-gray-600">
              显示第 {startIndex + 1}-{Math.min(endIndex, totalRecords)} 条，共 {totalRecords} 条记录
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                上一页
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-start mt-3 p-3 bg-amber-50 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            只能选择审查结果为"条件性决定（必要的修改后同意）"或"否定性决定（不同意、终止或暂停已经批准的临床研究）"的审查记录
          </p>
        </div>
      </div>
    )
  }

  // 选中审查记录的详细信息展示组件（合并项目信息和审查信息）
  const SelectedReviewDetails = () => {
    if (!relatedReview) return null
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <FileCheck2 className="mr-2 h-5 w-5 text-blue-600" />
          关联项目详细信息
        </h3>
        
        {/* 项目基本信息 */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <h4 className="text-base font-semibold text-gray-800">项目信息</h4>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">项目名称:</span>
                <span className="text-sm text-gray-900 font-medium">{projectData.projectTitle}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">研究类型:</span>
                <span className="text-sm text-gray-900">{projectData.studyType}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">受试者数量:</span>
                <span className="text-sm text-gray-900">{projectData.participantCount}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">研究执行单位:</span>
                <span className="text-sm text-gray-900">{projectData.facilityUnit}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">负责人:</span>
                <span className="text-sm text-gray-900">{projectData.leaderName}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">所属单位:</span>
                <span className="text-sm text-gray-900">{projectData.department}</span>
              </div>
              <div className="flex items-start col-span-2">
                <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 mt-0.5">伦理委员会:</span>
                <span className="text-sm text-gray-900">{projectData.ethicsCommittee}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 原审查信息 */}
        <div>
          <div className="flex items-center mb-4">
            <h4 className="text-base font-semibold text-gray-800">原审查信息</h4>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">审查类型</label>
                <p className="text-sm text-gray-900 font-medium">{relatedReview.reviewType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">审查结果</label>
                <Badge 
                  variant={relatedReview.reviewResult === 'conditional' ? 'secondary' : 'destructive'}
                  className={`px-3 py-1 text-xs font-medium ${
                    relatedReview.reviewResult === 'conditional' 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}
                >
                  {relatedReview.reviewResultText}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">审查时间</label>
                <p className="text-sm text-gray-900">{relatedReview.decisionDate}</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">审核意见</label>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-900 leading-relaxed">{relatedReview.reviewComments}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ReviewFormBase
      title="新增复审"
      returnPath="/ethic-projects/human"
      projectInfo={projectData}
      fileList={reviewFiles}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      {/* 关联审查记录选择器 */}
      <RelatedReviewSelector />
      
      {/* 选中审查记录的详细信息（项目信息+审查信息）*/}
      <SelectedReviewDetails />

      {/* 送审文件列表 */}
      {relatedReview ? (
        <ReviewFileList
          title="送审文件信息"
          fileList={reviewFiles}
          onChange={setReviewFiles}
          relatedProject={relatedReview}
          onDownloadOriginal={handleDownloadOriginalFile}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-gray-400" />
            送审文件信息
          </h3>
          
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">
              请先选择关联审查记录后，系统将自动加载对应的送审文件清单，您可以在此上传相关文件。
            </p>
          </div>
        </div>
      )}
    </ReviewFormBase>
  )
} 