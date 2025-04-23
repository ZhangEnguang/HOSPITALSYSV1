import React from "react"
import { Radar } from "react-chartjs-2"
import { ChartOptions } from "chart.js"

export function TeamWorkloadChart() {
  const data = {
    labels: ["需求分析", "设计", "开发", "测试", "文档"],
    datasets: [
      {
        label: "当前工作量",
        data: [80, 60, 90, 70, 50],
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,
      },
      {
        label: "标准工作量",
        data: [70, 70, 70, 70, 70],
        backgroundColor: "rgba(100, 116, 139, 0.2)",
        borderColor: "rgb(100, 116, 139)",
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Radar data={data} options={options} />
    </div>
  )
} 