import React from "react"
import { Doughnut } from "react-chartjs-2"
import { ChartOptions } from "chart.js"

export function QualityMetricsChart() {
  const data = {
    labels: ["代码覆盖率", "Bug修复率", "文档完整度", "性能达标率"],
    datasets: [
      {
        data: [85, 92, 78, 88],
        backgroundColor: [
          "rgba(37, 99, 235, 0.5)",
          "rgba(59, 130, 246, 0.5)",
          "rgba(96, 165, 250, 0.5)",
          "rgba(147, 197, 253, 0.5)",
        ],
        borderColor: [
          "rgb(37, 99, 235)",
          "rgb(59, 130, 246)",
          "rgb(96, 165, 250)",
          "rgb(147, 197, 253)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function(this: any, context: any) {
            return `${context.label}: ${context.raw}%`
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Doughnut data={data} options={options} />
    </div>
  )
} 