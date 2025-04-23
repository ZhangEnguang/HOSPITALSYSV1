import React from "react"
import { Bar } from "react-chartjs-2"
import { ChartOptions } from "chart.js"

export function ProjectProgressChart() {
  const data = {
    labels: ["需求分析", "设计", "开发", "测试", "部署"],
    datasets: [
      {
        label: "完成度",
        data: [100, 80, 60, 30, 10],
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(this: any, value: string | number) {
            return value + "%"
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Bar data={data} options={options} />
    </div>
  )
} 