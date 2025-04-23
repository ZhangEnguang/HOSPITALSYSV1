"use client"
import {
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts"
import { DollarSign } from "lucide-react"
import { chartColors } from "../chart-colors"
import { mockData } from "../../mock-data"
import ReactECharts from "echarts-for-react"
import * as echarts from "echarts/core"

export const fundingReceiptChart = {
  id: "funding-receipt",
  title: "经费入账情况",
  description: "近期经费入账统计",
  type: "bar",
  icon: <DollarSign className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    // 转换数据格式为Recharts所需格式
    const data = mockData.fundingReceipt.categories.map((month, index) => ({
      month,
      纵向项目: mockData.fundingReceipt.series[0].data[index],
      横向项目: mockData.fundingReceipt.series[1].data[index],
      校级项目: mockData.fundingReceipt.series[2].data[index],
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
          <YAxis name="金额 (万元)" axisLine={false} tickLine={false} />
          <RechartsTooltip
            formatter={(value, name) => [`${value.toLocaleString()} 万元`, name]}
            labelFormatter={(label) => label}
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
          <Bar
            dataKey="纵向项目"
            stackId="a"
            fill={chartColors.primary[0]}
            radius={[0, 0, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="横向项目"
            stackId="a"
            fill={chartColors.primary[1]}
            radius={[0, 0, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="校级项目"
            stackId="a"
            fill={chartColors.primary[2]}
            radius={[0, 0, 0, 0]}
            animationDuration={1500}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    )
  },
}

// 将经费入账情况的渐变改为主题色渐变
export const renderFundingReceiptChart = () => {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "金额 (万元)",
    },
    series: [
      {
        name: "经费入账",
        type: "bar",
        barWidth: "60%",
        data: [120, 200, 150, 80, 70, 110, 130, 165, 145, 180, 210, 190],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "var(--primary)" },
            { offset: 1, color: "rgba(var(--primary-rgb), 0.3)" },
          ]),
        },
      },
    ],
  }

  return <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
}

