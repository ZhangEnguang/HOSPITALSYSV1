"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Clock, Archive, FileText, ArrowDown, ChevronRight, ChevronDown } from "lucide-react"
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle 
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

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

type HistoryDrawerProps = {
  isOpen: boolean
  onClose: () => void
  config: any
  history: HistoryItem[]
}

export function HistoryDrawer({ isOpen, onClose, config, history }: HistoryDrawerProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy-MM-dd HH:mm")
    } catch (e) {
      return dateStr
    }
  }
  
  // 获取选中的历史版本
  const selectedHistory = history.find(h => h.version === selectedVersion)
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            历史版本记录
          </DrawerTitle>
          <DrawerDescription>
            {config?.name || "送审文件配置"} 的历史更新记录
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：历史版本列表 */}
          <div className="lg:col-span-4 border rounded-md overflow-hidden">
            <div className="bg-blue-50 p-3 border-b">
              <h3 className="font-medium text-slate-800 flex items-center gap-1.5">
                <Archive className="h-4 w-4 text-blue-500" />
                版本列表
              </h3>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="p-2 space-y-1">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-md cursor-pointer ${selectedVersion === item.version 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedVersion(item.version)}
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
          <div className="lg:col-span-8 border rounded-md overflow-hidden">
            <div className="bg-blue-50 p-3 border-b">
              <h3 className="font-medium text-slate-800 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-500" />
                版本详情
              </h3>
            </div>
            
            {selectedHistory ? (
              <ScrollArea className="h-[400px]">
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
                  
                  <Accordion type="single" collapsible className="w-full">
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
                    
                    {selectedHistory.changedFields.length > 0 && (
                      <AccordionItem value="changes">
                        <AccordionTrigger className="py-2">
                          <span className="font-medium">变更字段</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1 p-1">
                            {selectedHistory.changedFields.map((field) => (
                              <div key={field} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                <ArrowDown className="h-3 w-3 text-blue-500" />
                                <span>{field}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                请选择左侧的历史版本
              </div>
            )}
          </div>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
} 