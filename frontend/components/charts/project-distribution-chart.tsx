"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 按学科分布数据
const disciplineData = [
  { name: "信息科学", value: 28 },
  { name: "材料科学", value: 22 },
  { name: "生物医学", value: 18 },
  { name: "能源环境", value: 12 },
  { name: "人文社科", value: 6 },
]

// 按单位分布数据
const departmentData = [
  { name: "计算机学院", value: 18 },
  { name: "材料学院", value: 16 },
  { name: "电子信息学院", value: 14 },
  { name: "生命科学学院", value: 12 },
  { name: "机械工程学院", value: 10 },
  { name: "化学化工学院", value: 8 },
  { name: "其他学院", value: 8 },
]

// 按级别分布数据
const levelData = [
  { name: "国家级重点", value: 12 },
  { name: "国家级一般", value: 18 },
  { name: "省部级重点", value: 24 },
  { name: "省部级一般", value: 20 },
  { name: "横向合作", value: 12 },
]

// 统一配色方案
const COLORS = {
  discipline: ["#7275F2", "#8AD7FC", "#F97F7F", "#92F1B4", "#FFB17A"],
  department: ["#7275F2", "#8AD7FC", "#F97F7F", "#92F1B4", "#FFB17A", "#B4A6FF", "#FF9F9F"],
  level: ["#7275F2", "#8AD7FC", "#F97F7F", "#92F1B4", "#FFB17A"]
}

export default function ProjectDistributionChart() {
  const [activeTab, setActiveTab] = useState<"discipline" | "department" | "level">("discipline")

  // 根据当前选中的tab获取数据
  const getData = () => {
    switch (activeTab) {
      case "discipline":
        return disciplineData
      case "department":
        return departmentData
      case "level":
        return levelData
      default:
        return disciplineData
    }
  }

  // 获取当前颜色方案
  const getCurrentColors = () => {
    return COLORS[activeTab]
  }

  return (
    <div className="relative h-full">
      {/* 切换按钮组 - 右上角 */}
      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 text-sm font-normal",
            activeTab === "discipline" && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
          onClick={() => setActiveTab("discipline")}
        >
          按学科
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 text-sm font-normal",
            activeTab === "department" && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
          onClick={() => setActiveTab("department")}
        >
          按单位
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 text-sm font-normal",
            activeTab === "level" && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
          onClick={() => setActiveTab("level")}
        >
          按级别
        </Button>
      </div>

      {/* 图表区域 */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={getData()}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="75%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
          >
            {getData().map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getCurrentColors()[index % getCurrentColors().length]} 
                strokeWidth={1}
                stroke="#fff"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} 项`, "数量"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#1f2937" }}
            labelStyle={{ color: "#6b7280", marginBottom: "4px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 