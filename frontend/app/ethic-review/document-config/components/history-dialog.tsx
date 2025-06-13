"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { Clock, Archive, FileText, X, ArrowRightLeft, Diff } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 历史记录类型定义
type HistoryItem = {
  id: string
  configId: string
  version: string
  changeType: string
  changeDescription: string
  changedFields: string[]
  documents: any[]
  documentCount: number
  requiredCount: number
  optionalCount: number
  templateCount: number
  createdBy: {
    id: string
    name: string
  }
  createdAt: string
}

type HistoryDialogProps = {
  isOpen: boolean
  onClose: () => void
  config: any
  history: HistoryItem[]
}

export function HistoryDialog({ isOpen, onClose, config, history }: HistoryDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareVersion, setCompareVersion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('detail')
  
  // 1. 对history按createdAt降序排序
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [history])
  
  // 2. 初始化时自动选中最新版本
  useEffect(() => {
    if (sortedHistory.length > 0) {
      setSelectedVersion(sortedHistory[0].version)
      // 3. 如果是比较模式，默认选中最新和上一个版本
      if (compareMode && sortedHistory.length > 1) {
        setCompareVersion(sortedHistory[1].version)
      }
    }
  }, [isOpen, sortedHistory.length])
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy-MM-dd HH:mm")
    } catch (e) {
      return dateStr
    }
  }
  
  // 获取选中的历史版本
  const selectedHistory = sortedHistory.find(h => h.version === selectedVersion)
  const compareHistory = sortedHistory.find(h => h.version === compareVersion)
  
  // 切换比较模式
  const toggleCompareMode = () => {
    setCompareMode(!compareMode)
    if (!compareMode) {
      // 默认选择前一个版本进行比较
      const currentIndex = sortedHistory.findIndex(h => h.version === selectedVersion)
      if (currentIndex > 0) {
        setCompareVersion(sortedHistory[currentIndex - 1].version)
      }
    } else {
      setCompareVersion(null)
    }
  }
  
  // 获取文件差异
  const getDocumentDiff = () => {
    if (!selectedHistory || !compareHistory) return { added: [], removed: [], changed: [] }
    
    // 在当前版本中添加的文件
    const added = selectedHistory.documents.filter(
      doc => !compareHistory.documents.some(d => d.id === doc.id)
    )
    
    // 在当前版本中移除的文件
    const removed = compareHistory.documents.filter(
      doc => !selectedHistory.documents.some(d => d.id === doc.id)
    )
    
    // 在当前版本中修改的文件
    const changed = selectedHistory.documents.filter(doc => {
      const oldDoc = compareHistory.documents.find(d => d.id === doc.id)
      if (!oldDoc) return false
      
      return (
        doc.requirementLevel !== oldDoc.requirementLevel ||
        doc.template !== oldDoc.template ||
        doc.type !== oldDoc.type ||
        doc.description !== oldDoc.description
      )
    })
    
    return { added, removed, changed }
  }
  
  // 计算文件差异
  const documentDiff = compareMode && selectedHistory && compareHistory ? getDocumentDiff() : null
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[900px] p-0 h-[85vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              历史版本记录
            </DialogTitle>
          </div>
          <DialogDescription>
            {config?.name || "送审文件配置"} 的历史更新记录
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow p-4 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            {/* 左侧：历史版本列表 */}
            <div className="md:col-span-4 border rounded-md overflow-hidden h-full flex flex-col">
              <div className="bg-blue-50 p-3 border-b">
                <h3 className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Archive className="h-4 w-4 text-blue-500" />
                  版本列表
                </h3>
              </div>
              
              <ScrollArea className="flex-grow">
                <div className="p-2 space-y-1">
                  {sortedHistory.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        (selectedVersion === item.version) 
                          ? 'bg-blue-50 border border-blue-200' 
                          : (compareVersion === item.version)
                            ? 'bg-green-50 border border-green-200'
                            : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (compareMode && selectedVersion && selectedVersion !== item.version) {
                          setCompareVersion(item.version)
                        } else {
                          setSelectedVersion(item.version)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">v{item.version}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.changeType}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{item.changeDescription}</p>
                      <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <span>更新人:</span>
                        <span>{item.createdBy.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* 右侧：版本详情 */}
            <div className="md:col-span-8 border rounded-md overflow-hidden h-full flex flex-col max-h-[60vh]">
              <div className="bg-blue-50 p-3 border-b flex items-center justify-between">
                <h3 className="font-medium text-slate-800 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-500" />
                  {compareMode ? "版本比较" : "版本详情"}
                </h3>
                
                {selectedHistory && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleCompareMode}
                    className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    {compareMode ? (
                      <>
                        <FileText className="h-3.5 w-3.5" />
                        <span>查看详情</span>
                      </>
                    ) : (
                      <>
                        <Diff className="h-3.5 w-3.5" />
                        <span>版本比较</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {!selectedHistory ? (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                  请选择左侧的历史版本
                </div>
              ) : compareMode ? (
                <div className="flex flex-col h-full">
                  {/* 版本比较 */}
                  <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">对比版本:</span>
                        <div className="flex items-center gap-1">
                          <Select value={compareVersion || ''} onValueChange={setCompareVersion}>
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue placeholder="选择版本" />
                            </SelectTrigger>
                            <SelectContent>
                              {sortedHistory.filter(h => h.version !== selectedVersion).map(item => (
                                <SelectItem key={item.id} value={item.version}>
                                  v{item.version} ({item.changeType})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">当前版本:</span>
                        <div className="font-medium">v{selectedHistory.version} ({selectedHistory.changeType})</div>
                      </div>
                    </div>
                  </div>
                  
                  {compareHistory ? (
                    <ScrollArea className="flex-grow">
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-xs text-gray-500">文件总数变化</div>
                            <div className="text-lg font-medium flex items-center gap-2">
                              {compareHistory.documentCount}
                              <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                              {selectedHistory.documentCount}
                              <Badge variant={selectedHistory.documentCount > compareHistory.documentCount ? "default" : 
                                selectedHistory.documentCount < compareHistory.documentCount ? "destructive" : "outline"}>
                                {selectedHistory.documentCount > compareHistory.documentCount ? 
                                  `+${selectedHistory.documentCount - compareHistory.documentCount}` : 
                                  selectedHistory.documentCount < compareHistory.documentCount ? 
                                  `-${compareHistory.documentCount - selectedHistory.documentCount}` : "无变化"}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-xs text-gray-500">必交文件数变化</div>
                            <div className="text-lg font-medium flex items-center gap-2">
                              {compareHistory.requiredCount}
                              <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                              {selectedHistory.requiredCount}
                              <Badge variant={selectedHistory.requiredCount > compareHistory.requiredCount ? "default" : 
                                selectedHistory.requiredCount < compareHistory.requiredCount ? "destructive" : "outline"}>
                                {selectedHistory.requiredCount > compareHistory.requiredCount ? 
                                  `+${selectedHistory.requiredCount - compareHistory.requiredCount}` : 
                                  selectedHistory.requiredCount < compareHistory.requiredCount ? 
                                  `-${compareHistory.requiredCount - selectedHistory.requiredCount}` : "无变化"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          {documentDiff && (
                            <>
                              {documentDiff.added.length > 0 && (
                                <div className="border rounded-md overflow-hidden">
                                  <div className="bg-green-50 p-2 border-b">
                                    <h4 className="font-medium text-green-700">新增文件 ({documentDiff.added.length})</h4>
                                  </div>
                                  <table className="w-full text-sm border-collapse">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件名称</th>
                                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件类型</th>
                                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">必填</th>
                                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">模板</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {documentDiff.added.map((doc: any, index: number) => (
                                        <tr key={doc.id} className="bg-green-50/30">
                                          <td className="py-2 px-3 border-b border-gray-200 font-medium">{doc.name}</td>
                                          <td className="py-2 px-3 border-b border-gray-200">{doc.type}</td>
                                          <td className="py-2 px-3 border-b border-gray-200 text-center">
                                            <Badge variant={doc.requirementLevel === "必交" ? "default" : "outline"}>
                                              {doc.requirementLevel}
                                            </Badge>
                                          </td>
                                          <td className="py-2 px-3 border-b border-gray-200 text-center">
                                            {doc.template ? (
                                              <span className="text-blue-500">有</span>
                                            ) : (
                                              <span className="text-gray-400">无</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              
                              {documentDiff.removed.length > 0 && (
                                <div className="border rounded-md overflow-hidden">
                                  <div className="bg-red-50 p-2 border-b">
                                    <h4 className="font-medium text-red-700">删除文件 ({documentDiff.removed.length})</h4>
                                  </div>
                                  <table className="w-full text-sm border-collapse">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件名称</th>
                                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件类型</th>
                                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">必填</th>
                                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">模板</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {documentDiff.removed.map((doc: any, index: number) => (
                                        <tr key={doc.id} className="bg-red-50/30">
                                          <td className="py-2 px-3 border-b border-gray-200 font-medium">{doc.name}</td>
                                          <td className="py-2 px-3 border-b border-gray-200">{doc.type}</td>
                                          <td className="py-2 px-3 border-b border-gray-200 text-center">
                                            <Badge variant={doc.requirementLevel === "必交" ? "default" : "outline"}>
                                              {doc.requirementLevel}
                                            </Badge>
                                          </td>
                                          <td className="py-2 px-3 border-b border-gray-200 text-center">
                                            {doc.template ? (
                                              <span className="text-blue-500">有</span>
                                            ) : (
                                              <span className="text-gray-400">无</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              
                              {documentDiff.changed.length > 0 && (
                                <div className="border rounded-md overflow-hidden">
                                  <div className="bg-blue-50 p-2 border-b">
                                    <h4 className="font-medium text-blue-700">修改文件 ({documentDiff.changed.length})</h4>
                                  </div>
                                  <table className="w-full text-sm border-collapse">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件名称</th>
                                        <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件类型</th>
                                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">必填</th>
                                        <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">模板</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {documentDiff.changed.map((doc: any, index: number) => (
                                        <tr key={doc.id} className="bg-blue-50/30">
                                          <td className="py-2 px-3 border-b border-gray-200 font-medium">{doc.name}</td>
                                          <td className="py-2 px-3 border-b border-gray-200">{doc.type}</td>
                                          <td className="py-2 px-3 border-b border-gray-200 text-center">
                                            <Badge variant={doc.requirementLevel === "必交" ? "default" : "outline"}>
                                              {doc.requirementLevel}
                                            </Badge>
                                          </td>
                                          <td className="py-2 px-3 border-b border-gray-200 text-center">
                                            {doc.template ? (
                                              <span className="text-blue-500">有</span>
                                            ) : (
                                              <span className="text-gray-400">无</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              
                              {documentDiff.added.length === 0 && documentDiff.removed.length === 0 && documentDiff.changed.length === 0 && (
                                <div className="p-6 text-center text-gray-500">
                                  两个版本的文件没有差异
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                      请选择要比较的版本
                    </div>
                  )}
                </div>
              ) : (
                <ScrollArea className="flex-grow">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        版本 {selectedHistory.version}
                        <Badge variant="outline">{selectedHistory.changeType}</Badge>
                      </h4>
                      <div className="text-sm text-gray-500">
                        {formatDate(selectedHistory.createdAt)}
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div>更新人: <span className="font-medium">{selectedHistory.createdBy.name}</span></div>
                      <div>更新说明: <span className="font-medium">{selectedHistory.changeDescription}</span></div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="text-xs text-gray-500">文件总数</div>
                        <div className="text-lg font-medium">{selectedHistory.documentCount}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="text-xs text-gray-500">必交文件数</div>
                        <div className="text-lg font-medium">{selectedHistory.requiredCount}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="text-xs text-gray-500">选交文件数</div>
                        <div className="text-lg font-medium">{selectedHistory.optionalCount}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="text-xs text-gray-500">带模板数</div>
                        <div className="text-lg font-medium">{selectedHistory.templateCount}</div>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full" defaultValue="documents">
                      <AccordionItem value="documents">
                        <AccordionTrigger className="py-2">
                          <span className="font-medium">送审文件清单 ({selectedHistory.documents.length})</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件名称</th>
                                  <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200">文件类型</th>
                                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">必填</th>
                                  <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200">模板</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedHistory.documents.map((doc: any, index: number) => (
                                  <tr key={doc.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-3 border-b border-gray-200 font-medium">{doc.name}</td>
                                    <td className="py-2 px-3 border-b border-gray-200">{doc.type}</td>
                                    <td className="py-2 px-3 border-b border-gray-200 text-center">
                                      <Badge variant={doc.requirementLevel === "必交" ? "default" : "outline"}>
                                        {doc.requirementLevel}
                                      </Badge>
                                    </td>
                                    <td className="py-2 px-3 border-b border-gray-200 text-center">
                                      {doc.template ? (
                                        <span className="text-blue-500">有</span>
                                      ) : (
                                        <span className="text-gray-400">无</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 