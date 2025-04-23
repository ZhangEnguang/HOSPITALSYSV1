"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCircle } from "lucide-react"

interface CompletionStepProps {
  formData: {
    basicInfo: any
    feeItems: any
  }
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const { basicInfo, feeItems } = formData
  
  return (
    <div className="space-y-8">
      <div className="flex justify-center pb-8">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-primary/20 p-3 mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">信息已确认</h2>
          <p className="text-muted-foreground">请检查以下信息，确认无误后提交</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">方案名称</p>
              <p className="font-medium">{basicInfo.schemeName || '未填写'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">方案编码</p>
              <p className="font-medium">{basicInfo.schemeCode || '未填写'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">方案类型</p>
              <p className="font-medium">
                {basicInfo.schemeType === 'standard' && '标准方案'}
                {basicInfo.schemeType === 'special' && '特殊方案'}
                {basicInfo.schemeType === 'custom' && '自定义方案'}
                {!basicInfo.schemeType && '未选择'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">状态</p>
              <Badge variant="outline">待提交</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">生效日期</p>
              <p className="font-medium">
                {basicInfo.validFrom ? format(new Date(basicInfo.validFrom), 'yyyy-MM-dd') : '未设置'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">失效日期</p>
              <p className="font-medium">
                {basicInfo.validTo ? format(new Date(basicInfo.validTo), 'yyyy-MM-dd') : '永久有效'}
              </p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">描述</p>
              <p className="font-medium">{basicInfo.description || '无'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">经费方案科目信息</CardTitle>
        </CardHeader>
        <CardContent>
          {!feeItems.feeItemsList || feeItems.feeItemsList.length === 0 ? (
            <div className="text-muted-foreground">未添加科目</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>科目编码</TableHead>
                  <TableHead>科目名称</TableHead>
                  <TableHead>比例(%)</TableHead>
                  <TableHead>必选</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeItems.feeItemsList.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.subjectCode}</TableCell>
                    <TableCell>{item.subjectName}</TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                    <TableCell>{item.isRequired ? '是' : '否'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          <div className="mt-4 text-right">
            总比例: <span className="font-bold">
              {feeItems.feeItemsList?.reduce((total: number, item: any) => total + (item.percentage || 0), 0) || 0}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 