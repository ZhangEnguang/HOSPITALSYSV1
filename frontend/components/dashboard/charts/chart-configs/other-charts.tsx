"use client"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  ReferenceLine,
} from "recharts"
import { BarChart3, PieChart, BarChart, Activity } from "lucide-react"
import { chartColors } from "../chart-colors"
import { mockData } from "../../mock-data"

// 立项经费情况图表
export const projectFundingChart = {
  id: "project-funding",
  title: "立项经费情况",
  description: "各类项目立项经费统计",
  type: "pie",
  icon: <BarChart3 className="h-4 w-4" />,
  size: "medium",

  renderChart: () => {
    const data = mockData.projectFunding.map((item) => ({
      name: item.name,
      value: item.value,
    }))

    // 使用不同的颜色方案
    const COLORS = chartColors.primary

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            outerRadius="70%"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value} 万元`}
            labelLine={true}
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [`${value.toLocaleString()} 万元`, name]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <RechartsLegend layout="vertical" verticalAlign="middle" align="right" />
        </RechartsPieChart>
      </ResponsiveContainer>
    )
  },
}

// 经费类型分布图表
export const fundingByTypeChart = {
  id: "funding-by-type",
  title: "经费类型分布",
  description: "不同类型经费占比",
  type: "pie",
  icon: <PieChart className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    const data = mockData.fundingByType.map((item) => ({
      name: item.name,
      value: item.value,
    }))

    // 使用不同的颜色方案
    const COLORS = chartColors.secondary

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <RechartsLegend layout="vertical" verticalAlign="middle" align="right" />
        </RechartsPieChart>
      </ResponsiveContainer>
    )
  },
}

// 月度经费对比图表
export const monthlyComparisonChart = {
  id: "monthly-comparison",
  title: "月度经费对比",
  description: "本年度各月经费对比",
  type: "bar",
  icon: <BarChart className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    // 转换数据格式为Recharts所需格式
    const data = mockData.monthlyComparison.months.map((month, index) => ({
      month,
      "2024年": mockData.monthlyComparison.currentYear[index],
      "2023年": mockData.monthlyComparison.lastYear[index],
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            label={{ value: "金额 (万元)", angle: -90, position: "insideLeft" }}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            formatter={(value, name) => [`${value.toLocaleString()} 万元`, name]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <RechartsLegend />
          <Bar dataKey="2024年" fill="url(#colorGradient2024)" radius={[4, 4, 0, 0]} animationDuration={1500} />
          <Bar
            dataKey="2023年"
            fill="url(#colorGradient2023)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
          <defs>
            <linearGradient id="colorGradient2024" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary[0]} />
              <stop offset="100%" stopColor={chartColors.primary[1]} />
            </linearGradient>
            <linearGradient id="colorGradient2023" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a5a5a5" />
              <stop offset="100%" stopColor="#d3d3d3" />
            </linearGradient>
          </defs>
        </RechartsBarChart>
      </ResponsiveContainer>
    )
  },
}

// 项目完成情况图表
export const projectCompletionChart = {
  id: "project-completion",
  title: "项目完成情况",
  description: "项目完成率统计",
  type: "line",
  icon: <Activity className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    // 转换数据格式为Recharts所需格式
    const data = mockData.projectCompletion.quarters.map((quarter, index) => ({
      quarter,
      计划项目: mockData.projectCompletion.planned[index],
      完成项目: mockData.projectCompletion.completed[index],
      完成率: mockData.projectCompletion.completionRate[index],
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
          <XAxis dataKey="quarter" axisLine={false} tickLine={false} />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{ value: "项目数量 (个)", angle: -90, position: "insideLeft" }}
            domain={[0, 50]}
            ticks={[0, 10, 20, 30, 40, 50]}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "完成率 (%)", angle: 90, position: "insideRight" }}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            formatter={(value, name) => [`${value.toLocaleString()} ${name === "完成率" ? "%" : "个"}`, name]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <RechartsLegend />
          <Bar
            yAxisId="left"
            dataKey="计划项目"
            fill="url(#colorGradientPlanned)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            yAxisId="left"
            dataKey="完成项目"
            fill="url(#colorGradientCompleted)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="完成率"
            stroke={chartColors.accent[0]}
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
            animationDuration={1500}
            animationBegin={600}
          />
          <ReferenceLine yAxisId="right" y={90} stroke={chartColors.accent[0]} strokeDasharray="3 3" label="平均值" />
          <defs>
            <linearGradient id="colorGradientPlanned" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary[0]} />
              <stop offset="100%" stopColor={chartColors.primary[1]} />
            </linearGradient>
            <linearGradient id="colorGradientCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary[2]} />
              <stop offset="100%" stopColor={chartColors.primary[3]} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    )
  },
}

