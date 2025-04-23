"use client"
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from "recharts"

const achievementData = [
  { year: "2019", 论文: 25, 专利: 8, 奖项: 3, 著作: 5, 总量: 41 },
  { year: "2020", 论文: 30, 专利: 10, 奖项: 4, 著作: 6, 总量: 50 },
  { year: "2021", 论文: 35, 专利: 12, 奖项: 5, 著作: 7, 总量: 59 },
  { year: "2022", 论文: 40, 专利: 15, 奖项: 6, 著作: 8, 总量: 69 },
  { year: "2023", 论文: 45, 专利: 18, 奖项: 7, 著作: 10, 总量: 80 },
]

export default function AchievementSummaryChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={achievementData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" />
        <YAxis yAxisId="left" orientation="left" label={{ value: "数量 (项)", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value, name) => [`${value} 项`, name]}
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
          itemStyle={{ color: "#fff" }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="论文" fill="#4361ee" stackId="a" barSize={30} />
        <Bar yAxisId="left" dataKey="专利" fill="#3a0ca3" stackId="a" barSize={30} />
        <Bar yAxisId="left" dataKey="奖项" fill="#7209b7" stackId="a" barSize={30} />
        <Bar yAxisId="left" dataKey="著作" fill="#f72585" stackId="a" barSize={30} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="总量"
          stroke="#fb8500"
          strokeWidth={3}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
        />
        <ReferenceLine yAxisId="left" y={60} stroke="#fb8500" strokeDasharray="3 3" label="平均值" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

