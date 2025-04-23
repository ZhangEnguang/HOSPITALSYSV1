import React from "react"
import { Line } from "react-chartjs-2"
import { ChartOptions } from "chart.js"

export function MilestoneCompletionChart() {
  const data = {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
    datasets: [
      {
        label: "完成率",
        data: [30, 45, 60, 75, 85, 95],
        fill: true,
        backgroundColor: "rgba(55, 126, 255, 0.2)",
        borderColor: "rgb(55, 126, 255)",
        tension: 0.4,
        pointBackgroundColor: "rgb(55, 126, 255)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(55, 126, 255)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(this: any, value: string | number) {
            return value + "%"
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(55, 126, 255, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(55, 126, 255, 0.1)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `完成率: ${context.raw}%`;
          }
        }
      }
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Line data={data} options={options} />
    </div>
  )
} 