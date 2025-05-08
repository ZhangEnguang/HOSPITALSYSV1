"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PawPrint, Shield, Check, Info, X, AlertTriangle, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function AnimalWelfareTab() {
  const welfareStandards = [
    {
      id: "1",
      name: "3R原则",
      description: "减少使用动物数量、优化实验方法和替代动物使用",
      status: "已执行",
      details: "本项目严格遵循3R原则，通过细胞实验替代部分动物实验，精确计算所需动物数量"
    },
    {
      id: "2",
      name: "动物饲养环境",
      description: "确保动物有适宜的饲养环境和充足的食物与水",
      status: "已执行",
      details: "实验动物饲养在SPF级别动物房，温度22±2℃，湿度50-60%，12小时光照循环"
    },
    {
      id: "3",
      name: "人道终点",
      description: "设立明确的人道终点，避免动物不必要的痛苦",
      status: "已执行",
      details: "制定详细的人道终点标准，当动物出现严重不适症状时及时实施安乐死"
    },
    {
      id: "4",
      name: "疼痛管理",
      description: "实验过程中合理使用麻醉和镇痛剂",
      status: "已执行",
      details: "手术前使用异氟烷麻醉，术后使用布比卡因进行局部镇痛"
    },
    {
      id: "5",
      name: "执行人员资质",
      description: "确保实验操作人员具备相应资质",
      status: "已执行",
      details: "所有参与动物实验的研究人员均已获得实验动物操作证书"
    }
  ]

  const complianceStatus = [
    { id: "1", name: "AAALAC认证", status: "符合", icon: <Check className="h-4 w-4 text-green-500" /> },
    { id: "2", name: "国家实验动物标准", status: "符合", icon: <Check className="h-4 w-4 text-green-500" /> },
    { id: "3", name: "机构IACUC批准", status: "已获得", icon: <Check className="h-4 w-4 text-green-500" /> }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              福利评估
            </CardTitle>
            <CardDescription>动物福利评估得分</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <span className="text-4xl font-bold text-green-600">92</span>
              <span className="text-xl text-muted-foreground">/100</span>
            </div>
            <Progress value={92} className="h-2" />
            <p className="text-xs text-muted-foreground text-center mt-2">优秀</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-amber-500" />
              动物数量
            </CardTitle>
            <CardDescription>实验动物使用情况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">计划使用:</span>
              <span className="font-medium">85只</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">已使用:</span>
              <span className="font-medium">42只</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">使用率:</span>
              <span className="font-medium">49.4%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              合规状态
            </CardTitle>
            <CardDescription>福利法规遵从情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {complianceStatus.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm">{item.name}:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{item.status}</span>
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">动物福利保障措施</CardTitle>
          <CardDescription>项目实施的动物福利保障措施及执行情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {welfareStandards.map((standard, index) => (
              <div key={standard.id}>
                {index > 0 && <Separator className="my-4" />}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-medium flex items-center gap-2">
                        {standard.name}
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          {standard.status}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{standard.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{standard.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50/50 flex justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm text-muted-foreground">如需修改福利措施，请联系实验动物中心</span>
          </div>
          <Button variant="outline" size="sm">查看福利报告</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 