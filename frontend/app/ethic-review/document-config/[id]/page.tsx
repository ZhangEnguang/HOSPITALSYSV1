"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { FileTextIcon, FileCheck, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { documentConfigItems } from "../data/document-config-demo-data"

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
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
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
  
  useEffect(() => {
    // 模拟API请求
    const fetchData = () => {
      setLoading(true)
      
      // 查找配置数据
      const foundConfig = documentConfigItems.find(item => item.id === id)
      
      if (foundConfig) {
        setConfig(foundConfig)
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
    router.push(`/ethic-review/document-config/${id}/edit`)
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
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面头部 */}
      <PageHeader
        title="送审文件配置详情"
        description="查看送审文件配置的详细信息"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBack}>
              返回
            </Button>
            <Button onClick={handleEdit}>
              编辑配置
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：基本信息 */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-6">
            <SectionTitle 
              icon={<FileTextIcon className="h-5 w-5" />} 
              title="基本信息" 
            />
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                <Badge variant={config.status === "enabled" ? "default" : "destructive"}>
                  {config.status === "enabled" ? "启用" : "禁用"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DescriptionField label="审查类型" value={config.reviewType} />
                <DescriptionField label="项目类型" value={config.projectType} />
                
                <DescriptionField label="文件总数" value={config.documentCount} />
                <DescriptionField label="必交文件数" value={config.requiredCount} />
                
                <DescriptionField label="选交文件数" value={config.optionalCount} />
                <DescriptionField label="带模板数" value={config.templateCount} />
                
                <DescriptionField label="创建时间" value={config.createdAt} />
                <DescriptionField label="更新时间" value={config.updatedAt} />
                
                <DescriptionField 
                  label="创建人" 
                  value={config.createdBy?.name || "系统"} 
                />
                <DescriptionField 
                  label="更新人" 
                  value={config.updatedBy?.name || "系统"} 
                />
              </div>
              
              <div className="pt-2">
                <DescriptionField label="配置描述" value={config.description} isFull />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 右侧：送审文件清单 */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <SectionTitle 
              icon={<FileCheck className="h-5 w-5" />} 
              title="送审文件清单" 
            />
            
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left font-medium text-slate-700 border-b border-gray-200">文件名称</th>
                    <th className="py-3 px-4 text-left font-medium text-slate-700 border-b border-gray-200">文件类型</th>
                    <th className="py-3 px-4 text-center font-medium text-slate-700 border-b border-gray-200">必填</th>
                    <th className="py-3 px-4 text-center font-medium text-slate-700 border-b border-gray-200">模板</th>
                    <th className="py-3 px-4 text-left font-medium text-slate-700 border-b border-gray-200">描述</th>
                  </tr>
                </thead>
                <tbody>
                  {config.documents.map((doc: any, index: number) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 