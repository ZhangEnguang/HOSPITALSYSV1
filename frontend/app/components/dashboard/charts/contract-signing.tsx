import React from "react"
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"
import { CHART_COLORS } from "./chart-configs"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

export function ContractSigningChart() {
  const data = {
    labels: ["科研项目", "技术服务", "成果转化", "咨询服务", "其他"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          CHART_COLORS.red,
          CHART_COLORS.blue,
          CHART_COLORS.purple,
          CHART_COLORS.green,
          CHART_COLORS.yellow,
        ],
        borderWidth: 0,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      title: {
        display: true,
        text: "合同签订情况",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        position: "right",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          generateLabels: (chart) => {
            const data = chart.data
            if (data.labels && data.datasets) {
              return data.labels.map((label, index) => ({
                text: `${label}: ${data.datasets[0].data[index]}%`,
                fillStyle: data.datasets[0].backgroundColor[index],
                strokeStyle: data.datasets[0].backgroundColor[index],
                index,
              }))
            }
            return []
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`
          }
        }
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Doughnut data={data} options={options} />
    </div>
  )
} 