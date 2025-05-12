"use client"

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

// 注册Chart.js组件
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

interface SerumConcentrationChartProps {
  title?: string
}

export function SerumConcentrationChart({ title = "实验药物血药浓度曲线" }: SerumConcentrationChartProps) {
  // 模拟血清药物浓度数据
  const data = {
    labels: ["0h", "0.5h", "1h", "2h", "4h", "6h", "8h", "12h", "24h", "48h"],
    datasets: [
      {
        label: "实验组",
        data: [0, 135, 248, 215, 180, 140, 110, 85, 65, 25],
        borderColor: "#3b82f6", // 蓝色
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "对照组",
        data: [0, 120, 210, 170, 125, 95, 75, 55, 30, 10],
        borderColor: "#64748b", // 灰色
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 5],
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
        display: !!title,
        text: title,
        font: {
          size: 14,
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
            return `${context.dataset.label}: ${context.parsed.y}ng/ml`
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "采样时间点",
          padding: { top: 10 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "血药浓度 (ng/ml)",
          padding: { bottom: 10 },
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + "ng/ml"
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  )
} 