"use client"

import Link from "next/link"
import { useState } from "react"
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EvaluationActionButtons } from "@/components/ui/evaluation-action-buttons"

// 模拟数据
const evaluatedAchievements = [
  {
    id: "1",
    title: "智能园区综合管理平台技术鉴定",
    type: "鉴定成果",
    project: "智慧园区综合管理平台",
    firstAuthor: "张三",
    level: "国家级",
    status: "鉴定中",
    date: "-",
    organization: "国家科技部"
  },
  {
    id: "2",
    title: "智慧停车管理平台技术鉴定",
    type: "鉴定成果",
    project: "智慧停车管理平台",
    firstAuthor: "孙七",
    level: "市厅级",
    status: "已鉴定",
    date: "2023/08/10",
    organization: "市科技局"
  },
  {
    id: "3",
    title: "智慧能源管理系统技术鉴定",
    type: "鉴定成果",
    project: "智慧能源管理系统",
    firstAuthor: "王五",
    level: "省部级",
    status: "已鉴定",
    date: "2023/07/15",
    organization: "省科技厅"
  },
]

export default function EvaluatedAchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // 基于搜索词过滤鉴定成果
  const filteredAchievements = evaluatedAchievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.firstAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.organization.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>鉴定成果管理</CardTitle>
        <Link href="/achievements/evaluated-achievements/create">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            新建鉴定成果
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Input
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-[260px]"
            />
            <Select defaultValue="all-types">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">全部类型</SelectItem>
                <SelectItem value="scientific">科技成果</SelectItem>
                <SelectItem value="teaching">教学成果</SelectItem>
                <SelectItem value="service">社会服务成果</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            高级筛选
          </Button>
        </div>
        
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">鉴定成果名称</th>
                <th className="p-3 text-left font-medium">第一作者/实现人</th>
                <th className="p-3 text-left font-medium">级别</th>
                <th className="p-3 text-left font-medium">状态</th>
                <th className="p-3 text-left font-medium">发表/授权/获奖日期</th>
                <th className="p-3 text-left font-medium">发表/授权/获奖机构</th>
                <th className="p-3 text-left font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement) => (
                  <tr key={achievement.id} className="border-b">
                    <td className="p-3">{achievement.title}</td>
                    <td className="p-3">{achievement.firstAuthor}</td>
                    <td className="p-3">{achievement.level}</td>
                    <td className="p-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          achievement.status === "已鉴定" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {achievement.status}
                      </span>
                    </td>
                    <td className="p-3">{achievement.date}</td>
                    <td className="p-3">{achievement.organization}</td>
                    <td className="p-3">
                      <EvaluationActionButtons id={achievement.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    没有找到符合条件的鉴定成果
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            共 {filteredAchievements.length} 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 