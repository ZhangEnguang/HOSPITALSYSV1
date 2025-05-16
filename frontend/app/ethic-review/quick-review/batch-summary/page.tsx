"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, FileText, Download, Printer, Clock, AlertCircle, CheckCircle, ClipboardList, Share2, FileDown, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { quickReviewItems } from "../data/quick-review-demo-data"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function BatchSummaryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // 从URL参数中获取项目ID列表
  const ids = searchParams?.get("ids")?.split(",") || []
  
  // 状态管理
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [summarizing, setSummarizing] = useState(false)
  const [summaryReady, setSummaryReady] = useState(false)
  const [summaryType, setSummaryType] = useState("overall")
  const [exportFormat, setExportFormat] = useState("pdf")
  
  // 加载项目数据
  useEffect(() => {
    if (ids.length > 0) {
      const filteredProjects = quickReviewItems.filter(item => ids.includes(item.id))
      setProjects(filteredProjects)
    }
    setLoading(false)
  }, [ids])
  
  // 模拟生成汇总报告
  useEffect(() => {
    if (projects.length > 0 && !summaryReady) {
      setSummarizing(true)
      const timer = setTimeout(() => {
        setSummarizing(false)
        setSummaryReady(true)
      }, 2500)
      
      return () => clearTimeout(timer)
    }
  }, [projects, summaryReady])
  
  // 处理返回
  const handleBack = () => {
    router.back()
  }
  
  // 处理导出
  const handleExport = () => {
    toast({
      title: "报告导出中",
      description: `正在导出${exportFormat.toUpperCase()}格式的意见汇总报告...`,
    })
    
    setTimeout(() => {
      toast({
        title: "导出成功",
        description: "意见汇总报告已成功导出",
      })
    }, 1500)
  }
  
  // 处理打印
  const handlePrint = () => {
    toast({
      title: "准备打印",
      description: "正在准备打印意见汇总报告...",
    })
    
    setTimeout(() => {
      toast({
        title: "打印准备就绪",
        description: "请在打印对话框中确认打印设置",
      })
    }, 1000)
  }

  return (
    <div className="container py-6 max-w-[1200px]">
      {/* 面包屑导航 */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 p-0 h-auto font-normal hover:bg-transparent"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          返回快速审查
        </Button>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-slate-800">批量意见汇总</span>
      </div>
      
      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* 左侧项目列表 */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <div className="p-5 border-b bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">待汇总项目</h2>
                  <p className="text-xs text-slate-500 mt-0.5">已选择 {projects.length} 个项目进行意见汇总</p>
                </div>
              </div>
            </div>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
              {loading ? (
                <div className="h-64 flex items-center justify-center flex-1">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 h-full flex items-center justify-center">
                      <p>未选择任何项目</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {projects.map((project) => (
                        <div key={project.id} className="p-4 hover:bg-slate-50">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <span className="text-sm">{project.name.charAt(0)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-slate-800 truncate">{project.name}</div>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs">
                                  {project.projectSubType}
                                </Badge>
                                <span className="text-xs text-slate-500">{project.projectId}</span>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="text-xs text-slate-500">
                                  <span>项目负责人: {project.projectLeader?.name}</span>
                                </div>
                                <Badge className={
                                  project.reviewResult === "通过" 
                                    ? "bg-green-50 text-green-700 border-green-100" 
                                    : project.reviewResult === "不通过"
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                }>
                                  {project.reviewResult || "未出结果"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* 右侧汇总结果面板 */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col">
            {/* 标题区域 */}
            <div className="p-5 border-b bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <ClipboardList className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">意见汇总报告</h2>
                  <p className="text-xs text-slate-500 mt-0.5">AI辅助生成的审查意见汇总</p>
                </div>
              </div>
            </div>
            
            {/* 工具栏 */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b">
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">汇总类型</label>
                  <Select
                    value={summaryType}
                    onValueChange={setSummaryType}
                  >
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overall">总体汇总</SelectItem>
                      <SelectItem value="individual">单独汇总</SelectItem>
                      <SelectItem value="comparative">对比汇总</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">导出格式</label>
                  <Select
                    value={exportFormat}
                    onValueChange={setExportFormat}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF文档</SelectItem>
                      <SelectItem value="docx">Word文档</SelectItem>
                      <SelectItem value="xlsx">Excel表格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handlePrint}
                  disabled={!summaryReady}
                >
                  <Printer className="h-4 w-4" />
                  打印
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="h-8 gap-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleExport}
                  disabled={!summaryReady}
                >
                  <Download className="h-4 w-4" />
                  导出
                </Button>
              </div>
            </div>
            
            {/* 内容区域 */}
            <div className="flex-1 overflow-auto min-h-0 bg-slate-50/50">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
                  <p className="text-sm text-slate-500">加载项目数据...</p>
                </div>
              ) : summarizing ? (
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mb-4"></div>
                  <p className="text-sm text-slate-500">正在生成意见汇总报告...</p>
                  <p className="text-xs text-slate-400 mt-2">AI分析中，请稍候</p>
                </div>
              ) : (
                summaryReady && (
                  <div className="p-5">
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">总体汇总</TabsTrigger>
                        <TabsTrigger value="issues">问题清单</TabsTrigger>
                        <TabsTrigger value="recommendations">建议措施</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary" className="pt-4">
                        <div className="bg-white rounded-lg border p-4 mb-4">
                          <h3 className="text-base font-medium text-slate-800 mb-2">汇总摘要</h3>
                          <p className="text-sm text-slate-600 mb-3">
                            本次共汇总分析{projects.length}个项目的审查意见，其中{projects.filter(p => p.reviewResult === "通过").length}项通过，
                            {projects.filter(p => p.reviewResult === "不通过").length}项未通过，
                            {projects.filter(p => !p.reviewResult).length}项尚未给出结论。通过分析发现，主要问题集中在知情同意、风险管理和研究方案设计三个方面。
                          </p>
                          
                          <div className="flex items-center mt-4 gap-4">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-slate-700">通过: {projects.filter(p => p.reviewResult === "通过").length}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-slate-700">未通过: {projects.filter(p => p.reviewResult === "不通过").length}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-slate-700">待定: {projects.filter(p => !p.reviewResult).length}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border p-4">
                          <h3 className="text-base font-medium text-slate-800 mb-3">主要发现</h3>
                          
                          <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded border border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-1.5">知情同意问题</h4>
                              <p className="text-sm text-slate-600">
                                约75%的项目在知情同意书设计方面存在不足，常见问题包括信息披露不充分、语言表述不易理解、以及未充分说明潜在风险。
                              </p>
                            </div>
                            
                            <div className="p-3 bg-slate-50 rounded border border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-1.5">风险管理不足</h4>
                              <p className="text-sm text-slate-600">
                                大约60%的项目缺乏完善的风险管理计划，特别是应对不良事件的预案不够具体，风险监测措施不完善。
                              </p>
                            </div>
                            
                            <div className="p-3 bg-slate-50 rounded border border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-1.5">研究方案设计问题</h4>
                              <p className="text-sm text-slate-600">
                                约50%的项目在研究方案设计上存在统计学方法选择不当、样本量计算不充分或研究流程描述不清晰等问题。
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="issues" className="pt-4">
                        <div className="bg-white rounded-lg border p-4">
                          <h3 className="text-base font-medium text-slate-800 mb-3">问题清单</h3>
                          
                          <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((item) => (
                              <div key={item} className="p-3 bg-slate-50 rounded border border-slate-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium">{item}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-700 mb-1">
                                      {[
                                        "知情同意书信息不充分",
                                        "风险评估方法不适当",
                                        "数据保护措施不具体",
                                        "研究终点指标定义不明确",
                                        "伦理问题考虑不全面"
                                      ][item - 1]}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                      {[
                                        "知情同意书中对可能的风险和不适描述不充分，缺乏对参与者权益的具体说明。",
                                        "项目风险评估方法选择不当，未考虑特殊人群的额外风险因素。",
                                        "数据安全保护措施描述笼统，缺乏具体的技术和管理保障手段。",
                                        "主要研究终点指标定义不明确，可能导致研究结果解释偏差。",
                                        "对弱势群体参与研究的伦理考量不足，缺乏针对性保护措施。"
                                      ][item - 1]}
                                    </p>
                                    <div className="mt-2 text-xs text-slate-500">
                                      <span>影响项目数: {[7, 6, 5, 4, 3][item - 1]}</span>
                                      <span className="mx-2">•</span>
                                      <span>严重程度: {["高", "高", "中", "中", "中"][item - 1]}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="recommendations" className="pt-4">
                        <div className="bg-white rounded-lg border p-4">
                          <h3 className="text-base font-medium text-slate-800 mb-3">改进建议</h3>
                          
                          <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                              <div key={item} className="p-3 bg-slate-50 rounded border border-slate-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium">{item}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-700 mb-1">
                                      {[
                                        "改进知情同意流程",
                                        "加强风险管理机制",
                                        "完善数据保护方案",
                                        "优化研究设计方法"
                                      ][item - 1]}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                      {[
                                        "建议采用分层次的知情同意流程，提供通俗易懂的项目说明和详细的技术文档，确保受试者充分理解研究内容和潜在风险。",
                                        "建立全面的风险评估与管理体系，包括定期风险评估、监测报告机制和不良事件应对预案，特别关注特殊人群的额外保护措施。",
                                        "制定详细的数据安全保护方案，包括数据脱敏、访问控制、加密传输和存储策略，明确数据生命周期管理流程。",
                                        "优化研究设计，明确定义研究终点指标，采用适当的统计方法，提前确定样本量，并考虑可能的混杂因素。"
                                      ][item - 1]}
                                    </p>
                                    <div className="mt-2 text-xs text-slate-500">
                                      <span>优先级: {["高", "高", "中", "中"][item - 1]}</span>
                                      <span className="mx-2">•</span>
                                      <span>涉及项目数: {[9, 7, 6, 5][item - 1]}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )
              )}
            </div>
            
            {/* 底部工具栏 */}
            <div className="p-4 bg-white border-t mt-auto">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  汇总报告生成时间: {new Date().toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => {
                      toast({
                        title: "分享链接已生成",
                        description: "报告链接已复制到剪贴板",
                      })
                    }}
                    disabled={!summaryReady}
                  >
                    <Share2 className="h-4 w-4" />
                    分享
                  </Button>
                  
                  <Select
                    value={exportFormat}
                    onValueChange={setExportFormat}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        PDF文档
                      </SelectItem>
                      <SelectItem value="docx" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Word文档
                      </SelectItem>
                      <SelectItem value="xlsx" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel表格
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    className="gap-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleExport}
                    disabled={!summaryReady}
                  >
                    <FileDown className="h-4 w-4" />
                    导出报告
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 