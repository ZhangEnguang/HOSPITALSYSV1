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

export function ProjectFundingStatusChart() {
  const data = {
    labels: ["国家重点研发计划", "国家自然科学基金", "省部级项目", "横向项目", "校级项目"],
    datasets: [
      {
        label: "已到账",
        data: [1200, 800, 600, 900, 300],
        backgroundColor: CHART_COLORS.emerald,
        borderRadius: 4,
      },
      {
        label: "未到账",
        data: [800, 400, 400, 300, 200],
        backgroundColor: CHART_COLORS.azure,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "立项经费情况",
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
        stacked: true,
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
      <Bar data={data} options={options} />
    </div>
  )
} 