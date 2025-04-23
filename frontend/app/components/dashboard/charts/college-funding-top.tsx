import React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"
import { CHART_COLORS } from "./chart-configs"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function CollegeFundingTopChart() {
  const data = {
    labels: ["计算机学院", "机械学院", "电子学院", "化工学院", "材料学院", "生物学院", "环境学院", "医学院"],
    datasets: [
      {
        label: "科研经费（万元）",
        data: [3500, 3200, 2800, 2500, 2200, 2000, 1800, 1500],
        backgroundColor: [
          CHART_COLORS.red,
          CHART_COLORS.blue,
          CHART_COLORS.purple,
          CHART_COLORS.green,
          CHART_COLORS.yellow,
          CHART_COLORS.emerald,
          CHART_COLORS.azure,
          CHART_COLORS.violet,
        ],
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "学院科研经费TOP",
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
        display: false,
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
            return `科研经费: ${context.parsed.x}万元`
          }
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function(value) {
            return value + "万"
          },
        },
      },
      y: {
        grid: {
          display: false,
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