"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface DataItem {
  name: string
  value: number
}

// 模拟数据 - 科研项目状态分布
const mockData: DataItem[] = [
  { name: "已完成", value: 12 },
  { name: "进行中", value: 8 },
  { name: "待审核", value: 5 },
  { name: "已驳回", value: 2 }
]

// 指定颜色方案 - 与其他图表保持一致
const COLORS = ["#7275F2", "#8AD7FC", "#F97F7F", "#92F1B4"]

export default function ProjectStatusChart() {
  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={mockData}
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
            {mockData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
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