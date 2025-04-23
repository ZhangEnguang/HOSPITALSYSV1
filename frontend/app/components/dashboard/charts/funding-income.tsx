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

export function FundingIncomeChart() {
  const data = {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    datasets: [
      {
        label: "横向经费",
        data: [150, 200, 180, 250, 300, 280, 220, 190, 270, 310, 280, 320],
        backgroundColor: CHART_COLORS.red,
        stack: "stack1",
      },
      {
        label: "纵向经费",
        data: [280, 250, 300, 320, 280, 350, 300, 270, 310, 330, 360, 400],
        backgroundColor: CHART_COLORS.blue,
        stack: "stack1",
      },
      {
        label: "其他经费",
        data: [100, 120, 90, 150, 130, 140, 160, 140, 120, 150, 170, 180],
        backgroundColor: CHART_COLORS.purple,
        stack: "stack1",
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "经费入账情况",
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
        align: "center",
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
      <Bar data={data} options={options} />
    </div>
  )
} 