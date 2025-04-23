"use client"
import {
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { chartColors } from "../chart-colors"
import { mockData } from "../../mock-data"

export const annualTrendsChart = {
  id: "annual-trends",
  title: "项目&经费年度变化趋势",
  description: "近五年项目与经费变化",
  type: "line",
  icon: <TrendingUp className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    // 转换数据格式为Recharts所需格式
    const data = mockData.annualTrends.years.map((year, index) => ({
      year,
      项目数量: mockData.annualTrends.projects[index],
      经费总额: mockData.annualTrends.funding[index],
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="year" axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
          <RechartsTooltip
            formatter={(value, name) => [`${value.toLocaleString()} ${name === "项目数量" ? "个" : "万元"}`, name]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <RechartsLegend layout="horizontal" align="right" verticalAlign="top" />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="项目数量"
            fill="url(#colorGradientProjects)"
            stroke={chartColors.primary[0]}
            strokeWidth={2}
            animationDuration={1500}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="经费总额"
            stroke={chartColors.accent[0]}
            strokeWidth={3}
            dot={{ r: 5, fill: chartColors.accent[0] }}
            activeDot={{ r: 7 }}
            animationDuration={1500}
          />
          <defs>
            <linearGradient id="colorGradientProjects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.primary[0]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.primary[0]} stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    )
  },
}

