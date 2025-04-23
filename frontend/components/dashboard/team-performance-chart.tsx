"use client"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const teamData = [
  { subject: "论文发表", 教授: 90, 副教授: 80, 讲师: 70, fullMark: 100 },
  { subject: "项目申报", 教授: 85, 副教授: 90, 讲师: 65, fullMark: 100 },
  { subject: "专利申请", 教授: 95, 副教授: 75, 讲师: 60, fullMark: 100 },
  { subject: "人才培养", 教授: 80, 副教授: 85, 讲师: 90, fullMark: 100 },
  { subject: "成果转化", 教授: 88, 副教授: 70, 讲师: 75, fullMark: 100 },
]

export default function TeamPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={teamData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="教授" dataKey="教授" stroke="#4361ee" fill="#4361ee" fillOpacity={0.6} animationDuration={1500} />
        <Radar
          name="副教授"
          dataKey="副教授"
          stroke="#3a0ca3"
          fill="#3a0ca3"
          fillOpacity={0.6}
          animationDuration={1500}
          animationBegin={300}
        />
        <Radar
          name="讲师"
          dataKey="讲师"
          stroke="#7209b7"
          fill="#7209b7"
          fillOpacity={0.6}
          animationDuration={1500}
          animationBegin={600}
        />
        <Tooltip
          formatter={(value) => [`${value}`, ""]}
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
      </RadarChart>
    </ResponsiveContainer>
  )
}

