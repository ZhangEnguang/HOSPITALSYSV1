import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

const data = {
  labels: ['高优先级', '中优先级', '低优先级'],
  datasets: [
    {
      data: [35, 45, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(75, 192, 192, 0.5)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
      ],
      borderWidth: 1,
    },
  ],
}

export function TaskPriorityChart() {
  return (
    <div className="h-[300px]">
      <Pie options={options} data={data} />
    </div>
  )
} 