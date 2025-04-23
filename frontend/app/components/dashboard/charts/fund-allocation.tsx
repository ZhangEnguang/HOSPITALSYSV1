import React from "react"
import { Pie } from "react-chartjs-2"

export function FundAllocationChart() {
  const data = {
    labels: ["研发", "设备", "人力", "运营", "其他"],
    datasets: [
      {
        data: [40, 25, 20, 10, 5],
        backgroundColor: [
          "rgba(37, 99, 235, 0.5)",
          "rgba(59, 130, 246, 0.5)",
          "rgba(96, 165, 250, 0.5)",
          "rgba(147, 197, 253, 0.5)",
          "rgba(191, 219, 254, 0.5)",
        ],
        borderColor: [
          "rgb(37, 99, 235)",
          "rgb(59, 130, 246)",
          "rgb(96, 165, 250)",
          "rgb(147, 197, 253)",
          "rgb(191, 219, 254)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return (
    <div className="h-full w-full">
      <Pie data={data} options={options} />
    </div>
  )
} 