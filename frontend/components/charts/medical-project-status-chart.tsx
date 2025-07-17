"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ProjectStatusData {
  name: string
  value: number
  color: string
}

export default function MedicalProjectStatusChart() {
  const [data] = useState<ProjectStatusData[]>([
    { name: "进行中", value: 156, color: "#3b82f6" },
    { name: "已完成", value: 92, color: "#10b981" },
    { name: "已暂停", value: 18, color: "#f59e0b" },
    { name: "已终止", value: 12, color: "#ef4444" }
  ])

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* 饼图SVG */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = item.value / total
            const startAngle = data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total), 0) * 360
            const endAngle = startAngle + percentage * 360
            
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)
            
            const largeArcFlag = percentage > 0.5 ? 1 : 0
            
            return (
              <path
                key={item.name}
                d={`M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                fill={item.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            )
          })}
        </svg>
        
        {/* 中心文字 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">总项目</div>
        </div>
      </div>
      
      {/* 图例 */}
      <div className="ml-6 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 mr-2">{item.name}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 