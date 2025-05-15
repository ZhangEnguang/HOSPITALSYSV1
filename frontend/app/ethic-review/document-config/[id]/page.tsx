"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { FileTextIcon, FileCheck, Download, ArrowLeft, History } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { documentConfigItems } from "../data/document-config-demo-data"
import { documentConfigHistory } from "../data/document-config-demo-data"
import { HistoryDialog } from "../components/history-dialog"

// 自定义标题组件
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

// 自定义页面标题组件
const PageHeader = ({ 
  title, 
  description, 
  actions 
}: { 
  title: string; 
  description?: string; 
  actions?: React.ReactNode 
}) => {
  const router = useRouter()
  
  // 设置按钮高度
  const buttonsHeight = 40

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push("/ethic-review/document-config")}
          className="h-8 w-8 flex items-center justify-center border rounded-md text-gray-500 hover:text-primary transition-colors duration-200 bg-white shadow-sm"
          style={{ height: `${buttonsHeight}px`, width: `${buttonsHeight}px` }}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// 详情页描述字段组件
function DescriptionField({ label, value, isFull = false }: { label: string; value: string | number | null | undefined; isFull?: boolean }) {
  if (value === null || value === undefined || value === "") {
    value = "暂无数据"
  }
  
  return (
    <div className={`flex flex-col space-y-1 ${isFull ? "col-span-2" : ""}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export default function DocumentConfigDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [configHistory, setConfigHistory] = useState<any[]>([])
  
  // 自定义滚动条样式
  const scrollbarStyles = `
    /* 自定义滚动条样式 */
    .custom-scrollbar::-webkit-scrollbar {
      height: 8px;
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #c1c1c1;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #a8a8a8;
    }
  `
  
  useEffect(() => {
    // 模拟API请求
    const fetchData = () => {
      setLoading(true)
      
      // 查找配置数据
      const foundConfig = documentConfigItems.find(item => item.id === id)
      
      if (foundConfig) {
        setConfig(foundConfig)
        
        // 查找历史记录
        const history = documentConfigHistory.filter(item => item.configId === id)
        setConfigHistory(history)
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [id])
  
  // 返回列表页
  const handleBack = () => {
    router.push("/ethic-review/document-config")
  }
  
  // 编辑配置
  const handleEdit = () => {
    console.log("从详情页面跳转编辑", id);
    // 避免在服务器端执行
    if (typeof window === 'undefined') {
      router.push(`/ethic-review/document-config/${id}/edit`);
      return;
    }
    
    // 尝试使用临时调试函数
    if ((window as any).__debugEditConfig) {
      (window as any).__debugEditConfig(id);
    } else {
      router.push(`/ethic-review/document-config/${id}/edit`);
    }
  }
  
  // 打开历史版本对话框
  const handleViewHistory = () => {
    setHistoryOpen(true)
  }
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy-MM-dd HH:mm")
    } catch (e) {
      return dateStr
    }
  }
  
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">正在加载...</div>
        <div className="text-sm text-gray-500 mt-2">请稍候，正在加载配置数据</div>
      </div>
    )
  }
  
  if (!config) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="text-lg font-medium text-red-500">未找到数据</div>
        <div className="text-sm text-gray-500 mt-2">找不到指定的送审文件配置</div>
        <Button onClick={handleBack} className="mt-4">返回列表</Button>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6 relative">
      {/* 添加自定义滚动条样式 */}
      <style jsx global>{scrollbarStyles}</style>
      
      {/* 历史版本对话框 */}
      <HistoryDialog 
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        config={config}
        history={configHistory}
      />
      
      {/* 页面头部 */}
      <PageHeader
        title="送审文件配置详情"
        description="查看送审文件配置的详细信息"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleEdit}>
              编辑配置
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleViewHistory} 
                    className="bg-white border border-blue-200 shadow-md hover:bg-blue-50 rounded-md h-10 w-10 flex items-center justify-center"
                  >
                    <History className="h-5 w-5 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看历史版本</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />
      
      {/* 当前版本信息 */}
      {configHistory.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">当前版本:</span>
            <Badge variant="outline" className="bg-white">v{configHistory[configHistory.length - 1].version}</Badge>
            <span className="text-sm text-gray-500">最后更新于 {formatDate(config.updatedAt)}</span>
          </div>
          <div className="text-sm text-gray-500">
            更新人: <span className="font-medium">{config.updatedBy?.name}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：基本信息 */}
        <Card className="lg:col-span-1 h-[500px] md:h-[550px] lg:h-[600px] flex flex-col border-t-4 border-t-blue-500 shadow-sm">
          <CardContent className="p-6 space-y-6 flex-grow overflow-auto custom-scrollbar">
            <SectionTitle 
              icon={<FileTextIcon className="h-5 w-5" />} 
              title="基本信息" 
            />
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{config?.name}</h3>
                {config?.status && (
                <Badge variant={config.status === "enabled" ? "default" : "destructive"}>
                  {config.status === "enabled" ? "启用" : "禁用"}
                </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DescriptionField label="审查类型" value={config?.reviewType} />
                <DescriptionField label="项目类型" value={config?.projectType} />
                
                <DescriptionField label="文件总数" value={config?.documentCount} />
                <DescriptionField label="必交文件数" value={config?.requiredCount} />
                
                <DescriptionField label="选交文件数" value={config?.optionalCount} />
                <DescriptionField label="带模板数" value={config?.templateCount} />
                
                <DescriptionField label="创建时间" value={config?.createdAt} />
                <DescriptionField label="更新时间" value={config?.updatedAt} />
                
                <DescriptionField 
                  label="创建人" 
                  value={config?.createdBy?.name || "系统"} 
                />
                <DescriptionField 
                  label="更新人" 
                  value={config?.updatedBy?.name || "系统"} 
                />
              </div>
              
              <div className="pt-2">
                <DescriptionField label="配置描述" value={config?.description} isFull />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 右侧：送审文件清单 */}
        <Card className="lg:col-span-2 h-[500px] md:h-[550px] lg:h-[600px] flex flex-col border-t-4 border-t-blue-500 shadow-sm">
          <CardContent className="p-6 space-y-6 flex-grow overflow-hidden flex flex-col">
            <SectionTitle 
              icon={<FileCheck className="h-5 w-5" />} 
              title="送审文件清单" 
            />
            
            <div className="border border-gray-200 rounded-md flex-grow overflow-hidden flex flex-col">
              <div className="overflow-x-auto overflow-y-auto flex-grow custom-scrollbar">
              <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 shadow-sm">
                      <th className="py-3 px-4 text-left font-medium text-slate-700 border-b border-gray-200 bg-gray-50">文件名称</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-700 border-b border-gray-200 bg-gray-50">文件类型</th>
                      <th className="py-3 px-4 text-center font-medium text-slate-700 border-b border-gray-200 bg-gray-50">必填</th>
                      <th className="py-3 px-4 text-center font-medium text-slate-700 border-b border-gray-200 bg-gray-50">模板</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-700 border-b border-gray-200 bg-gray-50">描述</th>
                  </tr>
                </thead>
                <tbody>
                    {config?.documents?.map((doc: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 border-b border-gray-200 font-medium">{doc.name}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{doc.type}</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center">
                        <Badge variant={doc.requirementLevel === "必交" ? "default" : "outline"}>
                          {doc.requirementLevel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center">
                        {doc.template ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>下载模板</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-gray-400">无</span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 max-w-[300px] truncate">
                        {doc.description || "无描述"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 