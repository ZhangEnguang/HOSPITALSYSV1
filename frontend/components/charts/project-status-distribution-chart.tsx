"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle, PauseCircle } from "lucide-react"

interface ProjectStatusData {
  status: string
  count: number
  percentage: number
  color: string
  icon: React.ReactNode
  bgColor: string
  lightColor: string
}

export default function ProjectStatusDistributionChart() {
  const statusData: ProjectStatusData[] = [
    {
      status: "进行中",
      count: 156,
      percentage: 63,
      color: "#3B82F6",
      bgColor: "bg-blue-500",
      lightColor: "bg-blue-50",
      icon: <Clock className="h-4 w-4" />
    },
    {
      status: "已完成",
      count: 92,
      percentage: 37,
      color: "#10B981",
      bgColor: "bg-green-500",
      lightColor: "bg-green-50",
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]

  const totalProjects = statusData.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex flex-col h-full">
      {/* 环形图和中心统计 */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90 drop-shadow-sm">
            {/* 背景圆环 */}
            <circle
              cx={100}
              cy={100}
              r={70}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth={16}
            />
            
            {/* 状态圆弧 */}
            {statusData.map((item, index) => {
              const circumference = 2 * Math.PI * 70
              const strokeDasharray = circumference
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference
              const rotation = index === 0 ? 0 : 63 * 3.6 // 第二个弧从第一个结束位置开始
              
              return (
                <circle
                  key={item.status}
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={16}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out hover:stroke-[18]"
                  style={{
                    transformOrigin: '100px 100px',
                    transform: `rotate(${rotation}deg)`
                  }}
                />
              )
            })}
          </svg>
          
          {/* 中心统计 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
            <div className="text-sm text-gray-500 font-medium">总项目数</div>
          </div>
        </div>
      </div>

      {/* 状态列表 */}
      <div className="space-y-3 flex-1">
        {statusData.map((item, index) => (
          <div
            key={item.status}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${item.lightColor} border border-white shadow-sm`}>
                {React.cloneElement(item.icon as React.ReactElement, { 
                  className: `h-4 w-4 ${item.status === "进行中" ? "text-blue-600" : "text-green-600"}` 
                })}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{item.status}</div>
                <div className="text-xs text-gray-500 font-medium">{item.percentage}% 项目占比</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">{item.count}</div>
              <div className="text-xs text-gray-500 font-medium">个项目</div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部快速统计 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">63%</div>
            <div className="text-xs text-gray-600 font-medium mt-1">项目进行率</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">37%</div>
            <div className="text-xs text-gray-600 font-medium mt-1">项目完成率</div>
          </div>
        </div>
      </div>
    </div>
  )
} 