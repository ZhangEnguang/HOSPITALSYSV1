"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StepProjectInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export function StepProjectInfo({ formData, updateFormData }: StepProjectInfoProps) {
  // 模拟项目数据
  const projects = [
    { 
      id: "1", 
      name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究",
      type: "纵向",
      leader: "张教授",
      department: "信息工程学院" 
    },
    { 
      id: "2", 
      name: "新能源汽车动力电池回收利用技术研究",
      type: "横向",
      leader: "李教授",
      department: "机械工程学院" 
    },
    { 
      id: "3", 
      name: "新型高效光电转换材料的设计与制备研究",
      type: "纵向",
      leader: "王教授",
      department: "材料科学与工程学院" 
    },
    { 
      id: "4", 
      name: "高校创新创业教育体系构建研究",
      type: "纵向",
      leader: "赵教授",
      department: "教育学院" 
    },
    { 
      id: "5", 
      name: "智慧校园综合管理平台开发",
      type: "横向",
      leader: "刘教授",
      department: "计算机科学与技术学院" 
    },
  ]

  // 根据所选项目ID获取项目详情
  const selectedProject = projects.find(p => p.id === formData.projectId)

  return (
    <Card className="w-full border border-gray-100 shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg font-medium">项目信息</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectId">
            关联项目 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.projectId || ""}
            onValueChange={(value) => updateFormData("projectId", value)}
          >
            <SelectTrigger id="projectId">
              <SelectValue placeholder="请选择关联项目" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProject && (
          <div className="bg-muted/30 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">项目详情</h3>
              <Badge variant={selectedProject.type === "纵向" ? "default" : "secondary"}>
                {selectedProject.type}项目
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">项目名称</p>
                <p className="font-medium">{selectedProject.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">所属部门</p>
                <p className="font-medium">{selectedProject.department}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{selectedProject.leader.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{selectedProject.leader}</p>
                <p className="text-xs text-muted-foreground">项目负责人</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="budgetAllocation">预算分配说明</Label>
          <textarea
            id="budgetAllocation"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="请输入预算分配说明"
            value={formData.budgetAllocation || ""}
            onChange={(e) => updateFormData("budgetAllocation", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
