"use client"

import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Colors } from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors
)

interface LineChartProps {
  data: any[]
}

export default function LineChart({ data }: LineChartProps) {
  // 定义图表数据
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "论文",
        data: data.map((item) => item.论文),
        borderColor: "#246EFF",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: true,
        // 设置渐变填充
        backgroundColor: function(context: any) {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(36, 110, 255, 0.4)");
          gradient.addColorStop(1, "rgba(36, 110, 255, 0.05)");
          return gradient;
        }
      },
      {
        label: "专利",
        data: data.map((item) => item.专利),
        borderColor: "#00B2FF",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: true,
        // 设置渐变填充
        backgroundColor: function(context: any) {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(0, 178, 255, 0.4)");
          gradient.addColorStop(1, "rgba(0, 178, 255, 0.05)");
          return gradient;
        }
      },
      {
        label: "软著",
        data: data.map((item) => item.软著),
        borderColor: "#17D1FF",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: true,
        // 设置渐变填充
        backgroundColor: function(context: any) {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(23, 209, 255, 0.4)");
          gradient.addColorStop(1, "rgba(23, 209, 255, 0.05)");
          return gradient;
        }
      }
    ]
  }

  // 定义图表选项
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(tooltipItems: any) {
            return tooltipItems[0].label + '数据';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    elements: {
      line: {
        // 使线条更平滑
        tension: 0.4
      }
    }
  }

  return <Line data={chartData} options={options} />
}

