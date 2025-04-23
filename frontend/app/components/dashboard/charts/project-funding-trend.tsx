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
  Legend
)

export function ProjectFundingTrendChart() {
  const data = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "项目数量",
        data: [45, 52, 60, 65, 75],
        borderColor: CHART_COLORS.purple,
        backgroundColor: "transparent",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "经费金额",
        data: [1200, 1500, 1800, 2200, 2800],
        borderColor: CHART_COLORS.blue,
        backgroundColor: "transparent",
        tension: 0.4,
        yAxisID: "y1",
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
        text: "项目&经费年度变化趋势",
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
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += context.dataset.yAxisID === "y" 
                ? context.parsed.y + "个" 
                : context.parsed.y + "万元"
            }
            return label
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
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "项目数量（个）",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "经费金额（万元）",
        },
        grid: {
          drawOnChartArea: false,
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