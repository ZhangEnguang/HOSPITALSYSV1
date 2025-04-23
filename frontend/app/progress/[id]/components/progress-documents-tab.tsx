"use client"

import { FileText, Download, Eye, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProgressDocumentsTabProps {
  data: any
}

export default function ProgressDocumentsTab({ data }: ProgressDocumentsTabProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="attachments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="attachments">申请附件</TabsTrigger>
          <TabsTrigger value="related">相关文档</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attachments">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">申请附件</CardTitle>
              <CardDescription>项目进度变更申请提交的附件</CardDescription>
            </CardHeader>
            <CardContent>
              {data.attachments && data.attachments.length > 0 ? (
                <div className="space-y-4">
                  {data.attachments.map((attachment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{attachment.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{attachment.size}</span>
                            <span>•</span>
                            <span>{attachment.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>预览</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Download className="h-3.5 w-3.5" />
                          <span>下载</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>暂无附件</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="related">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">相关文档</CardTitle>
              <CardDescription>与项目进度变更相关的其他文档</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 模拟相关文档数据 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">项目进度报告.pdf</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>2.3MB</span>
                        <span>•</span>
                        <span>2024-01-10</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>预览</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>下载</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">项目变更影响评估.docx</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>1.5MB</span>
                        <span>•</span>
                        <span>2024-01-12</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>预览</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>下载</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">项目变更后进度计划.xlsx</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>0.8MB</span>
                        <span>•</span>
                        <span>2024-01-14</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>预览</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>下载</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
