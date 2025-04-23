"use client"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts"
import { CreditCard } from "lucide-react"
import { chartColors } from "../chart-colors"
import { mockData } from "../../mock-data"

export const bankPaymentsChart = {
  id: "bank-payments",
  title: "银行来款情况",
  description: "银行到账资金统计",
  type: "line",
  icon: <CreditCard className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    // 转换数据格式为Recharts所需格式
    const data = mockData.bankPayments.months.map((month, index) => ({
      month,
      到账金额: mockData.bankPayments.data[index],
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <YAxis axisLine={false} tickLine={false} />
          <RechartsTooltip
            formatter={(value) => [`${value.toLocaleString()} 万元`, "到账金额"]}
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
            type="monotone"
            dataKey="到账金额"
            stroke={chartColors.primary[1]}
            strokeWidth={3}
            fill={`url(#colorGradient)`}
            activeDot={{ r: 8 }}
            animationDuration={1500}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.primary[1]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.primary[1]} stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    )
  },
}

