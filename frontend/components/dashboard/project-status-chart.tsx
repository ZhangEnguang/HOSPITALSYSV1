"use client"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const projectTypeData = [
  { name: "基础研究", value: 5 },
  { name: "应用研究", value: 4 },
  { name: "技术开发", value: 3 },
  { name: "成果转化", value: 2 },
  { name: "其他类型", value: 2 },
]

const projectLevelData = [
  { name: "国家级", value: 3 },
  { name: "省部级", value: 5 },
  { name: "市厅级", value: 4 },
  { name: "校级", value: 4 },
]

const TYPE_COLORS = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#fb8500"]
const LEVEL_COLORS = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"]

export default function ProjectStatusChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={projectTypeData}
          cx="30%"
          cy="50%"
          innerRadius={0}
          outerRadius="70%"
          paddingAngle={0}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={true}
          animationDuration={1500}
        >
          {projectTypeData.map((entry, index) => (
            <Cell key={`cell-type-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
          ))}
        </Pie>
        <Pie
          data={projectLevelData}
          cx="70%"
          cy="50%"
          innerRadius="40%"
          outerRadius="70%"
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name}: ${value}个`}
          labelLine={true}
          animationDuration={1500}
          animationBegin={300}
        >
          {projectLevelData.map((entry, index) => (
            <Cell key={`cell-level-${index}`} fill={LEVEL_COLORS[index % LEVEL_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`${value} 个`, name]}
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
          itemStyle={{ color: "#fff" }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend
          payload={[
            ...projectTypeData.map((item, index) => ({
              value: item.name,
              type: "square",
              color: TYPE_COLORS[index % TYPE_COLORS.length],
            })),
            ...projectLevelData.map((item, index) => ({
              value: item.name,
              type: "square",
              color: LEVEL_COLORS[index % LEVEL_COLORS.length],
            })),
          ]}
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

