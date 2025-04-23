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

// 颜色配置
const COLORS = [
  "#4361ee",
  "#3a0ca3",
  "#7209b7",
  "#f72585",
  "#fb8500",
  "#06d6a0",
  "#118ab2",
]

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
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {getData().map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} 项`, "数量"]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 