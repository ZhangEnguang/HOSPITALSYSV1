"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, History, Calendar, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const protocolFiles = [
  {
    id: "1",
    fileName: "研究方案V1.0.docx",
    fileType: "Word文档",
    fileSize: "2.5MB",
    uploadDate: "2024-01-15",
    uploadBy: "陈明学",
    version: "1.0",
    status: "已审核"
  },
  {
    id: "2",
    fileName: "研究方案V2.0.docx",
    fileType: "Word文档",
    fileSize: "3.2MB",
    uploadDate: "2024-02-20",
    uploadBy: "陈明学",
    version: "2.0",
    status: "当前版本"
  }
]

export default function ProtocolTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">研究方案</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              上传新版本
            </Button>
          </div>
          <CardDescription>管理项目研究方案文件，查看历史版本</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current">
            <TabsList className="mb-4">
              <TabsTrigger value="current">当前版本</TabsTrigger>
              <TabsTrigger value="history">历史版本</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">文件名</TableHead>
                      <TableHead>版本</TableHead>
                      <TableHead>大小</TableHead>
                      <TableHead>上传日期</TableHead>
                      <TableHead>上传人</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {protocolFiles.filter(file => file.status === "当前版本").map(file => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          {file.fileName}
                        </TableCell>
                        <TableCell>{file.version}</TableCell>
                        <TableCell>{file.fileSize}</TableCell>
                        <TableCell>{file.uploadDate}</TableCell>
                        <TableCell>{file.uploadBy}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{file.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">研究方案概要</h3>
                <div className="text-sm text-muted-foreground">
                  <p>本研究旨在使用转基因小鼠模型研究阿尔茨海默症的临床病理及治疗方法。主要通过以下几个方面进行：</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>建立稳定的转基因小鼠模型</li>
                    <li>评估小鼠模型中的淀粉样蛋白沉积和神经退行性变</li>
                    <li>测试新型治疗方法对阿尔茨海默症的影响</li>
                    <li>研究疾病进展机制和生物标志物</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">文件名</TableHead>
                      <TableHead>版本</TableHead>
                      <TableHead>大小</TableHead>
                      <TableHead>上传日期</TableHead>
                      <TableHead>上传人</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {protocolFiles.map(file => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          {file.fileName}
                        </TableCell>
                        <TableCell>{file.version}</TableCell>
                        <TableCell>{file.fileSize}</TableCell>
                        <TableCell>{file.uploadDate}</TableCell>
                        <TableCell>{file.uploadBy}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={file.status === "当前版本" ? "secondary" : "outline"}
                          >
                            {file.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 