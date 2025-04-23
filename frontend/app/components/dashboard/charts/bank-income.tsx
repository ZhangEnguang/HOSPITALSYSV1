import React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js"
import { CHART_COLORS } from "./chart-configs"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function BankIncomeChart() {
  const data = {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    datasets: [
      {
        label: "本年度",
        data: [500, 650, 750, 800, 950, 1100, 1300, 1450, 1600, 1800, 2000, 2200],
        borderColor: CHART_COLORS.emerald,
        backgroundColor: `${CHART_COLORS.emerald}20`,
        fill: true,
        tension: 0.4,
      },
      {
        label: "上年度",
        data: [400, 550, 650, 700, 850, 950, 1100, 1250, 1400, 1550, 1700, 1850],
        borderColor: CHART_COLORS.azure,
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: "银行来款情况",
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
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
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
            return `${context.dataset.label}: ${context.parsed.y}万元`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + "万"
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Line data={data} options={options} />
    </div>
  )
} 