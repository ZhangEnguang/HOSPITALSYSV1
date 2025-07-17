"use client"

import { useState } from "react"

interface FundingData {
  department: string
  budget: number
  used: number
  color: string
}

export default function MedicalFundingChart() {
  const [data] = useState<FundingData[]>([
    { department: "内科", budget: 680, used: 425, color: "#3b82f6" },
    { department: "外科", budget: 750, used: 532, color: "#10b981" },
    { department: "妇产科", budget: 420, used: 298, color: "#f59e0b" },
    { department: "儿科", budget: 380, used: 187, color: "#ef4444" },
    { department: "急诊科", budget: 290, used: 245, color: "#8b5cf6" },
    { department: "检验科", budget: 325, used: 278, color: "#06b6d4" }
  ])

  const maxValue = Math.max(...data.map(d => d.budget))

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-end space-x-2 h-48">
        {data.map((item, index) => {
          const budgetHeight = (item.budget / maxValue) * 100
          const usedHeight = (item.used / maxValue) * 100
          
          return (
            <div key={item.department} className="flex-1 flex flex-col items-center space-y-2">
              {/* 柱状图 */}
              <div className="relative w-full flex-1 flex items-end">
                {/* 预算柱 */}
                <div 
                  className="w-1/2 bg-gray-200 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ height: `${budgetHeight}%` }}
                />
                {/* 使用柱 */}
                <div 
                  className="w-1/2 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ 
                    height: `${usedHeight}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              
              {/* 科室名称 */}
              <div className="text-xs font-medium text-gray-600 text-center">
                {item.department}
              </div>
              
              {/* 数值 */}
              <div className="text-xs text-gray-500 text-center">
                <div>{item.used}万</div>
                <div className="text-gray-400">/{item.budget}万</div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* 图例 */}
      <div className="flex justify-center space-x-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded mr-1" />
          <span className="text-gray-600">预算</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-1" />
          <span className="text-gray-600">已使用</span>
        </div>
      </div>
    </div>
  )
} 