"use client"
import {
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Award } from "lucide-react"
import { chartColors } from "../chart-colors"
import { mockData } from "../../mock-data"

export const collegeTop5Chart = {
  id: "college-top5",
  title: "学院科研经费TOP 5",
  description: "按立项经费排名",
  type: "bar",
  icon: <Award className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    // 转换数据格式为Recharts所需格式
    const data = mockData.collegeTop5.colleges.map((college, index) => ({
      college,
      经费: mockData.collegeTop5.data[index],
    }))

    // 颜色渐变定义
    const gradientColors = [
      [chartColors.primary[0], chartColors.primary[1]],
      [chartColors.primary[1], chartColors.primary[2]],
      [chartColors.primary[2], chartColors.primary[3]],
      [chartColors.primary[3], chartColors.primary[4]],
      [chartColors.accent[0], chartColors.accent[1]],
    ]

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.1)" />
          <XAxis
            type="number"
            label={{ value: "金额 (万元)", position: "insideBottom", offset: -5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis type="category" dataKey="college" width={100} axisLine={false} tickLine={false} />
          <RechartsTooltip
            formatter={(value) => [`${value.toLocaleString()} 万元`, "经费"]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar
            dataKey="经费"
            animationDuration={1500}
            label={{ position: "right", formatter: (value) => `${value} 万元` }}
            radius={[0, 4, 4, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
            ))}
          </Bar>
          <defs>
            {gradientColors.map((colors, index) => (
              <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colors[0]} />
                <stop offset="100%" stopColor={colors[1]} />
              </linearGradient>
            ))}
          </defs>
        </RechartsBarChart>
      </ResponsiveContainer>
    )
  },
}

