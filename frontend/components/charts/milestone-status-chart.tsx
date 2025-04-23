"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

// 注册必要的组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface MilestoneData {
  name: string
  正常完成: number
  延期完成: number
  超期完成: number
}

const mockData: MilestoneData[] = [
  {
    name: "立项阶段",
    正常完成: 42,
    延期完成: 8,
    超期完成: 2,
  },
  {
    name: "中期检查",
    正常完成: 36,
    延期完成: 12,
    超期完成: 4,
  },
  {
    name: "成果产出",
    正常完成: 30,
    延期完成: 15,
    超期完成: 7,
  },
  {
    name: "结题验收",
    正常完成: 28,
    延期完成: 18,
    超期完成: 6,
  },
  {
    name: "成果转化",
    正常完成: 22,
    延期完成: 14,
    超期完成: 8,
  },
]

export default function MilestoneStatusChart() {
  const data = {
    labels: mockData.map(item => item.name),
    datasets: [
      {
        label: "正常完成",
        data: mockData.map(item => item.正常完成),
        backgroundColor: "#22c55e",
        borderColor: "#ffffff",
        borderWidth: 1,
      },
      {
        label: "延期完成",
        data: mockData.map(item => item.延期完成),
        backgroundColor: "#f59e0b",
        borderColor: "#ffffff",
        borderWidth: 1,
      },
      {
        label: "超期完成",
        data: mockData.map(item => item.超期完成),
        backgroundColor: "#ef4444",
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          color: "#e2e8f0",
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} 个项目`
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Bar data={data} options={options} />
    </div>
  )
} 